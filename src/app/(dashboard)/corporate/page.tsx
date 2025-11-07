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
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CorporateContractForm, type CorporateContract } from '@/components/forms/corporate-contract-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';


export default function CorporatePage() {
  const firestore = useFirestore();
  const { data: contracts, loading, error } = useCollection(firestore ? collection(firestore, 'corporateContracts') : undefined);

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

  const handleFormSubmit = async (data: CorporateContract) => {
    if (!firestore) return;

    try {
      if (editingContract?.id) {
        const contractRef = doc(firestore, 'corporateContracts', editingContract.id);
        await setDoc(contractRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: "Contract Updated", description: `Contract for ${data.companyName} has been updated.` });
      } else {
        await addDoc(collection(firestore, 'corporateContracts'), { ...data, createdAt: serverTimestamp() });
        toast({ title: "Contract Created", description: `New contract for ${data.companyName} has been created.` });
      }
    } catch (e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "There was a problem with your request.",
        });
    }
    handleDialogClose();
  };

  const handleDelete = async (contractId: string) => {
    if (!contractId || !firestore) return;
    try {
        await deleteDoc(doc(firestore, 'corporateContracts', contractId));
        toast({
            variant: 'destructive',
            title: 'Contract Deleted',
            description: 'The contract has been successfully deleted.'
        });
    } catch (e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "Could not delete the contract.",
        });
    }
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
          {loading && (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && !error && contracts && (
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
                           <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(contract.id!)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {error && <p className="text-destructive">Error loading contracts: {error.message}</p>}
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
