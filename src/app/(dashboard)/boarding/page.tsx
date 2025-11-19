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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScanLine, UserPlus, FileText, CheckCircle, AlertTriangle, Clock, MoreHorizontal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const kpiData = [
  { title: 'Flights Boarding', value: '5' },
  { title: 'Total Pax Boarded', value: '875' },
  { title: 'Exceptions', value: '12' },
  { title: 'Avg. Boarding Time', value: '19 min' },
];

const boardingFlights = [
    { flightId: 'AI 101', destination: 'JFK', boarded: 142, total: 150, status: 'Boarding', currentGroup: 'C' },
    { flightId: 'EK 216', destination: 'DXB', boarded: 280, total: 320, status: 'Boarding', currentGroup: 'B' },
    { flightId: 'SQ 529', destination: 'SIN', boarded: 245, total: 250, status: 'Final Call', currentGroup: 'All' },
    { flightId: 'LH 990', destination: 'FRA', boarded: 188, total: 220, status: 'Boarding', currentGroup: 'A' },
    { flightId: 'QF 12', destination: 'SYD', boarded: 20, total: 350, status: 'Pre-Boarding', currentGroup: 'Families' },
];

const liveFeed = [
    { type: 'success', message: 'Passenger John Smith (ORD-60122) boarded.', time: '10s ago' },
    { type: 'success', message: 'Passenger Jane Doe (ORD-98321) boarded.', time: '25s ago' },
    { type: 'exception', message: 'Seat mismatch for passenger A. Williams (ORD-77431).', time: '45s ago' },
    { type: 'success', message: 'Passenger Mike Johnson (ORD-12543) boarded.', time: '1 min ago' },
    { type: 'info', message: 'Group C boarding now.', time: '2 mins ago' },
    { type: 'success', message: 'Passenger S. Chen (ORD-55412) boarded.', time: '2 mins ago' },
    { type: 'exception', message: 'Baggage mismatch for passenger F. Miller (ORD-88231).', time: '3 mins ago' },
    { type: 'success', message: 'Passenger P. Rodriguez (ORD-31221) boarded.', time: '4 mins ago' },
    { type: 'info', message: 'Final call for flight SQ 529 to Singapore.', time: '5 mins ago' },
    { type: 'success', message: 'Passenger L. Taylor (ORD-11298) boarded.', time: '5 mins ago' },
];

type Passenger = {
    pnr: string;
    name: string;
    seat: string;
    status: 'Boarded' | 'Checked-in' | 'No-show';
    ssr: string;
};

const mockManifest: Passenger[] = [
    { pnr: 'L8Y2N3', name: 'John Smith', seat: '12A', status: 'Boarded', ssr: 'VGML' },
    { pnr: 'P4X5T6', name: 'Jane Doe', seat: '12B', status: 'Boarded', ssr: '' },
    { pnr: 'K9Z1M2', name: 'Mike Johnson', seat: '14C', status: 'Boarded', ssr: 'WCHR' },
    { pnr: 'R7V8W9', name: 'Sarah Chen', seat: '15A', status: 'Checked-in', ssr: '' },
    { pnr: 'A3B4C5', name: 'Alex Williams', seat: '16F', status: 'No-show', ssr: '' },
];


const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Boarding': return 'default';
        case 'Final Call': return 'destructive';
        case 'Pre-Boarding': return 'secondary';
        default: return 'outline';
    }
}

const getPassengerStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Boarded': return 'default';
        case 'Checked-in': return 'secondary';
        case 'No-show': return 'destructive';
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
    const [isManifestOpen, setIsManifestOpen] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState<typeof boardingFlights[0] | null>(null);

    const handleViewManifest = (flight: typeof boardingFlights[0]) => {
        setSelectedFlight(flight);
        setIsManifestOpen(true);
    };

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
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
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
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Actions</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleViewManifest(flight)}>
                                                        <FileText className="mr-2 h-4 w-4"/>View Manifest
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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

            <Dialog open={isManifestOpen} onOpenChange={setIsManifestOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Flight Manifest for {selectedFlight?.flightId}</DialogTitle>
                        <DialogDescription>
                            List of all passengers for flight {selectedFlight?.flightId} to {selectedFlight?.destination}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>PNR</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Seat</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>SSR</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockManifest.map(pax => (
                                    <TableRow key={pax.pnr}>
                                        <TableCell className="font-mono">{pax.pnr}</TableCell>
                                        <TableCell>{pax.name}</TableCell>
                                        <TableCell>{pax.seat}</TableCell>
                                        <TableCell>
                                            <Badge variant={getPassengerStatusBadgeVariant(pax.status)}>{pax.status}</Badge>
                                        </TableCell>
                                        <TableCell>{pax.ssr || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
