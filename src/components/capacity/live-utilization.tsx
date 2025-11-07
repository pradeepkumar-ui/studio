'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { AreaChart, Badge } from '@tremor/react';

const kpiData = [
  { title: 'Offers Created', value: '1.2M' },
  { title: 'Offers Accepted', value: '180K' },
  { title: 'Paced / Throttled', value: '45K' },
  { title: 'Stop-Sells Active', value: '3' },
];

const chartdata = [
  { date: '10:00', Created: 2890, Accepted: 450 },
  { date: '11:00', Created: 2756, Accepted: 480 },
  { date: '12:00', Created: 3322, Accepted: 510 },
  { date: '13:00', Created: 3470, Accepted: 530 },
  { date: '14:00', Created: 3475, Accepted: 550 },
  { date: '15:00', Created: 3129, Accepted: 500 },
];

const valueFormatter = (number: number) =>
  `${new Intl.NumberFormat('us').format(number).toString()}`;

export function LiveUtilization() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Utilization</CardTitle>
        <CardDescription>Real-time view of offer capacity consumption.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpiData.map((kpi) => (
            <div key={kpi.title} className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">{kpi.title}</p>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </div>
          ))}
        </div>
        <AreaChart
          className="h-72"
          data={chartdata}
          index="date"
          categories={['Created', 'Accepted']}
          colors={['blue', 'green']}
          valueFormatter={valueFormatter}
          yAxisWidth={60}
        />
      </CardContent>
    </Card>
  );
}
