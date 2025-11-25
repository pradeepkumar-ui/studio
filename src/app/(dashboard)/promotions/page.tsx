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
import { MoreHorizontal, PlusCircle, Import, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PromotionForm, type Promotion } from '@/components/forms/promotion-form';
import { AncillaryProductForm, type AncillaryProduct } from '@/components/forms/ancillary-product-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const mockPromotions: Promotion[] = [
    { id: 'PRO-001', name: 'Winter Sale', description: '10% off on all flights to Europe', prefix: 'WINTER10', poolSize: 10000, usageType: 'multi', expiryDate: new Date('2025-03-31'), status: 'Active' },
    { id: 'PRO-002', name: 'Business Special', description: '25% off on business class tickets', prefix: 'BIZ25', poolSize: 5000, usageType: 'single', expiryDate: new Date('2025-06-30'), status: 'Active' },
    { id: 'PRO-003', name: 'New Route Launch', description: '50% off on flights to Tokyo', prefix: 'TOKYO50', poolSize: 1000, usageType: 'single', expiryDate: new Date('2025-04-30'), status: 'Draft' },
    { id: 'PRO-004', name: 'Summer Getaway', description: '15% off on all flights', prefix: 'SUMMER15', poolSize: 20000, usageType: 'multi', expiryDate: new Date('2024-09-30'), status: 'Expired' },
];

const initialOtherProducts: AncillaryProduct[] = [
    { sku: 'GC-1000-INR', name: '₹1000 Gift Card', category: 'Gift Cards', price: 1000, currency: 'INR', stock: 482, status: 'Active' },
    { sku: 'LP-SIN-01', name: 'SIN Lounge Pass', category: 'Lounge Access', price: 45, currency: 'USD', stock: 'N/A', status: 'Active' },
    { sku: 'MERCH-NP-01', name: 'Branded Neck Pillow', category: 'Merchandise', price: 25, currency: 'USD', stock: 112, status: 'Active' },
    { sku: 'VOUCH-CC-01', name: 'Carbon Offset Voucher', category: 'Vouchers', price: 10, currency: 'USD', stock: 'N/A', status: 'Draft' },
]

