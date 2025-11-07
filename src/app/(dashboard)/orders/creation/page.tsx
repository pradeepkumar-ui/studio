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
import { PlusCircle, RotateCcw, DownloadCloud, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { OrderBuilderForm, type ManualOrder } from '@/components/forms/order-builder-form';
import { useToast } from '@/hooks/use-toast';

const kpiData = [
  { title: 'Orders Today', value: '1,204' },
  { title: 'Failures', value: '5' },
  { title: 'Avg Creation Time', value: '1.3s' },
  { title: 'Pending Validations', value: '3' },
];

const recentFailures = [
  { orderId: 'N/A', offerId: 'OFF_9822', reason: 'Inventory unavailable', timestamp: '2 mins ago', status: 'Failed' },
  { orderId: 'N/A', offerId: 'OFF_9821', reason: 'Payment pre-auth failed', timestamp: '15 mins ago', status: 'Failed' },
  { orderId: 'ORD_72033', offerId: 'OFF_9820', reason: 'Order already exists (idempotency)', timestamp: '45 mins ago', status: 'Resolved' },
];

const getStatusBadgeVariant = (status: string) => {
  switch(status) {
    case 'Failed': return 'destructive';
    case 'Resolved': return 'secondary';
    default: return 'outline';
  }
}

export default function OrderCreationPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = (data: ManualOrder) => {
    console.log(data);
    toast({
      title: "Order Creation Initiated",
      description: `Manual creation process started for Offer ID: ${data.offerId}`,
    });
    setIsDialogOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Order Creation Console
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage the Offer-to-Order conversion process.
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline">
            <RotateCcw className="mr-2" />
            Retry Failed
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2" />
            Create Order
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
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Creation Failures & Alerts</CardTitle>
                <CardDescription>Log of recent Order creation failures and alerts.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
                <DownloadCloud className="mr-2 h-4 w-4" />
                Export Audit
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Offer ID</TableHead>
                        <TableHead>Reason for Failure</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentFailures.map(failure => (
                        <TableRow key={failure.offerId}>
                            <TableCell className="font-mono">{failure.offerId}</TableCell>
                            <TableCell>{failure.reason}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(failure.status)}>{failure.status}</Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    {failure.timestamp}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manual Order Builder</DialogTitle>
            <DialogDescription>
              Manually create an order from an Offer ID. Used for offline or exceptional cases.
            </DialogDescription>
          </DialogHeader>
          <OrderBuilderForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
