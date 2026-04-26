// // 'use client';

// // import * as React from 'react';
// // import {
// //   MoreHorizontal,
// //   PlusCircle,
// //   Search,
// //   Plane,
// //   Loader2,
// //   Settings2,
// //   FileCode,
// //   ShieldCheck,
// //   Tag,
// //   Briefcase,
// // } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuTrigger,
// //   DropdownMenuSeparator,
// // } from '@/components/ui/dropdown-menu';
// // import { Input } from '@/components/ui/input';
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from '@/components/ui/table';
// // import { Badge } from '@/components/ui/badge';
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from '@/components/ui/card';
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogDescription,
// // } from '@/components/ui/dialog';
// // import { useToast } from '@/hooks/use-toast';
// // import { AncillaryForm, type Ancillary } from '@/components/forms/ancillary-form';
// // import { useFirestore, useCollection } from '@/firebase';
// // import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// // const mockAirlineAncillaries: any[] = [
// //   { id: '1', ancillaryCode: 'EXLG', name: 'Extra Legroom Seat', shortName: 'Legroom+', category: 'Seat', subcategory: 'Extra legroom seat', status: 'Active', version: 1, airlineCode: 'GAB', owningBusinessUnit: 'Revenue', providerName: 'Global Airways' },
// //   { id: '2', ancillaryCode: 'WIFU', name: 'Premium Wi-Fi (Unlimited)', shortName: 'Ultra Wi-Fi', category: 'Wi-Fi / connectivity', subcategory: 'Wi-Fi pass', status: 'Active', version: 2, airlineCode: 'GAB', owningBusinessUnit: 'Inflight', providerName: 'Global Airways' },
// //   { id: '3', ancillaryCode: 'UPGS', name: 'Standby Upgrade (J Class)', shortName: 'Standby Upgr', category: 'Upgrade', subcategory: 'Upgrade to business', status: 'Active', version: 1, airlineCode: 'SBA', owningBusinessUnit: 'Retailing', providerName: 'SkyBridge Airlines' },
// // ];

// // export default function AirlineAncillaryCataloguePage() {
// //   const firestore = useFirestore();
// //   const ancillariesQuery = React.useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
// //   const { data: ancillariesCollection, loading } = useCollection(ancillariesQuery);
  
// //   const [searchTerm, setSearchTerm] = React.useState('');
// //   const [isDialogOpen, setIsDialogOpen] = React.useState(false);
// //   const [editingAncillary, setEditingAncillary] = React.useState<Ancillary | null>(null);
// //   const { toast } = useToast();

// //   const displayAncillaries = (ancillariesCollection && ancillariesCollection.length > 0) 
// //     ? (ancillariesCollection as any[]) 
// //     : mockAirlineAncillaries;

// //   const filteredAncillaries = displayAncillaries.filter((anc) =>
// //     anc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
// //     anc.ancillaryCode?.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   const handleOpenDialog = (ancillary: any | null = null) => {
// //     setEditingAncillary(ancillary);
// //     setIsDialogOpen(true);
// //   };

// //   const handleFormSubmit = async (data: Ancillary) => {
// //     if (!firestore) return;
// //     try {
// //       if (editingAncillary?.id) {
// //         const ref = doc(firestore, 'airlineAncillaries', editingAncillary.id);
// //         await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
// //         toast({ title: 'Catalogue Updated', description: `${data.name} saved successfully.` });
// //       } else {
// //         await addDoc(collection(firestore, 'airlineAncillaries'), { ...data, createdAt: serverTimestamp() });
// //         toast({ title: 'Master Registry Entry', description: `${data.name} added to carrier portfolio.` });
// //       }
// //     } catch (e: any) {
// //         toast({ variant: 'destructive', title: 'Error', description: e.message });
// //     }
// //     setIsDialogOpen(false);
// //   };

// //   const handleDelete = async (id: string) => {
// //     if (!firestore) return;
// //     try {
// //         await deleteDoc(doc(firestore, 'airlineAncillaries', id));
// //         toast({ title: 'Item Decommissioned', variant: 'destructive' });
// //     } catch (e: any) {
// //         toast({ variant: 'destructive', title: 'Error', description: e.message });
// //     }
// //   }

