
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
  Archive,
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
  { title: 'Pending Closure', value: '1,240' },
  { title: 'Validated', value: '1,180' },
  { title: 'Closed', value: '1,160' },
  { title: 'Exceptions', value: '20' },
];

type Status = 'Ready' | 'Pending' | 'Error' | 'Closed';

type ValidationItem = {
  orderId: string;
  status: Status;
  payment: boolean;
  inventory: boolean;
  services: boolean;
  timestamp: string;
};

const initialValidationQueue: ValidationItem[] = [
  { orderId: 'ORD_9011', status: 'Ready', payment: true, inventory: true, services: true, timestamp: '1 min ago' },
  { orderId: 'ORD_9010', status: 'Pending', payment: true, inventory: true, services: false, timestamp: '5 mins ago' },
  { orderId: 'ORD_9009', status: 'Ready', payment: true, inventory: true, services: true, timestamp: '8 mins ago' },
  { orderId: 'ORD_9008', status: 'Error', payment: false, inventory: true, services: true, timestamp: '15 mins ago' },
  { orderId: 'ORD_9007', status: 'Closed', payment: true, inventory: true, services: true, timestamp: '22 mins ago' },
];

const getStatusBadgeVariant = (status: Status) => {
  switch (status) {
    case 'Ready':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Error':
      return 'destructive';
    case 'Closed':
      return 'outline';
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
    const [validationQueue, setValidationQueue] = useState<ValidationItem[]>(initialValidationQueue);
    const [isBatchClosing, setIsBatchClosing] = useState(false);
    const { toast } = useToast();

    const handleOpenDialog = (order: ValidationItem) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const handleFormSubmit = (data: FinaliseOrder) => {
        toast({
            title: "Order Closure Initiated",
            description: `Manual closure process started for Order ID: ${data.orderId}`,
        });
        setValidationQueue(prevQueue => 
            prevQueue.map(item => 
                item.orderId === data.orderId ? { ...item, status: 'Closed' } : item
            )
        );
        setIsDialogOpen(false);
        setSelectedOrder(null);
    };

    const handleBatchClosure = () => {
        setIsBatchClosing(true);
        toast({
            title: 'Batch Closure Started',
            description: 'Closing all orders that are ready for finalisation.'
        });

        setTimeout(() => {
            let closedCount = 0;
            setValidationQueue(prevQueue => 
                prevQueue.map(item => {
                    if (item.status === 'Ready') {
                        closedCount++;
                        return { ...item, status: 'Closed' };
                    }
                    return item;
                })
            );
            setIsBatchClosing(false);
            toast({
                title: 'Batch Closure Complete',
                description: `${closedCount} orders have been successfully closed.`
            });
        }, 2000);
    };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Order Finalisation & Closure Console
          </h1>
          <p className="text-muted-foreground">
            Monitor, validate, and commit Orders for fulfilment, settlement, and archival.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2" />
            Export Audit
          </Button>
          <Button onClick={handleBatchClosure} disabled={isBatchClosing}>
            {isBatchClosing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Archive className="mr-2" />}
            Trigger Batch Closure
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
            <CardTitle>Closure & Finalisation Queue</CardTitle>
            <CardDescription>Live view of Orders pending finalisation, closure, and their validation status.</CardDescription>
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
                                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={item.status === 'Error' || item.status === 'Closed'}>
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleOpenDialog(item)}>Review & Close</DropdownMenuItem>
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
            <DialogTitle>Manual Order Closure</DialogTitle>
            <DialogDescription>
              Review and manually close Order <span className="font-mono">{selectedOrder?.orderId}</span>.
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
