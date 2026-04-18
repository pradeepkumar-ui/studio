
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
import { MoreHorizontal, PlusCircle, Settings2, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BookingClassForm, type BookingClass } from '@/components/forms/booking-class-form';

const initialBookingClasses: any[] = [
  { code: 'F', cabin: 'First', description: 'Full Fare First', status: 'Active', overbookingCap: 2, waitlist: true },
  { code: 'A', cabin: 'First', description: 'Discounted First', status: 'Active', overbookingCap: 0, waitlist: true },
  { code: 'J', cabin: 'Business', description: 'Full Fare Business', status: 'Active', overbookingCap: 5, waitlist: true },
  { code: 'C', cabin: 'Business', description: 'Discounted Business', status: 'Active', overbookingCap: 3, waitlist: true },
  { code: 'Y', cabin: 'Economy', description: 'Full Fare Economy', status: 'Active', overbookingCap: 10, waitlist: true },
  { code: 'Q', cabin: 'Economy', description: 'Deep Discount Economy', status: 'Inactive', overbookingCap: 0, waitlist: false },
];

export function BookingClasses() {
  const [bookingClasses, setBookingClasses] = useState<any[]>(initialBookingClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any | null>(null);
  const { toast } = useToast();
  
  const handleOpenDialog = (bookingClass: any | null = null) => {
    setEditingClass(bookingClass);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingClass(null);
  };
  
  const handleFormSubmit = (data: any) => {
    if (editingClass) {
      setBookingClasses(bookingClasses.map((bc) => (bc.code === editingClass.code ? { ...bc, ...data } : bc)));
      toast({ title: "Booking Class Updated", description: `Class ${data.code} configurations saved.` });
    } else {
      if (bookingClasses.some(bc => bc.code === data.code)) {
          toast({ variant: 'destructive', title: 'Error', description: `Booking class with code "${data.code}" already exists.` });
          return;
      }
      setBookingClasses([...bookingClasses, data].sort((a, b) => a.code.localeCompare(b.code)));
      toast({ title: "Booking Class Created", description: `Class ${data.code} has been successfully added to PSS mapping.` });
    }
    handleDialogClose();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Booking Classes (RBD Registry)</CardTitle>
            <CardDescription>Configure reservation booking designators and overbooking thresholds.</CardDescription>
          </div>
          <Button size="sm" onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add RBD
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Cabin</TableHead>
                <TableHead>O/B Cap</TableHead>
                <TableHead>W/L</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingClasses.map((bc) => (
                <TableRow key={bc.code}>
                  <TableCell className="font-mono font-bold text-primary">{bc.code}</TableCell>
                  <TableCell className="text-xs uppercase tracking-wider">{bc.cabin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs">{bc.overbookingCap}</span>
                        {bc.overbookingCap > 5 && <ShieldAlert className="h-3 w-3 text-orange-500" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{bc.waitlist ? 'YES' : 'NO'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={bc.status === 'Active' ? 'default' : 'outline'}>{bc.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog(bc)}><Settings2 className="mr-2 h-4 w-4"/>Edit Rules</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Archive RBD</DropdownMenuItem>
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
          <DialogContent className="max-w-2xl">
              <DialogHeader>
                  <DialogTitle>{editingClass ? 'Configure RBD Integrity' : 'Define New RBD'}</DialogTitle>
                  <DialogDescription>Set inventory controls and waitlist eligibility for this booking designator.</DialogDescription>
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
