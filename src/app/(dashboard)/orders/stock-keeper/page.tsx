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
// import { 
//   MoreHorizontal, 
//   PlusCircle, 
//   Search, 
//   Package, 
//   AlertTriangle, 
//   ShieldCheck, 
//   History, 
//   RefreshCw,
//   Loader2,
//   TrendingDown,
//   Zap,
//   Boxes,
//   Truck,
//   Activity
// } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/hooks/use-toast';
// import { StockItemForm, type StockItem } from '@/components/forms/stock-item-form';
// import { useFirestore, useCollection } from '@/firebase';
// import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
// import { Progress } from '@/components/ui/progress';
// import { cn } from '@/lib/utils';

// const initialMockStock: any[] = [
//     { id: '1', sku: 'LOU-LHR-T5-01', category: 'Lounge', supplier: 'Lounge Stars', available: 12, reserved: 4, threshold: 5, status: 'In Stock', fulfillmentSource: 'Offersense', type: 'Service_Capacity', realTimePssSync: true },
//     { id: '2', sku: 'MEAL-PRE-VEG', category: 'Catering', supplier: 'SkyCafe', available: 3, reserved: 2, threshold: 5, status: 'Low Stock', fulfillmentSource: 'Offersense', type: 'Physical', realTimePssSync: false },
//     { id: '3', sku: 'SEAT-EX-LG', category: 'Seats', supplier: 'Carrier', available: 450, reserved: 22, threshold: 50, status: 'In Stock', fulfillmentSource: 'PSS', type: 'Service_Capacity', realTimePssSync: false },
//     { id: '4', sku: 'WIFI-PREM-PASS', category: 'Connectivity', supplier: 'Carrier', available: 1000, reserved: 12, threshold: 100, status: 'In Stock', fulfillmentSource: 'PSS', type: 'Digital', realTimePssSync: false },
// ];

// export default function AirlineStockKeeperPage() {
//   const firestore = useFirestore();
//   const stockQuery = useMemo(() => firestore ? query(collection(firestore, 'airlineInventory'), orderBy('createdAt', 'desc')) : undefined, [firestore]);
//   const { data: stockCollection, loading } = useCollection(stockQuery);
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<StockItem | null>(null);
//   const { toast } = useToast();

//   const displayStock = useMemo(() => {
//     const sourceData = (stockCollection && stockCollection.length > 0) ? stockCollection as any[] : initialMockStock;
//     return sourceData.filter(s => 
//         s.sku?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         s.category?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [stockCollection, searchTerm]);

//   const handleOpenDialog = (item: any | null = null) => {
//     setEditingItem(item);
//     setIsDialogOpen(true);
//   };

//   const handleFormSubmit = async (data: StockItem) => {
//     if (!firestore) return;
    
//     let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
//     if (data.available <= 0) status = 'Out of Stock';
//     else if (data.available <= data.threshold) status = 'Low Stock';

//     try {
//       if (editingItem?.id) {
//         const ref = doc(firestore, 'airlineInventory', editingItem.id);
//         await setDoc(ref, { ...data, status, updatedAt: serverTimestamp() }, { merge: true });
//         toast({ title: 'Balance Reconciled', description: `SKU ${data.sku} updated.` });
//       } else {
//         await addDoc(collection(firestore, 'airlineInventory'), { ...data, status, createdAt: serverTimestamp() });
//         toast({ title: 'New Registry Committed', description: `SKU ${data.sku} added to stock keeper.` });
//       }
//     } catch (e: any) {
//         toast({ variant: 'destructive', title: 'Error', description: e.message });
//     }
//     setIsDialogOpen(false);
//   };

//   const handleDelete = async (id: string) => {
//     if (!firestore) return;
//     try {
//         await deleteDoc(doc(firestore, 'airlineInventory', id));
//         toast({ title: 'SKU Offboarded', variant: 'destructive' });
//     } catch (e: any) {
//         toast({ variant: 'destructive', title: 'Error', description: e.message });
//     }
//   }

