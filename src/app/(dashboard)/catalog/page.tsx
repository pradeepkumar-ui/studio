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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type FareProduct = {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Draft';
  version: number;
};

const initialFareProducts: FareProduct[] = [
  {
    id: 'FP-001',
    name: 'Economy Light',
    description: 'Basic economy fare, no checked bag.',
    status: 'Active',
    version: 2,
  },
  {
    id: 'FP-002',
    name: 'Economy Standard',
    description: 'Includes one checked bag and seat selection.',
    status: 'Active',
    version: 4,
  },
  {
    id: 'FP-003',
    name: 'Economy Flex',
    description: 'Refundable, includes two checked bags.',
    status: 'Active',
    version: 3,
  },
  {
    id: 'FP-004',
    name: 'Business Basic',
    description: 'Non-refundable business class fare.',
    status: 'Draft',
    version: 1,
  },
  {
    id: 'FP-005',
    name: 'Business Flex',
    description: 'Fully flexible and refundable business class.',
    status: 'Active',
    version: 5,
  },
];

export default function CatalogPage() {
  const [fareProducts, setFareProducts] =
    useState<FareProduct[]>(initialFareProducts);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Product Catalogue</h1>
        <p className="text-muted-foreground">
          Define airline products with attributes, validity, and version
          control.
        </p>
      </div>

      <Tabs defaultValue="fare_products">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fare_products">Fare Products</TabsTrigger>
          <TabsTrigger value="ancillaries">Ancillary Services</TabsTrigger>
          <TabsTrigger value="bundles">Product Bundles</TabsTrigger>
        </TabsList>
        <TabsContent value="fare_products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Fare Products (Brands)</CardTitle>
                <CardDescription>
                  Manage the attributes and rules of your fare products.
                </CardDescription>
              </div>
              <Button>
                <PlusCircle className="mr-2" />
                New Fare Product
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead className="w-[40%]">Description</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fareProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === 'Active'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>v{product.version}</TableCell>
                      <TableCell>{product.description}</TableCell>
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
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>
                              Create New Version
                            </DropdownMenuItem>
                            <DropdownMenuItem>View History</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ancillaries">
             <Card>
                 <CardHeader>
                    <CardTitle>Ancillary Services</CardTitle>
                    <CardDescription>Manage individual ancillary products and services.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Ancillary services will be managed here.</p>
                    </div>
                 </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="bundles">
             <Card>
                 <CardHeader>
                    <CardTitle>Product Bundles</CardTitle>
                    <CardDescription>Create and manage bundles of fare products and ancillaries.</CardDescription>
                 </CardHeader>
                 <CardContent>
                     <div className="text-center py-12 text-muted-foreground">
                        <p>Product bundles will be managed here.</p>
                    </div>
                 </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}