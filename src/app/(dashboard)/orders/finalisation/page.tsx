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
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  FileDown,
  Sparkles,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OrderFinalisationForm, type FinaliseOrder } from '@/components/forms/order-finalisation-form';
import { useToast } from '@/hooks/use-toast';

const kpiData = [
  { title: 'Ready for Finalisation', value: '1,240' },
  { title: 'Processing', value: '8' },
  { title: 'Errors', value: '2' },
  { title: 'Avg. Finalisation Time', value: '1.8s' },
];

type Status = 'Ready' | 'Pending' | 'Error';

type ValidationItem = {
  orderId: string;
  status: Status;
  payment: boolean;
  inventory: boolean;
  services: boolean;
  timestamp: string;
};

const validationQueue: ValidationItem[] = [
  { orderId: 'ORD_9011', status: 'Ready', payment: true, inventory: true, services: true, timestamp: '1 min ago' },
  { orderId: 'ORD_9010', status: 'Pending', payment: true, inventory: true, services: false, timestamp: '5 mins ago' },
  { orderId: 'ORD_9009', status: 'Ready', payment: true, inventory: true, services: true, timestamp: '8 mins ago' },
  { orderId: 'ORD_9008', status: 'Error', payment: false, inventory: true, services: true, timestamp: '15 mins ago' },
  { orderId: 'ORD_9007', status: 'Ready', payment: true, inventory: true, services: true, timestamp: '22 mins ago' },
];

const getStatusBadgeVariant = (status: Status) => {
  switch (status) {
    case 'Ready':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Error':
      return 'destructive';
  }
};

const getCheckIcon = (isValid: boolean) => {
  return isValid ? (
    <CheckCircle className="h-4 w-4 text-green-500" />
  ) : (
    <Clock className="h-4 w-4 text-yellow-500" />
  );
};


export default function OrderFinalisationPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<ValidationItem | null>(null);
    const { toast } = useToast();

    const handleOpenDialog = (order: ValidationItem) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const handleFormSubmit = (data: FinaliseOrder) => {
        console.log(data);
        toast({
        title: "Order Finalisation Initiated",
        description: `Manual finalisation process started for Order ID: ${data.orderId}`,
        });
        setIsDialogOpen(false);
        setSelectedOrder(null);
  }


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Order Finalisation Console
          </h1>
          <p className="text-muted-foreground">
            Monitor, validate, and commit Orders for fulfilment and settlement.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2" />
            Export Finalisation Logs
          </Button>
          <Button>
            <Sparkles className="mr-2" />
            Trigger Batch Finalisation
          </Button>
        </div>
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
            <CardTitle>Finalisation Queue</CardTitle>
            <CardDescription>Live view of Orders pending finalisation and their validation status.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Overall Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Inventory</TableHead>
                        <TableHead>Services</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {validationQueue.map(item => (
                        <TableRow key={item.orderId}>
                            <TableCell className="font-mono font-medium">{item.orderId}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                            </TableCell>
                            <TableCell>{getCheckIcon(item.payment)}</TableCell>
                            <TableCell>{getCheckIcon(item.inventory)}</TableCell>
                            <TableCell>{getCheckIcon(item.services)}</TableCell>
                            <TableCell>{item.timestamp}</TableCell>
                            <TableCell>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={item.status === 'Error'}>
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleOpenDialog(item)}>Review & Finalise</DropdownMenuItem>
                                        <DropdownMenuItem>View Order Details</DropdownMenuItem>
                                        <DropdownMenuItem>Reprocess Validations</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Manual Order Finalisation</DialogTitle>
            <DialogDescription>
              Review and manually finalise Order <span className="font-mono">{selectedOrder?.orderId}</span>.
            </DialogDescription>
          </DialogHeader>
          <OrderFinalisationForm
            order={selectedOrder}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
