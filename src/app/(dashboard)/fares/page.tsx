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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FareForm, type Fare } from '@/components/forms/fare-form';

const initialFares: Fare[] = [
  {
    id: 'FAR-001',
    route: 'NYC-LAX',
    class: 'Economy',
    price: 350,
    currency: 'USD',
    status: 'Active',
    version: 3,
  },
  {
    id: 'FAR-002',
    route: 'NYC-LAX',
    class: 'Business',
    price: 1200,
    currency: 'USD',
    status: 'Active',
    version: 2,
  },
  {
    id: 'FAR-003',
    route: 'LHR-JFK',
    class: 'Economy',
    price: 550,
    currency: 'GBP',
    status: 'Active',
    version: 5,
  },
  {
    id: 'FAR-004',
    route: 'SFO-DXB',
    class: 'First',
    price: 4500,
    currency: 'USD',
    status: 'Draft',
    version: 1,
  },
  {
    id: 'FAR-005',
    route: 'SIN-SYD',
    class: 'Economy',
    price: 400,
    currency: 'SGD',
    status: 'Inactive',
    version: 4,
  },
];

export default function FaresPage() {
  const [fares, setFares] = useState<Fare[]>(initialFares);
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

  const handleFormSubmit = (data: Fare) => {
    if (editingFare) {
      // Update existing fare
      setFares(fares.map((f) => (f.id === editingFare.id ? { ...f, ...data, version: f.version ? f.version + 1 : 1 } : f)));
      toast({ title: "Fare Updated", description: `Fare ${data.id} has been successfully updated.` });
    } else {
      // Add new fare
      const newFare = { ...data, id: `FAR-${String(fares.length + 1).padStart(3, '0')}`, version: 1 };
      setFares([...fares, newFare]);
      toast({ title: "Fare Created", description: `Fare ${newFare.id} has been successfully created.` });
    }
    handleDialogClose();
  };
  
   const handleDelete = (fareId: string) => {
    setFares(fares.filter(f => f.id !== fareId));
    toast({
      variant: 'destructive',
      title: 'Fare Deleted',
      description: `Fare with ID ${fareId} has been deleted.`,
    });
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fares.map((fare) => (
                <TableRow key={fare.id}>
                  <TableCell className="font-medium">{fare.route}</TableCell>
                  <TableCell>{fare.class}</TableCell>
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
                        <DropdownMenuItem>Create New Version</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(fare.id)}>
                          Delete
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFare ? 'Edit Fare' : 'Create New Fare'}</DialogTitle>
            <DialogDescription>
              {editingFare ? `Editing fare ${editingFare.id}.` : 'Enter the details for the new fare.'}
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
