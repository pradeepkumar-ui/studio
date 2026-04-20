
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, MonitorDot, MoreHorizontal, Loader2, Plane, Check } from 'lucide-react';
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
import { AirportOnboardingForm, type AirportOnboarding } from '@/components/forms/airport-onboarding-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

const mockAirports: AirportOnboarding[] = [
    { id: '1', name: 'Heathrow Airport', iataCode: 'LHR', location: 'London', status: 'Active', sitaEnabled: true, terminals: 'T2, T3, T4, T5', hardwarePrefix: 'K-LHR', timeZone: 'GMT', technicalContact: 'ops@heathrow.com' },
    { id: '2', name: 'John F. Kennedy', iataCode: 'JFK', location: 'New York', status: 'Active', sitaEnabled: true, terminals: 'T1, T4, T5, T8', hardwarePrefix: 'K-JFK', timeZone: 'EST', technicalContact: 'it@panynj.gov' },
    { id: '3', name: 'Changi Airport', iataCode: 'SIN', location: 'Singapore', status: 'Onboarding', sitaEnabled: true, terminals: 'T1, T2, T3, T4', hardwarePrefix: 'K-SIN', timeZone: 'SGT', technicalContact: 'support@changi.sg' },
];

export default function AirportOnboardingPage() {
    const firestore = useFirestore();
    const airportsQuery = useMemo(() => firestore ? collection(firestore, 'airports') : undefined, [firestore]);
    const airlinesQuery = useMemo(() => firestore ? collection(firestore, 'airlines') : undefined, [firestore]);
    
    const { data: airportsCollection, loading: loadingAirports } = useCollection(airportsQuery);
    const { data: airlinesCollection, loading: loadingAirlines } = useCollection(airlinesQuery);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAirlinesDialogOpen, setIsAirlinesDialogOpen] = useState(false);
    const [editingAirport, setEditingAirport] = useState<AirportOnboarding | null>(null);
    const [selectedAirportForAirlines, setSelectedAirportForAirlines] = useState<AirportOnboarding | null>(null);
    const { toast } = useToast();

    const displayAirports = useMemo(() => {
        const sourceData = (airportsCollection && airportsCollection.length > 0) ? airportsCollection as AirportOnboarding[] : mockAirports;
        return sourceData.filter(a => 
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            a.iataCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [airportsCollection, searchTerm]);

    const handleOpenDialog = (airport: AirportOnboarding | null = null) => {
        setEditingAirport(airport);
        setIsDialogOpen(true);
    };

    const handleOpenAirlinesDialog = (airport: AirportOnboarding) => {
        setSelectedAirportForAirlines(airport);
        setIsAirlinesDialogOpen(true);
    };

    const handleFormSubmit = async (data: AirportOnboarding) => {
        if (!firestore) return;
        try {
            if (editingAirport?.id) {
                const airportRef = doc(firestore, 'airports', editingAirport.id);
                await setDoc(airportRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
                toast({ title: 'Airport Updated', description: `Configuration for ${data.iataCode} has been saved.` });
            } else {
                await addDoc(collection(firestore, 'airports'), { ...data, createdAt: serverTimestamp() });
                toast({ title: 'Airport Onboarded', description: `${data.name} is now registered in the ecosystem.` });
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
        setIsDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'airports', id));
            toast({ title: 'Airport Removed', variant: 'destructive' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    };

    const toggleAirlineForAirport = async (airlineId: string, airportCode: string, isCurrentlyEnabled: boolean) => {
        if (!firestore) return;
        try {
            const airlineRef = doc(firestore, 'airlines', airlineId);
            if (isCurrentlyEnabled) {
                await updateDoc(airlineRef, {
                    operatingAirports: arrayRemove(airportCode)
                });
            } else {
                await updateDoc(airlineRef, {
                    operatingAirports: arrayUnion(airportCode)
                });
            }
            toast({ title: isCurrentlyEnabled ? 'Carrier Disabled' : 'Carrier Enabled', description: `Network permissions updated for ${airportCode}.` });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Update Failed', description: e.message });
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Airport Onboarding</h1>
                    <p className="text-muted-foreground">Manage participating airports and configure SITA hardware/carrier permissions.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="font-bold"><PlusCircle className="mr-2 h-4 w-4" /> Onboard Airport</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Participating Airports</CardTitle>
                    <CardDescription>View and manage airports enabled for Offersense retailing.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name or IATA code..." 
                                className="pl-9" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {loadingAirports ? (
                        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Airport Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>SITA Enabled</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayAirports.map((airport) => (
                                    <TableRow key={airport.id} className="group">
                                        <TableCell className="font-medium">{airport.name}</TableCell>
                                        <TableCell className="font-mono font-bold text-primary">{airport.iataCode}</TableCell>
                                        <TableCell>{airport.location}</TableCell>
                                        <TableCell>
                                            {airport.sitaEnabled ? (
                                                <Badge variant="default" className="bg-blue-500"><MonitorDot className="mr-1 h-3 w-3" /> CUSS/CUTE</Badge>
                                            ) : (
                                                <Badge variant="outline">Web Only</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={airport.status === 'Active' ? 'default' : 'secondary'}>{airport.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56">
                                                    <DropdownMenuLabel>Ecosystem Node Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleOpenAirlinesDialog(airport)}>
                                                        <Plane className="mr-2 h-4 w-4 text-primary" /> Manage Enabled Airlines
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleOpenDialog(airport)}>
                                                        Edit Hardware Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(airport.id!)}>
                                                        Offboard Node
                                                    </DropdownMenuItem>
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

            {/* --- PRIMARY ONBOARDING DIALOG --- */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingAirport ? 'Edit Airport Node' : 'Onboard New Airport'}</DialogTitle>
                        <DialogDescription>Enter the primary details and hardware synchronization logic for the node.</DialogDescription>
                    </DialogHeader>
                    <AirportOnboardingForm 
                        airport={editingAirport} 
                        onSubmit={handleFormSubmit} 
                        onCancel={() => setIsDialogOpen(false)} 
                    />
                </DialogContent>
            </Dialog>

            {/* --- CARRIER ENABLEMENT DIALOG --- */}
            <Dialog open={isAirlinesDialogOpen} onOpenChange={setIsAirlinesDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plane className="h-5 w-5 text-primary" />
                            Carrier Permissions: {selectedAirportForAirlines?.iataCode}
                        </DialogTitle>
                        <DialogDescription>
                            Enable or disable specific carrier retailing at this airport node. Enabling a carrier allows the SITA Broker to sync their PNRs at this location.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <ScrollArea className="h-[400px] rounded-md border p-4">
                            {loadingAirlines ? (
                                <div className="flex justify-center items-center h-full"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                            ) : airlinesCollection && airlinesCollection.length > 0 ? (
                                <div className="space-y-4">
                                    {airlinesCollection.map((airline: any) => {
                                        const isEnabled = airline.operatingAirports?.includes(selectedAirportForAirlines?.iataCode);
                                        return (
                                            <div key={airline.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-xs">
                                                        {airline.icaoCode}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm">{airline.name}</div>
                                                        <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">{airline.pssType} PSS</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {isEnabled && <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">Enabled</Badge>}
                                                    <Checkbox 
                                                        checked={isEnabled} 
                                                        onCheckedChange={() => toggleAirlineForAirport(airline.id, selectedAirportForAirlines!.iataCode, isEnabled)}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2">
                                    <Plane className="h-8 w-8 opacity-20" />
                                    <p className="text-sm">No onboarded carriers found in the global registry.</p>
                                    <Button variant="link" className="text-xs">Go to Airline Onboarding</Button>
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={() => setIsAirlinesDialogOpen(false)}>Close Manager</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
