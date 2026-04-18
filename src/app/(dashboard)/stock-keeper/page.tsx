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
  History, 
  RefreshCw, 
  Archive, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Package, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { StockItemForm, type StockItem } from '@/components/forms/stock-item-form';
import { StockReplenishmentAI } from '@/components/stock-keeper/stock-replenishment-ai';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection } from '@/firebase';
import { collection, doc, setDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialStockItems: StockItem[] = [
  { sku: 'MEAL_VG_01', category: 'Meals', supplier: 'SkyCaterers', available: 125, reserved: 20, threshold: 50, status: 'In Stock', type: 'Physical' },
  { sku: 'SEAT_KIT_01', category: 'Amenity Kits', supplier: 'AirComfort', available: 45, reserved: 5, threshold: 50, status: 'Low Stock', type: 'Physical' },
  { sku: 'VOUCH_WIFI_24H', category: 'Vouchers', supplier: 'Internal', available: 980, reserved: 15, threshold: 200, status: 'In Stock', type: 'Digital' },
  { sku: 'LOUNGE_LHR_01', category: 'Lounge Access', supplier: 'Global Lounges', available: 18, reserved: 2, threshold: 20, status: 'Low Stock', type: 'Service_Capacity' },
  { sku: 'MERCH_MUG_01', category: 'Merchandise', supplier: 'AirShop', available: 0, reserved: 0, threshold: 10, status: 'Out of Stock', type: 'Physical' },
];

const mockHistory = [
    { type: 'Credit', change: '+100', reason: 'Manual Restock', user: 'inv_mgr@airline.com', timestamp: '2025-10-28 10:00 UTC' },
    { type: 'Debit', change: '-1', reason: 'Order ORD-7D91A', user: 'System', timestamp: '2025-10-28 09:15 UTC' },
    { type: 'Debit', change: '-1', reason: 'Order ORD-7D91B', user: 'System', timestamp: '2025-10-28 08:30 UTC' },
    { type: 'Initial', change: '500', reason: 'Initial Stocking', user: 'System', timestamp: '2025-10-25 12:00 UTC' },
];

const getStatus = (item: any): StockItem['status'] => {
    if (item.available <= 0) return 'Out of Stock';
    if (item.available <= item.threshold) return 'Low Stock';
    return 'In Stock';
}

export default function StockKeeperDashboardPage() {
  const firestore = useFirestore();
  const stockQuery = useMemo(() => firestore ? collection(firestore, 'stock') : undefined, [firestore]);
  const { data: stockCollection, loading } = useCollection(stockQuery);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState<StockItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'Low Stock' | 'Out of Stock'>('all');
  const { toast } = useToast();

  const displayItems = useMemo(() => {
    const sourceData = (stockCollection && stockCollection.length > 0) ? stockCollection as StockItem[] : initialStockItems;
    return sourceData.filter(item => {
        if (activeFilter === 'all') return true;
        return getStatus(item) === activeFilter;
    });
  }, [stockCollection, activeFilter]);

  const criticalAlerts = useMemo(() => {
      const sourceData = (stockCollection && stockCollection.length > 0) ? stockCollection as StockItem[] : initialStockItems;
      return sourceData.filter(i => getStatus(i) !== 'In Stock');
  }, [stockCollection]);

  const handleOpenDialog = (item: StockItem | null = null) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: StockItem) => {
    if (!firestore) return;
    try {
        const itemStatus = getStatus(data);
        if (data.id) {
            await setDoc(doc(firestore, 'stock', data.id), { ...data, status: itemStatus, updatedAt: serverTimestamp() }, { merge: true });
            toast({ title: 'Inventory Synchronized' });
        } else {
            await addDoc(collection(firestore, 'stock'), { ...data, status: itemStatus, createdAt: serverTimestamp() });
            toast({ title: 'New SKU Registered' });
        }
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
    setIsDialogOpen(false);
  }

  const handleDelete = async (id: string) => {
    if (!firestore || !id) return;
    try {
        await deleteDoc(doc(firestore, 'stock', id));
        toast({ title: 'SKU Decommissioned', variant: 'destructive' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Ecosystem Stock Dashboard</h1>
          <p className="text-muted-foreground font-medium">Logistics oversight for air ancillaries, vouchers, and service capacity.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Global API Sync</Button>
            <Button onClick={() => handleOpenDialog()} className="font-bold"><PlusCircle className="mr-2 h-4 w-4"/> Register New SKU</Button>
        </div>
      </div>

      {/* --- CRITICAL ALERTS Center --- */}
      {criticalAlerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {criticalAlerts.slice(0, 3).map(alert => (
                  <Alert key={alert.sku} variant={getStatus(alert) === 'Out of Stock' ? 'destructive' : 'default'} className="bg-background shadow-sm border-l-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="text-xs font-black uppercase tracking-widest">
                          {getStatus(alert)}: {alert.sku}
                      </AlertTitle>
                      <AlertDescription className="text-[10px] mt-1 flex justify-between items-center">
                          <span>Only {alert.available} units remaining. Threshold is {alert.threshold}.</span>
                          <Button variant="link" className="h-auto p-0 text-[10px] font-black underline" onClick={() => handleOpenDialog(alert)}>REPLENISH</Button>
                      </AlertDescription>
                  </Alert>
              ))}
          </div>
      )}

       <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
            { title: 'Total SKUs', value: displayItems.length, icon: Package, color: 'text-primary' },
            { title: 'Low Stock', value: criticalAlerts.filter(i => getStatus(i) === 'Low Stock').length, icon: AlertTriangle, color: 'text-yellow-500' },
            { title: 'Out of Stock', value: criticalAlerts.filter(i => getStatus(i) === 'Out of Stock').length, icon: TrendingUp, color: 'text-destructive' },
            { title: 'Sync Health', value: '100%', icon: CheckCircle2, color: 'text-emerald-500' }
        ].map((kpi) => (
          <Card key={kpi.title} className="p-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.title}</p>
              <kpi.icon className={cn("h-4 w-4", kpi.color)} />
            </div>
            <div className="text-3xl font-black">{kpi.value}</div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Card className="lg:col-span-8 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20 pb-4">
                <div>
                    <CardTitle>Inventory Matrix</CardTitle>
                    <CardDescription>Live balance of available vs. reserved units across the ecosystem.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant={activeFilter === 'all' ? 'default' : 'outline'} size="sm" className="text-[10px] h-7" onClick={() => setActiveFilter('all')}>ALL</Button>
                    <Button variant={activeFilter === 'Low Stock' ? 'secondary' : 'outline'} size="sm" className="text-[10px] h-7" onClick={() => setActiveFilter('Low Stock')}>LOW</Button>
                    <Button variant={activeFilter === 'Out of Stock' ? 'destructive' : 'outline'} size="sm" className="text-[10px] h-7" onClick={() => setActiveFilter('Out of Stock')}>OUT</Button>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                  <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>SKU & Fulfillment</TableHead>
                        <TableHead>Balance Logic</TableHead>
                        <TableHead>Utilization</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {displayItems.map((item) => {
                        const status = getStatus(item);
                        const total = (item.available || 0) + (item.reserved || 0);
                        const utilization = total > 0 ? (item.reserved / total) * 100 : 0;
                        return (
                            <TableRow key={item.sku} className="group hover:bg-muted/30 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-lg bg-primary/10 text-primary", status === 'Out of Stock' && "bg-destructive/10 text-destructive")}>
                                            <Package className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm font-mono">{item.sku}</div>
                                            <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">{item.type?.replace('_', ' ')} • {item.supplier}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between text-[10px] font-mono font-bold">
                                            <span className="text-emerald-600">AVAIL: {item.available}</span>
                                            <span className="text-primary">RES: {item.reserved}</span>
                                        </div>
                                        <div className="text-[9px] text-muted-foreground italic">Restock Signal: &lt; {item.threshold}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="w-[180px]">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase">
                                            <span>Cart Exposure</span>
                                            <span>{utilization.toFixed(0)}%</span>
                                        </div>
                                        <Progress value={utilization} className="h-1 bg-muted group-hover:h-1.5 transition-all"/>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge 
                                        variant={status === 'In Stock' ? 'default' : (status === 'Low Stock' ? 'secondary' : 'destructive')} 
                                        className="text-[9px] font-black uppercase tracking-tighter"
                                    >
                                        {status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel>Logistics Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleOpenDialog(item)}><RefreshCw className="mr-2 h-4 w-4"/>Adjust Balance</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { setSelectedItemForHistory(item); setIsHistoryDialogOpen(true); }}><History className="mr-2 h-4 w-4"/>View Audit Trail</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive font-bold" onClick={() => item.id && handleDelete(item.id)}><Archive className="mr-2 h-4 w-4"/>Decommission SKU</DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
              )}
            </CardContent>
        </Card>
        
        <div className="lg:col-span-4 space-y-6">
            <StockReplenishmentAI />
            
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" /> Forecasted Demand
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                            <span>MEAL_VG_01 (Next 48h)</span>
                            <span className="text-emerald-600">+12%</span>
                        </div>
                        <Progress value={85} className="h-1" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                            <span>LOUNGE_LHR (Weekend)</span>
                            <span className="text-primary">+45%</span>
                        </div>
                        <Progress value={92} className="h-1" />
                    </div>
                    <Button variant="outline" className="w-full h-8 text-[10px] font-black uppercase tracking-widest mt-2 group">
                        Full Market Forecast <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {editingItem ? 'Adjust Logistics Unit' : 'Register New Logistics Unit'}
            </DialogTitle>
            <DialogDescription>Define commercial logistics for physical goods, digital vouchers, or service capacity.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 pt-2">
            <StockItemForm
              item={editingItem}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-mono">Audit Trail: {selectedItemForHistory?.sku}</DialogTitle>
            <DialogDescription>Full chronological history of stock movements and retailing reservations.</DialogDescription>
          </DialogHeader>
           <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Delta</TableHead>
                        <TableHead>Reference / Reason</TableHead>
                        <TableHead>Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockHistory.map((entry, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Badge variant={entry.type === 'Credit' ? 'default' : 'secondary'} className="text-[10px] font-black uppercase">{entry.type}</Badge>
                            </TableCell>
                            <TableCell className={cn("font-mono font-bold", entry.type === 'Credit' ? 'text-emerald-600' : 'text-primary')}>{entry.change}</TableCell>
                            <TableCell>
                                <div className="text-xs font-bold">{entry.reason}</div>
                                <div className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">Actor: {entry.user}</div>
                            </TableCell>
                            <TableCell className="text-xs font-mono text-muted-foreground">{entry.timestamp}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DialogContent>
      </Dialog>

    </div>
  );
}
