
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Store, MoreHorizontal, Loader2, MapPin, Clock, Smartphone, QrCode, AlertTriangle, Signal, ShieldCheck, Zap, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import { useToast } from '@/hooks/use-toast';
import { AirportInventoryForm, type AirportInventory } from '@/components/forms/airport-inventory-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';

const mockAirportInventory: any[] = [
    { id: '1', ancillaryName: 'Executive Lounge Entry', airportCode: 'LHR', terminal: 'T5', zone: 'North Plaza', supplier: 'Lounge Stars', totalCapacity: 45, available: 12, syncStatus: 'Live', quotas: { CUSS: 10, CUTE: 5, Mobile: 30 }, timeSlotBased: true, operationalMode: 'NORMAL', resourceType: 'Seat' },
    { id: '2', ancillaryName: 'Fast Track Security', airportCode: 'JFK', terminal: 'T4', zone: 'Terminal 4 East', supplier: 'Airport Authority', totalCapacity: 200, available: 45, syncStatus: 'Live', quotas: { CUSS: 50, CUTE: 50, Mobile: 100 }, timeSlotBased: false, operationalMode: 'CONGESTION', resourceType: 'Staff' },
    { id: '3', ancillaryName: 'VIP Valet Parking', airportCode: 'SIN', terminal: 'T1', zone: 'Carpark A', supplier: 'Changi Valet', totalCapacity: 20, available: 0, syncStatus: 'Critical', quotas: { CUSS: 2, CUTE: 2, Mobile: 16 }, timeSlotBased: true, operationalMode: 'NORMAL', resourceType: 'Bay' },
    { id: '4', ancillaryName: 'Sleeping Pod (6h)', airportCode: 'DXB', terminal: 'T3', zone: 'Concourse B', supplier: 'Sleep\'nFly', totalCapacity: 12, available: 2, syncStatus: 'Live', quotas: { CUSS: 0, CUTE: 2, Mobile: 10 }, timeSlotBased: true, operationalMode: 'NORMAL', resourceType: 'Seat' },
    { id: '5', ancillaryName: 'Porter Service', airportCode: 'LHR', terminal: 'T2', zone: 'Arrivals Hall', supplier: 'Baggage Helpers', totalCapacity: 100, available: 12, syncStatus: 'Live', quotas: { CUSS: 20, CUTE: 60, Mobile: 20 }, timeSlotBased: false, operationalMode: 'DISRUPTION', resourceType: 'Staff' },
];

