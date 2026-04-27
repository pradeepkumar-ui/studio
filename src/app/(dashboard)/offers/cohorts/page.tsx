// 'use client';

// import { useState } from 'react';
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
// import { 
//   MoreHorizontal, 
//   PlusCircle, 
//   Loader2, 
//   Target, 
//   Plane, 
//   ShieldCheck, 
//   Activity,
//   Users
// } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/hooks/use-toast';
// import { CohortForm, type Cohort } from '@/components/forms/cohort-form';
// import { useFirestore, useCollection } from '@/firebase';
// import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// const mockCohorts: Cohort[] = [
//     { 
//         id: 'COH-001', 
//         name: 'Platinum Solo Business', 
//         cohortId: 'PLAT_SOLO_BIZ', 
//         status: 'Active', 
//         domain: 'Airline',
//         description: 'Platinum members traveling solo on business routes.', 
//         type: 'dynamic',
//         priority: 95,
//     },
//     { 
//         id: 'COH-002', 
//         name: 'India POS Web Promo', 
//         cohortId: 'IN_WEB_PROMO', 
//         status: 'Active', 
//         domain: 'Airline',
//         description: 'Web direct search from India Point of Sale.', 
//         type: 'static',
//         priority: 50,
//     },
//      { 
//         id: 'COH-003', 
//         name: 'Last Minute Family - US', 
//         cohortId: 'US_FAM_LM', 
//         status: 'Active', 
//         domain: 'Airline',
//         description: 'Families booking US domestic routes within 48h of departure.', 
//         type: 'dynamic',
//         priority: 75,
//     },
// ];

// export default function CohortsPage() {
//   const firestore = useFirestore();
//   const { data: cohortsCollection, loading } = useCollection(firestore ? collection(firestore, 'cohorts') : undefined);

//   const cohorts = cohortsCollection ? cohortsCollection as Cohort[] : [];
//   const displayCohorts = cohorts.length > 0 ? cohorts : mockCohorts;

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
//   const { toast } = useToast();

//   const handleOpenDialog = (cohort: Cohort | null = null) => {
//     setEditingCohort(cohort);
//     setIsDialogOpen(true);
//   };

//   const handleFormSubmit = async (data: Cohort) => {
//     if (!firestore) return;
//     try {
//       if (editingCohort?.id) {
//         const cohortRef = doc(firestore, 'cohorts', editingCohort.id);
//         await setDoc(cohortRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
//         toast({ title: 'Cohort Updated', description: `Segment "${data.name}" successfully updated.` });
//       } else {
//         await addDoc(collection(firestore, 'cohorts'), { ...data, domain: 'Airline', createdAt: serverTimestamp() });
//         toast({ title: 'Cohort Created', description: `Segment "${data.name}" is now live.` });
//       }
//     } catch (e: any) {
//         toast({ variant: "destructive", title: "Error", description: e.message });
//     }
//     setIsDialogOpen(false);
//   };

//   const handleDelete = async (cohortId: string) => {
//     if (!cohortId || !firestore) return;
//     try {
//       await deleteDoc(doc(firestore, 'cohorts', cohortId));
//       toast({ variant: 'destructive', title: 'Cohort Removed' });
//     } catch (e: any) {
//       toast({ variant: "destructive", title: "Error", description: e.message });
//     }
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex items-center justify-between">
//         <div className="flex flex-col gap-2">
//           <h1 className="text-3xl font-bold tracking-tight text-primary">Airline Cohorts</h1>
//           <p className="text-muted-foreground">Manage logical segments for targeted carrier-specific retailing orchestration.</p>
//         </div>
//         <Button onClick={() => handleOpenDialog()} className="font-bold">
//           <PlusCircle className="mr-2 h-4 w-4" />
//           Define Airline Segment
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card className="p-6">
//               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Target className="w-3 h-3 text-primary" /> Active Segments</p>
//               <p className="text-2xl font-black mt-2">{displayCohorts.length}</p>
//           </Card>
//           <Card className="p-6">
//               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Plane className="w-3 h-3 text-blue-600" /> Carrier Reach</p>
//               <p className="text-2xl font-black mt-2">Global Network</p>
//           </Card>
//            <Card className="p-6 border-indigo-100 bg-indigo-50/20">
//               <p className="text-[10px] font-black uppercase text-indigo-700 tracking-widest flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-indigo-600" /> Engine Sync</p>
//               <p className="text-2xl font-black mt-2 text-indigo-700">100% Operational</p>
//           </Card>
//       </div>

