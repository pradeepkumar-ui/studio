
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
import { GroupOfferRuleForm, type GroupOfferRule } from '@/components/forms/group-offer-rule-form';

const initialRules: GroupOfferRule[] = [
    {
        id: 'GOR-001',
        name: 'Student Group Discount (EU)',
        status: 'Active',
        market: 'EU',
        passengerCount: { min: 10, max: 50 },
        priceAdjustment: -15,
        terms: 'Standard Student Group T&Cs',
    },
    {
        id: 'GOR-002',
        name: 'Corporate Bulk Booking (US)',
        status: 'Active',
        market: 'US',
        passengerCount: { min: 20, max: 200 },
        priceAdjustment: -20,
        terms: 'Corporate Net Fare Agreement T&Cs',
    },
    {
        id: 'GOR-003',
        name: 'Tour Operator Nett (APAC)',
        status: 'Draft',
        market: 'APAC',
        passengerCount: { min: 15, max: 100 },
        priceAdjustment: 0,
        terms: 'Tour Operator Series Fare T&Cs',
    },
];


export default function GroupOfferRulesPage() {
  const [rules, setRules] = useState<GroupOfferRule[]>(initialRules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<GroupOfferRule | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (rule: GroupOfferRule | null = null) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingRule(null);
  };

  const handleFormSubmit = (data: GroupOfferRule) => {
    if (editingRule) {
      setRules(rules.map((r) => (r.id === editingRule.id ? { ...r, ...data } : r)));
      toast({ title: 'Rule Updated', description: `Group offer rule "${data.name}" has been updated.` });
    } else {
      const newRule = { ...data, id: `GOR-00${rules.length + 1}`};
      setRules([newRule, ...rules]);
      toast({ title: 'Rule Created', description: `New group offer rule "${data.name}" has been created.` });
    }
    handleDialogClose();
  };
  
  const getStatusBadgeVariant = (status: GroupOfferRule['status']) => {
    switch(status) {
        case 'Active': return 'default';
        case 'Draft': return 'secondary';
        case 'Inactive': return 'outline';
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
                Group Offer Rules
            </h1>
            <p className="text-muted-foreground">
                Define business rules for automated group offer responses.
            </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Rule
        </Button>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Rule Catalogue</CardTitle>
                <CardDescription>
                    Manage all business rules that govern automated group price computation.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rule Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Market</TableHead>
                            <TableHead>Passenger Count</TableHead>
                            <TableHead>Price Adjustment</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rules.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell className="font-medium">{rule.name}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(rule.status)}>{rule.status}</Badge>
                                </TableCell>
                                <TableCell>{rule.market}</TableCell>
                                <TableCell>{rule.passengerCount.min} - {rule.passengerCount.max}</TableCell>
                                <TableCell>{rule.priceAdjustment}%</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleOpenDialog(rule)}>Edit</DropdownMenuItem>
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
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{editingRule ? 'Edit Group Offer Rule' : 'Create New Group Offer Rule'}</DialogTitle>
                    <DialogDescription>
                        Define the scope, pricing, and terms for an automated group offer rule.
                    </DialogDescription>
                </DialogHeader>
                <GroupOfferRuleForm 
                    rule={editingRule}
                    onSubmit={handleFormSubmit}
                    onCancel={handleDialogClose}
                />
            </DialogContent>
        </Dialog>
    </div>
  );
}
