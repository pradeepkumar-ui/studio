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
import { MoreHorizontal, BellRing, Plane } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const kpiData = [
  { title: 'Flights in Progress', value: '5' },
  { title: 'Completed Today', value: '48' },
  { title: 'Delayed', value: '1' },
  { title: 'Avg. SLA', value: '97.4%' },
];

type ServiceStatus = 'Pending' | 'In-Progress' | 'Completed' | 'Delayed';

type FlightTask = {
    flightId: string;
    partner: string;
    turnaroundProgress: number;
    boarding: ServiceStatus;
    baggage: ServiceStatus;
    catering: ServiceStatus;
    cleaning: ServiceStatus;
    refueling: ServiceStatus;
}

const mockTasks: FlightTask[] = [
    { flightId: 'UA 812', partner: 'Lufthansa', turnaroundProgress: 90, boarding: 'Completed', baggage: 'Completed', catering: 'Completed', cleaning: 'Completed', refueling: 'In-Progress' },
    { flightId: 'LH 498', partner: 'United', turnaroundProgress: 75, boarding: 'In-Progress', baggage: 'Completed', catering: 'Completed', cleaning: 'In-Progress', refueling: 'Pending' },
    { flightId: 'EK 202', partner: 'Emirates', turnaroundProgress: 40, boarding: 'Pending', baggage: 'In-Progress', catering: 'Delayed', cleaning: 'Pending', refueling: 'Pending' },
    { flightId: 'BA 287', partner: 'British Airways', turnaroundProgress: 100, boarding: 'Completed', baggage: 'Completed', catering: 'Completed', cleaning: 'Completed', refueling: 'Completed' },
    { flightId: 'SQ 317', partner: 'Singapore Airlines', turnaroundProgress: 20, boarding: 'Pending', baggage: 'In-Progress', catering: 'Pending', cleaning: 'Pending', refueling: 'Pending' },
];


const getStatusBadgeVariant = (status: ServiceStatus) => {
  switch (status) {
    case 'Completed': return 'default';
    case 'In-Progress': return 'secondary';
    case 'Pending': return 'outline';
    case 'Delayed': return 'destructive';
    default: return 'outline';
  }
};


export default function GroundHandlingPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Ground Handling – Other Airlines
                </h1>
                <p className="text-muted-foreground">
                    Coordinate and monitor ground services performed by third-party partners.
                </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><BellRing className="mr-2 h-4 w-4" /> Notify Partner</Button>
                    <Button><Plane className="mr-2 h-4 w-4" /> View All Flights</Button>
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

            <Card>
                <CardHeader>
                    <CardTitle>Task Tracker</CardTitle>
                    <CardDescription>
                        Live status of ground handling tasks for partner-managed flights.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Flight</TableHead>
                                <TableHead>Partner</TableHead>
                                <TableHead>Turnaround</TableHead>
                                <TableHead>Boarding</TableHead>
                                <TableHead>Baggage</TableHead>
                                <TableHead>Catering</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockTasks.map((task) => (
                                <TableRow key={task.flightId}>
                                    <TableCell className="font-medium">{task.flightId}</TableCell>
                                    <TableCell>{task.partner}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={task.turnaroundProgress} className="h-2 w-32"/>
                                            <span className="text-xs text-muted-foreground">{task.turnaroundProgress}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(task.boarding)}>{task.boarding}</Badge>
                                    </TableCell>
                                     <TableCell>
                                        <Badge variant={getStatusBadgeVariant(task.baggage)}>{task.baggage}</Badge>
                                    </TableCell>
                                     <TableCell>
                                        <Badge variant={getStatusBadgeVariant(task.catering)}>{task.catering}</Badge>
                                    </TableCell>
                                     <TableCell>
                                        <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                            >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Send Update</DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