//       <Card className="shadow-md">
//           <CardHeader className="bg-muted/10">
//               <CardTitle>Airline Segment Registry</CardTitle>
//               <CardDescription>
//                   Configure cohorts based on passenger type, loyalty status, and travel behavior signals.
//               </CardDescription>
//           </CardHeader>
//           <CardContent className="pt-4">
//               {loading && cohortsCollection?.length === 0 ? (
//                   <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
//               ) : (
//                   <Table>
//                       <TableHeader className="bg-muted/30">
//                       <TableRow>
//                           <TableHead className="text-[10px] uppercase font-black tracking-widest">Segment Identity</TableHead>
//                           <TableHead className="text-[10px] uppercase font-black tracking-widest">Logic Description</TableHead>
//                           <TableHead className="text-[10px] uppercase font-black text-center tracking-widest">Priority</TableHead>
//                           <TableHead className="text-[10px] uppercase font-black tracking-widest">Status</TableHead>
//                           <TableHead className="sr-only">Actions</TableHead>
//                       </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                       {displayCohorts.map((cohort) => (
//                           <TableRow key={cohort.id} className="group cursor-default">
//                           <TableCell>
//                               <div className="flex flex-col gap-0.5">
//                                   <span className="font-bold text-sm text-primary">{cohort.name}</span>
//                                   <span className="text-[10px] font-mono text-muted-foreground uppercase">{cohort.cohortId}</span>
//                                   <div className="flex items-center gap-1.5 mt-1">
//                                       <Plane className="w-3 h-3 text-blue-500" />
//                                       <span className="text-[9px] uppercase font-black text-muted-foreground">{cohort.type}</span>
//                                   </div>
//                               </div>
//                           </TableCell>
//                           <TableCell>
//                               <div className="text-xs text-muted-foreground max-w-xs line-clamp-2">{cohort.description}</div>
//                           </TableCell>
//                           <TableCell className="text-center">
//                               <Badge variant="outline" className="font-mono text-[10px]">{cohort.priority}</Badge>
//                           </TableCell>
//                           <TableCell>
//                               <Badge variant={cohort.status === 'Active' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase tracking-wider">{cohort.status}</Badge>
//                           </TableCell>
//                           <TableCell className="text-right">
//                               <DropdownMenu>
//                               <DropdownMenuTrigger asChild>
//                                   <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
//                               </DropdownMenuTrigger>
//                               <DropdownMenuContent align="end" className="w-56">
//                                   <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground">Cohort Actions</DropdownMenuLabel>
//                                   <DropdownMenuItem onClick={() => handleOpenDialog(cohort)}>Edit Detailed Rules</DropdownMenuItem>
//                                   <DropdownMenuItem>View Active Matches</DropdownMenuItem>
//                                   <DropdownMenuSeparator />
//                                   <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(cohort.id!)}>Delete Segment</DropdownMenuItem>
//                               </DropdownMenuContent>
//                               </DropdownMenu>
//                           </TableCell>
//                           </TableRow>
//                       ))}
//                       </TableBody>
//                   </Table>
//               )}
//           </CardContent>
//       </Card>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-5xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-black text-primary">{editingCohort ? 'Modify' : 'Initialize'} Airline Retailing Segment</DialogTitle>
//             <DialogDescription className="font-medium">Define exhaustive behavioral and PSS-level targeting rules for this retailing cohort.</DialogDescription>
//           </DialogHeader>
//           <CohortForm
//             cohort={editingCohort}
//             domain="Airline"
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
import { 
  MoreHorizontal, 
  PlusCircle, 
  Loader2, 
  Target, 
  Plane, 
  ShieldCheck, 
  Activity,
  Users,
  Globe,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CohortForm, type Cohort } from '@/components/forms/cohort-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { StatsCards } from '@/components/StatsCards/StatsCards';
import { TableFilterBar } from '@/components/TableFilterbar/TableFilterBar';
import { useTableFilters } from '@/hooks/useTableFilters';

