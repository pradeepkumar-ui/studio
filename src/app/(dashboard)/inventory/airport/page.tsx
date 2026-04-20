
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Store, MoreHorizontal, Loader2, MapPin, Clock, Smartphone, QrCode } from 'lucide-react';
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

const mockAirportInventory: any[] = [
    { id: '1', ancillaryName: 'Executive Lounge Entry', airportCode: 'LHR', terminal: 'T5', supplier: 'Lounge Stars', totalCapacity: 45, available: 12, syncStatus: 'Live', quotas: { CUSS: 10, CUTE: 5, Mobile: 30 }, timeSlotBased: true },
    { id: '2', ancillaryName: 'Fast Track Security', airportCode: 'JFK', terminal: 'T4', supplier: 'Airport Authority', totalCapacity: 200, available: 45, syncStatus: 'Live', quotas: { CUSS: 50, CUTE: 50, Mobile: 100 }, timeSlotBased: false },
    { id: '3', ancillaryName: 'VIP Valet Parking', airportCode: 'SIN', terminal: 'T1', supplier: 'Changi Valet', totalCapacity: 20, available: 0, syncStatus: 'Critical', quotas: { CUSS: 2, CUTE: 2, Mobile: 16 }, timeSlotBased: true },
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
                toast({ title: 'Inventory Synchronized', description: `Stock updated for ${data.ancillaryName}.` });
            } else {
                await addDoc(collection(firestore, 'airportInventory'), { ...data, createdAt: serverTimestamp() });
                toast({ title: 'New SKU Registered', description: `Inventory defined for ${data.ancillaryName}.` });
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
            toast({ title: 'Inventory Decommissioned', variant: 'destructive' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Airport Ancillary Inventory</h1>
                    <p className="text-muted-foreground font-medium">Coordinate vendor-managed stock across SITA nodes, touchpoints, and time-slots.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="font-bold"><PlusCircle className="mr-2 h-4 w-4" /> Define Hub Stock</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { title: 'Active Vendors', value: new Set(displayInventory.map(i => i.supplier)).size, icon: Store, color: 'text-primary' },
                    { title: 'Out of Stock', value: displayInventory.filter(i => i.available === 0).length, icon: AlertTriangle, color: 'text-destructive' },
                    { title: 'Time-Sensitive', value: displayInventory.filter(i => i.timeSlotBased).length, icon: Clock, color: 'text-blue-600' },
                    { title: 'Sync Health', value: '100%', icon: Signal, color: 'text-emerald-500' }
                ].map((kpi) => (
                    <Card key={kpi.title} className="p-6">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.title}</p>
                            <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                        </div>
                        <div className="text-2xl font-black">{kpi.value}</div>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hub & Vendor Matrix</CardTitle>
                    <CardDescription>Consolidated visibility of airport-based stock across SITA CUSS/CUTE and mobile touchpoints.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by service, airport, or partner..." 
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
                                    <TableHead>Service & Vendor</TableHead>
                                    <TableHead>Deployment Node</TableHead>
                                    <TableHead>Stock Logic</TableHead>
                                    <TableHead>SITA Channel Quotas</TableHead>
                                    <TableHead>Sync Status</TableHead>
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
                                                  <div className="text-[10px] text-muted-foreground uppercase font-black">{item.supplier}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                              <MapPin className="h-3 w-3 text-primary" />
                                              <div>
                                                <span className="text-xs font-bold font-mono">{item.airportCode}</span>
                                                <span className="text-[10px] text-muted-foreground ml-1">({item.terminal})</span>
                                              </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                              <div className="flex justify-between w-[120px] text-[10px] font-mono">
                                                  <span className={cn("font-bold", item.available === 0 ? "text-destructive" : "text-emerald-600")}>AVL: {item.available}</span>
                                                  <span className="text-muted-foreground">/ {item.totalCapacity}</span>
                                              </div>
                                              {item.timeSlotBased && (
                                                  <div className="flex items-center gap-1 text-[9px] text-blue-600 font-black uppercase">
                                                      <Clock className="h-2.5 w-2.5" /> Time-Slot Enabled
                                                  </div>
                                              )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1.5 items-center">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                                                        <QrCode className="h-2.5 w-2.5" /> CUSS: {item.quotas?.CUSS || 0}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                                                        <Smartphone className="h-2.5 w-2.5" /> Mobile: {item.quotas?.Mobile || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.syncStatus === 'Live' ? 'default' : 'destructive'} className="text-[9px] font-black uppercase">
                                                {item.syncStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56">
                                                    <DropdownMenuLabel>Logistics Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleOpenDialog(item)}>Edit Hub Capacity</DropdownMenuItem>
                                                    <DropdownMenuItem>Manage Time Slots</DropdownMenuItem>
                                                    <DropdownMenuItem>Force Sync Reconciliation</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(item.id!)}>Relocate Stock</DropdownMenuItem>
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
                        <DialogTitle>{editingInventory ? 'Modify Hub Inventory' : 'Initialize Hub Stock Node'}</DialogTitle>
                        <DialogDescription>Define vendor-specific capacity, touchpoint quotas, and time-slot constraints for the airport node.</DialogDescription>
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

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
