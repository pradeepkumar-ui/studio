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
  Tag,
  Briefcase,
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
  { id: '1', ancillaryCode: 'EXLG', name: 'Extra Legroom Seat', shortName: 'Legroom+', category: 'Seat', subcategory: 'Extra legroom seat', status: 'Active', version: 1, airlineCode: 'GAB', owningBusinessUnit: 'Revenue', providerName: 'Global Airways' },
  { id: '2', ancillaryCode: 'WIFU', name: 'Premium Wi-Fi (Unlimited)', shortName: 'Ultra Wi-Fi', category: 'Wi-Fi / connectivity', subcategory: 'Wi-Fi pass', status: 'Active', version: 2, airlineCode: 'GAB', owningBusinessUnit: 'Inflight', providerName: 'Global Airways' },
  { id: '3', ancillaryCode: 'UPGS', name: 'Standby Upgrade (J Class)', shortName: 'Standby Upgr', category: 'Upgrade', subcategory: 'Upgrade to business', status: 'Active', version: 1, airlineCode: 'SBA', owningBusinessUnit: 'Retailing', providerName: 'SkyBridge Airlines' },
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
    ? (ancillariesCollection as any[]) 
    : mockAirlineAncillaries;

  const filteredAncillaries = displayAncillaries.filter((anc) =>
    anc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    anc.ancillaryCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (ancillary: any | null = null) => {
    setEditingAncillary(ancillary);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: Ancillary) => {
    if (!firestore) return;
    try {
      if (editingAncillary?.id) {
        const ref = doc(firestore, 'airlineAncillaries', editingAncillary.id);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Catalogue Updated', description: `${data.name} saved successfully.` });
      } else {
        await addDoc(collection(firestore, 'airlineAncillaries'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'Master Registry Entry', description: `${data.name} added to carrier portfolio.` });
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
        toast({ title: 'Item Decommissioned', variant: 'destructive' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Airline Ancillary Master</h1>
          <p className="text-muted-foreground">Manage core master details, categorization, and ownership for carrier-specific ancillaries.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Ancillary Master
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Carrier Catalogue Registry</CardTitle>
          <CardDescription>Unified registry of exhaustive carrier service logic and logical ownership.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search master by name or code..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Master Identity</TableHead>
                  <TableHead>Categorization</TableHead>
                  <TableHead>Carrier Ownership</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAncillaries.map((anc) => (
                  <TableRow key={anc.id} className="group cursor-default">
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <div className="p-2 bg-primary/10 rounded group-hover:scale-110 transition-transform">
                            <Tag className="h-4 w-4 text-primary" />
                         </div>
                         <div>
                            <div className="font-bold text-sm">{anc.name}</div>
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{anc.ancillaryCode} • v{anc.version || 1}</div>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-0.5">
                            <Badge variant="outline" className="text-[9px] uppercase font-black w-fit">{anc.category}</Badge>
                            <span className="text-[10px] text-muted-foreground italic">{anc.subcategory}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                            <Plane className="h-3 w-3" /> {anc.airlineCode}
                         </div>
                         <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Briefcase className="h-2.5 w-2.5" /> {anc.owningBusinessUnit}
                         </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={anc.status === 'Active' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase">{anc.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground">Master Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog(anc)}><Settings2 className="mr-2 h-4 w-4"/>Modify Master Details</DropdownMenuItem>
                          <DropdownMenuItem><FileCode className="mr-2 h-4 w-4"/>Check Version History</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive font-bold" onClick={() => anc.id && handleDelete(anc.id)}>Archive Master</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">{editingAncillary ? 'Modify Ancillary Master' : 'Create New Ancillary Master'}</DialogTitle>
            <DialogDescription>Define exhaustive core details, classification, and logical ownership for this carrier SKU.</DialogDescription>
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
