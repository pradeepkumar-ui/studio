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
import { PricingRuleForm, type PricingRule } from '@/components/forms/pricing-rule-form';

const initialRules: PricingRule[] = [
  { id: 'dp-001', name: 'Weekend Surge - LHR-JFK', conditions: 'Route: LHR-JFK, Load Factor > 80%', action: '+10% on Business', status: 'Active' },
  { id: 'dp-002', name: 'Last Minute - Domestic', conditions: 'Departure < 48h, Market: US-DOM', action: '+25% on Economy', status: 'Active' },
  { id: 'dp-003', name: 'Competitor Match - SIN-HKG', conditions: 'Route: SIN-HKG', action: '-5% on All', status: 'Test' },
  { id: 'dp-004', name: 'Low Demand - Off-peak EU', conditions: 'Load Factor < 50%, Market: EU', action: '-15% on All', status: 'Active' },
  { id: 'dp-005', name: 'Holiday Blackout', conditions: 'Date range: 20-Dec to 05-Jan', action: 'Disable all discounts', status: 'Inactive' },
];

export default function DynamicPricingRulesPage() {
  const [rules, setRules] = useState<PricingRule[]>(initialRules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (rule: PricingRule | null = null) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingRule(null);
  };

  const handleFormSubmit = (data: PricingRule) => {
    if (editingRule) {
      setRules(rules.map((r) => (r.id === editingRule.id ? { ...r, ...data } : r)));
      toast({ title: "Rule Updated", description: `Rule "${data.name}" has been updated.` });
    } else {
      const newRule = { ...data, id: `dp-00${rules.length + 1}` };
      setRules([...rules, newRule]);
      toast({ title: "Rule Created", description: `Rule "${newRule.name}" has been created.` });
    }
    handleDialogClose();
  };
  
  const getStatusBadgeVariant = (status: PricingRule['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Test': return 'secondary';
      case 'Inactive': return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dynamic Pricing Rules</h1>
          <p className="text-muted-foreground">
            Manage the rules that govern automated pricing adjustments.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2" />
          Create Rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Rule Catalogue</CardTitle>
          <CardDescription>
            Manage all dynamic pricing rules and their configurations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead className="w-[30%]">Conditions</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{rule.conditions}</TableCell>
                  <TableCell className="font-mono text-sm">{rule.action}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(rule.status)}>
                      {rule.status}
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
                        <DropdownMenuItem onClick={() => handleOpenDialog(rule)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
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
            <DialogTitle>{editingRule ? 'Edit Pricing Rule' : 'Create New Pricing Rule'}</DialogTitle>
            <DialogDescription>
              {editingRule ? `Editing rule "${editingRule.name}".` : 'Define a new rule for the dynamic pricing engine.'}
            </DialogDescription>
          </DialogHeader>
          <PricingRuleForm
            rule={editingRule}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
