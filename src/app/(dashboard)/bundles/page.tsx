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
import { BundleForm, type Bundle } from '@/components/forms/bundle-form';

const initialBundles: Bundle[] = [
  {
    id: 'BNDL-001',
    name: 'Business Saver+',
    description: 'Seat, Bag, and Meal for business travelers.',
    status: 'Published',
    scope: 'Brand: Flex, Premium',
    itemCount: 3,
  },
  {
    id: 'BNDL-002',
    name: 'Family Fun Pack',
    description: 'Bags for everyone and seat selection.',
    status: 'Published',
    scope: 'Cohort: Family',
    itemCount: 2,
  },
  {
    id: 'BNDL-003',
    name: 'Weekend Getaway',
    description: 'Late checkout and lounge access.',
    status: 'Draft',
    scope: 'Route: JFK-MIA',
    itemCount: 2,
  },
  {
    id: 'BNDL-004',
    name: 'Long Haul Comfort',
    description: 'Extra legroom seat and priority boarding.',
    status: 'Archived',
    scope: 'Segment > 6 hours',
    itemCount: 2,
  },
];

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>(initialBundles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (bundle: Bundle | null = null) => {
    setEditingBundle(bundle);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingBundle(null);
  };

  const handleFormSubmit = (data: Bundle) => {
    if (editingBundle) {
      setBundles(bundles.map((b) => (b.id === editingBundle.id ? { ...b, ...data } : b)));
      toast({ title: 'Bundle Updated', description: `Bundle "${data.name}" has been updated.` });
    } else {
      const newBundle = { ...data, id: `BNDL-${String(bundles.length + 1).padStart(3, '0')}`, itemCount: data.components?.split(',').length || 0 };
      setBundles([...bundles, newBundle]);
      toast({ title: 'Bundle Created', description: `Bundle "${newBundle.name}" has been created.` });
    }
    handleDialogClose();
  };

  const getStatusBadgeVariant = (status: Bundle['status']) => {
    switch (status) {
      case 'Published':
        return 'default';
      case 'Draft':
        return 'secondary';
      case 'Archived':
        return 'outline';
    }
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Bundles Studio</h1>
          <p className="text-muted-foreground">
            Create, manage, and price ancillary bundles.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2" />
          Create Bundle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bundle Catalogue</CardTitle>
          <CardDescription>
            Manage all ancillary bundles and their rules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bundle Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bundles.map((bundle) => (
                <TableRow key={bundle.id}>
                  <TableCell className="font-medium">{bundle.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(bundle.status)}>
                      {bundle.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{bundle.scope}</TableCell>
                  <TableCell>{bundle.itemCount}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenDialog(bundle)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>View Performance</DropdownMenuItem>
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingBundle ? 'Edit Bundle' : 'Create New Bundle'}</DialogTitle>
            <DialogDescription>
              {editingBundle ? `Editing bundle "${editingBundle.name}".` : 'Define the components, rules, and pricing for a new bundle.'}
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
