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
import { MoreHorizontal, RadioTower, CheckCircle, AlertTriangle, XCircle, FileJson, RotateCw, ShieldOff, PlusCircle, Clock } from 'lucide-react';

const kpiData = [
  { title: 'Active Endpoints', value: '13' },
  { title: 'Partners', value: '45' },
  { title: 'Jobs (24h)', value: '118' },
  { title: 'Failed Jobs (24h)', value: '2' },
];

const connectors = [
  { id: 'erp_sync', name: 'ERP Journal Sync (SAP)', status: 'OPERATIONAL', latency: '820ms', errorRate: '0.1%' },
  { id: 'pg_recon', name: 'Payment Gateway Reconciliation (Stripe)', status: 'OPERATIONAL', latency: '450ms', errorRate: '0.05%' },
  { id: 'tax_api', name: 'Tax & Regulatory API', status: 'DEGRADED', latency: '1.6s', errorRate: '3.4%' },
  { id: 'bsp_file_exchange', name: 'BSP/ARC File Exchange (SFTP)', status: 'OPERATIONAL', latency: 'N/A', errorRate: '0.0%' },
  { id: 'bi_export', name: 'BI Data Warehouse Sync', status: 'DOWN', latency: 'N/A', errorRate: '100%' },
  { id: 'loyalty_engine', name: 'Loyalty Engine Sync', status: 'OPERATIONAL', latency: '320ms', errorRate: '0.2%' },
  { id: 'gds_push', name: 'GDS PNR Push (Sabre)', status: 'OPERATIONAL', latency: '980ms', errorRate: '0.5%' },
  { id: 'dcs_sync', name: 'DCS Check-in Sync', status: 'DEGRADED', latency: '2.1s', errorRate: '4.1%' },
  { id: 'corp_portal', name: 'Corporate Portal API', status: 'OPERATIONAL', latency: '150ms', errorRate: '0.01%' },
  { id: 'ota_feed', name: 'OTA Availability Feed', status: 'OPERATIONAL', latency: 'N/A', errorRate: '0.0%' },
];

const recentJobs = [
    { id: 'JOB-001', name: 'ERP Journal Sync', status: 'Success', timestamp: '2 mins ago' },
    { id: 'JOB-002', name: 'Payment Gateway Reconciliation', status: 'Success', timestamp: '5 mins ago' },
    { id: 'JOB-003', name: 'BI Data Warehouse Sync', status: 'Failed', timestamp: '12 mins ago' },
    { id: 'JOB-004', name: 'BSP File Upload', status: 'Success', timestamp: '25 mins ago' },
    { id: 'JOB-005', name: 'ERP Journal Sync', status: 'Success', timestamp: '1 hour ago' },
    { id: 'JOB-006', name: 'GDS PNR Push', status: 'Success', timestamp: '1 hour ago' },
    { id: 'JOB-007', name: 'DCS Check-in Sync', status: 'Failed', timestamp: '2 hours ago' },
    { id: 'JOB-008', name: 'Loyalty Engine Sync', status: 'Success', timestamp: '2 hours ago' },
    { id: 'JOB-009', name: 'Tax & Regulatory API', status: 'Success', timestamp: '3 hours ago' },
    { id: 'JOB-010', name: 'BI Data Warehouse Sync', status: 'Success', timestamp: '4 hours ago' },
];


const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'OPERATIONAL':
    case 'Success':
      return 'default';
    case 'DEGRADED':
      return 'secondary';
    case 'DOWN':
    case 'Failed':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
      case 'Success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'DEGRADED':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'DOWN':
      case 'Failed':
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
                Accounting Integration Console
            </h1>
            <p className="text-muted-foreground">
                Manage system endpoints, data mappings, and monitor financial data exchange.
            </p>
        </div>
        <Button>
            <PlusCircle className="mr-2" /> Add Endpoint
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
            <CardTitle>Integration Endpoints</CardTitle>
            <CardDescription>Live status of all integrated financial system endpoints.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>p95 Latency</TableHead>
                        <TableHead>Error Rate</TableHead>
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
                                        <DropdownMenuItem><FileJson className="mr-2 h-4 w-4" /> View Mappings</DropdownMenuItem>
                                        <DropdownMenuItem><RotateCw className="mr-2 h-4 w-4" /> Rotate Secrets</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive"><ShieldOff className="mr-2 h-4 w-4" /> Disable Endpoint</DropdownMenuItem>
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
            <CardTitle>Recent Integration Jobs</CardTitle>
            <CardDescription>Monitor the status of financial data synchronization tasks.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentJobs.map((job) => (
                        <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.name}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(job.status)} className="gap-1 pl-1.5">
                                    {getStatusIcon(job.status)}
                                    {job.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    {job.timestamp}
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
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>View Audit Log</DropdownMenuItem>
                                        {job.status === 'Failed' && <DropdownMenuItem><RotateCw className="mr-2 h-4 w-4"/>Retry Job</DropdownMenuItem>}
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
