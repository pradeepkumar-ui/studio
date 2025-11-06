'use client';

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
import { useState } from 'react';

type PricingRule = {
  id: string;
  name: string;
  conditions: string;
  action: string;
  status: 'Active' | 'Inactive' | 'Test';
};

const initialRules: PricingRule[] = [
  {
    id: 'DPR-001',
    name: 'Weekend Surge - NYC/LAX',
    conditions: 'Route: NYC-LAX, Day: Fri-Sun, Load Factor > 85%',
    action: '+15% on Economy',
    status: 'Active',
  },
  {
    id: 'DPR-002',
    name: 'Low Demand Discount - SFO/SEA',
    conditions: 'Route: SFO-SEA, Day: Tue-Wed, Load Factor < 60%',
    action: '-10% on all classes',
    status: 'Active',
  },
  {
    id: 'DPR-003',
    name: 'Mobile App Promotion',
    conditions: 'Channel: Mobile App, Route: Any',
    action: '-5% on all fares',
    status: 'Test',
  },
  {
    id: 'DPR-004',
    name: 'Last Minute Booking Fee',
    conditions: 'Booking within 24hrs of departure',
    action: '+20% on all fares',
    status: 'Inactive',
  },
   {
    id: 'DPR-005',
    name: 'Red-eye Flight Special',
    conditions: 'Departure Time: 10pm-4am',
    action: '-12% on Economy',
    status: 'Active',
  },
];

export default function DynamicPricingPage() {
  const [rules, setRules] = useState<PricingRule[]>(initialRules);

  const getStatusBadgeVariant = (status: PricingRule['status']) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Test':
        return 'secondary';
      case 'Inactive':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Dynamic Pricing Rules
          </h1>
          <p className="text-muted-foreground">
            Adjust pricing based on rules for route, demand, and channel.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2" />
          Create Rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Rule Engine</CardTitle>
          <CardDescription>
            Manage and monitor all automated pricing rules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[40%]">Conditions</TableHead>
                <TableHead>Action</TableHead>
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
                    <Badge variant={getStatusBadgeVariant(rule.status)}>
                      {rule.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{rule.conditions}</TableCell>
                  <TableCell>{rule.action}</TableCell>
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                         <DropdownMenuItem>View Logs</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className={rule.status === 'Active' ? 'text-destructive' : ''}>
                          {rule.status === 'Active' ? 'Deactivate' : 'Activate'}
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
    </div>
  );
}