//   const handleAction = (action: string, sku: string) => {
//       toast({ title: `${action} Executed`, description: `Inventory action for ${sku} confirmed.` });
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex items-center justify-between">
//         <div className="flex flex-col gap-1">
//           <h1 className="text-3xl font-black tracking-tight text-primary uppercase">Airline Stock Keeper</h1>
//           <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Operational Fulfillment & Availability Governance</p>
//         </div>
//         <div className="flex gap-2">
//             <Button variant="outline" className="font-bold border-indigo-200 bg-indigo-50 text-indigo-700">
//                 <RefreshCw className="mr-2 h-4 w-4" /> Sync All PSS SKUs
//             </Button>
//             <Button onClick={() => handleOpenDialog()} className="font-bold shadow-lg">
//                 <PlusCircle className="mr-2 h-4 w-4" /> Initialize SKU Balance
//             </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         {[
//           { label: 'Total Tracked SKUs', value: displayStock.length, icon: Boxes, color: 'text-primary' },
//           { label: 'Active Holds (Soft)', value: displayStock.reduce((acc, curr) => acc + (curr.reserved || 0), 0), icon: ShieldCheck, color: 'text-blue-600' },
//           { label: 'Critical Low Stock', value: displayStock.filter(s => s.status === 'Low Stock').length, icon: AlertTriangle, color: 'text-amber-500' },
//           { label: 'PSS Sync Health', value: '100%', icon: Zap, color: 'text-emerald-500' }
//         ].map((kpi) => (
//           <Card key={kpi.label} className="p-6 bg-white shadow-sm border-primary/5">
//             <div className="flex justify-between items-center mb-2">
//               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.label}</p>
//               <kpi.icon className={kpi.color + " h-4 w-4"} />
//             </div>
//             <p className="text-2xl font-black">{kpi.value}</p>
//           </Card>
//         ))}
//       </div>

//       <Card className="shadow-xl border-primary/10 overflow-hidden">
//         <CardHeader className="bg-primary/5 border-b py-4">
//             <CardTitle className="text-lg">Operational Stock Matrix</CardTitle>
//             <CardDescription>Govern availability, confirm hard-allocations, and monitor cross-domain fulfillment signals.</CardDescription>
//         </CardHeader>
//         <CardContent className="pt-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search SKU registry (code, category)..."
//                 value={searchTerm}
//                 onChange={(event) => setSearchTerm(event.target.value)}
//                 className="pl-9 bg-white"
//               />
//             </div>
//           </div>

