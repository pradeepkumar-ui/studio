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
import { LoyaltyTierForm, type LoyaltyTier } from '@/components/forms/loyalty-tier-form';
import { EarningRuleForm, type EarningRule } from '@/components/forms/earning-rule-form';
import { RedemptionRuleForm, type RedemptionRule } from '@/components/forms/redemption-rule-form';


const initialTiers: LoyaltyTier[] = [
    { id: 'T-01', name: 'Bronze', qualification: '0 - 9,999 miles', benefits: 'Basic point earning' },
    { id: 'T-02', name: 'Silver', qualification: '10,000 - 24,999 miles', benefits: '+25% bonus points, Priority check-in' },
    { id: 'T-03', name: 'Gold', qualification: '25,000+ miles', benefits: '+50% bonus points, Lounge access, Priority boarding' },
];

const initialEarningRules: EarningRule[] = [
    { id: 'ER-01', name: 'Standard Earning', rate: '5 points / USD', applicableTo: 'All Economy Fares', tierBonus: 'N/A' },
    { id: 'ER-02', name: 'Business Class Earning', rate: '10 points / USD', applicableTo: 'All Business Fares', tierBonus: 'N/A' },
    { id: 'ER-03', name: 'Gold Tier Bonus', rate: '+50%', applicableTo: 'All Fares', tierBonus: 'Gold' },
];

const initialRedemptionRules: RedemptionRule[] = [
    { id: 'RR-01', type: 'Award Ticket', scope: 'Domestic Economy (one-way)', pointsCost: 15000, coPay: 25, currency: 'INR', status: 'Active' },
    { id: 'RR-02', type: 'Upgrade', scope: 'Domestic, Economy to Business', pointsCost: 10000, coPay: 50, currency: 'INR', status: 'Active' },
    { id: 'RR-03', type: 'Ancillary', scope: '1st Checked Bag (23kg)', pointsCost: 5000, coPay: 0, currency: 'INR', status: 'Active' },
    { id: 'RR-04', type: 'Award Ticket', scope: 'Europe to USA (Business, round-trip)', pointsCost: 120000, coPay: 250, currency: 'INR', status: 'Active' },
    { id: 'RR-05', type: 'Ancillary', scope: 'Lounge Access (any airport)', pointsCost: 7500, coPay: 0, currency: 'INR', status: 'Inactive' },
];

