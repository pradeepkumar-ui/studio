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
import { MoreHorizontal, PlusCircle, Loader2, Bot, User, Search, Package, Ticket, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BundleForm, type Bundle } from '@/components/forms/bundle-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';

const mockOffers: (Bundle & { usage: number })[] = [
    { id: 'BUN-001', name: 'Executive Gateway', category: 'Normal', description: 'Priority Fast Track, Premium Lounge Access, and Unlimited Wi-Fi.', status: 'Published', scope: { brand: 'Business, Premium', route: 'LHR, JFK, SIN', channel: 'Direct, CUSS' }, components: { other: 'Fast Track, Lounge, Wi-Fi' }, promotions: [], pricingStrategy: 'Absolute Price', discount: 85, itemCount: 3, source: 'Manual', priority: 'Manual Override', usage: 1240 },
    { id: 'BUN-002', name: 'Arrivals Comfort', category: 'Normal', description: 'Meet & Assist VIP greeting and luxury chauffeur transfer.', status: 'Published', scope: { channel: 'Web, Mobile', market: 'EU, US' }, components: { other: 'Meet & Assist, Chauffeur' }, promotions: [], pricingStrategy: 'Percent Discount', discount: 15, itemCount: 2, source: 'Manual', priority: 'Manual Override', usage: 520 },
    { id: 'BUN-003', name: 'Quick Turnaround', category: 'Promotional', description: 'Fast track security and priority boarding for tight connections.', status: 'Draft', scope: { cohorts: 'Short_Connection_Pax' }, components: { other: 'Fast Track, Priority Boarding' }, promotions: [], pricingStrategy: 'Fixed Discount', discount: 10, itemCount: 2, source: 'AI', priority: 'AI Override', usage: 0 },
    { id: 'BUN-004', name: 'Family Holiday Pack', category: 'Promotional', description: 'Lounge access for 4, 2 extra bags, and kid meals.', status: 'Published', scope: { cohorts: 'Family_Leisure' }, components: { other: 'Lounge(Family), Baggage(Extra), Meal(Kid)' }, promotions: ['PROMO-01'], pricingStrategy: 'Absolute Price', discount: 120, itemCount: 4, source: 'Manual', priority: 'Manual Override', usage: 890 },
    { id: 'BUN-005', name: 'Business Saver Bundle', category: 'Normal', description: 'Front cabin seat and extra 23kg bag.', status: 'Published', scope: { brand: 'Economy Flex' }, components: { seat: 'Front', baggage: '23kg' }, promotions: [], pricingStrategy: 'Percent Discount', discount: 10, itemCount: 2, source: 'Manual', priority: 'Manual Override', usage: 2105 },
    { id: 'BUN-006', name: 'Digital Nomad Pack', category: 'Promotional', description: 'Unlimited High-Speed Wi-Fi and Lounge Access.', status: 'Published', scope: { channel: 'Mobile' }, components: { other: 'Wi-Fi, Lounge' }, promotions: [], pricingStrategy: 'Absolute Price', discount: 49, itemCount: 2, source: 'AI', priority: 'AI Override', usage: 730 },
];


export default function BundlesPage() {
  const firestore = useFirestore();
  const bundlesQuery = useMemo(() => firestore ? collection(firestore, 'bundles') : undefined, [firestore]);
  const { data: bundlesCollection, loading } = useCollection(bundlesQuery);
  const [filters, setFilters] = useState({ name: '', category: 'all', status: 'all', source: 'all' });
  
  const displayOffers = useMemo(() => {
    let sourceData: (Bundle & { usage?: number })[];
    
    if (!firestore || bundlesCollection === null) {
      sourceData = mockOffers;
    } else {
      sourceData = bundlesCollection.length > 0 ? (bundlesCollection as any[]).map(offer => ({
        ...offer,
        usage: offer.usage ?? Math.floor(Math.random() * 2000),
      })) : mockOffers;
    }
    
    return sourceData.filter(offer => {
      const nameMatch = filters.name ? offer.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const categoryMatch = filters.category === 'all' || offer.category === filters.category;
      const statusMatch = filters.status === 'all' || offer.status === filters.status;
      const sourceMatch = filters.source === 'all' || (offer.source || 'Manual') === filters.source;
      return nameMatch && categoryMatch && statusMatch && sourceMatch;
    });
  }, [bundlesCollection, firestore, filters]);

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
      if (editingBundle?.id) {
        const bundleRef = doc(firestore, 'bundles', editingBundle.id);
        await setDoc(bundleRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Offer Updated', description: `Offer "${data.name}" has been updated.` });
      } else {
        await addDoc(collection(firestore, 'bundles'), { ...data, createdAt: serverTimestamp(), source: 'Manual' });
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

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'bundles', id));
        toast({ title: 'Offer Deleted', variant: 'destructive' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Offer Bundles Studio</h1>
          <p className="text-muted-foreground">
            Create, manage, and price ancillary bundles and ecosystem offers.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2" />
          Create New Bundle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bundle Catalogue</CardTitle>
          <CardDescription>
            Manage your airline and airport service bundles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bundles..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Disruption">Disruption</SelectItem>
                  <SelectItem value="Promotional">Promotional</SelectItem>
                </SelectContent>
              </Select>
               <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
               <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                </SelectContent>
              </Select>
          </div>
          
          {loading && displayOffers.length === 0 ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
           ) : (
            <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bundle Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scope Overview</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOffers.map((bundle) => (
                  <TableRow key={bundle.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-primary/10 rounded-md">
                            <Package className="h-4 w-4 text-primary" />
                         </div>
                         <div>
                            <div>{bundle.name}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">{bundle.id}</div>
                         </div>
                      </div>
                    </TableCell>
                     <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{bundle.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(bundle.status)} className="text-[10px]">
                        {bundle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Ticket className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{bundle.scope?.brand || 'All Brands'}</span>
                             </div>
                             <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{bundle.scope?.route || 'All Routes'}</span>
                             </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="secondary" className="font-mono">
                            {formatPricing(bundle)}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{(bundle as any).usage?.toLocaleString() || '0'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                        {bundle.source === 'AI' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        <span>{bundle.source || 'Manual'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
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
                            Edit Configuration
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicate Bundle</DropdownMenuItem>
                          <DropdownMenuItem>Performance Analytics</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => bundle.id && handleDelete(bundle.id)}>
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
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingBundle ? 'Edit Ecosystem Bundle' : 'Create New Offer Bundle'}</DialogTitle>
            <DialogDescription>
              {editingBundle ? `Modifying "${editingBundle.name}".` : 'Combine multiple airline and airport services into a single sellable offer.'}
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
