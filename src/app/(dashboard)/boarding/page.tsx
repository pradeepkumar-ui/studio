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
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScanLine, UserPlus, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const kpiData = [
  { title: 'Flights Boarding', value: '3' },
  { title: 'Total Pax Boarded', value: '412' },
  { title: 'Exceptions', value: '5' },
  { title: 'Avg. Boarding Time', value: '18 min' },
];

const boardingFlights = [
    { flightId: 'AI 101', destination: 'JFK', boarded: 142, total: 150, status: 'Boarding', currentGroup: 'C' },
    { flightId: 'EK 216', destination: 'DXB', boarded: 280, total: 320, status: 'Boarding', currentGroup: 'B' },
    { flightId: 'SQ 529', destination: 'SIN', boarded: 88, total: 250, status: 'Final Call', currentGroup: 'All' },
];

const liveFeed = [
    { type: 'success', message: 'Passenger John Smith (ORD-60122) boarded.', time: '10s ago' },
    { type: 'success', message: 'Passenger Jane Doe (ORD-98321) boarded.', time: '25s ago' },
    { type: 'exception', message: 'Seat mismatch for passenger A. Williams (ORD-77431).', time: '45s ago' },
    { type: 'success', message: 'Passenger Mike Johnson (ORD-12543) boarded.', time: '1 min ago' },
];

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Boarding': return 'default';
        case 'Final Call': return 'destructive';
        default: return 'outline';
    }
}

const getFeedIcon = (type: string) => {
    switch (type) {
        case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'exception': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
}

export default function BoardingPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Gate Boarding Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Monitor and manage passenger boarding in real-time.
                </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><ScanLine className="mr-2 h-4 w-4" /> Scan Boarding Pass</Button>
                    <Button variant="secondary"><UserPlus className="mr-2 h-4 w-4" /> Manual Boarding</Button>
                    <Button><FileText className="mr-2 h-4 w-4" /> View Flight Manifest</Button>
                </div>
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Boarding Progress</CardTitle>
                        <CardDescription>
                            Live status of flights currently boarding.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Flight</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Current Group</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {boardingFlights.map((flight) => (
                                    <TableRow key={flight.flightId}>
                                        <TableCell>
                                            <div className="font-medium">{flight.flightId}</div>
                                            <div className="text-sm text-muted-foreground">{flight.destination}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={(flight.boarded/flight.total) * 100} className="h-2"/>
                                                <span className="text-xs text-muted-foreground">{flight.boarded}/{flight.total}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(flight.status)}>{flight.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{flight.currentGroup}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Live Feed</CardTitle>
                        <CardDescription>Recent boarding events and alerts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                        {liveFeed.map((event, index) => (
                            <div key={index}>
                                <div className="flex items-start gap-3">
                                    <div>{getFeedIcon(event.type)}</div>
                                    <div className="flex-1">
                                    <p className="text-sm">{event.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{event.time}</p>
                                    </div>
                                </div>
                                {index < liveFeed.length - 1 && <Separator className="my-4" />}
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
