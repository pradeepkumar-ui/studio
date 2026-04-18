
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
import { MoreHorizontal, PlusCircle, Loader2, Bot, User, Search, Package, Target, Calendar as CalendarIcon, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BundleForm, type Bundle } from '@/components/forms/bundle-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, deleteDoc, Timestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';
import { format } from 'date-fns';

const mockOffers: any[] = [
    { id: 'BUN-001', name: 'Executive Gateway', category: 'Normal', description: 'Priority Fast Track, Premium Lounge Access, and Unlimited Wi-Fi.', status: 'Published', priorityLevel: 80, validity: { from: new Date(), to: addDays(new Date(), 60) }, scope: { brand: 'Business, Premium', route: 'LHR, JFK, SIN', channel: 'Direct, CUSS', cohorts: 'LHR_BIZ_WAIT' }, components: { other: 'Fast Track, Lounge, Wi-Fi' }, pricingStrategy: 'Absolute Price', discount: 85, itemCount: 3, source: 'Manual', usage: 1240 },
    { id: 'BUN-002', name: 'Arrivals Comfort', category: 'Normal', description: 'Meet & Assist VIP greeting and luxury chauffeur transfer.', status: 'Published', priorityLevel: 40, validity: { from: new Date(), to: addDays(new Date(), 90) }, scope: { channel: 'Web, Mobile', market: 'EU, US', cohorts: 'JFK_PREM_LSR' }, components: { other: 'Meet & Assist, Chauffeur' }, pricingStrategy: 'Percent Discount', discount: 15, itemCount: 2, source: 'Manual', usage: 520 },
    { id: 'BUN-003', name: 'Quick Turnaround', category: 'Promotional', description: 'Fast track security and priority boarding for tight connections.', status: 'Draft', priorityLevel: 95, validity: { from: new Date(), to: addDays(new Date(), 15) }, scope: { cohorts: 'SIN_TRANSIT_LOUNGE' }, components: { other: 'Fast Track, Priority Boarding' }, pricingStrategy: 'Fixed Discount', discount: 10, itemCount: 2, source: 'AI', usage: 0 },
];


export default function BundlesPage() {
  const firestore = useFirestore();
  const bundlesQuery = useMemo(() => firestore ? collection(firestore, 'bundles') : undefined, [firestore]);
  const { data: bundlesCollection, loading } = useCollection(bundlesQuery);
  const [filters, setFilters] = useState({ name: '', category: 'all', status: 'all', source: 'all' });
  
  const displayOffers = useMemo(() => {
    let sourceData: any[];
    
    if (!firestore || bundlesCollection === null) {
      sourceData = mockOffers;
    } else {
      sourceData = bundlesCollection.length > 0 ? bundlesCollection : mockOffers;
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
  const [editingBundle, setEditingBundle] = useState<any | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (bundle: any | null = null) => {
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
        validity: {
          from: Timestamp.fromDate(data.validity.from),
          to: Timestamp.fromDate(data.validity.to),
        }
      };

      if (editingBundle?.id) {
        const bundleRef = doc(firestore, 'bundles', editingBundle.id);
        await setDoc(bundleRef, { ...bundleData, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Bundle Updated', description: `Offer "${data.name}" updated successfully.` });
      } else {
        await addDoc(collection(firestore, 'bundles'), { ...bundleData, createdAt: serverTimestamp(), source: 'Manual' });
        toast({ title: 'Bundle Created', description: `New bundle "${data.name}" added to studio.` });
      }
    } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
    }
    handleDialogClose();
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'bundles', id));
        toast({ title: 'Bundle Deleted', variant: 'destructive' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Published': return 'default';
      case 'Draft': return 'secondary';
      case 'Archived': return 'outline';
      default: return 'outline';
    }
  };

  const formatBundleDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return format(d, 'dd MMM yy');
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Offer Bundles Studio</h1>
          <p className="text-muted-foreground">
            Combine exhaustive airline and airport services into targeted retailing bundles.
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
            Manage multi-service offers targeted by customer cohorts and touchpoints.
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
                  <TableHead>Validity</TableHead>
                  <TableHead>Targeting (Cohorts)</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
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
                            <div className="flex items-center gap-2">
                                <span>{bundle.name}</span>
                                {bundle.priorityLevel > 80 && <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />}
                            </div>
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
                        <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground font-mono">
                            <div className="flex items-center gap-1">
                                <CalendarIcon className="h-2.5 w-2.5" />
                                {formatBundleDate(bundle.validity?.from)}
                            </div>
                            <div className="pl-3.5">
                                to {formatBundleDate(bundle.validity?.to)}
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Target className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">{bundle.scope?.cohorts || bundle.scope?.cohorts?.join(', ') || 'All Passengers'}</span>
                             </div>
                             <div className="text-[10px] text-muted-foreground pl-4">
                                {bundle.scope?.channel || bundle.scope?.channel?.join(', ') || 'All Channels'}
                             </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="secondary" className="font-mono text-[10px]">
                            {bundle.pricingStrategy === 'Absolute Price' ? `$${bundle.discount}` : (bundle.pricingStrategy === 'Percent Discount' ? `${bundle.discount}% Off` : `-$${bundle.discount}`)}
                        </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                        {bundle.source === 'AI' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        <span>{bundle.source || 'Manual'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog(bundle)}>Edit Detailed Config</DropdownMenuItem>
                          <DropdownMenuItem>View Conversion Trends</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => bundle.id && handleDelete(bundle.id)}>Archive Bundle</DropdownMenuItem>
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
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{editingBundle ? 'Edit Ecosystem Bundle' : 'Create Targeted Bundle'}</DialogTitle>
            <DialogDescription>
              Orchestrate multiple products into a single offer based on deep ecosystem targeting and advanced business logic.
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
