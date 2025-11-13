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
import { Grid, BarChart, AreaChart, Text } from '@tremor/react';
import { KpiCard } from '@/components/analytics/kpi-card';

const kpiData = [
  {
    title: 'Active Offers',
    metric: '482',
    progress: 2.1,
    target: '450',
    deltaType: 'moderateIncrease',
  },
  {
    title: 'Offers Created (24h)',
    metric: '12,553',
    progress: 15.9,
    target: '10,000',
    deltaType: 'moderateIncrease',
  },
  {
    title: 'Offer Conversion Rate',
    metric: '15.1%',
    progress: 5.2,
    target: '12%',
    deltaType: 'moderateIncrease',
  },
  {
    title: 'Revenue from Offers',
    metric: '$1.2M',
    progress: 8.2,
    target: '$1.1M',
    deltaType: 'moderateIncrease',
  },
];

const funnelData = [
  { name: 'Created', value: 124553 },
  { name: 'Selected (Locked)', value: 83219 },
  { name: 'Validated', value: 79004 },
  { name: 'Converted', value: 18771 },
  { name: 'Expired', value: 31992 },
];

const chartdata = [
  { date: 'Oct 01', Created: 12000, Converted: 1800 },
  { date: 'Oct 02', Created: 11500, Converted: 1750 },
  { date: 'Oct 03', Created: 13100, Converted: 1980 },
  { date: 'Oct 04', Created: 14500, Converted: 2200 },
  { date: 'Oct 05', Created: 14900, Converted: 2300 },
  { date: 'Oct 06', Created: 13800, Converted: 2100 },
  { date: 'Oct 07', Created: 15200, Converted: 2400 },
];

const topOffers = [
    { name: 'Winter Flash Sale', scope: 'Market', conversion: '22.5%', revenue: '$250K' },
    { name: 'Last Minute Deals', scope: 'Market', conversion: '18.2%', revenue: '$180K' },
    { name: 'New Route Launch: NYC-TKY', scope: 'Market', conversion: '16.8%', revenue: '$150K' },
    { name: 'Business Class Upgrade', scope: 'Brand', conversion: '14.1%', revenue: '$450K' },
    { name: 'Corporate Traveler Discount', scope: 'Channel', conversion: '12.5%', revenue: '$320K' },
];


const chartFormatter = (number: number) =>
  `${Intl.NumberFormat('us').format(number).toString()}`;

export default function OffersDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Offers Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time statistics and performance metrics for all offers.
        </p>
      </div>

      <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
        {kpiData.map((item) => (
          <KpiCard key={item.title} item={item} />
        ))}
      </Grid>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Creation vs. Conversion (Last 7 Days)</CardTitle>
            <CardDescription>
                Volume of offers created and converted over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <AreaChart
                className="h-72"
                data={chartdata}
                index="date"
                categories={['Created', 'Converted']}
                colors={['blue', 'green']}
                valueFormatter={chartFormatter}
                yAxisWidth={60}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Offer Funnel (Last 30 days)</CardTitle>
            <CardDescription>Offers moving through lifecycle stages</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              className="mt-6"
              data={funnelData}
              index="name"
              categories={['value']}
              colors={['blue']}
              valueFormatter={chartFormatter}
              yAxisWidth={80}
              layout="vertical"
              showLegend={false}
            />
          </CardContent>
        </Card>
      </div>
      
       <Card>
          <CardHeader>
            <CardTitle>Top Performing Offers</CardTitle>
            <CardDescription>
              Offers with the highest conversion rates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer Name</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                  <TableHead>Generated Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topOffers.map((offer) => (
                  <TableRow key={offer.name}>
                    <TableCell className="font-medium">{offer.name}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{offer.scope}</Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant="default">{offer.conversion}</Badge>
                    </TableCell>
                    <TableCell>{offer.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

    </div>
  );
}