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
import { FileDown, FileUp, MoreHorizontal, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const kpiData = [
  { title: 'Files Processed (24h)', value: '1,250' },
  { title: 'Fares Loaded', value: '2.3M' },
  { title: 'Overrides Applied', value: '5,830' },
  { title: 'Match Rate', value: '99.92%' },
];


type FilingStatus = 'Processed' | 'Pending' | 'Failed';

const mockFilings = [
    { id: 'ATP-US-DOM-2025-10-28-01.ZIP', market: 'US Domestic', sequence: 'SEQ234', fares: 35000, status: 'Processed' as FilingStatus, timestamp: '15 mins ago' },
    { id: 'ATP-INTL-EUR-2025-10-28-02.ZIP', market: 'Europe', sequence: 'SEQ812', fares: 120500, status: 'Processed' as FilingStatus, timestamp: '45 mins ago' },
    { id: 'ATP-INTL-APAC-2025-10-28-01.ZIP', market: 'Asia-Pacific', sequence: 'SEQ561', fares: 88000, status: 'Pending' as FilingStatus, timestamp: '1 hour ago' },
    { id: 'ATP-SA-SPECIAL-2025-10-27-05.ZIP', market: 'South America', sequence: 'SEQ109', fares: 12000, status: 'Failed' as FilingStatus, timestamp: '3 hours ago' },
    { id: 'ATP-US-DOM-2025-10-27-22.ZIP', market: 'US Domestic', sequence: 'SEQ233', fares: 34800, status: 'Processed' as FilingStatus, timestamp: '5 hours ago' },
];

const getStatusBadgeVariant = (status: FilingStatus) => {
    switch (status) {
        case 'Processed': return 'default';
        case 'Pending': return 'secondary';
        case 'Failed': return 'destructive';
        default: return 'outline';
    }
}

const getStatusIcon = (status: FilingStatus) => {
    switch (status) {
        case 'Processed': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'Pending': return <Clock className="h-4 w-4 text-yellow-500" />;
        case 'Failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
}

export default function AtpcoPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    ATPCO Fare Management
                </h1>
                <p className="text-muted-foreground">
                    Ingest, map, visualize, and override ATPCO fare and rule data.
                </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><FileUp className="mr-2 h-4 w-4" /> Manual Upload</Button>
                    <Button><FileDown className="mr-2 h-4 w-4" /> Export Logs</Button>
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
                <CardHeader>
                    <CardTitle>Recent Fare Filings</CardTitle>
                    <CardDescription>
                        A log of recently processed ATPCO fare filings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Filename</TableHead>
                                <TableHead>Market</TableHead>
                                <TableHead>Fares</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockFilings.map((filing) => (
                                <TableRow key={filing.id}>
                                    <TableCell className="font-mono">{filing.id}</TableCell>
                                    <TableCell>{filing.market}</TableCell>
                                    <TableCell>{filing.fares.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(filing.status)} className="gap-1 pl-1.5">
                                            {getStatusIcon(filing.status)}
                                            {filing.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{filing.timestamp}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
