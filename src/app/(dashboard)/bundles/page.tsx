
'use client';

import { useState, useMemo } from 'react';
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
import { MoreHorizontal, PlusCircle, Loader2, Bot, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BundleForm, type Bundle } from '@/components/forms/bundle-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const mockOffers: Bundle[] = [
    { id: 'BUN-001', name: 'Business Saver+', category: 'Normal', description: 'Front seat, 1 checked bag, and a meal.', status: 'Published', scope: { brand: 'Flex, Premium', route: 'All', channel: 'Direct, TMC' }, components: { seat: 'Front', baggage: '23kg', meal: 'Any' }, pricingStrategy: 'Percent Discount', discount: 15, itemCount: 3, source: 'Manual' },
    { id: 'BUN-002', name: 'Family Pack', category: 'Normal', description: 'Adjacent seats, extra baggage, and child meals.', status: 'Published', scope: { brand: 'Economy Saver', route: 'JFK-MIA', channel: 'Web' }, components: { seat: 'Adjacent', baggage: '15kg, 2', meal: 'Child' }, pricingStrategy: 'Fixed Discount', discount: 50, itemCount: 3, source: 'Manual' },
    { id: 'BUN-003', name: 'Weekend Getaway', category: 'Promotional', description: 'Late checkout, priority boarding.', status: 'Draft', scope: { route: 'JFK-MIA', channel: 'Direct' }, components: { other: 'Hotel(Late Checkout), Boarding(Priority)' }, pricingStrategy: 'Absolute Price', discount: 75, itemCount: 2, source: 'Manual' },
    { id: 'BUN-004', name: 'Long Haul Comfort', category: 'Normal', description: 'Extra legroom seat, amenity kit, and Wi-Fi.', status: 'Published', scope: { route: 'Duration > 6h' }, components: { seat: 'Legroom', other: 'Amenity Kit, Wi-Fi(Unlimited)' }, pricingStrategy: 'Percent Discount', discount: 20, itemCount: 3, source: 'Manual' },
    { id: 'BUN-005', name: 'Disruption Recovery Pack', category: 'Disruption', description: 'Lounge access, meal voucher, and hotel credit.', status: 'Published', scope: { route: 'All' }, components: { other: 'Lounge, Meal Voucher, Hotel Credit' }, pricingStrategy: 'Absolute Price', discount: 0, itemCount: 3, source: 'Manual' },
    { id: 'BUN-006', name: 'Flexi Traveler', category: 'Normal', description: 'Flight change waiver and seat selection.', status: 'Published', scope: { brand: 'Economy Flex' }, components: { other: 'Flexibility(Change)', seat: 'Any' }, pricingStrategy: 'Absolute Price', discount: 99, itemCount: 2, source: 'AI' },
    { id: 'BUN-007', name: 'Holiday Special', category: 'Promotional', description: 'Extra bag and festive meal.', status: 'Published', scope: { route: 'All', channel: 'Web, Mobile' }, components: { baggage: '23kg', meal: 'Festive' }, pricingStrategy: 'Fixed Discount', discount: 25, itemCount: 2, source: 'AI' },
    { id: 'BUN-008', name: 'TMC Recovery Bundle', category: 'Disruption', description: 'Lounge access, fast-track security, chauffeur.', status: 'Archived', scope: { channel: 'TMC' }, components: { other: 'Lounge, Security(Fast), Chauffeur' }, pricingStrategy: 'Absolute Price', discount: 0, itemCount: 3, source: 'Manual' },
];


export default function BundlesPage() {
  const firestore = useFirestore();
  const bundlesQuery = useMemo(() => firestore ? collection(firestore, 'bundles') : undefined, [firestore]);
  const { data: bundlesCollection, loading, error } = useCollection(bundlesQuery);
  
  const displayOffers = useMemo(() => {
    if (loading) return mockOffers;
    if (bundlesCollection && bundlesCollection.length > 0) {
      return bundlesCollection as Bundle[];
    }
    return mockOffers;
  }, [bundlesCollection, loading]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (bundle: Bundle | null = null) => {
    setEditingBundle(bundle);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingBundle(null);
  };

  const handleFormSubmit = async (data: Bundle) => {
    if (!firestore) return;
    try {
      const itemCount = (data.components ? Object.values(data.components).filter(Boolean).length : 0) + (data.promotions ? Object.values(data.promotions).filter(Boolean).length : 0);
      
      const bundleData = { 
        ...data, 
        itemCount,
        source: data.source || 'Manual',
      };

      if (editingBundle?.id) {
        const bundleRef = doc(firestore, 'bundles', editingBundle.id);
        await setDoc(bundleRef, { ...bundleData, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Offer Updated', description: `Offer "${data.name}" has been updated.` });
      } else {
        await addDoc(collection(firestore, 'bundles'), { ...bundleData, createdAt: serverTimestamp() });
        toast({ title: 'Offer Created', description: `Offer "${data.name}" has been created.` });
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

  const getStatusBadgeVariant = (status: Bundle['status']) => {
    switch (status) {
      case 'Published':
        return 'default';
      case 'Draft':
        return 'secondary';
      case 'Archived':
        return 'outline';
    }
  };

  const formatPricing = (offer: Bundle) => {
    switch (offer.pricingStrategy) {
      case 'Absolute Price':
        return `$${offer.discount.toFixed(2)}`;
      case 'Fixed Discount':
        return `-$${offer.discount.toFixed(2)}`;
      case 'Percent Discount':
        return `${offer.discount}% Off`;
      default:
        return 'N/A';
    }
  }

  const getScopeString = (scope: Bundle['scope']) => {
    if (!scope) return 'N/A';
    const parts = [];
    if (scope.brand) parts.push(`Brand: ${scope.brand}`);
    if (scope.channel) parts.push(`Channel: ${scope.channel}`);
    if (scope.route) parts.push(`Route: ${scope.route}`);
    return parts.join('; ') || 'All';
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Bundle Studio and Offer Creation</h1>
          <p className="text-muted-foreground">
            Create, manage, and price ancillary bundles and offers.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2" />
          Create Offer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offers</CardTitle>
          <CardDescription>
            Manage all ancillary bundles and their rules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (!bundlesCollection || bundlesCollection.length === 0) && (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
           )}
           {!loading && displayOffers.length > 0 && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOffers.map((bundle) => (
                  <TableRow key={bundle.id}>
                    <TableCell className="font-medium">{bundle.name}</TableCell>
                     <TableCell>
                      <Badge variant="outline">{bundle.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(bundle.status)}>
                        {bundle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        <span className="text-xs">{getScopeString(bundle.scope)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{bundle.itemCount}</TableCell>
                    <TableCell>
                        <Badge variant={bundle.pricingStrategy === 'Absolute Price' ? 'default' : 'secondary'}>
                            {formatPricing(bundle)}
                        </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {bundle.source === 'AI' ? <Bot /> : <User />}
                        <span>{bundle.source || 'Manual'}</span>
                      </div>
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
                          <DropdownMenuItem onClick={() => handleOpenDialog(bundle)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>View Performance</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Archive
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingBundle ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
            <DialogDescription>
              {editingBundle ? `Editing offer "${editingBundle.name}".` : 'Define the components, rules, and pricing for a new offer.'}
            </DialogDescription>
          </DialogHeader>
          <BundleForm
            bundle={editingBundle}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

    