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
    { id: 'COH-001', name: 'Frequent Mobile Users UAE', cohortId: 'FrequentMobile_UAE', status: 'Active', description: 'Users in UAE with > 10 purchases via mobile app.' },
    { id: 'COH-002', name: 'Business Travelers India', cohortId: 'BusinessLoyal_IN', status: 'Active', description: 'Users with a corporate email from India who booked business class.' },
    { id: 'COH-003', name: 'Leisure Summer Bookers EU', cohortId: 'LeisureSummer_EU', status: 'Inactive', description: 'Users from EU countries booking for travel in July/August.' },
    { id: 'COH-004', name: 'New Users', cohortId: 'NewUsers', status: 'Active', description: 'Users who have made their first booking in the last 30 days.' },
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
              Define and manage customer cohorts for personalized offers and pricing.
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
              Manage all active and inactive customer segments.
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
                      <TableCell className="font-mono">{cohort.cohortId}</TableCell>
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
                            <DropdownMenuItem>View Performance</DropdownMenuItem>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCohort ? 'Edit Cohort' : 'Create New Cohort'}</DialogTitle>
            <DialogDescription>
              {editingCohort ? `Editing cohort "${editingCohort.name}".` : 'Define a new customer segment for targeting.'}
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
