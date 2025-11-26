
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
import { PromotionAssignmentForm, type UserPromotionMapping } from '@/components/forms/promotion-assignment-form';
import type { Promotion } from '@/components/forms/promotion-form';

const mockUsers = [
    { id: 'USR-001', name: 'John Doe', email: 'john.doe@example.com' },
    { id: 'USR-002', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: 'USR-003', name: 'Alice Johnson', email: 'alice.j@corporate.com' },
];

const mockPromotions: Promotion[] = [
    { id: 'PRO-001', name: 'Winter Sale', description: '10% off on all flights to Europe', prefix: 'WINTER10', poolSize: 10000, usageType: 'multi', promotionType: 'Discount', discountType: 'Percentage', discountValue: 10, expiryDate: new Date('2025-03-31'), status: 'Active' },
    { id: 'PRO-002', name: 'Business Special', description: '$100 off on business class tickets', prefix: 'BIZ100', poolSize: 5000, usageType: 'single', promotionType: 'Discount', discountType: 'Fixed Amount', discountValue: 100, expiryDate: new Date('2025-06-30'), status: 'Active' },
    { id: 'PRO-005', name: 'Next Trip Credit', description: '$50 credit for your next booking', prefix: 'NEXT50', poolSize: 500, usageType: 'single', promotionType: 'Future Credit', creditAmount: 50, creditValidityDays: 180, expiryDate: new Date('2025-12-31'), status: 'Active' },
];

const initialMappings: UserPromotionMapping[] = [
    { id: 'MAP-001', userId: 'USR-001', promotionIds: ['PRO-001'], lastUpdated: '2025-10-26T10:00:00Z' },
    { id: 'MAP-002', userId: 'USR-003', promotionIds: ['PRO-002', 'PRO-005'], lastUpdated: '2025-10-25T14:30:00Z' },
];

export default function PromotionAssignmentPage() {
  const [mappings, setMappings] = useState<UserPromotionMapping[]>(initialMappings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<UserPromotionMapping | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (mapping: UserPromotionMapping | null = null) => {
    setEditingMapping(mapping);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingMapping(null);
  };

  const handleFormSubmit = (data: Omit<UserPromotionMapping, 'id' | 'lastUpdated'>) => {
    if (editingMapping) {
      setMappings(mappings.map(m => m.id === editingMapping.id ? { ...m, ...data, lastUpdated: new Date().toISOString() } : m));
      toast({ title: 'Mapping Updated' });
    } else {
      const existingMappingIndex = mappings.findIndex(m => m.userId === data.userId);
      if (existingMappingIndex !== -1) {
         setMappings(mappings.map((m, index) => index === existingMappingIndex ? { ...m, promotionIds: [...new Set([...m.promotionIds, ...data.promotionIds])], lastUpdated: new Date().toISOString() } : m));
         toast({ title: 'Promotions Added to User' });
      } else {
        const newMapping = { ...data, id: `MAP-00${mappings.length + 1}`, lastUpdated: new Date().toISOString() };
        setMappings([newMapping, ...mappings]);
        toast({ title: 'Mapping Created' });
      }
    }
    handleDialogClose();
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Promotion Assignment
            </h1>
            <p className="text-muted-foreground">
              Map specific promotions to users or user groups.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            Map Promotion
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Promotion Mappings</CardTitle>
            <CardDescription>
              A list of all users and their assigned promotions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Assigned Promotions</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping) => {
                    const user = mockUsers.find(u => u.id === mapping.userId);
                    return (
                        <TableRow key={mapping.id}>
                            <TableCell className="font-medium">
                                <div>{user?.name}</div>
                                <div className="text-xs text-muted-foreground">{user?.email}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {mapping.promotionIds.map(promoId => {
                                        const promo = mockPromotions.find(p => p.id === promoId);
                                        return <Badge key={promoId} variant="outline">{promo?.name || promoId}</Badge>
                                    })}
                                </div>
                            </TableCell>
                            <TableCell>{new Date(mapping.lastUpdated).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleOpenDialog(mapping)}>
                                    Edit Mapping
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                    Clear All
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMapping ? 'Edit Promotion Mapping' : 'Map Promotions to User'}</DialogTitle>
            <DialogDescription>
              Select a user and the promotions you want to assign.
            </DialogDescription>
          </DialogHeader>
          <PromotionAssignmentForm
            mapping={editingMapping}
            users={mockUsers}
            promotions={mockPromotions}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
