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
  Search, 
  Store, 
  AlertTriangle, 
  ShieldCheck, 
  History, 
  RefreshCw,
  Loader2,
  TrendingDown,
  Zap,
  Clock,
  Activity,
  MapPin
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AirportStockItemForm, type AirportStockItem } from '@/components/forms/airport-stock-item-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';

const initialMockStock: any[] = [
    { id: '1', sku: 'LOU-LHR-T5-EXP', airportCode: 'LHR', terminal: 'T5', category: 'Lounge', available: 12, reserved: 4, threshold: 5, status: 'In Stock', fulfillmentSource: 'Offersense', protocol: 'Slot-based', isSlotActive: true },
    { id: '2', sku: 'FST-JFK-T4-PEAK', airportCode: 'JFK', terminal: 'T4', category: 'Fast-track', available: 45, reserved: 10, threshold: 10, status: 'In Stock', fulfillmentSource: 'Supplier_API', protocol: 'Capacity-based' },
    { id: '3', sku: 'BUGGY-SIN-T3', airportCode: 'SIN', terminal: 'T3', category: 'Ground Transport', available: 2, reserved: 1, threshold: 2, status: 'Low Stock', fulfillmentSource: 'Offersense', protocol: 'Resource-count' },
    { id: '4', sku: 'ASSIST-DXB-T3', airportCode: 'DXB', terminal: 'T3', category: 'Meet & Assist', available: 8, reserved: 0, threshold: 2, status: 'In Stock', fulfillmentSource: 'Offersense', protocol: 'Resource-count' },
];

export default function AirportStockKeeperPage() {
  const firestore = useFirestore();
  const stockQuery = useMemo(() => firestore ? query(collection(firestore, 'airportInventory'), orderBy('createdAt', 'desc')) : undefined, [firestore]);
  const { data: stockCollection, loading } = useCollection(stockQuery);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AirportStockItem | null>(null);
  const { toast } = useToast();

  const displayStock = useMemo(() => {
    const sourceData = (stockCollection && stockCollection.length > 0) ? stockCollection as any[] : initialMockStock;
    return sourceData.filter(s => 
        s.sku?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.airportCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stockCollection, searchTerm]);

  const handleOpenDialog = (item: any | null = null) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: AirportStockItem) => {
    if (!firestore) return;
    
    let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (data.available <= 0) status = 'Out of Stock';
    else if (data.available <= data.threshold) status = 'Low Stock';

    try {
      if (editingItem?.id) {
        const ref = doc(firestore, 'airportInventory', editingItem.id);
        await setDoc(ref, { ...data, status, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Hub Balance Updated', description: `SKU ${data.sku} synchronized.` });
      } else {
        await addDoc(collection(firestore, 'airportInventory'), { ...data, status, createdAt: serverTimestamp() });
        toast({ title: 'Node SKU Registered', description: `Hub resource ${data.sku} committed.` });
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
        toast({ title: 'Hub Node Decommissioned', variant: 'destructive' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-primary uppercase">Airport Stock Keeper</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Hub Fulfillment & Resource Orchestration</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="font-bold border-indigo-200 bg-indigo-50 text-indigo-700">
                <RefreshCw className="mr-2 h-4 w-4" /> Sync Hub Nodes
            </Button>
            <Button onClick={() => handleOpenDialog()} className="font-bold shadow-lg">
                <PlusCircle className="mr-2 h-4 w-4" /> Register Hub Balance
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Hub SKUs', value: displayStock.length, icon: Store, color: 'text-primary' },
          { label: 'Hub Holds Volume', value: displayStock.reduce((acc, curr) => acc + (curr.reserved || 0), 0), icon: Clock, color: 'text-blue-600' },
          { label: 'Node Sync Health', value: '100%', icon: Activity, color: 'text-emerald-500' },
          { label: 'Low Stock Alerts', value: displayStock.filter(s => s.status === 'Low Stock').length, icon: AlertTriangle, color: 'text-amber-500' }
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
            <CardTitle className="text-lg">Operational Hub Registry</CardTitle>
            <CardDescription>Govern localized node availability, validate slot timing, and manage cross-supplier fulfillment.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hub registry (SKU, Airport)..."
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
                    <TableHead className="text-[10px] uppercase font-black tracking-widest">Node SKU & Context</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest">Balance Protocol</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest">Sync Source</TableHead>
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
                                <Store className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-primary">{item.sku}</div>
                                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                                    <MapPin className="h-2.5 w-2.5 text-blue-500" /> {item.airportCode} {item.terminal} • {item.category}
                                </div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-1 w-[180px]">
                            <div className="flex justify-between text-[10px] font-mono">
                                <span className={item.available <= item.threshold ? "text-destructive font-black" : "text-emerald-600 font-bold"}>AVL: {item.available}</span>
                                <span className="text-muted-foreground">TH: {item.threshold}</span>
                            </div>
                            <Progress value={Math.min(100, (item.available / (item.available + item.threshold)) * 100)} className="h-1" />
                            <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-[8px] h-3.5 bg-white uppercase font-black tracking-tighter">{item.protocol}</Badge>
                                {item.isSlotActive && <Clock className="h-2.5 w-2.5 text-blue-600" />}
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-0.5">
                            <div className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{item.fulfillmentSource?.replace('_', ' ')}</div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase text-muted-foreground">Hub Sync Active</span>
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
                            <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground">Hub Operations</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(item)} className="font-bold"><Zap className="mr-2 h-4 w-4"/>Adjust Node Capacity</DropdownMenuItem>
                            <DropdownMenuItem><TrendingDown className="mr-2 h-4 w-4"/>Release Expired Holds</DropdownMenuItem>
                            <DropdownMenuItem><History className="mr-2 h-4 w-4"/>View Sync Audit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => item.id && handleDelete(item.id)}>Remove Hub SKU</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                {displayStock.length === 0 && !loading && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                            <Store className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="font-bold uppercase text-[10px] tracking-widest">No hub nodes found in registry</p>
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
              <DialogTitle className="text-2xl font-black text-primary uppercase">Hub Balance Entry</DialogTitle>
              <DialogDescription className="font-medium">Define authorized airport fulfillment source, protocol type (Slot/Capacity), and safety floor.</DialogDescription>
          </div>
          <div className="p-8">
            <AirportStockItemForm
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