// //   return (
// //     <div className="flex flex-col gap-6">
// //       <div className="flex items-center justify-between">
// //         <div className="flex flex-col gap-2">
// //           <h1 className="text-3xl font-bold tracking-tight">Airline Ancillary Master</h1>
// //           <p className="text-muted-foreground">Manage core master details, categorization, and ownership for carrier-specific ancillaries.</p>
// //         </div>
// //         <Button onClick={() => handleOpenDialog()} className="font-bold">
// //           <PlusCircle className="mr-2 h-4 w-4" />
// //           Create Ancillary Master
// //         </Button>
// //       </div>

// //       <Card>
// //         <CardHeader>
// //           <CardTitle>Carrier Catalogue Registry</CardTitle>
// //           <CardDescription>Unified registry of exhaustive carrier service logic and logical ownership.</CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="flex items-center justify-between py-4">
// //             <div className="relative flex-1 max-w-sm">
// //               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //               <Input
// //                 placeholder="Search master by name or code..."
// //                 value={searchTerm}
// //                 onChange={(event) => setSearchTerm(event.target.value)}
// //                 className="pl-9"
// //               />
// //             </div>
// //           </div>
          
// //           <div className="rounded-md border">
// //             <Table>
// //               <TableHeader className="bg-muted/30">
// //                 <TableRow>
// //                   <TableHead>Master Identity</TableHead>
// //                   <TableHead>Categorization</TableHead>
// //                   <TableHead>Carrier Ownership</TableHead>
// //                   <TableHead>Status</TableHead>
// //                   <TableHead className="text-right">Actions</TableHead>
// //                 </TableRow>
// //               </TableHeader>
// //               <TableBody>
// //                 {filteredAncillaries.map((anc) => (
// //                   <TableRow key={anc.id} className="group cursor-default">
// //                     <TableCell>
// //                       <div className="flex items-center gap-2">
// //                          <div className="p-2 bg-primary/10 rounded group-hover:scale-110 transition-transform">
// //                             <Tag className="h-4 w-4 text-primary" />
// //                          </div>
// //                          <div>
// //                             <div className="font-bold text-sm">{anc.name}</div>
// //                             <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{anc.ancillaryCode} • v{anc.version || 1}</div>
// //                          </div>
// //                       </div>
// //                     </TableCell>
// //                     <TableCell>
// //                         <div className="flex flex-col gap-0.5">
// //                             <Badge variant="outline" className="text-[9px] uppercase font-black w-fit">{anc.category}</Badge>
// //                             <span className="text-[10px] text-muted-foreground italic">{anc.subcategory}</span>
// //                         </div>
// //                     </TableCell>
// //                     <TableCell>
// //                       <div className="flex flex-col gap-0.5">
// //                          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
// //                             <Plane className="h-3 w-3" /> {anc.airlineCode}
// //                          </div>
// //                          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
// //                             <Briefcase className="h-2.5 w-2.5" /> {anc.owningBusinessUnit}
// //                          </div>
// //                       </div>
// //                     </TableCell>
// //                     <TableCell>
// //                       <Badge variant={anc.status === 'Active' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase">{anc.status}</Badge>
// //                     </TableCell>
// //                     <TableCell className="text-right">
// //                       <DropdownMenu>
// //                         <DropdownMenuTrigger asChild>
// //                           <Button size="icon" variant="ghost" className="hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></Button>
// //                         </DropdownMenuTrigger>
// //                         <DropdownMenuContent align="end" className="w-56">
// //                           <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground">Master Actions</DropdownMenuLabel>
// //                           <DropdownMenuItem onClick={() => handleOpenDialog(anc)}><Settings2 className="mr-2 h-4 w-4"/>Modify Master Details</DropdownMenuItem>
// //                           <DropdownMenuItem><FileCode className="mr-2 h-4 w-4"/>Check Version History</DropdownMenuItem>
// //                           <DropdownMenuSeparator />
// //                           <DropdownMenuItem className="text-destructive font-bold" onClick={() => anc.id && handleDelete(anc.id)}>Archive Master</DropdownMenuItem>
// //                         </DropdownMenuContent>
// //                       </DropdownMenu>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
// //         <DialogContent className="max-w-4xl">
// //           <DialogHeader>
// //             <DialogTitle className="text-2xl font-black">{editingAncillary ? 'Modify Ancillary Master' : 'Create New Ancillary Master'}</DialogTitle>
// //             <DialogDescription>Define exhaustive core details, classification, and logical ownership for this carrier SKU.</DialogDescription>
// //           </DialogHeader>
// //           <AncillaryForm
// //             ancillary={editingAncillary}
// //             onSubmit={handleFormSubmit}
// //             onCancel={() => setIsDialogOpen(false)}
// //           />
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // }



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
  Globe,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
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
import { StatsCards } from '@/components/StatsCards/StatsCards';
import { TableFilterBar } from '@/components/TableFilterbar/TableFilterBar';
import { useTableFilters } from '@/hooks/useTableFilters';