export default function AirportInventoryPage() {
    const firestore = useFirestore();
    const inventoryQuery = useMemo(() => firestore ? collection(firestore, 'airportInventory') : undefined, [firestore]);
    const { data: inventoryCollection, loading } = useCollection(inventoryQuery);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingInventory, setEditingInventory] = useState<any | null>(null);
    const { toast } = useToast();

    const displayInventory = useMemo(() => {
        const sourceData = (inventoryCollection && inventoryCollection.length > 0) ? inventoryCollection as any[] : mockAirportInventory;
        return sourceData.filter(i => 
            i.ancillaryName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            i.airportCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [inventoryCollection, searchTerm]);

    const handleOpenDialog = (item: any | null = null) => {
        setEditingInventory(item);
        setIsDialogOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        if (!firestore) return;
        try {
            if (editingInventory?.id) {
                const ref = doc(firestore, 'airportInventory', editingInventory.id);
                await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
                toast({ title: 'Node Reconciled', description: `Inventory logic updated for ${data.ancillaryName}.` });
            } else {
                await addDoc(collection(firestore, 'airportInventory'), { ...data, createdAt: serverTimestamp() });
                toast({ title: 'New Hub Node Registered', description: `Inventory defined for ${data.ancillaryName}.` });
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
        setIsDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'airportInventory', id));
            toast({ title: 'Node Offboarded', variant: 'destructive' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Airport Ancillary Inventory</h1>
                    <p className="text-muted-foreground font-medium">Manage localized hub capacity, time-slots, and SITA channel orchestration.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="font-bold border-indigo-200 bg-indigo-50 text-indigo-700">
                        <Activity className="mr-2 h-4 w-4" /> Sync All Nodes
                    </Button>
                    <Button onClick={() => handleOpenDialog()} className="font-bold"><PlusCircle className="mr-2 h-4 w-4" /> Register Hub Stock</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { title: 'Total Nodes', value: displayInventory.length, icon: Store, color: 'text-primary' },
                    { title: 'Critical Stock', value: displayInventory.filter(i => i.available < 5).length, icon: AlertTriangle, color: 'text-destructive' },
                    { title: 'Disruption Active', value: displayInventory.filter(i => i.operationalMode === 'DISRUPTION').length, icon: Zap, color: 'text-amber-500' },
                    { title: 'Node Utilization', value: '72%', icon: ShieldCheck, color: 'text-emerald-500' }
                ].map((kpi) => (
                    <Card key={kpi.title} className="p-6">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.title}</p>
                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                        </div>
                        <div className="text-2xl font-black">{kpi.value}</div>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hub Resource Matrix</CardTitle>
                    <CardDescription>Authorize vendor capacity, manage time-sensitive slots, and govern SITA hardware quotas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Filter by service, zone, or partner..." 
                                className="pl-9" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service & Point</TableHead>
                                    <TableHead>Node State</TableHead>
                                    <TableHead>Resource Logic</TableHead>
                                    <TableHead>SITA Quotas</TableHead>
                                    <TableHead>Fulfillment</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayInventory.map((item) => (
                                    <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-secondary rounded">
                                                  <Store className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                  <div className="font-bold text-sm">{item.ancillaryName}</div>
                                                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase font-black">
                                                      <MapPin className="h-2.5 w-2.5" /> {item.airportCode} {item.terminal} • {item.zone}
                                                  </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.operationalMode === 'NORMAL' ? 'default' : (item.operationalMode === 'DISRUPTION' ? 'destructive' : 'secondary')} className="text-[9px] font-black uppercase">
                                                {item.operationalMode}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                              <div className="flex justify-between w-[120px] text-[10px] font-mono">
                                                  <span className={item.available < 5 ? "text-destructive font-black" : "text-emerald-600 font-bold"}>AVL: {item.available}</span>
                                                  <span className="text-muted-foreground">/ {item.totalCapacity}</span>
                                              </div>
                                              <Progress value={(item.available / item.totalCapacity) * 100} className="h-1 w-[120px]" />
                                              {item.timeSlotBased && (
                                                  <div className="flex items-center gap-1 text-[9px] text-blue-600 font-black uppercase">
                                                      <Clock className="h-2.5 w-2.5" /> Time-Sensitive
                                                  </div>
                                              )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                                                    <QrCode className="h-2.5 w-2.5" /> CUSS: {item.quotas?.CUSS || 0}
                                                </div>
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                                                    <Smartphone className="h-2.5 w-2.5" /> App: {item.quotas?.Mobile || 0}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                              <span className="text-[10px] font-bold uppercase">{item.fulfillmentMode || 'Instant'}</span>
                                              <Badge variant="outline" className="text-[8px] h-3.5 w-fit bg-white">{item.syncStatus}</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56">
                                                    <DropdownMenuLabel>Node Management</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleOpenDialog(item)}>Edit Node Config</DropdownMenuItem>
                                                    <DropdownMenuItem><Clock className="mr-2 h-4 w-4"/>Manage Time Slots</DropdownMenuItem>
                                                    <DropdownMenuItem><Zap className="mr-2 h-4 w-4"/>Trigger Disruption State</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(item.id!)}>Relocate Node</DropdownMenuItem>
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
                        <DialogTitle>{editingInventory ? 'Reconcile Hub Node' : 'Initialize Ecosystem Stock'}</DialogTitle>
                        <DialogDescription>Define localized node capacity, slot timing, and SITA touchpoint hardware permissions.</DialogDescription>
                    </DialogHeader>
                    <AirportInventoryForm 
                        inventory={editingInventory} 
                        onSubmit={handleFormSubmit} 
                        onCancel={() => setIsDialogOpen(false)} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

