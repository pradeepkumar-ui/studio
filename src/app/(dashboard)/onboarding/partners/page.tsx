'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Store, MoreHorizontal, Loader2, MapPin } from 'lucide-react';
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
import { PartnerOnboardingForm, type PartnerOnboarding } from '@/components/forms/partner-onboarding-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const mockPartners: any[] = [
    { id: '1', name: 'SkyCafe Gourmet', airportCode: 'LHR', terminal: 'T5', category: 'F&B', status: 'Active', contactEmail: 'info@skycafe.co.uk', commissionRate: 12 },
    { id: '2', name: 'Global Duty Free', airportCode: 'JFK', terminal: 'T4', category: 'Retail', status: 'Active', contactEmail: 'ops@gdf.com', commissionRate: 15 },
    { id: '3', name: 'Lounge Stars', airportCode: 'SIN', terminal: 'T2', category: 'Services', status: 'Active', contactEmail: 'partner@loungestars.com', commissionRate: 10 },
];

export default function PartnerOnboardingPage() {
    const firestore = useFirestore();
    const partnersQuery = useMemo(() => firestore ? collection(firestore, 'partners') : undefined, [firestore]);
    const { data: partnersCollection, loading } = useCollection(partnersQuery);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<PartnerOnboarding | null>(null);
    const { toast } = useToast();

    // PERFORMANCE: Immediate UI Pattern - defaults to mock data while loading
    const displayPartners = useMemo(() => {
        const sourceData = (partnersCollection && partnersCollection.length > 0) 
            ? partnersCollection as any[] 
            : mockPartners;
        
        return sourceData.filter(p => 
            p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.airportCode?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [partnersCollection, searchTerm]);

    const handleOpenDialog = (partner: any | null = null) => {
        setEditingPartner(partner);
        setIsDialogOpen(true);
    };

    const handleFormSubmit = async (data: PartnerOnboarding) => {
        if (!firestore) return;
        try {
            if (editingPartner?.id) {
                const partnerRef = doc(firestore, 'partners', editingPartner.id);
                await setDoc(partnerRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
                toast({ title: 'Partner Updated', description: `${data.name} configuration saved.` });
            } else {
                await addDoc(collection(firestore, 'partners'), { ...data, createdAt: serverTimestamp() });
                toast({ title: 'Partner Onboarded', description: `${data.name} is now active in the ecosystem.` });
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
        setIsDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'partners', id));
            toast({ title: 'Partner Removed', variant: 'destructive' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Partner Onboarding</h1>
                    <p className="text-muted-foreground">Manage authorized ecosystem vendors and their terminal deployments.</p>
                </div>
                <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Onboard Partner</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vendor Directory</CardTitle>
                    <CardDescription>Vendors providing non-air services across the ecosystem network.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by vendor name or airport..." 
                                className="pl-9" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* OPTIMIZATION: Instant UI rendering */}
                    {loading && partnersCollection === null ? (
                        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vendor Name</TableHead>
                                    <TableHead>Location (Hub / Node)</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Yield / Rate</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayPartners.map((partner) => (
                                    <TableRow key={partner.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Store className="h-4 w-4 text-muted-foreground" />
                                                {partner.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                              <Badge variant="outline">{partner.airportCode}</Badge>
                                              <span className="text-muted-foreground">({partner.terminal})</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                          <Badge variant="secondary" className="text-[10px]">{partner.category}</Badge>
                                        </TableCell>
                                        <TableCell>
                                          <div className="text-sm font-medium">{partner.commissionRate}%</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={partner.status === 'Active' ? 'default' : 'outline'}>{partner.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleOpenDialog(partner)}>Edit Deployment</DropdownMenuItem>
                                                    <DropdownMenuItem><MapPin className="mr-2 h-4 w-4"/>Relocate Vendor</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(partner.id!)}>Offboard</DropdownMenuItem>
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingPartner ? 'Update Vendor Deployment' : 'Authorize New Vendor'}</DialogTitle>
                        <DialogDescription>Map the vendor to an onboarded airport node and specify terminal placement.</DialogDescription>
                    </DialogHeader>
                    <PartnerOnboardingForm 
                        partner={editingPartner} 
                        onSubmit={handleFormSubmit} 
                        onCancel={() => setIsDialogOpen(false)} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
