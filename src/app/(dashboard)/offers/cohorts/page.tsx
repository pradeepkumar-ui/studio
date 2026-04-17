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
            aircraftTypes: ['A350', 'B787'],
            transitStatus: 'Any',
            travelGroup: ['Solo']
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
            loyaltyTiers: ['Silver', 'Gold'],
            transitStatus: 'Any',
            travelGroup: ['Couple', 'Family']
        } 
    },
    { 
        id: 'COH-003', 
        name: 'SIN Transit Loungers', 
        cohortId: 'SIN_TRANSIT_LOUNGE', 
        status: 'Active', 
        description: 'Transiting pax at SIN with 4-8 hour connections.', 
        definition: { 
            channels: ['CUSS', 'CUTE'], 
            airports: ['SIN'],
            cabinClasses: ['Economy'],
            transitStatus: 'Transit',
            minConnectionTime: 240,
            maxConnectionTime: 480,
            location: 'Airport_Departure',
            loyaltyTiers: ['Bronze'],
            travelGroup: ['Solo', 'Couple']
        } 
    },
];

const getDefinitionString = (definition: Cohort['definition']) => {
    if (!definition) return '';
    const parts: string[] = [];
    if (definition.channels?.length > 0) parts.push(`Ch: ${definition.channels.join(', ')}`);
    if (definition.airports?.length > 0) parts.push(`Apt: ${definition.airports.join(', ')}`);
    if (definition.transitStatus && definition.transitStatus !== 'Any') parts.push(`Pax: ${definition.transitStatus}`);
    if (definition.cabinClasses?.length > 0) parts.push(`Cab: ${definition.cabinClasses.join(', ')}`);
    if (definition.fareBrands?.length > 0) parts.push(`Brand: ${definition.fareBrands.join(', ')}`);
    if (definition.securityWaitTime && definition.securityWaitTime > 0) parts.push(`Wait > ${definition.securityWaitTime}m`);
    if (definition.travelGroup?.length > 0) parts.push(`Group: ${definition.travelGroup.join(', ')}`);
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
              Ecosystem Cohort Management
            </h1>
            <p className="text-muted-foreground">
              Define exhaustive customer segments using SITA channels, airport signals, and deep airline host metadata.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            Create Advanced Cohort
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Customer Cohorts</CardTitle>
            <CardDescription>
              Manage complex targeting rules for personalized airport ecosystem retailing.
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
                    <TableHead className="max-w-[400px]">Definition Logic</TableHead>
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
                            <DropdownMenuItem>Simulate Audience Reach</DropdownMenuItem>
                            <DropdownMenuItem>View Conversion Trends</DropdownMenuItem>
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
            <DialogTitle>{editingCohort ? 'Edit Advanced Cohort' : 'Create Exhaustive Ecosystem Cohort'}</DialogTitle>
            <DialogDescription>
              {editingCohort ? `Editing cohort "${editingCohort.name}".` : 'Define precise ecosystem targeting rules across all stakeholder dimensions.'}
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
