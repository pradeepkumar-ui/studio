// 'use client';

// import { useState, useMemo } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//   Dialog,
//   DialogContent,
// } from '@/components/ui/dialog';
// import { 
//   MoreHorizontal, 
//   PlusCircle, 
//   Loader2, 
//   Search, 
//   Package, 
//   Tag, 
//   ShieldCheck, 
//   Users,
//   Trash2,
//   Edit,
//   Zap,
//   TrendingUp,
//   AlertCircle,
//   Calendar
// } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/hooks/use-toast';
// import { useFirestore, useCollection } from '@/firebase';
// import { collection, addDoc, doc, setDoc, serverTimestamp, deleteDoc, query, orderBy } from 'firebase/firestore';
// import { Input } from '@/components/ui/input';
// import { OfferStrategyForm, type OfferStrategy } from '@/components/pricing/offer-strategy-form';
// import { cn } from '@/lib/utils';

// const mockOfferStrategies: OfferStrategy[] = [
//     {
//         id: 'OFR-STRAT-001',
//         name: 'Holiday Family Comfort Bundle',
//         type: 'Bundle',
//         ancillaryIds: ['AGG-001', 'AGG-002'],
//         status: 'Active',
//         validity: { from: '2025-11-01', to: '2026-01-15' },
//         cohortIds: ['FAMILY_TRIP', 'LEISURE_PROMO'],
//         pricing: { type: 'PercentageDiscount', value: 20, currency: 'INR' },
//         dynamicPricing: { enabled: true, ruleType: 'TimeBased', threshold: 'T-7 Days', adjustmentPercent: 10 },
//         guardRails: { minPrice: 45, maxPrice: 120 }
//     },
//     {
//         id: 'OFR-STRAT-002',
//         name: 'Business Priority Plus',
//         type: 'Bundle',
//         ancillaryIds: ['AGG-003', 'AGG-004'],
//         status: 'Active',
//         validity: { from: '2025-10-01', to: '2026-12-31' },
//         cohortIds: ['PLAT_SOLO_BIZ', 'CORP_PREMIUM'],
//         pricing: { type: 'FixedPrice', value: 85, currency: 'INR' },
//         dynamicPricing: { enabled: false, ruleType: 'InventoryBased', adjustmentPercent: 0 },
//         guardRails: { minPrice: 75, maxPrice: 150 }
//     },
//     {
//         id: 'OFR-STRAT-003',
//         name: 'Last Minute Wi-Fi Special',
//         type: 'Single',
//         ancillaryIds: ['AGG-005'],
//         status: 'Active',
//         validity: { from: '2025-01-01', to: '2025-12-31' },
//         cohortIds: [],
//         pricing: { type: 'PercentageDiscount', value: 15, currency: 'INR' },
//         dynamicPricing: { enabled: true, ruleType: 'TimeBased', threshold: '< 24 Hours', adjustmentPercent: 5 },
//         guardRails: { minPrice: 5, maxPrice: 25 }
//     },
//     {
//         id: 'OFR-STRAT-004',
//         name: 'Student Explorer Program',
//         type: 'Single',
//         ancillaryIds: ['AGG-001'],
//         status: 'Active',
//         validity: { from: '2025-06-01', to: '2025-09-30' },
//         cohortIds: ['STUDENT_INTL'],
//         pricing: { type: 'FixedDiscount', value: 25, currency: 'INR' },
//         dynamicPricing: { enabled: false, ruleType: 'TimeBased', adjustmentPercent: 0 },
//         guardRails: { minPrice: 10, maxPrice: 50 }
//     },
//     {
//         id: 'OFR-STRAT-005',
//         name: 'Early Bird Summer 2025',
//         type: 'Single',
//         ancillaryIds: ['AGG-002'],
//         status: 'Draft',
//         validity: { from: '2025-01-01', to: '2025-03-31' },
//         cohortIds: ['EARLY_BOOKER'],
//         pricing: { type: 'PercentageDiscount', value: 30, currency: 'INR' },
//         dynamicPricing: { enabled: false, ruleType: 'TimeBased', adjustmentPercent: 0 },
//         guardRails: { minPrice: 20, maxPrice: 100 }
//     },
//     {
//         id: 'OFR-STRAT-006',
//         name: 'Premium Transit Lounge Access',
//         type: 'Bundle',
//         ancillaryIds: ['AGG-003', 'AGG-005'],
//         status: 'Active',
//         validity: { from: '2025-01-01', to: '2025-12-31' },
//         cohortIds: ['LONG_HAUL_TRANSIT'],
//         pricing: { type: 'FixedPrice', value: 55, currency: 'INR' },
//         dynamicPricing: { enabled: true, ruleType: 'InventoryBased', threshold: '< 20% Capacity', adjustmentPercent: 15 },
//         guardRails: { minPrice: 50, maxPrice: 90 }
//     },
//     {
//         id: 'OFR-STRAT-007',
//         name: 'Corporate Multi-Bag Pass',
//         type: 'Single',
//         ancillaryIds: ['AGG-001'],
//         status: 'Active',
//         validity: { from: '2025-01-01', to: '2025-12-31' },
//         cohortIds: ['CORP_HEAVY_TRAVEL'],
//         pricing: { type: 'FixedPrice', value: 30, currency: 'INR' },
//         dynamicPricing: { enabled: true, ruleType: 'InventoryBased', threshold: 'Hold > 80%', adjustmentPercent: 20 },
//         guardRails: { minPrice: 30, maxPrice: 60 }
//     }
// ];

