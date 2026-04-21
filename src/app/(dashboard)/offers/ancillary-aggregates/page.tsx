
'use client';

import { useState, useMemo } from 'react';
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
import { MoreHorizontal, PlusCircle, Loader2, Layers, Search, History, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AncillaryAggregateForm, type AncillaryAggregate } from '@/components/forms/ancillary-aggregate-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const initialMockAggregates: any[] = [
    { id: 'AGG-001', configName: 'Premium Route Baggage Logic', ancillaryName: '1st Checked Bag', category: 'Baggage', status: 'Active' },
    { id: 'AGG-002', configName: 'Long-Haul Seat Strategy', ancillaryName: 'Extra Legroom Seat', category: 'Seat', status: 'Active' },
];

export default function AncillaryAggregatesPage() {
  const firestore = useFirestore();
  const aggregatesQuery = useMemo(() => firestore ? collection(firestore, 'airlineAncillaryAggregates') : undefined, [firestore]);
  const { data: aggregatesCollection, loading } = useCollection(aggregatesQuery);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAggregate, setEditingAggregate] = useState<any | null>(null);
  const { toast } = useToast();

  const displayAggregates = useMemo(() => {
      const sourceData = (aggregatesCollection && aggregatesCollection.length > 0) ? aggregatesCollection as any[] : initialMockAggregates;
      return sourceData.filter(a => 
        a.configName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.ancillaryName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [aggregatesCollection, searchTerm]);

  const handleOpenDialog = (aggregate: any | null = null) => {
    setEditingAggregate(aggregate);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: AncillaryAggregate) => {
    if (!firestore) return;
    try {
      if (editingAggregate?.id) {
        const ref = doc(firestore, 'airlineAncillaryAggregates', editingAggregate.id);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Aggregate Logic Updated' });
      } else {
        await addDoc(collection(firestore, 'airlineAncillaryAggregates'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'New Aggregate Logic Registered' });
      }
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'airlineAncillaryAggregates', id));
        toast({ title: 'Logic Decommissioned', variant: 'destructive' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Airline Ancillary Aggregate</h1>
          <p className="text-muted-foreground">Manage exhaustive logic parameters and aggregate values for carrier services.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold">
          <PlusCircle className="mr-2 h-4 w-4" />
          Define Aggregate Logic
        </Button>
      </div>

      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-lg">Aggregate Logic Registry</CardTitle>
          <CardDescription>Unique configurations for retailing parameters based on IATA service taxonomy.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by configuration or product..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9 bg-muted/20"
              />
            </div>
          </div>
          
          {loading && displayAggregates.length === 0 ? (
             <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
           ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-[10px] uppercase font-black">Logic Identity</TableHead>
                  <TableHead className="text-[10px] uppercase font-black">Linked Product</TableHead>
                  <TableHead className="text-[10px] uppercase font-black">Category</TableHead>
                  <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayAggregates.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-primary/10 rounded-xl transition-transform group-hover:scale-110">
                            <Layers className="h-4 w-4 text-primary" />
                         </div>
                         <div className="font-bold text-sm text-primary">{item.configName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className="text-xs font-semibold">{item.ancillaryName}</div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className="text-[9px] uppercase font-black">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Active' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase tracking-wider">{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground">Logic Operations</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog(item)}><Edit className="mr-2 h-4 w-4"/>Modify Logic Set</DropdownMenuItem>
                          <DropdownMenuItem><History className="mr-2 h-4 w-4"/>Check Evolution</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive font-bold" onClick={() => item.id && handleDelete(item.id)}><Trash2 className="mr-2 h-4 w-4"/>Archive Configuration</DropdownMenuItem>
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
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary">Airline Ancillary Aggregate SKU</DialogTitle>
            <DialogDescription className="font-medium">Define high-fidelity aggregate logic for airline products based on specific retailing parameters.</DialogDescription>
          </DialogHeader>
          <AncillaryAggregateForm
            aggregate={editingAggregate}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