const mockCohorts: Cohort[] = [
    { 
        id: 'AC1', 
        name: 'Frequent Traveller', 
        cohortId: 'PLAT_SOLO_BIZ', 
        status: 'Active', 
        domain: 'Airline',
        description: 'Fly 5+ times a year, value efficiency', 
        type: 'dynamic',
        priority: 95,
    },
    { 
        id: 'AC2', 
        name: 'Family Traveller', 
        cohortId: 'IN_WEB_PROMO', 
        status: 'Active', 
        domain: 'Airline',
        description: 'Traveling as a group of 3 or more', 
        type: 'static',
        priority: 50,
    },
     { 
        id: 'AC3', 
        name: 'Price Sensitive', 
        cohortId: 'US_FAM_LM', 
        status: 'Active', 
        domain: 'Airline',
        description: 'Prefers low-cost options, budget-focused', 
        type: 'dynamic',
        priority: 75,
    },
    { 
        id: 'AC4', 
        name: 'Premium Upsell', 
        cohortId: 'PRE_LEISURE', 
        status: 'Onboarding', 
        domain: 'Airline',
        description: 'Loyalty Gold, open to premium upgrades', 
        type: 'dynamic',
        priority: 85,
    },
];

const STATS = [
  { label: "Total Cohorts", value: 42, color: "purple" as const, icon: <Globe /> },
  { label: "Active",        value: 38, color: "green"  as const, icon: <CheckCircle2 /> },
  { label: "Onboarding",    value: 3,  color: "amber"  as const, icon: <RefreshCw  /> },
  { label: "Archived",      value: 1,  color: "red"    as const, icon: <AlertCircle /> },
];

// ─── Filter Options ───────────────────────────────────────────────────────────
const TYPE_OPTIONS    = ["dynamic", "static"].map((v) => ({ label: v.charAt(0).toUpperCase() + v.slice(1), value: v }));
const STATUS_OPTIONS  = ["Active", "Onboarding", "Inactive"].map((v) => ({ label: v, value: v }));
const PRIORITY_RANGES = [
    { label: "High (75-100)", value: "high" },
    { label: "Medium (40-74)", value: "medium" },
    { label: "Low (0-39)", value: "low" }
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
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      Inactive
    </span>
  );
};

// ─── Type Badge Component ─────────────────────────────────────────────────────
const TypeBadge = ({ type }: { type: string }) => {
  if (type === 'dynamic') {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] uppercase font-black text-blue-600">
        <Activity className="h-2.5 w-2.5" />
        Dynamic
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[9px] uppercase font-black text-gray-500">
      <Users className="h-2.5 w-2.5" />
      Static
    </span>
  );
};

