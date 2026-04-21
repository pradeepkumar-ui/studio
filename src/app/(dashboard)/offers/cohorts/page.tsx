'use client';

import { useState } from 'react';
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
import { MoreHorizontal, PlusCircle, Loader2, Target, BrainCircuit, Activity, ShieldCheck, Globe, Laptop } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CohortForm, type Cohort } from '@/components/forms/cohort-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const mockCohorts: Cohort[] = [
    { 
        id: 'COH-001', 
        name: 'LHR High-Wait Business', 
        cohortId: 'LHR_BIZ_WAIT', 
        status: 'Active', 
        description: 'Business class at LHR T5 facing > 20m security wait.', 
        type: 'dynamic',
        evaluation_mode: 'real-time',
        priority: 85,
        combination_logic: 'AND',
        override_flag: true,
        airlineRules: { carrierCodes: ['GAB'], cabinClasses: ['Business'], loyaltyTiers: ['Gold', 'Platinum'] },
        airportRules: { airportCodes: ['LHR'], terminals: ['T5'], minWaitTime: 20, locationContext: 'Departure' },
        ecosystemScope: { channels: ['CUSS', 'CUTE', 'App'], regions: ['EU'] },
    },
    { 
        id: 'COH-002', 
        name: 'India POS Web Promo', 
        cohortId: 'IN_WEB_PROMO', 
        status: 'Active', 
        description: 'Web direct search from India Point of Sale.', 
        type: 'static',
        evaluation_mode: 'real-time',
        priority: 50,
        combination_logic: 'AND',
        override_flag: false,
        ecosystemScope: { channels: ['Web'], regions: ['APAC'], countries: ['IN'] },
    },
];

export default function CohortsPage() {
  const firestore = useFirestore();
  const { data: cohortsCollection, loading, error } = useCollection(firestore ? collection(firestore, 'cohorts') : undefined);

  const cohorts = cohortsCollection ? cohortsCollection as Cohort[] : [];
  const displayCohorts = cohorts.length > 0 ? cohorts : mockCohorts;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (cohort: Cohort | null = null) => {
    setEditingCohort(cohort);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: Cohort) => {
    if (!firestore) return;
    try {
      if (editingCohort?.id) {
        const cohortRef = doc(firestore, 'cohorts', editingCohort.id);
        await setDoc(cohortRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Cohort Updated', description: `Segment "${data.name}" successfully updated.` });
      } else {
        await addDoc(collection(firestore, 'cohorts'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'Cohort Created', description: `Segment "${data.name}" is now live.` });
      }
    } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (cohortId: string) => {
    if (!cohortId || !firestore) return;
    try {
      await deleteDoc(doc(firestore, 'cohorts', cohortId));
      toast({ variant: 'destructive', title: 'Cohort Removed' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
        case 'predictive': return <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />;
        case 'dynamic': return <Activity className="w-3.5 h-3.5 text-emerald-600" />;
        default: return <Target className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Passenger Segments (Cohorts)</h1>
            <p className="text-muted-foreground">Define logical segments for ecosystem targeting. Commercial positioning (pricing/discounts) is managed in the Offers & Dynamic pricing.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="font-bold">
            <PlusCircle className="mr-2 h-4 w-4" />
            Define New Segment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Target className="w-3 h-3 text-primary" /> Active Segments</p>
                <p className="text-2xl font-black mt-2">{displayCohorts.length}</p>
            </Card>
            <Card className="p-6">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Globe className="w-3 h-3 text-emerald-600" /> Multi-Region</p>
                <p className="text-2xl font-black mt-2">{displayCohorts.filter(c => (c.ecosystemScope?.regions?.length || 0) > 0).length}</p>
            </Card>
            <Card className="p-6">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Laptop className="w-3 h-3 text-indigo-600" /> SITA Touchpoints</p>
                <p className="text-2xl font-black mt-2">{displayCohorts.filter(c => c.ecosystemScope?.channels?.some(ch => ['CUSS', 'CUTE', 'CUPPS'].includes(ch))).length}</p>
            </Card>
             <Card className="p-6 border-indigo-100 bg-indigo-50/20">
                <p className="text-[10px] font-black uppercase text-indigo-700 tracking-widest flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-indigo-600" /> Evaluation Sync</p>
                <p className="text-2xl font-black mt-2 text-indigo-700">100%</p>
            </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader className="bg-muted/10">
            <CardTitle>Cohort Registry</CardTitle>
            <CardDescription>
              Orchestrate targeting criteria across Geo, Channel, and PSS contexts. Pricing logic for these segments is applied in the Dynamic Pricing studio.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading && displayCohorts.length === 0 && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {displayCohorts.length > 0 && !error && (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-[10px] uppercase font-black">Segment Identity</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Carrier Scope</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Geographic / POS Scope</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">SITA Channels</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-center">Priority</TableHead>
                    <TableHead className="sr-only">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayCohorts.map((cohort) => (
                    <TableRow key={cohort.id} className="group cursor-default">
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-sm">{cohort.name}</span>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">{cohort.cohortId}</span>
                            <div className="flex items-center gap-1.5 mt-1">{getTypeIcon(cohort.type)} <span className="text-[9px] uppercase font-black text-muted-foreground">{cohort.type}</span></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                             {cohort.airlineRules?.carrierCodes?.map(code => (
                                <Badge key={code} variant="outline" className="text-[9px] px-1.5 font-mono">{code}</Badge>
                             ))}
                             {(!cohort.airlineRules?.carrierCodes || cohort.airlineRules.carrierCodes.length === 0) && <span className="text-xs text-muted-foreground italic">All Carriers</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                             <div className="text-xs font-bold text-primary">{cohort.ecosystemScope?.regions?.join(', ') || 'Global'}</div>
                             <div className="text-[10px] text-muted-foreground">POS: {cohort.ecosystemScope?.pos?.join(', ') || 'All'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {cohort.ecosystemScope?.channels?.map(ch => (
                                <Badge key={ch} variant="secondary" className="text-[9px] px-1.5">{ch}</Badge>
                            ))}
                            {(!cohort.ecosystemScope?.channels || cohort.ecosystemScope?.channels.length === 0) && <span className="text-xs text-muted-foreground italic">All Channels</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                         <Badge variant="outline" className="font-mono text-[10px]">{cohort.priority}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Cohort Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(cohort)}>Edit Logic</DropdownMenuItem>
                            <DropdownMenuItem>View Active Matches</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(cohort.id!)}>Delete Segment</DropdownMenuItem>
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Configure Passenger Segment</DialogTitle>
            <DialogDescription>Define logical targeting rules. Commercial positioning (pricing/discounts) is handled in the Offers & Dynamic pricing.</DialogDescription>
          </DialogHeader>
          <CohortForm
            cohort={editingCohort}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
