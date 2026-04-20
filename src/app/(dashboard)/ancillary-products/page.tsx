
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
import { MoreHorizontal, PlusCircle, Store, MapPin, Loader2, Tag, Percent, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AncillaryProductForm, type AirportAncillary } from '@/components/forms/ancillary-product-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const initialAirportServices: any[] = [
    { id: '1', sku: 'LHR-LOU-T5', name: 'LHR Executive Lounge', category: 'Lounge - Airport', providerId: 'V-001', airportId: 'LHR', terminal: 'T5', price: 45, currency: 'USD', stockType: 'Digital', commissionRate: 15, status: 'Active', operatingHours: '04:00 - 23:00' },
    { id: '2', sku: 'JFK-VAL-T4', name: 'VIP Valet Parking', category: 'Parking - Valet', providerId: 'V-002', airportId: 'JFK', terminal: 'T4', price: 85, currency: 'USD', stockType: 'Physical', commissionRate: 10, status: 'Active', operatingHours: '24/7' },
]

export default function AirportAncillaryCataloguePage() {
  const firestore = useFirestore();
  const servicesQuery = useMemo(() => firestore ? collection(firestore, 'airportServices') : undefined, [firestore]);
  const { data: servicesCollection, loading } = useCollection(servicesQuery);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<AirportAncillary | null>(null);
  const { toast } = useToast();

  const displayServices = (servicesCollection && servicesCollection.length > 0) 
    ? (servicesCollection as AirportAncillary[]) 
    : initialAirportServices;

  const handleOpenDialog = (service: AirportAncillary | null = null) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: AirportAncillary) => {
    if (!firestore) return;
    try {
      if (editingService?.id) {
        const ref = doc(firestore, 'airportServices', editingService.id);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Registry Updated', description: `${data.name} saved successfully.` });
      } else {
        await addDoc(collection(firestore, 'airportServices'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'New Ecosystem SKU', description: `${data.name} published to hub catalogue.` });
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
        toast({ title: 'Service Offboarded', variant: 'destructive' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Airport Ancillary Catalogue</h1>
          <p className="text-muted-foreground">Manage authorized ecosystem-wide services, terminal deployments, and SITA commission terms.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold">
            <PlusCircle className="mr-2 h-4 w-4" />
            Publish Hub Service
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Ecosystem Marketplace</CardTitle>
            <CardDescription>A centralized registry of all airport partner offerings, deployed per terminal node.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && displayServices.length === 0 ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Service & SKU</TableHead>
                    <TableHead>Deployment Node</TableHead>
                    <TableHead>Ecosystem Logic</TableHead>
                    <TableHead>Service Hours</TableHead>
                    <TableHead className="text-right">Price / Commission</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {displayServices.map((service) => (
                    <TableRow key={service.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded">
                                <Store className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <div className="font-bold">{service.name}</div>
                                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{service.sku}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                            <MapPin className="h-3 w-3 text-primary" />
                            <span className="font-bold">{service.airportId}</span>
                            <span className="text-muted-foreground">({service.terminal})</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-1">
                            <Badge variant="secondary" className="text-[9px] w-fit uppercase font-black">{service.category}</Badge>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Tag className="h-2.5 w-2.5" /> {service.stockType} Fulfillment
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1 text-xs font-medium">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {service.operatingHours || 'N/A'}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="font-black text-primary font-mono">{new Intl.NumberFormat('en-US', { style: 'currency', currency: service.currency || 'USD' }).format(service.price)}</div>
                        <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                            <Percent className="h-2.5 w-2.5" /> {service.commissionRate}% SITA Fee
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Registry Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(service)}><Tag className="mr-2 h-4 w-4"/>Edit Technical Config</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => service.id && handleDelete(service.id)}>Offboard SKU</DropdownMenuItem>
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
            <DialogTitle>{editingService ? 'Update Ecosystem SKU' : 'Publish Exhaustive Hub Service'}</DialogTitle>
            <DialogDescription>Define precise terminal placement, partner commercials, and fulfillment parameters for this ecosystem ancillary.</DialogDescription>
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
