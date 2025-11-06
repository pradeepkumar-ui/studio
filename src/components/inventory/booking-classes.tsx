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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BookingClassForm, type BookingClass } from '@/components/forms/booking-class-form';

const initialBookingClasses: BookingClass[] = [
  { code: 'F', cabin: 'First', description: 'Full Fare First', status: 'Active' },
  { code: 'J', cabin: 'Business', description: 'Full Fare Business', status: 'Active' },
  { code: 'C', cabin: 'Business', description: 'Discounted Business', status: 'Active' },
  { code: 'W', cabin: 'Premium Economy', description: 'Full Fare Premium Economy', status: 'Active' },
  { code: 'Y', cabin: 'Economy', description: 'Full Fare Economy', status: 'Active' },
  { code: 'B', cabin: 'Economy', description: 'Standard Economy', status: 'Active' },
  { code: 'M', cabin: 'Economy', description: 'Standard Economy', status: 'Active' },
  { code: 'Q', cabin: 'Economy', description: 'Discounted Economy', status: 'Inactive' },
];

export function BookingClasses() {
  const [bookingClasses, setBookingClasses] = useState<BookingClass[]>(initialBookingClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<BookingClass | null>(null);
  const { toast } = useToast();
  
  const handleOpenDialog = (bookingClass: BookingClass | null = null) => {
    setEditingClass(bookingClass);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingClass(null);
  };
  
  const handleFormSubmit = (data: BookingClass) => {
    if (editingClass) {
      setBookingClasses(bookingClasses.map((bc) => (bc.code === editingClass.code ? { ...bc, ...data } : bc)));
      toast({ title: "Booking Class Updated", description: `Class ${data.code} has been successfully updated.` });
    } else {
      if (bookingClasses.some(bc => bc.code === data.code)) {
          toast({ variant: 'destructive', title: 'Error', description: `Booking class with code "${data.code}" already exists.` });
          return;
      }
      setBookingClasses([...bookingClasses, data]);
      toast({ title: "Booking Class Created", description: `Class ${data.code} has been successfully created.` });
    }
    handleDialogClose();
  };

  const toggleStatus = (code: string, currentStatus: 'Active' | 'Inactive') => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setBookingClasses(bookingClasses.map(bc => bc.code === code ? {...bc, status: newStatus} : bc));
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Booking Classes</CardTitle>
            <CardDescription>Define the classes of service for inventory.</CardDescription>
          </div>
          <Button size="sm" onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Class
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Cabin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingClasses.map((bc) => (
                <TableRow key={bc.code}>
                  <TableCell className="font-mono">{bc.code}</TableCell>
                  <TableCell>{bc.cabin}</TableCell>
                  <TableCell>
                    <Badge variant={bc.status === 'Active' ? 'default' : 'outline'}>
                      {bc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog(bc)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(bc.code, bc.status)}>
                          Set to {bc.status === 'Active' ? 'Inactive' : 'Active'}
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
                  <DialogTitle>{editingClass ? 'Edit Booking Class' : 'Create New Booking Class'}</DialogTitle>
                  <DialogDescription>
                      {editingClass ? `Editing booking class "${editingClass.code}".` : 'Define a new booking class.'}
                  </DialogDescription>
              </DialogHeader>
              <BookingClassForm
                  bookingClass={editingClass}
                  onSubmit={handleFormSubmit}
                  onCancel={handleDialogClose}
              />
          </DialogContent>
      </Dialog>
    </>
  );
}
