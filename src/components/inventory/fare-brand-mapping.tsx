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
import { FareBrandMappingForm, type FareBrandMap } from '@/components/forms/fare-brand-mapping-form';


const initialFareBrandMaps: FareBrandMap[] = [
    { id: 'FBM-01', brandName: 'Business Flex', mappedClasses: ['J', 'C', 'D'], channel: 'All' },
    { id: 'FBM-02', brandName: 'Business Saver', mappedClasses: ['I', 'Z'], channel: 'All' },
    { id: 'FBM-03', brandName: 'Premium Flex', mappedClasses: ['W', 'S'], channel: 'All' },
    { id: 'FBM-04', brandName: 'Premium Saver', mappedClasses: ['E', 'N'], channel: 'All' },
    { id: 'FBM-05', brandName: 'Economy Flex', mappedClasses: ['Y', 'B', 'M'], channel: 'All' },
    { id: 'FBM-06', brandName: 'Economy Saver', mappedClasses: ['H', 'K', 'L'], channel: 'Website' },
    { id: 'FBM-07', brandName: 'Economy Basic', mappedClasses: ['Q', 'T', 'V'], channel: 'Website' },
    { id: 'FBM-08', brandName: 'First Class', mappedClasses: ['F', 'A'], channel: 'All' },
    { id: 'FBM-09', brandName: 'Corporate Fares', mappedClasses: ['Y', 'B', 'J', 'C'], channel: 'TMC' },
    { id: 'FBM-10', brandName: 'Web Promo', mappedClasses: ['G', 'O'], channel: 'Website' },
];

export function FareBrandMapping() {
  const [fareBrandMaps, setFareBrandMaps] = useState<FareBrandMap[]>(initialFareBrandMaps);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<FareBrandMap | null>(null);
  const { toast } = useToast();
  
  const handleOpenDialog = (mapping: FareBrandMap | null = null) => {
    setEditingMapping(mapping);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingMapping(null);
  };
  
  const handleFormSubmit = (data: FareBrandMap) => {
    // In a real app, you'd also handle the object to array conversion for mappedClasses
    const submissionData = {
        ...data,
        mappedClasses: data.mappedClasses.map(c => c.value)
    }

    if (editingMapping) {
      setFareBrandMaps(fareBrandMaps.map((m) => (m.id === editingMapping.id ? { ...m, ...submissionData } : m)));
      toast({ title: "Mapping Updated", description: `Mapping for "${data.brandName}" has been updated.` });
    } else {
      const newMapping = { ...submissionData, id: `FBM-${String(fareBrandMaps.length + 1).padStart(2, '0')}` };
      setFareBrandMaps([...fareBrandMaps, newMapping]);
      toast({ title: "Mapping Created", description: `Mapping for "${newMapping.brandName}" has been created.` });
    }
    handleDialogClose();
  };

  const handleDelete = (id: string) => {
    setFareBrandMaps(fareBrandMaps.filter(m => m.id !== id));
    toast({ variant: 'destructive', title: 'Mapping Deleted', description: 'The fare brand mapping has been deleted.'});
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fare Brand Mapping</CardTitle>
            <CardDescription>Map fare brands to booking classes.</CardDescription>
          </div>
          <Button size="sm" onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Mapping
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
                                  {Array.isArray(fbm.mappedClasses) && fbm.mappedClasses.map(code => (
                                      <Badge key={code.value || code} variant="secondary" className="font-mono">{code.value || code}</Badge>
                                  ))}
                              </div>
                          </TableCell>
                          <TableCell>
                              <div className="flex justify-end">
                                <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                      <Button aria-haspopup="true" size="icon" variant="ghost">
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">Toggle menu</span>
                                      </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem onClick={() => handleOpenDialog(fbm)}>Edit Mapping</DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(fbm.id!)}>Delete</DropdownMenuItem>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                              </div>
                          </TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingMapping ? 'Edit Fare Brand Mapping' : 'Create New Fare Brand Mapping'}</DialogTitle>
                <DialogDescription>
                    {editingMapping ? `Editing mapping for "${editingMapping.brandName}".` : 'Define a new fare brand to booking class mapping.'}
                </DialogDescription>
            </DialogHeader>
            <FareBrandMappingForm
                mapping={editingMapping}
                onSubmit={handleFormSubmit}
                onCancel={handleDialogClose}
            />
        </DialogContent>
      </Dialog>
    </>
  );
}
