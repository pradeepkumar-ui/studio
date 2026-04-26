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
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from '@/components/ui/dialog';
// import { MoreHorizontal, PlusCircle, Loader2, Building2, Search, History, Trash2, Edit, DollarSign } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/hooks/use-toast';
// import { AirportAncillaryAggregateForm, type AirportAncillaryAggregate } from '@/components/forms/airport-ancillary-aggregate-form';
// import { useFirestore, useCollection } from '@/firebase';
// import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// const initialMockAggregates: any[] = [
//     { id: 'HUB-AGG-001', configName: 'LHR T5 Lounge Optimization', ancillaryName: 'Executive Lounge Access', category: 'Lounge', basePrice: 45.00, currency: 'USD', status: 'Active' },
//     { id: 'HUB-AGG-002', configName: 'JFK Security Pacing Logic', ancillaryName: 'Fast Track Security', category: 'Priority service', basePrice: 15.00, currency: 'USD', status: 'Active' },
// ];

// export default function AirportAncillaryAggregatesPage() {
//   const firestore = useFirestore();
//   const aggregatesQuery = useMemo(() => firestore ? collection(firestore, 'airportAncillaryAggregates') : undefined, [firestore]);
//   const { data: aggregatesCollection, loading } = useCollection(aggregatesQuery);
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingAggregate, setEditingAggregate] = useState<any | null>(null);
//   const { toast } = useToast();

//   const displayAggregates = useMemo(() => {
//       const sourceData = (aggregatesCollection && aggregatesCollection.length > 0) ? aggregatesCollection as any[] : initialMockAggregates;
//       return sourceData.filter(a => 
//         a.configName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         a.ancillaryName?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//   }, [aggregatesCollection, searchTerm]);

//   const handleOpenDialog = (aggregate: any | null = null) => {
//     setEditingAggregate(aggregate);
//     setIsDialogOpen(true);
//   };

//   const handleFormSubmit = async (data: AirportAncillaryAggregate) => {
//     if (!firestore) return;
//     try {
//       if (editingAggregate?.id) {
//         const ref = doc(firestore, 'airportAncillaryAggregates', editingAggregate.id);
//         await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
//         toast({ title: 'Hub Logic Updated' });
//       } else {
//         await addDoc(collection(firestore, 'airportAncillaryAggregates'), { ...data, createdAt: serverTimestamp() });
//         toast({ title: 'New Hub Aggregate Registered' });
//       }
//     } catch (e: any) {
//         toast({ variant: 'destructive', title: 'Error', description: e.message });
//     }
//     setIsDialogOpen(false);
//   };

//   const handleDelete = async (id: string) => {
//     if (!firestore) return;
//     try {
//         await deleteDoc(doc(firestore, 'airportAncillaryAggregates', id));
//         toast({ title: 'Hub Configuration Archived', variant: 'destructive' });
//     } catch (e: any) {
//         toast({ variant: 'destructive', title: 'Error', description: e.message });
//     }
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex items-center justify-between">
//         <div className="flex flex-col gap-2">
//           <h1 className="text-3xl font-bold tracking-tight text-primary">Airport Ancillary Aggregate</h1>
//           <p className="text-muted-foreground">Manage exhaustive logic parameters and aggregate values for hub-specific ecosystem services.</p>
//         </div>
//         <Button onClick={() => handleOpenDialog()} className="font-bold">
//           <PlusCircle className="mr-2 h-4 w-4" />
//           Define Hub Aggregate
//         </Button>
//       </div>

//       <Card className="shadow-lg border-primary/10">
//         <CardHeader className="bg-primary/5">
//           <CardTitle className="text-lg">Hub Logic Registry</CardTitle>
//           <CardDescription>Unique retailing parameters for airport nodes, lounges, and ground partners.</CardDescription>
//         </CardHeader>
//         <CardContent className="pt-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by hub config or service..."
//                 value={searchTerm}
//                 onChange={(event) => setSearchTerm(event.target.value)}
//                 className="pl-9 bg-muted/20"
//               />
//             </div>
//           </div>
          
