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
import { MoreHorizontal, RadioTower, CheckCircle, AlertTriangle, XCircle, FileJson, RotateCw, ShieldOff } from 'lucide-react';

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

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'UP':
      return 'default';
    case 'DEGRADED':
      return 'secondary';
    case 'DOWN':
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
      <div className="flex items-center gap-4">
        <RadioTower className="w-8 h-8 text-muted-foreground" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Broker Management
          </h1>
          <p className="text-muted-foreground">
            Manage routing, partner integrations, schema mappings, and resilience for all offer provider communications.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Connectors Registry</CardTitle>
            <CardDescription>Live status of all integrated partner adapters and connectors.</CardDescription>
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
                                        <DropdownMenuItem><FileJson className="mr-2" /> View Mappings ({connector.mappingVersion})</DropdownMenuItem>
                                        <DropdownMenuItem><RotateCw className="mr-2" /> Rotate Secrets</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive"><ShieldOff className="mr-2" /> Disable Connector</DropdownMenuItem>
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
