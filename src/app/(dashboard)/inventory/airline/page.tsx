'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Plane, MoreHorizontal, Loader2, Gauge, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
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
import { AirlineInventoryForm, type AirlineInventory } from '@/components/forms/airline-inventory-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';

const mockAirlineInventory: any[] = [
    { id: '1', ancillaryName: 'Extra Legroom Seat', pssCode: 'EXLG', flightNumber: 'AC101', totalCapacity: 12, available: 4, reserved: 2, status: 'Open', aircraftType: 'A350', quotas: { Direct: 8, OTA: 2, GDS: 2 } },
    { id: '2', ancillaryName: 'Gourmet Meal', pssCode: 'MEAL', flightNumber: 'LH450', totalCapacity: 50, available: 5, reserved: 10, status: 'Waitlist', aircraftType: 'B787', quotas: { Direct: 40, OTA: 10, GDS: 0 } },
    { id: '3', ancillaryName: 'Premium Wi-Fi', pssCode: 'WIFI', flightNumber: 'Global', totalCapacity: 500, available: 450, reserved: 5, status: 'Open', aircraftType: 'All', quotas: { Direct: 300, OTA: 100, GDS: 100 } },
    { id: '4', ancillaryName: '1st Checked Bag', pssCode: 'BAG1', flightNumber: 'EK202', totalCapacity: 250, available: 12, reserved: 0, status: 'Open', aircraftType: 'B777', quotas: { Direct: 200, OTA: 50, GDS: 0 } },
    { id: '5', ancillaryName: 'Pet in Cabin', pssCode: 'PETC', flightNumber: 'UA812', totalCapacity: 4, available: 0, reserved: 1, status: 'Closed', aircraftType: 'B787', quotas: { Direct: 4, OTA: 0, GDS: 0 } },
    { id: '6', ancillaryName: 'Standby Upgrade (J)', pssCode: 'UPGS', flightNumber: 'SQ317', totalCapacity: 10, available: 10, reserved: 0, status: 'Open', aircraftType: 'A380', quotas: { Direct: 10, OTA: 0, GDS: 0 } },
    { id: '7', ancillaryName: 'Preferred Zone Seat', pssCode: 'PFRD', flightNumber: 'BA287', totalCapacity: 30, available: 2, reserved: 5, status: 'Waitlist', aircraftType: 'B787', quotas: { Direct: 20, OTA: 5, GDS: 5 } },
];

export default function AirlineInventoryPage() {
    const firestore = useFirestore();
    const inventoryQuery = useMemo(() => firestore ? collection(firestore, 'airlineInventory') : undefined, [firestore]);
    const { data: inventoryCollection, loading } = useCollection(inventoryQuery);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingInventory, setEditingInventory] = useState<any | null>(null);
    const { toast } = useToast();

    const displayInventory = useMemo(() => {
        const sourceData = (inventoryCollection && inventoryCollection.length > 0) ? inventoryCollection as any[] : mockAirlineInventory;
        return sourceData.filter(i => 
            i.ancillaryName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            i.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase())
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
                const ref = doc(firestore, 'airlineInventory', editingInventory.id);
                await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
                toast({ title: 'Inventory Synchronized', description: `Stock updated for ${data.ancillaryName}.` });
            } else {
                await addDoc(collection(firestore, 'airlineInventory'), { ...data, createdAt: serverTimestamp() });
                toast({ title: 'New Stock Registered', description: `Inventory defined for ${data.ancillaryName}.` });
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
        setIsDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'airlineInventory', id));
            toast({ title: 'Inventory Decommissioned', variant: 'destructive' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Airline Ancillary Inventory</h1>
                    <p className="text-muted-foreground font-medium">Exhaustive stock control for carrier-specific ancillaries, fleet assets, and flight segments.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="font-bold"><PlusCircle className="mr-2 h-4 w-4" /> Define Stock Unit</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { title: 'Total SKUs', value: displayInventory.length, icon: Gauge, color: 'text-primary' },
                    { title: 'Waitlisted', value: displayInventory.filter(i => i.status === 'Waitlist').length, icon: AlertTriangle, color: 'text-amber-500' },
                    { title: 'Critical Holds', value: displayInventory.reduce((acc, curr) => acc + (curr.reserved || 0), 0), icon: ShieldCheck, color: 'text-blue-600' },
                    { title: 'PSS Sync Health', value: '100%', icon: Zap, color: 'text-emerald-500' }
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
                    <CardTitle>Carrier Stock Matrix</CardTitle>
                    <CardDescription>Live real-time visibility of flight-specific capacity and multi-channel quotas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by ancillary or flight..." 
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
                                    <TableHead>Ancillary & Context</TableHead>
                                    <TableHead>Flight / Fleet</TableHead>
                                    <TableHead>Capacity Logic</TableHead>
                                    <TableHead>Channel Quotas</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayInventory.map((item) => (
                                    <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-primary/10 rounded">
                                                  <Plane className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                  <div className="font-bold text-sm">{item.ancillaryName}</div>
                                                  <div className="font-mono text-[10px] text-muted-foreground uppercase">{item.pssCode}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                              <span className="text-xs font-bold text-primary">{item.flightNumber}</span>
                                              <span className="text-[10px] text-muted-foreground uppercase font-black">{item.aircraftType}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                              <div className="flex justify-between w-[120px] text-[10px] font-mono">
                                                  <span className="text-emerald-600 font-bold">AVL: {item.available}</span>
                                                  <span className="text-muted-foreground">/ {item.totalCapacity}</span>
                                              </div>
                                              <div className="text-[9px] text-blue-600 font-black">HOLD: {item.reserved}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1.5 flex-wrap max-w-[150px]">
                                                {Object.entries(item.quotas || {}).map(([ch, val]: any) => (
                                                    <Badge key={ch} variant="outline" className="text-[9px] h-4 py-0">{ch}: {val}</Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'Open' ? 'default' : (item.status === 'Waitlist' ? 'secondary' : 'destructive')} className="text-[9px] font-black uppercase">
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56">
                                                    <DropdownMenuLabel>Inventory Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleOpenDialog(item)}>Adjust Capacity</DropdownMenuItem>
                                                    <DropdownMenuItem>Manage Channel Quotas</DropdownMenuItem>
                                                    <DropdownMenuItem>Exception Reallocation</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(item.id!)}>Close Stock</DropdownMenuItem>
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
                        <DialogTitle>{editingInventory ? 'Update Stock Configuration' : 'Register New Ancillary Stock'}</DialogTitle>
                        <DialogDescription>Define precise capacity limits, fleet compatibility, and multi-channel synchronization rules.</DialogDescription>
                    </DialogHeader>
                    <AirlineInventoryForm 
                        inventory={editingInventory} 
                        onSubmit={handleFormSubmit} 
                        onCancel={() => setIsDialogOpen(false)} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}