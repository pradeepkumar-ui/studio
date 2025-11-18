'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, GitCommitHorizontal, CheckCircle, Store, ShoppingCart, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

type LineageEvent = {
  status: string;
  actor: string;
  timestamp: string;
  icon: React.ElementType;
  version: number;
};

const mockLineage: LineageEvent[] = [
  {
    status: 'Constructed',
    actor: 'Composer',
    timestamp: '2025-10-28T13:10:00Z',
    icon: GitCommitHorizontal,
    version: 1,
  },
  {
    status: 'Optimised',
    actor: 'Optimiser',
    timestamp: '2025-10-28T13:11:00Z',
    icon: CheckCircle,
    version: 2,
  },
  {
    status: 'Retailled',
    actor: 'Retailing',
    timestamp: '2025-10-28T13:11:30Z',
    icon: Store,
    version: 3,
  },
   {
    status: 'Retailled',
    actor: 'Composer',
    timestamp: '2025-10-28T13:12:00Z',
    icon: Store,
    version: 4,
  },
  {
    status: 'Converted',
    actor: 'Order Manager',
    timestamp: '2025-10-28T13:20:00Z',
    icon: ShoppingCart,
    version: 4,
  },
   {
    status: 'Archived',
    actor: 'System',
    timestamp: '2025-10-28T14:00:00Z',
    icon: Archive,
    version: 4,
  },
];


export default function OfferLineagePage() {
    const params = useParams();
    const offerId = params.id as string;
    
    if (!offerId) {
        return <div>Loading...</div>;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/offers">
                        <ArrowLeft />
                        </Link>
                    </Button>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Offer Lineage</h1>
                        <p className="text-muted-foreground">
                        Lifecycle history for Offer <span className="font-mono">{offerId}</span>
                        </p>
                    </div>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Lifecycle Timeline</CardTitle>
                        <CardDescription>This timeline shows every state change and version update for the offer.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative pl-6 space-y-10 border-l-2 border-border">
                            {mockLineage.map((event, index) => (
                                <div key={index} className="relative">
                                    <div className="absolute -left-[2.1rem] top-0 flex items-center justify-center w-16 h-16 bg-background rounded-full">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 bg-secondary">
                                        <event.icon className="h-6 w-6 text-secondary-foreground" />
                                        </div>
                                    </div>
                                    <div className="pl-8">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-lg">{event.status}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(event.timestamp).toUTCString()}</p>
                                        </div>
                                        <div className="mt-1 text-sm space-y-1">
                                            <p><span className="font-medium">Actor:</span> {event.actor}</p>
                                            <p><span className="font-medium">Version:</span> {event.version}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Suspense>
    )
}