'use client';

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
import { CheckCircle, AlertTriangle, XCircle, ShieldCheck, Gauge, TrendingUp, AlertCircle } from 'lucide-react';

const kpiData = [
  { title: 'p95 Latency', value: '240ms', target: '< 300ms', icon: Gauge, status: 'ok' },
  { title: 'Availability', value: '99.97%', target: '> 99.95%', icon: TrendingUp, status: 'ok' },
  { title: 'Security', value: 'Compliant', target: 'AES-256', icon: ShieldCheck, status: 'ok' },
  { title: 'Alerts', value: '1 Active', target: '0', icon: AlertCircle, status: 'warn' },
];

const apiStatus = [
    { api: 'OfferSearch', p95: '280ms', availability: '99.98%', status: 'Operational' },
    { api: 'OfferPrice', p95: '350ms', availability: '99.99%', status: 'Degraded' },
    { api: 'OfferCreate', p95: '210ms', availability: '100%', status: 'Operational' },
    { api: 'OrderCreate', p95: '450ms', availability: '99.85%', status: 'Major Outage' },
];

const recentAlerts = [
    { metric: 'OfferPrice Latency', value: '350ms', threshold: '300ms', severity: 'High' },
    { metric: 'OrderCreate Availability', value: '99.85%', threshold: '99.95%', severity: 'Critical' },
];

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Operational': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'Degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        case 'Major Outage': return <XCircle className="h-4 w-4 text-red-500" />;
        default: return null;
    }
};

const getKpiStatusColor = (status: string) => {
    switch(status) {
        case 'ok': return 'text-green-500';
        case 'warn': return 'text-yellow-500';
        case 'critical': return 'text-red-500';
        default: return 'text-muted-foreground';
    }
}


export function NfrMonitor() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiData.map((kpi) => (
                <Card key={kpi.title}>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className={`h-4 w-4 ${getKpiStatusColor(kpi.status)}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-xs text-muted-foreground">Target: {kpi.target}</p>
                    </CardContent>
                </Card>
                ))}
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>API Performance Monitor</CardTitle>
                    <CardDescription>Live non-functional metrics for core Offer APIs.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>API Endpoint</TableHead>
                            <TableHead>p95 Latency</TableHead>
                            <TableHead>Availability</TableHead>
                            <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {apiStatus.map((api) => (
                            <TableRow key={api.api}>
                                <TableCell className="font-medium font-mono">{api.api}</TableCell>
                                <TableCell>{api.p95}</TableCell>
                                <TableCell>{api.availability}</TableCell>
                                <TableCell>
                                    <Badge variant={api.status === 'Operational' ? 'default' : 'destructive'} className="gap-1 pl-1.5">
                                        {getStatusIcon(api.status)}
                                        {api.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>Live alerts for NFR breaches.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.length > 0 ? recentAlerts.map((alert, index) => (
                <div key={index}>
                    <div className="font-semibold">{alert.metric}</div>
                    <div className="text-sm text-muted-foreground">
                        Value: <span className="font-mono text-destructive">{alert.value}</span> | Threshold: <span className="font-mono">{alert.threshold}</span>
                    </div>
                    <Badge variant="destructive" className="mt-1">{alert.severity}</Badge>
                </div>
            )) : <p className="text-sm text-muted-foreground text-center py-8">No active alerts.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
