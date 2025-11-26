
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Loader2, History, GitCommitHorizontal, CheckCircle, Archive, FilePenLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { FareProductForm, type FareProduct } from '@/components/forms/fare-product-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const mockFareProducts: FareProduct[] = [
    { id: 'FP-001', name: 'Economy Light', description: 'Basic economy fare with no checked baggage.', status: 'Active', version: 1, refundability: 'Not Allowed', exchangeability: 'Allowed with Penalty', transferability: 'Not Allowed', route: 'JFK-LAX', priceModificationType: 'PERCENTAGE', priceModificationValue: 0, includedAncillaries: [] },
    { id: 'FP-002', name: 'Economy Flex', description: 'Flexible economy fare with seat selection and one checked bag.', status: 'Active', version: 2, refundability: 'Allowed', exchangeability: 'Allowed', transferability: 'Not Allowed', route: 'JFK-LAX', priceModificationType: 'ABSOLUTE', priceModificationValue: 50, includedAncillaries: ['seat_selection', 'checked_bag'] },
    { id: 'FP-003', name: 'Business Saver', description: 'Promotional business class fare with some restrictions.', status: 'Active', version: 1, refundability: 'Allowed with Penalty', exchangeability: 'Allowed with Penalty', transferability: 'Not Allowed', route: 'LHR-DXB', priceModificationType: 'PERCENTAGE', priceModificationValue: 10, includedAncillaries: ['seat_selection', 'checked_bag', 'lounge_access'] },
    { id: 'FP-004', name: 'Business Flex', description: 'Fully flexible business class fare with all benefits.', status: 'Draft', version: 1, refundability: 'Allowed', exchangeability: 'Allowed', transferability: 'Allowed', route: 'LHR-DXB', priceModificationType: 'ABSOLUTE', priceModificationValue: 200, includedAncillaries: ['seat_selection', 'checked_bag', 'lounge_access', 'priority_boarding', 'meal_service'] },
    { id: 'FP-005', name: 'First Class', description: 'Premium first-class experience.', status: 'Active', version: 1, refundability: 'Allowed', exchangeability: 'Allowed', transferability: 'Allowed', route: '*', priceModificationType: 'PERCENTAGE', priceModificationValue: 50, includedAncillaries: ['seat_selection', 'checked_bag', 'lounge_access', 'priority_boarding', 'meal_service', 'flexibility'] },
];

const mockHistory = [
    { version: 2, actor: 'rm@airline.com', event: 'Price updated', timestamp: '2025-10-26T14:00:00Z', icon: FilePenLine },
    { version: 1, actor: 'system', event: 'Product activated', timestamp: '2025-10-25T11:06:15Z', icon: CheckCircle },
    { version: 1, actor: 'pm@airline.com', event: 'Product created', timestamp: '2025-10-25T09:30:00Z', icon: GitCommitHorizontal },
]

