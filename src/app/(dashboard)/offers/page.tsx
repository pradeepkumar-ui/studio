'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { OfferForm, type Offer } from '@/components/forms/offer-form';

const initialOffers: Offer[] = [
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
    notes: '20% off Economy on NYC-MIA for travel in July.'
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
    notes: ''
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
    notes: ''
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
    notes: 'Only on mobile app'
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
    notes: ''
  },
];

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
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
      setOffers(offers.map((o) => (o.id === editingOffer.id ? { ...o, ...data } : o)));
      toast({ title: "Offer Updated", description: `Offer ${data.name} has been successfully updated.` });
    } else {
      const newOffer = { ...data, id: `OFF-${String(offers.length + 1).padStart(3, '0')}` };
      setOffers([...offers, newOffer]);
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Offer Configuration
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
          <CardTitle>Offer Configurations</CardTitle>
          <CardDescription>
            Manage all published retail offers, promotions, and rules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Effective Dates</TableHead>
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
                  <TableCell>{offer.offerType}</TableCell>
                  <TableCell>{offer.scope}</TableCell>
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
