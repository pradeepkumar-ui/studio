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
  PlusCircle,
  RotateCcw,
  DownloadCloud,
  Mail,
  MessageSquare,
  Webhook,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { CommunicationTemplateForm, type CommunicationTemplate } from '@/components/forms/communication-template-form';
import { useToast } from '@/hooks/use-toast';

const kpiData = [
  { title: 'Events Processed', value: '18,540' },
  { title: 'Delivered', value: '18,320' },
  { title: 'Failed', value: '220' },
  { title: 'Avg. Delivery Time', value: '0.8s' },
];

const channelStats = [
    { name: 'Email', percentage: 72, icon: Mail },
    { name: 'SMS', percentage: 20, icon: MessageSquare },
    { name: 'API', percentage: 8, icon: Webhook },
];

type Status = 'Delivered' | 'Pending' | 'Failed' | 'Opened';

const mockCommunications = [
    { id: 'MSG-001', orderId: 'ORD_7621', eventType: 'Order.Created', channel: 'Email', recipient: 'customer@example.com', status: 'Delivered' as Status, timestamp: '2 mins ago' },
    { id: 'MSG-002', orderId: 'ORD_7621', eventType: 'Order.Created', channel: 'SMS', recipient: '+1-555-123-4567', status: 'Delivered' as Status, timestamp: '2 mins ago' },
    { id: 'MSG-003', orderId: 'ORD_7622', eventType: 'Order.Shipped', channel: 'API', recipient: 'https://supplier.com/webhook', status: 'Delivered' as Status, timestamp: '5 mins ago' },
    { id: 'MSG-004', orderId: 'ORD_7623', eventType: 'Payment.Failed', channel: 'Email', recipient: 'user@example.net', status: 'Failed' as Status, timestamp: '10 mins ago' },
    { id: 'MSG-005', orderId: 'ORD_7624', eventType: 'Order.Created', channel: 'Email', recipient: 'another@example.com', status: 'Opened' as Status, timestamp: '15 mins ago' },
];

const getStatusBadgeVariant = (status: Status) => {
    switch (status) {
        case 'Delivered':
        case 'Opened':
            return 'default';
        case 'Pending':
            return 'secondary';
        case 'Failed':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function CommunicationPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CommunicationTemplate | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (template: CommunicationTemplate | null = null) => {
    setEditingTemplate(template);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTemplate(null);
  };

  const handleFormSubmit = (data: CommunicationTemplate) => {
    console.log(data);
    toast({
      title: editingTemplate ? "Template Updated" : "Template Created",
      description: `Template "${data.templateName}" has been saved.`,
    });
    handleDialogClose();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Order Communication Console
          </h1>
          <p className="text-muted-foreground">
            Manage templates, monitor delivery, and audit all order-related communications.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="mr-2" />
            Resend Failed
          </Button>
           <Button variant="outline">
            <DownloadCloud className="mr-2" />
            Export Audit
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            Create Template
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
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Communication Log</CardTitle>
                <CardDescription>Live feed of all outbound and pending communications.</CardDescription>
            </div>
             <div className="flex gap-4 items-center">
                {channelStats.map(stat => (
                    <div key={stat.name} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <stat.icon className="h-4 w-4" />
                        <span>{stat.name}: {stat.percentage}%</span>
                    </div>
                ))}
             </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockCommunications.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className="font-mono">{item.orderId}</TableCell>
                            <TableCell>{item.eventType}</TableCell>
                            <TableCell>{item.channel}</TableCell>
                            <TableCell className="font-mono text-xs">{item.recipient}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
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
                                        <DropdownMenuItem>View Message</DropdownMenuItem>
                                        <DropdownMenuItem>Resend</DropdownMenuItem>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Communication Template</DialogTitle>
            <DialogDescription>
              Define a new template for automated order communications.
            </DialogDescription>
          </DialogHeader>
          <CommunicationTemplateForm
            template={editingTemplate}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
