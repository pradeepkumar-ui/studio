'use client';

import { useState, useMemo } from 'react';
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
  Building2, 
  ShieldCheck, 
  MapPin,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AirportCohortForm, type AirportCohort } from '@/components/forms/airport-cohort-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const mockAirportCohorts: any[] = [
    { 
        id: 'AC-001', 
        name: 'LHR High-Wait Business', 
        cohortId: 'LHR_BIZ_WAIT', 
        status: 'Active', 
        airportCode: 'LHR',
        description: 'Business class passengers at LHR with >4h layover.', 
        type: 'dynamic',
        priority: 90,
    },
    { 
        id: 'AC-002', 
        name: 'SIN Transit Family', 
        cohortId: 'SIN_FAM_TRANSIT', 
        status: 'Active', 
        airportCode: 'SIN',
        description: 'Families in transit at SIN requiring comfort services.', 
        type: 'dynamic',
        priority: 70,
    },
];

export default function AirportCohortsPage() {
  const firestore = useFirestore();
  const cohortsQuery = useMemo(() => firestore ? collection(firestore, 'airportCohorts') : undefined, [firestore]);
  const { data: cohortsCollection, loading } = useCollection(cohortsQuery);

  const cohorts = cohortsCollection ? cohortsCollection as any[] : [];
  const displayCohorts = cohorts.length > 0 ? cohorts : mockAirportCohorts;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState<any | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (cohort: any | null = null) => {
    setEditingCohort(cohort);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: AirportCohort) => {
    if (!firestore) return;
    try {
      if (editingCohort?.id) {
        const cohortRef = doc(firestore, 'airportCohorts', editingCohort.id);
        await setDoc(cohortRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Hub Segment Updated', description: `Segment "${data.name}" successfully updated.` });
      } else {
        await addDoc(collection(firestore, 'airportCohorts'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'Hub Segment Created', description: `Segment "${data.name}" is now live in the ecosystem.` });
      }
    } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'airportCohorts', id));
      toast({ variant: 'destructive', title: 'Hub Segment Removed' });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Airport Cohorts</h1>
          <p className="text-muted-foreground">Manage logical segments for targeted hub-specific retailing and service orchestration.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold">
          <PlusCircle className="mr-2 h-4 w-4" />
          Define Hub Segment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Target className="w-3 h-3 text-primary" /> Active Hub segments</p>
              <p className="text-2xl font-black mt-2">{displayCohorts.length}</p>
          </Card>
          <Card className="p-6">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Building2 className="w-3 h-3 text-emerald-600" /> Hub Reach</p>
              <p className="text-2xl font-black mt-2">Participating Airports</p>
          </Card>
           <Card className="p-6 border-indigo-100 bg-indigo-50/20">
              <p className="text-[10px] font-black uppercase text-indigo-700 tracking-widest flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-indigo-600" /> Sync Health</p>
              <p className="text-2xl font-black mt-2 text-indigo-700">Operational</p>
          </Card>
      </div>

      <Card className="shadow-md">
          <CardHeader className="bg-muted/10">
              <CardTitle>Hub Segment Registry</CardTitle>
              <CardDescription>
                  Configure cohorts based on journey stage, layover duration, and hub-specific behavioral signals.
              </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
              {loading && cohortsCollection?.length === 0 ? (
                  <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : (
                  <Table>
                      <TableHeader className="bg-muted/30">
                      <TableRow>
                          <TableHead className="text-[10px] uppercase font-black tracking-widest">Segment Identity</TableHead>
                          <TableHead className="text-[10px] uppercase font-black tracking-widest">Hub Logic</TableHead>
                          <TableHead className="text-[10px] uppercase font-black text-center tracking-widest">Priority</TableHead>
                          <TableHead className="text-[10px] uppercase font-black tracking-widest">Status</TableHead>
                          <TableHead className="sr-only">Actions</TableHead>
                      </TableRow>
                      </TableHeader>
                      <TableBody>
                      {displayCohorts.map((cohort) => (
                          <TableRow key={cohort.id} className="group cursor-default">
                          <TableCell>
                              <div className="flex flex-col gap-0.5">
                                  <span className="font-bold text-sm text-primary">{cohort.name}</span>
                                  <span className="text-[10px] font-mono text-muted-foreground uppercase">{cohort.cohortId}</span>
                                  <div className="flex items-center gap-1.5 mt-1">
                                      <MapPin className="w-3 h-3 text-emerald-500" />
                                      <span className="text-[9px] uppercase font-black text-muted-foreground">{cohort.airportCode} Hub</span>
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
                                  <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground">Hub Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleOpenDialog(cohort)}>Edit Detailed Rules</DropdownMenuItem>
                                  <DropdownMenuItem>View Match Analytics</DropdownMenuItem>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary">Airport Retailing Segment</DialogTitle>
            <DialogDescription className="font-medium">Define exhaustive journey context and terminal-side behavioral triggers for this retailing cohort.</DialogDescription>
          </DialogHeader>
          <AirportCohortForm
            cohort={editingCohort}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
