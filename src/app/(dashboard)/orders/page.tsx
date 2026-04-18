'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ChevronsUpDown,
  MoreHorizontal,
  Search,
  ShoppingCart,
  ReceiptText,
  AlertCircle,
  FileBox,
  MonitorDot,
  Loader2
} from 'lucide-react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

export type Order = {
  id: string;
  customer: string;
  email: string;
  status: 'Pending' | 'Fulfilled' | 'Canceled';
  date: string;
  amount: number;
  originDestination: string;
  channel: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  isSimulated?: boolean;
};

const mockRecentOrders: Order[] = [
    { id: 'ORD-073', customer: 'John Smith', email: 'contact@voyagetravel.com', status: 'Fulfilled', date: '2024-07-15', amount: 12500, originDestination: 'JFK-LHR', channel: 'TMC', paymentStatus: 'Paid' },
    { id: 'ORD-072', customer: 'Globex Corporation', email: 'accounts@globex.corp', status: 'Fulfilled', date: '2024-07-15', amount: 8400, originDestination: 'SFO-HND', channel: 'Corporate', paymentStatus: 'Paid' },
];

const getStatusBadgeVariant = (status: Order['status']) => {
  switch (status) {
    case 'Fulfilled': return 'default';
    case 'Pending': return 'secondary';
    case 'Canceled': return 'destructive';
    default: return 'outline';
  }
};

const getPaymentStatusBadgeVariant = (status: Order['paymentStatus']) => {
  switch (status) {
    case 'Paid': return 'default';
    case 'Pending': return 'secondary';
    case 'Failed': return 'destructive';
    case 'Refunded': return 'outline';
    default: return 'outline';
  }
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Order ID <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 pl-4">
        <Link href={`/orders/${row.original.id}`} className="font-medium text-primary hover:underline">
            {row.original.id.slice(0, 8)}
        </Link>
        {row.original.isSimulated && <Badge variant="outline" className="text-[9px] h-4 bg-indigo-50 border-indigo-200 text-indigo-700">SIMULATED</Badge>}
      </div>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => <div>{row.getValue('customer')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Order Status',
    cell: ({ row }) => (
      <Badge variant={getStatusBadgeVariant(row.getValue('status'))}>
        {row.getValue('status')}
      </Badge>
    ),
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => (
      <Badge variant={getPaymentStatusBadgeVariant(row.getValue('paymentStatus'))}>
        {row.getValue('paymentStatus')}
      </Badge>
    ),
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium font-mono">
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.getValue('amount')))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild><Link href={`/orders/${row.original.id}`}>View Details</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>Copy ID</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    ),
  },
];

export default function OrdersPage() {
  const firestore = useFirestore();
  const ordersQuery = React.useMemo(() => firestore ? collection(firestore, 'orders') : undefined, [firestore]);
  const { data: liveOrders, loading } = useCollection(ordersQuery);
  
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const data = React.useMemo(() => {
    if (!liveOrders || liveOrders.length === 0) return mockRecentOrders;
    return (liveOrders as Order[]).sort((a, b) => b.id.localeCompare(a.id));
  }, [liveOrders]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Order Management Console</h1>
          <p className="text-muted-foreground">Monitor and manage the fulfillment lifecycle of all retailing transactions.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-muted-foreground uppercase">Total Orders</p>
                <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-black mt-2">{data.length}</p>
        </Card>
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-muted-foreground uppercase">Fulfilled</p>
                <ReceiptText className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black mt-2">{data.filter(o => o.status === 'Fulfilled').length}</p>
        </Card>
        <Card className="p-6 border-indigo-100 bg-indigo-50/10">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-indigo-700 uppercase">Simulated</p>
                <MonitorDot className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black mt-2">{data.filter(o => o.isSimulated).length}</p>
        </Card>
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-muted-foreground uppercase">Total Value</p>
                <FileBox className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-black mt-2">${data.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
        </Card>
      </div>

      <Card>
         <CardHeader>
          <CardTitle>Retailing Order Queue</CardTitle>
          <CardDescription>Live log of conversions across all touchpoints (Web, Mobile, SITA CUSS).</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 py-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, Customer..."
                value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
                onChange={(event) => table.getColumn('customer')?.setFilterValue(event.target.value)}
                className="max-w-sm pl-9"
              />
            </div>
            <Select onValueChange={(v) => table.getColumn('status')?.setFilterValue(v === 'all' ? null : v)}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={columns.length} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No orders found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
