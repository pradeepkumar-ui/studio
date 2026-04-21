'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Plane, MoreHorizontal, Loader2, Network } from 'lucide-react';
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

const mockAirlines: any[] = [
    { id: '1', name: 'Global Airways', icaoCode: 'GAB', pssType: 'Amadeus', status: 'Active', contactEmail: 'ops@global.com', operatingAirports: ['LHR', 'JFK', 'DXB'] },
    { id: '2', name: 'SkyBridge Airlines', icaoCode: 'SBA', pssType: 'Sabre', status: 'Active', contactEmail: 'pss.tech@skybridge.com', operatingAirports: ['SIN', 'HKG'] },
    { id: '3', name: 'MetroLink Air', icaoCode: 'MLN', pssType: 'Navitaire', status: 'Onboarding', contactEmail: 'metro@ops.net', operatingAirports: ['LHR'] },
];

export default function AirlineOnboardingPage() {
    const firestore = useFirestore();
    const airlinesQuery = useMemo(() => firestore ? collection(firestore, 'airlines') : undefined, [firestore]);
    const { data: airlinesCollection, loading } = useCollection(airlinesQuery);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAirline, setEditingAirline] = useState<AirlineOnboarding | null>(null);
    const { toast } = useToast();

    const displayAirlines = useMemo(() => {
        const sourceData = (airlinesCollection && airlinesCollection.length > 0) 
            ? airlinesCollection as any[] 
            : mockAirlines;
        
        return sourceData.filter(a => 
            a.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            a.icaoCode?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [airlinesCollection, searchTerm]);

    const handleOpenDialog = (airline: any | null = null) => {
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
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Airline Onboarding</h1>
                    <p className="text-muted-foreground">Map carrier PSS systems to ecosystem airport nodes.</p>
                </div>
                <div className="flex items-center gap-2">
                    {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Onboard Airline</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Carrier Network</CardTitle>
                    <CardDescription>Airlines with active retailing permissions and PSS synchronization.</CardDescription>
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
                    
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Airline & Code</TableHead>
                                <TableHead>PSS / Protocol</TableHead>
                                <TableHead>Operating Hubs</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayAirlines.map((airline) => (
                                <TableRow key={airline.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-primary/10 rounded">
                                                <Plane className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{airline.name}</div>
                                                <div className="font-mono text-[10px] text-muted-foreground uppercase">{airline.icaoCode}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{airline.pssType}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">{airline.pnrMessagingType || 'EDIFACT'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {airline.operatingAirports?.map((hub: string) => (
                                            <Badge key={hub} variant="secondary" className="text-[10px] font-mono">{hub}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={airline.status === 'Active' ? 'default' : 'secondary'}>{airline.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleOpenDialog(airline)}>Edit Config</DropdownMenuItem>
                                                <DropdownMenuItem><Network className="mr-2 h-4 w-4"/>Check PSS Sync</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(airline.id!)}>Remove</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingAirline ? 'Update Carrier Sync' : 'Onboard New Carrier'}</DialogTitle>
                        <DialogDescription>Map airline host systems to the ecosystem airport nodes.</DialogDescription>
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
