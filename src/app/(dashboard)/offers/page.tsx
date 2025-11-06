'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
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
import {
  MoreHorizontal,
  PlusCircle,
  BarChartHorizontal,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { OfferForm, type Offer } from '@/components/forms/offer-form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const initialOffers: (Offer & { version: number, ttl: string })[] = [
  {
    id: 'OFF-001',
    name: 'Summer Getaway Sale',
    status: 'Active',
    scope: 'Market',
    offerType: 'Discount',
    currency: 'USD',
    rounding: 'Round Half-Up',
    criteria: 'Channel: Web, POS: US',
    effectiveDate: new Date('2024-07-01'),
    expiryDate: new Date('2024-07-31'),
    notes: '20% off Economy on NYC-MIA for travel in July.',
    version: 4,
    ttl: '00:08:22'
  },
  {
    id: 'OFF-002',
    name: 'Business Class Upgrade',
    status: 'Active',
    scope: 'Brand',
    offerType: 'Fixed',
    currency: 'USD',
    rounding: 'None',
    criteria: 'Complimentary upgrade on trans-Atlantic routes.',
    effectiveDate: new Date('2024-06-01'),
    expiryDate: new Date('2024-08-31'),
    notes: '',
    version: 2,
    ttl: '00:14:10'
  },
  {
    id: 'OFF-003',
    name: 'Early Bird Europe',
    status: 'Draft',
    scope: 'Airline',
    offerType: 'Discount',
    currency: 'EUR',
    rounding: 'Round Half-Up',
    criteria: '15% off bookings to Europe made 90+ days in advance.',
    effectiveDate: new Date('2024-09-01'),
    expiryDate: new Date('2024-12-31'),
    notes: '',
    version: 1,
    ttl: 'N/A'
  },
  {
    id: 'OFF-004',
    name: 'Last Minute Deals',
    status: 'Active',
    scope: 'Channel',
    offerType: 'Discount',
    currency: 'USD',
    rounding: 'Round Down',
    criteria: 'Up to 30% off flights departing within 48 hours.',
    effectiveDate: new Date('2024-01-01'),
    expiryDate: new Date('2024-12-31'),
    notes: 'Only on mobile app',
    version: 7,
    ttl: '00:02:45'
  },
  {
    id: 'OFF-005',
    name: 'Holiday Special',
    status: 'Expired',
    scope: 'Airline',
    offerType: 'Discount',
    currency: 'USD',
    rounding: 'Round Half-Up',
    criteria: '10% off all routes for Christmas period.',
    effectiveDate: new Date('2023-12-01'),
    expiryDate: new Date('2023-12-26'),
    notes: '',
    version: 3,
    ttl: 'Expired'
  },
];

export default function OffersPage() {
  const [offers, setOffers] = useState<(Offer & { version: number; ttl: string; })[]>(initialOffers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [filters, setFilters] = useState({ id: '', status: 'all' });
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
  
  const handleOpenDialog = (offer: Offer | null = null) => {
    setEditingOffer(offer);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingOffer(null);
  };

  const handleFormSubmit = (data: Offer) => {
    if (editingOffer) {
      setOffers(offers.map((o) => (o.id === editingOffer.id ? { ...o, ...data, version: o.version + 1, ttl: '00:15:00' } : o)));
      toast({ title: "Offer Updated", description: `Offer ${data.name} has been successfully updated.` });
    } else {
      const newOffer = { ...data, id: `OFF-${String(offers.length + 1).padStart(3, '0')}`, version: 1, ttl: '00:15:00' };
      setOffers([newOffer, ...offers]);
      toast({ title: "Offer Created", description: `Offer ${newOffer.name} has been successfully created.` });
    }
    handleDialogClose();
  };

  const handleDelete = (offerId: string) => {
    setOffers(offers.filter(o => o.id !== offerId));
    toast({
      variant: 'destructive',
      title: 'Offer Deleted',
      description: `Offer with ID ${offerId} has been deleted.`,
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({...prev, [name]: value}));
  };

  const handleStatusFilterChange = (value: string) => {
     setFilters(prev => ({...prev, status: value}));
  }

  const filteredOffers = offers.filter(offer => {
    return (
      (filters.id ? offer.id!.toLowerCase().includes(filters.id.toLowerCase()) : true) &&
      (filters.status === 'all' || offer.status === filters.status)
    )
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Offer Catalogue
          </h1>
          <p className="text-muted-foreground">
            Create, govern, and distribute retail offers and promotions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSimulate}>
            <BarChartHorizontal className="mr-2" />
            Run Simulation
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            Create Offer
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
           <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="id"
                placeholder="Filter by Offer ID..."
                value={filters.id}
                onChange={handleFilterChange}
                className="pl-9"
              />
            </div>
            <div className="w-48">
              <Select onValueChange={handleStatusFilterChange} defaultValue={filters.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>TTL</TableHead>
                <TableHead>Effective Dates</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOffers.map((offer) => (
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
                  <TableCell>v{offer.version}</TableCell>
                  <TableCell>{offer.ttl}</TableCell>
                  <TableCell>
                    {format(offer.effectiveDate, 'PP')} - {format(offer.expiryDate, 'PP')}
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
                        <DropdownMenuItem onClick={() => handleOpenDialog(offer)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Performance</DropdownMenuItem>
                         <DropdownMenuItem asChild>
                           <Link href={`/offers/${offer.id}/lineage`}>View Lineage</Link>
                         </DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(offer.id!)}>
                          Delete
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
            <DialogTitle>{editingOffer ? 'Edit Offer Configuration' : 'Create New Offer Configuration'}</DialogTitle>
            <DialogDescription>
              {editingOffer ? `Editing configuration for "${editingOffer.name}".` : 'Enter the details for the new offer configuration.'}
            </DialogDescription>
          </DialogHeader>
          <OfferForm
            offer={editingOffer}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>

    </div>
  );
}
