
// 'use client';

// import * as React from 'react';
// import Link from 'next/link';
// import {
//   ChevronsUpDown,
//   MoreHorizontal,
//   Search,
//   ShoppingCart,
//   ReceiptText,
//   AlertCircle,
//   FileBox,
//   MonitorDot,
//   Loader2,
//   Globe,
//   Smartphone,
//   QrCode,
//   CreditCard,
//   Plane,
//   ArrowRightLeft,
//   CheckCircle2,
//   History,
//   Settings,
//   Truck
// } from 'lucide-react';
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from '@tanstack/react-table';

// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Input } from '@/components/ui/input';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { cn } from '@/lib/utils';
// import { useFirestore, useCollection } from '@/firebase';
// import { collection, query, orderBy } from 'firebase/firestore';

// export type Order = {
//   id: string;
//   customer: string;
//   email: string;
//   status: 'Pending' | 'Fulfilled' | 'Canceled' | 'Partially Fulfilled';
//   date: string;
//   amount: number;
//   currency: string;
//   source: 'Web' | 'Mobile' | 'CUSS' | 'CUTE' | 'CUPPS';
//   airportCode?: string;
//   pnr?: string;
//   paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
//   isSimulated?: boolean;
//   route?: string;
// };

// const mockRecentOrders: Order[] = [
//     { id: 'ORD-073', customer: 'John Smith', email: 'john.smith@example.com', status: 'Fulfilled', date: '2024-10-28', amount: 12500, source: 'Web', pnr: 'L8Y2N3', route: 'JFK-LHR', paymentStatus: 'Paid' },
//     { id: 'ORD-072', customer: 'Sarah Chen', email: 's.chen@corporate.com', status: 'Fulfilled', date: '2024-10-28', amount: 8400, source: 'CUTE', pnr: 'P4X5T6', route: 'SFO-HND', paymentStatus: 'Paid' },
//     { id: 'ORD-071', customer: 'Michael Smith', email: 'm.smith@voyage.co', status: 'Pending', date: '2024-10-27', amount: 450, source: 'CUSS', pnr: 'GRP923', route: 'LHR-FCO', paymentStatus: 'Pending' },
//     { id: 'ORD-070', customer: 'Alice Johnson', email: 'alice.j@web.com', status: 'Canceled', date: '2024-10-27', amount: 120, source: 'Mobile', pnr: 'M9Z1M2', route: 'SIN-HKG', paymentStatus: 'Refunded' },
// ];

// const getStatusBadgeVariant = (status: Order['status']) => {
//   switch (status) {
//     case 'Fulfilled': return 'default';
//     case 'Pending': return 'secondary';
//     case 'Canceled': return 'destructive';
//     case 'Partially Fulfilled': return 'outline';
//     default: return 'outline';
//   }
// };

// const getPaymentStatusBadgeVariant = (status: Order['paymentStatus']) => {
//   switch (status) {
//     case 'Paid': return 'default';
//     case 'Pending': return 'secondary';
//     case 'Failed': return 'destructive';
//     case 'Refunded': return 'outline';
//     default: return 'outline';
//   }
// };

// const getSourceIcon = (source: Order['source']) => {
//     switch (source) {
//         case 'Web': return <Globe className="h-3 w-3" />;
//         case 'Mobile': return <Smartphone className="h-3 w-3" />;
//         case 'CUSS':
//         case 'CUTE':
//         case 'CUPPS': return <QrCode className="h-3 w-3" />;
//         default: return <MonitorDot className="h-3 w-3" />;
//     }
// }

