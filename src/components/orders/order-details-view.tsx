'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  User,
  CreditCard,
  Plane,
  Plus,
  Luggage,
  Utensils,
  GitCommitHorizontal,
  CheckCircle,
  Archive,
  History,
  FilePenLine,
  XCircle,
  Ticket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type OrderDetails = {
    id: string;
    customer: string;
    email: string;
    status: 'Fulfilled' | 'Pending' | 'Canceled' | 'Partially Fulfilled';
    date: string;
    amount: number;
    currency: string;
    payment: {
        method: string;
        last4: string;
        status: string;
    };
    services: Array<{
        id: string;
        type: string;
        description: string;
        status: string;
    }>;
    auditTrail: Array<{
        version: number;
        actor: string;
        event: string;
        timestamp: string;
    }>;
};

const getStatusBadgeVariant = (status: OrderDetails['status']) => {
  switch (status) {
    case 'Fulfilled': return 'default';
    case 'Pending': return 'secondary';
    case 'Canceled': return 'destructive';
    case 'Partially Fulfilled': return 'outline';
    default: return 'outline';
  }
};

const getServiceIcon = (type: string) => {
    switch (type) {
        case 'Flight': return <Plane className="h-4 w-4 text-muted-foreground" />;
        case 'Baggage': return <Luggage className="h-4 w-4 text-muted-foreground" />;
        case 'Seat': return <Ticket className="h-4 w-4 text-muted-foreground" />;
        case 'Meal': return <Utensils className="h-4 w-4 text-muted-foreground" />;
        default: return <Plus className="h-4 w-4 text-muted-foreground" />;
    }
}

const getAuditIcon = (event: string) => {
    if (event.includes('Created')) return <GitCommitHorizontal className="h-5 w-5 text-secondary-foreground" />;
    if (event.includes('Added')) return <Plus className="h-5 w-5 text-secondary-foreground" />;
    if (event.includes('Confirmed')) return <CheckCircle className="h-5 w-5 text-secondary-foreground" />;
    if (event.includes('fulfilled')) return <Archive className="h-5 w-5 text-secondary-foreground" />;
    return <History className="h-5 w-5 text-secondary-foreground" />;
}

export function OrderDetailsView({ order }: { order: OrderDetails }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Services ({order.services.length})</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Add Service</Button>
                        <Button variant="outline" size="sm">Modify Service</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.services.map(service => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        {getServiceIcon(service.type)}
                                        {service.type}
                                    </TableCell>
                                    <TableCell>{service.description}</TableCell>
                                    <TableCell><Badge variant="secondary">{service.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        <CardTitle>Audit Timeline</CardTitle>
                    </div>
                    <CardDescription>Chronological history of all actions and events for this order.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-6 space-y-6 border-l-2 border-border">
                        {order.auditTrail.map((event, index) => (
                            <div key={index} className="relative">
                                <div className="absolute -left-[2.0rem] top-0 flex items-center justify-center w-14 h-14 bg-background rounded-full">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-secondary">
                                    {getAuditIcon(event.event)}
                                    </div>
                                </div>
                                <div className="pl-6">
                                    <p className="font-semibold text-md">{event.event}</p>
                                    <p className="text-sm text-muted-foreground">by {event.actor} (v{event.version})</p>
                                    <p className="text-xs text-muted-foreground mt-1">{new Date(event.timestamp).toUTCString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <CardTitle>Customer</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    <p className="font-semibold">{order.customer}</p>
                    <p className="text-muted-foreground">{order.email}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        <CardTitle>Payment</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Amount</span>
                        <span className="font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency }).format(order.amount)}</span>
                     </div>
                     <Separator />
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Method</span>
                        <span className="font-medium">{order.payment.method} ending in {order.payment.last4}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={order.payment.status === 'Paid' ? 'default' : 'secondary'}>{order.payment.status}</Badge>
                     </div>
                      <div className="pt-2">
                         <Button variant="outline" size="sm" className="w-full">Manage Payment / Refund</Button>
                      </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Order Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button variant="outline"><FilePenLine className="mr-2 h-4 w-4"/> Full Order Modification</Button>
                    <Button variant="destructive"><XCircle className="mr-2 h-4 w-4"/> Cancel Full Order</Button>
                </CardContent>
            </Card>
        </div>
      </div>
  )
}
