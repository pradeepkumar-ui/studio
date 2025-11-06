
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { AreaChart } from '@tremor/react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const chartdata = [
  { date: 'Oct 01', 'Conversion Rate': 15.1, 'Attach Rate': 28.4 },
  { date: 'Oct 02', 'Conversion Rate': 15.3, 'Attach Rate': 28.9 },
  { date: 'Oct 03', 'Conversion Rate': 15.2, 'Attach Rate': 29.1 },
  { date: 'Oct 04', 'Conversion Rate': 15.5, 'Attach Rate': 29.5 },
  { date: 'Oct 05', 'Conversion Rate': 15.6, 'Attach Rate': 29.3 },
  { date: 'Oct 06', 'Conversion Rate': 15.4, 'Attach Rate': 29.8 },
  { date: 'Oct 07', 'Conversion Rate': 15.7, 'Attach Rate': 30.1 },
];

const topDeltas = [
    { strategy: 'Micro-adjust', scope: 'IN/Direct/Flex Weekend', delta: '-1.2% Price', impact: '+1.8% Conversion' },
    { strategy: 'Re-rank', scope: 'LHR-JFK Business', delta: 'Prioritise duration', impact: '+0.9% Conversion' },
    { strategy: 'TTL Extension', scope: 'TMC/AE', delta: 'TTL 60m -> 90m', impact: '-3.1% Expiry' },
    { strategy: 'Ancillary Bundle', scope: 'Family Cohort', delta: 'Seat+Bag Bundle', impact: '+4.5% Attach' },
]

const percentFormatter = (number: number) => `${number}%`;

export function OptimisationDashboard() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Core KPI Trends (Last 7 Days)</CardTitle>
          <CardDescription>
            Monitor the impact of optimisations on key performance indicators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AreaChart
            className="h-72"
            data={chartdata}
            index="date"
            categories={['Conversion Rate', 'Attach Rate']}
            colors={['blue', 'cyan']}
            valueFormatter={percentFormatter}
          />
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Active Optimisations</CardTitle>
            <CardDescription>The most impactful optimisations currently running.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
               <TableHeader>
                <TableRow>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Delta</TableHead>
                  <TableHead>Est. Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topDeltas.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                        <div>{item.strategy}</div>
                        <div className="text-xs text-muted-foreground">{item.scope}</div>
                    </TableCell>
                     <TableCell>
                        <Badge variant={item.delta.startsWith('-') ? 'destructive' : 'default'} className="whitespace-nowrap">
                            {item.delta}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant="secondary" className="whitespace-nowrap">{item.impact}</Badge>
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