// export default function AirlineOffersPage() {
//   const firestore = useFirestore();
//   const { toast } = useToast();
  
//   const offersQuery = useMemo(() => 
//     firestore ? query(collection(firestore, 'offers'), orderBy('createdAt', 'desc')) : undefined
//   , [firestore]);
  
//   const { data: offers, loading } = useCollection(offersQuery);
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingOffer, setEditingOffer] = useState<OfferStrategy | null>(null);

//   const displayOffers = useMemo(() => {
//     const sourceData = (offers && offers.length > 0) ? (offers as OfferStrategy[]) : mockOfferStrategies;
//     if (!searchTerm) return sourceData;
//     return sourceData.filter(o => 
//       o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       o.id?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [offers, searchTerm]);

//   const handleOpenDialog = (offer: OfferStrategy | null = null) => {
//     setEditingOffer(offer);
//     setIsDialogOpen(true);
//   };

//   const handleFormSubmit = async (data: OfferStrategy) => {
//     if (!firestore) return;
//     try {
//       if (editingOffer?.id && !editingOffer.id.startsWith('OFR-STRAT')) {
//         const ref = doc(firestore, 'offers', editingOffer.id);
//         await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
//         toast({ title: 'Strategy Synchronized', description: `Successfully updated ${data.name}.` });
//       } else {
//         await addDoc(collection(firestore, 'offers'), { 
//           ...data, 
//           createdAt: serverTimestamp(),
//           updatedAt: serverTimestamp() 
//         });
//         toast({ title: 'New Strategy Published', description: `Retailing offer ${data.name} is now live.` });
//       }
//       setIsDialogOpen(false);
//     } catch (e: any) {
//       toast({ variant: 'destructive', title: 'Sync Error', description: e.message });
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!firestore) return;
//     if (id.startsWith('OFR-STRAT')) {
//         toast({ title: 'System Record', description: 'Mock records cannot be deleted from live storage.' });
//         return;
//     }
//     try {
//       await deleteDoc(doc(firestore, 'offers', id));
//       toast({ title: 'Strategy Removed', variant: 'destructive' });
//     } catch (e: any) {
//       toast({ variant: 'destructive', title: 'Delete Failed', description: e.message });
//     }
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex items-center justify-between">
//         <div className="flex flex-col gap-1">
//           <h1 className="text-3xl font-black tracking-tight text-primary uppercase">Airline Offers Cockpit</h1>
//           <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Carrier Retailing & Dynamic Monetization Engine</p>
//         </div>
//         <Button onClick={() => handleOpenDialog()} className="font-bold shadow-lg h-11 px-8">
//           <PlusCircle className="mr-2 h-4 w-4" /> Create Offer Strategy
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         {[
//           { label: 'Active Strategies', value: displayOffers.filter(o => o.status === 'Active').length, icon: Tag, color: 'text-primary' },
//           { label: 'Dynamic Flex Enabled', value: displayOffers.filter(o => o.dynamicPricing?.enabled).length, icon: Zap, color: 'text-amber-500' },
//           { label: 'Segmented Targeting', value: displayOffers.filter(o => o.cohortIds && o.cohortIds.length > 0).length, icon: Users, color: 'text-blue-600' },
//           { label: 'Commercial Sync', value: '100%', icon: ShieldCheck, color: 'text-emerald-500' }
//         ].map((kpi) => (
//           <Card key={kpi.label} className="p-6 bg-white shadow-sm border-primary/5">
//             <div className="flex justify-between items-center mb-2">
//               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.label}</p>
//               <kpi.icon className={cn("h-4 w-4", kpi.color)} />
//             </div>
//             <p className="text-2xl font-black">{kpi.value}</p>
//           </Card>
//         ))}
//       </div>

//       <Card className="shadow-xl border-primary/10 overflow-hidden">
//         <CardHeader className="bg-primary/5 border-b py-4">
//           <div className="flex items-center justify-between">
//             <div className="relative flex-1 max-sm:w-full max-w-sm">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search strategies by name or ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9 bg-white h-10"
//               />
//             </div>
//             <div className="flex gap-2">
//                 <Badge variant="outline" className="bg-white/50 text-[9px] font-bold h-6">TOTAL: {displayOffers.length}</Badge>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="p-0">
//           {loading && offers?.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-24 gap-3">
//                 <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
//                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Syncing Global Strategies...</p>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader className="bg-muted/30">
//                 <TableRow>
//                   <TableHead className="text-[10px] uppercase font-black py-4">Strategy Identity</TableHead>
//                   <TableHead className="text-[10px] uppercase font-black py-4">Structure</TableHead>
//                   <TableHead className="text-[10px] uppercase font-black py-4">Validity Period</TableHead>
//                   <TableHead className="text-[10px] uppercase font-black py-4">Retailing Cohorts</TableHead>
//                   <TableHead className="text-[10px] uppercase font-black py-4">Status</TableHead>
//                   <TableHead className="text-right text-[10px] uppercase font-black py-4 pr-6">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {displayOffers.map((offer) => (
//                   <TableRow key={offer.id} className="group hover:bg-muted/50 transition-colors">
//                     <TableCell className="py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
//                           {offer.type === 'Bundle' ? <Package className="h-4 w-4 text-primary" /> : <Tag className="h-4 w-4 text-primary" />}
//                         </div>
//                         <div>
//                           <div className="font-bold text-sm text-primary">{offer.name}</div>
//                           <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">ID: {offer.id?.slice(0, 12)}</div>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="outline" className="text-[10px] uppercase font-bold bg-white">
//                         {offer.type} • {offer.ancillaryIds?.length || 1} SKUs
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                         <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted-foreground">
//                             <Calendar className="h-3 w-3" />
//                             {offer.validity.from} → {offer.validity.to}
//                         </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex flex-wrap gap-1 max-w-[200px]">
//                         {offer.cohortIds?.length ? offer.cohortIds.map(c => (
//                           <Badge key={c} variant="secondary" className="text-[9px] px-1.5 font-mono bg-indigo-50 text-indigo-700 border-indigo-100">{c}</Badge>
//                         )) : <span className="text-[10px] text-muted-foreground italic font-medium flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Global Reach</span>}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant={offer.status === 'Active' ? 'default' : 'secondary'} className={cn("text-[9px] font-black uppercase tracking-wider", offer.status === 'Active' ? "bg-emerald-600" : "")}>
//                         {offer.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right pr-6">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button size="icon" variant="ghost" className="hover:bg-muted h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-56">
//                           <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground">Monetization Operations</DropdownMenuLabel>
//                           <DropdownMenuItem onClick={() => handleOpenDialog(offer)} className="font-bold"><Edit className="mr-2 h-4 w-4"/>Modify Strategy</DropdownMenuItem>
//                           <DropdownMenuItem><Zap className="mr-2 h-4 w-4"/>Run Simulation Trace</DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem className="text-destructive font-bold" onClick={() => offer.id && handleDelete(offer.id)}>
//                             <Trash2 className="mr-2 h-4 w-4"/>Archive Offer
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 {displayOffers.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={6} className="h-48 text-center">
//                         <div className="flex flex-col items-center gap-2 opacity-40">
//                             <AlertCircle className="h-10 w-10" />
//                             <p className="font-bold uppercase text-xs tracking-widest">No active retailing strategies found</p>
//                         </div>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
//           <OfferStrategyForm 
//             offer={editingOffer} 
//             onSubmit={handleFormSubmit} 
//             onCancel={() => setIsDialogOpen(false)} 
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }




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
  Calendar,
  Globe,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { OfferStrategyForm, type OfferStrategy } from '@/components/pricing/offer-strategy-form';
import { cn } from '@/lib/utils';
import { StatsCards } from '@/components/StatsCards/StatsCards';
import { TableFilterBar } from '@/components/TableFilterbar/TableFilterBar';
import { useTableFilters } from '@/hooks/useTableFilters';

const mockOfferStrategies: OfferStrategy[] = [
    {
        id: 'OFR-STRAT-001',
        name: 'Holiday Family Comfort Bundle',
        type: 'Bundle',
        ancillaryIds: ['AGG-001', 'AGG-002'],
        status: 'Active',
        validity: { from: '2025-11-01', to: '2026-01-15' },
        cohortIds: ['FAMILY_TRIP', 'LEISURE_PROMO'],
        pricing: { type: 'PercentageDiscount', value: 20, currency: 'INR' },
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
        pricing: { type: 'FixedPrice', value: 85, currency: 'INR' },
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
        pricing: { type: 'PercentageDiscount', value: 15, currency: 'INR' },
        dynamicPricing: { enabled: true, ruleType: 'TimeBased', threshold: '< 24 Hours', adjustmentPercent: 5 },
        guardRails: { minPrice: 5, maxPrice: 25 }
    },
    {
        id: 'OFR-STRAT-004',
        name: 'Student Explorer Program',
        type: 'Single',
        ancillaryIds: ['AGG-001'],
        status: 'Onboarding',
        validity: { from: '2025-06-01', to: '2025-09-30' },
        cohortIds: ['STUDENT_INTL'],
        pricing: { type: 'FixedDiscount', value: 25, currency: 'INR' },
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
        pricing: { type: 'PercentageDiscount', value: 30, currency: 'INR' },
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
        pricing: { type: 'FixedPrice', value: 55, currency: 'INR' },
        dynamicPricing: { enabled: true, ruleType: 'InventoryBased', threshold: '< 20% Capacity', adjustmentPercent: 15 },
        guardRails: { minPrice: 50, maxPrice: 90 }
    },
    {
        id: 'OFR-STRAT-007',
        name: 'Corporate Multi-Bag Pass',
        type: 'Single',
        ancillaryIds: ['AGG-001'],
        status: 'Inactive',
        validity: { from: '2025-01-01', to: '2025-12-31' },
        cohortIds: ['CORP_HEAVY_TRAVEL'],
        pricing: { type: 'FixedPrice', value: 30, currency: 'INR' },
        dynamicPricing: { enabled: true, ruleType: 'InventoryBased', threshold: 'Hold > 80%', adjustmentPercent: 20 },
        guardRails: { minPrice: 30, maxPrice: 60 }
    }
];

const STATS = [
  { label: "Total Strategies", value: 42, color: "purple" as const, icon: <Globe /> },
  { label: "Active",           value: 38, color: "green"  as const, icon: <CheckCircle2 /> },
  { label: "Onboarding",       value: 3,  color: "amber"  as const, icon: <RefreshCw  /> },
  { label: "Archived",         value: 1,  color: "red"    as const, icon: <AlertCircle /> },
];

// ─── Filter Options ───────────────────────────────────────────────────────────
const TYPE_OPTIONS    = ["Bundle", "Single"].map((v) => ({ label: v, value: v }));
const STATUS_OPTIONS  = ["Active", "Onboarding", "Draft", "Inactive"].map((v) => ({ label: v, value: v }));
const DYNAMIC_OPTIONS = [
    { label: "Dynamic Enabled", value: "true" },
    { label: "Static Only", value: "false" }
];

// ─── Status Badge Component ───────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
        Active
      </span>
    );
  }
  if (status === 'Onboarding') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700">
        Onboarding
      </span>
    );
  }
  if (status === 'Draft') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
        Draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      Inactive
    </span>
  );
};

