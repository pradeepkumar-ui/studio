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
  Loader2,
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
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const mockOffers: Offer[] = [
  { id: 'OFF-001', name: 'Winter Flash Sale', scope: 'Market', offerType: 'Discount', currency: 'USD', rounding: 'Round Half-Up', criteria: 'Market: US, EU', effectiveDate: new Date('2024-12-01'), expiryDate: new Date('2024-12-20'), status: 'Active', version: 2, ttl: '00:10:00' },
  { id: 'OFF-002', name: 'Business Class Upgrade', scope: 'Brand', offerType: 'Fixed', currency: 'EUR', rounding: 'None', criteria: 'Brand: Premium', effectiveDate: new Date('2024-11-01'), expiryDate: new Date('2025-01-31'), status: 'Active', version: 1, ttl: '00:20:00' },
  { id: 'OFF-003', name: 'Early Bird 2025', scope: 'Airline', offerType: 'Discount', currency: 'GBP', rounding: 'Round Down', criteria: 'All', effectiveDate: new Date('2024-10-01'), expiryDate: new Date('2024-12-31'), status: 'Active', version: 3, ttl: '00:15:00' },
  { id: 'OFF-004', name: 'Mobile App Exclusive', scope: 'Channel', offerType: 'Discount', currency: 'USD', rounding: 'None', criteria: 'Channel: Mobile', effectiveDate: new Date('2024-11-15'), expiryDate: new Date('2024-11-30'), status: 'Draft', version: 1, ttl: '00:05:00' },
  { id: 'OFF-005', name: 'Summer Getaway', scope: 'Market', offerType: 'Fixed', currency: 'EUR', rounding: 'Round Half-Up', criteria: 'Market: EU', effectiveDate: new Date('2025-06-01'), expiryDate: new Date('2025-08-31'), status: 'Inactive', version: 1, ttl: '00:15:00' },
  { id: 'OFF-006', name: 'Last Minute Deals', scope: 'Market', offerType: 'Step', currency: 'USD', rounding: 'Round Half-Up', criteria: 'Departure < 72h', effectiveDate: new Date('2024-01-01'), expiryDate: new Date('2025-12-31'), status: 'Active', version: 5, ttl: '00:05:00' },
  { id: 'OFF-007', name: 'Corporate Traveler Discount', scope: 'Channel', offerType: 'Discount', currency: 'USD', rounding: 'None', criteria: 'Channel: TMC', effectiveDate: new Date('2024-01-01'), expiryDate: new Date('2024-12-31'), status: 'Active', version: 2, ttl: '01:00:00' },
  { id: 'OFF-008', name: 'Asia Pacific Promotion', scope: 'Market', offerType: 'Discount', currency: 'SGD', rounding: 'Round Half-Up', criteria: 'Market: APAC', effectiveDate: new Date('2025-02-01'), expiryDate: new Date('2025-04-30'), status: 'Draft', version: 1, ttl: '00:15:00' },
  { id: 'OFF-009', name: 'Black Friday Special', scope: 'Airline', offerType: 'Discount', currency: 'USD', rounding: 'None', criteria: 'All', effectiveDate: new Date('2024-11-28'), expiryDate: new Date('2024-11-29'), status: 'Expired', version: 1, ttl: '00:02:00' },
  { id: 'OFF-010', name: 'New Route Launch: NYC-TKY', scope: 'Market', offerType: 'Fixed', currency: 'JPY', rounding: 'Round Down', criteria: 'Route: JFK-HND', effectiveDate: new Date('2025-03-01'), expiryDate: new Date('2025-03-31'), status: 'Active', version: 1, ttl: '00:30:00' },
];


export default function OffersPage() {
  const firestore = useFirestore();
  // By default, we will use mock data for a faster prototype experience.
  // The useCollection hook is still here and can be re-enabled when needed.
  const [offers, setOffers] = useState(mockOffers);
  const { data: firestoreData, loading, error } = useCollection(firestore ? collection(firestore, 'offers') : undefined);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [filters, setFilters] = useState({ id: '', status: 'all' });
  const { toast } = useToast();
  
  // This effect can be enabled to switch to live Firestore data.
  // useEffect(() => {
  //   if (!loading && firestoreData) {
  //     const liveOffers = firestoreData.length > 0 ? firestoreData : mockOffers;
  //     setOffers(liveOffers as Offer[]);
  //   }
  // }, [firestoreData, loading]);

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

  const handleFormSubmit = async (data: Offer) => {
    if (!firestore) return;
    try {
      const offerData = {
        ...data,
        effectiveDate: Timestamp.fromDate(data.effectiveDate as Date),
        expiryDate: Timestamp.fromDate(data.expiryDate as Date),
      }
      if (editingOffer?.id) {
        const offerRef = doc(firestore, 'offers', editingOffer.id);
        await setDoc(offerRef, { ...offerData, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: "Offer Updated", description: `Offer ${data.name} has been successfully updated.` });
      } else {
        const newOffer = { ...offerData, version: 1, ttl: '00:15:00', createdAt: serverTimestamp() };
        await addDoc(collection(firestore, 'offers'), newOffer);
        toast({ title: "Offer Created", description: `Offer ${newOffer.name} has been successfully created.` });
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

  const handleDelete = async (offerId: string) => {
    if (!offerId || !firestore) return;
    try {
        await deleteDoc(doc(firestore, 'offers', offerId));
        toast({
          variant: 'destructive',
          title: 'Offer Deleted',
          description: `Offer with ID ${offerId} has been deleted.`,
        });
    } catch (e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "There was a problem with your request.",
        });
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({...prev, [name]: value}));
  };

  const handleStatusFilterChange = (value: string) => {
     setFilters(prev => ({...prev, status: value}));
  }

  const filteredOffers = offers ? offers.filter(offer => {
    const offerIdMatch = filters.id ? (offer.id ?? '').toLowerCase().includes(filters.id.toLowerCase()) : true;
    const statusMatch = filters.status === 'all' || offer.status === filters.status;
    return offerIdMatch && statusMatch;
  }) : [];

  const formatDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'PP');
    }
    // Check if it's a plain object with seconds and nanoseconds, a possible format from Firestore
    if (date && typeof date === 'object' && 'seconds' in date && 'nanoseconds' in date) {
      return format(new Date((date as Timestamp).seconds * 1000), 'PP');
    }
    if (date instanceof Date) {
      return format(date, 'PP');
    }
    return '';
  };

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
          {loading && (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
           )}
           {!loading && !error && (
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
                        {offer.effectiveDate && offer.expiryDate ? `${formatDate(offer.effectiveDate)} - ${formatDate(offer.expiryDate)}`: ''}
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
           )}
           {error && <p className="text-destructive">Error loading offers: {error.message}</p>}
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

    
