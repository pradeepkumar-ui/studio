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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type FareFiling = {
  id: string;
  fareProductId: string;
  fareProductName: string;
  conditions: string;
  status: 'Active' | 'Inactive' | 'Draft';
};

const mockFilings: FareFiling[] = [
  { id: 'FF-001', fareProductId: 'FP-001', fareProductName: 'Economy Light', conditions: 'Route: JFK-LAX, Channel: Web, Dates: 01-Jan to 31-Mar', status: 'Active' },
  { id: 'FF-002', fareProductId: 'FP-002', fareProductName: 'Economy Flex', conditions: 'Market: US-DOM, Channel: All, Dates: All Year', status: 'Active' },
  { id: 'FF-003', fareProductId: 'FP-003', fareProductName: 'Business Saver', conditions: 'Route: LHR-DXB, Channel: TMC, Dates: 01-Apr to 30-Jun', status: 'Draft' },
  { id: 'FF-004', fareProductId: 'FP-005', fareProductName: 'First Class', conditions: 'Route: LHR-JFK, Channel: All, Dates: All Year', status: 'Inactive' },
];

export default function FareFilingPage() {
  const [filings, setFilings] = useState<FareFiling[]>(mockFilings);
  
  const getStatusBadgeVariant = (status: FareFiling['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Inactive': return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Fare Filing</h1>
          <p className="text-muted-foreground">
            Apply Fare Products to specific market conditions and rules.
          </p>
        </div>
        <Button>
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
                <TableHead className="w-[40%]">Conditions</TableHead>
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
                  <TableCell className="text-muted-foreground text-xs">{filing.conditions}</TableCell>
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
                        <DropdownMenuItem>Edit Filing</DropdownMenuItem>
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
    </div>
  );
}
