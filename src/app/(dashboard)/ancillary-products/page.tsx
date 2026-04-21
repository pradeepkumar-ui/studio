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
import { MoreHorizontal, PlusCircle, Store, MapPin, Loader2, Tag, ShieldCheck, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AncillaryProductForm, type AirportAncillary } from '@/components/forms/ancillary-product-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const initialAirportServices: any[] = [
    { id: '1', ancillaryCode: 'LOU01', name: 'LHR Executive Lounge Entry', shortName: 'LHR Lounge', category: 'Lounge', subcategory: 'Lounge day pass', status: 'Active', version: 1, airportCode: 'LHR', owningBusinessUnit: 'Hub Ops', providerName: 'Lounge Stars' },
    { id: '2', ancillaryCode: 'VALET', name: 'VIP Valet Parking', shortName: 'VIP Valet', category: 'Parking', subcategory: 'Valet parking', status: 'Active', version: 1, airportCode: 'JFK', owningBusinessUnit: 'Commercial', providerName: 'Changi Valet' },
]

export default function AirportAncillaryCataloguePage() {
  const firestore = useFirestore();
  const servicesQuery = useMemo(() => firestore ? collection(firestore, 'airportServices') : undefined, [firestore]);
  const { data: servicesCollection, loading } = useCollection(servicesQuery);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<AirportAncillary | null>(null);
  const { toast } = useToast();

  const displayServices = (servicesCollection && servicesCollection.length > 0) 
    ? (servicesCollection as any[]) 
    : initialAirportServices;

  const filteredServices = displayServices.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.ancillaryCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (service: any | null = null) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: AirportAncillary) => {
    if (!firestore) return;
    try {
      if (editingService?.id) {
        const ref = doc(firestore, 'airportServices', editingService.id);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Hub Registry Updated', description: `${data.name} saved successfully.` });
      } else {
        await addDoc(collection(firestore, 'airportServices'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'New Hub SKU', description: `${data.name} published to ecosystem catalogue.` });
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
          <h1 className="text-3xl font-bold tracking-tight">Airport Ancillary Master</h1>
          <p className="text-muted-foreground">Manage authorized ecosystem-wide services, hub deployments, and partner ownership details.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Service Master
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Ecosystem Hub Registry</CardTitle>
            <CardDescription>Centralized registry of exhaustive hub services and partner commercials.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hub registry..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
                <TableHeader className="bg-muted/30">
                <TableRow>
                    <TableHead>Master Identity</TableHead>
                    <TableHead>Categorization</TableHead>
                    <TableHead>Hub Ownership</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredServices.map((service) => (
                    <TableRow key={service.id} className="group cursor-default">
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded group-hover:scale-110 transition-transform">
                                <Store className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <div className="font-bold text-sm">{service.name}</div>
                                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{service.ancillaryCode} • v{service.version || 1}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-0.5">
                            <Badge variant="secondary" className="text-[9px] w-fit uppercase font-black">{service.category}</Badge>
                            <span className="text-[10px] text-muted-foreground italic">{service.subcategory}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-primary">
                                <MapPin className="h-3 w-3" /> {service.airportCode}
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Briefcase className="h-2.5 w-2.5" /> {service.owningBusinessUnit}
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={service.status === 'Active' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase">{service.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground">Service Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(service)}><Tag className="mr-2 h-4 w-4"/>Edit Master Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => service.id && handleDelete(service.id)}>Offboard SKU</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">{editingService ? 'Update Hub Master' : 'Initialize Hub Service Master'}</DialogTitle>
            <DialogDescription>Define core service logic, hub placement, and partner commercials for this ecosystem ancillary.</DialogDescription>
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
