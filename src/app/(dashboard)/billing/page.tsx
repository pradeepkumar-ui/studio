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
import { FileDown, FilePlus, GitCompareArrows, RefreshCw, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


const kpiData = [
  { title: 'Pending Invoices', value: '240' },
  { title: 'Posted Invoices', value: '1,125' },
  { title: 'Disputed Invoices', value: '6' },
  { title: 'Reconciliation Rate', value: '99.97%' },
];

type Invoice = {
  invoiceId: string;
  orderId: string;
  customer: string;
  amount: number;
  currency: string;
  status: 'Posted' | 'Pending' | 'Paid' | 'Disputed' | 'Overdue';
  dueDate: string;
};

const mockInvoices: Invoice[] = [
  { invoiceId: 'INV_56214', orderId: 'ORD_87321', customer: 'Globex Corporation', amount: 1250.00, currency: 'EUR', status: 'Paid', dueDate: '2025-11-15' },
  { invoiceId: 'INV_56215', orderId: 'ORD_87322', customer: 'Initech', amount: 880.00, currency: 'USD', status: 'Posted', dueDate: '2025-11-20' },
  { invoiceId: 'INV_56216', orderId: 'ORD_87323', customer: 'Hooli', amount: 450.00, currency: 'USD', status: 'Pending', dueDate: '2025-11-22' },
  { invoiceId: 'INV_56217', orderId: 'ORD_87324', customer: 'Stark Industries', amount: 3200.00, currency: 'USD', status: 'Overdue', dueDate: '2025-10-25' },
  { invoiceId: 'INV_56218', orderId: 'ORD_87325', customer: 'Wayne Enterprises', amount: 7500.00, currency: 'USD', status: 'Disputed', dueDate: '2025-11-18' },
];

const getStatusBadgeVariant = (status: Invoice['status']) => {
  switch (status) {
    case 'Paid': return 'default';
    case 'Posted': return 'secondary';
    case 'Pending': return 'outline';
    case 'Disputed':
    case 'Overdue': return 'destructive';
    default: return 'outline';
  }
};


export default function BillingPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Order Accounting Billing Console
                </h1>
                <p className="text-muted-foreground">
                    Manage billing generation, validation, and synchronisation.
                </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><FilePlus className="mr-2 h-4 w-4" /> Generate Invoice</Button>
                    <Button variant="outline"><GitCompareArrows className="mr-2 h-4 w-4" /> Run Reconciliation</Button>
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
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>
                        A log of recently generated invoices and their statuses.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockInvoices.map((invoice) => (
                                <TableRow key={invoice.invoiceId}>
                                    <TableCell className="font-mono">{invoice.invoiceId}</TableCell>
                                    <TableCell className="font-mono">{invoice.orderId}</TableCell>
                                    <TableCell>{invoice.customer}</TableCell>
                                    <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(invoice.status)}>{invoice.status}</Badge>
                                    </TableCell>
                                    <TableCell>{invoice.dueDate}</TableCell>
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
                                            <DropdownMenuItem>View Invoice</DropdownMenuItem>
                                            <DropdownMenuItem>View Audit</DropdownMenuItem>
                                            <DropdownMenuItem>Post to Ledger</DropdownMenuItem>
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
