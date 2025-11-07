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
import { CorporateContractForm, type CorporateContract } from '@/components/forms/corporate-contract-form';


const initialContracts: CorporateContract[] = [
  {
    id: 'CORP-001',
    companyName: 'Globex Corporation',
    contractId: 'GLX-2024',
    status: 'Active',
    activeFares: 12,
    administrator: 'Alice Johnson',
  },
  {
    id: 'CORP-002',
    companyName: 'Stark Industries',
    contractId: 'STRK-2023',
    status: 'Active',
    activeFares: 8,
    administrator: 'Bob Williams',
  },
  {
    id: 'CORP-003',
    companyName: 'Wayne Enterprises',
    contractId: 'WYN-2025',
    status: 'Negotiation',
    activeFares: 0,
    administrator: 'Charlie Brown',
  },
  {
    id: 'CORP-004',
    companyName: 'Cyberdyne Systems',
    contractId: 'CYD-2022',
    status: 'Expired',
    activeFares: 0,
    administrator: 'Diana Prince',
  },
];

export default function CorporatePage() {
  const [contracts, setContracts] = useState<CorporateContract[]>(initialContracts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<CorporateContract | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (contract: CorporateContract | null = null) => {
    setEditingContract(contract);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingContract(null);
  };

  const handleFormSubmit = (data: CorporateContract) => {
    if (editingContract) {
      setContracts(contracts.map((c) => (c.id === editingContract.id ? { ...c, ...data } : c)));
      toast({ title: "Contract Updated", description: `Contract for ${data.companyName} has been updated.` });
    } else {
      const newContract = { ...data, id: `CORP-${String(contracts.length + 1).padStart(3, '0')}` };
      setContracts([newContract, ...contracts]);
      toast({ title: "Contract Created", description: `New contract for ${newContract.companyName} has been created.` });
    }
    handleDialogClose();
  };

  const getStatusBadgeVariant = (status: CorporateContract['status']) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Negotiation':
        return 'secondary';
      case 'Expired':
        return 'outline';
    }
  };

  return (
    <>
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Corporate Contracts
          </h1>
          <p className="text-muted-foreground">
            Define and manage fare privileges for corporate customers.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2" />
          New Contract
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Corporate Agreements</CardTitle>
          <CardDescription>
            Manage all active and pending corporate travel agreements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Contract ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active Fares</TableHead>
                <TableHead>Administrator</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">
                    {contract.companyName}
                  </TableCell>
                  <TableCell>{contract.contractId}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(contract.status)}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{contract.activeFares}</TableCell>
                  <TableCell>{contract.administrator}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog(contract)}>Edit Contract</DropdownMenuItem>
                        <DropdownMenuItem>Manage Privileges</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingContract ? 'Edit Corporate Contract' : 'Create New Corporate Contract'}</DialogTitle>
          <DialogDescription>
            {editingContract ? `Editing contract for ${editingContract.companyName}.` : 'Enter the details for the new corporate agreement.'}
          </DialogDescription>
        </DialogHeader>
        <CorporateContractForm
          contract={editingContract}
          onSubmit={handleFormSubmit}
          onCancel={handleDialogClose}
        />
      </DialogContent>
    </Dialog>
    </>
  );
}
