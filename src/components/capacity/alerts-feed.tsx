
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { Separator } from '../ui/separator';

const alerts = [
  { type: 'Stop-Sell', message: 'LHR-JFK / Business cap reached 95%', time: '1 min ago', severity: 'high' },
  { type: 'Soft-Stop', message: 'MAA-DXB / Flex nearing cap (90%)', time: '5 mins ago', severity: 'medium' },
  { type: 'Pacing', message: 'SIN-HKG / Mobile pacing active (surge)', time: '12 mins ago', severity: 'low' },
  { type: 'Re-balance', message: 'Quota re-balanced OTA -> Direct for IN market', time: '28 mins ago', severity: 'low' },
  { type: 'Guardrail', message: 'Override for VIP movement on LHR-JFK', time: '45 mins ago', severity: 'medium' },
];

const getIcon = (severity: string) => {
    switch (severity) {
        case 'high': return <ShieldAlert className="h-4 w-4 text-destructive" />;
        case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        case 'low': return <Info className="h-4 w-4 text-blue-500" />;
        default: return null;
    }
}

export function AlertsFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts & Incidents</CardTitle>
        <CardDescription>Live feed of capacity-related events.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index}>
              <div className="flex items-start gap-3">
                <div>{getIcon(alert.severity)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>{alert.type}</Badge>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                  <p className="text-sm mt-1">{alert.message}</p>
                </div>
              </div>
              {index < alerts.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
