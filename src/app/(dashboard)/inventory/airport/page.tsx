// 'use client';

// import { useState, useMemo } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { PlusCircle, Search, Store, MoreHorizontal, Loader2, MapPin, Clock, Smartphone, QrCode, AlertTriangle, Signal, ShieldCheck, Zap, Activity, RefreshCw } from 'lucide-react';
// import { Input } from '@/components/ui/input';
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
// import { useToast } from '@/hooks/use-toast';
// import { AirportInventoryForm, type AirportInventory } from '@/components/forms/airport-inventory-form';
// import { useFirestore, useCollection } from '@/firebase';
// import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
// import { Progress } from '@/components/ui/progress';
// import { cn } from '@/lib/utils';

// const mockAirportInventory: any[] = [
//     { id: '1', ancillaryName: 'Executive Lounge Entry', airportCode: 'LHR', terminal: 'T5', zone: 'North Plaza', supplier: 'Lounge Stars', totalCapacity: 45, available: 12, syncStatus: 'Live', quotas: { CUSS: 10, CUTE: 5, Mobile: 30 }, timeSlotBased: true, operationalMode: 'NORMAL', realTimeSync: true },
//     { id: '2', ancillaryName: 'Fast Track Security', airportCode: 'JFK', terminal: 'T4', zone: 'Terminal 4 East', supplier: 'Airport Authority', totalCapacity: 200, available: 45, syncStatus: 'Live', quotas: { CUSS: 50, CUTE: 50, Mobile: 100 }, timeSlotBased: false, operationalMode: 'CONGESTION', realTimeSync: false },
//     { id: '3', ancillaryName: 'VIP Valet Parking', airportCode: 'SIN', terminal: 'T1', zone: 'Carpark A', supplier: 'Changi Valet', totalCapacity: 20, available: 0, syncStatus: 'Critical', quotas: { CUSS: 2, CUTE: 2, Mobile: 16 }, timeSlotBased: true, operationalMode: 'NORMAL', realTimeSync: true },
// ];

// export default function AirportInventoryPage() {
//     const firestore = useFirestore();
//     const inventoryQuery = useMemo(() => firestore ? collection(firestore, 'airportInventory') : undefined, [firestore]);
//     const { data: inventoryCollection, loading } = useCollection(inventoryQuery);
    
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [editingInventory, setEditingInventory] = useState<any | null>(null);
//     const { toast } = useToast();

//     const displayInventory = useMemo(() => {
//         const sourceData = (inventoryCollection && inventoryCollection.length > 0) ? inventoryCollection as any[] : mockAirportInventory;
//         return sourceData.filter(i => 
//             i.ancillaryName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//             i.airportCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             i.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [inventoryCollection, searchTerm]);

//     const handleOpenDialog = (item: any | null = null) => {
//         setEditingInventory(item);
//         setIsDialogOpen(true);
//     };

//     const handleFormSubmit = async (data: any) => {
//         if (!firestore) return;
//         try {
//             if (editingInventory?.id) {
//                 const ref = doc(firestore, 'airportInventory', editingInventory.id);
//                 await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
//                 toast({ title: 'Node Reconciled', description: `Inventory logic updated for ${data.ancillaryName}.` });
//             } else {
//                 await addDoc(collection(firestore, 'airportInventory'), { ...data, createdAt: serverTimestamp() });
//                 toast({ title: 'New Hub Node Registered', description: `Inventory defined for ${data.ancillaryName}.` });
//             }
//         } catch (e: any) {
//             toast({ variant: 'destructive', title: 'Error', description: e.message });
//         }
//         setIsDialogOpen(false);
//     };

//     const handleDelete = async (id: string) => {
//         if (!firestore) return;
//         try {
//             await deleteDoc(doc(firestore, 'airportInventory', id));
//             toast({ title: 'Node Offboarded', variant: 'destructive' });
//         } catch (e: any) {
//             toast({ variant: 'destructive', title: 'Error', description: e.message });
//         }
//     };