export default function CohortsPage() {
  const firestore = useFirestore();
  const cohortsQuery = useMemo(() => firestore ? collection(firestore, 'cohorts') : undefined, [firestore]);
  const { data: cohortsCollection, loading } = useCollection(cohortsQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const { toast } = useToast();

  // Get source data
  const sourceData = useMemo(() => {
    return (cohortsCollection && cohortsCollection.length > 0) 
      ? cohortsCollection as Cohort[] 
      : mockCohorts;
  }, [cohortsCollection]);

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
    searchFields: ["name", "cohortId", "description"],
    filterFields: { status: "", type: "", priority: "" },
  });

  // Custom priority filter function
  const getFilteredData = () => {
    let data = [...sourceData];
    
    // Apply search
    if (searchText) {
      data = data.filter(item => 
        item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.cohortId?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchText.toLowerCase())
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
    
    // Apply priority range filter
    if (activeFilters.priority && activeFilters.priority !== "All") {
      if (activeFilters.priority === "high") {
        data = data.filter(item => item.priority && item.priority >= 75 && item.priority <= 100);
      } else if (activeFilters.priority === "medium") {
        data = data.filter(item => item.priority && item.priority >= 40 && item.priority <= 74);
      } else if (activeFilters.priority === "low") {
        data = data.filter(item => item.priority && item.priority >= 0 && item.priority <= 39);
      }
    }
    
    return data;
  };

  const displayCohorts = getFilteredData();

  const handleOpenDialog = (cohort: Cohort | null = null) => {
    setEditingCohort(cohort);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: Cohort) => {
    if (!firestore) return;
    try {
      if (editingCohort?.id) {
        const cohortRef = doc(firestore, 'cohorts', editingCohort.id);
        await setDoc(cohortRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Cohort Updated', description: `Segment "${data.name}" successfully updated.` });
      } else {
        await addDoc(collection(firestore, 'cohorts'), { ...data, domain: 'Airline', createdAt: serverTimestamp() });
        toast({ title: 'Cohort Created', description: `Segment "${data.name}" is now live.` });
      }
    } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (cohortId: string) => {
    if (!cohortId || !firestore) return;
    try {
      await deleteDoc(doc(firestore, 'cohorts', cohortId));
      toast({ variant: 'destructive', title: 'Cohort Removed' });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  // Calculate KPIs
  const activeCount = sourceData.filter((c: Cohort) => c.status === 'Active').length;
  const avgPriority = sourceData.length > 0 
    ? Math.round(sourceData.reduce((acc: number, curr: Cohort) => acc + (curr.priority || 0), 0) / sourceData.length)
    : 0;

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      {/* <StatsCards cards={STATS} /> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <Target className="w-3 h-3 text-violet-600" /> Active Segments
              </p>
              <p className="text-2xl font-black mt-2 text-gray-900">{activeCount}</p>
          </Card>
          <Card className="p-4 border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <Plane className="w-3 h-3 text-blue-600" /> Avg Priority
              </p>
              <p className="text-2xl font-black mt-2 text-gray-900">{avgPriority}</p>
          </Card>
           <Card className="p-4 border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Engine Sync
              </p>
              <p className="text-2xl font-black mt-2 text-gray-900">100% Operational</p>
          </Card>
      </div>

      <TableFilterBar
        searchText={searchText}
        onSearchChange={setSearchText}
        searchPlaceholder="Search by segment name, ID, or description..."
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
            key: "priority",
            label: "Priority",
            options: PRIORITY_RANGES,
            value: activeFilters.priority ?? "All",
            onChange: (v) => setFilter("priority", v),
          },
        ]}
        activeChips={activeChips}
        onRemoveChip={(k) => removeFilter(k as keyof any)}
        onClearAll={clearAll}
      />

      {/* KPI Cards */}
      

      <Card className="border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
          <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                  <div>
                      <CardTitle className="text-base font-bold text-gray-900">Airline Segment Registry</CardTitle>
                      <CardDescription className="mt-0.5 text-xs text-gray-400">
                          Configure cohorts based on passenger type, loyalty status, and travel behavior signals.
                      </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                      {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                      <button
                          onClick={() => handleOpenDialog()}
                          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-violet-700"
                      >
                          <PlusCircle className="h-4 w-4" />
                          Define Airline Segment
                      </button>
                  </div>
              </div>
          </CardHeader>
          <CardContent className="pt-2">
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <Table>
                      <TableHeader className="bg-gray-100">
                      <TableRow className="border-b border-gray-200 hover:bg-gray-100">
                          <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Segment Identity</TableHead>
                          <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Logic Description</TableHead>
                          <TableHead className="py-3 text-center text-[11px] font-bold uppercase tracking-wider text-gray-500">Priority</TableHead>
                          <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</TableHead>
                          <TableHead className="py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500">Actions</TableHead>
                      </TableRow>
                      </TableHeader>
                      <TableBody>
                      {displayCohorts.map((cohort) => (
                          <TableRow key={cohort.id} className="transition-colors duration-100 hover:bg-violet-50/60">
                          <TableCell className="py-3.5">
                              <div className="flex flex-col gap-0.5">
                                  <span className="font-bold text-sm text-gray-900">{cohort.name}</span>
                                  <span className="text-[10px] font-mono text-gray-400 uppercase">{cohort.cohortId}</span>
                                  <div className="flex items-center gap-1.5 mt-1">
                                      <TypeBadge type={cohort.type || 'static'} />
                                  </div>
                              </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                              <div className="text-xs text-gray-600 max-w-xs line-clamp-2">{cohort.description}</div>
                          </TableCell>
                          <TableCell className="py-3.5 text-center">
                              <Badge variant="outline" className="font-mono text-[10px] border-gray-200 bg-gray-50 text-gray-700">
                                  {cohort.priority}
                              </Badge>
                          </TableCell>
                          <TableCell className="py-3.5">
                              <StatusBadge status={cohort.status || 'Active'} />
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                              <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600">
                                      <MoreHorizontal className="h-3.5 w-3.5" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 rounded-xl border border-gray-100 shadow-xl">
                                  <DropdownMenuLabel className="text-[10px] uppercase font-black text-gray-500">Cohort Actions</DropdownMenuLabel>
                                  <DropdownMenuItem 
                                      className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                                      onClick={() => handleOpenDialog(cohort)}
                                  >
                                      Edit Detailed Rules
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-amber-50 hover:text-amber-700">
                                      View Active Matches
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                      className="cursor-pointer text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                                      onClick={() => handleDelete(cohort.id!)}
                                  >
                                      Delete Segment
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
            <DialogTitle className="text-2xl font-black text-primary">{editingCohort ? 'Modify' : 'Initialize'} Airline Retailing Segment</DialogTitle>
            <DialogDescription className="font-medium">Define exhaustive behavioral and PSS-level targeting rules for this retailing cohort.</DialogDescription>
          </DialogHeader>
          <CohortForm
            cohort={editingCohort}
            domain="Airline"
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}