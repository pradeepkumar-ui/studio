
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
import { MoreHorizontal, PlusCircle, History, Upload, RefreshCw } from 'lucide-react';
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
  { sku: 'BAG_23KG_01', category: 'Baggage', supplier: 'Internal', available: 9999, reserved: 250, threshold: 0, status: 'In Stock' },
  { sku: 'SEAT_XL_01', category: 'Seats', supplier: 'Internal', available: 80, reserved: 12, threshold: 10, status: 'In Stock' },
  { sku: 'MEAL_KSML_01', category: 'Meals', supplier: 'KosherCaterers', available: 3, reserved: 1, threshold: 5, status: 'Low Stock' },
  { sku: 'VOUCH_DRINK_01', category: 'Vouchers', supplier: 'Internal', available: 500, reserved: 30, threshold: 100, status: 'In Stock' },
  { sku: 'MERCH_MODEL_A380', category: 'Merchandise', supplier: 'AirShop', available: 25, reserved: 2, threshold: 10, status: 'In Stock' },
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
        toast({ title: 'Stock Item Updated', description: `SKU "${data.sku}" has been updated.`});
    } else {
        if (stockItems.some(item => item.sku === data.sku)) {
            toast({ variant: 'destructive', title: 'Error', description: 'An item with this SKU already exists.'});
            return;
        }
        setStockItems([data, ...stockItems]);
        toast({ title: 'Stock Item Created', description: `New SKU "${data.sku}" has been added.`});
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
    { title: 'Active SKUs', value: stockItems.length, filter: 'all' as StockFilter },
    { title: 'Low Stock Items', value: stockItems.filter(i => getStatus(i) === 'Low Stock').length, filter: 'Low Stock' as StockFilter },
    { title: 'Out of Stock', value: stockItems.filter(i => getStatus(i) === 'Out of Stock').length, filter: 'Out of Stock' as StockFilter },
    { title: 'Pending Restock', value: stockItems.filter(i => getStatus(i) === 'Low Stock' || getStatus(i) === 'Out of Stock').length, filter: 'pending_restock' as StockFilter },
  ];


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Stock Keeper
          </h1>
          <p className="text-muted-foreground">
            Manage inventory for ancillary products, vouchers, and other offerable items.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Upload Stock
            </Button>
            <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Sync with API
            </Button>
            <Button onClick={() => handleOpenDialog()}>
                <PlusCircle className="mr-2"/> Add Stock Item
            </Button>
        </div>
      </div>

       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className={cn("cursor-pointer hover:bg-muted/50", activeFilter === kpi.filter && "ring-2 ring-primary")} onClick={() => setActiveFilter(kpi.filter)}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Stock Levels</CardTitle>
              <CardDescription>
                Live view of all tracked stock-keeping units (SKUs). 
                {activeFilter !== 'all' && <span className="font-semibold"> Filtering by: {activeFilter}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Available / Reserved</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const status = getStatus(item);
                    return (
                        <TableRow key={item.sku}>
                            <TableCell className="font-medium font-mono">{item.sku}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={(item.available / (item.available + item.reserved + item.threshold)) * 100} className="h-2 w-24"/>
                                    <span>{item.available} / <span className="text-muted-foreground">{item.reserved}</span></span>
                                </div>
                            </TableCell>
                            <TableCell>{item.threshold}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(status)}>
                                {status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                    >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleOpenDialog({...item, status})}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleViewHistory(item)}>View History</DropdownMenuItem>
                                    <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                    Archive SKU
                                    </DropdownMenuItem>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Stock Item' : 'Create New Stock Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? `Editing SKU "${editingItem.sku}".` : 'Define a new stock-keeping unit.'}
            </DialogDescription>
          </DialogHeader>
          <StockItemForm
            item={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stock History for "{selectedItemForHistory?.sku}"</DialogTitle>
            <DialogDescription>
                A log of all stock changes for this item.
            </DialogDescription>
          </DialogHeader>
           <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockHistory.map((entry, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Badge variant={entry.type === 'Credit' ? 'default' : 'secondary'}>{entry.type}</Badge>
                            </TableCell>
                            <TableCell className="font-mono">{entry.change}</TableCell>
                            <TableCell>{entry.reason}</TableCell>
                            <TableCell>{entry.timestamp}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DialogContent>
      </Dialog>

    </div>
  );
}
