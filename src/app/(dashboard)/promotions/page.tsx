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
import { MoreHorizontal, PlusCircle, Import } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PromotionForm, type Promotion } from '@/components/forms/promotion-form';

const initialPromotions: Promotion[] = [
  {
    id: 'PROMO-001',
    name: 'Weekend Special',
    description: '15% off for mobile app purchases in India on weekends.',
    prefix: 'WEEKEND15',
    poolSize: 10000,
    usageType: 'multi',
    status: 'Active',
    expiryDate: new Date('2025-12-31'),
  },
  {
    id: 'PROMO-002',
    name: 'New User Welcome Offer',
    description: '$50 off first booking for new accounts.',
    prefix: 'NEWUSER50',
    poolSize: 50000,
    usageType: 'single',
    status: 'Active',
    expiryDate: new Date('2025-12-31'),
  },
  {
    id: 'PROMO-003',
    name: 'Summer Sale',
    description: 'General summer sale promotion code.',
    prefix: 'SUMMER24',
    poolSize: 100000,
    usageType: 'unlimited',
    status: 'Expired',
    expiryDate: new Date('2024-08-31'),
  },
   {
    id: 'PROMO-004',
    name: 'Corporate Partner Discount',
    description: 'Special discount for corporate partners.',
    prefix: 'CORPBIZ',
    poolSize: 500,
    usageType: 'multi',
    status: 'Draft',
    expiryDate: new Date('2026-06-30'),
  },
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (promo: Promotion | null = null) => {
    setEditingPromotion(promo);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPromotion(null);
  };

  const handleFormSubmit = (data: Promotion) => {
    if (editingPromotion) {
      setPromotions(promotions.map((p) => (p.id === editingPromotion.id ? { ...p, ...data } : p)));
      toast({ title: 'Promotion Updated', description: `Promotion "${data.name}" has been successfully updated.` });
    } else {
      const newPromotion = { ...data, id: `PROMO-${String(promotions.length + 1).padStart(3, '0')}` };
      setPromotions([...promotions, newPromotion]);
      toast({ title: 'Promotion Created', description: `Promotion "${newPromotion.name}" has been successfully created.` });
    }
    handleDialogClose();
  };

  const handleDelete = (promoId: string) => {
    setPromotions(promotions.filter((p) => p.id !== promoId));
    toast({
      variant: 'destructive',
      title: 'Promotion Deleted',
      description: `Promotion with ID ${promoId} has been deleted.`,
    });
  };
  
  const getStatusBadgeVariant = (status: Promotion['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Expired': return 'outline';
      default: return 'outline';
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Promotions & Code Manager
          </h1>
          <p className="text-muted-foreground">
            Create, import, and manage promotional codes and campaigns.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Import className="mr-2" />
            Import Codes
          </Button>
          <Button onClick={() => handleOpenDialog()}>
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
              {promotions.map((promo) => (
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
                    {format(promo.expiryDate, 'PP')}
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
                        <DropdownMenuItem onClick={() => handleOpenDialog(promo)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Codes</DropdownMenuItem>
                        <DropdownMenuItem>Assign to Offer</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(promo.id)}>
                          Delete
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}</DialogTitle>
            <DialogDescription>
              {editingPromotion ? `Editing promotion "${editingPromotion.name}".` : 'Define a new promotional code pool.'}
            </DialogDescription>
          </DialogHeader>
          <PromotionForm
            promotion={editingPromotion}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
