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
import { PolicyPackForm, type PolicyPack } from '@/components/forms/policy-pack-form';

const initialPolicyPacks: PolicyPack[] = [
  {
    id: 'pp-018',
    name: 'Policy Pack v18',
    status: 'Published',
    ruleCount: 128,
    createdBy: 'System Admin',
    publishedAt: new Date('2025-10-27T10:00:00Z'),
  },
  {
    id: 'pp-019',
    name: 'Policy Pack v19 (Q4 Update)',
    status: 'Draft',
    ruleCount: 135,
    createdBy: 'Compliance Officer',
    publishedAt: null,
  },
  {
    id: 'pp-017',
    name: 'Policy Pack v17',
    status: 'Archived',
    ruleCount: 125,
    createdBy: 'System Admin',
    publishedAt: new Date('2025-07-01T12:00:00Z'),
  },
];

export function PolicyPacks() {
  const [packs, setPacks] = useState<PolicyPack[]>(initialPolicyPacks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<PolicyPack | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (pack: PolicyPack | null = null) => {
    setEditingPack(pack);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPack(null);
  };

  const handleFormSubmit = (data: PolicyPack) => {
    if (editingPack) {
      setPacks(packs.map((p) => (p.id === editingPack.id ? { ...p, ...data } : p)));
      toast({ title: 'Policy Pack Updated' });
    } else {
      const newPack = { ...data, id: `pp-${String(packs.length + 20).padStart(3, '0')}`, ruleCount: 0, createdBy: 'Compliance Officer', publishedAt: null };
      setPacks([newPack, ...packs]);
      toast({ title: 'Policy Pack Created' });
    }
    handleDialogClose();
  };

  const getStatusBadgeVariant = (status: PolicyPack['status']) => {
    switch (status) {
      case 'Published': return 'default';
      case 'Draft': return 'secondary';
      case 'Archived': return 'outline';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Policy Packs</CardTitle>
            <CardDescription>
              Manage versioned collections of compliance rules.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            Create Pack
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pack Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rules</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Published At</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packs.map((pack) => (
                <TableRow key={pack.id}>
                  <TableCell className="font-medium">{pack.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(pack.status)}>
                      {pack.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{pack.ruleCount}</TableCell>
                  <TableCell>{pack.createdBy}</TableCell>
                  <TableCell>{pack.publishedAt ? pack.publishedAt.toLocaleDateString() : 'N/A'}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenDialog(pack)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuItem>Rollback to this version</DropdownMenuItem>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPack ? 'Edit Policy Pack' : 'Create New Policy Pack'}</DialogTitle>
            <DialogDescription>
              {editingPack ? `Editing pack "${editingPack.name}".` : 'Define a new collection of compliance rules.'}
            </DialogDescription>
          </DialogHeader>
          <PolicyPackForm
            pack={editingPack}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
