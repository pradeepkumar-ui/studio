'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, Plane, Clock } from 'lucide-react';

const activeWaivers = [
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


const getStatusBadgeVariant = (status: string) => {
    switch(status) {
        case 'Active': return 'default';
        case 'Monitoring': return 'secondary';
        default: return 'outline';
    }
}

export function ActiveWaiversDashboard() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Active Disruption Waivers</CardTitle>
            <CardDescription>
                Live summary of all currently triggered waivers and their impact.
            </CardDescription>
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
  );
}