//     return (
//         <div className="flex flex-col gap-6">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-3xl font-bold tracking-tight text-primary">Airport Ancillary Inventory</h1>
//                     <p className="text-muted-foreground font-medium">Manage localized hub capacity and real-time vendor system synchronization.</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <Button variant="outline" className="font-bold border-indigo-200 bg-indigo-50 text-indigo-700">
//                         <Activity className="mr-2 h-4 w-4" /> Sync All Nodes
//                     </Button>
//                     <Button onClick={() => handleOpenDialog()} className="font-bold"><PlusCircle className="mr-2 h-4 w-4" /> Register Hub Stock</Button>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 {[
//                     { title: 'Total Nodes', value: displayInventory.length, icon: Store, color: 'text-primary' },
//                     { title: 'Critical Stock', value: displayInventory.filter(i => i.available < 5).length, icon: AlertTriangle, color: 'text-destructive' },
//                     { title: 'Sync Health', value: 'Live', icon: RefreshCw, color: 'text-emerald-500' },
//                     { title: 'Utilization', value: '72%', icon: ShieldCheck, color: 'text-blue-600' }
//                 ].map((kpi) => (
//                     <Card key={kpi.title} className="p-6">
//                         <div className="flex justify-between items-center mb-2">
//                             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.title}</p>
//                             <kpi.icon className={cn("h-4 w-4", kpi.color)} />
//                         </div>
//                         <div className="text-2xl font-black">{kpi.value}</div>
//                     </Card>
//                 ))}
//             </div>

