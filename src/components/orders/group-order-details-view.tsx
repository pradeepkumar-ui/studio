
'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  User,
  CreditCard,
  Plane,
  AlertTriangle,
  Users,
  PlusCircle,
  Upload,
  Download,
  FileSpreadsheet,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PassengerDetailsForm, PassengerDetails } from '../forms/passenger-details-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type GroupOrderDetails = {
    id: string;
    offerId: string;
    groupName: string;
    totalPassengers: number;
    status: 'Pending Approval' | 'Active' | 'Fulfilled' | 'Cancelled';
    itinerary: {
        origin: string;
        destination: string;
        departureDate: string;
        returnDate: string | null;
        isInternational: boolean;
    };
    deadlines: {
        depositDue: string;
        namesDue: string;
        finalPaymentDue: string;
    };
    payment: {
        totalAmount: number;
        currency: string;
        depositAmount: number;
        depositStatus: 'Paid' | 'Pending' | 'Overdue';
        finalPaymentStatus: 'Paid' | 'Pending' | 'Overdue';
    };
    manifest: PassengerDetails[];
    rosters: { name: string; passengers: number }[];
};

interface GroupOrderDetailsViewProps {
  order: GroupOrderDetails;
  setOrder: React.Dispatch<React.SetStateAction<GroupOrderDetails>>;
  onRosterLoad: (rosterName: string) => void;
}

const getStatusBadgeVariant = (status: GroupOrderDetails['status']) => {
  switch (status) {
    case 'Active': return 'default';
    case 'Pending Approval': return 'secondary';
    case 'Fulfilled': return 'outline';
    case 'Cancelled': return 'destructive';
    default: return 'outline';
  }
};

const getPaymentStatusBadgeVariant = (status: 'Paid' | 'Pending' | 'Overdue') => {
  switch (status) {
    case 'Paid': return 'default';
    case 'Pending': return 'secondary';
    case 'Overdue': return 'destructive';
    default: return 'outline';
  }
};


export function GroupOrderDetailsView({ order, setOrder, onRosterLoad }: GroupOrderDetailsViewProps) {
    const { toast } = useToast();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPassenger, setEditingPassenger] = useState<PassengerDetails | null>(null);

    const handleAddPassenger = () => {
        setEditingPassenger(null);
        setIsFormOpen(true);
    }
    
    const handleEditPassenger = (passenger: PassengerDetails) => {
        setEditingPassenger(passenger);
        setIsFormOpen(true);
    }

    const handleFormSubmit = (data: PassengerDetails) => {
        setOrder(prev => {
            const newManifest = editingPassenger
                ? prev.manifest.map(p => p.id === data.id ? data : p)
                : [...prev.manifest, { ...data, id: `PAX-${Date.now()}` }];
            return { ...prev, manifest: newManifest };
        });
        toast({ title: editingPassenger ? 'Passenger Updated' : 'Passenger Added' });
        setIsFormOpen(false);
    }
    
    const handleUpload = () => {
        toast({ title: 'File Upload Clicked', description: 'This would open a file dialog to upload a passenger list CSV.'});
    }
    
    const handleDownloadTemplate = () => {
         toast({ title: 'Template Downloaded', description: 'A CSV template for passenger details has been downloaded.'});
    }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Passenger Manifest ({order.manifest.length}/{order.totalPassengers})</CardTitle>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadTemplate}><Download className="mr-2 h-4 w-4"/>Template</Button>
                    <Button variant="outline" size="sm" onClick={handleUpload}><Upload className="mr-2 h-4 w-4"/>Upload List</Button>
                    <Button size="sm" onClick={handleAddPassenger}><PlusCircle className="mr-2 h-4 w-4"/>Add Passenger</Button>
                 </div>
            </CardHeader>
            <CardContent>
                {order.manifest.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>DOB</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.manifest.map(pax => (
                                <TableRow key={pax.id}>
                                    <TableCell>{pax.name}</TableCell>
                                    <TableCell>{pax.type}</TableCell>
                                    <TableCell>{pax.dob}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditPassenger(pax)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No passengers added yet. Add passengers individually or upload a list.</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <CardTitle>Group Summary</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Group Name</span>
                        <span className="font-semibold text-right">{order.groupName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                    </div>
                    {order.itinerary.isInternational && (
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Trip Type</span>
                            <Badge variant="outline">International</Badge>
                        </div>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <CardTitle>Pending Actions</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 rounded-md bg-destructive/10">
                        <span className="font-semibold text-destructive">Deposit Due</span>
                        <span className="font-semibold text-destructive">{order.deadlines.depositDue}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-md bg-yellow-500/10">
                        <span className="font-semibold text-yellow-700">Passenger Names Due</span>
                        <span className="font-semibold text-yellow-700">{order.deadlines.namesDue}</span>
                    </div>
                     <div className="flex justify-between p-2 rounded-md bg-yellow-500/10">
                        <span className="font-semibold text-yellow-700">Final Payment Due</span>
                        <span className="font-semibold text-yellow-700">{order.deadlines.finalPaymentDue}</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        <CardTitle>Passenger Roster</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">Load a saved passenger list for this booking.</p>
                     <Select onValueChange={onRosterLoad}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a roster..." />
                        </SelectTrigger>
                        <SelectContent>
                            {order.rosters.map(roster => (
                                <SelectItem key={roster.name} value={roster.name}>
                                    {roster.name} ({roster.passengers} passengers)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Button variant="link" className="p-0 h-auto text-xs">Save current list as new roster</Button>
                </CardContent>
            </Card>
        </div>
      </div>

       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{editingPassenger ? 'Edit Passenger Details' : 'Add New Passenger'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the passenger. Required fields are marked with an asterisk.
                    </DialogDescription>
                </DialogHeader>
                <PassengerDetailsForm
                    passenger={editingPassenger}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsFormOpen(false)}
                    isInternational={order.itinerary.isInternational}
                />
            </DialogContent>
        </Dialog>
    </>
  )
}
