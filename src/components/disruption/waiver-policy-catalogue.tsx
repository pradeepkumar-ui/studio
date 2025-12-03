'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { WaiverPolicyForm, type WaiverPolicy } from '@/components/forms/waiver-policy-form';

const initialPolicies: WaiverPolicy[] = [
  {
    id: 'WXP-GEN-WEATHER',
    name: 'General Weather Waiver',
    eventType: 'Weather',
    routes: 'All',
    rulesWaived: ['change_fee', 'no_show_penalty'],
    fareDifferencePolicy: 'Match or Lower',
    priority: 'Waiver First',
    status: 'Published',
  },
  {
    id: 'WXP-SC-MAJOR',
    name: 'Major Schedule Change (>4h)',
    eventType: 'Schedule Change',
    routes: 'All',
    rulesWaived: ['change_fee', 'refund_penalty'],
    fareDifferencePolicy: 'None',
    priority: 'Waiver First',
    status: 'Published',
  },
  {
    id: 'WXP-CX-DOM',
    name: 'Domestic Cancellation',
    eventType: 'Cancellation',
    routes: 'Domestic',
    rulesWaived: ['change_fee'],
    fareDifferencePolicy: 'Cap at 100 USD',
    priority: 'Standard Rules',
    status: 'Approved',
  },
  {
    id: 'WXP-DRAFT-01',
    name: 'International Overbooking',
    eventType: 'Overbooking',
    routes: 'International',
    rulesWaived: ['change_fee'],
    fareDifferencePolicy: 'None',
    priority: 'Standard Rules',
    status: 'Draft',
  },
];

export function WaiverPolicyCatalogue() {
  const [policies, setPolicies] = useState<WaiverPolicy[]>(initialPolicies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<WaiverPolicy | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (policy: WaiverPolicy | null = null) => {
    setEditingPolicy(policy);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPolicy(null);
  };

  const handleFormSubmit = (data: WaiverPolicy) => {
    if (editingPolicy) {
      setPolicies(policies.map((p) => (p.id === editingPolicy.id ? { ...p, ...data } : p)));
      toast({ title: 'Policy Updated' });
    } else {
      const newPolicy = { ...data, id: `WXP-DRAFT-${policies.length}`};
      setPolicies([newPolicy, ...policies]);
      toast({ title: 'Policy Created' });
    }
    handleDialogClose();
  };

  const getStatusBadgeVariant = (status: WaiverPolicy['status']) => {
    switch (status) {
      case 'Published': return 'default';
      case 'Approved': return 'secondary';
      case 'Draft': return 'outline';
      case 'Archived': return 'destructive'
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Waiver Policy Catalogue</CardTitle>
            <CardDescription>
              Create and manage reusable templates for disruption waivers.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            Create Policy
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy Name</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{policy.eventType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(policy.status)}>
                      {policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.priority === 'Waiver First' ? 'default' : 'outline'}>
                        {policy.priority === 'Waiver First' ? 'Waiver First' : 'Standard'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog(policy)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPolicy ? 'Edit Waiver Policy' : 'Create New Waiver Policy'}</DialogTitle>
            <DialogDescription>
              {editingPolicy ? `Editing policy "${editingPolicy.name}".` : 'Define a new waiver policy template.'}
            </DialogDescription>
          </DialogHeader>
          <WaiverPolicyForm
            policy={editingPolicy}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
