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

const initialChannels = [
  {
    name: 'Airline Website',
    id: 'WEB',
    status: 'Active',
    fareBrand: 'All Brands',
    campaigns: 5,
  },
  {
    name: 'Mobile App',
    id: 'APP',
    status: 'Active',
    fareBrand: 'All Brands',
    campaigns: 5,
  },
  {
    name: 'Global Distribution System (GDS)',
    id: 'GDS',
    status: 'Active',
    fareBrand: 'Public Fares',
    campaigns: 2,
  },
  {
    name: 'Direct API',
    id: 'API',
    status: 'Inactive',
    fareBrand: 'Negotiated Fares',
    campaigns: 0,
  },
  {
    name: 'Corporate Booker Portal',
    id: 'CORP',
    status: 'Active',
    fareBrand: 'Contracted Fares',
    campaigns: 1,
  },
];

export default function ChannelsPage() {
  const [channels, setChannels] = useState(initialChannels);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Channel Management</h1>
          <p className="text-muted-foreground">
            Define fare, ancillary, and campaign availability per channel.
          </p>
        </div>
        <Button onClick={() => alert('Create Channel form would appear here.')}>
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
                    <Badge variant={channel.status === 'Active' ? 'default' : 'outline'}>
                      {channel.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{channel.fareBrand}</TableCell>
                  <TableCell>{channel.campaigns}</TableCell>
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
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
  );
}
