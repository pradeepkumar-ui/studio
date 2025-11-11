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
import { MoreHorizontal, PlusCircle, UploadCloud, GitBranch, Loader2 } from 'lucide-react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, Timestamp } from 'firebase/firestore';
import Link from 'next/link';

type ChangeRequest = {
  id: string;
  module: string;
  description: string;
  requestedBy: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Published' | 'Rolled Back';
  createdAt: Timestamp;
};

const mockChanges: ChangeRequest[] = [
  {
    id: 'CR-1029',
    module: 'Seat Services',
    description: 'Updated pricing for exit-row seats',
    requestedBy: 'rm@airline.com',
    status: 'Approved',
    createdAt: new Timestamp(Math.floor(Date.now() / 1000) - 3600, 0)
  },
  {
    id: 'CR-1028',
    module: 'Ancillary Catalogue',
    description: 'Added "Priority Boarding" bundle',
    requestedBy: 'pm@airline.com',
    status: 'Published',
     createdAt: new Timestamp(Math.floor(Date.now() / 1000) - 7200, 0)
  },
  {
    id: 'CR-1027',
    module: 'Loyalty Awards',
    description: 'Rolled back Q4 point valuation table',
    requestedBy: 'system',
    status: 'Rolled Back',
     createdAt: new Timestamp(Math.floor(Date.now() / 1000) - 10800, 0)
  },
  {
    id: 'CR-1026',
    module: 'Dynamic Pricing',
    description: 'New rule for LHR-JFK weekend surge',
    requestedBy: 'rm@airline.com',
    status: 'Under Review',
     createdAt: new Timestamp(Math.floor(Date.now() / 1000) - 14400, 0)
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

export default function OrchestrationDashboardPage() {
  const firestore = useFirestore();
  const { data: changeRequestsCollection, loading, error } = useCollection(firestore ? collection(firestore, 'changeRequests') : undefined);

  const changeRequests = changeRequestsCollection ? (changeRequestsCollection as ChangeRequest[]).sort((a,b) => b.createdAt.seconds - a.createdAt.seconds) : mockChanges;
  
  const kpiData = [
    { title: 'Pending Approvals', value: changeRequests.filter(cr => cr.status === 'Under Review').length },
    { title: 'Published Today', value: '2' },
    { title: 'Rollbacks Executed', value: '1' },
    { title: 'Sync Health', value: '100%' },
  ];

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
          <Button asChild>
            <Link href="/orchestration/create">
                <PlusCircle className="mr-2" />
                Create Change Request
            </Link>
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
          {loading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
           ) : error ? (
              <p className="text-destructive text-center">Error loading change requests.</p>
           ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
                {changeRequests.map((cr) => (
                  <TableRow key={cr.id}>
                    <TableCell className="font-medium">{cr.module}</TableCell>
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
           )}
        </CardContent>
      </Card>
    </div>
  );
}