//           {loading && displayAggregates.length === 0 ? (
//              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
//            ) : (
//             <Table>
//               <TableHeader className="bg-muted/30">
//                 <TableRow>
//                   <TableHead className="text-[10px] uppercase font-black">Hub Logic Identity</TableHead>
//                   <TableHead className="text-[10px] uppercase font-black">Linked Hub Service</TableHead>
//                   <TableHead className="text-[10px] uppercase font-black">Base Price</TableHead>
//                   <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
//                   <TableHead className="text-right text-[10px] uppercase font-black">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {displayAggregates.map((item) => (
//                   <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                          <div className="p-2 bg-primary/10 rounded-xl transition-transform group-hover:scale-110">
//                             <Building2 className="h-4 w-4 text-primary" />
//                          </div>
//                          <div className="font-bold text-sm text-primary">{item.configName}</div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                         <div className="flex flex-col gap-0.5">
//                             <div className="text-xs font-semibold">{item.ancillaryName}</div>
//                             <Badge variant="outline" className="text-[9px] uppercase font-black w-fit">{item.category}</Badge>
//                         </div>
//                     </TableCell>
//                     <TableCell>
//                         <div className="flex items-center gap-1 font-mono font-black text-primary">
//                             <DollarSign className="h-3 w-3" />
//                             {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(item.basePrice || 0)}
//                             <span className="text-[9px] text-muted-foreground ml-1">{item.currency || 'USD'}</span>
//                         </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant={item.status === 'Active' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase tracking-wider">{item.status}</Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button size="icon" variant="ghost" className="hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-56">
//                           <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground">Hub Operations</DropdownMenuLabel>
//                           <DropdownMenuItem onClick={() => handleOpenDialog(item)}><Edit className="mr-2 h-4 w-4"/>Modify Hub Logic</DropdownMenuItem>
//                           <DropdownMenuItem><History className="mr-2 h-4 w-4"/>Audit Parameters</DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem className="text-destructive font-bold" onClick={() => item.id && handleDelete(item.id)}><Trash2 className="mr-2 h-4 w-4"/>Archive Hub SKU</DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//            )}
//         </CardContent>
//       </Card>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-5xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-black text-primary">Airport Ancillary Aggregate SKU</DialogTitle>
//             <DialogDescription className="font-medium">Define high-fidelity retailing parameters for hub-managed services and partner offerings.</DialogDescription>
//           </DialogHeader>
//           <AirportAncillaryAggregateForm
//             aggregate={editingAggregate}
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MoreHorizontal, PlusCircle, Loader2, Building2, Search, History, Trash2, Edit, DollarSign, Globe, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AirportAncillaryAggregateForm, type AirportAncillaryAggregate } from '@/components/forms/airport-ancillary-aggregate-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { StatsCards } from '@/components/StatsCards/StatsCards';
import { TableFilterBar } from '@/components/TableFilterbar/TableFilterBar';
import { useTableFilters } from '@/hooks/useTableFilters';

const initialMockAggregates: any[] = [
    { id: 'HUB-AGG-001', configName: 'LHR T5 Lounge Optimization', ancillaryName: 'Executive Lounge Access', category: 'Lounge', basePrice: 45.00, currency: 'USD', status: 'Active' },
    { id: 'HUB-AGG-002', configName: 'JFK Security Pacing Logic', ancillaryName: 'Fast Track Security', category: 'Priority service', basePrice: 15.00, currency: 'USD', status: 'Active' },
    { id: 'HUB-AGG-003', configName: 'SIN Premium Valet Parking', ancillaryName: 'VIP Valet Parking', category: 'Parking', basePrice: 35.00, currency: 'USD', status: 'Active' },
    { id: 'HUB-AGG-004', configName: 'DXB Meet & Greet Service', ancillaryName: 'Meet & Greet', category: 'Concierge', basePrice: 75.00, currency: 'USD', status: 'Onboarding' },
    { id: 'HUB-AGG-005', configName: 'CDG Priority Baggage', ancillaryName: 'Priority Baggage', category: 'Baggage', basePrice: 25.00, currency: 'EUR', status: 'Active' },
    { id: 'HUB-AGG-006', configName: 'FRA Nap Lounge Access', ancillaryName: 'Nap Lounge Access', category: 'Lounge', basePrice: 30.00, currency: 'EUR', status: 'Inactive' },
];

const STATS = [
  { label: "Total Hub Aggregates", value: 42, color: "purple" as const, icon: <Globe /> },
  { label: "Active",              value: 38, color: "green"  as const, icon: <CheckCircle2 /> },
  { label: "Onboarding",          value: 3,  color: "amber"  as const, icon: <RefreshCw  /> },
  { label: "Archived",            value: 1,  color: "red"    as const, icon: <AlertCircle /> },
];

// ─── Filter Options ───────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = ["Lounge", "Priority service", "Parking", "Concierge", "Baggage"].map((v) => ({ label: v, value: v }));
const STATUS_OPTIONS   = ["Active", "Onboarding", "Inactive"].map((v) => ({ label: v, value: v }));
const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "SGD"].map((v) => ({ label: v, value: v }));

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
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      Inactive
    </span>
  );
};