//           <div className="rounded-xl border border-muted/60 overflow-hidden">
//             <Table>
//                 <TableHeader className="bg-muted/30">
//                 <TableRow>
//                     <TableHead className="text-[10px] uppercase font-black tracking-widest">Inventory Identity</TableHead>
//                     <TableHead className="text-[10px] uppercase font-black tracking-widest">Balance Control</TableHead>
//                     <TableHead className="text-[10px] uppercase font-black tracking-widest">Fulfillment Pulse</TableHead>
//                     <TableHead className="text-[10px] uppercase font-black tracking-widest">Status</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                 {displayStock.map((item) => (
//                     <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
//                     <TableCell>
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
//                                 <Package className="h-4 w-4 text-primary" />
//                             </div>
//                             <div>
//                                 <div className="font-bold text-sm text-primary">{item.sku}</div>
//                                 <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{item.category} • {item.supplier}</div>
//                                 <div className="flex items-center gap-1.5 mt-1">
//                                     <Badge variant="outline" className="text-[8px] h-3.5 bg-white uppercase font-black tracking-tighter">SOURCE: {item.fulfillmentSource}</Badge>
//                                     {item.realTimePssSync && (
//                                         <Badge variant="secondary" className="text-[8px] h-3.5 bg-indigo-50 text-indigo-700 border-indigo-100 font-black uppercase tracking-tighter">
//                                             <RefreshCw className="h-2 w-2 mr-1 animate-spin-slow" />
//                                             PSS-Sync
//                                         </Badge>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </TableCell>
//                     <TableCell>
//                         <div className="flex flex-col gap-1 w-[180px]">
//                             <div className="flex justify-between text-[10px] font-mono">
//                                 <span className={item.available < item.threshold ? "text-destructive font-black" : "text-emerald-600 font-bold"}>AVL: {item.available}</span>
//                                 <span className="text-muted-foreground">TH: {item.threshold}</span>
//                             </div>
//                             <Progress value={Math.min(100, (item.available / (item.available + item.threshold)) * 100)} className="h-1" />
//                             <div className="text-[9px] text-blue-600 font-black uppercase flex items-center gap-1 mt-0.5">
//                                 <ShieldCheck className="h-2.5 w-2.5" /> Held: {item.reserved} units
//                             </div>
//                         </div>
//                     </TableCell>
//                     <TableCell>
//                         <div className="flex flex-col gap-0.5">
//                             <div className="text-[10px] font-bold text-slate-700">{item.type?.replace('_', ' ')}</div>
//                             <div className="flex items-center gap-1.5">
//                                 <div className={cn("h-1.5 w-1.5 rounded-full", item.fulfillmentSource === 'PSS' || item.realTimePssSync ? "bg-indigo-500" : "bg-emerald-500 animate-pulse")} />
//                                 <span className="text-[9px] font-black uppercase text-muted-foreground">
//                                     {item.fulfillmentSource === 'PSS' ? 'Direct PSS Link' : (item.realTimePssSync ? 'Async PSS Push' : 'Fulfillment Active')}
//                                 </span>
//                             </div>
//                         </div>
//                     </TableCell>
//                     <TableCell>
//                         <Badge variant={item.status === 'In Stock' ? 'default' : (item.status === 'Low Stock' ? 'secondary' : 'destructive')} className="text-[9px] font-black uppercase tracking-wider">{item.status}</Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                         <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button size="icon" variant="ghost" className="hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-64">
//                             <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground">Stock Operations</DropdownMenuLabel>
//                             <DropdownMenuItem onClick={() => handleOpenDialog(item)} className="font-bold"><Boxes className="mr-2 h-4 w-4"/>Adjust Current Balance</DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleAction('Soft Hold Release', item.sku)}><TrendingDown className="mr-2 h-4 w-4"/>Flush Expired Holds</DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleAction('Registry Audit', item.sku)}><History className="mr-2 h-4 w-4"/>View Balance Lineage</DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem className="text-destructive font-bold" onClick={() => item.id && handleDelete(item.id)}><Truck className="mr-2 h-4 w-4"/>Decommission SKU</DropdownMenuItem>
//                         </DropdownMenuContent>
//                         </DropdownMenu>
//                     </TableCell>
//                     </TableRow>
//                 ))}
//                 {displayStock.length === 0 && !loading && (
//                     <TableRow>
//                         <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
//                             <Package className="h-8 w-8 mx-auto mb-2 opacity-20" />
//                             <p className="font-bold uppercase text-[10px] tracking-widest">No SKUs found in registry</p>
//                         </TableCell>
//                     </TableRow>
//                 )}
//                 </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
      
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-2xl overflow-hidden p-0 rounded-3xl border-none shadow-2xl">
//           <div className="p-8 border-b bg-primary/5">
//               <DialogTitle className="text-2xl font-black text-primary uppercase">Stock Registry Entry</DialogTitle>
//               <DialogDescription className="font-medium">Define authorized fulfillment source, physical/digital type, and safety thresholds.</DialogDescription>
//           </div>
//           <div className="p-8">
//             <StockItemForm
//                 item={editingItem}
//                 onSubmit={handleFormSubmit}
//                 onCancel={() => setIsDialogOpen(false)}
//             />
//           </div>
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
  Search, 
  Package, 
  AlertTriangle, 
  ShieldCheck, 
  History, 
  RefreshCw,
  Loader2,
  TrendingDown,
  Zap,
  Boxes,
  Truck,
  Activity,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { StockItemForm, type StockItem } from '@/components/forms/stock-item-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { StatsCards } from '@/components/StatsCards/StatsCards';
import { TableFilterBar } from '@/components/TableFilterbar/TableFilterBar';
import { useTableFilters } from '@/hooks/useTableFilters';

