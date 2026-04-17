'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Plane, MoreHorizontal, Loader2 } from 'lucide-react';
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
import { AirlineOnboardingForm, type AirlineOnboarding } from '@/components/forms/airline-onboarding-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const mockAirlines: AirlineOnboarding[] = [
    { id: '1', name: 'Global Airways', icaoCode: 'GAB', pssType: 'Amadeus', status: 'Active', contactEmail: 'ops@global.com' },
    { id: '2', name: 'SkyBridge Airlines', icaoCode: 'SBA', pssType: 'Sabre', status: 'Active', contactEmail: 'pss.tech@skybridge.com' },
    { id: '3', name: 'MetroLink Air', icaoCode: 'MLN', pssType: 'Navitaire', status: 'Onboarding', contactEmail: 'metro@ops.net' },
    { id: '4', name: 'Legacy Carriers', icaoCode: 'LGC', pssType: 'Custom', status: 'Inactive', contactEmail: 'admin@legacy.com' },
];

export default function AirlineOnboardingPage() {
    const firestore = useFirestore();
    const airlinesQuery = useMemo(() => firestore ? collection(firestore, 'airlines') : undefined, [firestore]);
    const { data: airlinesCollection, loading, error } = useCollection(airlinesQuery);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAirline, setEditingAirline] = useState<AirlineOnboarding | null>(null);
    const { toast } = useToast();

    const displayAirlines = useMemo(() => {
        const sourceData = (airlinesCollection && airlinesCollection.length > 0) ? airlinesCollection as AirlineOnboarding[] : mockAirlines;
        return sourceData.filter(a => 
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            a.icaoCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [airlinesCollection, searchTerm]);

    const handleOpenDialog = (airline: AirlineOnboarding | null = null) => {
        setEditingAirline(airline);
        setIsDialogOpen(true);
    };

    const handleFormSubmit = async (data: AirlineOnboarding) => {
        if (!firestore) return;
        try {
            if (editingAirline?.id) {
                const airlineRef = doc(firestore, 'airlines', editingAirline.id);
                await setDoc(airlineRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
                toast({ title: 'Airline Updated', description: `${data.name} configuration saved.` });
            } else {
                await addDoc(collection(firestore, 'airlines'), { ...data, createdAt: serverTimestamp() });
                toast({ title: 'Airline Onboarded', description: `${data.name} is now active in the ecosystem.` });
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
        setIsDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'airlines', id));
            toast({ title: 'Airline Removed', variant: 'destructive' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Airline Onboarding</h1>
                    <p className="text-muted-foreground">Manage integrated airlines and their Host PSS sync configurations.</p>
                </div>
                <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Onboard Airline</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registered Airlines</CardTitle>
                    <CardDescription>Airlines currently retailing via Offersense Ecosystem.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name or code..." 
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
                                    <TableHead>Airline Name</TableHead>
                                    <TableHead>ICAO Code</TableHead>
                                    <TableHead>PSS System</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayAirlines.map((airline) => (
                                    <TableRow key={airline.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Plane className="h-4 w-4 text-muted-foreground" />
                                                {airline.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono">{airline.icaoCode}</TableCell>
                                        <TableCell>{airline.pssType}</TableCell>
                                        <TableCell>
                                            <Badge variant={airline.status === 'Active' ? 'default' : 'secondary'}>{airline.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleOpenDialog(airline)}>Edit Config</DropdownMenuItem>
                                                    <DropdownMenuItem>Check Host Sync</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(airline.id!)}>Remove</DropdownMenuItem>
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingAirline ? 'Edit Airline' : 'Onboard New Airline'}</DialogTitle>
                        <DialogDescription>Configure Host PSS connectivity for real-time retailing.</DialogDescription>
                    </DialogHeader>
                    <AirlineOnboardingForm 
                        airline={editingAirline} 
                        onSubmit={handleFormSubmit} 
                        onCancel={() => setIsDialogOpen(false)} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
