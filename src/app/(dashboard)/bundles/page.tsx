
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
import { MoreHorizontal, PlusCircle, Loader2, Bot, User, Search, Package, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BundleForm, type Bundle } from '@/components/forms/bundle-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const mockOffers: (Bundle & { usage: number })[] = [
    { id: 'BUN-001', name: 'Business Saver+', category: 'Normal', description: 'Front seat, 1 checked bag, and a meal.', status: 'Published', scope: { brand: 'Flex, Premium', route: 'All', channel: 'Direct, TMC' }, components: { seat: 'Front', baggage: '23kg', meal: 'Any' }, promotions: [], pricingStrategy: 'Percent Discount', discount: 15, itemCount: 3, source: 'Manual', priority: 'Manual Override', usage: 1520 },
    { id: 'BUN-002', name: 'Family Pack', category: 'Normal', description: 'Adjacent seats, extra baggage, and child meals.', status: 'Published', scope: { brand: 'Economy Saver', route: 'JFK-MIA', channel: 'Web' }, components: { seat: 'Adjacent', baggage: '15kg, 2', meal: 'Child' }, promotions: [], pricingStrategy: 'Fixed Discount', discount: 50, itemCount: 3, source: 'Manual', priority: 'Manual Override', usage: 890 },
    { id: 'BUN-003', name: 'Weekend Getaway', category: 'Promotional', description: 'Late checkout, priority boarding.', status: 'Draft', scope: { route: 'JFK-MIA', channel: 'Direct' }, components: { other: 'Hotel(Late Checkout), Boarding(Priority)' }, promotions: ['PROMO-04'], pricingStrategy: 'Absolute Price', discount: 75, itemCount: 3, source: 'Manual', priority: 'Manual Override', usage: 0 },
    { id: 'BUN-004', name: 'Long Haul Comfort', category: 'Normal', description: 'Extra legroom seat, amenity kit, and Wi-Fi.', status: 'Published', scope: { route: 'Duration > 6h' }, components: { seat: 'Legroom', other: 'Amenity Kit, Wi-Fi(Unlimited)' }, promotions: [], pricingStrategy: 'Percent Discount', discount: 20, itemCount: 3, source: 'Manual', priority: 'Manual Override', usage: 2105 },
    { id: 'BUN-005', name: 'Disruption Recovery Pack', category: 'Disruption', description: 'Lounge access, meal voucher, and hotel credit.', status: 'Published', scope: { route: 'All' }, components: { other: 'Lounge, Meal Voucher, Hotel Credit' }, promotions: [], pricingStrategy: 'Absolute Price', discount: 0, itemCount: 3, source: 'Manual', priority: 'Manual Override', usage: 450 },
    { id: 'BUN-006', name: 'Flexi Traveler', category: 'Normal', description: 'Flight change waiver and seat selection.', status: 'Published', scope: { brand: 'Economy Flex' }, components: { other: 'Flexibility(Change)', seat: 'Any' }, promotions: [], pricingStrategy: 'Absolute Price', discount: 99, itemCount: 2, source: 'AI', priority: 'AI Override', usage: 730 },
    { id: 'BUN-007', name: 'Holiday Special', category: 'Promotional', description: 'Extra bag and festive meal.', status: 'Published', scope: { route: 'All', channel: 'Web, Mobile' }, components: { baggage: '23kg', meal: 'Festive' }, promotions: ['PROMO-01'], pricingStrategy: 'Fixed Discount', discount: 25, itemCount: 3, source: 'AI', priority: 'Manual Override', usage: 1240 },
    { id: 'BUN-008', name: 'TMC Recovery Bundle', category: 'Disruption', description: 'Lounge access, fast-track security, chauffeur.', status: 'Archived', scope: { channel: 'TMC' }, components: { other: 'Lounge, Security(Fast), Chauffeur' }, promotions: [], pricingStrategy: 'Absolute Price', discount: 0, itemCount: 3, source: 'Manual', priority: 'Manual Override', usage: 120 },
];


export default function BundlesPage() {
  const firestore = useFirestore();
  const bundlesQuery = useMemo(() => firestore ? collection(firestore, 'bundles') : undefined, [firestore]);
  const { data: bundlesCollection, loading, error } = useCollection(bundlesQuery);
  const [filters, setFilters] = useState({ name: '', category: 'all', status: 'all', source: 'all' });
  
  const displayOffers = useMemo(() => {
    let sourceData: (Bundle & { usage?: number })[];
    
    if (!firestore || bundlesCollection === null) {
      sourceData = mockOffers;
    } else {
      sourceData = bundlesCollection.map(offer => ({
        ...offer,
        usage: offer.usage ?? Math.floor(Math.random() * 2000),
      }));
    }

    if (sourceData.length === 0 && !loading) {
      sourceData = mockOffers;
    }
    
    return sourceData.filter(offer => {
      const nameMatch = filters.name ? offer.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const categoryMatch = filters.category === 'all' || offer.category === filters.category;
      const statusMatch = filters.status === 'all' || offer.status === filters.status;
      const sourceMatch = filters.source === 'all' || (offer.source || 'Manual') === filters.source;
      return nameMatch && categoryMatch && statusMatch && sourceMatch;
    });
  }, [bundlesCollection, firestore, loading, filters]);

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
        priority: data.priority || 'Manual Override',
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

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

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
          <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by offer name..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Disruption">Disruption</SelectItem>
                  <SelectItem value="Promotional">Promotional</SelectItem>
                </SelectContent>
              </Select>
               <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
               <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                </SelectContent>
              </Select>
          </div>
          {(loading && displayOffers.length === 0) && (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
           )}
           {(!loading && displayOffers.length > 0 && !error) && (
            <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOffers.map((bundle) => (
                  <TableRow key={bundle.id}>
                    <TableCell className="font-medium">
                      <div>{bundle.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">{bundle.id}</div>
                    </TableCell>
                     <TableCell>
                      <Badge variant="outline">{bundle.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(bundle.status)}>
                        {bundle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                            <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                <span>{bundle.itemCount}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="p-1 text-sm">
                            <h4 className="font-semibold mb-2">Included Items</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {bundle.components && Object.values(bundle.components).filter(Boolean).map((comp, i) => <li key={i} className="capitalize">{comp.toString().toLowerCase()}</li>)}
                              {bundle.promotions && Array.isArray(bundle.promotions) && bundle.promotions.map((promo, i) => <li key={i}>Promotion: {promo}</li>)}
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                        <Badge variant={bundle.pricingStrategy === 'Absolute Price' ? 'default' : 'secondary'}>
                            {formatPricing(bundle)}
                        </Badge>
                    </TableCell>
                    <TableCell>{(bundle as any).usage?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {bundle.source === 'AI' ? <Bot /> : <User />}
                        <span>{bundle.source || 'Manual'}</span>
                      </div>
                    </TableCell>
                     <TableCell>
                      <Badge variant="outline">{bundle.priority}</Badge>
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
            </TooltipProvider>
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
