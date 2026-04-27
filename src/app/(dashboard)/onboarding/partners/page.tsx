// 'use client';

// import { useState, useMemo } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { PlusCircle, Search, Store, MoreHorizontal, Loader2, MapPin } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from '@/components/ui/dialog';
// import { useToast } from '@/hooks/use-toast';
// import { PartnerOnboardingForm, type PartnerOnboarding } from '@/components/forms/partner-onboarding-form';
// import { useFirestore, useCollection } from '@/firebase';
// import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// const mockPartners: any[] = [
//     { id: '1', name: 'SkyCafe Gourmet', airportCode: 'LHR', terminal: 'T5', category: 'F&B', status: 'Active', contactEmail: 'info@skycafe.co.uk', commissionRate: 12 },
//     { id: '2', name: 'Global Duty Free', airportCode: 'JFK', terminal: 'T4', category: 'Retail', status: 'Active', contactEmail: 'ops@gdf.com', commissionRate: 15 },
//     { id: '3', name: 'Lounge Stars', airportCode: 'SIN', terminal: 'T2', category: 'Services', status: 'Active', contactEmail: 'partner@loungestars.com', commissionRate: 10 },
// ];

// export default function PartnerOnboardingPage() {
//     const firestore = useFirestore();
//     const partnersQuery = useMemo(() => firestore ? collection(firestore, 'partners') : undefined, [firestore]);
//     const { data: partnersCollection, loading } = useCollection(partnersQuery);
    
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [editingPartner, setEditingPartner] = useState<PartnerOnboarding | null>(null);
//     const { toast } = useToast();

//     const displayPartners = useMemo(() => {
//         const sourceData = (partnersCollection && partnersCollection.length > 0) 
//             ? partnersCollection as any[] 
//             : mockPartners;
        
//         return sourceData.filter(p => 
//             p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//             p.airportCode?.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [partnersCollection, searchTerm]);

//     const handleOpenDialog = (partner: any | null = null) => {
//         setEditingPartner(partner);
//         setIsDialogOpen(true);
//     };

//     const handleFormSubmit = async (data: PartnerOnboarding) => {
//         if (!firestore) return;
//         try {
//             if (editingPartner?.id) {
//                 const partnerRef = doc(firestore, 'partners', editingPartner.id);
//                 await setDoc(partnerRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
//                 toast({ title: 'Partner Updated', description: `${data.name} configuration saved.` });
//             } else {
//                 await addDoc(collection(firestore, 'partners'), { ...data, createdAt: serverTimestamp() });
//                 toast({ title: 'Partner Onboarded', description: `${data.name} is now active in the ecosystem.` });
//             }
//         } catch (e: any) {
//             toast({ variant: 'destructive', title: 'Error', description: e.message });
//         }
//         setIsDialogOpen(false);
//     };

//     const handleDelete = async (id: string) => {
//         if (!firestore) return;
//         try {
//             await deleteDoc(doc(firestore, 'partners', id));
//             toast({ title: 'Partner Removed', variant: 'destructive' });
//         } catch (e: any) {
//             toast({ variant: 'destructive', title: 'Error', description: e.message });
//         }
//     };

//     return (
//         <div className="flex flex-col gap-6">
//             <div className="flex items-center justify-between">
//                 <div className="flex flex-col gap-1">
//                     <h1 className="text-3xl font-bold tracking-tight">Partner Onboarding</h1>
//                     <p className="text-muted-foreground">Manage authorized ecosystem vendors and their terminal deployments.</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
//                     <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Onboard Partner</Button>
//                 </div>
//             </div>