// export const columns: ColumnDef<Order>[] = [
//   {
//     accessorKey: 'id',
//     header: ({ column }) => (
//         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
//           Order Identity <ChevronsUpDown className="ml-2 h-4 w-4" />
//         </Button>
//     ),
//     cell: ({ row }) => (
//       <div className="flex flex-col gap-1">
//         <div className="flex items-center gap-2">
//             <Link href={`/orders/${row.original.id}`} className="font-bold text-primary hover:underline font-mono text-xs">
//                 {row.original.id.slice(0, 8)}
//             </Link>
//             {row.original.isSimulated && <Badge variant="outline" className="text-[8px] h-3.5 bg-indigo-50 border-indigo-200 text-indigo-700 font-black">SIMULATED</Badge>}
//         </div>
//         <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-mono">
//             <Plane className="h-2.5 w-2.5" /> {row.original.pnr || 'NO_PNR'}
//         </div>
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'customer',
//     header: 'Customer Context',
//     cell: ({ row }) => (
//         <div className="flex flex-col">
//             <span className="font-medium text-sm">{row.original.customer}</span>
//             <span className="text-[10px] text-muted-foreground">{row.original.email}</span>
//         </div>
//     ),
//   },
//   {
//     accessorKey: 'route',
//     header: 'Itinerary',
//     cell: ({ row }) => (
//         <div className="flex items-center gap-2">
//             <Badge variant="secondary" className="font-mono text-[10px]">{row.original.route || 'N/A'}</Badge>
//             {row.original.airportCode && <span className="text-[10px] text-muted-foreground">@{row.original.airportCode}</span>}
//         </div>
//     ),
//   },
//   {
//     accessorKey: 'source',
//     header: 'Touchpoint',
//     cell: ({ row }) => (
//         <div className="flex items-center gap-2">
//             <div className="p-1.5 bg-muted rounded-md text-muted-foreground">
//                 {getSourceIcon(row.original.source)}
//             </div>
//             <span className="text-xs font-semibold">{row.original.source}</span>
//         </div>
//     ),
//   },
//   {
//     accessorKey: 'status',
//     header: 'Lifecycle',
//     cell: ({ row }) => (
//       <div className="flex flex-col gap-1">
//         <Badge variant={getStatusBadgeVariant(row.getValue('status'))} className="w-fit text-[10px] uppercase">
//             {row.getValue('status')}
//         </Badge>
//         <div className="text-[9px] text-muted-foreground flex items-center gap-1">
//              {row.original.status === 'Fulfilled' ? <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" /> : <History className="h-2.5 w-2.5" />}
//              {row.original.date}
//         </div>
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'amount',
//     header: () => <div className="text-right">Settlement</div>,
//     cell: ({ row }) => (
//       <div className="flex flex-col items-end gap-1">
//         <div className="text-right font-black font-mono text-primary">
//             {new Intl.NumberFormat('en-US', { style: 'currency', currency: row.original.currency || 'USD' }).format(row.original.amount)}
//         </div>
//         <Badge variant={getPaymentStatusBadgeVariant(row.original.paymentStatus)} className="text-[8px] h-3.5">
//             {row.original.paymentStatus}
//         </Badge>
//       </div>
//     ),
//   },
//   {
//     id: 'actions',
//     cell: ({ row }) => (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-56">
//             <DropdownMenuLabel>Order Operations</DropdownMenuLabel>
//             <DropdownMenuItem asChild>
//                 <Link href={`/orders/${row.original.id}`}><ReceiptText className="mr-2 h-4 w-4" /> View Full Details</Link>
//             </DropdownMenuItem>
//             <DropdownMenuItem asChild>
//                 <Link href={`/orders/${row.original.id}/lineage`}><ArrowRightLeft className="mr-2 h-4 w-4" /> Trace Lineage</Link>
//             </DropdownMenuItem>
//             <DropdownMenuItem asChild>
//                 <Link href={`/orders/servicing?orderId=${row.original.id}`}><Settings className="mr-2 h-4 w-4" /> Modify / Reshop</Link>
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>Copy Order ID</DropdownMenuItem>
//             {row.original.pnr && <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.pnr!)}>Copy PNR</DropdownMenuItem>}
//           </DropdownMenuContent>
//         </DropdownMenu>
//     ),
//   },
// ];

// export default function OrdersPage() {
//   const firestore = useFirestore();
  
//   const ordersQuery = React.useMemo(() => {
//     if (!firestore) return undefined;
//     return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
//   }, [firestore]);

//   const { data: liveOrders, loading } = useCollection(ordersQuery);
  
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

//   const data = React.useMemo(() => {
//     const orders = liveOrders ? (liveOrders as Order[]) : [];
//     if (orders.length === 0 && !loading) return mockRecentOrders;
//     return orders;
//   }, [liveOrders, loading]);

//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     state: { sorting, columnFilters },
//   });

