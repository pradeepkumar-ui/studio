'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GroupOrderDetailsView, type GroupOrderDetails } from '@/components/orders/group-order-details-view';
import { PassengerDetails } from '@/components/forms/passenger-details-form';

const CrisCarter: PassengerDetails = {
    id: `PAX-100`,
    name: `Cris Carter`,
    type: 'Adult',
    dob: '1965-11-25',
    gender: 'Male',
    nationality: 'USA',
};

const CeedeeLamb: PassengerDetails = {
    id: `PAX-100`,
    name: `Ceedee Lamb`,
    type: 'Adult',
    dob: '1999-04-08',
    gender: 'Male',
    nationality: 'USA',
};

const initialMockOrder: GroupOrderDetails = {
    id: 'GRP_92347',
    offerId: 'OFFER_GRP_123',
    groupName: 'Leisure Tour - Italy',
    totalPassengers: 20,
    status: 'Pending Approval',
    itinerary: {
        origin: 'JFK',
        destination: 'FCO',
        departureDate: '2025-06-10',
        returnDate: '2025-06-20',
        isInternational: true,
    },
    services: [
        { id: 'FL-GRP-01', type: 'Flight', description: 'Group Fare, JFK-FCO', status: 'Confirmed', price: 24000 },
        { id: 'BG-GRP-01', type: 'Baggage', description: '20x Checked Bags (23kg)', status: 'Pending', price: 1000 },
    ],
    deadlines: {
        depositDue: '2025-03-15',
        namesDue: '2025-04-30',
        finalPaymentDue: '2025-05-10',
    },
    payment: {
        totalAmount: 25000,
        currency: 'USD',
        depositAmount: 2500,
        depositStatus: 'Pending',
        finalPaymentStatus: 'Pending',
    },
    manifest: [CrisCarter],
    rosters: [
        { name: 'Varsity Soccer Team', passengers: 18 },
        { name: 'JV Soccer Team', passengers: 22 },
    ]
};

const mockRosterPassengers: PassengerDetails[] = Array.from({ length: 18 }, (_, i) => ({
    id: `PAX-${101 + i}`,
    name: `Player ${i + 1}`,
    type: 'Adult',
    dob: '2006-05-15',
    gender: 'Male',
    nationality: 'USA',
    passportNumber: `E${Math.floor(10000000 + Math.random() * 90000000)}`,
    passportExpiry: '2028-10-22',
    contactEmail: `player${i+1}@example.com`,
    contactPhone: '555-010' + (i+1),
    specialAssistance: '',
    baggage: { type: 'standard', weight: 23 },
}));


function GroupOrderDetailsPageContent() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;
    
    // In a real app, you'd fetch this based on the ID
    const [order, setOrder] = useState<GroupOrderDetails>(initialMockOrder);
    
    useEffect(() => {
        // If the manifest is empty, add Cris Carter
        if (order.manifest.length === 0) {
            setOrder(prev => ({...prev, manifest: [CrisCarter]}));
        }
    }, [order.manifest]);

    const handleRosterLoad = (rosterName: string) => {
        if (rosterName === 'Varsity Soccer Team') {
            setOrder(prev => ({ ...prev, manifest: mockRosterPassengers }));
        }
    }

    if (!orderId) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/orders/group-dashboard">
                        <ArrowLeft />
                        </Link>
                    </Button>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight">Group Booking Details</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-mono">Order ID: {orderId}</span>
                            <span className="font-mono">Offer ID: {order.offerId}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <GroupOrderDetailsView order={order} setOrder={setOrder} onRosterLoad={handleRosterLoad}/>
        </div>
    );
}

export default function GroupOrderDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GroupOrderDetailsPageContent />
        </Suspense>
    )
}