export default function LoyaltyProgramPage() {
  const { toast } = useToast();
  
  const [tiers, setTiers] = useState<LoyaltyTier[]>(initialTiers);
  const [earningRules, setEarningRules] = useState<EarningRule[]>(initialEarningRules);
  const [redemptionRules, setRedemptionRules] = useState<RedemptionRule[]>(initialRedemptionRules);

  const [isTierDialogOpen, setIsTierDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<LoyaltyTier | null>(null);
  
  const [isEarningRuleDialogOpen, setIsEarningRuleDialogOpen] = useState(false);
  const [editingEarningRule, setEditingEarningRule] = useState<EarningRule | null>(null);

  const [isRedemptionRuleDialogOpen, setIsRedemptionRuleDialogOpen] = useState(false);
  const [editingRedemptionRule, setEditingRedemptionRule] = useState<RedemptionRule | null>(null);


  const handleOpenDialog = (type: 'tier' | 'earning' | 'redemption', data: any | null = null) => {
    if (type === 'tier') {
      setEditingTier(data);
      setIsTierDialogOpen(true);
    } else if (type === 'earning') {
      setEditingEarningRule(data);
      setIsEarningRuleDialogOpen(true);
    } else if (type === 'redemption') {
        setEditingRedemptionRule(data);
        setIsRedemptionRuleDialogOpen(true);
    }
  };

  const handleTierSubmit = (data: LoyaltyTier) => {
    if (editingTier) {
      setTiers(tiers.map(t => t.id === data.id ? data : t));
      toast({ title: 'Tier Updated' });
    } else {
      const newTier = { ...data, id: `T-${String(tiers.length + 1).padStart(2, '0')}` };
      setTiers([...tiers, newTier]);
      toast({ title: 'Tier Created' });
    }
    setIsTierDialogOpen(false);
  };
  
  const handleEarningRuleSubmit = (data: EarningRule) => {
    if (editingEarningRule) {
      setEarningRules(earningRules.map(r => r.id === data.id ? data : r));
      toast({ title: 'Earning Rule Updated' });
    } else {
      const newRule = { ...data, id: `ER-${String(earningRules.length + 1).padStart(2, '0')}` };
      setEarningRules([...earningRules, newRule]);
      toast({ title: 'Earning Rule Created' });
    }
    setIsEarningRuleDialogOpen(false);
  };

  const handleRedemptionRuleSubmit = (data: RedemptionRule) => {
    if (editingRedemptionRule) {
        setRedemptionRules(redemptionRules.map(r => r.id === data.id ? data : r));
        toast({ title: 'Redemption Rule Updated' });
    } else {
        const newRule = { ...data, id: `RR-${String(redemptionRules.length + 1).padStart(2, '0')}` };
        setRedemptionRules([...redemptionRules, newRule]);
        toast({ title: 'Redemption Rule Created' });
    }
    setIsRedemptionRuleDialogOpen(false);
  }

  const getStatusBadgeVariant = (status: RedemptionRule['status']) => {
    return status === 'Active' ? 'default' : 'outline';
  };

  return (
    <>
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Loyalty Program Management
        </h1>
        <p className="text-muted-foreground">
          Define and manage loyalty tiers, earning rules, and award redemptions.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Loyalty Tiers</CardTitle>
            <CardDescription>
              Define the different levels of your loyalty program.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog('tier')}>
            <PlusCircle className="mr-2" />
            Add Tier
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier Name</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Key Benefits</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.map((tier) => (
                <TableRow key={tier.id}>
                  <TableCell className="font-medium">{tier.name}</TableCell>
                  <TableCell>{tier.qualification}</TableCell>
                  <TableCell>{tier.benefits}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog('tier', tier)}>Edit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Points Earning Rules</CardTitle>
            <CardDescription>
              Configure how customers accumulate points.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog('earning')}>
            <PlusCircle className="mr-2" />
            Add Rule
          </Button>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Earning Rate</TableHead>
                <TableHead>Applicable To</TableHead>
                <TableHead>Tier Bonus</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earningRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.rate}</TableCell>
                  <TableCell>{rule.applicableTo}</TableCell>
                  <TableCell>{rule.tierBonus}</TableCell>
                   <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog('earning', rule)}>Edit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Redemption Rules (Award Chart)</CardTitle>
            <CardDescription>
              Set the rules for how loyalty points can be redeemed.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog('redemption')}>
            <PlusCircle className="mr-2" />
            Add Redemption Rule
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Scope / Description</TableHead>
                <TableHead>Points Cost</TableHead>
                <TableHead>Co-pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redemptionRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <Badge variant="secondary">{rule.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{rule.scope}</TableCell>
                  <TableCell>{rule.pointsCost.toLocaleString()}</TableCell>
                  <TableCell>
                    {rule.coPay > 0 ? new Intl.NumberFormat('en-US', { style: 'currency', currency: rule.currency }).format(rule.coPay) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(rule.status)}>{rule.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog('redemption', rule)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Set capacity controls</DropdownMenuItem>
                         <DropdownMenuItem>Set bidding mechanism</DropdownMenuItem>
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

    <Dialog open={isTierDialogOpen} onOpenChange={setIsTierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTier ? 'Edit Loyalty Tier' : 'Create New Loyalty Tier'}</DialogTitle>
            <DialogDescription>
              Define the qualification rules and benefits for a tier.
            </DialogDescription>
          </DialogHeader>
          <LoyaltyTierForm
            tier={editingTier}
            onSubmit={handleTierSubmit}
            onCancel={() => setIsTierDialogOpen(false)}
          />
        </DialogContent>
    </Dialog>
    
     <Dialog open={isEarningRuleDialogOpen} onOpenChange={setIsEarningRuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEarningRule ? 'Edit Earning Rule' : 'Create New Earning Rule'}</DialogTitle>
            <DialogDescription>
              Configure how customers will accumulate points.
            </DialogDescription>
          </DialogHeader>
          <EarningRuleForm
            rule={editingEarningRule}
            onSubmit={handleEarningRuleSubmit}
            onCancel={() => setIsEarningRuleDialogOpen(false)}
          />
        </DialogContent>
    </Dialog>

    <Dialog open={isRedemptionRuleDialogOpen} onOpenChange={setIsRedemptionRuleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRedemptionRule ? 'Edit Redemption Rule' : 'Create New Redemption Rule'}</DialogTitle>
            <DialogDescription>
              Define how loyalty points can be redeemed for products or services.
            </DialogDescription>
          </DialogHeader>
          <RedemptionRuleForm
            rule={editingRedemptionRule}
            onSubmit={handleRedemptionRuleSubmit}
            onCancel={() => setIsRedemptionRuleDialogOpen(false)}
          />
        </DialogContent>
    </Dialog>
    </>
  );
}
