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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, RadioTower, CheckCircle, AlertTriangle, XCircle, FileJson, RotateCw, ShieldOff, PlusCircle } from 'lucide-react';

const kpiData = [
  { title: 'Active Partners', value: '42' },
  { title: 'Pending Approvals', value: '3' },
  { title: 'SLA Health', value: '99.1%' },
  { title: 'Avg. API Latency', value: '250ms' },
];

const connectors = [
  {
    id: 'ndc_a',
    name: 'NDC Provider A',
    status: 'UP',
    latency: '820ms',
    errorRate: '0.9%',
    calls: '18k/day',
    mappingVersion: 'v12',
  },
  {
    id: 'gds_b',
    name: 'GDS Provider B',
    status: 'DEGRADED',
    latency: '1.6s',
    errorRate: '3.4%',
    calls: '42k/day',
    mappingVersion: 'v8',
  },
  {
    id: 'anc_c',
    name: 'Ancillary Aggregator C',
    status: 'UP',
    latency: '450ms',
    errorRate: '0.2%',
    calls: '112k/day',
    mappingVersion: 'v4',
  },
  {
    id: 'tax_d',
    name: 'Tax Engine D',
    status: 'DOWN',
    latency: 'N/A',
    errorRate: '100%',
    calls: '5k/day',
    mappingVersion: 'v2',
  },
];

const partnerAgreements = [
    { id: 'PNR-001', name: 'OTA360', type: 'OTA', status: 'Active', commercialModel: '15% Commission' },
    { id: 'PNR-002', name: 'CorpTravel Inc.', type: 'TMC', status: 'Active', commercialModel: 'Net Rate' },
    { id: 'PNR-003', name: 'Global GDS', type: 'GDS', status: 'Active', commercialModel: 'Segment Fee' },
    { id: 'PNR-004', name: 'NewDistributor', type: 'NDC', status: 'Pending Approval', commercialModel: 'N/A' },
];


const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'UP':
    case 'Active':
      return 'default';
    case 'DEGRADED':
    case 'Pending Approval':
      return 'secondary';
    case 'DOWN':
    case 'Inactive':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UP':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'DEGRADED':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'DOWN':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
}

export default function BrokerPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
                Partner Management
            </h1>
            <p className="text-muted-foreground">
                Onboard, configure, and monitor all external ecosystem partners.
            </p>
        </div>
        <Button>
            <PlusCircle className="mr-2" /> Add Partner
        </Button>
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
        <CardHeader>
            <CardTitle>Partner Agreements</CardTitle>
            <CardDescription>Manage all onboarded partners and their commercial configurations.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Partner Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Commercial Model</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {partnerAgreements.map((partner) => (
                        <TableRow key={partner.id}>
                            <TableCell className="font-medium">{partner.name}</TableCell>
                            <TableCell><Badge variant="outline">{partner.type}</Badge></TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(partner.status)}>
                                    {partner.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{partner.commercialModel}</TableCell>
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
                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Manage Credentials</DropdownMenuItem>
                                        <DropdownMenuItem>View Performance</DropdownMenuItem>
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
        <CardHeader>
            <CardTitle>Partner Connectivity</CardTitle>
            <CardDescription>Live status of all integrated partner adapters and system connectors.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Connector</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>p95 Latency</TableHead>
                        <TableHead>Error Rate</TableHead>
                        <TableHead>Traffic</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {connectors.map((connector) => (
                        <TableRow key={connector.id}>
                            <TableCell className="font-medium">{connector.name}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(connector.status)} className="gap-1 pl-1.5">
                                    {getStatusIcon(connector.status)}
                                    {connector.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{connector.latency}</TableCell>
                            <TableCell>{connector.errorRate}</TableCell>
                            <TableCell>{connector.calls}</TableCell>
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
                                        <DropdownMenuItem><FileJson className="mr-2 h-4 w-4" /> View Mappings ({connector.mappingVersion})</DropdownMenuItem>
                                        <DropdownMenuItem><RotateCw className="mr-2 h-4 w-4" /> Rotate Secrets</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive"><ShieldOff className="mr-2 h-4 w-4" /> Disable Connector</DropdownMenuItem>
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