export default function CatalogPage() {
  const firestore = useFirestore();
  const { data: fareProductsCollection, loading, error } = useCollection(firestore ? collection(firestore, 'fareProducts') : undefined);
  
  const fareProducts = fareProductsCollection ? fareProductsCollection as FareProduct[] : [];
  const displayFareProducts = fareProducts.length > 0 ? fareProducts : mockFareProducts;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FareProduct | null>(null);
  const [selectedProductForHistory, setSelectedProductForHistory] = useState<FareProduct | null>(null);
  const { toast } = useToast();
  
  const handleOpenDialog = (product: FareProduct | null = null) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };
  
  const handleFormSubmit = async (data: FareProduct) => {
    if (!firestore) return;
    try {
        if (editingProduct?.id) {
          const productRef = doc(firestore, 'fareProducts', editingProduct.id);
          await setDoc(productRef, { ...data, version: editingProduct.version || 1 }, { merge: true });
          toast({ title: "Branded Fare Updated", description: `Branded Fare ${data.name} has been successfully updated.` });
        } else {
          const newProduct = { ...data, version: 1, createdAt: serverTimestamp() };
          await addDoc(collection(firestore, 'fareProducts'), newProduct);
           toast({ title: "Branded Fare Created", description: `Branded Fare ${newProduct.name} has been successfully created.` });
        }
    } catch(e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "There was a problem with your request.",
        });
    }
    handleDialogClose();
  };
  
  const handleCreateNewVersion = async (product: FareProduct) => {
    if(!firestore) return;
    const newVersion = {
        ...product,
        id: undefined,
        version: (product.version || 1) + 1,
        status: 'Draft' as const,
    };
    try {
        await addDoc(collection(firestore, 'fareProducts'), { ...newVersion, createdAt: serverTimestamp() });
        toast({
            title: 'New Draft Version Created',
            description: `A new draft (v${newVersion.version}) of "${product.name}" has been created.`
        })
    } catch(e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "Could not create new version.",
        });
    }
  };

  const handleViewHistory = (product: FareProduct) => {
    setSelectedProductForHistory(product);
    setIsHistoryDialogOpen(true);
  };
  
  const formatPriceModification = (product: FareProduct) => {
    if (product.priceModificationType === 'PERCENTAGE') {
      return `${product.priceModificationValue >= 0 ? '+' : ''}${product.priceModificationValue}%`;
    }
    if (product.priceModificationType === 'ABSOLUTE') {
      return `${product.priceModificationValue >= 0 ? '+' : '-'}$${Math.abs(product.priceModificationValue)}`;
    }
    return 'N/A';
  };


  return (
    <div className="flex flex-col gap-6">
       <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Branded Fares</h1>
        <p className="text-muted-foreground">
          Define branded fares with their routing, pricing adjustments, and included ancillaries.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Branded Fares</CardTitle>
            <CardDescription>
              Manage the attributes and rules of your fare brands.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            New Branded Fare
          </Button>
        </CardHeader>
        <CardContent>
          {loading && displayFareProducts.length === 0 && (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
           )}
           {displayFareProducts.length > 0 && !error && (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Brand Name</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Pricing Adj.</TableHead>
                    <TableHead>Ancillaries</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {displayFareProducts.sort((a, b) => (a.name! > b.name!) ? 1 : (a.name === b.name) ? ((a.version || 0) > (b.version || 0) ? -1 : 1) : -1).map((product) => (
                    <TableRow key={product.id}>
                    <TableCell className="font-medium">
                        <div>{product.name}</div>
                        <div className="text-xs text-muted-foreground">v{product.version}</div>
                    </TableCell>
                    <TableCell>{product.route}</TableCell>
                    <TableCell>
                      <Badge variant={product.priceModificationValue >= 0 ? 'default' : 'destructive'}>{formatPriceModification(product)}</Badge>
                    </TableCell>
                    <TableCell>{product.includedAncillaries?.length || 0}</TableCell>
                    <TableCell>
                        <Badge
                        variant={
                            product.status === 'Active'
                            ? 'default'
                            : 'secondary'
                        }
                        >
                        {product.status}
                        </Badge>
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
                            <DropdownMenuItem onClick={() => handleOpenDialog(product)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCreateNewVersion(product)}>
                            Create New Version
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewHistory(product)}>View History</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
           )}
           {error && <p className="text-destructive">Error loading fare products: {error.message}</p>}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Branded Fare' : 'Create New Branded Fare'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? `Editing branded fare "${editingProduct.name}".` : 'Enter the details for the new branded fare.'}
            </DialogDescription>
          </DialogHeader>
          <FareProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change History for "{selectedProductForHistory?.name}"</DialogTitle>
            <DialogDescription>
                A log of all changes made to this fare product.
            </DialogDescription>
          </DialogHeader>
           <div className="relative pl-6 space-y-6 border-l-2 border-border mt-4">
                {mockHistory.map((event, index) => (
                    <div key={index} className="relative">
                        <div className="absolute -left-[2.0rem] top-0 flex items-center justify-center w-14 h-14 bg-background rounded-full">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-secondary">
                            <event.icon className="h-5 w-5 text-secondary-foreground" />
                            </div>
                        </div>
                        <div className="pl-6">
                            <p className="font-semibold text-md">{event.event}</p>
                            <p className="text-sm text-muted-foreground">by {event.actor} (v{event.version})</p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date(event.timestamp).toUTCString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
