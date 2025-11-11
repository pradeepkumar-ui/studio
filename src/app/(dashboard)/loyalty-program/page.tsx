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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type LoyaltyTier = {
  id: string;
  name: string;
  qualification: string;
  benefits: string;
};

type EarningRule = {
    id: string;
    name: string;
    rate: string;
    applicableTo: string;
    tierBonus: string;
};

type RedemptionRule = {
  id: string;
  type: 'Award Ticket' | 'Upgrade' | 'Ancillary';
  scope: string;
  pointsCost: number;
  coPay: number;
  currency: string;
  status: 'Active' | 'Inactive';
};

const mockTiers: LoyaltyTier[] = [
    { id: 'T-01', name: 'Bronze', qualification: '0 - 9,999 miles', benefits: 'Basic point earning' },
    { id: 'T-02', name: 'Silver', qualification: '10,000 - 24,999 miles', benefits: '+25% bonus points, Priority check-in' },
    { id: 'T-03', name: 'Gold', qualification: '25,000+ miles', benefits: '+50% bonus points, Lounge access, Priority boarding' },
];

const mockEarningRules: EarningRule[] = [
    { id: 'ER-01', name: 'Standard Earning', rate: '5 points / USD', applicableTo: 'All Economy Fares', tierBonus: 'N/A' },
    { id: 'ER-02', name: 'Business Class Earning', rate: '10 points / USD', applicableTo: 'All Business Fares', tierBonus: 'N/A' },
    { id: 'ER-03', name: 'Gold Tier Bonus', rate: '+50%', applicableTo: 'All Fares', tierBonus: 'Gold' },
];

const mockRedemptionRules: RedemptionRule[] = [
    { id: 'RR-01', type: 'Award Ticket', scope: 'Domestic Economy (one-way)', pointsCost: 15000, coPay: 25, currency: 'USD', status: 'Active' },
    { id: 'RR-02', type: 'Upgrade', scope: 'Domestic, Economy to Business', pointsCost: 10000, coPay: 50, currency: 'USD', status: 'Active' },
    { id: 'RR-03', type: 'Ancillary', scope: '1st Checked Bag (23kg)', pointsCost: 5000, coPay: 0, currency: 'USD', status: 'Active' },
    { id: 'RR-04', type: 'Award Ticket', scope: 'Europe to USA (Business, round-trip)', pointsCost: 120000, coPay: 250, currency: 'USD', status: 'Active' },
    { id: 'RR-05', type: 'Ancillary', scope: 'Lounge Access (any airport)', pointsCost: 7500, coPay: 0, currency: 'USD', status: 'Inactive' },
];

export default function LoyaltyProgramPage() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: 'Action Triggered',
      description: `${action} functionality is not yet implemented.`,
    });
  };

  const getStatusBadgeVariant = (status: RedemptionRule['status']) => {
    return status === 'Active' ? 'default' : 'outline';
  };

  return (
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
          <Button onClick={() => handleAction('Add Tier')}>
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
              {mockTiers.map((tier) => (
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
                        <DropdownMenuItem onClick={() => handleAction('Edit Tier')}>Edit</DropdownMenuItem>
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
          <Button onClick={() => handleAction('Add Earning Rule')}>
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
              {mockEarningRules.map((rule) => (
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
                        <DropdownMenuItem onClick={() => handleAction('Edit Earning Rule')}>Edit</DropdownMenuItem>
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
          <Button onClick={() => handleAction('Add Redemption Rule')}>
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
              {mockRedemptionRules.map((rule) => (
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
                        <DropdownMenuItem onClick={() => handleAction('Edit Redemption Rule')}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('Set capacity controls')}>Set capacity controls</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleAction('Set bidding mechanism')}>Set bidding mechanism</DropdownMenuItem>
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
  );
}
