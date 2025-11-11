'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OrderDetailsView, type OrderDetails } from '@/components/orders/order-details-view';

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
        { id: 'FL-001', type: 'Flight', description: 'Business Class, JFK-LHR', status: 'Fulfilled' },
        { id: 'BG-001', type: 'Baggage', description: '2x Checked Bags (23kg)', status: 'Fulfilled' },
        { id: 'ST-001', type: 'Seat', description: 'Seat 1A (Window)', status: 'Fulfilled' },
        { id: 'ML-001', type: 'Meal', description: 'Vegetarian Special Meal', status: 'Fulfilled' },
    ],
    auditTrail: [
        { version: 1, actor: 'System (Offer Conversion)', event: 'Order Created', timestamp: '2024-07-15T10:30:00Z' },
        { version: 2, actor: 'OpsAgent01', event: 'Service Added: Baggage', timestamp: '2024-07-15T11:05:00Z' },
        { version: 3, actor: 'System (Payment Gateway)', event: 'Payment Confirmed', timestamp: '2024-07-15T11:06:15Z' },
        { version: 4, actor: 'OpsAgent01', event: 'Service Added: Meal', timestamp: '2024-07-15T14:20:00Z' },
        { version: 5, actor: 'System (Fulfilment)', event: 'All services fulfilled', timestamp: '2024-07-16T08:00:00Z' },
    ]
};

export default function OrderServicingPage() {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!identifier) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter an Order ID or Passenger Name.' });
      return;
    }
    setIsLoading(true);
    setOrderDetails(null);
    setTimeout(() => {
      // Mock search logic
      if (identifier.toUpperCase().includes('ORD-073') || identifier.toLowerCase().includes('voyage')) {
        setOrderDetails(mockOrder);
      } else {
        toast({ title: 'Not Found', description: `No order found for "${identifier}".`});
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Order Servicing Console
        </h1>
        <p className="text-muted-foreground">
          Modify, cancel, refund, revalidate, or reissue orders.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Retrieve Order</CardTitle>
          <CardDescription>
            Search for an order by its ID or passenger name to begin servicing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-md items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter Order ID or Passenger Name (e.g., ORD-073)"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button type="submit" onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Find Order
            </Button>
          </div>
        </CardContent>
      </Card>
      
       {isLoading && (
            <div className="mt-6 text-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p>Loading order details...</p>
            </div>
        )}

      {orderDetails && <OrderDetailsView order={orderDetails} />}
    </div>
  );
}
