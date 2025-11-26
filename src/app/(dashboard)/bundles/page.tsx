
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
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BundleForm, type Bundle } from '@/components/forms/bundle-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const mockBundles: Bundle[] = [
  { id: 'BUN-001', name: 'Business Saver+', description: 'Front seat, 1 checked bag, and a meal.', status: 'Published', scope: { brand: 'Flex, Premium' }, components: { seat: 'Front', baggage: '23kg', meal: 'Any'}, pricingStrategy: 'Percent Discount', discount: 15, itemCount: 3 },
  { id: 'BUN-002', name: 'Family Pack', description: 'Adjacent seats, extra baggage, and child meals.', status: 'Published', scope: { brand: 'ADT, CHD' }, components: { seat: 'Adjacent', baggage: '15kg, 2', meal: 'Child' }, pricingStrategy: 'Fixed Discount', discount: 50, itemCount: 3 },
  { id: 'BUN-003', name: 'Weekend Getaway', description: 'Late checkout, priority boarding.', status: 'Draft', scope: { route: 'JFK-MIA', channel: 'Direct' }, components: { other: 'Hotel(Late Checkout), Boarding(Priority)' }, pricingStrategy: 'Absolute Price', discount: 75, itemCount: 2 },
  { id: 'BUN-004', name: 'Long Haul Comfort', description: 'Extra legroom seat, amenity kit, and Wi-Fi.', status: 'Published', scope: { brand: 'Flight Duration > 6h' }, components: { seat: 'Legroom', other: 'Amenity Kit, Wi-Fi(Unlimited)' }, pricingStrategy: 'Percent Discount', discount: 20, itemCount: 3 },
  { id: 'BUN-005', name: 'Flexi Traveler', description: 'Flight change waiver and seat selection.', status: 'Published', scope: { brand: 'Flex' }, components: { other: 'Flexibility(Change)', seat: 'Any' }, pricingStrategy: 'Absolute Price', discount: 99, itemCount: 2 },
  { id: 'BUN-006', name: 'TMC Premium Package', description: 'Lounge access, fast-track security, chauffeur.', status: 'Archived', scope: { channel: 'TMC' }, components: { other: 'Lounge, Security(Fast), Chauffeur' }, pricingStrategy: 'Absolute Price', discount: 250, itemCount: 3 },
  { id: 'BUN-007', name: 'Ancillary Starter', description: 'A basic package for testing.', status: 'Draft', scope: {}, components: { baggage: '15kg' }, pricingStrategy: 'Fixed Discount', discount: 5, itemCount: 1 },
  { id: 'BUN-008', name: 'Golfer\'s Paradise', description: 'Oversized baggage for golf clubs and a complimentary drink.', status: 'Published', scope: { route: 'DUB-FAO' }, components: { baggage: 'Oversized', other: 'Drink(Any)' }, pricingStrategy: 'Absolute Price', discount: 60, itemCount: 2 },
  { id: 'BUN-009', name: 'Ski Enthusiast', description: 'Ski equipment carriage and winter meal.', status: 'Published', scope: { route: 'LHR-GVA' }, components: { baggage: 'Ski', meal: 'Winter' }, pricingStrategy: 'Percent Discount', discount: 10, itemCount: 2 },
  { id: 'BUN-010', name: 'Eco-Traveler Pack', description: 'Carbon offset and a digital magazine subscription.', status: 'Published', scope: {}, components: { other: 'Carbon Offset, Magazine(Digital)' }, pricingStrategy: 'Absolute Price', discount: 15, itemCount: 2 },
];


export default function BundlesPage() {
  const firestore = useFirestore();
  const { data: bundlesCollection, loading, error } = useCollection(firestore ? collection(firestore, 'bundles') : undefined);
  
  const [bundles, setBundles] = useState<Bundle[]>(mockBundles);
  
  const displayBundles = loading ? mockBundles : (bundlesCollection ? bundlesCollection as Bundle[] : bundles);

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
      const itemCount = Object.values(data.components || {}).filter(Boolean).length;
      const bundleData = { 
        ...data, 
        itemCount
      };

      if (editingBundle?.id) {
        const bundleRef = doc(firestore, 'bundles', editingBundle.id);
        await setDoc(bundleRef, { ...bundleData, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Bundle Updated', description: `Bundle "${data.name}" has been updated.` });
      } else {
        await addDoc(collection(firestore, 'bundles'), { ...bundleData, createdAt: serverTimestamp() });
        toast({ title: 'Bundle Created', description: `Bundle "${data.name}" has been created.` });
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
          Create Bundle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bundles</CardTitle>
          <CardDescription>
            Manage all ancillary bundles and their rules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(loading && displayBundles.length === 0) && (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
           )}
           {displayBundles.length > 0 && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayBundles.map((bundle) => (
                  <TableRow key={bundle.id}>
                    <TableCell className="font-medium">{bundle.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(bundle.status)}>
                        {bundle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {bundle.scope?.brand && <Badge variant="outline">Brand: {bundle.scope.brand}</Badge>}
                        {bundle.scope?.channel && <Badge variant="outline">Channel: {bundle.scope.channel}</Badge>}
                        {bundle.scope?.route && <Badge variant="outline">Route: {bundle.scope.route}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{bundle.itemCount}</TableCell>
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
           {error && <p className="text-destructive">Error loading bundles: {error.message}</p>}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingBundle ? 'Edit Bundle' : 'Create New Bundle'}</DialogTitle>
            <DialogDescription>
              {editingBundle ? `Editing bundle "${editingBundle.name}".` : 'Define the components, rules, and pricing for a new bundle.'}
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
