
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
import { MoreHorizontal, PlusCircle, Wand2, Bot, User, Package, Plane } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PricingRuleForm, type PricingRule, type PricingRuleFormData } from '@/components/forms/pricing-rule-form';
import { DynamicPricingRuleAssistant } from '@/components/ai/dynamic-pricing-rule-assistant';
import { GeneratePricingRuleOutput } from '@/ai/flows/generate-pricing-rule';


const initialRules: PricingRule[] = [
  { id: 'dp-001', name: 'Weekend Surge - LHR-JFK', targetProduct: 'Air', targetIdentifier: 'Business', conditions: 'Route: LHR-JFK, Load Factor > 80%', adjustment: '+10%', status: 'Active', source: 'Manual' },
  { id: 'dp-002', name: 'Last Minute - Domestic', targetProduct: 'Air', targetIdentifier: 'Economy', conditions: 'Departure < 48h, Market: US-DOM', adjustment: '+25%', status: 'Active', source: 'Manual' },
  { id: 'dp-003', name: 'Competitor Match - SIN-HKG', targetProduct: 'Air', targetIdentifier: 'All', conditions: 'Route: SIN-HKG', adjustment: '-5%', status: 'Test', source: 'AI' },
  { id: 'dp-004', name: 'Low Demand - Off-peak EU', targetProduct: 'Air', targetIdentifier: 'All', conditions: 'Load Factor < 50%, Market: EU', adjustment: '-15%', status: 'Active', source: 'Manual' },
  { id: 'dp-005', name: 'Holiday Blackout', targetProduct: 'Air', targetIdentifier: 'All', conditions: 'Date range: 20-Dec to 05-Jan', adjustment: 'Disable Discounts', status: 'Inactive', source: 'Manual' },
];

export default function DynamicPricingRulesPage() {
  const [rules, setRules] = useState<PricingRule[]>(initialRules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
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
      setRules(rules.map((r) => (r.id === editingRule.id ? data : r)));
      toast({ title: "Rule Updated", description: `Rule "${data.name}" has been updated.` });
    } else {
      const newRule: PricingRule = { ...data, id: `dp-${Math.random().toString(36).substr(2, 9)}` };
      setRules([newRule, ...rules]);
      toast({ title: "Rule Created", description: `Rule "${newRule.name}" has been created.` });
    }
    handleDialogClose();
  };

  const handleAiRuleCreate = (aiOutput: GeneratePricingRuleOutput, newRuleData: PricingRule) => {
    setRules(prevRules => [newRuleData, ...prevRules]);
    setIsAiDialogOpen(false);
    toast({
        title: "AI Rule Created",
        description: `The rule "${newRuleData.name}" has been added to the list.`
    });
  }
  
  const getStatusBadgeVariant = (status: PricingRule['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Test': return 'secondary';
      case 'Inactive': return 'outline';
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dynamic Pricing Rules</h1>
            <p className="text-muted-foreground">
              Manage the rules that govern automated pricing adjustments.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAiDialogOpen(true)}>
              <Wand2 className="mr-2" />
              Generate with AI
            </Button>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2" />
              Create Rule
            </Button>
          </div>
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
                  <TableHead>Target</TableHead>
                  <TableHead className="w-[30%]">Conditions</TableHead>
                  <TableHead>Adjustment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {rule.targetProduct === 'Air' ? <Plane className="h-4 w-4 text-muted-foreground" /> : <Package className="h-4 w-4 text-muted-foreground" />}
                        <div>
                          <div>{rule.targetProduct}</div>
                          <div className="text-xs text-muted-foreground">{rule.targetIdentifier}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{rule.conditions}</TableCell>
                    <TableCell className="font-mono text-sm">{rule.adjustment}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(rule.status)}>
                        {rule.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                           {rule.source === 'AI' ? <Bot /> : <User />}
                           <span>{rule.source}</span>
                        </div>
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
        
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
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

       <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Dynamic Pricing AI Assistant</DialogTitle>
            <DialogDescription>
             Describe the pricing rule you want to create in plain language.
            </DialogDescription>
          </DialogHeader>
          <DynamicPricingRuleAssistant onRuleCreate={handleAiRuleCreate} />
        </DialogContent>
      </Dialog>
    </>
  );
}
