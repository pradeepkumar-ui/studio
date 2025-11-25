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
import { Input } from '@/components/ui/input';
import { Search, Loader2, Luggage, Plane, Milestone, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type BagStatus = 'Checked-in' | 'Loaded' | 'In-transit' | 'At-destination' | 'On-carousel' | 'Mismatch' | 'Lost';

type BagEvent = {
  location: string;
  status: BagStatus;
  timestamp: string;
  icon: React.ElementType;
};

type BagDetails = {
  bagTagId: string;
  pnr: string;
  passenger: string;
  route: string;
  status: BagStatus;
  history: BagEvent[];
};

const mockBag: BagDetails = {
  bagTagId: 'LH1234567890',
  pnr: 'L8Y2N3',
  passenger: 'John Smith',
  route: 'LHR-JFK',
  status: 'Loaded',
  history: [
    { location: 'LHR T2 Check-in', status: 'Checked-in', timestamp: '2h ago', icon: Luggage },
    { location: 'LHR T2 Sorting', status: 'In-transit', timestamp: '1h 45m ago', icon: Milestone },
    { location: 'LHR T2 Gate B45', status: 'Loaded', timestamp: '30m ago', icon: Plane },
  ],
};

const getStatusBadgeVariant = (status: BagStatus) => {
  switch (status) {
    case 'Checked-in':
    case 'In-transit':
      return 'secondary';
    case 'Loaded':
    case 'At-destination':
    case 'On-carousel':
      return 'default';
    case 'Mismatch':
    case 'Lost':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function BaggageReconciliationPage() {
  const [bagTagId, setBagTagId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bagDetails, setBagDetails] = useState<BagDetails | null>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!bagTagId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a Bag Tag ID.' });
      return;
    }
    setIsLoading(true);
    setBagDetails(null);
    setTimeout(() => {
      if (bagTagId.toUpperCase() === 'LH1234567890') {
        setBagDetails(mockBag);
      } else {
        toast({ title: 'Not Found', description: `No baggage found for tag "${bagTagId}".` });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Baggage Reconciliation & Tracking
        </h1>
        <p className="text-muted-foreground">
          Monitor real-time baggage status from check-in to arrival.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Track a Bag</CardTitle>
          <CardDescription>
            Enter a bag tag ID to view its complete journey and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-md items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter Bag Tag ID (e.g., LH1234567890)"
              value={bagTagId}
              onChange={(e) => setBagTagId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button type="submit" onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Track
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="mt-6 text-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p>Loading baggage details...</p>
        </div>
      )}

      {bagDetails && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Baggage Details</CardTitle>
                <CardDescription className="font-mono">{bagDetails.bagTagId}</CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(bagDetails.status)} className="text-base">
                {bagDetails.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
              <div><span className="font-medium">Passenger:</span> {bagDetails.passenger}</div>
              <div><span className="font-medium">PNR:</span> <span className="font-mono">{bagDetails.pnr}</span></div>
              <div><span className="font-medium">Route:</span> {bagDetails.route}</div>
            </div>
            
            <h4 className="font-semibold mb-4">Journey History</h4>
            <div className="relative pl-6 space-y-8 border-l-2 border-border">
              {bagDetails.history.map((event, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[2.0rem] top-0 flex items-center justify-center w-14 h-14 bg-background rounded-full">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-secondary">
                      <event.icon className="h-5 w-5 text-secondary-foreground" />
                    </div>
                  </div>
                  <div className="pl-6">
                    <p className="font-semibold text-md">{event.status}</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
