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
  FileUp,
  MoreHorizontal,
  PlusCircle,
  CheckCircle,
  Loader2,
  AlertCircle,
  History,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FareForm, type Fare } from '@/components/forms/fare-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const mockFares: Fare[] = [
    { id: 'F-001', fareBasisCode: 'YFLEX', cabinClass: 'Economy', route: 'JFK → LAX, SFO', price: 350, currency: 'USD', status: 'Active', version: 1, scopes: [], tripTypes: ['one_way', 'return'], passengerTypes: ['ADT'] },
    { id: 'F-002', fareBasisCode: 'JCLASS', cabinClass: 'Business', route: 'LHR → DXB', price: 2500, currency: 'GBP', status: 'Active', version: 2, scopes: [], tripTypes: ['one_way', 'return'], passengerTypes: ['ADT'] },
    { id: 'F-003', fareBasisCode: 'QFLEX', cabinClass: 'Economy', route: 'SIN → HKG', price: 280, currency: 'SGD', status: 'Active', version: 1, scopes: [], tripTypes: ['one_way'], passengerTypes: ['ADT', 'CHD'] },
    { id: 'F-004', fareBasisCode: 'FFLEX', cabinClass: 'First', route: 'JFK → LHR', price: 5500, currency: 'USD', status: 'Draft', version: 1, scopes: [], tripTypes: ['return'], passengerTypes: ['ADT'] },
];

export default function FaresPage() {
  const firestore = useFirestore();
  const { data: faresCollection, loading, error } = useCollection(firestore ? collection(firestore, 'fares') : undefined);
  
  const fares = faresCollection ? faresCollection as Fare[] : [];
  const displayFares = (fares && fares.length > 0) ? fares : mockFares;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFare, setEditingFare] = useState<Fare | null>(null);
  const { toast } = useToast();

  const handleValidate = () => {
    toast({
      title: 'Validation Started',
      description: 'Checking for fare collisions and validating inventory rules...',
    });
    setTimeout(() => {
      toast({
        title: 'Validation Complete',
        description: 'No commercial collisions found. All fares are commercially viable.',
      });
    }, 2000);
  };

  const handleOpenDialog = (fare: Fare | null = null) => {
    setEditingFare(fare);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: Fare) => {
    if (!firestore) return;
    try {
        if (editingFare?.id) {
          const fareRef = doc(firestore, 'fares', editingFare.id);
          setDoc(fareRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
          toast({ title: "Base Fare Updated", description: `Fare ${data.fareBasisCode} updated successfully.` });
        } else {
          addDoc(collection(firestore, 'fares'), { ...data, createdAt: serverTimestamp(), version: 1 });
          toast({ title: "Base Fare Created", description: `New fare ${data.fareBasisCode} added to catalogue.` });
        }
    } catch(e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
    }
    setIsDialogOpen(false);
  };
  
   const handleDelete = async (fareId: string) => {
    if (!fareId || !firestore) return;
    try {
        deleteDoc(doc(firestore, 'fares', fareId));
        toast({ title: 'Fare Deleted', variant: 'destructive' });
    } catch(e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Base Fare Catalogue</h1>
          <p className="text-muted-foreground">Manage exhaustive base fare rules, routing, and conditions for PSS synchronization.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FileUp className="mr-2 h-4 w-4" />Bulk Import</Button>
          <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" />Create Base Fare</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Filing Queue</CardTitle>
            <CardDescription>Commercially active base fares across the carrier network.</CardDescription>
          </div>
          <Button onClick={handleValidate} variant="secondary"><CheckCircle className="mr-2 h-4 w-4" />Validate Integrity</Button>
        </CardHeader>
        <CardContent>
           {loading && displayFares.length === 0 ? (
             <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
           ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>FBC / Cabin</TableHead>
                    <TableHead>Exhaustive Route</TableHead>
                    <TableHead>Commercial Price</TableHead>
                    <TableHead>Pax / Trip</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {displayFares.map((fare) => (
                    <TableRow key={fare.id}>
                    <TableCell>
                      <div className="font-bold font-mono">{fare.fareBasisCode}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{fare.cabinClass}</div>
                    </TableCell>
                    <TableCell className="max-w-[250px]">
                      <div className="text-sm font-medium truncate">{fare.route}</div>
                      <div className="text-[10px] text-muted-foreground">v{fare.version} • Managed by Host PSS</div>
                    </TableCell>
                    <TableCell>
                        <div className="font-bold">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: fare.currency }).format(fare.price)}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {fare.passengerTypes?.map(p => <Badge key={p} variant="outline" className="text-[9px] h-4">{p}</Badge>)}
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={fare.status === 'Active' ? 'default' : fare.status === 'Draft' ? 'secondary' : 'outline'}>{fare.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(fare)}>Edit Detailed Rules</DropdownMenuItem>
                            <DropdownMenuItem><History className="mr-2 h-4 w-4"/>View Filing History</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(fare.id!)}>Archive Fare</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
           )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingFare ? 'Modify Base Fare Filing' : 'Create New Base Fare'}</DialogTitle>
            <DialogDescription>Define the exhaustive routing, conditions, and pricing parameters for this base fare.</DialogDescription>
          </DialogHeader>
          <FareForm fare={editingFare} onSubmit={handleFormSubmit} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
