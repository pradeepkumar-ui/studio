// 'use client';

// import { useState, useMemo } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { PlusCircle, Search, Plane, MoreHorizontal, Loader2, Network } from 'lucide-react';
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
// import { AirlineOnboardingForm, type AirlineOnboarding } from '@/components/forms/airline-onboarding-form';
// import { useFirestore, useCollection } from '@/firebase';
// import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// const mockAirlines: any[] = [
//     { id: '1', name: 'Global Airways', icaoCode: 'GAB', pssType: 'Amadeus', status: 'Active', contactEmail: 'ops@global.com', operatingAirports: ['LHR', 'JFK', 'DXB'] },
//     { id: '2', name: 'SkyBridge Airlines', icaoCode: 'SBA', pssType: 'Sabre', status: 'Active', contactEmail: 'pss.tech@skybridge.com', operatingAirports: ['SIN', 'HKG'] },
//     { id: '3', name: 'MetroLink Air', icaoCode: 'MLN', pssType: 'Navitaire', status: 'Onboarding', contactEmail: 'metro@ops.net', operatingAirports: ['LHR'] },
// ];

// export default function AirlineOnboardingPage() {
//     const firestore = useFirestore();
//     const airlinesQuery = useMemo(() => firestore ? collection(firestore, 'airlines') : undefined, [firestore]);
//     const { data: airlinesCollection, loading } = useCollection(airlinesQuery);
    
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [editingAirline, setEditingAirline] = useState<AirlineOnboarding | null>(null);
//     const { toast } = useToast();

//     const displayAirlines = useMemo(() => {
//         const sourceData = (airlinesCollection && airlinesCollection.length > 0) 
//             ? airlinesCollection as any[] 
//             : mockAirlines;
        
//         return sourceData.filter(a => 
//             a.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//             a.icaoCode?.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [airlinesCollection, searchTerm]);

//     const handleOpenDialog = (airline: any | null = null) => {
//         setEditingAirline(airline);
//         setIsDialogOpen(true);
//     };

//     const handleFormSubmit = async (data: AirlineOnboarding) => {
//         if (!firestore) return;
//         try {
//             if (editingAirline?.id) {
//                 const airlineRef = doc(firestore, 'airlines', editingAirline.id);
//                 await setDoc(airlineRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
//                 toast({ title: 'Airline Updated', description: `${data.name} configuration saved.` });
//             } else {
//                 await addDoc(collection(firestore, 'airlines'), { ...data, createdAt: serverTimestamp() });
//                 toast({ title: 'Airline Onboarded', description: `${data.name} is now active in the ecosystem.` });
//             }
//         } catch (e: any) {
//             toast({ variant: 'destructive', title: 'Error', description: e.message });
//         }
//         setIsDialogOpen(false);
//     };

//     const handleDelete = async (id: string) => {
//         if (!firestore) return;
//         try {
//             await deleteDoc(doc(firestore, 'airlines', id));
//             toast({ title: 'Airline Removed', variant: 'destructive' });
//         } catch (e: any) {
//             toast({ variant: 'destructive', title: 'Error', description: e.message });
//         }
//     };

//     return (
//         <div className="flex flex-col gap-6">
            // <div className="flex items-center justify-between">
            //     <div className="flex flex-col gap-1">
            //         <h1 className="text-3xl font-bold tracking-tight">Airline Onboarding</h1>
            //         <p className="text-muted-foreground">Map carrier PSS systems to ecosystem airport nodes.</p>
            //     </div>
            //     <div className="flex items-center gap-2">
            //         {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            //         <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Onboard Airline</Button>
            //     </div>
            // </div>

