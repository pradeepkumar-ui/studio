'use client';

import {
  BarChart,
  BarList,
  Card,
  Grid,
  Title,
  Text,
  Flex,
  Metric,
  AreaChart,
} from '@tremor/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { KpiCard } from '@/components/analytics/kpi-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const funnelData = [
  { name: 'Created', value: 124553 },
  { name: 'Selected (Locked)', value: 83219 },
  { name: 'Validated', value: 79004 },
  { name: 'Converted', value: 18771 },
  { name: 'Expired', value: 31992 },
];

const conversionByChannel = [
  { name: 'Direct', 'Conversion %': 18.2, 'Converted Offers': 10234 },
  { name: 'TMC', 'Conversion %': 14.5, 'Converted Offers': 5678 },
  { name: 'OTA', 'Conversion %': 11.8, 'Converted Offers': 2859 },
];

const channelPerformance = [
  { channel: 'Direct', created: 85234, conversion: '18.2%', expired: '22.1%', avgPrice: '$452' },
  { channel: 'TMC', created: 28912, conversion: '14.5%', expired: '31.5%', avgPrice: '$891' },
  { channel: 'OTA', created: 10407, conversion: '11.8%', expired: '35.2%', avgPrice: '$388' },
];

const ancillaryAttach = [
  { name: '1st Checked Bag', value: 453, share: '35%' },
  { name: 'Extra Legroom Seat', value: 289, share: '22%' },
  { name: 'Lounge Access', value: 182, share: '14%' },
  { name: 'In-flight Wi-Fi', value: 156, share: '12%' },
  { name: 'Priority Boarding', value: 121, share: '9%' },
  { name: 'Others', value: 97, share: '8%' },
];

const kpiData = [
    { title: 'Offers Created', metric: '124,553', progress: 15.9, target: '80,000', deltaType: 'moderateIncrease' },
    { title: 'Conversion Rate', metric: '15.1%', progress: 5.2, target: '12%', deltaType: 'moderateIncrease' },
    { title: 'Ancillary Revenue', metric: '$840K', progress: 12.1, target: '$750K', deltaType: 'moderateIncrease' },
    { title: 'Avg. Time to Convert', metric: '8m 42s', progress: -8.9, target: '10m', deltaType: 'moderateIncrease' },
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

const percentFormatter = (number: number) => `${number}%`;

export default function UnifiedRetailingAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
       <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Retailing Analytics
        </h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of the Offer lifecycle, conversion trends, and ancillary performance.
        </p>
      </div>
      
      <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
        {kpiData.map(item => <KpiCard key={item.title} item={item as any} />)}
      </Grid>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Retailing Overview</TabsTrigger>
          <TabsTrigger value="channels">Channels & POS</TabsTrigger>
          <TabsTrigger value="ancillaries">Ancillary Yield</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <Title>Creation vs. Conversion (Last 7 Days)</Title>
                    <Text>Volume of offers created and converted over time.</Text>
                    <AreaChart
                        className="h-72 mt-6"
                        data={chartdata}
                        index="date"
                        categories={['Created', 'Converted']}
                        colors={['blue', 'green']}
                        valueFormatter={chartFormatter}
                        yAxisWidth={60}
                    />
                </Card>
                <Card className="lg:col-span-2">
                    <Title>Offer Funnel (Last 30 days)</Title>
                    <Text>Offers moving through lifecycle stages</Text>
                    <BarChart
                        className="mt-6"
                        data={funnelData}
                        index="name"
                        categories={['value']}
                        colors={['blue']}
                        valueFormatter={chartFormatter}
                        yAxisWidth={48}
                        layout="vertical"
                        showLegend={false}
                    />
                </Card>
            </div>

            <Card>
                <Title>Top Performing Offers</Title>
                <Text>Offers with the highest conversion rates and revenue generation.</Text>
                <div className="rounded-md border mt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Offer Name</TableHead>
                            <TableHead>Scope</TableHead>
                            <TableHead>Conversion Rate</TableHead>
                            <TableHead className="text-right">Generated Revenue</TableHead>
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
                                <TableCell className="text-right font-semibold">{offer.revenue}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                <Title>Channel & POS Performance</Title>
                <Text>Comparing Offer KPIs by Channel and Point of Sale</Text>
                <div className="rounded-md border mt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Channel</TableHead>
                                <TableHead>Offers Created</TableHead>
                                <TableHead>Conversion Rate</TableHead>
                                <TableHead>Expiry Rate</TableHead>
                                <TableHead>Avg. Offer Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {channelPerformance.map(item => (
                                <TableRow key={item.channel}>
                                    <TableCell>{item.channel}</TableCell>
                                    <TableCell>{item.created.toLocaleString()}</TableCell>
                                    <TableCell><Badge variant="default">{item.conversion}</Badge></TableCell>
                                    <TableCell><Badge variant="secondary">{item.expired}</Badge></TableCell>
                                    <TableCell>{item.avgPrice}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                </Card>
                <Card>
                    <Title>Conversion Rate by Channel</Title>
                    <Text>Comparing channel effectiveness</Text>
                    <AreaChart
                        className="mt-6 h-60"
                        data={conversionByChannel}
                        index="name"
                        categories={['Conversion %']}
                        colors={['blue']}
                        valueFormatter={percentFormatter}
                        yAxisWidth={40}
                    />
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="ancillaries" className="space-y-6">
            <Card>
                <Title>Ancillary Attach & Yield</Title>
                <Text>Revenue and attach rate by ancillary type</Text>
                <Flex className="mt-6">
                    <Text>Ancillary</Text>
                    <Text className="text-right">Share</Text>
                </Flex>
                <BarList data={ancillaryAttach} className="mt-2" />
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
