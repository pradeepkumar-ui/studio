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
import { CapacityPolicyForm, type CapacityPolicy } from '@/components/forms/capacity-policy-form';
import { Progress } from '@/components/ui/progress';


const initialPolicies: (CapacityPolicy & { utilization: number, state: 'Active' | 'Soft-Stop' | 'Stop-Sell', caps: string, quotas: string, pacing: string })[] = [
  { 
    id: 'CP-001',
    offerId: 'BUN-006',
    offerName: 'Flexi Traveler',
    caps: '1,200 Offers, 400 Accepted', 
    quotas: 'Direct 60% / OTA 40%', 
    pacing: '60/min', 
    status: 'Published',
    utilization: 87,
    state: 'Soft-Stop'
  },
  { 
    id: 'CP-002',
    offerId: 'BUN-001',
    offerName: 'Business Saver+',
    caps: '500 Offers', 
    quotas: 'N/A', 
    pacing: '100/min', 
    status: 'Published',
    utilization: 100,
    state: 'Stop-Sell'
  },
  { 
    id: 'CP-003',
    offerId: 'BUN-007',
    offerName: 'Holiday Special',
    caps: '5,000 Offers', 
    quotas: 'N/A', 
    pacing: '300/min', 
    status: 'Published',
    utilization: 45,
    state: 'Active'
  },
   { 
    id: 'CP-004', 
    offerId: 'BUN-002',
    offerName: 'Family Pack',
    caps: '10,000 Offers', 
    quotas: 'N/A', 
    pacing: 'N/A', 
    status: 'Draft',
    utilization: 0,
    state: 'Active'
  },
];

export function CapacityPolicies() {
  const [policies, setPolicies] = useState(initialPolicies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<typeof initialPolicies[0] | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (policy: typeof initialPolicies[0] | null = null) => {
    setEditingPolicy(policy);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPolicy(null);
  };
  
  const handleFormSubmit = (data: any) => {
    let state: 'Active' | 'Soft-Stop' | 'Stop-Sell' = 'Active';
    const utilization = Math.floor(Math.random() * 101);
    if(utilization > 95) {
      state = 'Stop-Sell';
    } else if (utilization > 85) {
      state = 'Soft-Stop';
    }

    if (editingPolicy) {
      setPolicies(policies.map((p) => (p.id === editingPolicy.id ? { ...editingPolicy, ...data, state, utilization: p.utilization } : p)));
      toast({ title: 'Policy Updated' });
    } else {
      const newPolicy = { ...data, id: `CP-00${policies.length + 1}`, state: 'Active' as const, utilization: 0 };
      setPolicies([newPolicy, ...policies]);
      toast({ title: 'Policy Created' });
    }
    handleDialogClose();
  };
  
  const getStateBadgeVariant = (state: string) => {
    switch (state) {
      case 'Active': return 'default';
      case 'Soft-Stop': return 'secondary';
      case 'Stop-Sell': return 'destructive';
      default: return 'outline';
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Capacity Policies</CardTitle>
            <CardDescription>
              Manage rules for Offer caps, quotas, pacing, and stop-sells.
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
                <TableHead className="w-[25%]">Target Offer</TableHead>
                <TableHead>Caps</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>State</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.offerName}</TableCell>
                  <TableCell>{policy.caps}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Progress value={policy.utilization} className="h-2"/>
                        <span className="text-xs text-muted-foreground">{policy.utilization}%</span>
                    </div>
                  </TableCell>
                   <TableCell>
                    <Badge variant={getStateBadgeVariant(policy.state)}>
                      {policy.state}
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
                        <DropdownMenuItem>Simulate Impact</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingPolicy ? 'Edit Capacity Policy' : 'Create New Capacity Policy'}</DialogTitle>
            <DialogDescription>
              {editingPolicy ? 'Editing an existing capacity policy.' : 'Define a new rule for Offer caps, quotas, or pacing.'}
            </DialogDescription>
          </DialogHeader>
          <CapacityPolicyForm
            policy={editingPolicy}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
