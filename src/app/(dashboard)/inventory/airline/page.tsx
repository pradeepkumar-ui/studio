// 'use client';

// import { useState, useMemo } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { PlusCircle, Search, Plane, MoreHorizontal, Loader2, Gauge, ShieldCheck, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
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
// import { AirlineInventoryForm, type AirlineInventory } from '@/components/forms/airline-inventory-form';
// import { useFirestore, useCollection } from '@/firebase';
// import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
// import { cn } from '@/lib/utils';

// const mockAirlineInventory: any[] = [
//     { id: '1', ancillaryName: 'Extra Legroom Seat', pssCode: 'EXLG', flightNumber: 'AC101', totalCapacity: 12, available: 4, reserved: 2, status: 'Open', aircraftType: 'A350', quotas: { Direct: 8, OTA: 2, GDS: 2 }, realTimePssSync: true },
//     { id: '2', ancillaryName: 'Gourmet Meal', pssCode: 'MEAL', flightNumber: 'LH450', totalCapacity: 50, available: 5, reserved: 10, status: 'Waitlist', aircraftType: 'B787', quotas: { Direct: 40, OTA: 10, GDS: 0 }, realTimePssSync: false },
//     { id: '3', ancillaryName: 'Premium Wi-Fi', pssCode: 'WIFI', flightNumber: 'Global', totalCapacity: 500, available: 450, reserved: 5, status: 'Open', aircraftType: 'All', quotas: { Direct: 300, OTA: 100, GDS: 100 }, realTimePssSync: true },
// ];

// export default function AirlineInventoryPage() {
//     const firestore = useFirestore();
//     const inventoryQuery = useMemo(() => firestore ? collection(firestore, 'airlineInventory') : undefined, [firestore]);
//     const { data: inventoryCollection, loading } = useCollection(inventoryQuery);
    
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [editingInventory, setEditingInventory] = useState<any | null>(null);
//     const { toast } = useToast();

//     const displayInventory = useMemo(() => {
//         const sourceData = (inventoryCollection && inventoryCollection.length > 0) ? inventoryCollection as any[] : mockAirlineInventory;
//         return sourceData.filter(i => 
//             i.ancillaryName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//             i.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase())
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
//                 const ref = doc(firestore, 'airlineInventory', editingInventory.id);
//                 await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
//                 toast({ title: 'Inventory Synchronized', description: `Stock updated for ${data.ancillaryName}.` });
//             } else {
//                 await addDoc(collection(firestore, 'airlineInventory'), { ...data, createdAt: serverTimestamp() });
//                 toast({ title: 'New Stock Registered', description: `Inventory defined for ${data.ancillaryName}.` });
//             }
//         } catch (e: any) {
//             toast({ variant: 'destructive', title: 'Error', description: e.message });
//         }
//         setIsDialogOpen(false);
//     };

//     const handleDelete = async (id: string) => {
//         if (!firestore) return;
//         try {
//             await deleteDoc(doc(firestore, 'airlineInventory', id));
//             toast({ title: 'Inventory Decommissioned', variant: 'destructive' });
//         } catch (e: any) {
//             toast({ variant: 'destructive', title: 'Error', description: e.message });
//         }
//     };

