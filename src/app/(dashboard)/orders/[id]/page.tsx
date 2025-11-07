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
  Hash,
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Status = 'Fulfilled' | 'Pending' | 'Canceled' | 'Partially Fulfilled';

const mockOrder = {
    id: 'ORD-073',
    customer: 'Voyage Travel Co.',
    email: 'contact@voyagetravel.com',
    status: 'Fulfilled' as Status,
    date: '2024-07-15',
    amount: 12500,
    currency: 'USD',
    payment: {
        method: 'Credit Card',
        last4: '4242',
        status: 'Paid'
    },
    services: [
        { id: 'FL-001', type: 'Flight', description: 'Business Class, JFK-LHR', status: 'Fulfilled' },
        { id: 'BG-001', type: 'Baggage', description: '2x Checked Bags (23kg)', status: 'Fulfilled' },
        { id: 'ST-001', type: 'Seat', description: 'Seat 1A (Window)', status: 'Fulfilled' },
        { id: 'ML-001', type: 'Meal', description: 'Vegetarian Special Meal', status: 'Fulfilled' },
    ],
    auditTrail: [
        { version: 1, actor: 'System (Offer Conversion)', event: 'Order Created', timestamp: '2024-07-15T10:30:00Z', icon: GitCommitHorizontal },
        { version: 2, actor: 'OpsAgent01', event: 'Service Added: Baggage', timestamp: '2024-07-15T11:05:00Z', icon: Plus },
        { version: 3, actor: 'System (Payment Gateway)', event: 'Payment Confirmed', timestamp: '2024-07-15T11:06:15Z', icon: CheckCircle },
        { version: 4, actor: 'OpsAgent01', event: 'Service Added: Meal', timestamp: '2024-07-15T14:20:00Z', icon: Plus },
        { version: 5, actor: 'System (Fulfilment)', event: 'All services fulfilled', timestamp: '2024-07-16T08:00:00Z', icon: Archive },
    ]
};

const getStatusBadgeVariant = (status: Status) => {
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
        case 'Seat': return <Utensils className="h-4 w-4 text-muted-foreground" />;
        case 'Meal': return <Utensils className="h-4 w-4 text-muted-foreground" />;
        default: return <Plus className="h-4 w-4 text-muted-foreground" />;
    }
}


export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const orderId = params.id;
  const order = mockOrder; // In a real app, you'd fetch this based on the ID

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/orders">
                <ArrowLeft />
                </Link>
            </Button>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
                <div className="flex items-center gap-2">
                    <p className="text-muted-foreground font-mono text-sm">{order.id}</p>
                    <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline"><FilePenLine className="mr-2 h-4 w-4"/> Modify Order</Button>
            <Button variant="destructive"><XCircle className="mr-2 h-4 w-4"/> Cancel Order</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Services ({order.services.length})</CardTitle>
                    <CardDescription>All services attached to this order.</CardDescription>
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
                                    <event.icon className="h-5 w-5 text-secondary-foreground" />
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
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