const mockAirlineAncillaries: any[] = [
  { id: '1', ancillaryCode: 'EXLG', name: 'Extra Legroom Seat', shortName: 'Legroom+', category: 'Seat', subcategory: 'Extra legroom seat', status: 'Active', version: 1, airlineCode: 'GAB', owningBusinessUnit: 'Revenue', providerName: 'Global Airways' },
  { id: '2', ancillaryCode: 'WIFU', name: 'Premium Wi-Fi (Unlimited)', shortName: 'Ultra Wi-Fi', category: 'Wi-Fi / connectivity', subcategory: 'Wi-Fi pass', status: 'Active', version: 2, airlineCode: 'GAB', owningBusinessUnit: 'Inflight', providerName: 'Global Airways' },
  { id: '3', ancillaryCode: 'UPGS', name: 'Standby Upgrade (J Class)', shortName: 'Standby Upgr', category: 'Upgrade', subcategory: 'Upgrade to business', status: 'Active', version: 1, airlineCode: 'SBA', owningBusinessUnit: 'Retailing', providerName: 'SkyBridge Airlines' },
  { id: '4', ancillaryCode: 'BAGG', name: 'Priority Baggage', shortName: 'Priority Bag', category: 'Baggage', subcategory: 'Priority handling', status: 'Active', version: 1, airlineCode: 'GAB', owningBusinessUnit: 'Operations', providerName: 'Global Airways' },
  { id: '5', ancillaryCode: 'MEAL', name: 'Premium Meal', shortName: 'Gourmet Meal', category: 'Meal', subcategory: 'Premium dining', status: 'Onboarding', version: 1, airlineCode: 'SBA', owningBusinessUnit: 'Inflight', providerName: 'SkyBridge Airlines' },
  { id: '6', ancillaryCode: 'LOUN', name: 'Lounge Access', shortName: 'Lounge Pass', category: 'Lounge', subcategory: 'Airport lounge', status: 'Active', version: 2, airlineCode: 'MLN', owningBusinessUnit: 'Loyalty', providerName: 'MetroLink Air' },
  { id: '7', ancillaryCode: 'PETS', name: 'Pet in Cabin', shortName: 'Pet Travel', category: 'Special', subcategory: 'Pet transport', status: 'Inactive', version: 1, airlineCode: 'GAB', owningBusinessUnit: 'Customer', providerName: 'Global Airways' },
];

// ─── Filter Options ───────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = ["Seat", "Baggage", "Meal", "Lounge", "Upgrade", "Wi-Fi / connectivity", "Special"].map((v) => ({ label: v, value: v }));
const STATUS_OPTIONS   = ["Active", "Onboarding", "Inactive"].map((v) => ({ label: v, value: v }));
const AIRLINE_OPTIONS  = ["GAB", "SBA", "MLN"].map((v) => ({ label: v, value: v }));