export default function PromotionsPage() {
  const firestore = useFirestore();
  const { data: promotionsCollection, loading, error } = useCollection(firestore ? collection(firestore, 'promotions') : undefined);
  
  const promotions = promotionsCollection ? promotionsCollection as Promotion[] : [];
  const displayPromotions = promotions.length > 0 ? promotions : mockPromotions;

  const [otherProducts, setOtherProducts] = useState<AncillaryProduct[]>(initialOtherProducts);
  const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [editingProduct, setEditingProduct] = useState<AncillaryProduct | null>(null);
  const { toast } = useToast();

  const handleOpenPromoDialog = (promo: Promotion | null = null) => {
    setEditingPromotion(promo);
    setIsPromoDialogOpen(true);
  };
  
  const handleOpenProductDialog = (product: AncillaryProduct | null = null) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const handlePromoDialogClose = () => {
    setIsPromoDialogOpen(false);
    setEditingPromotion(null);
  };

  const handleProductDialogClose = () => {
    setIsProductDialogOpen(false);
    setEditingProduct(null);
  }

  const handlePromoSubmit = async (data: Promotion) => {
    if (!firestore) return;
    try {
      const promoData = {
        ...data,
        expiryDate: Timestamp.fromDate(data.expiryDate as Date),
      };
      if (editingPromotion?.id) {
        const promoRef = doc(firestore, 'promotions', editingPromotion.id);
        await setDoc(promoRef, { ...promoData, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Promotion Updated', description: `Promotion "${data.name}" has been successfully updated.` });
      } else {
        await addDoc(collection(firestore, 'promotions'), { ...promoData, createdAt: serverTimestamp() });
        toast({ title: 'Promotion Created', description: `Promotion "${data.name}" has been successfully created.` });
      }
    } catch (e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "There was a problem with your request.",
        });
    }
    handlePromoDialogClose();
  };

  const handleProductSubmit = (data: AncillaryProduct) => {
    if (editingProduct) {
        setOtherProducts(otherProducts.map(p => p.sku === data.sku ? data : p));
        toast({ title: 'Product Updated', description: `Product "${data.name}" has been updated.`});
    } else {
        if (otherProducts.some(p => p.sku === data.sku)) {
            toast({ variant: 'destructive', title: 'SKU already exists', description: 'A product with this SKU already exists.'});
            return;
        }
        setOtherProducts([data, ...otherProducts]);
        toast({ title: 'Product Created', description: `Product "${data.name}" has been created.`});
    }
    handleProductDialogClose();
  };


  const handleDelete = async (promoId: string) => {
     if (!promoId || !firestore) return;
    try {
        await deleteDoc(doc(firestore, 'promotions', promoId));
        toast({
          variant: 'destructive',
          title: 'Promotion Deleted',
          description: `Promotion with ID ${promoId} has been deleted.`,
        });
    } catch (e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "Could not delete the promotion.",
        });
    }
  };
  
  const getStatusBadgeVariant = (status: Promotion['status'] | string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Expired': return 'outline';
      default: return 'outline';
    }
  }

  const formatDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'PP');
    }
    return format(date, 'PP');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Promotions & Products
          </h1>
          <p className="text-muted-foreground">
            Manage promotional codes, gift cards, merchandise, and other non-air products.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Import className="mr-2" />
            Import
          </Button>
          <Button onClick={() => handleOpenPromoDialog()}>
            <PlusCircle className="mr-2" />
            Create Promotion
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Promotional Code Pools</CardTitle>
          <CardDescription>
            Manage all your promotional campaigns and code pools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && displayPromotions.length === 0 && (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
           )}
           {displayPromotions.length > 0 && !error && (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Promotion Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Code Prefix</TableHead>
                    <TableHead>Pool Size</TableHead>
                    <TableHead>Usage Type</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {displayPromotions.map((promo) => (
                    <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.name}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusBadgeVariant(promo.status)}>
                        {promo.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{promo.prefix}</TableCell>
                    <TableCell>{promo.poolSize.toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{promo.usageType}</TableCell>
                    <TableCell>
                        {promo.expiryDate && formatDate(promo.expiryDate)}
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
                            <DropdownMenuItem onClick={() => handleOpenPromoDialog(promo)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Codes</DropdownMenuItem>
                            <DropdownMenuItem>Assign to Offer</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(promo.id!)}>
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
           {error && <p className="text-destructive">Error loading promotions: {error.message}</p>}
        </CardContent>
      </Card>

        <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ancillary Products</CardTitle>
              <CardDescription>
                Manage other non-air services and products like gift cards, lounge passes, and merchandise.
              </CardDescription>
            </div>
             <Button variant="outline" size="sm" onClick={() => handleOpenProductDialog()}>
                <PlusCircle className="mr-2" />
                Create Product
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherProducts.map((product) => (
                <TableRow key={product.sku}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(product.status)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(product.price)}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenProductDialog(product)}>Edit Product</DropdownMenuItem>
                        <DropdownMenuItem>Manage Inventory</DropdownMenuItem>
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
        </CardContent>
      </Card>
      
      <Dialog open={isPromoDialogOpen} onOpenChange={setIsPromoDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}</DialogTitle>
            <DialogDescription>
              {editingPromotion ? `Editing promotion "${editingPromotion.name}".` : 'Define a new promotional code pool.'}
            </DialogDescription>
          </DialogHeader>
          <PromotionForm
            promotion={editingPromotion}
            onSubmit={handlePromoSubmit}
            onCancel={handlePromoDialogClose}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Ancillary Product'}</DialogTitle>
            <DialogDescription>
              Define a new non-air product or service.
            </DialogDescription>
          </DialogHeader>
          <AncillaryProductForm
            product={editingProduct}
            onSubmit={handleProductSubmit}
            onCancel={handleProductDialogClose}
          />
        </DialogContent>
      </Dialog>

    </div>
  );
}
