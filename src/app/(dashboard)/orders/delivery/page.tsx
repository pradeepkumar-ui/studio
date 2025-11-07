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
  { title: 'Active Deliveries', value: '1,230' },
  { title: 'Completed (24h)', value: '5,412' },
  { title: 'Failed (24h)', value: '23' },
  { title: 'SLA Success', value: '99.4%' },
];

type DeliveryStatus = 'Delivered' | 'Pending' | 'Failed' | 'In-Progress';

const mockDeliveries = [
  { deliveryId: 'DLV_45213', orderId: 'ORD_98765', channel: 'Email', service: 'E-Ticket', status: 'Delivered' as DeliveryStatus, timestamp: '1 min ago' },
  { deliveryId: 'DLV_45214', orderId: 'ORD_98765', channel: 'Partner API', service: 'Lounge Pass', status: 'Delivered' as DeliveryStatus, timestamp: '1 min ago' },
  { deliveryId: 'DLV_45215', orderId: 'ORD_98766', channel: 'SMS', service: 'Boarding Pass', status: 'In-Progress' as DeliveryStatus, timestamp: '3 mins ago' },
  { deliveryId: 'DLV_45216', orderId: 'ORD_98767', channel: 'Email', service: 'Itinerary', status: 'Failed' as DeliveryStatus, timestamp: '5 mins ago' },
  { deliveryId: 'DLV_45217', orderId: 'ORD_98768', channel: 'DCS', service: 'Seat Change', status: 'Delivered' as DeliveryStatus, timestamp: '8 mins ago' },
];

const getStatusBadgeVariant = (status: DeliveryStatus) => {
  switch (status) {
    case 'Delivered':
      return 'default';
    case 'In-Progress':
    case 'Pending':
      return 'secondary';
    case 'Failed':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
        case 'Delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'In-Progress':
        case 'Pending': return <Clock className="h-4 w-4 text-yellow-500" />;
        case 'Failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
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
            <CardTitle>Delivery Log</CardTitle>
            <CardDescription>Live feed of Order delivery jobs and their statuses.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Service / Channel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockDeliveries.map(item => (
                        <TableRow key={item.deliveryId}>
                            <TableCell className="font-mono">{item.orderId}</TableCell>
                            <TableCell>
                                <div>{item.service}</div>
                                <div className="text-xs text-muted-foreground">{item.channel}</div>
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
                                        <DropdownMenuItem disabled={item.status !== 'Failed'}>Retry Delivery</DropdownMenuItem>
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
