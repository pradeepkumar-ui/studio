
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
import { FileDown, FileEdit, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const kpiData = [
  { title: 'Airlines', value: '12' },
  { title: 'Active Rules', value: '58' },
  { title: 'Journals Posted (24h)', value: '32,400' },
  { title: 'Reconciliation Rate', value: '99.98%' },
];

type PostingEntry = {
  journalId: string;
  orderId: string;
  airline: string;
  amount: number;
  currency: string;
  status: 'Posted' | 'Pending' | 'Failed';
  timestamp: string;
};

const mockPostings: PostingEntry[] = [
  { journalId: 'JRN_56098', orderId: 'ORD_90012', airline: 'INF123', amount: 1045.25, currency: 'EUR', status: 'Posted', timestamp: '3 mins ago' },
  { journalId: 'JRN_56099', orderId: 'ORD_90013', airline: 'XYZ789', amount: 880.00, currency: 'INR', status: 'Posted', timestamp: '6 mins ago' },
  { journalId: 'JRN_56100', orderId: 'ORD_90014', airline: 'INF123', amount: 450.00, currency: 'EUR', status: 'Pending', timestamp: '15 mins ago' },
  { journalId: 'JRN_56101', orderId: 'ORD_90015', airline: 'ABC456', amount: -210.00, currency: 'GBP', status: 'Posted', timestamp: '30 mins ago' },
  { journalId: 'JRN_56102', orderId: 'ORD_90016', airline: 'XYZ789', amount: 3200.00, currency: 'INR', status: 'Failed', timestamp: '55 mins ago' },
  { journalId: 'JRN_56103', orderId: 'ORD_90017', airline: 'INF123', amount: 620.00, currency: 'EUR', status: 'Posted', timestamp: '1 hour ago' },
  { journalId: 'JRN_56104', orderId: 'ORD_90018', airline: 'ABC456', amount: 930.50, currency: 'GBP', status: 'Posted', timestamp: '1 hour ago' },
  { journalId: 'JRN_56105', orderId: 'ORD_90019', airline: 'XYZ789', amount: 1250.00, currency: 'INR', status: 'Pending', timestamp: '2 hours ago' },
  { journalId: 'JRN_56106', orderId: 'ORD_90020', airline: 'INF123', amount: -150.00, currency: 'EUR', status: 'Posted', timestamp: '2 hours ago' },
  { journalId: 'JRN_56107', orderId: 'ORD_90021', airline: 'XYZ789', amount: 4800.00, currency: 'INR', status: 'Failed', timestamp: '3 hours ago' },
];

const getStatusBadgeVariant = (status: PostingEntry['status']) => {
  switch (status) {
    case 'Posted': return 'default';
    case 'Pending': return 'secondary';
    case 'Failed': return 'destructive';
    default: return 'outline';
  }
};


export default function AirlineRevenuePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Airline-Specific Revenue Posting
                </h1>
                <p className="text-muted-foreground">
                    Manage and monitor custom revenue recognition logic for airline partners.
                </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><FileEdit className="mr-2 h-4 w-4" /> Manage Rules</Button>
                    <Button><FileDown className="mr-2 h-4 w-4" /> Export Report</Button>
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
                    <CardTitle>Recent Revenue Postings</CardTitle>
                    <CardDescription>
                        A log of the most recent airline-specific accounting entries.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Journal ID</TableHead>
                                <TableHead>Airline</TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockPostings.map((journal) => (
                                <TableRow key={journal.journalId}>
                                    <TableCell className="font-mono">{journal.journalId}</TableCell>
                                    <TableCell className="font-mono">{journal.airline}</TableCell>
                                    <TableCell className="font-mono">{journal.orderId}</TableCell>
                                    <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: journal.currency }).format(journal.amount)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(journal.status)}>{journal.status}</Badge>
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
                                            <DropdownMenuItem>View Audit</DropdownMenuItem>
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
