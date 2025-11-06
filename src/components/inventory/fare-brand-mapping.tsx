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
    { id: 'FBM-01', brandName: 'Business Flex', mappedClasses: 'J,C', channel: 'All' },
    { id: 'FBM-02', brandName: 'Economy Saver', mappedClasses: 'M,B,Q', channel: 'Website' },
    { id: 'FBM-03', brandName: 'Economy Full', mappedClasses: 'Y', channel: 'All' },
    { id: 'FBM-04', brandName: 'First Class', mappedClasses: 'F', channel: 'All' },
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
    if (editingMapping) {
      setFareBrandMaps(fareBrandMaps.map((m) => (m.id === editingMapping.id ? { ...m, ...data } : m)));
      toast({ title: "Mapping Updated", description: `Mapping for "${data.brandName}" has been updated.` });
    } else {
      const newMapping = { ...data, id: `FBM-${String(fareBrandMaps.length + 1).padStart(2, '0')}` };
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
                                  {fbm.mappedClasses.split(',').map(code => (
                                      <Badge key={code} variant="secondary" className="font-mono">{code}</Badge>
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