//   return (
//     <div className="flex flex-col gap-6">
//        <div className="flex items-center justify-between">
//         <div className="flex flex-col gap-1">
//           <h1 className="text-3xl font-bold tracking-tight text-primary">Order Management Console</h1>
//           <p className="text-muted-foreground font-medium">Unified oversight for ecosystem conversions, touchpoint attribution, and PSS fulfillment.</p>
//         </div>
//         <div className="flex gap-2">
//             <Button variant="outline" asChild><Link href="/orders/delivery"><Truck className="mr-2 h-4 w-4" /> Fulfillment Queue</Link></Button>
//             <Button asChild><Link href="/offer-composer"><MonitorDot className="mr-2 h-4 w-4" /> Simulated Touchpoint</Link></Button>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//         <Card className="p-6 shadow-sm">
//             <div className="flex items-center justify-between">
//                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Volume</p>
//                 <ShoppingCart className="h-4 w-4 text-primary" />
//             </div>
//             <p className="text-3xl font-black mt-2">{data.length}</p>
//             <div className="mt-2 text-[10px] text-muted-foreground">Orders successfully converted.</div>
//         </Card>
//         <Card className="p-6 shadow-sm">
//             <div className="flex items-center justify-between">
//                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fulfilled</p>
//                 <CheckCircle2 className="h-4 w-4 text-emerald-500" />
//             </div>
//             <p className="text-3xl font-black mt-2">{data.filter(o => o.status === 'Fulfilled').length}</p>
//             <div className="mt-2 text-[10px] text-emerald-600 font-bold">Synchronized with Host PSS.</div>
//         </Card>
//         <Card className="p-6 border-indigo-100 bg-indigo-50/20">
//             <div className="flex items-center justify-between">
//                 <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Simulated</p>
//                 <MonitorDot className="h-4 w-4 text-indigo-600" />
//             </div>
//             <p className="text-3xl font-black mt-2 text-indigo-700">{data.filter(o => o.isSimulated).length}</p>
//             <div className="mt-2 text-[10px] text-indigo-600 font-bold">Generated via Offer Composer.</div>
//         </Card>
//         <Card className="p-6 shadow-sm">
//             <div className="flex items-center justify-between">
//                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pipeline Value</p>
//                 <CreditCard className="h-4 w-4 text-blue-500" />
//             </div>
//             <p className="text-3xl font-black mt-2">${data.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}</p>
//             <div className="mt-2 text-[10px] text-muted-foreground font-medium">Gross retailing revenue.</div>
//         </Card>
//       </div>

//       <Card className="shadow-md">
//          <CardHeader className="bg-muted/10">
//           <CardTitle>Retailing Conversion Queue</CardTitle>
//           <CardDescription>Live real-time trace of ecosystem transactions across Web, Mobile, and SITA touchpoints.</CardDescription>
//         </CardHeader>
//         <CardContent className="pt-4">
//           <div className="flex items-center gap-4 py-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by ID, Customer, or PNR..."
//                 value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
//                 onChange={(event) => table.getColumn('customer')?.setFilterValue(event.target.value)}
//                 className="max-w-sm pl-9"
//               />
//             </div>
//             <Select onValueChange={(v) => table.getColumn('status')?.setFilterValue(v === 'all' ? null : v)}>
//               <SelectTrigger className="w-[180px]"><SelectValue placeholder="Lifecycle State" /></SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All States</SelectItem>
//                 <SelectItem value="Fulfilled">Fulfilled</SelectItem>
//                 <SelectItem value="Pending">Pending</SelectItem>
//                 <SelectItem value="Canceled">Canceled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader className="bg-muted/30">
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                         <TableHead key={header.id} className="text-[10px] uppercase font-black tracking-widest">
//                           {flexRender(header.column.columnDef.header, header.getContext())}
//                         </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                     <TableRow><TableCell colSpan={columns.length} className="h-64 text-center"><div className="flex flex-col items-center gap-2"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /><p className="text-xs text-muted-foreground">Streaming conversion data...</p></div></TableCell></TableRow>
//                 ) : table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id} className="group cursor-default">
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow><TableCell colSpan={columns.length} className="h-64 text-center py-20"><div className="flex flex-col items-center gap-2 opacity-50"><AlertCircle className="h-12 w-12" /><p className="font-bold">No orders matched the current filters.</p></div></TableCell></TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           <div className="flex items-center justify-between py-4">
//               <div className="text-xs text-muted-foreground font-medium">
//                   Showing {table.getRowModel().rows.length} of {data.length} transactions.
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
//                 <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
//               </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



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
  Loader2,
  Globe,
  Smartphone,
  QrCode,
  CreditCard,
  Plane,
  ArrowRightLeft,
  CheckCircle2,
  History,
  Settings,
  Truck
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
import { collection, query, orderBy } from 'firebase/firestore';
import { StatsCards } from '@/components/StatsCards/StatsCards';
import { TableFilterBar } from '@/components/TableFilterbar/TableFilterBar';
import { useTableFilters } from '@/hooks/useTableFilters';