//             <Card>
//                 <CardHeader>
//                     <CardTitle>Hub Resource Matrix</CardTitle>
//                     <CardDescription>Authorize vendor capacity and govern real-time hardware permissions.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="flex items-center gap-2 mb-4">
//                         <div className="relative flex-1">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                             <Input 
//                                 placeholder="Filter by service or partner..." 
//                                 className="pl-9" 
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     {loading ? (
//                         <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
//                     ) : (
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Service & Sync</TableHead>
//                                     <TableHead>Point</TableHead>
//                                     <TableHead>Resource Logic</TableHead>
//                                     <TableHead>Quotas</TableHead>
//                                     <TableHead>Status</TableHead>
//                                     <TableHead className="text-right">Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {displayInventory.map((item) => (
//                                     <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
//                                         <TableCell>
//                                             <div className="flex items-center gap-2">
//                                                 <div className="p-2 bg-secondary rounded">
//                                                   <Store className="h-4 w-4 text-muted-foreground" />
//                                                 </div>
//                                                 <div>
//                                                   <div className="font-bold text-sm">{item.ancillaryName}</div>
//                                                   <div className="flex items-center gap-1.5 mt-1">
//                                                       {item.realTimeSync ? (
//                                                           <Badge variant="secondary" className="text-[8px] h-3.5 bg-emerald-50 text-emerald-700 border-emerald-100 font-black uppercase tracking-tighter">
//                                                               <RefreshCw className="h-2 w-2 mr-1 animate-spin-slow" /> Hub-Sync Active
//                                                           </Badge>
//                                                       ) : (
//                                                           <span className="text-[9px] text-muted-foreground uppercase font-black">{item.supplier}</span>
//                                                       )}
//                                                   </div>
//                                                 </div>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <div className="flex flex-col gap-0.5">
//                                               <span className="text-xs font-bold text-primary">{item.airportCode} {item.terminal}</span>
//                                               <span className="text-[9px] text-muted-foreground uppercase">{item.zone}</span>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <div className="flex flex-col gap-1">
//                                               <div className="flex justify-between w-[120px] text-[10px] font-mono">
//                                                   <span className={item.available < 5 ? "text-destructive font-black" : "text-emerald-600 font-bold"}>AVL: {item.available}</span>
//                                                   <span className="text-muted-foreground">/ {item.totalCapacity}</span>
//                                               </div>
//                                               <Progress value={(item.available / item.totalCapacity) * 100} className="h-1 w-[120px]" />
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <div className="flex flex-col gap-0.5">
//                                                 <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
//                                                     <QrCode className="h-2.5 w-2.5" /> CUSS: {item.quotas?.CUSS || 0}
//                                                 </div>
//                                                 <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
//                                                     <Smartphone className="h-2.5 w-2.5" /> App: {item.quotas?.Mobile || 0}
//                                                 </div>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Badge variant={item.operationalMode === 'NORMAL' ? 'default' : 'destructive'} className="text-[9px] font-black uppercase">
//                                                 {item.operationalMode}
//                                             </Badge>
//                                         </TableCell>
//                                         <TableCell className="text-right">
//                                             <DropdownMenu>
//                                                 <DropdownMenuTrigger asChild>
//                                                     <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
//                                                 </DropdownMenuTrigger>
//                                                 <DropdownMenuContent align="end" className="w-56">
//                                                     <DropdownMenuLabel>Node Management</DropdownMenuLabel>
//                                                     <DropdownMenuItem onClick={() => handleOpenDialog(item)}>Edit Node Config</DropdownMenuItem>
//                                                     <DropdownMenuItem><Zap className="mr-2 h-4 w-4"/>Trigger Disruption State</DropdownMenuItem>
//                                                     <DropdownMenuSeparator />
//                                                     <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(item.id!)}>Relocate Node</DropdownMenuItem>
//                                                 </DropdownMenuContent>
//                                             </DropdownMenu>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     )}
//                 </CardContent>
//             </Card>

//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogContent className="max-w-3xl">
//                     <DialogHeader>
//                         <DialogTitle>{editingInventory ? 'Reconcile Hub Node' : 'Initialize Ecosystem Stock'}</DialogTitle>
//                         <DialogDescription>Define localized node capacity, slot timing, and real-time synchronization permissions.</DialogDescription>
//                     </DialogHeader>
//                     <AirportInventoryForm 
//                         inventory={editingInventory} 
//                         onSubmit={handleFormSubmit} 
//                         onCancel={() => setIsDialogOpen(false)} 
//                     />
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }



'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Store, MoreHorizontal, Loader2, MapPin, Clock, Smartphone, QrCode, AlertTriangle, Signal, ShieldCheck, Zap, Activity, RefreshCw, Globe, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import { useToast } from '@/hooks/use-toast';
import { AirportInventoryForm, type AirportInventory } from '@/components/forms/airport-inventory-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { StatsCards } from '@/components/StatsCards/StatsCards';
import { TableFilterBar } from '@/components/TableFilterbar/TableFilterBar';
import { useTableFilters } from '@/hooks/useTableFilters';

const mockAirportInventory: any[] = [
{ id: '1', ancillaryName: 'Executive Lounge Entry', airportCode: 'BOM', terminal: 'T5', zone: 'North Plaza', supplier: 'Lounge Stars', totalCapacity: 45, available: 12, syncStatus: 'Live', quotas: { CUSS: 10, CUTE: 5, Mobile: 30 }, timeSlotBased: true, operationalMode: 'NORMAL', realTimeSync: true, ancillaryCategory: 'Lounge', basePrice: 1800, currency: 'INR', timeSlot: '20:00 - 23:00', airportConfigMatch: true },
{ id: '2', ancillaryName: 'Fast Track Security', airportCode: 'DEL', terminal: 'T4', zone: 'Terminal 4 East', supplier: 'Airport Authority', totalCapacity: 200, available: 45, syncStatus: 'Live', quotas: { CUSS: 50, CUTE: 50, Mobile: 100 }, timeSlotBased: false, operationalMode: 'CONGESTION', realTimeSync: false, ancillaryCategory: 'Fast Track', basePrice: 750, currency: 'INR', timeSlot: null, airportConfigMatch: true },
{ id: '3', ancillaryName: 'Parking', airportCode: 'DEL', terminal: 'T1', zone: 'Carpark A', supplier: 'Changi Valet', totalCapacity: 20, available: 0, syncStatus: 'Critical', quotas: { CUSS: 2, CUTE: 2, Mobile: 16 }, timeSlotBased: true, operationalMode: 'NORMAL', realTimeSync: true, ancillaryCategory: 'Parking', basePrice: 600, currency: 'INR', timeSlot: '20:00 - 23:00', airportConfigMatch: true },
{ 
  id: '4',
  ancillaryName: 'Premium WiFi Access',
  airportCode: 'BOM',
  terminal: 'T2',
  zone: 'Departure Lounge',
  supplier: 'Airport Authority',
  totalCapacity: 500,
  available: 320,
  syncStatus: 'Live',
  quotas: { CUSS: 100, CUTE: 100, Mobile: 300 },
  timeSlotBased: false,
  operationalMode: 'NORMAL',
  realTimeSync: true,
  ancillaryCategory: 'WiFi',
  basePrice: 300,
  currency: 'INR',
  timeSlot: null,
  airportConfigMatch: true
}
];


// ─── Filter Options ───────────────────────────────────────────────────────────
const STATUS_OPTIONS    = ["NORMAL", "CONGESTION", "DEGRADED", "CRITICAL"].map((v) => ({ label: v, value: v }));
const AIRPORT_OPTIONS   = ["LHR", "JFK", "SIN", "DXB", "CDG", "FRA"].map((v) => ({ label: v, value: v }));
const SUPPLIER_OPTIONS  = ["Lounge Stars", "Airport Authority", "Changi Valet", "Executive Services", "Baggage Pro", "Rest Easy"].map((v) => ({ label: v, value: v }));
const SYNC_OPTIONS      = [
    { label: "Hub-Sync Active", value: "true" },
    { label: "Manual Only", value: "false" }
];

// ─── Status Badge Component ───────────────────────────────────────────────────
const OperationalBadge = ({ mode }: { mode: string }) => {
  if (mode === 'NORMAL') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        <ShieldCheck className="h-3 w-3" />
        NORMAL
      </span>
    );
  }
  if (mode === 'CONGESTION') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        <AlertTriangle className="h-3 w-3" />
        CONGESTION
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      CRITICAL
    </span>
  );
};

