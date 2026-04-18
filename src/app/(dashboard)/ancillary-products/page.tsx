'use client';

import { useState, useMemo } from 'react';
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
import { MoreHorizontal, PlusCircle, Store, MapPin, Loader2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AncillaryProductForm, type AirportService } from '@/components/forms/ancillary-product-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const initialAirportServices: AirportService[] = [
    { id: '1', sku: 'LHR-LOU-T5', name: 'LHR Executive Lounge', category: 'Lounge', providerId: 'V-001', airportCode: 'LHR', terminal: 'T5', price: 45, currency: 'USD', stockType: 'Digital', commissionRate: 15, status: 'Active' },
    { id: '2', sku: 'JFK-VAL-T4', name: 'VIP Valet Parking', category: 'Parking', providerId: 'V-002', airportCode: 'JFK', terminal: 'T4', price: 85, currency: 'USD', stockType: 'Physical', stockLevel: 20, commissionRate: 10, status: 'Active' },
    { id: '3', sku: 'GLB-ECO-01', name: 'Carbon Offset Voucher', category: 'Voucher', providerId: 'V-003', airportCode: 'All', terminal: 'All', price: 10, currency: 'USD', stockType: 'Digital', commissionRate: 5, status: 'Active' },
]

export default function AirportServiceCataloguePage() {
  const firestore = useFirestore();
  const servicesQuery = useMemo(() => firestore ? collection(firestore, 'airportServices') : undefined, [firestore]);
  const { data: servicesCollection, loading } = useCollection(servicesQuery);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<AirportService | null>(null);
  const { toast } = useToast();

  const displayServices = (servicesCollection && servicesCollection.length > 0) 
    ? (servicesCollection as AirportService[]) 
    : initialAirportServices;

  const handleOpenDialog = (service: AirportService | null = null) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: AirportService) => {
    if (!firestore) return;
    try {
      if (editingService?.id) {
        const ref = doc(firestore, 'airportServices', editingService.id);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Service Updated', description: `Service "${data.name}" has been updated.` });
      } else {
        await addDoc(collection(firestore, 'airportServices'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'Service Published', description: `New service "${data.name}" is now live in the ecosystem.` });
      }
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'airportServices', id));
        toast({ title: 'Service Removed', variant: 'destructive' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Airport Service Catalogue</h1>
          <p className="text-muted-foreground">Manage ecosystem-wide non-air services, lounges, and physical inventory.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Publish New Service
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Ecosystem Products</CardTitle>
            <CardDescription>A centralized registry of all airport partner offerings and marketplace services.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && displayServices.length === 0 ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Service & SKU</TableHead>
                    <TableHead>Node Placement</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead className="text-right">Price / Fee</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {displayServices.map((service) => (
                    <TableRow key={service.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-primary" />
                            <div>
                                <div>{service.name}</div>
                                <div className="text-[10px] font-mono text-muted-foreground uppercase">{service.sku}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-semibold">{service.airportCode}</span>
                            <span className="text-[10px] text-muted-foreground">({service.terminal})</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="secondary">{service.category}</Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-1">
                            <Badge variant="outline" className="w-fit text-[9px] uppercase">{service.stockType}</Badge>
                            {service.stockType === 'Physical' && (
                                <div className="text-[10px] text-muted-foreground">Stock: {service.stockLevel || 0}</div>
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: service.currency }).format(service.price)}</div>
                        <div className="text-[10px] text-emerald-600">{service.commissionRate}% Marketplace Fee</div>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(service)}><Tag className="mr-2 h-4 w-4"/>Edit Listing</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => service.id && handleDelete(service.id)}>Offboard Service</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Modify Ecosystem Service' : 'Authorize New Ecosystem Service'}</DialogTitle>
            <DialogDescription>Define the operational placement and commercial terms for this airport partner service.</DialogDescription>
          </DialogHeader>
          <AncillaryProductForm
            product={editingService}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
