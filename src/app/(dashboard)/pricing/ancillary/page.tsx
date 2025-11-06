'use client';

import * as React from 'react';
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  ChevronDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AncillaryForm, type Ancillary } from '@/components/forms/ancillary-form';


const initialAncillaries: Ancillary[] = [
  {
    id: 'ANC-001',
    name: '1st Checked Bag (23kg)',
    category: 'Baggage',
    defaultPrice: 35,
    currency: 'USD',
    status: 'Active',
  },
  {
    id: 'ANC-002',
    name: 'Extra Legroom Seat',
    category: 'Seat',
    defaultPrice: 50,
    currency: 'USD',
    status: 'Active',
  },
  {
    id: 'ANC-003',
    name: 'In-flight Wi-Fi',
    category: 'On-board',
    defaultPrice: 8,
    currency: 'USD',
    status: 'Active',
  },
  {
    id: 'ANC-004',
    name: 'Priority Boarding',
    category: 'On-board',
    defaultPrice: 15,
    currency: 'USD',
    status: 'Disabled',
  },
  {
    id: 'ANC-005',
    name: 'Flight Change Fee',
    category: 'Flexibility',
    defaultPrice: 75,
    currency: 'USD',
    status: 'Active',
  },
  {
    id: 'ANC-006',
    name: 'Lounge Access',
    category: 'On-board',
    defaultPrice: 45,
    currency: 'USD',
    status: 'Active',
  },
];

export default function AncillaryPricingPage() {
  const [ancillaries, setAncillaries] = React.useState<Ancillary[]>(initialAncillaries);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingAncillary, setEditingAncillary] = React.useState<Ancillary | null>(null);
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState<{ category: Set<string> }>({
    category: new Set(),
  });

  const handleFilterChange = (category: string) => {
    setFilters((prev) => {
      const newCategories = new Set(prev.category);
      if (newCategories.has(category)) {
        newCategories.delete(category);
      } else {
        newCategories.add(category);
      }
      return { ...prev, category: newCategories };
    });
  };
  
  const handleOpenDialog = (ancillary: Ancillary | null = null) => {
    setEditingAncillary(ancillary);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingAncillary(null);
  };
  
  const handleFormSubmit = (data: Ancillary) => {
    if (editingAncillary) {
      setAncillaries(ancillaries.map((a) => (a.id === editingAncillary.id ? { ...a, ...data } : a)));
      toast({ title: "Ancillary Updated", description: `Ancillary "${data.name}" has been updated.` });
    } else {
      const newAncillary = { ...data, id: `ANC-${String(ancillaries.length + 1).padStart(3, '0')}` };
      setAncillaries([...ancillaries, newAncillary]);
      toast({ title: "Ancillary Created", description: `Ancillary "${newAncillary.name}" has been created.` });
    }
    handleDialogClose();
  };

  const filteredAncillaries = ancillaries
    .filter((anc) =>
      anc.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((anc) =>
      filters.category.size > 0 ? filters.category.has(anc.category) : true
    );

  const getStatusBadgeVariant = (status: Ancillary['status']) => {
    return status === 'Active' ? 'default' : 'outline';
  };

  const toggleStatus = (ancillary: Ancillary) => {
    const newStatus = ancillary.status === 'Active' ? 'Disabled' : 'Active';
    setAncillaries(ancillaries.map(a => a.id === ancillary.id ? {...a, status: newStatus} : a));
    toast({
        title: `Ancillary ${newStatus === 'Active' ? 'Enabled' : 'Disabled'}`,
        description: `"${ancillary.name}" is now ${newStatus.toLowerCase()}.`
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Ancillary Pricing
          </h1>
          <p className="text-muted-foreground">
            Manage pricing and bundling of ancillaries, with per-segment
            toggles and overrides.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2" />
          Create Ancillary
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ancillary Products</CardTitle>
          <CardDescription>
            Manage all ancillary products and their default pricing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ancillaries..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="max-w-sm pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Filter by Category <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {[...new Set(initialAncillaries.map((a) => a.category))].map(
                  (category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={filters.category.has(category)}
                      onCheckedChange={() => handleFilterChange(category)}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ancillary Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Default Price</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAncillaries.length > 0 ? (
                  filteredAncillaries.map((anc) => (
                    <TableRow key={anc.id}>
                      <TableCell className="font-medium">{anc.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{anc.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(anc.status)}>
                          {anc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: anc.currency,
                        }).format(anc.defaultPrice)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
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
                              <DropdownMenuItem onClick={() => handleOpenDialog(anc)}>Edit Price</DropdownMenuItem>
                              <DropdownMenuItem>Manage Bundles</DropdownMenuItem>
                              <DropdownMenuItem>
                                Segment Overrides
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => toggleStatus(anc)}
                                className={anc.status === 'Active' ? 'text-destructive' : ''}
                              >
                                {anc.status === 'Active' ? 'Disable' : 'Enable'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{editingAncillary ? 'Edit Ancillary' : 'Create New Ancillary'}</DialogTitle>
                  <DialogDescription>
                      {editingAncillary ? `Editing ancillary "${editingAncillary.name}".` : 'Define a new ancillary product.'}
                  </DialogDescription>
              </DialogHeader>
              <AncillaryForm 
                  ancillary={editingAncillary}
                  onSubmit={handleFormSubmit}
                  onCancel={handleDialogClose}
              />
          </DialogContent>
      </Dialog>
    </div>
  );
}
