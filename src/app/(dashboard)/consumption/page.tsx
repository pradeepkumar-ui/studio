
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

const kpiData = [
  { title: 'Total Services Sold', value: '12,540' },
  { title: 'Consumed', value: '10,212' },
  { title: 'Pending', value: '1,873' },
  { title: 'Expired', value: '455' },
];

const consumptionEvents = [
    { id: 'EVT-001', service: 'Lounge Access (LHR)', passenger: 'J. Smith', orderId: 'ORD-A2B3', status: 'Consumed', timestamp: '2025-10-29 10:05:12' },
    { id: 'EVT-002', service: 'In-flight Wi-Fi', passenger: 'A. Patel', orderId: 'ORD-C4D5', status: 'Consumed', timestamp: '2025-10-29 09:45:33' },
    { id: 'EVT-003', service: 'Pre-paid Meal', passenger: 'S. Lee', orderId: 'ORD-E6F7', status: 'Pending', timestamp: 'N/A' },
    { id: 'EVT-004', service: 'Fast-Track Security', passenger: 'M. Williams', orderId: 'ORD-G8H9', status: 'Expired', timestamp: 'N/A' },
    { id: 'EVT-005', service: 'Hotel Voucher', passenger: 'T. Johnson', orderId: 'ORD-I1J2', status: 'Consumed', timestamp: '2025-10-28 14:22:01' },
];

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Consumed': return 'default';
        case 'Pending': return 'secondary';
        case 'Expired': return 'outline';
        default: return 'outline';
    }
}

export default function ConsumptionPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Service Consumption
        </h1>
        <p className="text-muted-foreground">
          Track and reconcile the fulfilment of ancillary services.
        </p>
      </div>
      
       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consumption Event Log</CardTitle>
          <CardDescription>
            Live stream of service usage events from all channels.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Passenger</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Consumption Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {consumptionEvents.map(event => (
                        <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.service}</TableCell>
                            <TableCell>{event.passenger}</TableCell>
                            <TableCell className="font-mono">{event.orderId}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(event.status)}>
                                    {event.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{event.timestamp}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

