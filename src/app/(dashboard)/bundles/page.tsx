
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
import { MoreHorizontal, PlusCircle, Loader2, Bot, User, Search, Package, Target, Zap, Copy, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BundleForm, type Bundle } from '@/components/forms/bundle-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, deleteDoc, Timestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockOffers: any[] = [
    { id: 'OFR-001', name: 'Executive Transit Pack', offerType: 'Bundle', status: 'Published', version: 1, priority: 85, components: [{ value: 'LOUA', isMandatory: true }, { value: 'PBDG', isMandatory: false }], pricing: { strategy: 'Demand', basePrice: 85, currentPrice: 72 }, targeting: { cohorts: ['LHR_BIZ_WAIT'] } },
    { id: 'OFR-002', name: 'Priority Boarding Solo', offerType: 'Single', status: 'Published', version: 2, priority: 40, components: [{ value: 'PBDG', isMandatory: true }], pricing: { strategy: 'Static', basePrice: 15, currentPrice: 15 }, targeting: { cohorts: ['All'] } },
];

export default function BundlesPage() {
  const firestore = useFirestore();
  const bundlesQuery = useMemo(() => firestore ? collection(firestore, 'bundles') : undefined, [firestore]);
  const { data: bundlesCollection, loading } = useCollection(bundlesQuery);
  const [filters, setFilters] = useState({ name: '', offerType: 'all', status: 'all' });
  
  const displayOffers = useMemo(() => {
    let sourceData = (bundlesCollection && bundlesCollection.length > 0) ? bundlesCollection : mockOffers;
    
    return sourceData.filter(offer => {
      const nameMatch = filters.name ? offer.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const typeMatch = filters.offerType === 'all' || offer.offerType === filters.offerType;
      const statusMatch = filters.status === 'all' || offer.status === filters.status;
      return nameMatch && typeMatch && statusMatch;
    });
  }, [bundlesCollection, filters]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<any | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (bundle: any | null = null) => {
    setEditingBundle(bundle);
    setIsDialogOpen(true);
  };

  const handleClone = async (bundle: any) => {
    if (!firestore) return;
    try {
        const { id, ...cloneData } = bundle;
        await addDoc(collection(firestore, 'bundles'), {
            ...cloneData,
            name: `${cloneData.name} (Copy)`,
            status: 'Draft',
            version: 1,
            createdAt: serverTimestamp()
        });
        toast({ title: 'Offer Cloned', description: `Successfully created a draft copy of ${bundle.name}.` });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Clone Failed', description: e.message });
    }
  };

  const handleFormSubmit = async (data: Bundle) => {
    if (!firestore) return;
    try {
      if (editingBundle?.id) {
        const ref = doc(firestore, 'bundles', editingBundle.id);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Offer Updated' });
      } else {
        await addDoc(collection(firestore, 'bundles'), { ...data, version: 1, createdAt: serverTimestamp() });
        toast({ title: 'Offer Created' });
      }
    } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Offers & Dynamic pricing</h1>
          <p className="text-muted-foreground">Ecosystem-wide monetization engine for personalized airline and airport services.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold">
          <PlusCircle className="mr-2 h-4 w-4" /> Define Offer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
              <div>
                <CardTitle>Decision Engine Registry</CardTitle>
                <CardDescription>Configure components, dynamic pricing strategies, and cohort targeting rules.</CardDescription>
              </div>
              <div className="flex gap-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Real-Time Evaluation Active</Badge>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Filter by offer name..." value={filters.name} onChange={(e) => setFilters(prev => ({...prev, name: e.target.value}))} className="pl-9" />
              </div>
              <Select value={filters.offerType} onValueChange={(v) => setFilters(prev => ({...prev, offerType: v}))}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Offer Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Single">Single SKU</SelectItem>
                  <SelectItem value="Bundle">Bundled Offer</SelectItem>
                  <SelectItem value="Upgrade">Upgrade Offer</SelectItem>
                </SelectContent>
              </Select>
          </div>
          
          {loading && displayOffers.length === 0 ? (
             <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
           ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer identity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Pricing strategy</TableHead>
                  <TableHead>Targeting (Cohorts)</TableHead>
                  <TableHead className="text-right">Base / Live</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-primary/10 rounded"><Package className="h-4 w-4 text-primary" /></div>
                         <div>
                            <div className="font-bold flex items-center gap-1.5">{offer.name} {offer.priority > 80 && <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />}</div>
                            <div className="text-[10px] text-muted-foreground uppercase font-black">v{offer.version} • {offer.status}</div>
                         </div>
                      </div>
                    </TableCell>
                     <TableCell><Badge variant="secondary" className="text-[10px] uppercase font-black">{offer.offerType}</Badge></TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                            <Bot className="h-3.5 w-3.5 text-indigo-600" /> {offer.pricing?.strategy || 'Static'}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Target className="h-3 w-3" /> {offer.targeting?.cohortIds?.join(', ') || 'Global'}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="text-[10px] text-muted-foreground line-through">${offer.pricing?.basePrice}</div>
                        <div className="font-black text-primary font-mono">${offer.pricing?.currentPrice || offer.pricing?.basePrice}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Decision Manager</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog(offer)}><History className="mr-2 h-4 w-4"/>Edit Definition & Strategy</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleClone(offer)}><Copy className="mr-2 h-4 w-4"/>Clone to New Version</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive font-bold" onClick={() => offer.id && deleteDoc(doc(firestore!, 'bundles', offer.id))}>Archive Monetization</DropdownMenuItem>
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
            <DialogTitle>{editingBundle ? 'Modify Monetization Engine' : 'Configure New Offer'}</DialogTitle>
            <DialogDescription>Define exhaustive product logic, dynamic pricing deltas, and real-time cohort mapping.</DialogDescription>
          </DialogHeader>
          <BundleForm bundle={editingBundle} onSubmit={handleFormSubmit} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
