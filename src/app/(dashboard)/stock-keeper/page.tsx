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
import { MoreHorizontal, PlusCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type StockItem = {
  sku: string;
  category: string;
  supplier: string;
  available: number;
  reserved: number;
  threshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

const initialStockItems: StockItem[] = [
  { sku: 'MEAL_VG_01', category: 'Meals', supplier: 'SkyCaterers', available: 125, reserved: 20, threshold: 50, status: 'In Stock' },
  { sku: 'SEAT_KIT_01', category: 'Amenity Kits', supplier: 'AirComfort', available: 45, reserved: 5, threshold: 50, status: 'Low Stock' },
  { sku: 'VOUCH_WIFI_24H', category: 'Vouchers', supplier: 'Internal', available: 980, reserved: 15, threshold: 200, status: 'In Stock' },
  { sku: 'LOUNGE_LHR_01', category: 'Lounge Access', supplier: 'Global Lounges', available: 18, reserved: 2, threshold: 20, status: 'Low Stock' },
  { sku: 'MERCH_MUG_01', category: 'Merchandise', supplier: 'AirShop', available: 0, reserved: 0, threshold: 10, status: 'Out of Stock' },
];

const kpiData = [
    { title: 'Active SKUs', value: '420' },
    { title: 'Low Stock Items', value: '14' },
    { title: 'Pending Restocks', value: '6' },
    { title: 'Last Sync', value: '2 mins ago' },
];

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
        <Button>
            <PlusCircle className="mr-2"/> Add Stock Item
        </Button>
      </div>

       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
          <CardDescription>
            Live view of all tracked stock-keeping units (SKUs).
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
              {stockItems.map((item) => (
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
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {item.status}
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Archive SKU
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
