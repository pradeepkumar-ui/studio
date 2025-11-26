
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
  FileUp,
  MoreHorizontal,
  PlusCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FareForm, type Fare } from '@/components/forms/fare-form';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const mockFares: Fare[] = [
    { id: 'F-001', route: 'JFK-LAX', cabinClass: 'Economy', price: 350, currency: 'USD', status: 'Active', version: 1, fareBasisCode: 'YFLEX', validity: { effectiveDate: new Date(), expiryDate: new Date() } },
    { id: 'F-002', route: 'LHR-DXB', cabinClass: 'Business', price: 2500, currency: 'GBP', status: 'Active', version: 2, fareBasisCode: 'JCLASS', validity: { effectiveDate: new Date(), expiryDate: new Date() } },
    { id: 'F-003', route: 'SIN-HKG', cabinClass: 'Economy', price: 280, currency: 'SGD', status: 'Active', version: 1, fareBasisCode: 'QFLEX', validity: { effectiveDate: new Date(), expiryDate: new Date() } },
    { id: 'F-004', route: 'JFK-LHR', cabinClass: 'First', price: 5500, currency: 'USD', status: 'Draft', version: 1, fareBasisCode: 'FFLEX', validity: { effectiveDate: new Date(), expiryDate: new Date() } },
    { id: 'F-005', route: 'CDG-IST', cabinClass: 'Economy', price: 180, currency: 'EUR', status: 'Inactive', version: 3, fareBasisCode: 'EFLEX', validity: { effectiveDate: new Date(), expiryDate: new Date() } },
];

export default function FaresPage() {
  const firestore = useFirestore();
  const { data: faresCollection, loading, error } = useCollection(firestore ? collection(firestore, 'fares') : undefined);
  
  const fares = faresCollection ? faresCollection as Fare[] : [];
  const displayFares = fares.length > 0 ? fares : mockFares;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFare, setEditingFare] = useState<Fare | null>(null);
  const { toast } = useToast();

  const handleValidate = () => {
    toast({
      title: 'Validation Started',
      description: 'Checking for fare collisions and validating rules...',
    });
    // Simulate validation process
    setTimeout(() => {
      toast({
        title: 'Validation Complete',
        description: 'No issues found. All fares are valid.',
      });
    }, 2000);
  };

  const handleOpenDialog = (fare: Fare | null = null) => {
    setEditingFare(fare);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingFare(null);
  };

  const handleFormSubmit = async (data: Fare) => {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Firestore is not initialized.",
        });
        return;
    }
    try {
        if (editingFare?.id) {
          const fareRef = doc(firestore, 'fares', editingFare.id);
          await setDoc(fareRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
          toast({ title: "Fare Updated", description: `Fare for ${data.route} has been successfully updated.` });
        } else {
          await addDoc(collection(firestore, 'fares'), { ...data, createdAt: serverTimestamp(), version: 1 });
          toast({ title: "Fare Created", description: `New fare for ${data.route} has been successfully created.` });
        }
    } catch(e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "There was a problem with your request.",
        });
    }
    handleDialogClose();
  };
  
   const handleDelete = async (fareId: string) => {
    if (!fareId || !firestore) return;
    try {
        await deleteDoc(doc(firestore, 'fares', fareId));
        toast({
          title: 'Fare Deleted',
          description: `Fare with ID ${fareId} has been deleted.`,
        });
    } catch(e: any) {
         console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "There was a problem with your request.",
        });
    }
  };
  
  const handleCreateNewVersion = async (fare: Fare) => {
    if (!firestore) return;
    
    const newVersion = {
        ...fare,
        version: (fare.version || 1) + 1,
        status: 'Draft' as const,
        id: undefined, // Let firestore generate a new ID
    };
    
    try {
        await addDoc(collection(firestore, 'fares'), { ...newVersion, createdAt: serverTimestamp() });
        toast({
            title: 'New Draft Version Created',
            description: `A new draft (v${newVersion.version}) of fare for "${fare.route}" has been created.`
        })
    } catch(e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "Could not create new version.",
        });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Fare Management
          </h1>
          <p className="text-muted-foreground">
            Upload, manage, and validate fares, ensuring collision detection
            and version control.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileUp className="mr-2" />
            Upload Fares
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            Add Fare
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Published Fares</CardTitle>
            <CardDescription>
              Manage and monitor all available fares.
            </CardDescription>
          </div>
          <Button onClick={handleValidate} variant="secondary">
            <CheckCircle className="mr-2" />
            Validate Fares
          </Button>
        </CardHeader>
        <CardContent>
           {loading && displayFares.length === 0 && (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
           )}
           {displayFares.length > 0 && !error && (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Scope</TableHead>
                    <TableHead>FBC / Cabin</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {displayFares.map((fare) => (
                    <TableRow key={fare.id}>
                    <TableCell className="font-medium">{fare.route}</TableCell>
                    <TableCell>
                      <div>{fare.fareBasisCode}</div>
                      <div className="text-xs text-muted-foreground">{fare.cabinClass || fare.class}</div>
                    </TableCell>
                    <TableCell>
                        {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: fare.currency,
                        }).format(fare.price)}
                    </TableCell>
                    <TableCell>
                        <Badge
                        variant={
                            fare.status === 'Active'
                            ? 'default'
                            : fare.status === 'Draft'
                            ? 'secondary'
                            : 'outline'
                        }
                        >
                        {fare.status}
                        </Badge>
                    </TableCell>
                    <TableCell>v{fare.version}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleOpenDialog(fare)}>
                            Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCreateNewVersion(fare)}>Create New Version</DropdownMenuItem>
                            <DropdownMenuItem>View History</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(fare.id!)}>
                            Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
           )}
           {error && <p className="text-destructive">Error loading fares: {error.message}</p>}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingFare ? 'Edit Fare' : 'Create New Fare'}</DialogTitle>
            <DialogDescription>
              {editingFare ? `Editing fare for scope ${editingFare.route}.` : 'Enter the details for the new fare.'}
            </DialogDescription>
          </DialogHeader>
          <FareForm
            fare={editingFare}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
