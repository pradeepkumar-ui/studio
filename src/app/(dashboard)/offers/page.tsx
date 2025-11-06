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
  MoreHorizontal,
  PlusCircle,
  BarChartHorizontal,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type Offer = {
  id: string;
  name: string;
  channel: string;
  conditions: string;
  status: 'Active' | 'Inactive' | 'Draft' | 'Expired';
};

const initialOffers: Offer[] = [
  {
    id: 'OFF-001',
    name: 'Summer Getaway Sale',
    channel: 'Website, Mobile App',
    conditions: '20% off Economy on NYC-MIA for travel in July.',
    status: 'Active',
  },
  {
    id: 'OFF-002',
    name: 'Business Class Upgrade',
    channel: 'All Channels',
    conditions: 'Complimentary upgrade on trans-Atlantic routes.',
    status: 'Active',
  },
  {
    id: 'OFF-003',
    name: 'Early Bird Europe',
    channel: 'Website',
    conditions: '15% off bookings to Europe made 90+ days in advance.',
    status: 'Draft',
  },
  {
    id: 'OFF-004',
    name: 'Last Minute Deals',
    channel: 'Mobile App',
    conditions: 'Up to 30% off flights departing within 48 hours.',
    status: 'Active',
  },
  {
    id: 'OFF-005',
    name: 'Holiday Special',
    channel: 'All Channels',
    conditions: '10% off all routes for Christmas period.',
    status: 'Expired',
  },
];

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const { toast } = useToast();

  const handleSimulate = () => {
    toast({
      title: 'Simulation Engine Initialized',
      description: 'Running multi-scenario offer simulations...',
    });
    setTimeout(() => {
      toast({
        title: 'Simulation Complete',
        description: 'Optimal offer strategies have been identified.',
      });
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Offer Management
          </h1>
          <p className="text-muted-foreground">
            Govern the creation, simulation, optimisation, and publication of retail offers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSimulate}>
            <BarChartHorizontal className="mr-2" />
            Run Simulation
          </Button>
          <Button>
            <PlusCircle className="mr-2" />
            Create Offer
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active & Upcoming Offers</CardTitle>
          <CardDescription>
            Monitor and manage all published retail offers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">{offer.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        offer.status === 'Active'
                          ? 'default'
                          : offer.status === 'Draft'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {offer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{offer.channel}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {offer.conditions}
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Performance</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className={offer.status === 'Active' ? '' : 'text-destructive'}>
                          {offer.status === 'Active' ? 'Deactivate' : 'Activate'}
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