export type Order = {
  id: string;
  customer: string;
  email: string;
  status: 'Pending' | 'Fulfilled' | 'Canceled' | 'Partially Fulfilled';
  date: string;
  amount: number;
  currency: string;
  source: 'Web' | 'Mobile' | 'CUSS' | 'CUTE' | 'CUPPS';
  airportCode?: string;
  pnr?: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  isSimulated?: boolean;
  route?: string;
};

const mockRecentOrders: Order[] = [
    { id: 'ORD-073', customer: 'John Smith', email: 'john.smith@example.com', status: 'Fulfilled', date: '2024-10-28', amount: 12500, source: 'Web', pnr: 'L8Y2N3', route: 'JFK-LHR', paymentStatus: 'Paid' },
    { id: 'ORD-072', customer: 'Sarah Chen', email: 's.chen@corporate.com', status: 'Fulfilled', date: '2024-10-28', amount: 8400, source: 'CUTE', pnr: 'P4X5T6', route: 'SFO-HND', paymentStatus: 'Paid' },
    { id: 'ORD-071', customer: 'Michael Smith', email: 'm.smith@voyage.co', status: 'Pending', date: '2024-10-27', amount: 450, source: 'CUSS', pnr: 'GRP923', route: 'LHR-FCO', paymentStatus: 'Pending' },
    { id: 'ORD-070', customer: 'Alice Johnson', email: 'alice.j@web.com', status: 'Canceled', date: '2024-10-27', amount: 120, source: 'Mobile', pnr: 'M9Z1M2', route: 'SIN-HKG', paymentStatus: 'Refunded' },
    { id: 'ORD-069', customer: 'Robert Brown', email: 'robert.b@travel.com', status: 'Partially Fulfilled', date: '2024-10-26', amount: 75, source: 'Web', pnr: 'K7L9P2', route: 'CDG-JFK', paymentStatus: 'Paid', isSimulated: true },
];

const STATS = [
  { label: "Total Orders", value: 42, color: "purple" as const, icon: <ShoppingCart /> },
  { label: "Fulfilled",    value: 38, color: "green"  as const, icon: <CheckCircle2 /> },
  { label: "Pending",      value: 3,  color: "amber"  as const, icon: <AlertCircle /> },
  { label: "Canceled",     value: 1,  color: "red"    as const, icon: <AlertCircle /> },
];

// ─── Filter Options ───────────────────────────────────────────────────────────
const STATUS_OPTIONS    = ["Fulfilled", "Pending", "Canceled", "Partially Fulfilled"].map((v) => ({ label: v, value: v }));
const SOURCE_OPTIONS    = ["Web", "Mobile", "CUSS", "CUTE", "CUPPS"].map((v) => ({ label: v, value: v }));
const PAYMENT_OPTIONS   = ["Paid", "Pending", "Failed", "Refunded"].map((v) => ({ label: v, value: v }));