//             <Card>
//                 <CardHeader>
//                     <CardTitle>Vendor Directory</CardTitle>
//                     <CardDescription>Vendors providing non-air services across the ecosystem network.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="flex items-center gap-2 mb-4">
//                         <div className="relative flex-1">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                             <Input 
//                                 placeholder="Search by vendor name or airport..." 
//                                 className="pl-9" 
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>
                    
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Vendor Name</TableHead>
//                                 <TableHead>Location (Hub / Node)</TableHead>
//                                 <TableHead>Category</TableHead>
//                                 <TableHead>Yield / Rate</TableHead>
//                                 <TableHead>Status</TableHead>
//                                 <TableHead className="text-right">Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {displayPartners.map((partner) => (
//                                 <TableRow key={partner.id}>
//                                     <TableCell className="font-medium">
//                                         <div className="flex items-center gap-2">
//                                             <Store className="h-4 w-4 text-muted-foreground" />
//                                             {partner.name}
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <div className="flex items-center gap-1.5 font-mono text-[10px]">
//                                             <Badge variant="outline">{partner.airportCode}</Badge>
//                                             <span className="text-muted-foreground">({partner.terminal})</span>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <Badge variant="secondary" className="text-[10px]">{partner.category}</Badge>
//                                     </TableCell>
//                                     <TableCell>
//                                         <div className="text-sm font-medium">{partner.commissionRate}%</div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <Badge variant={partner.status === 'Active' ? 'default' : 'outline'}>{partner.status}</Badge>
//                                     </TableCell>
//                                     <TableCell className="text-right">
//                                         <DropdownMenu>
//                                             <DropdownMenuTrigger asChild>
//                                                 <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
//                                             </DropdownMenuTrigger>
//                                             <DropdownMenuContent align="end" className="w-56">
//                                                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                                                 <DropdownMenuItem onClick={() => handleOpenDialog(partner)}>Edit Deployment</DropdownMenuItem>
//                                                 <DropdownMenuItem><MapPin className="mr-2 h-4 w-4"/>Relocate Vendor</DropdownMenuItem>
//                                                 <DropdownMenuSeparator />
//                                                 <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(partner.id!)}>Offboard</DropdownMenuItem>
//                                             </DropdownMenuContent>
//                                         </DropdownMenu>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </CardContent>
//             </Card>

//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogContent className="max-w-2xl">
//                     <DialogHeader>
//                         <DialogTitle>{editingPartner ? 'Update Vendor Deployment' : 'Authorize New Vendor'}</DialogTitle>
//                         <DialogDescription>Map the vendor to an onboarded airport node and specify terminal placement.</DialogDescription>
//                     </DialogHeader>
//                     <PartnerOnboardingForm 
//                         partner={editingPartner} 
//                         onSubmit={handleFormSubmit} 
//                         onCancel={() => setIsDialogOpen(false)} 
//                     />
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }


'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Store, MoreHorizontal, Loader2, MapPin, Globe, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
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
import { StatsCards } from '@/components/StatsCards/StatsCards';
import { TableFilterBar } from '@/components/TableFilterbar/TableFilterBar';
import { useTableFilters } from '@/hooks/useTableFilters';

const mockPartners: any[] = [
    // { id: '1', name: 'SkyCafe Gourmet', airportCode: 'LHR', terminal: 'T5', category: 'F&B', status: 'Active', contactEmail: 'info@skycafe.co.uk', commissionRate: 12 },
    // { id: '2', name: 'Global Duty Free', airportCode: 'JFK', terminal: 'T4', category: 'Retail', status: 'Active', contactEmail: 'ops@gdf.com', commissionRate: 15 },
    { id: '3', name: 'Lounge', airportCode: 'DEL', terminal: 'T2', category: 'Services', status: 'Active', contactEmail: 'partner@loungestars.com', commissionRate: 10 },
    // { id: '4', name: 'Tech Connect', airportCode: 'DXB', terminal: 'T3', category: 'Tech', status: 'Active', contactEmail: 'info@techconnect.com', commissionRate: 18 },
    // { id: '5', name: 'Duty Free World', airportCode: 'CDG', terminal: 'T2', category: 'Retail', status: 'Onboarding', contactEmail: 'ops@dfw.com', commissionRate: 12 },
    // { id: '6', name: 'Premium Lounge', airportCode: 'FRA', terminal: 'T1', category: 'Services', status: 'Active', contactEmail: 'contact@premiumlounge.com', commissionRate: 14 },
    { id: '7', name: 'Fast Track', airportCode: 'BOM', terminal: 'T2', category: 'Services', status: 'Active', contactEmail: 'ops@fastfood.com', commissionRate: 8 },
    { id: '8', name: 'Parking', airportCode: 'DEL', terminal: 'T1', category: 'Services', status: 'Active', contactEmail: 'info@electronicshub.com', commissionRate: 20 },
];

// ─── Filter Options ───────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = ["F&B", "Retail", "Services", "Tech"].map((v) => ({ label: v, value: v }));
const STATUS_OPTIONS   = ["Active", "Onboarding", "Inactive"].map((v) => ({ label: v, value: v }));
const AIRPORT_OPTIONS  = ["LHR", "JFK", "SIN", "DXB", "CDG", "FRA", "NRT", "HKG"].map((v) => ({ label: v, value: v }));

