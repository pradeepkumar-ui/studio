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
import { MoreHorizontal, PlusCircle, Store, MapPin, Loader2, Tag, ShieldCheck, Briefcase, Search, Terminal, Building2, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AncillaryProductForm, type AirportAncillary } from '@/components/forms/ancillary-product-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const initialAirportServices: any[] = [
    { id: '1', ancillaryCode: 'LOU01', name: 'Executive Lounge Access', shortName: 'LHR Lounge', category: 'Lounge', subcategory: 'Lounge day pass', status: 'Active', version: 1, airportCode: 'LHR', providerName: 'Lounge Stars', terminals: 'T5', journeyStage: 'Departure' },
    { id: '2', ancillaryCode: 'VALET', name: 'VIP Valet Parking', shortName: 'VIP Valet', category: 'Parking', subcategory: 'Valet parking', status: 'Active', version: 1, airportCode: 'JFK', providerName: 'Changi Valet', terminals: 'T4', journeyStage: 'Arrival' },
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
    s.ancillaryCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.airportCode?.toLowerCase().includes(searchTerm.toLowerCase())
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
        toast({ title: 'Hub Master Updated', description: `${data.name} saved successfully.` });
      } else {
        await addDoc(collection(firestore, 'airportServices'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'New Hub SKU Published', description: `${data.name} initialized in ecosystem catalogue.` });
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
          <h1 className="text-3xl font-bold tracking-tight text-primary">Airport Ancillary Catalogue</h1>
          <p className="text-muted-foreground">Manage exhaustive partner-driven hub services, terminal placement, and SLA governance.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold">
            <PlusCircle className="mr-2 h-4 w-4" />
            Initialize Hub Master
        </Button>
      </div>

      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5">
            <CardTitle className="text-lg">Hub Service Registry</CardTitle>
            <CardDescription>Centralized governance for authorized ecosystem services and localized hub configuration.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hub registry (name, code, airport)..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9 bg-muted/20"
              />
            </div>
          </div>

          <div className="rounded-xl border border-muted/60 overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/30">
                <TableRow>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest">Master Identity</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest">Ecosystem Placement</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest">Provider Governance</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredServices.map((service) => (
                    <TableRow key={service.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                                <Tag className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-primary">{service.name}</div>
                                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{service.ancillaryCode} • v{service.version || 1}</div>
                                <Badge variant="outline" className="text-[8px] h-3.5 mt-1 bg-white uppercase">{service.category}</Badge>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 font-bold text-xs">
                                <MapPin className="h-3 w-3 text-emerald-600" /> {service.airportCode} / {service.terminals}
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                                <Globe className="h-2.5 w-2.5" /> Stage: {service.journeyStage}
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold">
                                <Building2 className="h-3 w-3 text-muted-foreground" /> {service.providerName}
                            </div>
                            <div className="text-[10px] text-muted-foreground uppercase font-black flex items-center gap-1">
                                <ShieldCheck className="h-2.5 w-2.5 text-blue-500" /> Protocol: {service.confirmationType || 'Instant'}
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={service.status === 'Active' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase tracking-wider">{service.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground">Master Operations</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(service)}><Tag className="mr-2 h-4 w-4"/>Edit Master Details</DropdownMenuItem>
                            <DropdownMenuItem><Briefcase className="mr-2 h-4 w-4"/>Check Partner SLA</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => service.id && handleDelete(service.id)}>Archive SKU</DropdownMenuItem>
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
            <DialogTitle className="text-2xl font-black text-primary">Airport Ancillary Master SKU</DialogTitle>
            <DialogDescription className="font-medium">Define localized hub service logic, terminal placement, and partner commercial governance.</DialogDescription>
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