const getStatusBadgeVariant = (status: Order['status']) => {
  switch (status) {
    case 'Fulfilled': return 'default';
    case 'Pending': return 'secondary';
    case 'Canceled': return 'destructive';
    case 'Partially Fulfilled': return 'outline';
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

const getSourceIcon = (source: Order['source']) => {
    switch (source) {
        case 'Web': return <Globe className="h-3 w-3" />;
        case 'Mobile': return <Smartphone className="h-3 w-3" />;
        case 'CUSS':
        case 'CUTE':
        case 'CUPPS': return <QrCode className="h-3 w-3" />;
        default: return <MonitorDot className="h-3 w-3" />;
    }
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
          Order Identity <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
            <Link href={`/orders/${row.original.id}`} className="font-bold text-primary hover:underline font-mono text-xs">
                {row.original.id.slice(0, 8)}
            </Link>
            {row.original.isSimulated && <Badge variant="outline" className="text-[8px] h-3.5 bg-indigo-50 border-indigo-200 text-indigo-700 font-black">SIMULATED</Badge>}
        </div>
        <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-mono">
            <Plane className="h-2.5 w-2.5" /> {row.original.pnr || 'NO_PNR'}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Customer Context',
    cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="font-medium text-sm">{row.original.customer}</span>
            <span className="text-[10px] text-muted-foreground">{row.original.email}</span>
        </div>
    ),
  },
  {
    accessorKey: 'route',
    header: 'Itinerary',
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-[10px]">{row.original.route || 'N/A'}</Badge>
            {row.original.airportCode && <span className="text-[10px] text-muted-foreground">@{row.original.airportCode}</span>}
        </div>
    ),
  },
  {
    accessorKey: 'source',
    header: 'Touchpoint',
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-muted rounded-md text-muted-foreground">
                {getSourceIcon(row.original.source)}
            </div>
            <span className="text-xs font-semibold">{row.original.source}</span>
        </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Lifecycle',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <Badge variant={getStatusBadgeVariant(row.getValue('status'))} className="w-fit text-[10px] uppercase">
            {row.getValue('status')}
        </Badge>
        <div className="text-[9px] text-muted-foreground flex items-center gap-1">
             {row.original.status === 'Fulfilled' ? <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" /> : <History className="h-2.5 w-2.5" />}
             {row.original.date}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Settlement</div>,
    cell: ({ row }) => (
      <div className="flex flex-col items-end gap-1">
        <div className="text-right font-black font-mono text-primary">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: row.original.currency || 'USD' }).format(row.original.amount)}
        </div>
        <Badge variant={getPaymentStatusBadgeVariant(row.original.paymentStatus)} className="text-[8px] h-3.5">
            {row.original.paymentStatus}
        </Badge>
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
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Order Operations</DropdownMenuLabel>
            <DropdownMenuItem asChild>
                <Link href={`/orders/${row.original.id}`}><ReceiptText className="mr-2 h-4 w-4" /> View Full Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href={`/orders/${row.original.id}/lineage`}><ArrowRightLeft className="mr-2 h-4 w-4" /> Trace Lineage</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href={`/orders/servicing?orderId=${row.original.id}`}><Settings className="mr-2 h-4 w-4" /> Modify / Reshop</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>Copy Order ID</DropdownMenuItem>
            {row.original.pnr && <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.pnr!)}>Copy PNR</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
    ),
  },
];

