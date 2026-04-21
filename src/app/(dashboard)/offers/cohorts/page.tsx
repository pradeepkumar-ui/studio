
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
import { MoreHorizontal, PlusCircle, Loader2, Target, BrainCircuit, Activity, Zap, ShieldCheck } from 'lucide-react';
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
        airlineRules: { cabinClasses: ['Business'], passengerTypes: ['ADT'], loyaltyTiers: ['Gold', 'Platinum'], bookingChannels: [], tripTypes: [], fareBrands: [] },
        airportRules: { airportCodes: ['LHR'], terminals: ['T5'], minWaitTime: 20, locationContext: 'Departure' },
        outputs: { discount: 10, rankingBoost: 20, eligibleProducts: [], bundleIds: [] }
    },
    { 
        id: 'COH-002', 
        name: 'Premium Upsell Target', 
        cohortId: 'PREM_UPSELL_ML', 
        status: 'Active', 
        description: 'Predictive cohort for passengers with high propensity to upgrade.', 
        type: 'predictive',
        evaluation_mode: 'cached',
        priority: 90,
        combination_logic: 'AND',
        override_flag: false,
        personalization: { propensityToBuyScore: 75, isUpsellCandidate: true, priceSensitivityScore: 30 },
        outputs: { rankingBoost: 50, markup: 5, eligibleProducts: [], bundleIds: [] }
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
        toast({ title: 'Cohort Synchronized', description: `Segment "${data.name}" successfully updated in orchestration engine.` });
      } else {
        await addDoc(collection(firestore, 'cohorts'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'Cohort Established', description: `Segment "${data.name}" is now live for ecosystem evaluation.` });
      }
    } catch (e: any) {
        toast({ variant: "destructive", title: "Sync Failed", description: e.message });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (cohortId: string) => {
    if (!cohortId || !firestore) return;
    try {
      await deleteDoc(doc(firestore, 'cohorts', cohortId));
      toast({ variant: 'destructive', title: 'Cohort Purged', description: 'Segment removed from ecosystem evaluation.' });
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
            <h1 className="text-3xl font-bold tracking-tight">Ecosystem Retailing Cohorts</h1>
            <p className="text-muted-foreground">Orchestrate personalized retailing sets using airline PNRs, airport real-time signals, and ML propensity scores.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="font-bold">
            <PlusCircle className="mr-2 h-4 w-4" />
            Initialize Advanced Cohort
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Target className="w-3 h-3 text-primary" /> Active Segments</p>
                <p className="text-2xl font-black mt-2">{displayCohorts.length}</p>
            </Card>
            <Card className="p-6">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Activity className="w-3 h-3 text-emerald-600" /> Real-time Nodes</p>
                <p className="text-2xl font-black mt-2">{displayCohorts.filter(c => c.type === 'dynamic').length}</p>
            </Card>
            <Card className="p-6">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><BrainCircuit className="w-3 h-3 text-indigo-600" /> Predictive ML</p>
                <p className="text-2xl font-black mt-2">{displayCohorts.filter(c => c.type === 'predictive').length}</p>
            </Card>
             <Card className="p-6 border-indigo-100 bg-indigo-50/20">
                <p className="text-[10px] font-black uppercase text-indigo-700 tracking-widest flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-indigo-600" /> Evaluation Sync</p>
                <p className="text-2xl font-black mt-2 text-indigo-700">100%</p>
            </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader className="bg-muted/10">
            <CardTitle>Cohort Management Registry</CardTitle>
            <CardDescription>
              Manage exhaustive targeting rules across airline and airport stakeholder dimensions.
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
                    <TableHead className="text-[10px] uppercase font-black">Cohort Identity</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Type / Evaluation</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-center">Priority</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Actions & Eligibility</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
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
                            <p className="text-[10px] text-muted-foreground max-w-[200px] truncate">{cohort.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-muted rounded-md">{getTypeIcon(cohort.type)}</div>
                             <div className="flex flex-col">
                                <span className="text-xs font-bold capitalize">{cohort.type}</span>
                                <span className="text-[9px] text-muted-foreground uppercase tracking-widest">{cohort.evaluation_mode}</span>
                             </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                         <Badge variant="outline" className="font-mono text-[10px]">{cohort.priority}</Badge>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                <Zap className="w-3 h-3" /> Lift: {cohort.outputs?.rankingBoost || 0} boost
                             </div>
                             <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                                <Target className="w-3 h-3" /> Discount: {cohort.outputs?.discount || 0}%
                             </div>
                         </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={cohort.status === 'Active' ? 'default' : 'outline'} className="text-[10px] uppercase">
                          {cohort.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Cohort Operations</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(cohort)}>Modify Definitions</DropdownMenuItem>
                            <DropdownMenuItem>Simulate Audience Hit-rate</DropdownMenuItem>
                            <DropdownMenuItem>View Retention Trends</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(cohort.id!)}>Decommission Segment</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {error && <p className="text-destructive">Sync Error: {error.message}</p>}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Configure Advanced Retailing Segment</DialogTitle>
            <DialogDescription>Define precise ecosystem targeting rules across Airline Host, Airport Node, and ML dimensions.</DialogDescription>
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