//             <Card>
//                 <CardHeader>
//                     <CardTitle>Carrier Network</CardTitle>
//                     <CardDescription>Airlines with active retailing permissions and PSS synchronization.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="flex items-center gap-2 mb-4">
//                         <div className="relative flex-1">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                             <Input 
//                                 placeholder="Search by name or code..." 
//                                 className="pl-9" 
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>
                    
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Airline & Code</TableHead>
//                                 <TableHead>PSS / Protocol</TableHead>
//                                 <TableHead>Operating Hubs</TableHead>
//                                 <TableHead>Status</TableHead>
//                                 <TableHead className="text-right">Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {displayAirlines.map((airline) => (
//                                 <TableRow key={airline.id}>
//                                     <TableCell>
//                                         <div className="flex items-center gap-2">
//                                             <div className="p-2 bg-primary/10 rounded">
//                                                 <Plane className="h-4 w-4 text-primary" />
//                                             </div>
//                                             <div>
//                                                 <div className="font-bold text-sm">{airline.name}</div>
//                                                 <div className="font-mono text-[10px] text-muted-foreground uppercase">{airline.icaoCode}</div>
//                                             </div>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <div className="flex flex-col">
//                                             <span className="text-sm font-medium">{airline.pssType}</span>
//                                             <span className="text-[10px] text-muted-foreground font-mono">{airline.pnrMessagingType || 'EDIFACT'}</span>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <div className="flex flex-wrap gap-1 max-w-[200px]">
//                                             {airline.operatingAirports?.map((hub: string) => (
//                                             <Badge key={hub} variant="secondary" className="text-[10px] font-mono">{hub}</Badge>
//                                             ))}
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <Badge variant={airline.status === 'Active' ? 'default' : 'secondary'}>{airline.status}</Badge>
//                                     </TableCell>
//                                     <TableCell className="text-right">
//                                         <DropdownMenu>
//                                             <DropdownMenuTrigger asChild>
//                                                 <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
//                                             </DropdownMenuTrigger>
//                                             <DropdownMenuContent align="end" className="w-56">
//                                                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                                                 <DropdownMenuItem onClick={() => handleOpenDialog(airline)}>Edit Config</DropdownMenuItem>
//                                                 <DropdownMenuItem><Network className="mr-2 h-4 w-4"/>Check PSS Sync</DropdownMenuItem>
//                                                 <DropdownMenuSeparator />
//                                                 <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(airline.id!)}>Remove</DropdownMenuItem>
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
//                         <DialogTitle>{editingAirline ? 'Update Carrier Sync' : 'Onboard New Carrier'}</DialogTitle>
//                         <DialogDescription>Map airline host systems to the ecosystem airport nodes.</DialogDescription>
//                     </DialogHeader>
//                     <AirlineOnboardingForm 
//                         airline={editingAirline} 
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
import { Button } from '@/components/ui/button';
import { PlusCircle, Plane, MoreHorizontal, Loader2, Network, Globe, CheckCircle2, RefreshCw, AlertCircle, Search } from 'lucide-react';
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
import { StatsCards } from '@/components/StatsCards/StatsCards';
import { TableFilterBar } from '@/components/TableFilterbar/TableFilterBar';
import { useTableFilters } from '@/hooks/useTableFilters';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const mockAirlines: any[] = [
  // { id: '1', name: 'Indigo',     icaoCode: 'GAB', pssType: 'Amadeus',   pnrMessagingType: 'EDIFACT', status: 'Active',     contactEmail: 'ops@global.com',           operatingAirports: ['LHR', 'JFK', 'DXB'] },
  // { id: '2', name: 'AirIndia', icaoCode: 'SBA', pssType: 'Sabre',     pnrMessagingType: 'EDIFACT', status: 'Active',     contactEmail: 'pss.tech@skybridge.com',   operatingAirports: ['SIN', 'HKG'] },
  { 
  id: '1',
  name: 'Indigo',
  icaoCode: 'IGO',
  pssType: 'Amadeus',
  pnrMessagingType: 'EDIFACT',
  status: 'Active',
  contactEmail: 'ops@global.com',
  operatingAirports: ['BOM', 'DXB', 'DEL', 'SIN'] 
},
{ 
  id: '2',
  name: 'AirIndia',
  icaoCode: 'AIC',
  pssType: 'Sabre',
  pnrMessagingType: 'EDIFACT',
  status: 'Active',
  contactEmail: 'pss.tech@skybridge.com',
  operatingAirports: ['BOM', 'DXB', 'DEL', 'SIN'] 
}
];

// ─── Filter Options ───────────────────────────────────────────────────────────
const PSS_OPTIONS    = ["Amadeus", "Sabre", "Navitaire"].map((v) => ({ label: v, value: v }));
const STATUS_OPTIONS = ["Active", "Onboarding", "Inactive"].map((v) => ({ label: v, value: v }));
const HUB_OPTIONS    = ["LHR", "JFK", "DXB", "SIN", "HKG", "CDG", "FRA", "NRT"].map((v) => ({ label: v, value: v }));

// ─── Hub Badge ─────────────────────────────────────────────────────────────────
const HubBadge = ({ hub }: { hub: string }) => (
  <span className="inline-block rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-semibold tracking-wide text-gray-700">
    {hub}
  </span>
);

// ─── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Active
      </span>
    );
  }
  if (status === 'Onboarding') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700">
        Onboarding
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      Inactive
    </span>
  );
};

// ─── PSS Badge ─────────────────────────────────────────────────────────────────
const PssBadge = ({ pss }: { pss: string }) => (
  <span className="inline-block rounded-full border border-violet-300 bg-violet-100 px-3 py-0.5 text-xs font-semibold text-violet-800">
    {pss}
  </span>
);

