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
  FileEdit,
  Trash2,
  Ticket,
  Building,
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
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

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
        price: number;
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
        case 'Supplier Service': return <Building className="h-4 w-4 text-muted-foreground" />;
        default: return <Plus className="h-4 w-4 text-muted-foreground" />;
    }
}

const getAuditIcon = (event: string) => {
    if (event.includes('Created')) return <GitCommitHorizontal className="h-5 w-5 text-secondary-foreground" />;
    if (event.includes('Added')) return <Plus className="h-5 w-5 text-secondary-foreground" />;
    if (event.includes('Confirmed')) return <CheckCircle className="h-5 w-5 text-secondary-foreground" />;
    if (event.includes('fulfilled')) return <Archive className="h-5 w-5 text-secondary-foreground" />;
    if (event.includes('Upgraded')) return <CheckCircle className="h-5 w-5 text-secondary-foreground" />;
    return <History className="h-5 w-5 text-secondary-foreground" />;
}

export function OrderDetailsView({ order }: { order: OrderDetails }) {
    const { toast } = useToast();

    const handleAction = (action: string, serviceId?: string) => {
        toast({
            title: 'Action Triggered',
            description: `${action} on service ${serviceId} is not yet implemented.`,
        });
    };
    
    const handleAddService = () => {
         toast({
            title: 'Navigating to Offer Composer',
            description: `A real implementation would link to the Offer Composer to add new services to order ${order.id}.`,
        });
    }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Services ({order.services.length})</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleAddService}><Plus className="mr-2 h-4 w-4"/>Add Service</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
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
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAction('Edit', service.id)}>
                                            <FileEdit className="h-4 w-4"/>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently remove the service
                                                    from the order and may require a refund.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleAction('Delete', service.id)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
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
                         <Button variant="outline" size="sm" className="w-full" onClick={() => handleAction('Manage Payment')}>Manage Payment / Refund</Button>
                      </div>
                </CardContent>
            </Card>
        </div>
      </div>
  )
}
