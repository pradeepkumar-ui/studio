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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type BookingClass = {
  code: string;
  cabin: 'First' | 'Business' | 'Premium Economy' | 'Economy';
  description: string;
  status: 'Active' | 'Inactive';
};

type FareBrandMap = {
  id: string;
  brandName: string;
  mappedClasses: string[];
  channel: string;
};

const initialBookingClasses: BookingClass[] = [
  { code: 'F', cabin: 'First', description: 'Full Fare First', status: 'Active' },
  { code: 'J', cabin: 'Business', description: 'Full Fare Business', status: 'Active' },
  { code: 'C', cabin: 'Business', description: 'Discounted Business', status: 'Active' },
  { code: 'W', cabin: 'Premium Economy', description: 'Full Fare Premium Economy', status: 'Active' },
  { code: 'Y', cabin: 'Economy', description: 'Full Fare Economy', status: 'Active' },
  { code: 'B', cabin: 'Economy', description: 'Standard Economy', status: 'Active' },
  { code: 'M', cabin: 'Economy', description: 'Standard Economy', status: 'Active' },
  { code: 'Q', cabin: 'Economy', description: 'Discounted Economy', status: 'Inactive' },
];

const initialFareBrandMaps: FareBrandMap[] = [
    { id: 'FBM-01', brandName: 'Business Flex', mappedClasses: ['J', 'C'], channel: 'All' },
    { id: 'FBM-02', brandName: 'Economy Saver', mappedClasses: ['M', 'B', 'Q'], channel: 'Website' },
    { id: 'FBM-03', brandName: 'Economy Full', mappedClasses: ['Y'], channel: 'All' },
    { id: 'FBM-04', brandName: 'First Class', mappedClasses: ['F'], channel: 'All' },
];

export default function InventoryPage() {
  const [bookingClasses, setBookingClasses] = useState<BookingClass[]>(initialBookingClasses);
  const [fareBrandMaps, setFareBrandMaps] = useState<FareBrandMap[]>(initialFareBrandMaps);

  // For simplicity, we are not adding create/edit forms for this module in this step.
  // The buttons are present, but their functionality will be added in a future step.

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Flight & Inventory
          </h1>
          <p className="text-muted-foreground">
            Manage booking classes and map fare brands to booking classes/fare bases.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Booking Classes</CardTitle>
              <CardDescription>
                Define the classes of service for inventory.
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => alert('Create/Edit form for Booking Classes would appear here.')}>
              <PlusCircle className="mr-2" /> Add Class
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Cabin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookingClasses.map((bc) => (
                  <TableRow key={bc.code}>
                    <TableCell className="font-mono">{bc.code}</TableCell>
                    <TableCell>{bc.cabin}</TableCell>
                    <TableCell>
                      <Badge variant={bc.status === 'Active' ? 'default' : 'outline'}>
                        {bc.status}
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
                          <DropdownMenuItem onClick={() => alert('Create/Edit form for Booking Classes would appear here.')}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Change Status</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Fare Brand Mapping</CardTitle>
              <CardDescription>
                Map fare brands to booking classes.
              </CardDescription>
            </div>
             <Button size="sm" onClick={() => alert('Create/Edit form for Fare Brand Mapping would appear here.')}>
              <PlusCircle className="mr-2" /> Add Mapping
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Brand Name</TableHead>
                        <TableHead>Mapped Classes</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fareBrandMaps.map((fbm) => (
                        <TableRow key={fbm.id}>
                            <TableCell className="font-medium">{fbm.brandName}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {fbm.mappedClasses.map(code => (
                                        <Badge key={code} variant="secondary" className="font-mono">{code}</Badge>
                                    ))}
                                </div>
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
                                    <DropdownMenuItem onClick={() => alert('Create/Edit form for Fare Brand Mapping would appear here.')}>Edit Mapping</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
    </div>
  );
}
