
'use client';

import * as React from 'react';
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useToast } from '@/hooks/use-toast';
import type { Ancillary } from '@/components/forms/ancillary-form';

const initialAncillaries: (Ancillary & { overrideCount: number })[] = [
  {
    id: 'ANC-001',
    name: '1st Checked Bag (23kg)',
    category: 'Baggage',
    defaultPrice: 35,
    currency: 'USD',
    status: 'Active',
    overrideCount: 2,
  },
  {
    id: 'ANC-002',
    name: 'Extra Legroom Seat',
    category: 'Seat',
    defaultPrice: 50,
    currency: 'USD',
    status: 'Active',
    overrideCount: 1,
  },
  {
    id: 'ANC-003',
    name: 'In-flight Wi-Fi',
    category: 'On-board',
    defaultPrice: 8,
    currency: 'USD',
    status: 'Active',
    overrideCount: 0,
  },
  {
    id: 'ANC-004',
    name: 'Priority Boarding',
    category: 'On-board',
    defaultPrice: 15,
    currency: 'USD',
    status: 'Disabled',
    overrideCount: 0,
  },
  {
    id: 'ANC-005',
    name: 'Flight Change Fee',
    category: 'Flexibility',
    defaultPrice: 75,
    currency: 'USD',
    status: 'Active',
    overrideCount: 1,
  },
  {
    id: 'ANC-006',
    name: 'Lounge Access',
    category: 'On-board',
    defaultPrice: 45,
    currency: 'USD',
    status: 'Active',
    overrideCount: 3,
  },
];

export default function AncillaryPricingPage() {
  const [ancillaries] = React.useState<(Ancillary & { overrideCount: number })[]>(initialAncillaries);
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Ancillary Pricing
          </h1>
          <p className="text-muted-foreground">
            Manage dynamic pricing rules and overrides for ancillary products.
          </p>
        </div>
        <Button asChild>
          <Link href="/pricing/rules">
            <PlusCircle className="mr-2" />
            Manage Pricing Rules
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ancillary Pricing Overview</CardTitle>
          <CardDescription>
            A summary of all ancillary products and their active pricing overrides.
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
                  <TableHead>Pricing Overrides</TableHead>
                  <TableHead className="text-right">Default Price</TableHead>
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
                      <TableCell>
                        <Badge variant={anc.overrideCount > 0 ? 'default' : 'outline'}>{anc.overrideCount} Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: anc.currency,
                        }).format(anc.defaultPrice)}
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
    </div>
  );
}
