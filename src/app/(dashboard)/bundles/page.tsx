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
} from '@/components/ui/dialog';
import { 
  MoreHorizontal, 
  PlusCircle, 
  Loader2, 
  Search, 
  Package, 
  Tag, 
  ShieldCheck, 
  Users,
  Trash2,
  Edit,
  Zap,
  TrendingUp,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { OfferStrategyForm, type OfferStrategy } from '@/components/pricing/offer-strategy-form';
import { cn } from '@/lib/utils';

const mockOfferStrategies: OfferStrategy[] = [
    {
        id: 'OFR-STRAT-001',
        name: 'Holiday Family Comfort Bundle',
        type: 'Bundle',
        ancillaryIds: ['AGG-001', 'AGG-002'],
        status: 'Active',
        validity: { from: '2025-11-01', to: '2026-01-15' },
        cohortIds: ['FAMILY_TRIP', 'LEISURE_PROMO'],
        pricing: { type: 'PercentageDiscount', value: 20, currency: 'USD' },
        dynamicPricing: { enabled: true, ruleType: 'TimeBased', threshold: 'T-7 Days', adjustmentPercent: 10 },
        guardRails: { minPrice: 45, maxPrice: 120 }
    },
    {
        id: 'OFR-STRAT-002',
        name: 'Business Priority Plus',
        type: 'Bundle',
        ancillaryIds: ['AGG-003', 'AGG-004'],
        status: 'Active',
        validity: { from: '2025-10-01', to: '2026-12-31' },
        cohortIds: ['PLAT_SOLO_BIZ', 'CORP_PREMIUM'],
        pricing: { type: 'FixedPrice', value: 85, currency: 'USD' },
        dynamicPricing: { enabled: false, ruleType: 'InventoryBased', adjustmentPercent: 0 },
        guardRails: { minPrice: 75, maxPrice: 150 }
    },
    {
        id: 'OFR-STRAT-003',
        name: 'Last Minute Wi-Fi Special',
        type: 'Single',
        ancillaryIds: ['AGG-005'],
        status: 'Active',
        validity: { from: '2025-01-01', to: '2025-12-31' },
        cohortIds: [],
        pricing: { type: 'PercentageDiscount', value: 15, currency: 'USD' },
        dynamicPricing: { enabled: true, ruleType: 'TimeBased', threshold: '< 24 Hours', adjustmentPercent: 5 },
        guardRails: { minPrice: 5, maxPrice: 25 }
    },
    {
        id: 'OFR-STRAT-004',
        name: 'Student Explorer Program',
        type: 'Single',
        ancillaryIds: ['AGG-001'],
        status: 'Active',
        validity: { from: '2025-06-01', to: '2025-09-30' },
        cohortIds: ['STUDENT_INTL'],
        pricing: { type: 'FixedDiscount', value: 25, currency: 'USD' },
        dynamicPricing: { enabled: false, ruleType: 'TimeBased', adjustmentPercent: 0 },
        guardRails: { minPrice: 10, maxPrice: 50 }
    },
    {
        id: 'OFR-STRAT-005',
        name: 'Early Bird Summer 2025',
        type: 'Single',
        ancillaryIds: ['AGG-002'],
        status: 'Draft',
        validity: { from: '2025-01-01', to: '2025-03-31' },
        cohortIds: ['EARLY_BOOKER'],
        pricing: { type: 'PercentageDiscount', value: 30, currency: 'USD' },
        dynamicPricing: { enabled: false, ruleType: 'TimeBased', adjustmentPercent: 0 },
        guardRails: { minPrice: 20, maxPrice: 100 }
    },
    {
        id: 'OFR-STRAT-006',
        name: 'Premium Transit Lounge Access',
        type: 'Bundle',
        ancillaryIds: ['AGG-003', 'AGG-005'],
        status: 'Active',
        validity: { from: '2025-01-01', to: '2025-12-31' },
        cohortIds: ['LONG_HAUL_TRANSIT'],
        pricing: { type: 'FixedPrice', value: 55, currency: 'USD' },
        dynamicPricing: { enabled: true, ruleType: 'InventoryBased', threshold: '< 20% Capacity', adjustmentPercent: 15 },
        guardRails: { minPrice: 50, maxPrice: 90 }
    },
    {
        id: 'OFR-STRAT-007',
        name: 'Corporate Multi-Bag Pass',
        type: 'Single',
        ancillaryIds: ['AGG-001'],
        status: 'Active',
        validity: { from: '2025-01-01', to: '2025-12-31' },
        cohortIds: ['CORP_HEAVY_TRAVEL'],
        pricing: { type: 'FixedPrice', value: 30, currency: 'USD' },
        dynamicPricing: { enabled: true, ruleType: 'InventoryBased', threshold: 'Hold > 80%', adjustmentPercent: 20 },
        guardRails: { minPrice: 30, maxPrice: 60 }
    }
];

export default function AirlineOffersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const offersQuery = useMemo(() => 
    firestore ? query(collection(firestore, 'offers'), orderBy('createdAt', 'desc')) : undefined
  , [firestore]);
  
  const { data: offers, loading } = useCollection(offersQuery);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferStrategy | null>(null);

  const displayOffers = useMemo(() => {
    const sourceData = (offers && offers.length > 0) ? (offers as OfferStrategy[]) : mockOfferStrategies;
    if (!searchTerm) return sourceData;
    return sourceData.filter(o => 
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [offers, searchTerm]);

  const handleOpenDialog = (offer: OfferStrategy | null = null) => {
    setEditingOffer(offer);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: OfferStrategy) => {
    if (!firestore) return;
    try {
      if (editingOffer?.id && !editingOffer.id.startsWith('OFR-STRAT')) {
        const ref = doc(firestore, 'offers', editingOffer.id);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Strategy Synchronized', description: `Successfully updated ${data.name}.` });
      } else {
        await addDoc(collection(firestore, 'offers'), { 
          ...data, 
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp() 
        });
        toast({ title: 'New Strategy Published', description: `Retailing offer ${data.name} is now live.` });
      }
      setIsDialogOpen(false);
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Sync Error', description: e.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    if (id.startsWith('OFR-STRAT')) {
        toast({ title: 'System Record', description: 'Mock records cannot be deleted from live storage.' });
        return;
    }
    try {
      await deleteDoc(doc(firestore, 'offers', id));
      toast({ title: 'Strategy Removed', variant: 'destructive' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Delete Failed', description: e.message });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-primary uppercase">Airline Offers Cockpit</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Carrier Retailing & Dynamic Monetization Engine</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold shadow-lg h-11 px-8">
          <PlusCircle className="mr-2 h-4 w-4" /> Create Offer Strategy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Strategies', value: displayOffers.filter(o => o.status === 'Active').length, icon: Tag, color: 'text-primary' },
          { label: 'Dynamic Flex Enabled', value: displayOffers.filter(o => o.dynamicPricing?.enabled).length, icon: Zap, color: 'text-amber-500' },
          { label: 'Segmented Targeting', value: displayOffers.filter(o => o.cohortIds && o.cohortIds.length > 0).length, icon: Users, color: 'text-blue-600' },
          { label: 'Commercial Sync', value: '100%', icon: ShieldCheck, color: 'text-emerald-500' }
        ].map((kpi) => (
          <Card key={kpi.label} className="p-6 bg-white shadow-sm border-primary/5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.label}</p>
              <kpi.icon className={cn("h-4 w-4", kpi.color)} />
            </div>
            <p className="text-2xl font-black">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <Card className="shadow-xl border-primary/10 overflow-hidden">
        <CardHeader className="bg-primary/5 border-b py-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-sm:w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search strategies by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white h-10"
              />
            </div>
            <div className="flex gap-2">
                <Badge variant="outline" className="bg-white/50 text-[9px] font-bold h-6">TOTAL: {displayOffers.length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading && offers?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Syncing Global Strategies...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-[10px] uppercase font-black py-4">Strategy Identity</TableHead>
                  <TableHead className="text-[10px] uppercase font-black py-4">Structure</TableHead>
                  <TableHead className="text-[10px] uppercase font-black py-4">Validity Period</TableHead>
                  <TableHead className="text-[10px] uppercase font-black py-4">Retailing Cohorts</TableHead>
                  <TableHead className="text-[10px] uppercase font-black py-4">Status</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-black py-4 pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOffers.map((offer) => (
                  <TableRow key={offer.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                          {offer.type === 'Bundle' ? <Package className="h-4 w-4 text-primary" /> : <Tag className="h-4 w-4 text-primary" />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-primary">{offer.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">ID: {offer.id?.slice(0, 12)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold bg-white">
                        {offer.type} • {offer.ancillaryIds?.length || 1} SKUs
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {offer.validity.from} → {offer.validity.to}
                        </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {offer.cohortIds?.length ? offer.cohortIds.map(c => (
                          <Badge key={c} variant="secondary" className="text-[9px] px-1.5 font-mono bg-indigo-50 text-indigo-700 border-indigo-100">{c}</Badge>
                        )) : <span className="text-[10px] text-muted-foreground italic font-medium flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Global Reach</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={offer.status === 'Active' ? 'default' : 'secondary'} className={cn("text-[9px] font-black uppercase tracking-wider", offer.status === 'Active' ? "bg-emerald-600" : "")}>
                        {offer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="hover:bg-muted h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground">Monetization Operations</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog(offer)} className="font-bold"><Edit className="mr-2 h-4 w-4"/>Modify Strategy</DropdownMenuItem>
                          <DropdownMenuItem><Zap className="mr-2 h-4 w-4"/>Run Simulation Trace</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive font-bold" onClick={() => offer.id && handleDelete(offer.id)}>
                            <Trash2 className="mr-2 h-4 w-4"/>Archive Offer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {displayOffers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-40">
                            <AlertCircle className="h-10 w-10" />
                            <p className="font-bold uppercase text-xs tracking-widest">No active retailing strategies found</p>
                        </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <OfferStrategyForm 
            offer={editingOffer} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