export default function PartnerOnboardingPage() {
    const firestore = useFirestore();
    const partnersQuery = useMemo(() => firestore ? collection(firestore, 'partners') : undefined, [firestore]);
    const { data: partnersCollection, loading } = useCollection(partnersQuery);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<PartnerOnboarding | null>(null);
    const { toast } = useToast();

    // Get source data
    const sourceData = useMemo(() => {
        return (partnersCollection && partnersCollection.length > 0) 
            ? partnersCollection as any[] 
            : mockPartners;
    }, [partnersCollection]);

    // ─── Dynamic Stats based on actual data ───────────────────────────────────────
    const dynamicStats = useMemo(() => {
        const total = sourceData.length;
        const active = sourceData.filter((p) => p.status === 'Active').length;
        const onboarding = sourceData.filter((p) => p.status === 'Onboarding').length;
        const failedSync = sourceData.filter((p) => p.status === 'Inactive').length;
        
        return [
            { label: "Total Partners", value: total, color: "purple" as const, icon: <Globe /> },
            { label: "Active", value: active, color: "green" as const, icon: <CheckCircle2 /> },
            { label: "Onboarding", value: onboarding, color: "amber" as const, icon: <RefreshCw /> },
            { label: "Failed Sync", value: failedSync, color: "red" as const, icon: <AlertCircle /> },
        ];
    }, [sourceData]);

    // ─── Table Filters Hook ───────────────────────────────────────────────────────
    const {
        searchText,
        setSearchText,
        activeFilters,
        setFilter,
        removeFilter,
        clearAll,
        activeChips,
        filtered,
    } = useTableFilters(sourceData, {
        searchFields: ["name", "airportCode", "category"],
        filterFields: { status: "", category: "", airportCode: "" },
    });

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
        <div className="flex flex-col gap-6 min-h-screen">
            <StatsCards cards={dynamicStats} />

            <TableFilterBar
                searchText={searchText}
                onSearchChange={setSearchText}
                searchPlaceholder="Search by vendor name, airport, or category..."
                dropdowns={[
                    {
                        key: "status",
                        label: "Status",
                        options: STATUS_OPTIONS,
                        value: activeFilters.status ?? "All",
                        onChange: (v) => setFilter("status", v),
                    },
                    {
                        key: "category",
                        label: "Category",
                        options: CATEGORY_OPTIONS,
                        value: activeFilters.category ?? "All",
                        onChange: (v) => setFilter("category", v),
                    },
                    {
                        key: "airportCode",
                        label: "Airport",
                        options: AIRPORT_OPTIONS,
                        value: activeFilters.airportCode ?? "All",
                        onChange: (v) => setFilter("airportCode", v),
                    },
                ]}
                activeChips={activeChips}
                onRemoveChip={(k) => removeFilter(k as keyof any)}
                onClearAll={clearAll}
            />

            <Card className="border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold text-gray-900">Vendor Directory</CardTitle>
                            <CardDescription className="mt-0.5 text-xs text-gray-400">
                                Vendors providing non-air services across the ecosystem network.
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                            <button
                                onClick={() => handleOpenDialog()}
                                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-violet-700"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Onboard Partner
                            </button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-2">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-200 bg-gray-100 hover:bg-gray-100">
                                <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Vendor Name</TableHead>
                                <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Location (Hub / Node)</TableHead>
                                <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Category</TableHead>
                                <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Yield / Rate</TableHead>
                                <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</TableHead>
                                <TableHead className="py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((partner) => (
                                <TableRow key={partner.id} className="transition-colors duration-100 hover:bg-violet-50/60">
                                    <TableCell className="py-3.5">
                                        <div className="flex items-center gap-2">
                                            <Store className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium text-gray-900">{partner.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3.5">
                                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                            <Badge variant="outline" className="border-gray-300 bg-gray-50 text-gray-700">{partner.airportCode}</Badge>
                                            <span className="text-gray-400">({partner.terminal})</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3.5">
                                        <Badge variant="secondary" className="bg-violet-100 text-violet-800 border-violet-200 text-[10px]">
                                            {partner.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-3.5">
                                        <div className="text-sm font-semibold text-gray-900">{partner.commissionRate}%</div>
                                    </TableCell>
                                    <TableCell className="py-3.5">
                                        {partner.status === 'Active' ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
                                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                                Active
                                            </span>
                                        ) : partner.status === 'Onboarding' ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700">
                                                Onboarding
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                Inactive
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-3.5 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600"
                                                >
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-xl border border-gray-100 shadow-xl">
                                                <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                                                    onClick={() => handleOpenDialog(partner)}
                                                >
                                                    Edit Deployment
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-amber-50 hover:text-amber-700">
                                                    <MapPin className="mr-2 h-3.5 w-3.5" />
                                                    Relocate Vendor
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                                                    onClick={() => handleDelete(partner.id!)}
                                                >
                                                    Offboard
                                                </DropdownMenuItem>
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