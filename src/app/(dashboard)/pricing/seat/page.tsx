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
import { useToast } from '@/hooks/use-toast';
import { SeatCharacteristicForm, type SeatCharacteristic } from '@/components/forms/seat-characteristic-form';

const initialSeatCharacteristics: SeatCharacteristic[] = [
    { id: 'SC-001', type: 'Extra Legroom', defaultPrice: 75, currency: 'USD', attributes: 'Forward Zone, Extra Space', status: 'Active' },
    { id: 'SC-002', type: 'Forward Zone', defaultPrice: 40, currency: 'USD', attributes: 'Forward Zone', status: 'Active' },
    { id: 'SC-003', type: 'Window', defaultPrice: 20, currency: 'USD', attributes: 'Window', status: 'Active' },
    { id: 'SC-004', type: 'Aisle', defaultPrice: 20, currency: 'USD', attributes: 'Aisle', status: 'Active' },
    { id: 'SC-005', type: 'Standard', defaultPrice: 0, currency: 'USD', attributes: 'Standard', status: 'Active' },
    { id: 'SC-006', type: 'Bulkhead', defaultPrice: 60, currency: 'USD', attributes: 'Forward Zone, Bassinet', status: 'Inactive' },
];

const mockSeatMaps = [
    { id: 'SM-001', aircraftType: 'A320neo', configCode: '32N-CY174', capacity: 'C12 Y162', status: 'Active' },
    { id: 'SM-002', aircraftType: 'B777-300ER', configCode: '77W-CFY303', capacity: 'F8 C40 Y255', status: 'Active' },
    { id: 'SM-003', aircraftType: 'A350-900', configCode: '359-CJY253', capacity: 'C42 J24 Y187', status: 'Active' },
    { id: 'SM-004', aircraftType: 'B787-9', configCode: '789-CY299', capacity: 'C30 Y269', status: 'Draft' },
];

export default function SeatPricingPage() {
  const [characteristics, setCharacteristics] = useState<SeatCharacteristic[]>(initialSeatCharacteristics);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChar, setEditingChar] = useState<SeatCharacteristic | null>(null);
  const { toast } = useToast();

  const handleOpenForm = (characteristic: SeatCharacteristic | null = null) => {
    setEditingChar(characteristic);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setEditingChar(null);
    setIsFormOpen(false);
  };

  const handleFormSubmit = (data: SeatCharacteristic) => {
    if (editingChar) {
      setCharacteristics(characteristics.map(c => c.id === editingChar.id ? { ...c, ...data } : c));
      toast({ title: 'Seat Characteristic Updated' });
    } else {
      const newChar = { ...data, id: `SC-00${characteristics.length + 1}` };
      setCharacteristics([newChar, ...characteristics]);
      toast({ title: 'Seat Characteristic Created' });
    }
    handleCloseForm();
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === 'Active' ? 'default' : (status === 'Draft' ? 'secondary' : 'outline');
  };

  return (
    <>
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Seat Pricing & Configuration</h1>
        <p className="text-muted-foreground">
          Manage seat types, attributes, pricing, and seat map configurations.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Seat Characteristics</CardTitle>
                <CardDescription>
                    Define the types of seats available and their default pricing.
                </CardDescription>
            </div>
            <Button onClick={() => handleOpenForm()}>
                <PlusCircle className="mr-2" />
                Create Characteristic
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Default Price</TableHead>
                        <TableHead>Attributes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {characteristics.map(char => (
                        <TableRow key={char.id}>
                            <TableCell className="font-medium">{char.type}</TableCell>
                            <TableCell>
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: char.currency }).format(char.defaultPrice)}
                            </TableCell>
                            <TableCell>{char.attributes}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(char.status)}>{char.status}</Badge>
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
                                    <DropdownMenuItem onClick={() => handleOpenForm(char)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>Manage Rules</DropdownMenuItem>
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
                <CardTitle>Seat Maps</CardTitle>
                <CardDescription>
                    Manage seat configurations for different aircraft types.
                </CardDescription>
            </div>
            <Button variant="outline">
                <PlusCircle className="mr-2" />
                New Seat Map
            </Button>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Aircraft Type</TableHead>
                        <TableHead>Config Code</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockSeatMaps.map(map => (
                        <TableRow key={map.id}>
                            <TableCell className="font-medium">{map.aircraftType}</TableCell>
                            <TableCell className="font-mono">{map.configCode}</TableCell>
                            <TableCell>{map.capacity}</TableCell>
                             <TableCell>
                                <Badge variant={getStatusBadgeVariant(map.status)}>{map.status}</Badge>
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
                                    <DropdownMenuItem>View/Edit Map</DropdownMenuItem>
                                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
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

    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingChar ? 'Edit Seat Characteristic' : 'Create New Seat Characteristic'}</DialogTitle>
                <DialogDescription>
                    Define a new type of seat and its default properties.
                </DialogDescription>
            </DialogHeader>
            <SeatCharacteristicForm 
                characteristic={editingChar}
                onSubmit={handleFormSubmit}
                onCancel={handleCloseForm}
            />
        </DialogContent>
    </Dialog>
    </>
  );
}
