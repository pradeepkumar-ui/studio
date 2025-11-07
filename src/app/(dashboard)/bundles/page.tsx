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
  { id: 'BUN-001', name: 'Business Saver+', description: 'Front seat, 1 checked bag, and a meal.', status: 'Published', scope: 'Brand: Flex, Premium', components: 'Seat(Front), Bag(23kg), Meal(Any)', pricingStrategy: 'Percent Discount', discount: 15, itemCount: 3 },
  { id: 'BUN-002', name: 'Family Pack', description: 'Adjacent seats, extra baggage, and child meals.', status: 'Published', scope: 'Passenger Type: ADT, CHD', components: 'Seat(Adjacent), Bag(15kg, 2), Meal(Child)', pricingStrategy: 'Fixed Discount', discount: 50, itemCount: 3 },
  { id: 'BUN-003', name: 'Weekend Getaway', description: 'Late checkout, priority boarding.', status: 'Draft', scope: 'Route: JFK-MIA, Day: Fri-Sun', components: 'Hotel(Late Checkout), Boarding(Priority)', pricingStrategy: 'Absolute Price', discount: 75, itemCount: 2 },
  { id: 'BUN-004', name: 'Long Haul Comfort', description: 'Extra legroom seat, amenity kit, and Wi-Fi.', status: 'Published', scope: 'Flight Duration > 6h', components: 'Seat(Legroom), Amenity Kit, Wi-Fi(Unlimited)', pricingStrategy: 'Percent Discount', discount: 20, itemCount: 3 },
  { id: 'BUN-005', name: 'Flexi Traveler', description: 'Flight change waiver and seat selection.', status: 'Published', scope: 'Brand: Flex', components: 'Flexibility(Change), Seat(Any)', pricingStrategy: 'Absolute Price', discount: 99, itemCount: 2 },
  { id: 'BUN-006', name: 'TMC Premium Package', description: 'Lounge access, fast-track security, chauffeur.', status: 'Archived', scope: 'Channel: TMC', components: 'Lounge, Security(Fast), Chauffeur', pricingStrategy: 'Absolute Price', discount: 250, itemCount: 3 },
  { id: 'BUN-007', name: 'Ancillary Starter', description: 'A basic package for testing.', status: 'Draft', scope: 'All', components: 'Bag(15kg)', pricingStrategy: 'Fixed Discount', discount: 5, itemCount: 1 },
  { id: 'BUN-008', name: 'Golfer\'s Paradise', description: 'Oversized baggage for golf clubs and a complimentary drink.', status: 'Published', scope: 'Route: DUB-FAO', components: 'Bag(Oversized), Drink(Any)', pricingStrategy: 'Absolute Price', discount: 60, itemCount: 2 },
  { id: 'BUN-009', name: 'Ski Enthusiast', description: 'Ski equipment carriage and winter meal.', status: 'Published', scope: 'Route: LHR-GVA', components: 'Bag(Ski), Meal(Winter)', pricingStrategy: 'Percent Discount', discount: 10, itemCount: 2 },
  { id: 'BUN-010', name: 'Eco-Traveler Pack', description: 'Carbon offset and a digital magazine subscription.', status: 'Published', scope: 'All', components: 'Carbon Offset, Magazine(Digital)', pricingStrategy: 'Absolute Price', discount: 15, itemCount: 2 },
];


export default function BundlesPage() {
  const firestore = useFirestore();
  const { data: bundles, loading, error } = useCollection(firestore ? collection(firestore, 'bundles') : undefined);
  
  const displayBundles = loading === false && bundles && bundles.length === 0 ? mockBundles : bundles || [];

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
      const bundleData = { 
        ...data, 
        itemCount: data.components?.split(',').length || 0 
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
          <h1 className="text-3xl font-bold tracking-tight">Bundles Studio</h1>
          <p className="text-muted-foreground">
            Create, manage, and price ancillary bundles.
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
          {loading && (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
           )}
           {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bundle Name</TableHead>
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
                    <TableCell>{bundle.scope}</TableCell>
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
