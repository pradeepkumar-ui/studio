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
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Grid, BarChart, Text } from '@tremor/react';
import { KpiCard } from '@/components/analytics/kpi-card';

const kpiData = [
  {
    title: 'Offers Created (24h)',
    metric: '12,553',
    progress: 15.9,
    target: '10,000',
    deltaType: 'moderateIncrease',
  },
  {
    title: 'Conversion Rate',
    metric: '15.1%',
    progress: 5.2,
    target: '12%',
    deltaType: 'moderateIncrease',
  },
  {
    title: 'Ancillary Attach Rate',
    metric: '28.4%',
    progress: -2.1,
    target: '30%',
    deltaType: 'moderateDecrease',
  },
  {
    title: 'Revenue Today',
    metric: '$1.2M',
    progress: 8.2,
    target: '$1.1M',
    deltaType: 'moderateIncrease',
  },
];

const funnelData = [
  { name: 'Created', value: 124553 },
  { name: 'Selected (Locked)', value: 83219 },
  { name: 'Validated', value: 79004 },
  { name: 'Converted', value: 18771 },
  { name: 'Expired', value: 31992 },
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

const chartFormatter = (number: number) =>
  `${Intl.NumberFormat('us').format(number).toString()}`;

const getStatusBadgeVariant = (status: string) => {
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

      <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
        {kpiData.map((item) => (
          <KpiCard key={item.title} item={item} />
        ))}
      </Grid>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              A summary of the most recent orders placed across all channels.
            </CardDescription>
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
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(order.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Offer Funnel (Last 30 days)</CardTitle>
            <Text>Offers moving through lifecycle stages</Text>
          </CardHeader>
          <CardContent>
            <BarChart
              className="mt-6"
              data={funnelData}
              index="name"
              categories={['value']}
              colors={['blue']}
              valueFormatter={chartFormatter}
              yAxisWidth={80}
              layout="vertical"
              showLegend={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
