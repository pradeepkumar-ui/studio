'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  FilePenLine,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { OrderDetailsView, type OrderDetails } from '@/components/orders/order-details-view';
import { Suspense } from 'react';

const mockOrder: OrderDetails = {
    id: 'ORD-073',
    customer: 'Voyage Travel Co.',
    email: 'contact@voyagetravel.com',
    status: 'Fulfilled',
    date: '2024-07-15',
    amount: 12500,
    currency: 'USD',
    payment: {
        method: 'Credit Card',
        last4: '4242',
        status: 'Paid'
    },
    services: [
        { id: 'FL-001', type: 'Flight', description: 'Business Class, JFK-LHR', status: 'Fulfilled', price: 11800 },
        { id: 'BG-001', type: 'Baggage', description: '2x Checked Bags (23kg)', status: 'Fulfilled', price: 150 },
        { id: 'ST-001', type: 'Seat', description: 'Seat 1A (Window)', status: 'Fulfilled', price: 75 },
        { id: 'ML-001', type: 'Meal', description: 'Vegetarian Special Meal', status: 'Fulfilled', price: 25 },
        { id: 'SUPP-001', type: 'Supplier Service', description: 'Chauffeur Service (LHR)', status: 'Confirmed', price: 450 }
    ],
    auditTrail: [
        { version: 1, actor: 'System (Offer Conversion)', event: 'Order Created', timestamp: '2024-07-15T10:30:00Z' },
        { version: 2, actor: 'Agent01 (Servicing)', event: 'Service Added: Chauffeur', timestamp: '2024-07-15T11:05:00Z' },
        { version: 3, actor: 'System (Payment Gateway)', event: 'Payment Confirmed', timestamp: '2024-07-15T11:06:15Z' },
        { version: 4, actor: 'Agent01 (Servicing)', event: 'Seat Upgraded to 1A (Loyalty)', timestamp: '2024-07-15T14:20:00Z' },
        { version: 5, actor: 'System (Fulfilment)', event: 'All services fulfilled', timestamp: '2024-07-16T08:00:00Z' },
    ]
};


export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const orderId = params.id as string;
    const order = mockOrder; // In a real app, you'd fetch this based on the ID

    const handleReshop = () => {
        sessionStorage.setItem('reshop_order_context', JSON.stringify(order));
        router.push('/offer-composer');
    }

    const handleCancel = () => {
        toast({
        title: 'Order Cancellation Initiated',
        description: `Cancellation process started for order ${order.id}.`,
        variant: 'destructive'
        });
    }

    if (!orderId) {
        return <div>Loading...</div>;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
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
                            <p className="text-muted-foreground font-mono text-sm">{orderId}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleReshop}>
                            <FilePenLine className="mr-2 h-4 w-4"/> Reshop / Modify
                        </Button>
                        <Button variant="destructive" onClick={handleCancel}><XCircle className="mr-2 h-4 w-4"/> Cancel Order</Button>
                    </div>
                </div>
                
                <OrderDetailsView order={{...order, id: orderId}} />
            </div>
        </Suspense>
    );
}
