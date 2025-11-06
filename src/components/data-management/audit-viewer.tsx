
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

type AuditEvent = {
  event: string;
  version: number;
  snapshot_hash: string;
  actor: string;
  ts: string;
};

const mockAuditTrail: AuditEvent[] = [
  {
    event: 'offer.snapshot_created',
    version: 1,
    snapshot_hash: 'a1b2c...',
    actor: 'composer',
    ts: '2025-10-28T13:10:00Z',
  },
  {
    event: 'offer.snapshot_created',
    version: 2,
    snapshot_hash: 'd3e4f...',
    actor: 'optimiser',
    ts: '2025-10-28T13:11:00Z',
  },
  {
    event: 'offer.snapshot_created',
    version: 3,
    snapshot_hash: 'g5h6i...',
    actor: 'retailing',
    ts: '2025-10-28T13:11:30Z',
  },
  {
    event: 'offer.snapshot_created',
    version: 4,
    snapshot_hash: 'j7k8l...',
    actor: 'composer',
    ts: '2025-10-28T13:12:00Z',
  },
  {
    event: 'offer.converted',
    version: 4,
    snapshot_hash: 'j7k8l...',
    actor: 'order_manager',
    ts: '2025-10-28T13:20:00Z',
  },
];


export function AuditViewer() {
  const [offerId, setOfferId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[] | null>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!offerId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter an Offer ID.' });
      return;
    }
    setIsLoading(true);
    setAuditTrail(null);
    setTimeout(() => {
      if (offerId.toUpperCase() === 'OFF_7D91A') {
        setAuditTrail(mockAuditTrail);
      } else {
        toast({ title: 'Not Found', description: `No audit trail found for Offer ID ${offerId}`});
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Viewer</CardTitle>
        <CardDescription>
          View event logs and trace the lifecycle of a specific Offer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full max-w-md items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter Offer ID (e.g., OFF_7D91A)"
            value={offerId}
            onChange={(e) => setOfferId(e.target.value)}
          />
          <Button type="submit" onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Trace
          </Button>
        </div>

        {auditTrail && (
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Audit Trail for {offerId.toUpperCase()}</h3>
                <div className="relative pl-6 space-y-8 border-l-2">
                    {auditTrail.map((event, index) => (
                        <div key={index} className="relative">
                            <div className="absolute -left-[1.3rem] top-1 flex items-center justify-center w-10 h-10 bg-background rounded-full border-2">
                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                            </div>
                            <div className="pl-4">
                               <div className="flex items-center justify-between">
                                    <p className="font-semibold font-mono text-sm">{event.event}</p>
                                    <p className="text-sm text-muted-foreground">{new Date(event.ts).toUTCString()}</p>
                               </div>
                                <div className="mt-2 text-sm space-y-1">
                                    <p><span className="font-medium">Version:</span> {event.version}</p>
                                    <p><span className="font-medium">Actor:</span> {event.actor}</p>
                                    <p><span className="font-medium">Snapshot Hash:</span> <span className="font-mono text-xs">{event.snapshot_hash}</span></p>
                                </div>
                            </div>
                            {index < auditTrail.length - 1 && <Separator className="mt-6"/>}
                        </div>
                    ))}
                </div>
            </div>
        )}
         {isLoading && (
            <div className="mt-6 text-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p>Loading audit trail...</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
