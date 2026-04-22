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
import { MoreHorizontal, PlusCircle, Loader2, Bot, Search, Package, Target, History, Plane, Building2, Briefcase, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BundleForm, type Bundle } from '@/components/forms/bundle-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDays } from 'date-fns';

const initialMockOffers: any[] = [
    { 
        id: 'OFR-001', 
        name: 'Executive Transit Pack', 
        domain: 'Airline',
        owningAirlineId: 'GAB',
        status: 'Published', 
        validity: { from: new Date(), to: addDays(new Date(), 30) },
        components: [{ value: 'LOUA', isMandatory: true }], 
        pricing: { strategy: 'Demand', basePrice: 85, currency: 'USD' }, 
        targeting: { cohortIds: ['LHR_BIZ_WAIT'] } 
    },
    { 
        id: 'OFR-002', 
        name: 'LHR Premium Priority', 
        domain: 'Airport',
        owningAirportId: 'LHR',
        status: 'Published', 
        validity: { from: new Date(), to: addDays(new Date(), 60) },
        components: [{ value: 'PBDG', isMandatory: true }], 
        pricing: { strategy: 'Static', basePrice: 15, currency: 'USD' }, 
        targeting: { cohortIds: [] } 
    },
];

export default function BundlesPage() {
  const firestore = useFirestore();
  const bundlesQuery = useMemo(() => firestore ? collection(firestore, 'bundles') : undefined, [firestore]);
  const { data: bundlesCollection, loading } = useCollection(bundlesQuery);
  const [filters, setFilters] = useState({ name: '', domain: 'all' });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<any | null>(null);
  const { toast } = useToast();

  const displayOffers = useMemo(() => {
    let sourceData = (bundlesCollection && bundlesCollection.length > 0) ? bundlesCollection : initialMockOffers;
    
    return sourceData.filter(offer => {
      const nameMatch = filters.name ? offer.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const domainMatch = filters.domain === 'all' || offer.domain === filters.domain;
      return nameMatch && domainMatch;
    });
  }, [bundlesCollection, filters]);

  const handleOpenDialog = (bundle: any | null = null) => {
    setEditingBundle(bundle);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: Bundle) => {
    if (!firestore) return;
    try {
      if (editingBundle?.id) {
        const ref = doc(firestore, 'bundles', editingBundle.id);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Monetization strategy updated' });
      } else {
        await addDoc(collection(firestore, 'bundles'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'New offer strategy live' });
      }
    } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'bundles', id));
        toast({ title: 'Offer strategy archived' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Delete Failed', description: e.message });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Airline Offers and Dynamic pricing</h1>
          <p className="text-muted-foreground font-medium">Configure cohort-driven monetization strategies for airline and airport services.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold h-11 px-8 shadow-indigo-100 shadow-xl">
          <PlusCircle className="mr-2 h-4 w-4" /> Define Offer Strategy
        </Button>
      </div>

      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Monetization Registry</CardTitle>
                <CardDescription>Mapped product sets with live dynamic pricing and targeting rules.</CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-[10px] uppercase">Engine: Operational</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search strategy by name..." value={filters.name} onChange={(e) => setFilters(prev => ({...prev, name: e.target.value}))} className="pl-9 h-10 bg-muted/20" />
              </div>
              <Select value={filters.domain} onValueChange={(v) => setFilters(prev => ({...prev, domain: v}))}>
                <SelectTrigger className="w-[180px] h-10"><SelectValue placeholder="Offer Domain" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  <SelectItem value="Airline">Airline Specific</SelectItem>
                  <SelectItem value="Airport">Airport Hub Specific</SelectItem>
                  <SelectItem value="Hybrid">Hybrid Bundle</SelectItem>
                </SelectContent>
              </Select>
          </div>
          
          {loading && displayOffers.length === 0 ? (
             <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
           ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-[10px] uppercase font-black">Strategy Identity</TableHead>
                  <TableHead className="text-[10px] uppercase font-black">Retailing Domain</TableHead>
                  <TableHead className="text-[10px] uppercase font-black">Dynamic Logic</TableHead>
                  <TableHead className="text-[10px] uppercase font-black">Target Cohorts</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-black">Base Price</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOffers.map((offer) => (
                  <TableRow key={offer.id} className="group cursor-default">
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-primary/10 rounded-xl transition-transform group-hover:scale-110"><Package className="h-4 w-4 text-primary" /></div>
                         <div>
                            <div className="font-bold">{offer.name}</div>
                            <div className="text-[10px] text-muted-foreground uppercase font-black flex items-center gap-1">
                                <History className="w-2.5 h-2.5" /> {offer.status}
                            </div>
                         </div>
                      </div>
                    </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-1.5">
                            {offer.domain === 'Airline' ? <Plane className="h-3 w-3 text-blue-600" /> : offer.domain === 'Airport' ? <Building2 className="h-3 w-3 text-emerald-600" /> : <Briefcase className="h-3 w-3 text-indigo-600" />}
                            <span className="text-xs font-bold">{offer.domain}</span>
                        </div>
                     </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-700">
                            <Bot className="h-3.5 w-3.5" /> {offer.pricing?.strategy || 'Static'}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {offer.targeting?.cohortIds?.map((c: string) => (
                                <Badge key={c} variant="secondary" className="text-[9px] px-1.5 font-mono">{c}</Badge>
                            )) || <span className="text-[10px] text-muted-foreground italic">Global</span>}
                            {offer.targeting?.cohortIds?.length === 0 && <span className="text-[10px] text-muted-foreground italic">Global</span>}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="font-black text-primary font-mono text-lg">${offer.pricing?.basePrice}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground">Strategy Manager</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog(offer)}><History className="mr-2 h-4 w-4"/>Edit Technical Strategy</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(offer.id!)}><Trash2 className="mr-2 h-4 w-4"/>Archive Strategy</DropdownMenuItem>
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
            <DialogTitle className="text-2xl font-black">{editingBundle ? 'Update Monetization strategy' : 'Configure New Offer Strategy'}</DialogTitle>
            <DialogDescription className="font-medium">Define simple product composition, dynamic price adjustments, and target cohorts.</DialogDescription>
          </DialogHeader>
          <BundleForm bundle={editingBundle} onSubmit={handleFormSubmit} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
