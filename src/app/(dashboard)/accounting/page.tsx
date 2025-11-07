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
import { FileDown, FileEdit, Repeat } from 'lucide-react';

const kpiData = [
  { title: 'Journals Posted', value: '25,280' },
  { title: 'Pending Reconciliation', value: '60' },
  { title: 'Deferred Revenue', value: '$3.2M' },
  { title: 'Realised Revenue', value: '$12.8M' },
];

type JournalEntry = {
  journalId: string;
  orderId: string;
  eventType: string;
  amount: number;
  currency: string;
  status: 'Posted' | 'Pending' | 'Reversed';
  timestamp: string;
};

const mockJournals: JournalEntry[] = [
  { journalId: 'JRN_900145', orderId: 'ORD_52190', eventType: 'OrderPaid', amount: 1540.50, currency: 'USD', status: 'Posted', timestamp: '2 mins ago' },
  { journalId: 'JRN_900146', orderId: 'ORD_52191', eventType: 'OrderFulfilled', amount: 880.00, currency: 'EUR', status: 'Posted', timestamp: '5 mins ago' },
  { journalId: 'JRN_900147', orderId: 'ORD_52192', eventType: 'OrderPaid', amount: 450.00, currency: 'USD', status: 'Pending', timestamp: '12 mins ago' },
  { journalId: 'JRN_900148', orderId: 'ORD_52193', eventType: 'OrderRefunded', amount: -210.00, currency: 'GBP', status: 'Reversed', timestamp: '25 mins ago' },
  { journalId: 'JRN_900149', orderId: 'ORD_52194', eventType: 'OrderPaid', amount: 3200.00, currency: 'USD', status: 'Posted', timestamp: '45 mins ago' },
];

const getStatusBadgeVariant = (status: JournalEntry['status']) => {
  switch (status) {
    case 'Posted': return 'default';
    case 'Pending': return 'secondary';
    case 'Reversed': return 'destructive';
    default: return 'outline';
  }
};

export default function AccountingPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Order Accounting & Settlement
                </h1>
                <p className="text-muted-foreground">
                    A module for revenue posting, billing, settlement, and reconciliation.
                </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><FileEdit className="mr-2 h-4 w-4" /> Define Rules</Button>
                    <Button variant="outline"><Repeat className="mr-2 h-4 w-4" /> Run Reconciliation</Button>
                    <Button><FileDown className="mr-2 h-4 w-4" /> Export Trial Balance</Button>
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
                                <TableHead>Timestamp</TableHead>
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
                                    <TableCell>{journal.timestamp}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}