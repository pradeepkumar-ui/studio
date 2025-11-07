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
    { id: 'NSA-001', code: 'NSA-TA-2025', partnerId: 'TOUR-ALPHA', scope: 'SZX-BOM / 2025-Q1', pricing: 'Fixed', status: 'Published', capacity: 30, rbd: 'Q,N,V', brand: 'Value,Flex', deadlines: 'D-30', finance: '10% deposit' },
    { id: 'NSA-002', code: 'NSA-CORP-B-25', partnerId: 'CORP-BRAVO', scope: 'LHR-JFK / 2025', pricing: 'Discount', status: 'Published', capacity: 10, rbd: 'J,C', brand: 'Business', deadlines: 'D-7', finance: 'Net 30' },
    { id: 'NSA-003', code: 'NSA-TOUR-C-24', partnerId: 'TOUR-CHARLIE', scope: 'US-DOM / 2024-H2', pricing: 'Commission', status: 'Expired', capacity: 50, rbd: 'Y,B,M', brand: 'Economy', deadlines: 'D-45', finance: '5% deposit' },
    { id: 'NSA-004', code: 'NSA-TA-2026', partnerId: 'TOUR-ALPHA', scope: 'DXB-LHR / 2026-Q2', pricing: 'Fixed', status: 'Draft', capacity: 25, rbd: 'Q,N', brand: 'Value', deadlines: 'D-30', finance: '15% deposit' },
    { id: 'NSA-005', code: 'NSA-CORP-D-25', partnerId: 'CORP-DELTA', scope: 'SIN-HKG / 2025', pricing: 'Discount', status: 'Published', capacity: 5, rbd: 'J', brand: 'Business Flex', deadlines: 'D-14', finance: 'Net 60' },
    { id: 'NSA-006', code: 'NSA-MICE-E-25', partnerId: 'MICE-ECHO', scope: 'FRA-MUC / 2025-09', pricing: 'Commission', status: 'Approved', capacity: 100, rbd: 'Y,B', brand: 'Economy', deadlines: 'D-60', finance: '20% deposit' },
    { id: 'NSA-007', code: 'NSA-CONS-F-25', partnerId: 'CONS-FOXTROT', scope: 'SYD-LAX / 2025', pricing: 'Fixed', status: 'Published', capacity: 20, rbd: 'W,S', brand: 'Premium', deadlines: 'D-21', finance: '10% deposit' },
    { id: 'NSA-008', code: 'NSA-GOV-G-25', partnerId: 'GOV-GOLF', scope: 'IAD-WORLD / 2025', pricing: 'Discount', status: 'Published', capacity: 15, rbd: 'Y', brand: 'Flex', deadlines: 'D-5', finance: 'Net 30' },
    { id: 'NSA-009', code: 'NSA-TA-2025-EU', partnerId: 'TOUR-ALPHA', scope: 'EU / 2025-SUMMER', pricing: 'Commission', status: 'Amended', capacity: 40, rbd: 'M,H,Q', brand: 'Economy', deadlines: 'D-45', finance: '10% deposit' },
    { id: 'NSA-010', code: 'NSA-CORP-B-26', partnerId: 'CORP-BRAVO', scope: 'LHR-JFK / 2026', pricing: 'Discount', status: 'Draft', capacity: 12, rbd: 'J,C', brand: 'Business', deadlines: 'D-7', finance: 'Net 30' },
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
          {loading && displayAgreements.length === 0 && (
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
                  <TableHead>Pricing</TableHead>
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
                    <TableCell>{nsa.scope}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(nsa.status)}>
                        {nsa.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{nsa.pricing}</TableCell>
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
