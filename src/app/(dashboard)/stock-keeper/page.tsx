
'use client';

import { useState } from 'react';
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
import { MoreHorizontal, PlusCircle, History, Upload, RefreshCw, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { StockItemForm, type StockItem } from '@/components/forms/stock-item-form';
import { StockReplenishmentAI } from '@/components/stock-keeper/stock-replenishment-ai';
import { cn } from '@/lib/utils';

const initialStockItems: StockItem[] = [
  { sku: 'MEAL_VG_01', category: 'Meals', supplier: 'SkyCaterers', available: 125, reserved: 20, threshold: 50, status: 'In Stock' },
  { sku: 'SEAT_KIT_01', category: 'Amenity Kits', supplier: 'AirComfort', available: 45, reserved: 5, threshold: 50, status: 'Low Stock' },
  { sku: 'VOUCH_WIFI_24H', category: 'Vouchers', supplier: 'Internal', available: 980, reserved: 15, threshold: 200, status: 'In Stock' },
  { sku: 'LOUNGE_LHR_01', category: 'Lounge Access', supplier: 'Global Lounges', available: 18, reserved: 2, threshold: 20, status: 'Low Stock' },
  { sku: 'MERCH_MUG_01', category: 'Merchandise', supplier: 'AirShop', available: 0, reserved: 0, threshold: 10, status: 'Out of Stock' },
];

const mockHistory = [
    { type: 'Credit', change: '+100', reason: 'Manual Restock', user: 'inv_mgr@airline.com', timestamp: '2025-10-28 10:00 UTC' },
    { type: 'Debit', change: '-1', reason: 'Order ORD-7D91A', user: 'System', timestamp: '2025-10-28 09:15 UTC' },
    { type: 'Debit', change: '-1', reason: 'Order ORD-7D91B', user: 'System', timestamp: '2025-10-28 08:30 UTC' },
    { type: 'Initial', change: '500', reason: 'Initial Stocking', user: 'System', timestamp: '2025-10-25 12:00 UTC' },
];

type StockFilter = 'all' | 'Low Stock' | 'Out of Stock' | 'pending_restock';

const getStatus = (item: Omit<StockItem, 'status'>): StockItem['status'] => {
    if (item.available <= 0) return 'Out of Stock';
    if (item.available <= item.threshold) return 'Low Stock';
    return 'In Stock';
}

const getStatusBadgeVariant = (status: StockItem['status']) => {
  switch (status) {
    case 'In Stock': return 'default';
    case 'Low Stock': return 'secondary';
    case 'Out of Stock': return 'destructive';
    default: return 'outline';
  }
};


export default function StockKeeperPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState<StockItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<StockFilter>('all');
  const { toast } = useToast();

  const handleOpenDialog = (item: StockItem | null = null) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = (data: StockItem) => {
    if (editingItem) {
        setStockItems(stockItems.map(item => item.sku === data.sku ? data : item));
        toast({ title: 'Inventory Synchronized', description: `SKU "${data.sku}" updated successfully.`});
    } else {
        if (stockItems.some(item => item.sku === data.sku)) {
            toast({ variant: 'destructive', title: 'Error', description: 'This SKU already exists in the registry.'});
            return;
        }
        setStockItems([data, ...stockItems]);
        toast({ title: 'New SKU Registered', description: `SKU "${data.sku}" is now live for retailing.`});
    }
    handleDialogClose();
  }

  const handleViewHistory = (item: StockItem) => {
    setSelectedItemForHistory(item);
    setIsHistoryDialogOpen(true);
  };

  const filteredItems = stockItems.filter(item => {
    if (activeFilter === 'all') return true;
    const status = getStatus(item);
    if (activeFilter === 'pending_restock') return status === 'Low Stock' || status === 'Out of Stock';
    return status === activeFilter;
  });
  
  const kpiData = [
    { title: 'Retailable SKUs', value: stockItems.length, filter: 'all' as StockFilter },
    { title: 'Critical Low Stock', value: stockItems.filter(i => getStatus(i) === 'Low Stock').length, filter: 'Low Stock' as StockFilter },
    { title: 'Stock-Out Incidents', value: stockItems.filter(i => getStatus(i) === 'Out of Stock').length, filter: 'Out of Stock' as StockFilter },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Ecosystem Stock Keeper</h1>
          <p className="text-muted-foreground">Manage logistics for physical merchandise, digital vouchers, and service capacity.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> API Sync</Button>
            <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2"/> Register New SKU</Button>
        </div>
      </div>

       <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className={cn("cursor-pointer hover:bg-muted/50 transition-all", activeFilter === kpi.filter && "ring-2 ring-primary")} onClick={() => setActiveFilter(kpi.filter)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-tight">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Matrix</CardTitle>
              <CardDescription>Live balance of available vs. reserved units across the ecosystem.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU & Category</TableHead>
                    <TableHead>Fulfillment Logic</TableHead>
                    <TableHead>Avail / Reserved</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const status = getStatus(item);
                    return (
                        <TableRow key={item.sku}>
                            <TableCell>
                                <div className="font-bold text-sm">{item.sku}</div>
                                <div className="text-[10px] text-muted-foreground uppercase">{item.category}</div>
                            </TableCell>
                            <TableCell>
                                <div className="text-xs">{item.supplier}</div>
                                <div className="text-[10px] text-muted-foreground italic">Restock: {item.threshold} units</div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-mono">
                                        <span>{item.available}</span>
                                        <span className="text-muted-foreground">/ {item.reserved}</span>
                                    </div>
                                    <Progress value={(item.available / (item.available + item.reserved + 1)) * 100} className="h-1"/>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(status)} className="text-[10px]">{status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleOpenDialog({...item, status})}><RefreshCw className="mr-2 h-4 w-4"/>Adjust Balance</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleViewHistory(item)}><History className="mr-2 h-4 w-4"/>View Audit Log</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive"><Archive className="mr-2 h-4 w-4"/>Decommission SKU</DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )
                })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <StockReplenishmentAI />
      </div>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Adjust Inventory Balance' : 'Register New Logistics Unit'}</DialogTitle>
            <DialogDescription>Define commercial logistics for physical goods or digital service capacity.</DialogDescription>
          </DialogHeader>
          <StockItemForm
            item={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Audit Trail: {selectedItemForHistory?.sku}</DialogTitle>
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
                                <Badge variant={entry.type === 'Credit' ? 'default' : 'secondary'} className="text-[10px]">{entry.type}</Badge>
                            </TableCell>
                            <TableCell className="font-mono font-bold">{entry.change}</TableCell>
                            <TableCell>
                                <div className="text-xs">{entry.reason}</div>
                                <div className="text-[10px] text-muted-foreground">Actor: {entry.user}</div>
                            </TableCell>
                            <TableCell className="text-xs font-mono">{entry.timestamp}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DialogContent>
      </Dialog>

    </div>
  );
}
