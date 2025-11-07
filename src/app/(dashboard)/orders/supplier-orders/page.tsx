'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  RotateCcw,
  DownloadCloud,
  CheckCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SupplierOrderForm, type SupplierOrder } from '@/components/forms/supplier-order-form';
import { useToast } from '@/hooks/use-toast';

const kpiData = [
  { title: 'Supplier Orders', value: '2,430' },
  { title: 'Pending', value: '20' },
  { title: 'Failed', value: '15' },
  { title: 'Avg. API Response', value: '1.8s' },
];

const mockSupplierOrders = [
    { supplierOrderId: 'SUPP_ORD_45678', masterOrderId: 'ORD_91235', supplier: 'ABC Hotels', service: 'Hotel Booking', status: 'Confirmed', timestamp: '2 mins ago' },
    { supplierOrderId: 'SUPP_ORD_45679', masterOrderId: 'ORD_91236', supplier: 'City Transfers', service: 'Airport Transfer', status: 'Pending', timestamp: '5 mins ago' },
    { supplierOrderId: 'SUPP_ORD_45680', masterOrderId: 'ORD_91237', supplier: 'Global Insurance', service: 'Travel Insurance', status: 'Failed', timestamp: '12 mins ago' },
    { supplierOrderId: 'SUPP_ORD_45681', masterOrderId: 'ORD_91238', supplier: 'Tour Group Inc.', service: 'City Tour', status: 'Confirmed', timestamp: '25 mins ago' },
    { supplierOrderId: 'SUPP_ORD_45682', masterOrderId: 'ORD_91239', supplier: 'ABC Hotels', service: 'Hotel Booking', status: 'Confirmed', timestamp: '45 mins ago' },
];

type OrderStatus = 'Confirmed' | 'Pending' | 'Failed';

const getStatusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case 'Confirmed':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Failed':
      return 'destructive';
  }
};

const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
        case 'Confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'Pending': return <Clock className="h-4 w-4 text-yellow-500" />;
        case 'Failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
}

export default function SupplierOrdersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = (data: SupplierOrder) => {
    console.log(data);
    toast({
      title: 'Supplier Order Creation Initiated',
      description: `Creation process started for Offer ID: ${data.offerId}`,
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Supplier Order Console
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor orders for third-party supplier services.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="mr-2" />
            Retry Failed
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2" />
            Create Supplier Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Supplier Orders</CardTitle>
            <CardDescription>
              Log of recent Order creation events for external suppliers.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <DownloadCloud className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier / Service</TableHead>
                <TableHead>Master Order ID</TableHead>
                <TableHead>Supplier Ref.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSupplierOrders.map((order) => (
                <TableRow key={order.supplierOrderId}>
                  <TableCell className="font-medium">
                    <div>{order.supplier}</div>
                    <div className="text-xs text-muted-foreground">{order.service}</div>
                  </TableCell>
                  <TableCell className="font-mono">{order.masterOrderId}</TableCell>
                  <TableCell className="font-mono">{order.supplierOrderId}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status as OrderStatus)} className="gap-1 pl-1.5">
                        {getStatusIcon(order.status as OrderStatus)}
                        {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Manual Supplier Order Builder</DialogTitle>
            <DialogDescription>
              Manually create a supplier order from an Offer ID and link it to a Master Order.
            </DialogDescription>
          </DialogHeader>
          <SupplierOrderForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
