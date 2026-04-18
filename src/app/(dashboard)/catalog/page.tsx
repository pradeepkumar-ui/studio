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
import { MoreHorizontal, PlusCircle, Loader2, Layers, CheckCircle, FilePenLine } from 'lucide-react';
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
    { id: 'FP-001', name: 'Economy Light', description: 'Basic economy fare with no checked baggage.', status: 'Active', version: 1, refundability: 'Not Allowed', exchangeability: 'Allowed with Penalty', transferability: 'Not Allowed', route: 'JFK → ALL', priceModificationType: 'PERCENTAGE', priceModificationValue: 0, includedAncillaries: [], scopes: [] },
    { id: 'FP-002', name: 'Economy Flex', description: 'Flexible economy fare with seat selection and one checked bag.', status: 'Active', version: 2, refundability: 'Allowed', exchangeability: 'Allowed', transferability: 'Not Allowed', route: 'ALL → LON', priceModificationType: 'ABSOLUTE', priceModificationValue: 50, includedAncillaries: ['ANC-001', 'ANC-002'], scopes: [] },
    { id: 'FP-003', name: 'Business Saver', description: 'Promotional business class fare with some restrictions.', status: 'Active', version: 1, refundability: 'Allowed with Penalty', exchangeability: 'Allowed with Penalty', transferability: 'Not Allowed', route: 'LHR → DXB', priceModificationType: 'PERCENTAGE', priceModificationValue: 10, includedAncillaries: ['ANC-001', 'ANC-002', 'ANC-006'], scopes: [] },
];

export default function CatalogPage() {
  const firestore = useFirestore();
  const productsQuery = useMemo(() => firestore ? collection(firestore, 'fareProducts') : undefined, [firestore]);
  const { data: fareProductsCollection, loading } = useCollection(productsQuery);
  
  const fareProducts = fareProductsCollection ? fareProductsCollection as FareProduct[] : [];
  const displayFareProducts = (fareProducts && fareProducts.length > 0) ? fareProducts : mockFareProducts;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FareProduct | null>(null);
  const { toast } = useToast();
  
  const handleOpenDialog = (product: FareProduct | null = null) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: FareProduct) => {
    if (!firestore) return;
    try {
        if (editingProduct?.id) {
          const productRef = doc(firestore, 'fareProducts', editingProduct.id);
          setDoc(productRef, { ...data, version: editingProduct.version || 1, updatedAt: serverTimestamp() }, { merge: true });
          toast({ title: "Branded Fare Updated", description: `Branded Fare ${data.name} has been successfully updated.` });
        } else {
          addDoc(collection(firestore, 'fareProducts'), { ...data, version: 1, createdAt: serverTimestamp() });
           toast({ title: "Branded Fare Created", description: `Branded Fare ${data.name} added to catalogue.` });
        }
    } catch(e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
       <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Branded Fare Architect</h1>
        <p className="text-muted-foreground">Design commercial brand tiers with integrated ancillaries and dynamic price modifiers.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Branded Products</CardTitle>
            <CardDescription>Manage the service tiers and price mappings for your commercial brands.</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" />Create New Brand</Button>
        </CardHeader>
        <CardContent>
          {loading && displayFareProducts.length === 0 ? (
             <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
           ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Brand Portfolio</TableHead>
                    <TableHead>Network Scope</TableHead>
                    <TableHead>Price Modification</TableHead>
                    <TableHead>Inclusions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {displayFareProducts.map((product) => (
                    <TableRow key={product.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-primary" />
                            <div>
                                <div>{product.name}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">v{product.version} Product</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="text-xs font-mono truncate max-w-[180px]">{product.route}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={(product.priceModificationValue ?? 0) >= 0 ? 'secondary' : 'default'} className="font-mono">
                        {product.priceModificationType === 'PERCENTAGE' ? `${product.priceModificationValue >= 0 ? '+' : ''}${product.priceModificationValue}%` : `${product.priceModificationValue >= 0 ? '+' : '-'}$${Math.abs(product.priceModificationValue || 0)}`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="h-5 text-[10px]">{product.includedAncillaries?.length || 0} Built-in</Badge>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>{product.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(product)}><FilePenLine className="mr-2 h-4 w-4"/>Edit Brand Details</DropdownMenuItem>
                            <DropdownMenuItem><CheckCircle className="mr-2 h-4 w-4"/>View Compliance</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
           )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Modify Brand Architecture' : 'Create New Branded Fare'}</DialogTitle>
            <DialogDescription>Define the commercial positioning, price modifiers, and service inclusions for this brand tier.</DialogDescription>
          </DialogHeader>
          <FareProductForm product={editingProduct} onSubmit={handleFormSubmit} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
