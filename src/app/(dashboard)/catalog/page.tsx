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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
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


const initialFareProducts: FareProduct[] = [
  {
    id: 'FP-001',
    name: 'Economy Light',
    description: 'Basic economy fare, no checked bag.',
    status: 'Active',
    version: 2,
  },
  {
    id: 'FP-002',
    name: 'Economy Standard',
    description: 'Includes one checked bag and seat selection.',
    status: 'Active',
    version: 4,
  },
  {
    id: 'FP-003',
    name: 'Economy Flex',
    description: 'Refundable, includes two checked bags.',
    status: 'Active',
    version: 3,
  },
  {
    id: 'FP-004',
    name: 'Business Basic',
    description: 'Non-refundable business class fare.',
    status: 'Draft',
    version: 1,
  },
  {
    id: 'FP-005',
    name: 'Business Flex',
    description: 'Fully flexible and refundable business class.',
    status: 'Active',
    version: 5,
  },
];

export default function CatalogPage() {
  const [fareProducts, setFareProducts] = useState<FareProduct[]>(initialFareProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FareProduct | null>(null);
  const { toast } = useToast();
  
  const handleOpenDialog = (product: FareProduct | null = null) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };
  
  const handleFormSubmit = (data: FareProduct) => {
    if (editingProduct) {
      setFareProducts(fareProducts.map((p) => (p.id === editingProduct.id ? { ...p, ...data, version: p.version + 1 } : p)));
      toast({ title: "Product Updated", description: `Product ${data.name} has been successfully updated.` });
    } else {
      const newProduct = { ...data, id: `FP-${String(fareProducts.length + 1).padStart(3, '0')}`, version: 1 };
      setFareProducts([...fareProducts, newProduct]);
       toast({ title: "Product Created", description: `Product ${newProduct.name} has been successfully created.` });
    }
    handleDialogClose();
  };
  
  const handleCreateNewVersion = (product: FareProduct) => {
    const newVersion = {
        ...product,
        id: `${product.id}-v${product.version + 1}`,
        version: product.version + 1,
        status: 'Draft' as const,
    };
    setFareProducts(prev => [newVersion, ...prev]);
    toast({
        title: 'New Draft Version Created',
        description: `A new draft (v${newVersion.version}) of "${product.name}" has been created.`
    })
  };


  return (
    <div className="flex flex-col gap-6">
       <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Catalogue</h1>
        <p className="text-muted-foreground">
          Define fare products, corporate contracts, and sales channels.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fare Products (Brands)</CardTitle>
            <CardDescription>
              Manage the attributes and rules of your fare products.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            New Fare Product
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fareProducts.sort((a, b) => (a.name > b.name) ? 1 : (a.name === b.name) ? (a.version > b.version ? -1 : 1) : -1).map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
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
                  <TableCell>v{product.version}</TableCell>
                  <TableCell>{product.description}</TableCell>
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
                        <DropdownMenuItem>View History</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Fare Product' : 'Create New Fare Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? `Editing product "${editingProduct.name}".` : 'Enter the details for the new fare product.'}
            </DialogDescription>
          </DialogHeader>
          <FareProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
