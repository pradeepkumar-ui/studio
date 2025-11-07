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
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
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
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

const mockChannels: Channel[] = [
    { id: 'CH-001', name: 'Airline Website', status: 'Active', fareBrand: 'Public Fares', campaigns: 5 },
    { id: 'CH-002', name: 'TMC Portal', status: 'Active', fareBrand: 'Negotiated Fares', campaigns: 2 },
    { id: 'CH-003', name: 'GDS - Sabre', status: 'Active', fareBrand: 'All Brands', campaigns: 0 },
    { id: 'CH-004', name: 'GDS - Amadeus', status: 'Active', fareBrand: 'All Brands', campaigns: 0 },
    { id: 'CH-005', name: 'Mobile App', status: 'Active', fareBrand: 'Public Fares', campaigns: 3 },
    { id: 'CH-006', name: 'NDC API', status: 'Active', fareBrand: 'All Brands', campaigns: 10 },
    { id: 'CH-007', name: 'OTA - Expedia', status: 'Inactive', fareBrand: 'Public Fares', campaigns: 0 },
    { id: 'CH-008', name: 'Corporate Booker', status: 'Active', fareBrand: 'Corporate Fares', campaigns: 8 },
    { id: 'CH-009', name: 'Call Center', status: 'Active', fareBrand: 'All Brands', campaigns: 1 },
    { id: 'CH-010', name: 'Affiliate Network', status: 'Inactive', fareBrand: 'Public Fares', campaigns: 0 },
];

export default function ChannelsPage() {
  const firestore = useFirestore();
  const { data: channelsCollection, loading, error } = useCollection(firestore ? collection(firestore, 'channels') : undefined);
  
  const channels = channelsCollection ? channelsCollection as Channel[] : [];
  const displayChannels = channels.length > 0 ? channels : mockChannels;

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

  const handleFormSubmit = async (data: Channel) => {
    if (!firestore) return;

    try {
      if (editingChannel?.id) {
        const channelRef = doc(firestore, 'channels', editingChannel.id);
        await setDoc(channelRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({
          title: 'Channel Updated',
          description: `Channel "${data.name}" has been successfully updated.`,
        });
      } else {
        await addDoc(collection(firestore, 'channels'), { ...data, campaigns: 0, createdAt: serverTimestamp() });
        toast({
          title: 'Channel Created',
          description: `Channel "${data.name}" has been successfully created.`,
        });
      }
    } catch (e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "There was a problem with your request.",
        });
    }

    handleDialogClose();
  };
  
  const toggleStatus = async (channel: Channel) => {
    if (!firestore) return;
    const newStatus = channel.status === 'Active' ? 'Inactive' : 'Active';
    const channelRef = doc(firestore, 'channels', channel.id!);
    try {
        await setDoc(channelRef, { status: newStatus }, { merge: true });
        toast({
            title: `Channel ${newStatus === 'Active' ? 'Activated' : 'Deactivated'}`,
            description: `"${channel.name}" is now ${newStatus.toLowerCase()}.`
        });
    } catch (e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "Could not update channel status.",
        });
    }
  }

  const handleDelete = async (channelId: string) => {
    if (!channelId || !firestore) return;
    try {
      await deleteDoc(doc(firestore, 'channels', channelId));
      toast({
        variant: 'destructive',
        title: 'Channel Deleted',
        description: 'The channel has been successfully deleted.',
      });
    } catch (e: any) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: e.message || 'Could not delete the channel.',
      });
    }
  };

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
            {loading && displayChannels.length === 0 && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {displayChannels.length > 0 && !error && (
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
                  {displayChannels.map((channel) => (
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
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(channel.id!)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {error && <p className="text-destructive">Error loading channels: {error.message}</p>}
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
