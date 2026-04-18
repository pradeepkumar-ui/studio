
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
import { MoreHorizontal, PlusCircle, Wand2, Bot, User, ShieldCheck, Gauge, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PricingRuleForm, type PricingRule } from '@/components/forms/pricing-rule-form';
import { DynamicPricingRuleAssistant } from '@/components/ai/dynamic-pricing-rule-assistant';
import { GeneratePricingRuleOutput } from '@/ai/flows/generate-pricing-rule';

const initialRules: PricingRule[] = [
  { id: 'dp-001', name: 'Weekend Surge - LHR-JFK', targetProduct: 'Air', targetIdentifier: 'Business', conditions: 'Route: LHR-JFK, Load Factor > 80%', adjustment: '+10%', status: 'Active', source: 'Manual' },
  { id: 'dp-002', name: 'Last Minute - Domestic', targetProduct: 'Air', targetIdentifier: 'Economy', conditions: 'Departure < 48h, Market: US-DOM', adjustment: '+25%', status: 'Active', source: 'Manual' },
  { id: 'dp-003', name: 'Competitor Match - SIN-HKG', targetProduct: 'Air', targetIdentifier: 'All', conditions: 'Route: SIN-HKG', adjustment: '-5%', status: 'Test', source: 'AI' },
  { id: 'dp-004', name: 'Low Demand - Off-peak EU', targetProduct: 'Air', targetIdentifier: 'All', conditions: 'Load Factor < 50%, Market: EU', adjustment: '-15%', status: 'Active', source: 'Manual' },
  { id: 'dp-005', name: 'Lounge Capacity Surcharge', targetProduct: 'Ancillary', targetIdentifier: 'Lounge Access', conditions: 'Stock Level < 10', adjustment: '+$15', status: 'Active', source: 'Manual' },
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
      toast({ title: "Rule Updated", description: "The dynamic pricing policy has been updated." });
    } else {
      setRules([data, ...rules]);
      toast({ title: "Rule Created", description: "The new dynamic pricing policy is now active." });
    }
    handleDialogClose();
  };

  const handleAiRuleCreate = (aiOutput: GeneratePricingRuleOutput, newRuleData: PricingRule) => {
    setRules(prevRules => [newRuleData, ...prevRules]);
    setIsAiDialogOpen(false);
    toast({
        title: "AI Rule Created",
        description: `The rule "${newRuleData.name}" has been added to the test queue.`
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dynamic Pricing & continuous pricing</h1>
          <p className="text-muted-foreground">
            Manage deterministic pricing rules, continuous pricing deltas, and commercial guardrails.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAiDialogOpen(true)}>
            <Wand2 className="mr-2 h-4 w-4" />
            AI Strategy Assistant
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Pricing Policy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-emerald-200 bg-emerald-50/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Guardrails Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100% Enforced</div>
            <p className="text-[10px] text-muted-foreground mt-1">Global floor/ceiling bands protecting all 584 active price points.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
                <Gauge className="h-4 w-4 text-blue-600" /> Updates (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-[10px] text-muted-foreground mt-1">Continuous pricing micro-adjustments successfully committed to PSS.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-600" /> Exceptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">3</div>
            <p className="text-[10px] text-muted-foreground mt-1">Policy breaches automatically blocked by velocity guardrails.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Strategy Catalogue</CardTitle>
          <CardDescription>
            Management of deterministic rules and automated continuous pricing policies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Target domain</TableHead>
                <TableHead className="w-[30%]">Conditions & Signals</TableHead>
                <TableHead>Adjustment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="text-sm">{rule.targetProduct}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{rule.targetIdentifier}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{rule.conditions}</TableCell>
                  <TableCell className="font-mono text-sm font-bold text-primary">{rule.adjustment}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(rule.status)}>
                      {rule.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Rule Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog(rule)}>Edit Detailed Logic</DropdownMenuItem>
                        <DropdownMenuItem>View Guardrail History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Archive Policy</DropdownMenuItem>
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Modify Pricing Policy' : 'Define New Pricing Policy'}</DialogTitle>
            <DialogDescription>
              Set triggers, conditions, and continuous pricing logic with enforced guardrails.
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
            <DialogTitle>Dynamic Strategy AI Assistant</DialogTitle>
            <DialogDescription>Describe your commercial goal to generate an exhaustive pricing rule.</DialogDescription>
          </DialogHeader>
          <DynamicPricingRuleAssistant onRuleCreate={handleAiRuleCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