export default function AirportInventoryPage() {
    const firestore = useFirestore();
    const inventoryQuery = useMemo(() => firestore ? collection(firestore, 'airportInventory') : undefined, [firestore]);
    const { data: inventoryCollection, loading } = useCollection(inventoryQuery);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingInventory, setEditingInventory] = useState<any | null>(null);
    const { toast } = useToast();

    // Get source data
    const sourceData = useMemo(() => {
        return (inventoryCollection && inventoryCollection.length > 0) 
            ? inventoryCollection as any[] 
            : mockAirportInventory;
    }, [inventoryCollection]);

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
        searchFields: ["ancillaryName", "airportCode", "supplier", "zone"],
        filterFields: { operationalMode: "", airportCode: "", supplier: "", realTimeSync: "" },
    });

    const handleOpenDialog = (item: any | null = null) => {
        setEditingInventory(item);
        setIsDialogOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        if (!firestore) return;
        try {
            if (editingInventory?.id) {
                const ref = doc(firestore, 'airportInventory', editingInventory.id);
                await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
                toast({ title: 'Node Reconciled', description: `Inventory logic updated for ${data.ancillaryName}.` });
            } else {
                await addDoc(collection(firestore, 'airportInventory'), { ...data, createdAt: serverTimestamp() });
                toast({ title: 'New Hub Node Registered', description: `Inventory defined for ${data.ancillaryName}.` });
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
        setIsDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'airportInventory', id));
            toast({ title: 'Node Offboarded', variant: 'destructive' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    };

    // Calculate KPIs from source data
    const totalNodes = sourceData.length;
    const criticalCount = sourceData.filter((i: any) => i.available < 5).length;
    const syncActiveCount = sourceData.filter((i: any) => i.realTimeSync === true).length;
    const syncPercentage = totalNodes > 0 ? Math.round((syncActiveCount / totalNodes) * 100) : 0;
    const avgUtilization = totalNodes > 0 
        ? Math.round(sourceData.reduce((acc: number, curr: any) => acc + ((curr.totalCapacity - curr.available) / curr.totalCapacity * 100), 0) / totalNodes)
        : 0;

    return (
        <div className="flex flex-col gap-6 min-h-screen">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { title: 'Total Nodes', value: totalNodes, icon: Store, color: 'text-violet-600' },
                    { title: 'Critical Stock', value: criticalCount, icon: AlertTriangle, color: 'text-amber-500' },
                    { title: 'Sync Health', value: `${syncPercentage}%`, icon: RefreshCw, color: 'text-emerald-500' },
                    { title: 'Utilization', value: `${avgUtilization}%`, icon: ShieldCheck, color: 'text-blue-600' }
                ].map((kpi) => (
                    <Card key={kpi.title} className="p-4 border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.title}</p>
                            <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                        </div>
                        <div className="text-2xl font-black text-gray-900">{kpi.value}</div>
                    </Card>
                ))}
            </div>

            <TableFilterBar
                searchText={searchText}
                onSearchChange={setSearchText}
                searchPlaceholder="Filter by service, airport, or partner..."
                dropdowns={[
                    {
                        key: "operationalMode",
                        label: "Status",
                        options: STATUS_OPTIONS,
                        value: activeFilters.operationalMode ?? "All",
                        onChange: (v) => setFilter("operationalMode", v),
                    },
                    {
                        key: "airportCode",
                        label: "Airport",
                        options: AIRPORT_OPTIONS,
                        value: activeFilters.airportCode ?? "All",
                        onChange: (v) => setFilter("airportCode", v),
                    },
                    {
                        key: "supplier",
                        label: "Supplier",
                        options: SUPPLIER_OPTIONS,
                        value: activeFilters.supplier ?? "All",
                        onChange: (v) => setFilter("supplier", v),
                    },
                    {
                        key: "realTimeSync",
                        label: "Sync Type",
                        options: SYNC_OPTIONS,
                        value: activeFilters.realTimeSync ?? "All",
                        onChange: (v) => setFilter("realTimeSync", v),
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
                            <CardTitle className="text-base font-bold text-gray-900">Hub Resource Matrix</CardTitle>
                            <CardDescription className="mt-0.5 text-xs text-gray-400">
                                Authorize vendor capacity and govern real-time hardware permissions.
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                            <Button variant="outline" className="font-bold border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                                <Activity className="mr-2 h-4 w-4" /> Sync All Nodes
                            </Button>
                            <button
                                onClick={() => handleOpenDialog()}
                                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-violet-700"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Register Hub Stock
                            </button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-2">
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-100">
                                <TableRow className="border-b border-gray-200 hover:bg-gray-100">
                                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Service & Sync</TableHead>
                                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Point</TableHead>
                                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Resource Logic</TableHead>
                                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Quotas</TableHead>
                                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</TableHead>
                                    <TableHead className="py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((item) => (
                                    <TableRow key={item.id} className="transition-colors duration-100 hover:bg-violet-50/60">
                                        <TableCell className="py-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-violet-100">
                                                    <Store className="h-4 w-4 text-violet-600" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-900">{item.ancillaryName}</div>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        {item.realTimeSync ? (
                                                            <Badge variant="secondary" className="text-[8px] h-3.5 bg-emerald-50 text-emerald-700 border-emerald-100 font-black uppercase tracking-tighter">
                                                                <RefreshCw className="h-2 w-2 mr-1 animate-spin" /> Hub-Sync Active
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-[9px] text-gray-400 uppercase font-black">{item.supplier}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3.5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs font-bold text-violet-700">{item.airportCode} {item.terminal}</span>
                                                <span className="text-[9px] text-gray-400 uppercase">{item.zone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3.5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between w-[120px] text-[10px] font-mono">
                                                    <span className={item.available < 5 ? "text-amber-600 font-black" : "text-emerald-600 font-bold"}>
                                                        AVL: {item.available}
                                                    </span>
                                                    <span className="text-gray-400">/ {item.totalCapacity}</span>
                                                </div>
                                                <Progress value={(item.available / item.totalCapacity) * 100} className="h-1 w-[120px]" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3.5">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500">
                                                    <QrCode className="h-2.5 w-2.5" /> CUSS: {item.quotas?.CUSS || 0}
                                                </div>
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500">
                                                    <Smartphone className="h-2.5 w-2.5" /> App: {item.quotas?.Mobile || 0}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3.5">
                                            <OperationalBadge mode={item.operationalMode} />
                                        </TableCell>
                                        <TableCell className="py-3.5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-7 w-7 rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600"
                                                    >
                                                        <MoreHorizontal className="h-3.5 w-3.5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-xl border border-gray-100 shadow-xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-gray-500">Node Management</DropdownMenuLabel>
                                                    <DropdownMenuItem 
                                                        className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                                                        onClick={() => handleOpenDialog(item)}
                                                    >
                                                        Edit Node Config
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-amber-50 hover:text-amber-700">
                                                        <Zap className="mr-2 h-3.5 w-3.5" /> Trigger Disruption State
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        className="cursor-pointer text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                                                        onClick={() => handleDelete(item.id!)}
                                                    >
                                                        Relocate Node
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
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{editingInventory ? 'Reconcile Hub Node' : 'Initialize Ecosystem Stock'}</DialogTitle>
                        <DialogDescription>Define localized node capacity, slot timing, and real-time synchronization permissions.</DialogDescription>
                    </DialogHeader>
                    <AirportInventoryForm 
                        inventory={editingInventory} 
                        onSubmit={handleFormSubmit} 
                        onCancel={() => setIsDialogOpen(false)} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}