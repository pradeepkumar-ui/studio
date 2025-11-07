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
import { FileDown, FileEdit, MoreHorizontal, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const kpiData = [
  { title: 'Processed Journals', value: '42,180' },
  { title: 'Pending Journals', value: '64' },
  { title: 'Failed Journals', value: '8' },
  { title: 'Reconciliation Rate', value: '99.98%' },
];

type JournalEntry = {
  journalId: string;
  orderId: string;
  eventType: string;
  amount: number;
  currency: string;
  status: 'Posted' | 'Pending' | 'Reversed';
  reconStatus: 'Reconciled' | 'Pending' | 'Mismatch';
  timestamp: string;
};

const mockJournals: JournalEntry[] = [
  { journalId: 'JRN_900145', orderId: 'ORD_52190', eventType: 'OrderPaid', amount: 1540.50, currency: 'USD', status: 'Posted', reconStatus: 'Reconciled', timestamp: '2 mins ago' },
  { journalId: 'JRN_900146', orderId: 'ORD_52191', eventType: 'OrderFulfilled', amount: 880.00, currency: 'EUR', status: 'Posted', reconStatus: 'Reconciled', timestamp: '5 mins ago' },
  { journalId: 'JRN_900147', orderId: 'ORD_52192', eventType: 'OrderPaid', amount: 450.00, currency: 'USD', status: 'Pending', reconStatus: 'Pending', timestamp: '12 mins ago' },
  { journalId: 'JRN_900148', orderId: 'ORD_52193', eventType: 'OrderRefunded', amount: -210.00, currency: 'GBP', status: 'Reversed', reconStatus: 'Reconciled', timestamp: '25 mins ago' },
  { journalId: 'JRN_900149', orderId: 'ORD_52194', eventType: 'OrderPaid', amount: 3200.00, currency: 'USD', status: 'Posted', reconStatus: 'Mismatch', timestamp: '45 mins ago' },
];

const getStatusBadgeVariant = (status: JournalEntry['status']) => {
  switch (status) {
    case 'Posted': return 'default';
    case 'Pending': return 'secondary';
    case 'Reversed': return 'destructive';
    default: return 'outline';
  }
};

const getReconBadgeVariant = (status: JournalEntry['reconStatus']) => {
  switch (status) {
    case 'Reconciled': return 'default';
    case 'Pending': return 'secondary';
    case 'Mismatch': return 'destructive';
    default: return 'outline';
  }
};


export default function AccountingPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Order Accounting Processing
                </h1>
                <p className="text-muted-foreground">
                    A module for financial posting, reconciliation, and reporting of all order events.
                </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><FileEdit className="mr-2 h-4 w-4" /> Manage Rules</Button>
                    <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Reprocess Failed</Button>
                    <Button><FileDown className="mr-2 h-4 w-4" /> Export Ledger</Button>
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
                    <CardTitle>Recent Journal Entries</CardTitle>
                    <CardDescription>
                        A log of the most recent accounting entries generated from order events.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Journal ID</TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Event Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Reconciliation</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockJournals.map((journal) => (
                                <TableRow key={journal.journalId}>
                                    <TableCell className="font-mono">{journal.journalId}</TableCell>
                                    <TableCell className="font-mono">{journal.orderId}</TableCell>
                                    <TableCell>{journal.eventType}</TableCell>
                                    <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: journal.currency }).format(journal.amount)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(journal.status)}>{journal.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getReconBadgeVariant(journal.reconStatus)}>{journal.reconStatus}</Badge>
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