const initialMockStock: any[] = [
    { id: '1', sku: 'LOU-LHR-T5-01', category: 'Lounge', supplier: 'Lounge Stars', available: 12, reserved: 4, threshold: 5, status: 'In Stock', fulfillmentSource: 'Offersense', type: 'Service_Capacity', realTimePssSync: true },
    { id: '2', sku: 'MEAL-PRE-VEG', category: 'Catering', supplier: 'SkyCafe', available: 3, reserved: 2, threshold: 5, status: 'Low Stock', fulfillmentSource: 'Offersense', type: 'Physical', realTimePssSync: false },
    { id: '3', sku: 'SEAT-EX-LG', category: 'Seats', supplier: 'Carrier', available: 450, reserved: 22, threshold: 50, status: 'In Stock', fulfillmentSource: 'PSS', type: 'Service_Capacity', realTimePssSync: false },
    { id: '4', sku: 'WIFI-PREM-PASS', category: 'Connectivity', supplier: 'Carrier', available: 1000, reserved: 12, threshold: 100, status: 'In Stock', fulfillmentSource: 'PSS', type: 'Digital', realTimePssSync: false },
    { id: '5', sku: 'BAG-PRI-01', category: 'Baggage', supplier: 'Airport', available: 50, reserved: 8, threshold: 10, status: 'In Stock', fulfillmentSource: 'Offersense', type: 'Service', realTimePssSync: true },
    { id: '6', sku: 'LOU-SIN-T3', category: 'Lounge', supplier: 'Plaza Premium', available: 2, reserved: 5, threshold: 5, status: 'Low Stock', fulfillmentSource: 'Offersense', type: 'Service_Capacity', realTimePssSync: false },
    { id: '7', sku: 'PARK-VALET-DXB', category: 'Parking', supplier: 'DXB Airports', available: 0, reserved: 0, threshold: 5, status: 'Out of Stock', fulfillmentSource: 'Offersense', type: 'Physical', realTimePssSync: true },
];

const STATS = [
  { label: "Total Tracked SKUs", value: 42, color: "purple" as const, icon: <Globe /> },
  { label: "In Stock",           value: 38, color: "green"  as const, icon: <CheckCircle2 /> },
  { label: "Low Stock",          value: 3,  color: "amber"  as const, icon: <AlertTriangle /> },
  { label: "Out of Stock",       value: 1,  color: "red"    as const, icon: <AlertTriangle /> },
];

// ─── Filter Options ───────────────────────────────────────────────────────────
const CATEGORY_OPTIONS   = ["Lounge", "Catering", "Seats", "Connectivity", "Baggage", "Parking"].map((v) => ({ label: v, value: v }));
const STATUS_OPTIONS     = ["In Stock", "Low Stock", "Out of Stock"].map((v) => ({ label: v, value: v }));
const SOURCE_OPTIONS     = ["Offersense", "PSS"].map((v) => ({ label: v, value: v }));
const SYNC_OPTIONS       = [
    { label: "PSS Sync Active", value: "true" },
    { label: "Manual Only", value: "false" }
];

// ─── Status Badge Component ───────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'In Stock') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
        In Stock
      </span>
    );
  }
  if (status === 'Low Stock') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        <AlertTriangle className="h-2.5 w-2.5" />
        Low Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      Out of Stock
    </span>
  );
};

