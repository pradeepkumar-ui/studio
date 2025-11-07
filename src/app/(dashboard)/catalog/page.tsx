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
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
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
    { id: 'FP-001', name: 'Economy Light', description: 'Basic economy fare with no checked baggage.', status: 'Active', version: 1 },
    { id: 'FP-002', name: 'Economy Flex', description: 'Flexible economy fare with seat selection and one checked bag.', status: 'Active', version: 2 },
    { id: 'FP-003', name: 'Business Saver', description: 'Promotional business class fare with some restrictions.', status: 'Active', version: 1 },
    { id: 'FP-004', name: 'Business Flex', description: 'Fully flexible business class fare with all benefits.', status: 'Draft', version: 1 },
    { id: 'FP-005', name: 'First Class', description: 'Premium first-class experience.', status: 'Active', version: 1 },
];

export default function CatalogPage() {
  const firestore = useFirestore();
  const { data: fareProducts, loading, error } = useCollection(firestore ? collection(firestore, 'fareProducts') : undefined);
  
  const displayFareProducts = !loading && fareProducts && fareProducts.length > 0 ? fareProducts : mockFareProducts;

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
  
  const handleFormSubmit = async (data: FareProduct) => {
    if (!firestore) return;
    try {
        if (editingProduct?.id) {
          const productRef = doc(firestore, 'fareProducts', editingProduct.id);
          await setDoc(productRef, { ...data, version: editingProduct.version || 1 }, { merge: true });
          toast({ title: "Product Updated", description: `Product ${data.name} has been successfully updated.` });
        } else {
          const newProduct = { ...data, version: 1, createdAt: serverTimestamp() };
          await addDoc(collection(firestore, 'fareProducts'), newProduct);
           toast({ title: "Product Created", description: `Product ${newProduct.name} has been successfully created.` });
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
          {loading && (!fareProducts || fareProducts.length === 0) && (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
           )}
           {(!loading || (fareProducts && fareProducts.length > 0)) && !error && (
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
                {displayFareProducts.sort((a, b) => (a.name! > b.name!) ? 1 : (a.name === b.name) ? ((a.version || 0) > (b.version || 0) ? -1 : 1) : -1).map((product) => (
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
           )}
           {error && <p className="text-destructive">Error loading fare products: {error.message}</p>}
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
