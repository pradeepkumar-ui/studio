
'use client';

import * as React from 'react';
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  ChevronDown,
  Plane,
  Loader2,
  Settings2,
  FileCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AncillaryForm, type Ancillary } from '@/components/forms/ancillary-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const mockAirlineAncillaries: Ancillary[] = [
  { id: 'ANC-001', name: '1st Checked Bag (23kg)', category: 'Baggage', defaultPrice: 35, currency: 'USD', status: 'Active', pssCode: 'BAGG', cabinEligibility: ['Economy', 'Premium Economy'], refundPolicy: 'Not Allowed' },
  { id: 'ANC-002', name: 'Extra Legroom Seat', category: 'Seat', defaultPrice: 50, currency: 'USD', status: 'Active', pssCode: 'EXLG', cabinEligibility: ['Economy'], refundPolicy: 'Allowed with Penalty' },
  { id: 'ANC-003', name: 'In-flight Wi-Fi (Full Flight)', category: 'On-board', defaultPrice: 15, currency: 'USD', status: 'Active', pssCode: 'WIFI', cabinEligibility: ['All'], refundPolicy: 'Not Allowed' },
  { id: 'ANC-005', name: 'Flight Change Waiver', category: 'Flexibility', defaultPrice: 75, currency: 'USD', status: 'Active', pssCode: 'FLEX', cabinEligibility: ['All'], refundPolicy: 'Not Allowed' },
];

export default function AirlineAncillaryCataloguePage() {
  const firestore = useFirestore();
  const { data: ancillariesCollection, loading } = useCollection(firestore ? collection(firestore, 'airlineAncillaries') : undefined);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingAncillary, setEditingAncillary] = React.useState<Ancillary | null>(null);
  const { toast } = useToast();

  const displayAncillaries = (ancillariesCollection && ancillariesCollection.length > 0) 
    ? (ancillariesCollection as Ancillary[]) 
    : mockAirlineAncillaries;

  const filteredAncillaries = displayAncillaries.filter((anc) =>
    anc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    anc.pssCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (ancillary: Ancillary | null = null) => {
    setEditingAncillary(ancillary);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: Ancillary) => {
    if (!firestore) return;
    try {
      if (editingAncillary?.id) {
        const ref = doc(firestore, 'airlineAncillaries', editingAncillary.id);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Ancillary Updated', description: `Service "${data.name}" has been updated.` });
      } else {
        await addDoc(collection(firestore, 'airlineAncillaries'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'Ancillary Created', description: `New service "${data.name}" added to portfolio.` });
      }
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'airlineAncillaries', id));
        toast({ title: 'Ancillary Deleted', variant: 'destructive' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Airline Ancillary Portfolio</h1>
          <p className="text-muted-foreground">Manage flight-related upsells, PSS integration codes, and eligibility rules.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Define Air Ancillary
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>A-la-Carte Air Services</CardTitle>
          <CardDescription>Comprehensive management of carrier-provided services and their commercial parameters.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or PSS code..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          {loading && displayAncillaries.length === 0 ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service & PSS Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Eligibility</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Base Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAncillaries.map((anc) => (
                    <TableRow key={anc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                           <Plane className="h-4 w-4 text-primary" />
                           <div>
                              <div>{anc.name}</div>
                              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{anc.pssCode}</div>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{anc.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                           {anc.cabinEligibility?.map(c => <Badge key={c} variant="secondary" className="text-[9px] h-4">{c}</Badge>)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={anc.status === 'Active' ? 'default' : 'secondary'}>{anc.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: anc.currency }).format(anc.defaultPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(anc)}><Settings2 className="mr-2 h-4 w-4"/>Edit Definition</DropdownMenuItem>
                            <DropdownMenuItem><FileCode className="mr-2 h-4 w-4"/>View Sync Logs</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => anc.id && handleDelete(anc.id)}>Archive Service</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAncillary ? 'Modify Air Ancillary' : 'Define New Air Ancillary'}</DialogTitle>
            <DialogDescription>Set commercial positioning and technical PSS integration parameters for this flight-related service.</DialogDescription>
          </DialogHeader>
          <AncillaryForm
            ancillary={editingAncillary}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
