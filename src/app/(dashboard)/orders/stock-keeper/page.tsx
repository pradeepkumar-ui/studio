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
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { StockItemForm, type StockItem } from '@/components/forms/stock-item-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const initialMockStock: any[] = [
    { id: '1', sku: 'LOU-LHR-T5-01', category: 'Lounge', supplier: 'Lounge Stars', available: 12, reserved: 4, threshold: 5, status: 'In Stock', fulfillmentSource: 'Offersense', type: 'Service_Capacity', realTimePssSync: true },
    { id: '2', sku: 'MEAL-PRE-VEG', category: 'Catering', supplier: 'SkyCafe', available: 3, reserved: 2, threshold: 5, status: 'Low Stock', fulfillmentSource: 'Offersense', type: 'Physical', realTimePssSync: false },
    { id: '3', sku: 'SEAT-EX-LG', category: 'Seats', supplier: 'Carrier', available: 450, reserved: 22, threshold: 50, status: 'In Stock', fulfillmentSource: 'PSS', type: 'Service_Capacity', realTimePssSync: false },
    { id: '4', sku: 'WIFI-PREM-PASS', category: 'Connectivity', supplier: 'Carrier', available: 1000, reserved: 12, threshold: 100, status: 'In Stock', fulfillmentSource: 'PSS', type: 'Digital', realTimePssSync: false },
];

export default function AirlineStockKeeperPage() {
  const firestore = useFirestore();
  const stockQuery = useMemo(() => firestore ? query(collection(firestore, 'airlineInventory'), orderBy('createdAt', 'desc')) : undefined, [firestore]);
  const { data: stockCollection, loading } = useCollection(stockQuery);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const { toast } = useToast();

  const displayStock = useMemo(() => {
    const sourceData = (stockCollection && stockCollection.length > 0) ? stockCollection as any[] : initialMockStock;
    return sourceData.filter(s => 
        s.sku?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stockCollection, searchTerm]);

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-primary uppercase">Airline Stock Keeper</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Operational Fulfillment & Availability Governance</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="font-bold border-indigo-200 bg-indigo-50 text-indigo-700">
                <RefreshCw className="mr-2 h-4 w-4" /> Sync All PSS SKUs
            </Button>
            <Button onClick={() => handleOpenDialog()} className="font-bold shadow-lg">
                <PlusCircle className="mr-2 h-4 w-4" /> Initialize SKU Balance
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tracked SKUs', value: displayStock.length, icon: Boxes, color: 'text-primary' },
          { label: 'Active Holds (Soft)', value: displayStock.reduce((acc, curr) => acc + (curr.reserved || 0), 0), icon: ShieldCheck, color: 'text-blue-600' },
          { label: 'Critical Low Stock', value: displayStock.filter(s => s.status === 'Low Stock').length, icon: AlertTriangle, color: 'text-amber-500' },
          { label: 'PSS Sync Health', value: '100%', icon: Zap, color: 'text-emerald-500' }
        ].map((kpi) => (
          <Card key={kpi.label} className="p-6 bg-white shadow-sm border-primary/5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.label}</p>
              <kpi.icon className={kpi.color + " h-4 w-4"} />
            </div>
            <p className="text-2xl font-black">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <Card className="shadow-xl border-primary/10 overflow-hidden">
        <CardHeader className="bg-primary/5 border-b py-4">
            <CardTitle className="text-lg">Operational Stock Matrix</CardTitle>
            <CardDescription>Govern availability, confirm hard-allocations, and monitor cross-domain fulfillment signals.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SKU registry (code, category)..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9 bg-white"
              />
            </div>
          </div>

          <div className="rounded-xl border border-muted/60 overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/30">
                <TableRow>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest">Inventory Identity</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest">Balance Control</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest">Fulfillment Pulse</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {displayStock.map((item) => (
                    <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                                <Package className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-primary">{item.sku}</div>
                                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{item.category} • {item.supplier}</div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Badge variant="outline" className="text-[8px] h-3.5 bg-white uppercase font-black tracking-tighter">SOURCE: {item.fulfillmentSource}</Badge>
                                    {item.realTimePssSync && (
                                        <Badge variant="secondary" className="text-[8px] h-3.5 bg-indigo-50 text-indigo-700 border-indigo-100 font-black uppercase tracking-tighter">
                                            <RefreshCw className="h-2 w-2 mr-1 animate-spin-slow" />
                                            PSS-Sync
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-1 w-[180px]">
                            <div className="flex justify-between text-[10px] font-mono">
                                <span className={item.available < item.threshold ? "text-destructive font-black" : "text-emerald-600 font-bold"}>AVL: {item.available}</span>
                                <span className="text-muted-foreground">TH: {item.threshold}</span>
                            </div>
                            <Progress value={Math.min(100, (item.available / (item.available + item.threshold)) * 100)} className="h-1" />
                            <div className="text-[9px] text-blue-600 font-black uppercase flex items-center gap-1 mt-0.5">
                                <ShieldCheck className="h-2.5 w-2.5" /> Held: {item.reserved} units
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-0.5">
                            <div className="text-[10px] font-bold text-slate-700">{item.type?.replace('_', ' ')}</div>
                            <div className="flex items-center gap-1.5">
                                <div className={cn("h-1.5 w-1.5 rounded-full", item.fulfillmentSource === 'PSS' || item.realTimePssSync ? "bg-indigo-500" : "bg-emerald-500 animate-pulse")} />
                                <span className="text-[9px] font-black uppercase text-muted-foreground">
                                    {item.fulfillmentSource === 'PSS' ? 'Direct PSS Link' : (item.realTimePssSync ? 'Async PSS Push' : 'Fulfillment Active')}
                                </span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={item.status === 'In Stock' ? 'default' : (item.status === 'Low Stock' ? 'secondary' : 'destructive')} className="text-[9px] font-black uppercase tracking-wider">{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground">Stock Operations</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(item)} className="font-bold"><Boxes className="mr-2 h-4 w-4"/>Adjust Current Balance</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Soft Hold Release', item.sku)}><TrendingDown className="mr-2 h-4 w-4"/>Flush Expired Holds</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Registry Audit', item.sku)}><History className="mr-2 h-4 w-4"/>View Balance Lineage</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => item.id && handleDelete(item.id)}><Truck className="mr-2 h-4 w-4"/>Decommission SKU</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                {displayStock.length === 0 && !loading && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                            <Package className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="font-bold uppercase text-[10px] tracking-widest">No SKUs found in registry</p>
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
          <div className="p-8 border-b bg-primary/5">
              <DialogTitle className="text-2xl font-black text-primary uppercase">Stock Registry Entry</DialogTitle>
              <DialogDescription className="font-medium">Define authorized fulfillment source, physical/digital type, and safety thresholds.</DialogDescription>
          </div>
          <div className="p-8">
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
