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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MoreHorizontal, PlusCircle, Download, RefreshCw, Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PaymentForm, type Payment } from '@/components/forms/payment-form';

const kpiData = [
  { title: 'Payments Today', value: '15,420' },
  { title: 'Success Rate', value: '98.0%' },
  { title: 'PSP Latency (p95)', value: '1.2s' },
  { title: 'Active Refunds', value: '42' },
];

const mockPayments: Payment[] = [
    { id: 'PAY_77491', orderId: 'ORD_88213', amount: 320.50, currency: 'GBP', psp: 'Stripe', method: 'Card', status: 'Captured', timestamp: '5 mins ago' },
    { id: 'PAY_77490', orderId: 'ORD_88212', amount: 1250.00, currency: 'USD', psp: 'Adyen', method: 'Card', status: 'Captured', timestamp: '8 mins ago' },
    { id: 'PAY_77489', orderId: 'ORD_88211', amount: 88.00, currency: 'EUR', psp: 'PayPal', method: 'Wallet', status: 'Authorized', timestamp: '15 mins ago' },
    { id: 'PAY_77488', orderId: 'ORD_88210', amount: 450.00, currency: 'USD', psp: 'Stripe', method: 'Card', status: 'Failed', timestamp: '22 mins ago' },
    { id: 'PAY_77487', orderId: 'ORD_88209', amount: 1800.00, currency: 'USD', psp: 'Adyen', method: 'Card', status: 'Captured', timestamp: '45 mins ago' },
];

export default function PaymentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (payment: Payment | null = null) => {
    setEditingPayment(payment);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPayment(null);
  };

  const handleFormSubmit = (data: Payment) => {
    console.log(data);
    toast({
      title: editingPayment ? "Payment Updated" : "Payment Captured",
      description: `Payment for Order ID "${data.orderId}" has been processed.`,
    });
    handleDialogClose();
  }

  const getStatusBadgeVariant = (status: Payment['status']) => {
    switch (status) {
      case 'Captured':
      case 'Settled':
        return 'default';
      case 'Authorized':
        return 'secondary';
      case 'Failed':
      case 'Refunded':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Order Payment Console
          </h1>
          <p className="text-muted-foreground">
            Monitor, capture, and reconcile all payment transactions.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><Undo2 className="mr-2 h-4 w-4" /> Initiate Refund</Button>
            <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Capture Payment</Button>
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
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            A summary of the most recent payment transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>PSP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium font-mono">{payment.orderId}</TableCell>
                  <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: payment.currency }).format(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.method}</Badge>
                  </TableCell>
                  <TableCell>{payment.psp}</TableCell>
                   <TableCell>
                    <Badge variant={getStatusBadgeVariant(payment.status)}>
                      {payment.status}
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
                        <DropdownMenuItem>View Transaction</DropdownMenuItem>
                        <DropdownMenuItem>View Order</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Initiate Refund
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
      
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingPayment ? 'Edit Payment' : 'Manual Payment Capture'}</DialogTitle>
            <DialogDescription>
              {editingPayment ? `Editing payment ${editingPayment.id}`: 'Manually capture a payment for an Order.'}
            </DialogDescription>
          </DialogHeader>
          <PaymentForm
            payment={editingPayment}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>

    </div>
  );
}
