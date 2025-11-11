'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, Plane, Clock, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { TriggerWaiverForm, type ActiveWaiver } from '../forms/trigger-waiver-form';
import { useToast } from '@/hooks/use-toast';
import { type WaiverPolicy } from '../forms/waiver-policy-form';

const initialWaivers: ActiveWaiver[] = [
    {
        id: 'WX-2025-DEL',
        name: 'Storm DEL',
        status: 'Active',
        validity: '27-Oct-2025 to 31-Oct-2025',
        affectedFlights: 12,
        eligiblePax: 248,
        repriced: 236,
        rules: 'Change fee waived, Fare difference capped ±INR1000'
    },
    {
        id: 'SC-2025-Q4-US',
        name: 'Q4 US Schedule Change',
        status: 'Active',
        validity: '01-Oct-2025 to 31-Dec-2025',
        affectedFlights: 88,
        eligiblePax: 1204,
        repriced: 891,
        rules: 'Change fee waived, free reroute on +/- 1 day'
    },
     {
        id: 'CA-2025-LHR-JFK',
        name: 'LHR-JFK Crew Shortage',
        status: 'Monitoring',
        validity: '15-Nov-2025 to 16-Nov-2025',
        affectedFlights: 4,
        eligiblePax: 620,
        repriced: 0,
        rules: 'Change fee waived'
    },
];

const mockPolicies: WaiverPolicy[] = [
    { id: 'WXP-GEN-WEATHER', name: 'General Weather Waiver', eventType: 'Weather', rulesWaived: 'change_fee, no_show_penalty', fareDifferencePolicy: 'Match or Lower', status: 'Published', routes: 'All' },
    { id: 'WXP-SC-MAJOR', name: 'Major Schedule Change (>4h)', eventType: 'Schedule Change', rulesWaived: 'change_fee, refund_penalty', fareDifferencePolicy: 'None', status: 'Published', routes: 'All' },
    { id: 'WXP-CX-DOM', name: 'Domestic Cancellation', eventType: 'Cancellation', rulesWaived: 'change_fee', fareDifferencePolicy: 'Cap at 100 USD', status: 'Published', routes: 'Domestic' },
];


const getStatusBadgeVariant = (status: string) => {
    switch(status) {
        case 'Active': return 'default';
        case 'Monitoring': return 'secondary';
        default: return 'outline';
    }
}

export function ActiveWaiversDashboard() {
  const [activeWaivers, setActiveWaivers] = useState<ActiveWaiver[]>(initialWaivers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = (data: Omit<ActiveWaiver, 'id' | 'repriced' | 'eligiblePax'>) => {
    const newWaiver: ActiveWaiver = {
        ...data,
        id: `EVT-${Math.floor(Math.random() * 1000)}`,
        eligiblePax: 0,
        repriced: 0,
    };
    setActiveWaivers([newWaiver, ...activeWaivers]);
    toast({
        title: 'Waiver Activated',
        description: `The waiver "${data.name}" is now active.`
    });
    setIsDialogOpen(false);
  }

  return (
    <>
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Active Disruption Waivers</CardTitle>
                <CardDescription>
                    Live summary of all currently triggered waivers and their impact.
                </CardDescription>
            </div>
             <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Trigger Waiver
            </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeWaivers.map((waiver) => (
                <Card key={waiver.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg">{waiver.name}</CardTitle>
                                <CardDescription>{waiver.id}</CardDescription>
                            </div>
                            <Badge variant={getStatusBadgeVariant(waiver.status)}>{waiver.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{waiver.validity}</span>
                        </div>
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Plane className="h-4 w-4" />
                            <span>{waiver.affectedFlights} flights affected</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{waiver.eligiblePax} eligible passengers</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                             <span>{waiver.repriced} offers repriced</span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-foreground mb-1">Waived Rules:</p>
                            <p className="text-xs text-muted-foreground">{waiver.rules}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </CardContent>
    </Card>

     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trigger New Disruption Waiver</DialogTitle>
            <DialogDescription>
                Activate a waiver policy for a new disruption event.
            </DialogDescription>
          </DialogHeader>
          <TriggerWaiverForm
            policies={mockPolicies}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