export default function AirlineAncillaryCataloguePage() {
  const firestore = useFirestore();
  const ancillariesQuery = React.useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
  const { data: ancillariesCollection, loading } = useCollection(ancillariesQuery);
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingAncillary, setEditingAncillary] = React.useState<Ancillary | null>(null);
  const { toast } = useToast();

  // Get source data
  const sourceData = React.useMemo(() => {
    return (ancillariesCollection && ancillariesCollection.length > 0) 
      ? (ancillariesCollection as any[]) 
      : mockAirlineAncillaries;
  }, [ancillariesCollection]);

  // ─── Dynamic Stats based on actual data ───────────────────────────────────────
  const dynamicStats = React.useMemo(() => {
    const total = sourceData.length;
    const active = sourceData.filter((a) => a.status === 'Active').length;
    const onboarding = sourceData.filter((a) => a.status === 'Onboarding').length;
    const retired = sourceData.filter((a) => a.status === 'Inactive').length;
    
    return [
      { label: "Total Ancillaries", value: total, color: "purple" as const, icon: <Globe /> },
      { label: "Active", value: active, color: "green" as const, icon: <CheckCircle2 /> },
      { label: "Onboarding", value: onboarding, color: "amber" as const, icon: <RefreshCw /> },
      { label: "Retired", value: retired, color: "red" as const, icon: <AlertCircle /> },
    ];
  }, [sourceData]);

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
    searchFields: ["name", "ancillaryCode", "category", "airlineCode"],
    filterFields: { status: "", category: "", airlineCode: "" },
  });

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
    <div className="flex flex-col gap-6 min-h-screen">
      <StatsCards cards={dynamicStats} />

      <TableFilterBar
        searchText={searchText}
        onSearchChange={setSearchText}
        searchPlaceholder="Search by name, code, category, or carrier..."
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
            key: "airlineCode",
            label: "Carrier",
            options: AIRLINE_OPTIONS,
            value: activeFilters.airlineCode ?? "All",
            onChange: (v) => setFilter("airlineCode", v),
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
              <CardTitle className="text-base font-bold text-gray-900">Carrier Catalogue Registry</CardTitle>
              <CardDescription className="mt-0.5 text-xs text-gray-400">
                Unified registry of exhaustive carrier service logic and logical ownership.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
              <button
                onClick={() => handleOpenDialog()}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-violet-700"
              >
                <PlusCircle className="h-4 w-4" />
                Create Ancillary Master
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="rounded-md border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow className="border-b border-gray-200 hover:bg-gray-100">
                  <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Master Identity</TableHead>
                  <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Categorization</TableHead>
                  <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Carrier Ownership</TableHead>
                  <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</TableHead>
                  <TableHead className="py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((anc) => (
                  <TableRow key={anc.id} className="transition-colors duration-100 hover:bg-violet-50/60">
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-violet-100">
                          <Tag className="h-4 w-4 text-violet-600" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-900">{anc.name}</div>
                          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                            {anc.ancillaryCode} • v{anc.version || 1}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <Badge variant="outline" className="text-[9px] uppercase font-black w-fit border-gray-300 bg-gray-50 text-gray-700">
                          {anc.category}
                        </Badge>
                        <span className="text-[10px] text-gray-400 italic">{anc.subcategory}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-violet-700">
                          <Plane className="h-3 w-3" /> {anc.airlineCode}
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Briefcase className="h-2.5 w-2.5" /> {anc.owningBusinessUnit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      {anc.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Active
                        </span>
                      ) : anc.status === 'Onboarding' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700">
                          Onboarding
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-3.5 text-right">
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
                          <DropdownMenuLabel className="text-[10px] font-black uppercase text-gray-500">Master Actions</DropdownMenuLabel>
                          <DropdownMenuItem 
                            className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                            onClick={() => handleOpenDialog(anc)}
                          >
                            <Settings2 className="mr-2 h-3.5 w-3.5" /> Modify Master Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-amber-50 hover:text-amber-700">
                            <FileCode className="mr-2 h-3.5 w-3.5" /> Check Version History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="cursor-pointer text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => anc.id && handleDelete(anc.id)}
                          >
                            Archive Master
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