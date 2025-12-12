
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ChevronsUpDown,
  MoreHorizontal,
  Search,
  Users,
  PlusCircle,
  Download,
} from 'lucide-react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
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
import { useRouter } from 'next/navigation';

export type GroupOrder = {
  id: string;
  groupName: string;
  leadPassenger: string;
  totalPassengers: number;
  status: 'Pending Approval' | 'Active' | 'Fulfilled' | 'Cancelled';
  paymentTerms: 'Deposit + Balance' | 'Full Payment';
  fareType: 'Negotiated' | 'Published';
};

const mockGroupOrders: GroupOrder[] = [
    { id: 'GRP_92345', groupName: 'Corporate Training Batch 2025', leadPassenger: 'John Carter', totalPassengers: 26, paymentTerms: 'Deposit + Balance', fareType: 'Negotiated', status: 'Active' },
    { id: 'GRP_92346', groupName: 'Summer Student Exchange', leadPassenger: 'Alice Johnson', totalPassengers: 45, paymentTerms: 'Full Payment', fareType: 'Published', status: 'Active' },
    { id: 'GRP_92347', groupName: 'Leisure Tour - Italy', leadPassenger: 'Michael Smith', totalPassengers: 15, paymentTerms: 'Deposit + Balance', fareType: 'Published', status: 'Pending Approval' },
    { id: 'GRP_92348', groupName: 'Annual Sales Conference', leadPassenger: 'Sarah Chen', totalPassengers: 120, paymentTerms: 'Deposit + Balance', fareType: 'Negotiated', status: 'Active' },
    { id: 'GRP_92349', groupName: 'Wedding Party - Hawaii', leadPassenger: 'David Miller', totalPassengers: 35, paymentTerms: 'Full Payment', fareType: 'Published', status: 'Fulfilled' },
];

const getStatusBadgeVariant = (status: GroupOrder['status']) => {
  switch (status) {
    case 'Active': return 'default';
    case 'Pending Approval': return 'secondary';
    case 'Fulfilled': return 'outline';
    case 'Cancelled': return 'destructive';
    default: return 'outline';
  }
};

const kpiData = [
  { title: 'Total Group Orders', value: '285' },
  { title: 'Active Orders', value: '240' },
  { title: 'Pending Approval', value: '30' },
  { title: 'Total Passengers', value: '3,240' },
];

export const columns: ColumnDef<GroupOrder>[] = [
  {
    accessorKey: 'groupName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Group Name
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link href={`/orders/group-dashboard/${row.original.id}`} className="pl-4 font-medium text-primary hover:underline">
        <div>{row.getValue('groupName')}</div>
        <div className="text-xs text-muted-foreground font-mono">{row.original.id}</div>
      </Link>
    ),
  },
   {
    accessorKey: 'totalPassengers',
    header: 'Passengers',
    cell: ({ row }) => <div>{row.getValue('totalPassengers')}</div>,
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
    accessorKey: 'paymentTerms',
    header: 'Payment Terms',
    cell: ({ row }) => <div>{row.getValue('paymentTerms')}</div>,
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
                <Link href={`/orders/group-dashboard/${order.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Manage Passengers</DropdownMenuItem>
             <DropdownMenuItem>Manage Payments</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Cancel Group Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function GroupOrdersPage() {
  const [data, setData] = React.useState<GroupOrder[]>(mockGroupOrders);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const router = useRouter();

  React.useEffect(() => {
    const newOrderString = sessionStorage.getItem('newly_created_group_order');
    if (newOrderString) {
      try {
        const newOrderData: Partial<GroupOrder> = JSON.parse(newOrderString);
        const completeNewOrder: GroupOrder = {
          id: newOrderData.id || `GRP_${Math.floor(10000 + Math.random() * 90000)}`,
          groupName: newOrderData.groupName || 'New Group Booking',
          leadPassenger: newOrderData.leadPassenger || 'TBD',
          totalPassengers: newOrderData.totalPassengers || 0,
          status: newOrderData.status || 'Pending Approval',
          paymentTerms: newOrderData.paymentTerms || 'Deposit + Balance',
          fareType: newOrderData.fareType || 'Negotiated',
        };
        setData(prevData => [completeNewOrder, ...prevData]);
      } catch (e) {
        console.error("Failed to parse new group order from session storage", e);
      } finally {
        sessionStorage.removeItem('newly_created_group_order');
      }
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
            Group Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage group and large-party bookings from quotation to fulfilment.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Report</Button>
            <Button onClick={() => router.push('/group-composer')}><PlusCircle className="mr-2 h-4 w-4" /> Create Group Booking</Button>
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
          <CardTitle>Group Bookings</CardTitle>
          <CardDescription>
            A summary of all active and pending large-party bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center gap-4 py-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Group Name, ID..."
                value={(table.getColumn('groupName')?.getFilterValue() as string) ?? ''}
                onChange={(event) => {
                    table.getColumn('groupName')?.setFilterValue(event.target.value)
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                 <SelectItem value="Cancelled">Cancelled</SelectItem>
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
        </CardContent>
      </Card>
    </div>
  );
}
