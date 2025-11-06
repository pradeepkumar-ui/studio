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
import { Ticket, DollarSign, Handshake, PieChart, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const kpiData = [
  {
    title: 'Active Offers',
    value: '34',
    change: '+12.5%',
    icon: Ticket,
  },
  {
    title: 'Total Revenue (Month)',
    value: '$1.2M',
    change: '+8.2%',
    icon: DollarSign,
  },
  {
    title: 'Active Contracts',
    value: '18',
    change: '+2',
    icon: Handshake,
  },
  {
    title: 'Overall Utilisation',
    value: '76%',
    change: '-1.5%',
    icon: PieChart,
  },
];

const recentOrders = [
  {
    orderId: 'ORD-073',
    customer: 'Voyage Travel Co.',
    date: '2024-07-15',
    amount: 12500,
    status: 'Fulfilled',
  },
  {
    orderId: 'ORD-072',
    customer: 'Globex Corporation',
    date: '2024-07-15',
    amount: 8400,
    status: 'Fulfilled',
  },
  {
    orderId: 'ORD-071',
    customer: 'Jane Smith',
    date: '2024-07-14',
    amount: 450,
    status: 'Pending',
  },
  {
    orderId: 'ORD-070',
    customer: 'InnoTech Solutions',
    date: '2024-07-13',
    amount: 22000,
    status: 'Fulfilled',
  },
  {
    orderId: 'ORD-069',
    customer: 'Adventure Seekers',
    date: '2024-07-12',
    amount: 1800,
    status: 'Canceled',
  },
];

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Fulfilled': return 'default';
        case 'Pending': return 'secondary';
        case 'Canceled': return 'destructive';
        default: return 'outline';
    }
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Offers & Orders System. Here's a summary of current
          operations.
        </p>
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
              <p className="text-xs text-muted-foreground">{kpi.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>A summary of the most recent orders placed.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentOrders.map(order => (
                            <TableRow key={order.orderId}>
                                <TableCell className="font-medium">{order.orderId}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.amount)}</TableCell>
                                <TableCell><Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge></TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Order</DropdownMenuItem>
                                            <DropdownMenuItem>View Customer</DropdownMenuItem>
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
    </div>
  );
}
