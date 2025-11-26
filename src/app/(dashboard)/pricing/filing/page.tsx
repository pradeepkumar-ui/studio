
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
import type { Fare } from '@/components/forms/fare-form';

const mockFares: Fare[] = [
    { id: 'F-001', route: 'JFK-LAX', cabinClass: 'Economy', price: 350, currency: 'USD', status: 'Active', version: 1, fareBasisCode: 'YFLEX', validity: { effectiveDate: new Date(), expiryDate: new Date() }, tripTypes: [], passengerTypes: [] },
    { id: 'F-002', route: 'LHR-DXB', cabinClass: 'Business', price: 2500, currency: 'GBP', status: 'Active', version: 2, fareBasisCode: 'JCLASS', validity: { effectiveDate: new Date(), expiryDate: new Date() }, tripTypes: [], passengerTypes: [] },
    { id: 'F-003', route: 'SIN-HKG', cabinClass: 'Economy', price: 280, currency: 'SGD', status: 'Active', version: 1, fareBasisCode: 'QFLEX', validity: { effectiveDate: new Date(), expiryDate: new Date() }, tripTypes: [], passengerTypes: [] },
];

const mockFilings: FareFiling[] = [
  { id: 'FF-001', fareId: 'F-001', fareIdentifier: 'YFLEX (JFK-LAX)', channel: 'Web', pointOfSale: ['US'], status: 'Active', travelDate: { from: new Date('2025-01-01'), to: new Date('2025-03-31') } },
  { id: 'FF-002', fareId: 'F-002', fareIdentifier: 'JCLASS (LHR-DXB)', channel: 'ALL', pointOfSale: ['ALL'], status: 'Active', travelDate: { from: new Date('2025-01-01'), to: new Date('2025-12-31') } },
  { id: 'FF-003', fareId: 'F-001', fareIdentifier: 'YFLEX (JFK-LAX)', channel: 'TMC', pointOfSale: ['US', 'CA'], status: 'Draft', travelDate: { from: new Date('2025-04-01'), to: new Date('2025-06-30') } },
  { id: 'FF-004', fareId: 'F-003', fareIdentifier: 'QFLEX (SIN-HKG)', channel: 'ALL', pointOfSale: ['SG', 'HK'], status: 'Inactive' },
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
  
  const formatDateRange = (start?: Date, end?: Date) => {
    if (!start || !end) return 'Always Active';
    return `${format(start, 'dd-MMM-yy')} to ${format(end, 'dd-MMM-yy')}`;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Fare Filing</h1>
          <p className="text-muted-foreground">
            Apply base fares to specific market conditions and rules.
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
                <TableHead>Base Fare</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Point of Sale</TableHead>
                <TableHead>Travel Dates</TableHead>
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
                    <div>{filing.fareIdentifier}</div>
                  </TableCell>
                   <TableCell>{filing.channel}</TableCell>
                   <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {filing.pointOfSale?.map(pos => <Badge key={pos} variant="outline">{pos}</Badge>)}
                        </div>
                    </TableCell>
                   <TableCell>{formatDateRange(filing.travelDate?.from, filing.travelDate?.to)}</TableCell>
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
              {editingFiling ? `Editing filing for "${editingFiling.fareIdentifier}".` : 'Apply a base fare to a specific set of conditions.'}
            </DialogDescription>
          </DialogHeader>
          <FareFilingForm
            filing={editingFiling}
            fares={mockFares}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
