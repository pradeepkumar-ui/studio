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
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { NsaForm, type NegotiatedSpaceAgreement } from '@/components/forms/nsa-form';
import { Input } from '@/components/ui/input';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const mockAgreements: NegotiatedSpaceAgreement[] = [
    { id: 'NSA-001', code: 'NSA-TA-2025', partnerId: 'TOUR-ALPHA', scope: { route: 'SZX-BOM', season: '2025-Q1', dow: 'Sat out, Wed in' }, pricing: { currency: 'INR', baseFareRange: '8999-9499', commission: '8%' }, status: 'Published', capacity: 30, rbd: 'Q,N,V', brand: 'Value,Flex', deadlines: { release: 'D-30, D-14', name: 'D-14', issue: 'D-7' }, finance: { deposit: '10% deposit at contract', penalties: 'Attrition penalties apply' } },
    { id: 'NSA-002', code: 'NSA-CORP-B-25', partnerId: 'CORP-BRAVO', scope: { route: 'LHR-JFK', season: '2025', dow: 'Daily' }, pricing: { currency: 'USD', baseFareRange: 'N/A', commission: '12%' }, status: 'Published', capacity: 10, rbd: 'J,C', brand: 'Business', deadlines: { release: 'D-7', name: 'D-7', issue: 'D-2' }, finance: { deposit: 'Net 30', penalties: 'None' } },
    { id: 'NSA-003', code: 'NSA-TOUR-C-24', partnerId: 'TOUR-CHARLIE', scope: { route: 'US-DOM', season: '2024-H2', dow: 'Daily' }, pricing: { currency: 'USD', baseFareRange: 'N/A', commission: '5%' }, status: 'Expired', capacity: 50, rbd: 'Y,B,M', brand: 'Economy', deadlines: { release: 'D-45', name: 'D-45', issue: 'D-15' }, finance: { deposit: '5% deposit', penalties: 'Standard' } },
];

export default function NsaPage() {
  const firestore = useFirestore();
  const { data: agreementsCollection, loading, error } = useCollection(firestore ? collection(firestore, 'negotiatedSpaceAgreements') : undefined);
  
  const agreements = agreementsCollection ? agreementsCollection as NegotiatedSpaceAgreement[] : [];
  const displayAgreements = agreements.length > 0 ? agreements : mockAgreements;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNsa, setEditingNsa] = useState<NegotiatedSpaceAgreement | null>(null);
  const [filters, setFilters] = useState({ code: '', partnerId: '' });
  const { toast } = useToast();

  const handleOpenDialog = (nsa: NegotiatedSpaceAgreement | null = null) => {
    setEditingNsa(nsa);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingNsa(null);
  };

  const handleFormSubmit = async (data: NegotiatedSpaceAgreement) => {
    if (!firestore) return;
    try {
      if (editingNsa?.id) {
        const nsaRef = doc(firestore, 'negotiatedSpaceAgreements', editingNsa.id);
        await setDoc(nsaRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Agreement Updated', description: `NSA "${data.code}" has been successfully updated.` });
      } else {
        await addDoc(collection(firestore, 'negotiatedSpaceAgreements'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'Agreement Created', description: `NSA "${data.code}" has been successfully created.` });
      }
    } catch(e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "There was a problem with your request.",
        });
    }
    handleDialogClose();
  };

  const handleDelete = async (nsaId: string) => {
    if (!nsaId || !firestore) return;
    try {
      await deleteDoc(doc(firestore, 'negotiatedSpaceAgreements', nsaId));
      toast({
        variant: 'destructive',
        title: 'Agreement Deleted',
        description: 'The agreement has been successfully deleted.',
      });
    } catch (e: any) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: e.message || 'Could not delete the agreement.',
      });
    }
  };


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({...prev, [name]: value}));
  }
  
  const filteredAgreements = displayAgreements.filter(agreement => {
    return (
        agreement.code.toLowerCase().includes(filters.code.toLowerCase()) &&
        agreement.partnerId.toLowerCase().includes(filters.partnerId.toLowerCase())
    );
  });
  
   const getStatusBadgeVariant = (status: NegotiatedSpaceAgreement['status']) => {
    switch (status) {
      case 'Published':
        return 'default';
      case 'Approved':
      case 'Amended':
        return 'secondary';
      case 'Draft':
        return 'outline';
      case 'Expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Negotiated Space Agreements
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and track pre-negotiated capacity and pricing for partners.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2" />
          Create Agreement
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>NSA Catalogue</CardTitle>
          <CardDescription>
            Browse and manage all negotiated space agreements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="code"
                placeholder="Filter by Contract Code..."
                value={filters.code}
                onChange={handleFilterChange}
                className="pl-9"
              />
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                name="partnerId"
                placeholder="Filter by Partner ID..."
                value={filters.partnerId}
                onChange={handleFilterChange}
                className="pl-9"
              />
            </div>
          </div>
          {(loading && displayAgreements.length === 0) && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {displayAgreements.length > 0 && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract Code</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgreements.map((nsa) => (
                  <TableRow key={nsa.id}>
                    <TableCell className="font-medium">{nsa.code}</TableCell>
                    <TableCell>{nsa.partnerId}</TableCell>
                    <TableCell>{nsa.scope.route}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(nsa.status)}>
                        {nsa.status}
                      </Badge>
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleOpenDialog(nsa)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>View Performance</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(nsa.id!)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {error && <p className="text-destructive">Error loading agreements: {error.message}</p>}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingNsa ? 'Edit Agreement' : 'Create New Agreement'}</DialogTitle>
            <DialogDescription>
              {editingNsa ? `Editing agreement "${editingNsa.code}".` : 'Define the terms for a new Negotiated Space Agreement.'}
            </DialogDescription>
          </DialogHeader>
          <NsaForm
            nsa={editingNsa}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
