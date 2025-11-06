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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ChannelForm, type Channel } from '@/components/forms/channel-form';

const initialChannels: Channel[] = [
  {
    id: 'WEB',
    name: 'Airline Website',
    status: 'Active',
    fareBrand: 'All Brands',
    campaigns: 5,
  },
  {
    id: 'APP',
    name: 'Mobile App',
    status: 'Active',
    fareBrand: 'All Brands',
    campaigns: 5,
  },
  {
    id: 'GDS',
    name: 'Global Distribution System (GDS)',
    status: 'Active',
    fareBrand: 'Public Fares',
    campaigns: 2,
  },
  {
    id: 'API',
    name: 'Direct API',
    status: 'Inactive',
    fareBrand: 'Negotiated Fares',
    campaigns: 0,
  },
  {
    id: 'CORP',
    name: 'Corporate Booker Portal',
    status: 'Active',
    fareBrand: 'Contracted Fares',
    campaigns: 1,
  },
];

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (channel: Channel | null = null) => {
    setEditingChannel(channel);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingChannel(null);
  };

  const handleFormSubmit = (data: Channel) => {
    if (editingChannel) {
      setChannels(
        channels.map((c) => (c.id === editingChannel.id ? { ...c, ...data } : c))
      );
      toast({
        title: 'Channel Updated',
        description: `Channel "${data.name}" has been successfully updated.`,
      });
    } else {
      const newChannel = {
        ...data,
        id: data.name.toUpperCase().slice(0, 4) + channels.length,
        campaigns: 0,
      };
      setChannels([...channels, newChannel]);
      toast({
        title: 'Channel Created',
        description: `Channel "${newChannel.name}" has been successfully created.`,
      });
    }
    handleDialogClose();
  };
  
  const toggleStatus = (channel: Channel) => {
    const newStatus = channel.status === 'Active' ? 'Inactive' : 'Active';
    setChannels(channels.map(c => c.id === channel.id ? {...c, status: newStatus} : c));
    toast({
        title: `Channel ${newStatus === 'Active' ? 'Activated' : 'Deactivated'}`,
        description: `"${channel.name}" is now ${newStatus.toLowerCase()}.`
    })
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Channel Management
            </h1>
            <p className="text-muted-foreground">
              Define fare, ancillary, and campaign availability per channel.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            Create Channel
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Sales Channels</CardTitle>
            <CardDescription>
              Manage settings and availability for your sales channels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Default Fare Brand</TableHead>
                  <TableHead>Active Campaigns</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.map((channel) => (
                  <TableRow key={channel.id}>
                    <TableCell className="font-medium">{channel.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={channel.status === 'Active' ? 'default' : 'outline'}
                      >
                        {channel.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{channel.fareBrand}</TableCell>
                    <TableCell>{channel.campaigns}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleOpenDialog(channel)}>Edit</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => toggleStatus(channel)}>
                            Set to {channel.status === 'Active' ? 'Inactive' : 'Active'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>Manage Branding</DropdownMenuItem>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingChannel ? 'Edit Channel' : 'Create New Channel'}
            </DialogTitle>
            <DialogDescription>
              {editingChannel
                ? `Editing channel "${editingChannel.name}".`
                : 'Enter the details for the new sales channel.'}
            </DialogDescription>
          </DialogHeader>
          <ChannelForm
            channel={editingChannel}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
