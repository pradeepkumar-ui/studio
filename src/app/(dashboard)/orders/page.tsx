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

const mockRecentOrders: Order[] = [
    { id: 'ORD-073', customer: 'Voyage Travel Co.', email: 'contact@voyagetravel.com', status: 'Fulfilled', date: '2024-07-15', amount: 12500, originDestination: 'JFK-LHR', channel: 'TMC' },
    { id: 'ORD-072', customer: 'Globex Corporation', email: 'accounts@globex.corp', status: 'Fulfilled', date: '2024-07-15', amount: 8400, originDestination: 'SFO-HND', channel: 'Corporate' },
    { id: 'ORD-071', customer: 'Jane Smith', email: 'jane.smith@example.com', status: 'Pending', date: '2024-07-14', amount: 450, originDestination: 'MIA-CUN', channel: 'Web' },
    { id: 'ORD-070', customer: 'InnoTech Solutions', email: 'procurement@innotech.com', status: 'Fulfilled', date: '2024-07-13', amount: 22000, originDestination: 'SIN-DXB', channel: 'API' },
    { id: 'ORD-069', customer: 'Adventure Seekers', email: 'bookings@adventureseekers.io', status: 'Canceled', date: '2024-07-12', amount: 1800, originDestination: 'LAX-SYD', channel: 'OTA' },
    { id: 'ORD-068', customer: 'Stark Industries', email: 'tony@stark.com', status: 'Fulfilled', date: '2024-07-12', amount: 45000, originDestination: 'JFK-ZRH', channel: 'Corporate' },
    { id: 'ORD-067', customer: 'Wayne Enterprises', email: 'bruce@wayne.com', status: 'Pending', date: '2024-07-11', amount: 1100, originDestination: 'ORD-LGA', channel: 'Web' },
    { id: 'ORD-066', customer: 'Cyberdyne Systems', email: 'miles@cyberdyne.com', status: 'Fulfilled', date: '2024-07-11', amount: 950, originDestination: 'LAX-DFW', channel: 'API' },
    { id: 'ORD-065', customer: 'Hooli', email: 'gavin@hooli.com', status: 'Canceled', date: '2024-07-10', amount: 250, originDestination: 'SJC-SEA', channel: 'Web' },
    { id: 'ORD-064', customer: 'Acme Corporation', email: 'wile@acme.com', status: 'Fulfilled', date: '2024-07-10', amount: 600, originDestination: 'PHX-DEN', channel: 'TMC' },
  ];

export type Order = {
  id: string;
  customer: string;
  email: string;
  status: 'Pending' | 'Fulfilled' | 'Canceled';
  date: string;
  amount: number;
  originDestination: string;
  channel: string;
};

const getStatusBadgeVariant = (status: Order['status']) => {
  switch (status) {
    case 'Fulfilled':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Canceled':
      return 'destructive';
    default:
      return 'outline';
  }
};

const kpiData = [
  { title: 'Total Orders', value: '4,320', icon: ShoppingCart },
  { title: 'Active Orders', value: '3,980', icon: ReceiptText },
  { title: 'Open Refunds', value: '55', icon: AlertCircle },
  { title: 'Services Attached', value: '12,600', icon: FileBox },
];

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Order ID
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Link href={`/orders/${row.getValue('id')}`} className="pl-4 font-medium text-primary hover:underline">
        {row.getValue('id')}
      </Link>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => <div>{row.getValue('customer')}</div>,
  },
  {
    accessorKey: 'originDestination',
    header: 'Route',
    cell: ({ row }) => <div>{row.getValue('originDestination')}</div>,
  },
  {
    accessorKey: 'channel',
    header: 'Channel',
    cell: ({ row }) => <Badge variant="outline">{row.getValue('channel')}</Badge>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={getStatusBadgeVariant(row.getValue('status'))}>
        {row.getValue('status')}
      </Badge>
    ),
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
                <Link href={`/orders/${order.id}`}>View Order Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>View Customer</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copy order ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function OrdersPage() {
  const [data, setData] = React.useState<Order[]>(mockRecentOrders);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  React.useEffect(() => {
    const newOrderString = sessionStorage.getItem('newly_created_order');
    if (newOrderString) {
      const newOrder: Omit<Order, 'originDestination' | 'channel'> = JSON.parse(newOrderString);
      const completeNewOrder: Order = {
        ...newOrder,
        originDestination: 'JFK-LAX', // Mock data for new order
        channel: 'Web', // Mock data for new order
      };
      setData(prevData => [completeNewOrder, ...prevData]);
      sessionStorage.removeItem('newly_created_order');
    }
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Order Management Console
          </h1>
          <p className="text-muted-foreground">
            Central hub for viewing, managing, and fulfilling all orders.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
         <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            A summary of the most recent orders placed across all channels.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 py-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, Customer, Email..."
                value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
                onChange={(event) => {
                    const value = event.target.value;
                    table.getColumn('customer')?.setFilterValue(value);
                    table.getColumn('id')?.setFilterValue(value);
                    table.getColumn('email')?.setFilterValue(value);
                }}
                className="max-w-sm pl-9"
              />
            </div>
             <Select
              value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
              onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={(table.getColumn('channel')?.getFilterValue() as string) ?? 'all'}
              onValueChange={(value) => table.getColumn('channel')?.setFilterValue(value === 'all' ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="Web">Web</SelectItem>
                <SelectItem value="TMC">TMC</SelectItem>
                <SelectItem value="OTA">OTA</SelectItem>
                <SelectItem value="Corporate">Corporate</SelectItem>
                <SelectItem value="API">API</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
