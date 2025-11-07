'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Download, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type LoyaltyOrder = {
    id: string;
    memberId: string;
    type: 'Award' | 'Upgrade' | 'Ancillary';
    pointsUsed: number;
    cashPortion: number;
    status: 'Confirmed' | 'Pending' | 'Reversed';
    date: string;
};

const kpiData = [
    { title: 'Loyalty Orders', value: '2,310' },
    { title: 'Points Redeemed', value: '28.7M' },
    { title: 'Points Reversed', value: '0.9M' },
    { title: 'Pending Sync', value: '12' },
];

const mockLoyaltyOrders: LoyaltyOrder[] = [
    { id: 'ORD_88452', memberId: 'FFP_34521', type: 'Upgrade', pointsUsed: 25000, cashPortion: 80.00, status: 'Confirmed', date: '2025-10-30' },
    { id: 'ORD_88451', memberId: 'FFP_98765', type: 'Award', pointsUsed: 55000, cashPortion: 45.50, status: 'Confirmed', date: '2025-10-30' },
    { id: 'ORD_88450', memberId: 'FFP_12345', type: 'Ancillary', pointsUsed: 5000, cashPortion: 0.00, status: 'Pending', date: '2025-10-29' },
    { id: 'ORD_88449', memberId: 'FFP_67890', type: 'Award', pointsUsed: 120000, cashPortion: 150.00, status: 'Reversed', date: '2025-10-28' },
    { id: 'ORD_88448', memberId: 'FFP_54321', type: 'Upgrade', pointsUsed: 15000, cashPortion: 0.00, status: 'Confirmed', date: '2025-10-28' },
];


export default function LoyaltyPage() {
  const { toast } = useToast();

  const getStatusBadgeVariant = (status: LoyaltyOrder['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Reversed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Loyalty Orders Console
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor Orders redeemed with loyalty points.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><RotateCcw className="mr-2 h-4 w-4" /> Refund/Reinstate</Button>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Audit</Button>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Create Award Order</Button>
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
          <CardTitle>Loyalty Transactions</CardTitle>
          <CardDescription>
            A summary of the most recent loyalty award redemptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Points Used</TableHead>
                <TableHead>Cash Portion</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLoyaltyOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium font-mono">{order.id}</TableCell>
                  <TableCell className="font-mono">{order.memberId}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.type}</Badge>
                  </TableCell>
                  <TableCell>{order.pointsUsed.toLocaleString()}</TableCell>
                  <TableCell>{order.cashPortion > 0 ? `$${order.cashPortion.toFixed(2)}` : '-'}</TableCell>
                   <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem>View Order Details</DropdownMenuItem>
                        <DropdownMenuItem>View Member Profile</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Cancel Redemption
                        </DropdownMenuItem>
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