// ─── Airline Icon ──────────────────────────────────────────────────────────────
const AirlineAvatar = () => (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100">
    <Plane className="h-4 w-4 text-violet-600" strokeWidth={1.8} />
  </div>
);

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AirlineOnboardingPage() {
  const firestore = useFirestore();
  const airlinesQuery = useMemo(() => (firestore ? collection(firestore, 'airlines') : undefined), [firestore]);
  const { data: airlinesCollection, loading } = useCollection(airlinesQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAirline, setEditingAirline] = useState<AirlineOnboarding | null>(null);
  const { toast } = useToast();

  // Get source data
  const sourceData = useMemo(() => {
    return (airlinesCollection && airlinesCollection.length > 0)
      ? (airlinesCollection as any[])
      : mockAirlines;
  }, [airlinesCollection]);

  // ─── Dynamic Stats based on actual data ───────────────────────────────────────
  const dynamicStats = useMemo(() => {
    const total = sourceData.length;
    const active = sourceData.filter((a) => a.status === 'Active').length;
    const onboarding = sourceData.filter((a) => a.status === 'Onboarding').length;
    const failedSync = sourceData.filter((a) => a.status === 'Inactive').length;
    
    return [
      { label: "Total Airlines", value: total, color: "purple" as const, icon: <Globe /> },
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
    searchFields: ["name", "icaoCode", "pssType"],
    filterFields: { status: "", pssType: "", operatingAirports: "" },
  });

  // ─── Handlers ────────────────────────────────────────────────────────────────
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
    <div className="flex flex-col bg-[hsl(var(--white))] min-h-screen">
      <StatsCards cards={dynamicStats} />

       <TableFilterBar
            searchText={searchText}
            onSearchChange={setSearchText}
            searchPlaceholder="Search by Airline name, ICAO, or PSS system..."
            dropdowns={[
              {
                key: "status",
                label: "Status",
                options: STATUS_OPTIONS,
                value: activeFilters.status ?? "All",
                onChange: (v) => setFilter("status", v),
              },
              {
                key: "pssType",
                label: "PSS System",
                options: PSS_OPTIONS,
                value: activeFilters.pssType ?? "All",
                onChange: (v) => setFilter("pssType", v),
              },
              {
                key: "operatingAirports",
                label: "Operating Hub",
                options: HUB_OPTIONS,
                value: activeFilters.operatingAirports ?? "All",
                onChange: (v) => setFilter("operatingAirports", v),
              },
            ]}
            activeChips={activeChips}
            onRemoveChip={(k) => removeFilter(k as keyof any)}
            onClearAll={clearAll}
          />
        
      {/* ── Main Card ─────────────────────────────────────────────────────── */}
      <Card className="border-none bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-gray-900">Carrier Network</CardTitle>
              <CardDescription className="mt-0.5 text-xs text-gray-400">
                Airlines with active retailing permissions and PSS synchronization.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
              <button
                onClick={() => handleOpenDialog()}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-violet-500"
              >
                <PlusCircle className="h-4 w-4" />
                Onboard Airline
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-100 hover:bg-gray-100">
                <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Airline &amp; Code
                </TableHead>
                <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  PSS System
                </TableHead>
                <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Protocol
                </TableHead>
                <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Operating Hubs
                </TableHead>
                <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Status
                </TableHead>
                <TableHead className="py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((airline) => (
                <TableRow
                  key={airline.id}
                  className="transition-colors duration-100 hover:bg-violet-50/60"
                >
                  {/* Airline & Code */}
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <AirlineAvatar />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{airline.name}</div>
                        <div className="mt-0.5 text-[11px] font-mono text-gray-400 uppercase">{airline.icaoCode}</div>
                      </div>
                    </div>
                  </TableCell>

                  {/* PSS */}
                  <TableCell className="py-3.5">
                    <PssBadge pss={airline.pssType} />
                  </TableCell>

                  {/* Protocol */}
                  <TableCell className="py-3.5">
                    <span className="text-xs text-gray-400 font-mono">{airline.pnrMessagingType || 'EDIFACT'}</span>
                  </TableCell>

                  {/* Operating Hubs */}
                  <TableCell className="py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {airline.operatingAirports?.slice(0, 2).map((hub: string) => (
                        <HubBadge key={hub} hub={hub} />
                      ))}
                      {(airline.operatingAirports?.length ?? 0) > 2 && (
                        <span className="inline-block rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-500">
                          +{airline.operatingAirports.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5">
                    <StatusBadge status={airline.status} />
                  </TableCell>

                  {/* Actions */}
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
                      <DropdownMenuContent align="end" className="w-40 rounded-xl border border-gray-100 shadow-xl">
                        <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-violet-50 hover:text-violet-700 focus:bg-violet-50 focus:text-violet-700"
                          onClick={() => handleOpenDialog(airline)}
                        >
                          Edit Config
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-xs font-semibold text-gray-600 hover:bg-violet-50 hover:text-violet-700 focus:bg-violet-50 focus:text-violet-700">
                          <Network className="mr-2 h-3.5 w-3.5" />
                          Check PSS Sync
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600"
                          onClick={() => handleDelete(airline.id!)}
                        >
                          Remove
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

      {/* ── Dialog ────────────────────────────────────────────────────────────── */}
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