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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { NsaForm, type NegotiatedSpaceAgreement } from '@/components/forms/nsa-form';

const initialNsa: NegotiatedSpaceAgreement[] = [
  {
    id: 'NSA-001',
    code: 'NSA-THR-2026',
    partnerId: 'TOUR-ALPHA',
    scope: 'SZX-BOM, Jan-Mar 2026',
    capacity: 30,
    status: 'Published',
    rbd: 'Q,N,V',
    brand: 'Value,Flex',
    pricing: 'INR Ladder',
    deadlines: 'Release: D-30, D-14. Name: D-14. Issue: D-7.',
    finance: '10% at contract, 20% at D-45. Standard penalties.',
  },
  {
    id: 'NSA-002',
    code: 'NSA-CORP-ACME',
    partnerId: 'ACME-CORP',
    scope: 'LHR-JFK, Full Year 2025',
    capacity: 10,
    status: 'Published',
    rbd: 'J,C',
    brand: 'Business Flex',
    pricing: 'Corporate Rates',
    deadlines: 'Release: D-14. Name: D-7. Issue: D-3.',
    finance: 'Monthly billing. No penalties.',
  },
  {
    id: 'NSA-003',
    code: 'NSA-MICE-CONF',
    partnerId: 'CONF-XYZ',
    scope: 'SIN-HKG, 15-20 May 2025',
    capacity: 150,
    status: 'Approved',
    rbd: 'Y,B,M',
    brand: 'Economy Standard',
    pricing: 'Fixed Fare',
    deadlines: 'Release: D-45. Name: D-21. Issue: D-14.',
    finance: '50% deposit required. Attrition penalties apply.',
  },
  {
    id: 'NSA-004',
    code: 'NSA-DRAFT-01',
    partnerId: 'NEW-PARTNER',
    scope: 'FRA-DXB, Winter 2025',
    capacity: 20,
    status: 'Draft',
    rbd: 'Y',
    brand: 'Economy',
    pricing: 'Pending',
    deadlines: 'Not set',
    finance: 'Not set',
  },
];

export default function NsaPage() {
  const [agreements, setAgreements] = useState<NegotiatedSpaceAgreement[]>(initialNsa);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNsa, setEditingNsa] = useState<NegotiatedSpaceAgreement | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (nsa: NegotiatedSpaceAgreement | null = null) => {
    setEditingNsa(nsa);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingNsa(null);
  };

  const handleFormSubmit = (data: NegotiatedSpaceAgreement) => {
    if (editingNsa) {
      setAgreements(agreements.map((a) => (a.id === editingNsa.id ? { ...a, ...data } : a)));
      toast({ title: 'Agreement Updated', description: `NSA "${data.code}" has been successfully updated.` });
    } else {
      const newNsa = { ...data, id: `NSA-${String(agreements.length + 1).padStart(3, '0')}` };
      setAgreements([...agreements, newNsa]);
      toast({ title: 'Agreement Created', description: `NSA "${newNsa.code}" has been successfully created.` });
    }
    handleDialogClose();
  };
  
   const getStatusBadgeVariant = (status: NegotiatedSpaceAgreement['status']) => {
    switch (status) {
      case 'Published':
        return 'default';
      case 'Approved':
      case 'Amended':
        return 'secondary';
      case 'Draft':
        return 'outline';
      case 'Expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Negotiated Space Agreements
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and track pre-negotiated capacity and pricing for partners.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2" />
          Create Agreement
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>NSA Catalogue</CardTitle>
          <CardDescription>
            Browse and manage all negotiated space agreements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract Code</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreements.map((nsa) => (
                <TableRow key={nsa.id}>
                  <TableCell className="font-medium">{nsa.code}</TableCell>
                  <TableCell>{nsa.partnerId}</TableCell>
                  <TableCell>{nsa.scope}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(nsa.status)}>
                      {nsa.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{nsa.pricing}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenDialog(nsa)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>View Performance</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Expire
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingNsa ? 'Edit Agreement' : 'Create New Agreement'}</DialogTitle>
            <DialogDescription>
              {editingNsa ? `Editing agreement "${editingNsa.code}".` : 'Define the terms for a new Negotiated Space Agreement.'}
            </DialogDescription>
          </DialogHeader>
          <NsaForm
            nsa={editingNsa}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
