
'use client';

import * as React from 'react';
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Plane,
  Loader2,
  Settings2,
  FileCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
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

const mockAirlineAncillaries: any[] = [
  { id: 'ANC-001', name: 'Premium Wi-Fi (Ultra)', category: 'On-board - Wi-Fi', defaultPrice: 25, currency: 'USD', status: 'Active', pssCode: 'WIFU', cabinEligibility: ['All'], aircraftEligibility: ['A350', 'B787'] },
  { id: 'ANC-002', name: 'Twin-Seat Blocking', category: 'Seat - Twin/Preferred', defaultPrice: 120, currency: 'USD', status: 'Testing', pssCode: 'TSEAT', cabinEligibility: ['Economy'], aircraftEligibility: ['All'] },
  { id: 'ANC-003', name: 'Standby Upgrade (J)', category: 'Flexibility - Upgrade Standby', defaultPrice: 450, currency: 'USD', status: 'Active', pssCode: 'UPGS', cabinEligibility: ['Economy', 'Premium Economy'], aircraftEligibility: ['B777'] },
];

export default function AirlineAncillaryCataloguePage() {
  const firestore = useFirestore();
  const ancillariesQuery = React.useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
  const { data: ancillariesCollection, loading } = useCollection(ancillariesQuery);
  
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
        toast({ title: 'Portfolio Updated', description: `${data.name} saved successfully.` });
      } else {
        await addDoc(collection(firestore, 'airlineAncillaries'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'New Portfolio Item', description: `${data.name} added to carrier registry.` });
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
        toast({ title: 'Item Removed', variant: 'destructive' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Airline Ancillary Portfolio</h1>
          <p className="text-muted-foreground">Manage exhaustive flight-related upsells and aircraft-specific retailing configurations.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Carrier Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Carrier Services</CardTitle>
          <CardDescription>Comprehensive registry of exhaustive airline-managed ancillaries and their host PSS parameters.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search portfolio by service or SSR..."
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
                    <TableHead>Service & PSS ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Config Context</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Base Fee</TableHead>
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
                              <div className="font-bold">{anc.name}</div>
                              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">{anc.pssCode}</div>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter">{anc.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3 text-emerald-500" />
                              <span className="text-[10px] text-muted-foreground">Cabins: {anc.cabinEligibility?.join(', ')}</span>
                           </div>
                           <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-blue-500" />
                              <span className="text-[10px] text-muted-foreground">Fleet: {anc.aircraftEligibility?.join(', ')}</span>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={anc.status === 'Active' ? 'default' : 'secondary'}>{anc.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: anc.currency || 'USD' }).format(anc.defaultPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Retailing Logic</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(anc)}><Settings2 className="mr-2 h-4 w-4"/>Edit Technical Definition</DropdownMenuItem>
                            <DropdownMenuItem><FileCode className="mr-2 h-4 w-4"/>Check PSS Sync Status</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => anc.id && handleDelete(anc.id)}>Archive SKU</DropdownMenuItem>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingAncillary ? 'Update Portfolio Logic' : 'Define Exhaustive Carrier Service'}</DialogTitle>
            <DialogDescription>Map carrier host ancillaries to the SITA retailing engine with granular fleet and cabin rules.</DialogDescription>
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