//     return (
//         <div className="flex flex-col gap-6">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-3xl font-bold tracking-tight text-primary">Airline Ancillary Inventory</h1>
//                     <p className="text-muted-foreground font-medium">Exhaustive stock control for carrier-specific ancillaries and real-time PSS synchronization.</p>
//                 </div>
//                 <Button onClick={() => handleOpenDialog()} className="font-bold"><PlusCircle className="mr-2 h-4 w-4" /> Define Stock Unit</Button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 {[
//                     { title: 'Total SKUs', value: displayInventory.length, icon: Gauge, color: 'text-primary' },
//                     { title: 'Waitlisted', value: displayInventory.filter(i => i.status === 'Waitlist').length, icon: AlertTriangle, color: 'text-amber-500' },
//                     { title: 'Active Holds', value: displayInventory.reduce((acc, curr) => acc + (curr.reserved || 0), 0), icon: ShieldCheck, color: 'text-blue-600' },
//                     { title: 'PSS Sync Health', value: '100%', icon: Zap, color: 'text-emerald-500' }
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
//                     <CardTitle>Carrier Stock Matrix</CardTitle>
//                     <CardDescription>Live visibility of flight capacity and multi-channel quotas.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="flex items-center gap-2 mb-4">
//                         <div className="relative flex-1">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                             <Input 
//                                 placeholder="Search by ancillary or flight..." 
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
//                                     <TableHead>Ancillary & Sync</TableHead>
//                                     <TableHead>Flight Scope</TableHead>
//                                     <TableHead>Capacity Logic</TableHead>
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
//                                                 <div className="p-2 bg-primary/10 rounded">
//                                                   <Plane className="h-4 w-4 text-primary" />
//                                                 </div>
//                                                 <div>
//                                                   <div className="font-bold text-sm">{item.ancillaryName}</div>
//                                                   <div className="flex items-center gap-1.5 mt-1">
//                                                       {item.realTimePssSync ? (
//                                                           <Badge variant="secondary" className="text-[8px] h-3.5 bg-indigo-50 text-indigo-700 border-indigo-100 font-black uppercase tracking-tighter">
//                                                               <RefreshCw className="h-2 w-2 mr-1 animate-spin-slow" /> PSS Sync Active
//                                                           </Badge>
//                                                       ) : (
//                                                           <span className="text-[9px] font-mono text-muted-foreground uppercase">{item.pssCode}</span>
//                                                       )}
//                                                   </div>
//                                                 </div>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <div className="flex flex-col">
//                                               <span className="text-xs font-bold text-primary">{item.flightNumber}</span>
//                                               <span className="text-[10px] text-muted-foreground uppercase font-black">{item.aircraftType}</span>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <div className="flex flex-col gap-1">
//                                               <div className="flex justify-between w-[120px] text-[10px] font-mono">
//                                                   <span className="text-emerald-600 font-bold">AVL: {item.available}</span>
//                                                   <span className="text-muted-foreground">/ {item.totalCapacity}</span>
//                                               </div>
//                                               <div className="text-[9px] text-blue-600 font-black">HOLD: {item.reserved}</div>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <div className="flex gap-1.5 flex-wrap max-w-[150px]">
//                                                 {Object.entries(item.quotas || {}).map(([ch, val]: any) => (
//                                                     <Badge key={ch} variant="outline" className="text-[9px] h-4 py-0">{ch}: {val}</Badge>
//                                                 ))}
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Badge variant={item.status === 'Open' ? 'default' : (item.status === 'Waitlist' ? 'secondary' : 'destructive')} className="text-[9px] font-black uppercase">
//                                                 {item.status}
//                                             </Badge>
//                                         </TableCell>
//                                         <TableCell className="text-right">
//                                             <DropdownMenu>
//                                                 <DropdownMenuTrigger asChild>
//                                                     <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
//                                                 </DropdownMenuTrigger>
//                                                 <DropdownMenuContent align="end" className="w-56">
//                                                     <DropdownMenuLabel>Inventory Actions</DropdownMenuLabel>
//                                                     <DropdownMenuItem onClick={() => handleOpenDialog(item)}>Adjust Capacity</DropdownMenuItem>
//                                                     <DropdownMenuItem>Manage Channel Quotas</DropdownMenuItem>
//                                                     <DropdownMenuSeparator />
//                                                     <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(item.id!)}>Close Stock</DropdownMenuItem>
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
//                         <DialogTitle>{editingInventory ? 'Update Stock Configuration' : 'Register New Ancillary Stock'}</DialogTitle>
//                         <DialogDescription>Define precise capacity limits and real-time synchronization rules for this carrier SKU.</DialogDescription>
//                     </DialogHeader>
//                     <AirlineInventoryForm 
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
import { PlusCircle, Search, Plane, MoreHorizontal, Loader2, Gauge, ShieldCheck, Zap, AlertTriangle, RefreshCw, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
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
import { AirlineInventoryForm, type AirlineInventory } from '@/components/forms/airline-inventory-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { TableFilterBar } from '@/components/TableFilterbar/TableFilterBar';
import { useTableFilters } from '@/hooks/useTableFilters';

const mockAirlineInventory: any[] = [
    { id: '1', ancillaryName: 'Extra Legroom Seat', pssCode: 'EXLG', flightNumber: 'AC101', totalCapacity: 12, available: 10, reserved: 2, status: 'Open', aircraftType: 'A350', quotas: { Direct: 8, OTA: 2, GDS: 2 }, realTimePssSync: true , baseFare: "1500" },
    { id: '2', ancillaryName: 'Extra Seat', pssCode: 'MEAL', flightNumber: 'LH450', totalCapacity: 50, available: 40, reserved: 10, status: 'Waitlist', aircraftType: 'B787', quotas: { Direct: 40, OTA: 10, GDS: 0 }, realTimePssSync: false, baseFare: "800" },
    { id: '3', ancillaryName: 'Premium Wi-Fi (Unlimited)', pssCode: 'WIFI', flightNumber: 'Global', totalCapacity: 500, available: 495, reserved: 5, status: 'Open', aircraftType: 'All', quotas: { Direct: 300, OTA: 100, GDS: 100 }, realTimePssSync: true, baseFare:"500" },
    // { id: '4', ancillaryName: 'Priority Boarding', pssCode: 'PBRD', flightNumber: 'BA202', totalCapacity: 30, available: 12, reserved: 4, status: 'Open', aircraftType: 'A380', quotas: { Direct: 15, OTA: 10, GDS: 5 }, realTimePssSync: true },
    { id: '5', ancillaryName: 'Priority Baggage', pssCode: 'XBAG', flightNumber: 'SQ308', totalCapacity: 100, available: 92, reserved: 8, status: 'Waitlist', aircraftType: 'B777', quotas: { Direct: 60, OTA: 30, GDS: 10 }, realTimePssSync: false , baseFare: "1200"},
    // { id: '6', ancillaryName: 'Lounge Access', pssCode: 'LOUN', flightNumber: 'EK202', totalCapacity: 20, available: 3, reserved: 12, status: 'Closed', aircraftType: 'A380', quotas: { Direct: 10, OTA: 5, GDS: 5 }, realTimePssSync: true },
];

// ─── Filter Options ───────────────────────────────────────────────────────────
const STATUS_OPTIONS    = ["Open", "Waitlist", "Closed"].map((v) => ({ label: v, value: v }));
const FLIGHT_OPTIONS    = ["AC101", "LH450", "Global", "BA202", "SQ308", "EK202"].map((v) => ({ label: v, value: v }));
const SYNC_OPTIONS      = [
    { label: "PSS Sync Active", value: "true" },
    { label: "Manual Only", value: "false" }
];

// ─── Status Badge Component ───────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'Open') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Open
      </span>
    );
  }
  if (status === 'Waitlist') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        Waitlist
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      Closed
    </span>
  );
};

