'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import type { Ancillary } from '@/components/forms/ancillary-form';

type Override = {
  id: string;
  condition: string;
  price: number;
  currency: string;
};

const mockOverrides: Override[] = [
  { id: 'OV-01', condition: 'Route: JFK-LAX', price: 40, currency: 'USD' },
  { id: 'OV-02', condition: 'Channel: Airport', price: 50, currency: 'USD' },
  { id: 'OV-03', condition: 'Brand: Economy Saver', price: 35, currency: 'USD' },
  { id: 'OV-04', condition: 'Brand: Economy Flex', price: 0, currency: 'USD' },
];

interface AncillaryOverridesProps {
  ancillary: Ancillary;
}

export function AncillaryOverrides({ ancillary }: AncillaryOverridesProps) {
  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
                Default Price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: ancillary.currency }).format(ancillary.defaultPrice)}
            </p>
            <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Override
            </Button>
        </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Condition</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockOverrides.map((override) => (
            <TableRow key={override.id}>
              <TableCell>
                <Badge variant="secondary">{override.condition}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: override.currency }).format(override.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
