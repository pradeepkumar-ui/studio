'use client';

import { useState } from 'react';
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
import {
  RotateCcw,
  DownloadCloud,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const kpiData = [
  { title: 'Orders Delivered (24h)', value: '5,412' },
  { title: 'Pending Delivery', value: '12' },
  { title: 'Delivery Failures', value: '3' },
  { title: 'SLA Success Rate', value: '99.8%' },
];

type DeliveryStatus = 'Delivered' | 'Pending' | 'Failed' | 'Partially Delivered';

const mockDeliveries = [
  { orderId: 'ORD_98765', customer: 'Voyage Travel Co.', status: 'Delivered' as DeliveryStatus, channels: 'Email, API', timestamp: '1 min ago' },
  { orderId: 'ORD_98766', customer: 'Jane Smith', status: 'Pending' as DeliveryStatus, channels: 'SMS, Email', timestamp: '3 mins ago' },
  { orderId: 'ORD_98767', customer: 'Globex Corp.', status: 'Failed' as DeliveryStatus, channels: 'Email', timestamp: '5 mins ago' },
  { orderId: 'ORD_98768', customer: 'InnoTech Solutions', status: 'Delivered' as DeliveryStatus, channels: 'GDS', timestamp: '8 mins ago' },
  { orderId: 'ORD_98769', customer: 'John Doe', status: 'Partially Delivered' as DeliveryStatus, channels: 'Email, API', timestamp: '12 mins ago' },
];

const getStatusBadgeVariant = (status: DeliveryStatus) => {
  switch (status) {
    case 'Delivered':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Failed':
      return 'destructive';
    case 'Partially Delivered':
      return 'outline';
    default:
      return 'outline';
  }
};

const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
        case 'Delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'Pending': return <Clock className="h-4 w-4 text-yellow-500" />;
        case 'Failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
        case 'Partially Delivered': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
}

export default function OrderDeliveryPage() {

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Order Delivery Console
          </h1>
          <p className="text-muted-foreground">
            Monitor and orchestrate the fulfilment of all confirmed Orders.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="mr-2" />
            Retry Failed
          </Button>
          <Button variant="outline">
            <DownloadCloud className="mr-2" />
            Export Delivery Logs
          </Button>
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
            <CardTitle>Order Delivery Queue</CardTitle>
            <CardDescription>Live feed of Order delivery jobs and their statuses.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Channels</TableHead>
                        <TableHead>Overall Status</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockDeliveries.map(item => (
                        <TableRow key={item.orderId}>
                            <TableCell className="font-mono">{item.orderId}</TableCell>
                            <TableCell>
                                <div>{item.customer}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-1">
                                {item.channels.split(', ').map(channel => (
                                    <Badge key={channel} variant="outline">{channel}</Badge>
                                ))}
                                </div>
                            </TableCell>
                             <TableCell>
                                <Badge variant={getStatusBadgeVariant(item.status)} className="gap-1 pl-1.5">
                                    {getStatusIcon(item.status)}
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{item.timestamp}</TableCell>
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
                                        <DropdownMenuItem>View Delivery Details</DropdownMenuItem>
                                        <DropdownMenuItem>View Order</DropdownMenuItem>
                                        <DropdownMenuItem disabled={item.status !== 'Failed' && item.status !== 'Partially Delivered'}>Retry All for Order</DropdownMenuItem>
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
  );
}
