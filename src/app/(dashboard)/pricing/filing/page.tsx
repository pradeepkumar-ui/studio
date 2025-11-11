
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
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { FareFilingForm, type FareFiling } from '@/components/forms/fare-filing-form';
import type { FareProduct } from '@/components/forms/fare-product-form';

const mockFareProducts: FareProduct[] = [
    { id: 'FP-001', name: 'Economy Light', description: 'Basic economy fare with no checked baggage.', status: 'Active', version: 1, refundability: 'Not Allowed', exchangeability: 'Allowed with Penalty', transferability: 'Not Allowed' },
    { id: 'FP-002', name: 'Economy Flex', description: 'Flexible economy fare with seat selection and one checked bag.', status: 'Active', version: 2, refundability: 'Allowed', exchangeability: 'Allowed', transferability: 'Not Allowed' },
    { id: 'FP-003', name: 'Business Saver', description: 'Promotional business class fare with some restrictions.', status: 'Active', version: 1, refundability: 'Allowed with Penalty', exchangeability: 'Allowed with Penalty', transferability: 'Not Allowed' },
    { id: 'FP-004', name: 'Business Flex', description: 'Fully flexible business class fare with all benefits.', status: 'Draft', version: 1, refundability: 'Allowed', exchangeability: 'Allowed', transferability: 'Allowed' },
    { id: 'FP-005', name: 'First Class', description: 'Premium first-class experience.', status: 'Active', version: 1, refundability: 'Allowed', exchangeability: 'Allowed', transferability: 'Allowed' },
];


const mockFilings: FareFiling[] = [
  { id: 'FF-001', fareProductId: 'FP-001', fareProductName: 'Economy Light', route: 'JFK-LAX', channel: 'Web', effectiveDate: new Date('2025-01-01'), expiryDate: new Date('2025-03-31'), status: 'Active' },
  { id: 'FF-002', fareProductId: 'FP-002', fareProductName: 'Economy Flex', route: 'US-DOM', channel: 'ALL', effectiveDate: new Date('2025-01-01'), expiryDate: new Date('2025-12-31'), status: 'Active' },
  { id: 'FF-003', fareProductId: 'FP-003', fareProductName: 'Business Saver', route: 'LHR-DXB', channel: 'TMC', effectiveDate: new Date('2025-04-01'), expiryDate: new Date('2025-06-30'), status: 'Draft' },
  { id: 'FF-004', fareProductId: 'FP-005', fareProductName: 'First Class', route: 'LHR-JFK', channel: 'ALL', effectiveDate: new Date('2025-01-01'), expiryDate: new Date('2025-12-31'), status: 'Inactive' },
];

export default function FareFilingPage() {
  const [filings, setFilings] = useState<FareFiling[]>(mockFilings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFiling, setEditingFiling] = useState<FareFiling | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (filing: FareFiling | null = null) => {
    setEditingFiling(filing);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingFiling(null);
  };

  const handleFormSubmit = (data: FareFiling) => {
    if (editingFiling) {
      setFilings(filings.map((f) => (f.id === editingFiling.id ? { ...f, ...data } : f)));
      toast({ title: 'Filing Updated', description: 'The fare filing has been successfully updated.' });
    } else {
      const newFiling = { ...data, id: `FF-00${filings.length + 1}` };
      setFilings([newFiling, ...filings]);
      toast({ title: 'Filing Created', description: 'The new fare filing has been successfully created.' });
    }
    handleDialogClose();
  };
  
  const getStatusBadgeVariant = (status: FareFiling['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Inactive': return 'outline';
    }
  };
  
  const formatDateRange = (start: Date, end: Date) => {
    return `${format(start, 'dd-MMM-yy')} to ${format(end, 'dd-MMM-yy')}`;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Fare Filing</h1>
          <p className="text-muted-foreground">
            Apply Fare Products to specific market conditions and rules.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2" />
          Create Filing
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fare Filings</CardTitle>
          <CardDescription>
            Manage all active and pending fare filings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fare Product</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filings.map((filing) => (
                <TableRow key={filing.id}>
                  <TableCell className="font-medium">
                    <div>{filing.fareProductName}</div>
                    <div className="text-xs text-muted-foreground font-mono">{filing.fareProductId}</div>
                  </TableCell>
                  <TableCell>{filing.route}</TableCell>
                   <TableCell>{filing.channel}</TableCell>
                   <TableCell>{formatDateRange(filing.effectiveDate, filing.expiryDate)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(filing.status)}>
                      {filing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog(filing)}>Edit Filing</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
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
            <DialogTitle>{editingFiling ? 'Edit Fare Filing' : 'Create New Fare Filing'}</DialogTitle>
            <DialogDescription>
              {editingFiling ? `Editing filing for "${editingFiling.fareProductName}".` : 'Apply a fare product to a specific set of conditions.'}
            </DialogDescription>
          </DialogHeader>
          <FareFilingForm
            filing={editingFiling}
            fareProducts={mockFareProducts}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
