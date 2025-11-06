'use client';

import { BarChart, Bold, Italic, Underline } from 'lucide-react';
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
import { AreaChart } from '@tremor/react';

const chartdata = [
  { date: 'Jan 22', Pass: 2890, Warn: 45, Block: 88 },
  { date: 'Feb 22', Pass: 2756, Warn: 56, Block: 92 },
  { date: 'Mar 22', Pass: 3322, Warn: 32, Block: 78 },
  { date: 'Apr 22', Pass: 3470, Warn: 65, Block: 102 },
  { date: 'May 22', Pass: 3475, Warn: 72, Block: 110 },
  { date: 'Jun 22', Pass: 3129, Warn: 51, Block: 95 },
];

const gateStats = [
  { gate: 'PRE-Construction', pass: 99.8, warn: 0.1, block: 0.1 },
  { gate: 'PRE-Expose (Retail)', pass: 98.2, warn: 1.1, block: 0.7 },
  { gate: 'PRE-Convert (Cart)', pass: 96.7, warn: 2.1, block: 1.2 },
  { gate: 'POST-Convert', pass: 99.9, warn: 0.0, block: 0.1 },
];

const topFailingRules = [
    { code: 'PARITY_FLOOR_BREACH', count: 432, severity: 'Block' },
    { code: 'DISCLOSURE_MISSING', count: 312, severity: 'Warn' },
    { code: 'ANC_PROHIBITED', count: 189, severity: 'Block' },
    { code: 'CORP_ENTITLEMENT_MISMATCH', count: 98, severity: 'Warn' },
];

const valueFormatter = (number: number) =>
  `${new Intl.NumberFormat('us').format(number).toString()}`;

export function GateMonitor() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Gate Throughput (Last 30 days)</CardTitle>
          <CardDescription>
            Volume of compliance checks passing, warning, or blocking at all gates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AreaChart
            className="h-72"
            data={chartdata}
            index="date"
            categories={['Pass', 'Warn', 'Block']}
            colors={['emerald', 'amber', 'rose']}
            valueFormatter={valueFormatter}
          />
        </CardContent>
      </Card>
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gate Pass/Block Rates</CardTitle>
            <CardDescription>Live statistics for each compliance gate.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gate</TableHead>
                  <TableHead className="text-center">Pass</TableHead>
                  <TableHead className="text-center">Warn</TableHead>
                  <TableHead className="text-center">Block</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gateStats.map((stat) => (
                  <TableRow key={stat.gate}>
                    <TableCell className="font-medium">{stat.gate}</TableCell>
                    <TableCell className="text-center text-green-600">{stat.pass}%</TableCell>
                    <TableCell className="text-center text-amber-600">{stat.warn}%</TableCell>
                    <TableCell className="text-center text-red-600">{stat.block}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Top Failing Rules (24h)</CardTitle>
            <CardDescription>The most frequently triggered compliance rules.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
               <TableHeader>
                <TableRow>
                  <TableHead>Rule</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topFailingRules.map((rule) => (
                  <TableRow key={rule.code}>
                    <TableCell className="font-mono text-xs">{rule.code}</TableCell>
                     <TableCell>
                        <Badge variant={rule.severity === 'Block' ? 'destructive' : 'secondary'}>
                            {rule.severity}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">{rule.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
