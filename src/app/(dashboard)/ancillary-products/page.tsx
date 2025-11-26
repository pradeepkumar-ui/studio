
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AncillaryProductForm, type AncillaryProduct } from '@/components/forms/ancillary-product-form';

const initialOtherProducts: AncillaryProduct[] = [
    { sku: 'GC-1000-INR', name: '₹1000 Gift Card', category: 'Gift Cards', price: 1000, currency: 'INR', stock: 482, status: 'Active' },
    { sku: 'LP-SIN-01', name: 'SIN Lounge Pass', category: 'Lounge Access', price: 45, currency: 'USD', stock: 'N/A', status: 'Active' },
    { sku: 'MERCH-NP-01', name: 'Branded Neck Pillow', category: 'Merchandise', price: 25, currency: 'USD', stock: 112, status: 'Active' },
    { sku: 'VOUCH-CC-01', name: 'Carbon Offset Voucher', category: 'Vouchers', price: 10, currency: 'USD', stock: 'N/A', status: 'Draft' },
]

export default function AncillaryProductsPage() {
  const [otherProducts, setOtherProducts] = useState<AncillaryProduct[]>(initialOtherProducts);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AncillaryProduct | null>(null);
  const { toast } = useToast();

  const handleOpenProductDialog = (product: AncillaryProduct | null = null) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleProductDialogClose = () => {
    setIsProductDialogOpen(false);
    setEditingProduct(null);
  }

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      default: return 'outline';
    }
  }

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Ancillary Products
          </h1>
          <p className="text-muted-foreground">
            Manage non-air products like gift cards, lounge passes, and merchandise.
          </p>
        </div>
        <Button onClick={() => handleOpenProductDialog()}>
            <PlusCircle className="mr-2" />
            Create Product
        </Button>
      </div>

      <Card>
        <CardHeader>
            <div>
              <CardTitle>Ancillary Products Catalogue</CardTitle>
              <CardDescription>
                Manage other non-air services and products.
              </CardDescription>
            </div>
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