export default function OrdersPage() {
  const firestore = useFirestore();
  
  const ordersQuery = React.useMemo(() => {
    if (!firestore) return undefined;
    return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: liveOrders, loading } = useCollection(ordersQuery);
  
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const data = React.useMemo(() => {
    const orders = liveOrders ? (liveOrders as Order[]) : [];
    if (orders.length === 0 && !loading) return mockRecentOrders;
    return orders;
  }, [liveOrders, loading]);

  // ─── Table Filters Hook ───────────────────────────────────────────────────────
  const {
    searchText,
    setSearchText,
    activeFilters,
    setFilter,
    removeFilter,
    clearAll,
    activeChips,
    filtered,
  } = useTableFilters(data, {
    searchFields: ["customer", "id", "pnr", "email"],
    filterFields: { status: "", source: "", paymentStatus: "" },
  });

  // Custom filter function
  const getFilteredData = () => {
    let filteredData = [...data];
    
    // Apply search
    if (searchText) {
      filteredData = filteredData.filter(item => 
        item.customer?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.id?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.pnr?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeFilters.status && activeFilters.status !== "All") {
      filteredData = filteredData.filter(item => item.status === activeFilters.status);
    }
    
    // Apply source filter
    if (activeFilters.source && activeFilters.source !== "All") {
      filteredData = filteredData.filter(item => item.source === activeFilters.source);
    }
    
    // Apply payment status filter
    if (activeFilters.paymentStatus && activeFilters.paymentStatus !== "All") {
      filteredData = filteredData.filter(item => item.paymentStatus === activeFilters.paymentStatus);
    }
    
    return filteredData;
  };

  const displayOrders = getFilteredData();

  const table = useReactTable({
    data: displayOrders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  // Calculate KPIs
  const totalOrders = data.length;
  const fulfilledCount = data.filter(o => o.status === 'Fulfilled').length;
  const simulatedCount = data.filter(o => o.isSimulated).length;
  const totalValue = data.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      {/* <StatsCards cards={STATS} /> */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4 border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Volume</p>
                <ShoppingCart className="h-4 w-4 text-violet-600" />
            </div>
            <p className="text-3xl font-black mt-2 text-gray-900">{totalOrders}</p>
            <div className="mt-2 text-[10px] text-gray-500">Orders successfully converted.</div>
        </Card>
        <Card className="p-4 border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fulfilled</p>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-black mt-2 text-gray-900">{fulfilledCount}</p>
            <div className="mt-2 text-[10px] text-emerald-600 font-bold">Synchronized with Host PSS.</div>
        </Card>
        <Card className="p-4 border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Simulated</p>
                <MonitorDot className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-3xl font-black mt-2 text-gray-900">{simulatedCount}</p>
            <div className="mt-2 text-[10px] text-indigo-600 font-bold">Generated via Offer Composer.</div>
        </Card>
        <Card className="p-4 border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pipeline Value</p>
                <CreditCard className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-3xl font-black mt-2 text-gray-900">${totalValue.toLocaleString()}</p>
            <div className="mt-2 text-[10px] text-gray-500 font-medium">Gross retailing revenue.</div>
        </Card>
      </div>

      <TableFilterBar
        searchText={searchText}
        onSearchChange={setSearchText}
        searchPlaceholder="Search by ID, Customer, PNR, or Email..."
        dropdowns={[
          {
            key: "status",
            label: "Lifecycle State",
            options: STATUS_OPTIONS,
            value: activeFilters.status ?? "All",
            onChange: (v) => setFilter("status", v),
          },
          {
            key: "source",
            label: "Touchpoint",
            options: SOURCE_OPTIONS,
            value: activeFilters.source ?? "All",
            onChange: (v) => setFilter("source", v),
          },
          {
            key: "paymentStatus",
            label: "Payment State",
            options: PAYMENT_OPTIONS,
            value: activeFilters.paymentStatus ?? "All",
            onChange: (v) => setFilter("paymentStatus", v),
          },
        ]}
        activeChips={activeChips}
        onRemoveChip={(k) => removeFilter(k as keyof any)}
        onClearAll={clearAll}
      />

      {/* KPI Cards */}
    

      <Card className="border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
         <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-gray-900">Retailing Conversion Queue</CardTitle>
              <CardDescription className="mt-0.5 text-xs text-gray-400">Live real-time trace of ecosystem transactions across Web, Mobile, and SITA touchpoints.</CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              <Button variant="outline" asChild><Link href="/orders/delivery"><Truck className="mr-2 h-4 w-4" /> Fulfillment Queue</Link></Button>
              <Button asChild><Link href="/offer-composer"><MonitorDot className="mr-2 h-4 w-4" /> Simulated Touchpoint</Link></Button>
            </div>
          </div>

        </CardHeader>
        <CardContent className="pt-2">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-gray-200 hover:bg-gray-100">
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={columns.length} className="h-64 text-center"><div className="flex flex-col items-center gap-2"><Loader2 className="h-8 w-8 animate-spin text-violet-600/40" /><p className="text-xs text-gray-400">Streaming conversion data...</p></div></TableCell></TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="transition-colors duration-100 hover:bg-violet-50/60 cursor-default">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3.5">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={columns.length} className="h-64 text-center py-20"><div className="flex flex-col items-center gap-2 opacity-50"><AlertCircle className="h-12 w-12 text-gray-400" /><p className="font-bold text-gray-500">No orders matched the current filters.</p></div></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
              <div className="text-xs text-gray-500 font-medium">
                  Showing {table.getRowModel().rows.length} of {displayOrders.length} transactions.
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}