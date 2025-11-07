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
import { UserCheck, RotateCcw, DownloadCloud, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const kpiData = [
  { title: 'Total Check-Ins (24h)', value: '12,380' },
  { title: 'Completed', value: '12,122' },
  { title: 'Failed', value: '258' },
  { title: 'DCS Sync Health', value: '99.9%' },
];

type CheckInStatus = 'Completed' | 'Pending' | 'Failed';

const mockCheckIns = [
  { id: 'CI-001', orderId: 'ORD-98574', passenger: 'Jane Doe', channel: 'Mobile App', status: 'Completed' as CheckInStatus, timestamp: '2 mins ago' },
  { id: 'CI-002', orderId: 'ORD-98575', passenger: 'John Smith', channel: 'Web', status: 'Completed' as CheckInStatus, timestamp: '5 mins ago' },
  { id: 'CI-003', orderId: 'ORD-98576', passenger: 'Alice Johnson', channel: 'Kiosk', status: 'Failed' as CheckInStatus, timestamp: '10 mins ago' },
  { id: 'CI-004', orderId: 'ORD-98577', passenger: 'Bob Williams', channel: 'Web', status: 'Completed' as CheckInStatus, timestamp: '15 mins ago' },
  { id: 'CI-005', orderId: 'ORD-98578', passenger: 'Charlie Brown', channel: 'Mobile App', status: 'Pending' as CheckInStatus, timestamp: '20 mins ago' },
];

const getStatusBadgeVariant = (status: CheckInStatus) => {
  switch (status) {
    case 'Completed': return 'default';
    case 'Pending': return 'secondary';
    case 'Failed': return 'destructive';
    default: return 'outline';
  }
};

export default function CheckInPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Self-Service Check-In Console
                </h1>
                <p className="text-muted-foreground">
                    Monitor passenger check-in, manage seat assignments, and issue boarding passes.
                </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><RotateCcw className="mr-2 h-4 w-4" /> Retry Failed</Button>
                    <Button variant="outline"><DownloadCloud className="mr-2 h-4 w-4" /> Export Logs</Button>
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
                    <CardTitle>Recent Check-Ins</CardTitle>
                    <CardDescription>
                        A log of the most recent passenger check-in activities across all channels.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Passenger</TableHead>
                                <TableHead>Channel</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Timestamp</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockCheckIns.map((checkIn) => (
                                <TableRow key={checkIn.id}>
                                    <TableCell className="font-mono">{checkIn.orderId}</TableCell>
                                    <TableCell>{checkIn.passenger}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{checkIn.channel}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(checkIn.status)}>{checkIn.status}</Badge>
                                    </TableCell>
                                    <TableCell>{checkIn.timestamp}</TableCell>
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
                                            <DropdownMenuItem>Re-Issue Boarding Pass</DropdownMenuItem>
                                            <DropdownMenuItem>Cancel Check-In</DropdownMenuItem>
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
