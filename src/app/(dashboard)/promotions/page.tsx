
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
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const mockPromotions: Promotion[] = [
    { id: 'PRO-001', name: 'Winter Sale', description: '10% off on all flights to Europe', prefix: 'WINTER10', poolSize: 10000, usageType: 'multi', promotionType: 'Discount', discountType: 'Percentage', discountValue: 10, expiryDate: new Date('2025-03-31'), status: 'Active' },
    { id: 'PRO-002', name: 'Business Special', description: '$100 off on business class tickets', prefix: 'BIZ100', poolSize: 5000, usageType: 'single', promotionType: 'Discount', discountType: 'Fixed Amount', discountValue: 100, expiryDate: new Date('2025-06-30'), status: 'Active' },
    { id: 'PRO-003', name: 'Free Bag Offer', description: 'Free first checked bag', prefix: 'FREEBAG', poolSize: 1000, usageType: 'single', promotionType: 'Free Service', freeServices: ['free_baggage_1'], expiryDate: new Date('2025-04-30'), status: 'Draft' },
    { id: 'PRO-004', name: 'Summer Getaway', description: '15% off on all flights', prefix: 'SUMMER15', poolSize: 20000, usageType: 'multi', promotionType: 'Discount', discountType: 'Percentage', discountValue: 15, expiryDate: new Date('2024-09-30'), status: 'Expired' },
    { id: 'PRO-005', name: 'Next Trip Credit', description: '$50 credit for your next booking', prefix: 'NEXT50', poolSize: 500, usageType: 'single', promotionType: 'Future Credit', creditAmount: 50, creditValidityDays: 180, expiryDate: new Date('2025-12-31'), status: 'Active' },
];

export default function PromotionsPage() {
  const firestore = useFirestore();
  const { data: promotionsCollection, loading, error } = useCollection(firestore ? collection(firestore, 'promotions') : undefined);
  
  const promotions = promotionsCollection ? promotionsCollection as Promotion[] : [];
  const displayPromotions = promotions.length > 0 ? promotions : mockPromotions;

  const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const { toast } = useToast();

  const handleOpenPromoDialog = (promo: Promotion | null = null) => {
    setEditingPromotion(promo);
    setIsPromoDialogOpen(true);
  };
  
  const handlePromoDialogClose = () => {
    setIsPromoDialogOpen(false);
    setEditingPromotion(null);
  };

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
  
  const formatDiscount = (promo: Promotion) => {
    switch (promo.promotionType) {
        case 'Discount':
            if (promo.discountType === 'Percentage') {
                return `${promo.discountValue}% Off`;
            }
            return `$${promo.discountValue?.toFixed(2)} Off`;
        case 'Free Service':
            return `Free Service(s)`;
        case 'Future Credit':
            return `$${promo.creditAmount} Future Credit`;
        default:
            return 'N/A';
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Promotions
          </h1>
          <p className="text-muted-foreground">
            Manage promotional codes for marketing campaigns.
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
                    <TableHead>Value</TableHead>
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
                    <TableCell>
                        <Badge variant="outline">{formatDiscount(promo)}</Badge>
                    </TableCell>
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
      
    </div>
  );
}