export default function AirlineStockKeeperPage() {
  const firestore = useFirestore();
  const stockQuery = useMemo(() => firestore ? query(collection(firestore, 'airlineInventory'), orderBy('createdAt', 'desc')) : undefined, [firestore]);
  const { data: stockCollection, loading } = useCollection(stockQuery);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const { toast } = useToast();

  // Get source data
  const sourceData = useMemo(() => {
    return (stockCollection && stockCollection.length > 0) ? stockCollection as any[] : initialMockStock;
  }, [stockCollection]);

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
    searchFields: ["sku", "category", "supplier"],
    filterFields: { status: "", category: "", fulfillmentSource: "", realTimePssSync: "" },
  });

  // Custom filter for sync type
  const getFilteredData = () => {
    let data = [...sourceData];
    
    // Apply search
    if (searchText) {
      data = data.filter(item => 
        item.sku?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeFilters.status && activeFilters.status !== "All") {
      data = data.filter(item => item.status === activeFilters.status);
    }
    
    // Apply category filter
    if (activeFilters.category && activeFilters.category !== "All") {
      data = data.filter(item => item.category === activeFilters.category);
    }
    
    // Apply source filter
    if (activeFilters.fulfillmentSource && activeFilters.fulfillmentSource !== "All") {
      data = data.filter(item => item.fulfillmentSource === activeFilters.fulfillmentSource);
    }
    
    // Apply sync filter
    if (activeFilters.realTimePssSync && activeFilters.realTimePssSync !== "All") {
      const isSyncActive = activeFilters.realTimePssSync === "true";
      data = data.filter(item => item.realTimePssSync === isSyncActive);
    }
    
    return data;
  };

  const displayStock = getFilteredData();

  const handleOpenDialog = (item: any | null = null) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: StockItem) => {
    if (!firestore) return;
    
    let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (data.available <= 0) status = 'Out of Stock';
    else if (data.available <= data.threshold) status = 'Low Stock';

    try {
      if (editingItem?.id) {
        const ref = doc(firestore, 'airlineInventory', editingItem.id);
        await setDoc(ref, { ...data, status, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Balance Reconciled', description: `SKU ${data.sku} updated.` });
      } else {
        await addDoc(collection(firestore, 'airlineInventory'), { ...data, status, createdAt: serverTimestamp() });
        toast({ title: 'New Registry Committed', description: `SKU ${data.sku} added to stock keeper.` });
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
        toast({ title: 'SKU Offboarded', variant: 'destructive' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  const handleAction = (action: string, sku: string) => {
      toast({ title: `${action} Executed`, description: `Inventory action for ${sku} confirmed.` });
  }

  // Calculate KPIs
  const totalSkus = sourceData.length;
  const totalHolds = sourceData.reduce((acc, curr) => acc + (curr.reserved || 0), 0);
  const lowStockCount = sourceData.filter(s => s.status === 'Low Stock').length;
  const syncActiveCount = sourceData.filter(s => s.realTimePssSync === true).length;
  const syncPercentage = totalSkus > 0 ? Math.round((syncActiveCount / totalSkus) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      {/* <StatsCards cards={STATS} /> */}

       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tracked SKUs', value: totalSkus, icon: Boxes, color: 'text-violet-600' },
          { label: 'Active Holds (Soft)', value: totalHolds, icon: ShieldCheck, color: 'text-blue-600' },
          { label: 'Critical Low Stock', value: lowStockCount, icon: AlertTriangle, color: 'text-amber-500' },
          { label: 'PSS Sync Health', value: `${syncPercentage}%`, icon: Zap, color: 'text-emerald-500' }
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
        searchPlaceholder="Search SKU registry (code, category, supplier)..."
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
            key: "fulfillmentSource",
            label: "Source",
            options: SOURCE_OPTIONS,
            value: activeFilters.fulfillmentSource ?? "All",
            onChange: (v) => setFilter("fulfillmentSource", v),
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
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tracked SKUs', value: totalSkus, icon: Boxes, color: 'text-violet-600' },
          { label: 'Active Holds (Soft)', value: totalHolds, icon: ShieldCheck, color: 'text-blue-600' },
          { label: 'Critical Low Stock', value: lowStockCount, icon: AlertTriangle, color: 'text-amber-500' },
          { label: 'PSS Sync Health', value: `${syncPercentage}%`, icon: Zap, color: 'text-emerald-500' }
        ].map((kpi) => (
          <Card key={kpi.label} className="p-4 border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
              <kpi.icon className={cn("h-4 w-4", kpi.color)} />
            </div>
            <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
          </Card>
        ))}
      </div> */}

      <Card className="border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)] overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-gray-900">Operational Stock Matrix</CardTitle>
              <CardDescription className="mt-0.5 text-xs text-gray-400">
                Govern availability, confirm hard-allocations, and monitor cross-domain fulfillment signals.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="font-bold border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                <RefreshCw className="mr-2 h-4 w-4" /> Sync All PSS SKUs
              </Button>
              <button
                onClick={() => handleOpenDialog()}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-violet-700"
              >
                <PlusCircle className="h-4 w-4" />
                Initialize SKU Balance
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow className="border-b border-gray-200 hover:bg-gray-100">
                  <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 pl-6">Inventory Identity</TableHead>
                  <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Balance Control</TableHead>
                  <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Fulfillment Pulse</TableHead>
                  <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</TableHead>
                  <TableHead className="py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500 pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayStock.map((item) => (
                  <TableRow key={item.id} className="transition-colors duration-100 hover:bg-violet-50/60">
                    <TableCell className="py-3.5 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-violet-100">
                          <Package className="h-4 w-4 text-violet-600" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-900">{item.sku}</div>
                          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{item.category} • {item.supplier}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="outline" className="text-[8px] h-3.5 bg-white uppercase font-black tracking-tighter border-gray-200 text-gray-600">
                              SOURCE: {item.fulfillmentSource}
                            </Badge>
                            {item.realTimePssSync && (
                              <Badge variant="secondary" className="text-[8px] h-3.5 bg-indigo-50 text-indigo-700 border-indigo-100 font-black uppercase tracking-tighter">
                                <RefreshCw className="h-2 w-2 mr-1 animate-spin" />
                                PSS-Sync
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <div className="flex flex-col gap-1 w-[180px]">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className={item.available < item.threshold ? "text-amber-600 font-black" : "text-emerald-600 font-bold"}>
                            AVL: {item.available}
                          </span>
                          <span className="text-gray-400">TH: {item.threshold}</span>
                        </div>
                        <Progress value={Math.min(100, (item.available / (item.available + item.threshold)) * 100)} className="h-1" />
                        <div className="text-[9px] text-blue-600 font-black uppercase flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="h-2.5 w-2.5" /> Held: {item.reserved} units
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <div className="text-[10px] font-bold text-gray-700">{item.type?.replace('_', ' ')}</div>
                        <div className="flex items-center gap-1.5">
                          <div className={cn("h-1.5 w-1.5 rounded-full", item.fulfillmentSource === 'PSS' || item.realTimePssSync ? "bg-indigo-500" : "bg-emerald-500 animate-pulse")} />
                          <span className="text-[9px] font-black uppercase text-gray-500">
                            {item.fulfillmentSource === 'PSS' ? 'Direct PSS Link' : (item.realTimePssSync ? 'Async PSS Push' : 'Fulfillment Active')}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="py-3.5 text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-xl border border-gray-100 shadow-xl">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase text-gray-500">Stock Operations</DropdownMenuLabel>
                          <DropdownMenuItem 
                            className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Boxes className="mr-2 h-3.5 w-3.5" /> Adjust Current Balance
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-amber-50 hover:text-amber-700"
                            onClick={() => handleAction('Soft Hold Release', item.sku)}
                          >
                            <TrendingDown className="mr-2 h-3.5 w-3.5" /> Flush Expired Holds
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                            onClick={() => handleAction('Registry Audit', item.sku)}
                          >
                            <History className="mr-2 h-3.5 w-3.5" /> View Balance Lineage
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="cursor-pointer text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => item.id && handleDelete(item.id)}
                          >
                            <Truck className="mr-2 h-3.5 w-3.5" /> Decommission SKU
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {displayStock.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-20 text-gray-400" />
                      <p className="font-bold uppercase text-[10px] tracking-widest text-gray-500">No SKUs found in registry</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl overflow-hidden p-0 rounded-3xl border-none shadow-2xl">
          <div className="p-5">
            <DialogTitle className="text-2xl font-black text-primary uppercase">Stock Registry Entry</DialogTitle>
            <DialogDescription className="font-medium">Define authorized fulfillment source, physical/digital type, and safety thresholds.</DialogDescription>
          </div>
          <div className="p-5">
            <StockItemForm
                item={editingItem}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}