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

type TimelineEvent = {
  gate: string;
  decision: 'allow' | 'block' | 'warn';
  explain: string[];
  policy_pack: string;
  ts: string;
};

const mockTimeline: TimelineEvent[] = [
  {
    gate: 'pre_construction',
    decision: 'allow',
    explain: ['MARKET_OK', 'CHANNEL_ELIGIBLE'],
    policy_pack: 'v17',
    ts: '2025-10-28T15:11:58Z',
  },
  {
    gate: 'pre_expose',
    decision: 'warn',
    explain: ['PARITY_OK', 'DISCLOSURE_OK', 'ANC_FILTERED:INSURANCE_MIN_AGE'],
    policy_pack: 'v18',
    ts: '2025-10-28T15:12:11Z',
  },
  {
    gate: 'pre_convert',
    decision: 'block',
    explain: ['SANCTION_SCREEN_FAIL'],
    policy_pack: 'v18',
    ts: '2025-10-28T15:14:22Z',
  },
];

const getDecisionBadgeVariant = (decision: TimelineEvent['decision']) => {
  switch (decision) {
    case 'allow': return 'default';
    case 'warn': return 'secondary';
    case 'block': return 'destructive';
  }
};

export function DecisionInspector() {
  const [offerId, setOfferId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeline, setTimeline] = useState<TimelineEvent[] | null>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!offerId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter an Offer ID.' });
      return;
    }
    setIsLoading(true);
    setTimeline(null);
    setTimeout(() => {
      if (offerId.toUpperCase() === 'OFF_7D91A') {
        setTimeline(mockTimeline);
      } else {
        toast({ title: 'Not Found', description: `No compliance data found for Offer ID ${offerId}`});
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decision Inspector</CardTitle>
        <CardDescription>
          Inspect the full compliance timeline for a specific Offer or Order.
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
            Inspect
          </Button>
        </div>

        {timeline && (
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Compliance Timeline for {offerId.toUpperCase()}</h3>
                <div className="relative pl-6 space-y-8 border-l-2">
                    {timeline.map((event, index) => (
                        <div key={index} className="relative">
                            <div className="absolute -left-[1.3rem] top-1 flex items-center justify-center w-10 h-10 bg-background rounded-full border-2">
                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                            </div>
                            <div className="pl-4">
                               <div className="flex items-center justify-between">
                                    <p className="font-semibold">{event.gate}</p>
                                    <Badge variant={getDecisionBadgeVariant(event.decision)}>{event.decision.toUpperCase()}</Badge>
                               </div>
                                <p className="text-sm text-muted-foreground">{new Date(event.ts).toUTCString()}</p>
                                <div className="mt-2 text-sm">
                                    <p className="font-medium">Explain Codes:</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                    {event.explain.map(code => (
                                        <Badge key={code} variant="outline" className="font-mono text-xs">{code}</Badge>
                                    ))}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Policy Pack: {event.policy_pack}</p>
                            </div>
                            {index < timeline.length - 1 && <Separator className="mt-6"/>}
                        </div>
                    ))}
                </div>
            </div>
        )}
         {isLoading && (
            <div className="mt-6 text-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p>Loading compliance timeline...</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
