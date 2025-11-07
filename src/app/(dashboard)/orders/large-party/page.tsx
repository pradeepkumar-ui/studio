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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MoreHorizontal, PlusCircle, Download, Users, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LargePartyOrderForm, type LargePartyOrder } from '@/components/forms/large-party-order-form';

const kpiData = [
  { title: 'Total Group Orders', value: '285' },
  { title: 'Active Orders', value: '240' },
  { title: 'Pending Approval', value: '30' },
  { title: 'Total Passengers', value: '3,240' },
];

const mockGroupOrders: LargePartyOrder[] = [
    { id: 'GRP_92345', groupName: 'Corporate Training Batch 2025', leadPassenger: 'John Carter', totalPassengers: 26, paymentTerms: 'Deposit + Balance', fareType: 'Negotiated', status: 'Active', channel: 'B2B' },
    { id: 'GRP_92346', groupName: 'Summer Student Exchange', leadPassenger: 'Alice Johnson', totalPassengers: 45, paymentTerms: 'Full Payment', fareType: 'Published', status: 'Active', channel: 'Web' },
    { id: 'GRP_92347', groupName: 'Leisure Tour - Italy', leadPassenger: 'Michael Smith', totalPassengers: 15, paymentTerms: 'Deposit + Balance', fareType: 'Published', status: 'Pending Approval', channel: 'B2B' },
    { id: 'GRP_92348', groupName: 'Annual Sales Conference', leadPassenger: 'Sarah Chen', totalPassengers: 120, paymentTerms: 'Deposit + Balance', fareType: 'Negotiated', status: 'Active', channel: 'API' },
    { id: 'GRP_92349', groupName: 'Wedding Party - Hawaii', leadPassenger: 'David Miller', totalPassengers: 35, paymentTerms: 'Full Payment', fareType: 'Published', status: 'Fulfilled', channel: 'Web' },
];

export default function LargePartyOrdersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<LargePartyOrder | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (order: LargePartyOrder | null = null) => {
    setEditingOrder(order);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingOrder(null);
  };

  const handleFormSubmit = (data: LargePartyOrder) => {
    console.log(data);
    toast({
      title: editingOrder ? "Group Order Updated" : "Group Order Created",
      description: `Group order "${data.groupName}" has been saved.`,
    });
    handleDialogClose();
  }

  const getStatusBadgeVariant = (status: LargePartyOrder['status']) => {
    switch (status) {
        case 'Active': return 'default';
        case 'Pending Approval': return 'secondary';
        case 'Fulfilled': return 'outline';
        default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Large Party Order Console
          </h1>
          <p className="text-muted-foreground">
            Manage group and large-party bookings from quotation to fulfilment.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Audit</Button>
            <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Create Group Order</Button>
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
          <CardTitle>Group Orders</CardTitle>
          <CardDescription>
            A summary of all active and pending large-party bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name / ID</TableHead>
                <TableHead>Lead Passenger</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockGroupOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                      <div>{order.groupName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{order.id}</div>
                  </TableCell>
                  <TableCell>{order.leadPassenger}</TableCell>
                  <TableCell>{order.totalPassengers}</TableCell>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog(order)}>Manage Passengers</DropdownMenuItem>
                        <DropdownMenuItem>Split/Merge Order</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Cancel Group Order
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingOrder ? 'Edit Group Order' : 'Create New Group Order'}</DialogTitle>
            <DialogDescription>
                {editingOrder ? `Editing order for "${editingOrder.groupName}"` : 'Define a new large-party booking.'}
            </DialogDescription>
          </DialogHeader>
          <LargePartyOrderForm 
            order={editingOrder}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