export default function AirlineInventoryPage() {
    const firestore = useFirestore();
    const inventoryQuery = useMemo(() => firestore ? collection(firestore, 'airlineInventory') : undefined, [firestore]);
    const { data: inventoryCollection, loading } = useCollection(inventoryQuery);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingInventory, setEditingInventory] = useState<any | null>(null);
    const { toast } = useToast();

    // Get source data
    const sourceData = useMemo(() => {
        return (inventoryCollection && inventoryCollection.length > 0) 
            ? inventoryCollection as any[] 
            : mockAirlineInventory;
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
        searchFields: ["ancillaryName", "flightNumber", "pssCode", "aircraftType"],
        filterFields: { status: "", flightNumber: "", realTimePssSync: "" },
    });

    const handleOpenDialog = (item: any | null = null) => {
        setEditingInventory(item);
        setIsDialogOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        if (!firestore) return;
        try {
            if (editingInventory?.id) {
                const ref = doc(firestore, 'airlineInventory', editingInventory.id);
                await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
                toast({ title: 'Inventory Synchronized', description: `Stock updated for ${data.ancillaryName}.` });
            } else {
                await addDoc(collection(firestore, 'airlineInventory'), { ...data, createdAt: serverTimestamp() });
                toast({ title: 'New Stock Registered', description: `Inventory defined for ${data.ancillaryName}.` });
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
        setIsDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'airlineInventory', id));
            toast({ title: 'Inventory Decommissioned', variant: 'destructive' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    };

    // Calculate KPIs from filtered data
    const totalSkus = sourceData.length;
    const waitlistedCount = sourceData.filter((i: any) => i.status === 'Waitlist').length;
    const activeHolds = sourceData.reduce((acc: number, curr: any) => acc + (curr.reserved || 0), 0);
    const pssSyncActive = sourceData.filter((i: any) => i.realTimePssSync === true).length;
    const syncPercentage = totalSkus > 0 ? Math.round((pssSyncActive / totalSkus) * 100) : 0;

    return (
        <div className="flex flex-col gap-6 min-h-screen">
            {/* <StatsCards cards={STATS} /> */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { title: 'Total SKUs', value: totalSkus, icon: Gauge, color: 'text-violet-600' },
                    { title: 'Waitlisted', value: waitlistedCount, icon: AlertTriangle, color: 'text-amber-500' },
                    { title: 'Active Holds', value: activeHolds, icon: ShieldCheck, color: 'text-blue-600' },
                    { title: 'PSS Sync Health', value: `${syncPercentage}%`, icon: Zap, color: 'text-emerald-500' }
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
                searchPlaceholder="Search by ancillary, flight, or PSS code..."
                dropdowns={[
                    {
                        key: "status",
                        label: "Status",
                        options: STATUS_OPTIONS,
                        value: activeFilters.status ?? "All",
                        onChange: (v) => setFilter("status", v),
                    },
                    {
                        key: "flightNumber",
                        label: "Flight",
                        options: FLIGHT_OPTIONS,
                        value: activeFilters.flightNumber ?? "All",
                        onChange: (v) => setFilter("flightNumber", v),
                    },
                    {
                        key: "realTimePssSync",
                        label: "Sync Type",
                        options: SYNC_OPTIONS,
                        value: activeFilters.realTimePssSync ?? "All",
                        onChange: (v) => setFilter("realTimePssSync", v),
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
                            <CardTitle className="text-base font-bold text-gray-900">Carrier Stock Matrix</CardTitle>
                            <CardDescription className="mt-0.5 text-xs text-gray-400">
                                Live visibility of flight capacity and multi-channel quotas.
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                            <button
                                onClick={() => handleOpenDialog()}
                                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-violet-700"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Define Stock Unit
                            </button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-2">
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-100">
                                <TableRow className="border-b border-gray-200 hover:bg-gray-100">
                                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Ancillary & Sync</TableHead>
                                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Flight Scope</TableHead>
                                    <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Capacity Logic</TableHead>
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
                                                    <Plane className="h-4 w-4 text-violet-600" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-900">{item.ancillaryName}</div>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        {item.realTimePssSync ? (
                                                            <Badge variant="secondary" className="text-[8px] h-3.5 bg-indigo-50 text-indigo-700 border-indigo-100 font-black uppercase tracking-tighter">
                                                                <RefreshCw className="h-2 w-2 mr-1 animate-spin" /> PSS Sync Active
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-[9px] font-mono text-gray-400 uppercase">{item.pssCode}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3.5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-violet-700">{item.flightNumber}</span>
                                                <span className="text-[10px] text-gray-400 uppercase font-black">{item.aircraftType}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3.5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between w-[120px] text-[10px] font-mono">
                                                    <span className="text-emerald-600 font-bold">AVL: {item.available}</span>
                                                    <span className="text-gray-400">/ {item.totalCapacity}</span>
                                                </div>
                                                <div className="text-[9px] text-blue-600 font-black">HOLD: {item.reserved}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3.5">
                                            <div className="flex gap-1.5 flex-wrap max-w-[150px]">
                                                {Object.entries(item.quotas || {}).map(([ch, val]: any) => (
                                                    <Badge key={ch} variant="outline" className="text-[9px] h-4 py-0 border-gray-200 bg-gray-50 text-gray-700">
                                                        {ch}: {val}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3.5">
                                            <StatusBadge status={item.status} />
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
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-gray-500">Inventory Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem 
                                                        className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                                                        onClick={() => handleOpenDialog(item)}
                                                    >
                                                        Adjust Capacity
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-amber-50 hover:text-amber-700">
                                                        Manage Channel Quotas
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        className="cursor-pointer text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                                                        onClick={() => handleDelete(item.id!)}
                                                    >
                                                        Close Stock
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
                        <DialogTitle>{editingInventory ? 'Update Stock Configuration' : 'Register New Ancillary Stock'}</DialogTitle>
                        <DialogDescription>Define precise capacity limits and real-time synchronization rules for this carrier SKU.</DialogDescription>
                    </DialogHeader>
                    <AirlineInventoryForm 
                        inventory={editingInventory} 
                        onSubmit={handleFormSubmit} 
                        onCancel={() => setIsDialogOpen(false)} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}