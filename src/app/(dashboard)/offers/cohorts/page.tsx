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
import { 
  MoreHorizontal, 
  PlusCircle, 
  Loader2, 
  Target, 
  Globe, 
  Plane, 
  Building2, 
  ShieldCheck, 
  Activity,
  User,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CohortForm, type Cohort } from '@/components/forms/cohort-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockCohorts: Cohort[] = [
    { 
        id: 'COH-001', 
        name: 'LHR High-Wait Business', 
        cohortId: 'LHR_BIZ_WAIT', 
        status: 'Active', 
        domain: 'Airport',
        description: 'Business class at LHR T5 facing > 20m security wait.', 
        type: 'dynamic',
        priority: 85,
    },
    { 
        id: 'COH-002', 
        name: 'India POS Web Promo', 
        cohortId: 'IN_WEB_PROMO', 
        status: 'Active', 
        domain: 'Airline',
        description: 'Web direct search from India Point of Sale.', 
        type: 'static',
        priority: 50,
    },
     { 
        id: 'COH-003', 
        name: 'Last Minute Family - US', 
        cohortId: 'US_FAM_LM', 
        status: 'Active', 
        domain: 'Airline',
        description: 'Families booking US domestic routes within 48h of departure.', 
        type: 'dynamic',
        priority: 75,
    },
];

export default function CohortsPage() {
  const firestore = useFirestore();
  const { data: cohortsCollection, loading, error } = useCollection(firestore ? collection(firestore, 'cohorts') : undefined);

  const cohorts = cohortsCollection ? cohortsCollection as Cohort[] : [];
  const displayCohorts = cohorts.length > 0 ? cohorts : mockCohorts;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const [activeDomain, setActiveDomain] = useState<'Airline' | 'Airport'>('Airline');
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
        await addDoc(collection(firestore, 'cohorts'), { ...data, domain: activeDomain, createdAt: serverTimestamp() });
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

  const filteredCohorts = displayCohorts.filter(c => c.domain === activeDomain);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Airline Cohorts</h1>
          <p className="text-muted-foreground">Manage logical segments for targeted retailing across carrier and hub domains.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold">
          <PlusCircle className="mr-2 h-4 w-4" />
          Define {activeDomain} Segment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Target className="w-3 h-3 text-primary" /> Global Count</p>
              <p className="text-2xl font-black mt-2">{displayCohorts.length}</p>
          </Card>
          <Card className="p-6">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Plane className="w-3 h-3 text-blue-600" /> Airline Segments</p>
              <p className="text-2xl font-black mt-2">{displayCohorts.filter(c => c.domain === 'Airline').length}</p>
          </Card>
          <Card className="p-6">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Building2 className="w-3 h-3 text-emerald-600" /> Airport Segments</p>
              <p className="text-2xl font-black mt-2">{displayCohorts.filter(c => c.domain === 'Airport').length}</p>
          </Card>
           <Card className="p-6 border-indigo-100 bg-indigo-50/20">
              <p className="text-[10px] font-black uppercase text-indigo-700 tracking-widest flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-indigo-600" /> Engine Sync</p>
              <p className="text-2xl font-black mt-2 text-indigo-700">100%</p>
          </Card>
      </div>

      <Tabs defaultValue="Airline" onValueChange={(v) => setActiveDomain(v as any)}>
        <TabsList className="grid w-[400px] grid-cols-2 bg-muted/60">
            <TabsTrigger value="Airline" className="font-bold"><Plane className="mr-2 h-4 w-4" />Airline Domain</TabsTrigger>
            <TabsTrigger value="Airport" className="font-bold"><Building2 className="mr-2 h-4 w-4" />Airport Domain</TabsTrigger>
        </TabsList>

        <TabsContent value={activeDomain} className="mt-6">
            <Card className="shadow-md">
                <CardHeader className="bg-muted/10">
                    <CardTitle>{activeDomain} Segment Registry</CardTitle>
                    <CardDescription>
                        {activeDomain === 'Airline' 
                            ? 'Configure cohorts based on passenger type, loyalty status, and travel behavior signals.' 
                            : 'Manage hub-specific segments including terminal location and wait-time context.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    {loading && cohortsCollection?.length === 0 ? (
                        <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="text-[10px] uppercase font-black">Segment Identity</TableHead>
                                <TableHead className="text-[10px] uppercase font-black">Strategy Scope</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-center">Priority</TableHead>
                                <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                <TableHead className="sr-only">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {filteredCohorts.map((cohort) => (
                                <TableRow key={cohort.id} className="group cursor-default">
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-bold text-sm text-primary">{cohort.name}</span>
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase">{cohort.cohortId}</span>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            {cohort.domain === 'Airline' ? <Plane className="w-3 h-3 text-blue-500" /> : <Building2 className="w-3 h-3 text-emerald-500" />}
                                            <span className="text-[9px] uppercase font-black text-muted-foreground">{cohort.type}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs text-muted-foreground max-w-xs line-clamp-2">{cohort.description}</div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="font-mono text-[10px]">{cohort.priority}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={cohort.status === 'Active' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase tracking-wider">{cohort.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>Cohort Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleOpenDialog(cohort)}>Edit Detailed Rules</DropdownMenuItem>
                                        <DropdownMenuItem>View Active Matches</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(cohort.id!)}>Delete Segment</DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                </TableRow>
                            ))}
                            {filteredCohorts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        No {activeDomain.toLowerCase()} segments defined. Click "Define New Segment" to begin.
                                    </TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary">{editingCohort ? 'Modify' : 'Initialize'} {activeDomain} Retailing Segment</DialogTitle>
            <DialogDescription className="font-medium">Define logical targeting rules for this retailing cohort.</DialogDescription>
          </DialogHeader>
          <CohortForm
            cohort={editingCohort}
            domain={activeDomain}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
