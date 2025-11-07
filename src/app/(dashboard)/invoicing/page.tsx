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
import { FileDown, FilePlus, Send, CheckSquare, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


const kpiData = [
  { title: 'Draft', value: '180' },
  { title: 'Approved', value: '2,940' },
  { title: 'Delivered', value: '2,935' },
  { title: 'Exceptions', value: '5' },
];

type Invoice = {
  invoiceId: string;
  orderId: string;
  customer: string;
  amount: number;
  currency: string;
  status: 'Draft' | 'Approved' | 'Sent' | 'Failed';
  issueDate: string;
};

const mockInvoices: Invoice[] = [
  { invoiceId: 'INV_55123', orderId: 'ORD_88214', customer: 'Agency TRV789', amount: 1050.75, currency: 'EUR', status: 'Sent', issueDate: '2025-10-31' },
  { invoiceId: 'INV_55124', orderId: 'ORD_88215', customer: 'Globex Inc.', amount: 880.00, currency: 'USD', status: 'Approved', issueDate: '2025-10-31' },
  { invoiceId: 'INV_55125', orderId: 'ORD_88216', customer: 'Hooli Ltd.', amount: 450.00, currency: 'USD', status: 'Draft', issueDate: '2025-10-31' },
  { invoiceId: 'INV_55126', orderId: 'ORD_88217', customer: 'Stark Industries', amount: 3200.00, currency: 'USD', status: 'Failed', issueDate: '2025-10-30' },
  { invoiceId: 'INV_55127', orderId: 'ORD_88218', customer: 'Wayne Enterprises', amount: 7500.00, currency: 'USD', status: 'Sent', issueDate: '2025-10-30' },
];

const getStatusBadgeVariant = (status: Invoice['status']) => {
  switch (status) {
    case 'Sent':
    case 'Approved': 
      return 'default';
    case 'Draft': 
      return 'secondary';
    case 'Failed': 
      return 'destructive';
    default: return 'outline';
  }
};


export default function InvoicingPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Order Accounting Invoicing Console
                </h1>
                <p className="text-muted-foreground">
                    Manage invoice generation, validation, and distribution.
                </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><FilePlus className="mr-2 h-4 w-4" /> Generate</Button>
                    <Button variant="outline"><CheckSquare className="mr-2 h-4 w-4" /> Approve</Button>
                    <Button variant="outline"><Send className="mr-2 h-4 w-4" /> Send</Button>
                    <Button><FileDown className="mr-2 h-4 w-4" /> Export Audit</Button>
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
                    <CardTitle>Invoice Queue</CardTitle>
                    <CardDescription>
                        A log of recently generated invoices and their lifecycle statuses.
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
                                <TableHead>Issue Date</TableHead>
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
                                    <TableCell>{invoice.issueDate}</TableCell>
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
                                            <DropdownMenuItem>Approve</DropdownMenuItem>
                                            <DropdownMenuItem>Send</DropdownMenuItem>
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
