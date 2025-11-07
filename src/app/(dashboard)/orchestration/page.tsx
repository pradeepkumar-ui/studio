'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, UploadCloud, GitBranch } from 'lucide-react';

const kpiData = [
  { title: 'Pending Approvals', value: '4' },
  { title: 'Published Today', value: '2' },
  { title: 'Rollbacks Executed', value: '1' },
  { title: 'Sync Health', value: '100%' },
];

const recentChanges = [
  {
    id: 'CR-1029',
    module: 'Seat Services',
    description: 'Updated pricing for exit-row seats',
    requestedBy: 'rm@airline.com',
    status: 'Approved',
  },
  {
    id: 'CR-1028',
    module: 'Ancillary Catalogue',
    description: 'Added "Priority Boarding" bundle',
    requestedBy: 'pm@airline.com',
    status: 'Published',
  },
  {
    id: 'CR-1027',
    module: 'Loyalty Awards',
    description: 'Rolled back Q4 point valuation table',
    requestedBy: 'system',
    status: 'Rolled Back',
  },
  {
    id: 'CR-1026',
    module: 'Dynamic Pricing',
    description: 'New rule for LHR-JFK weekend surge',
    requestedBy: 'rm@airline.com',
    status: 'Under Review',
  },
  {
    id: 'CR-1025',
    module: 'Fare Products',
    description: 'New "Economy Light" brand for domestic routes',
    requestedBy: 'pm@airline.com',
    status: 'Draft',
  },
];

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Published': return 'default';
        case 'Approved': return 'secondary';
        case 'Under Review': return 'outline';
        case 'Rolled Back': return 'destructive';
        case 'Draft': return 'outline';
        default: return 'outline';
    }
}

export default function OrchestrationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Change Management Dashboard
          </h1>
          <p className="text-muted-foreground">
            Govern and orchestrate changes across all Offer service configurations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <GitBranch className="mr-2" />
            View Dependencies
          </Button>
          <Button>
            <PlusCircle className="mr-2" />
            Create Change Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Recent Change Requests</CardTitle>
                <CardDescription>A summary of recent changes across all modules.</CardDescription>
            </div>
            <Button variant="outline">
                <UploadCloud className="mr-2" />
                Publish Approved
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Change ID</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentChanges.map((cr) => (
                <TableRow key={cr.id}>
                  <TableCell className="font-medium font-mono">{cr.id}</TableCell>
                  <TableCell>{cr.module}</TableCell>
                  <TableCell>{cr.description}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(cr.status)}>{cr.status}</Badge>
                  </TableCell>
                  <TableCell>{cr.requestedBy}</TableCell>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Approve</DropdownMenuItem>
                         <DropdownMenuItem>View Impact</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Reject
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