export default function AirportAncillaryAggregatesPage() {
  const firestore = useFirestore();
  const aggregatesQuery = useMemo(() => firestore ? collection(firestore, 'airportAncillaryAggregates') : undefined, [firestore]);
  const { data: aggregatesCollection, loading } = useCollection(aggregatesQuery);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAggregate, setEditingAggregate] = useState<any | null>(null);
  const { toast } = useToast();

  // Get source data
  const sourceData = useMemo(() => {
      return (aggregatesCollection && aggregatesCollection.length > 0) 
        ? aggregatesCollection as any[] 
        : initialMockAggregates;
  }, [aggregatesCollection]);

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
    searchFields: ["configName", "ancillaryName", "category"],
    filterFields: { status: "", category: "", currency: "" },
  });

  const handleOpenDialog = (aggregate: any | null = null) => {
    setEditingAggregate(aggregate);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: AirportAncillaryAggregate) => {
    if (!firestore) return;
    try {
      if (editingAggregate?.id) {
        const ref = doc(firestore, 'airportAncillaryAggregates', editingAggregate.id);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Hub Logic Updated' });
      } else {
        await addDoc(collection(firestore, 'airportAncillaryAggregates'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'New Hub Aggregate Registered' });
      }
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'airportAncillaryAggregates', id));
        toast({ title: 'Hub Configuration Archived', variant: 'destructive' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      <StatsCards cards={STATS} />

      <TableFilterBar
        searchText={searchText}
        onSearchChange={setSearchText}
        searchPlaceholder="Search by hub config name, service, or category..."
        dropdowns={[
          {
            key: "status",
            label: "Status",
            options: STATUS_OPTIONS,
            value: activeFilters.status ?? "All",
            onChange: (v) => setFilter("status", v),
          },
          {
            key: "category",
            label: "Category",
            options: CATEGORY_OPTIONS,
            value: activeFilters.category ?? "All",
            onChange: (v) => setFilter("category", v),
          },
          {
            key: "currency",
            label: "Currency",
            options: CURRENCY_OPTIONS,
            value: activeFilters.currency ?? "All",
            onChange: (v) => setFilter("currency", v),
          },
        ]}
        activeChips={activeChips}
        onRemoveChip={(k) => removeFilter(k as keyof any)}
        onClearAll={clearAll}
      />

      <Card className="border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-gray-900">Hub Logic Registry</CardTitle>
              <CardDescription className="mt-0.5 text-xs text-gray-400">
                Unique retailing parameters for airport nodes, lounges, and ground partners.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
              <button
                onClick={() => handleOpenDialog()}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-violet-700"
              >
                <PlusCircle className="h-4 w-4" />
                Define Hub Aggregate
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow className="border-b border-gray-200 hover:bg-gray-100">
                  <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 pl-6">Hub Logic Identity</TableHead>
                  <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Linked Hub Service</TableHead>
                  <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Base Price</TableHead>
                  <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</TableHead>
                  <TableHead className="py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500 pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id} className="transition-colors duration-100 hover:bg-violet-50/60">
                    <TableCell className="py-3.5 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-violet-100">
                          <Building2 className="h-4 w-4 text-violet-600" />
                        </div>
                        <div className="font-bold text-sm text-gray-900">{item.configName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <div className="text-xs font-semibold text-gray-700">{item.ancillaryName}</div>
                        <Badge variant="outline" className="text-[9px] uppercase font-black w-fit border-gray-200 bg-gray-50 text-gray-600">
                          {item.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1 font-mono font-black text-violet-700">
                        <DollarSign className="h-3 w-3" />
                        {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(item.basePrice || 0)}
                        <span className="text-[9px] text-gray-400 ml-1">{item.currency || 'USD'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="py-3.5 text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl border border-gray-100 shadow-xl">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase text-gray-500">Hub Operations</DropdownMenuLabel>
                          <DropdownMenuItem 
                            className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Edit className="mr-2 h-3.5 w-3.5" /> Modify Hub Logic
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-amber-50 hover:text-amber-700">
                            <History className="mr-2 h-3.5 w-3.5" /> Audit Parameters
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="cursor-pointer text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => item.id && handleDelete(item.id)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Archive Hub SKU
                          </DropdownMenuItem>
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
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary">Airport Ancillary Aggregate SKU</DialogTitle>
            <DialogDescription className="font-medium">Define high-fidelity retailing parameters for hub-managed services and partner offerings.</DialogDescription>
          </DialogHeader>
          <AirportAncillaryAggregateForm
            aggregate={editingAggregate}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}