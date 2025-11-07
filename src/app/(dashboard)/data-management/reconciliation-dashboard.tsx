
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
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const reconData = [
  { system: 'Offer Store <> Order Manager', status: 'OK', mismatches: 0, lastRun: '2 mins ago' },
  { system: 'Offer Store <> Analytics DB', status: 'OK', mismatches: 0, lastRun: '2 mins ago' },
  { system: 'Offer Store <> Retailing Cache', status: 'Mismatch', mismatches: 3, lastRun: '5 mins ago' },
  { system: 'Offer Store <> Compliance Log', status: 'OK', mismatches: 0, lastRun: '1 min ago' },
  { system: 'Order Manager <> Finance Ledger', status: 'Error', mismatches: 'N/A', lastRun: '1 hour ago' },
  { system: 'Order Manager <> DCS', status: 'OK', mismatches: 0, lastRun: '3 mins ago' },
  { system: 'Order Manager <> Loyalty Engine', status: 'Mismatch', mismatches: 1, lastRun: '15 mins ago' },
  { system: 'Retailing Cache <> Search Index', status: 'OK', mismatches: 0, lastRun: '4 mins ago' },
  { system: 'Finance Ledger <> SAP', status: 'OK', mismatches: 0, lastRun: '30 mins ago' },
  { system: 'Analytics DB <> BI Warehouse', status: 'Mismatch', mismatches: 12, lastRun: '2 hours ago' },
];

const getStatusIcon = (status: string) => {
    switch(status) {
        case 'OK': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        case 'Mismatch': return <AlertCircle className="h-5 w-5 text-orange-500" />;
        case 'Error': return <XCircle className="h-5 w-5 text-red-500" />;
        default: return null;
    }
}


export function ReconciliationDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reconciliation Dashboard</CardTitle>
        <CardDescription>
          Compare Offer Store data against downstream systems to identify mismatches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>System Pair</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mismatches</TableHead>
                    <TableHead>Last Run</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reconData.map(item => (
                    <TableRow key={item.system}>
                        <TableCell className="font-medium">{item.system}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(item.status)}
                                <span>{item.status}</span>
                            </div>
                        </TableCell>
                        <TableCell>{item.mismatches}</TableCell>
                        <TableCell>{item.lastRun}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
