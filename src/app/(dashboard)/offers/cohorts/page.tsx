
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
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
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
        definition: { 
            channels: ['CUSS', 'Mobile'], 
            airports: ['LHR'], 
            airlines: ['BA'], 
            cabinClasses: ['Business'],
            location: 'Airport_Departure', 
            securityWaitTime: 20, 
            loyaltyTiers: ['Gold', 'Platinum'],
            aircraftTypes: ['A350', 'B787']
        } 
    },
    { 
        id: 'COH-002', 
        name: 'JFK Premium Leisure', 
        cohortId: 'JFK_PREM_LSR', 
        status: 'Active', 
        description: 'Premium cabins on JFK-LHR routes using Mobile app.', 
        definition: { 
            channels: ['Mobile'], 
            airports: ['JFK'], 
            routes: 'JFK-LHR',
            cabinClasses: ['Business', 'First'],
            location: 'Anywhere',
            loyaltyTiers: ['Silver', 'Gold']
        } 
    },
    { 
        id: 'COH-003', 
        name: 'Economy Lounge Prospects', 
        cohortId: 'ECO_LOUNGE', 
        status: 'Active', 
        description: 'Economy passengers in terminals with lounge capacity.', 
        definition: { 
            channels: ['CUSS', 'CUTE'], 
            cabinClasses: ['Economy'],
            location: 'Airport_Departure',
            loyaltyTiers: ['Bronze']
        } 
    },
];

const getDefinitionString = (definition: Cohort['definition']) => {
    if (!definition) return '';
    const parts: string[] = [];
    if (definition.channels?.length > 0) parts.push(`Ch: ${definition.channels.join(', ')}`);
    if (definition.airports?.length > 0) parts.push(`Apt: ${definition.airports.join(', ')}`);
    if (definition.airlines?.length > 0) parts.push(`Air: ${definition.airlines.join(', ')}`);
    if (definition.routes) parts.push(`Rt: ${definition.routes}`);
    if (definition.cabinClasses?.length > 0) parts.push(`Cab: ${definition.cabinClasses.join(', ')}`);
    if (definition.securityWaitTime && definition.securityWaitTime > 0) parts.push(`Wait > ${definition.securityWaitTime}m`);
    if (definition.loyaltyTiers?.length > 0) parts.push(`Tiers: ${definition.loyaltyTiers.join(', ')}`);
    return parts.join(' | ') || 'All Passengers';
}

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

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCohort(null);
  };

  const handleFormSubmit = async (data: Cohort) => {
    if (!firestore) return;
    try {
      if (editingCohort?.id) {
        const cohortRef = doc(firestore, 'cohorts', editingCohort.id);
        await setDoc(cohortRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Cohort Updated', description: `Cohort "${data.name}" has been updated.` });
      } else {
        await addDoc(collection(firestore, 'cohorts'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'Cohort Created', description: `Cohort "${data.name}" has been created.` });
      }
    } catch (e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "There was a problem with your request.",
        });
    }
    handleDialogClose();
  };

  const handleDelete = async (cohortId: string) => {
    if (!cohortId || !firestore) return;
    try {
      await deleteDoc(doc(firestore, 'cohorts', cohortId));
      toast({
        variant: 'destructive',
        title: 'Cohort Deleted',
        description: 'The cohort has been successfully deleted.',
      });
    } catch (e: any) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: e.message || 'Could not delete the cohort.',
      });
    }
  };

  const getStatusBadgeVariant = (status: Cohort['status']) => {
    return status === 'Active' ? 'default' : 'outline';
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Cohort Management
            </h1>
            <p className="text-muted-foreground">
              Define complex customer segments using SITA channels, airport signals, and flight context.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            Create Cohort
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Customer Cohorts</CardTitle>
            <CardDescription>
              Manage rules for personalized airport ecosystem offers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && displayCohorts.length === 0 && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {displayCohorts.length > 0 && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cohort Name</TableHead>
                    <TableHead>Cohort ID</TableHead>
                    <TableHead className="max-w-[400px]">Definition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayCohorts.map((cohort) => (
                    <TableRow key={cohort.id}>
                      <TableCell className="font-medium">
                        <div>{cohort.name}</div>
                        <div className="text-xs text-muted-foreground">{cohort.description}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{cohort.cohortId}</TableCell>
                      <TableCell className="text-[10px] font-mono leading-relaxed">
                          {getDefinitionString(cohort.definition)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(cohort.status)}>
                          {cohort.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(cohort)}>Edit Cohort</DropdownMenuItem>
                            <DropdownMenuItem>Simulate Reach</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(cohort.id!)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {error && <p className="text-destructive">Error loading cohorts: {error.message}</p>}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingCohort ? 'Edit Cohort' : 'Create New Cohort'}</DialogTitle>
            <DialogDescription>
              {editingCohort ? `Editing cohort "${editingCohort.name}".` : 'Define ecosystem targeting rules for this segment.'}
            </DialogDescription>
          </DialogHeader>
          <CohortForm
            cohort={editingCohort}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