export default function AirlineOffersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const offersQuery = useMemo(() => 
    firestore ? query(collection(firestore, 'offers'), orderBy('createdAt', 'desc')) : undefined
  , [firestore]);
  
  const { data: offers, loading } = useCollection(offersQuery);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferStrategy | null>(null);

  // Get source data
  const sourceData = useMemo(() => {
    return (offers && offers.length > 0) ? (offers as OfferStrategy[]) : mockOfferStrategies;
  }, [offers]);

  // ─── Table Filters Hook ───────────────────────────────────────────────────────
  const {
    searchText,
    setSearchText,
    activeFilters,
    setFilter,
    removeFilter,
    clearAll,
    activeChips,
    filtered,
  } = useTableFilters(sourceData, {
    searchFields: ["name", "id"],
    filterFields: { status: "", type: "", dynamicPricing: "" },
  });

  // Custom filter for dynamic pricing
  const getFilteredData = () => {
    let data = [...sourceData];
    
    // Apply search
    if (searchText) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.id?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeFilters.status && activeFilters.status !== "All") {
      data = data.filter(item => item.status === activeFilters.status);
    }
    
    // Apply type filter
    if (activeFilters.type && activeFilters.type !== "All") {
      data = data.filter(item => item.type === activeFilters.type);
    }
    
    // Apply dynamic pricing filter
    if (activeFilters.dynamicPricing && activeFilters.dynamicPricing !== "All") {
      const isDynamicEnabled = activeFilters.dynamicPricing === "true";
      data = data.filter(item => item.dynamicPricing?.enabled === isDynamicEnabled);
    }
    
    return data;
  };

  const displayOffers = getFilteredData();

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

  // Calculate KPIs
  const activeCount = sourceData.filter((o: OfferStrategy) => o.status === 'Active').length;
  const dynamicCount = sourceData.filter((o: OfferStrategy) => o.dynamicPricing?.enabled === true).length;
  const segmentedCount = sourceData.filter((o: OfferStrategy) => o.cohortIds && o.cohortIds.length > 0).length;

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      {/* <StatsCards cards={STATS} /> */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Strategies', value: activeCount, icon: Tag, color: 'text-violet-600' },
          { label: 'Dynamic Flex Enabled', value: dynamicCount, icon: Zap, color: 'text-amber-500' },
          { label: 'Segmented Targeting', value: segmentedCount, icon: Users, color: 'text-blue-600' },
          { label: 'Commercial Sync', value: '100%', icon: ShieldCheck, color: 'text-emerald-500' }
        ].map((kpi) => (
          <Card key={kpi.label} className="p-4 border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
              <kpi.icon className={cn("h-4 w-4", kpi.color)} />
            </div>
            <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <TableFilterBar
        searchText={searchText}
        onSearchChange={setSearchText}
        searchPlaceholder="Search strategies by name or ID..."
        dropdowns={[
          {
            key: "status",
            label: "Status",
            options: STATUS_OPTIONS,
            value: activeFilters.status ?? "All",
            onChange: (v) => setFilter("status", v),
          },
          {
            key: "type",
            label: "Type",
            options: TYPE_OPTIONS,
            value: activeFilters.type ?? "All",
            onChange: (v) => setFilter("type", v),
          },
          {
            key: "dynamicPricing",
            label: "Dynamic Pricing",
            options: DYNAMIC_OPTIONS,
            value: activeFilters.dynamicPricing ?? "All",
            onChange: (v) => setFilter("dynamicPricing", v),
          },
        ]}
        activeChips={activeChips}
        onRemoveChip={(k) => removeFilter(k as keyof any)}
        onClearAll={clearAll}
      />


      <Card className="border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)] overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-gray-900">Airline Segment Registry</CardTitle>
              <CardDescription className="mt-0.5 text-xs text-gray-400">
                Configure cohorts based on passenger type, loyalty status, and travel behavior signals.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-gray-50 text-gray-600 text-[9px] font-bold h-6 border-gray-200">
                TOTAL: {displayOffers.length}
              </Badge>
              <button
                onClick={() => handleOpenDialog()}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-violet-700"
              >
                <PlusCircle className="h-4 w-4" />
                Create Offer Strategy
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading && offers?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-violet-600/40" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syncing Global Strategies...</p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 overflow-hidden m-6 mt-0">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow className="border-b border-gray-200 hover:bg-gray-100">
                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 pl-6">Strategy Identity</TableHead>
                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Structure</TableHead>
                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Validity Period</TableHead>
                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Retailing Cohorts</TableHead>
                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</TableHead>
                    <TableHead className="py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500 pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayOffers.map((offer) => (
                    <TableRow key={offer.id} className="transition-colors duration-100 hover:bg-violet-50/60">
                      <TableCell className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-violet-100">
                            {offer.type === 'Bundle' ? <Package className="h-4 w-4 text-violet-600" /> : <Tag className="h-4 w-4 text-violet-600" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900">{offer.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">ID: {offer.id?.slice(0, 12)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold bg-white border-gray-200 text-gray-700">
                          {offer.type} • {offer.ancillaryIds?.length || 1} SKUs
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {offer.validity.from} → {offer.validity.to}
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {offer.cohortIds?.length ? offer.cohortIds.map(c => (
                            <Badge key={c} variant="secondary" className="text-[9px] px-1.5 font-mono bg-indigo-50 text-indigo-700 border-indigo-100">
                              {c}
                            </Badge>
                          )) : <span className="text-[10px] text-gray-400 italic font-medium flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Global Reach</span>}
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <StatusBadge status={offer.status || 'Active'} />
                      </TableCell>
                      <TableCell className="py-3.5 text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-xl border border-gray-100 shadow-xl">
                            <DropdownMenuLabel className="text-[10px] uppercase font-black text-gray-500">Monetization Operations</DropdownMenuLabel>
                            <DropdownMenuItem 
                              className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                              onClick={() => handleOpenDialog(offer)}
                            >
                              <Edit className="mr-2 h-3.5 w-3.5" /> Modify Strategy
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-amber-50 hover:text-amber-700">
                              <Zap className="mr-2 h-3.5 w-3.5" /> Run Simulation Trace
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="cursor-pointer text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => offer.id && handleDelete(offer.id)}
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" /> Archive Offer
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
                          <AlertCircle className="h-10 w-10 text-gray-400" />
                          <p className="font-bold uppercase text-xs tracking-widest text-gray-500">No active retailing strategies found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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