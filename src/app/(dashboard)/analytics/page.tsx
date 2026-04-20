'use client';

import {
  BarChart,
  Card,
  Grid,
  Title,
  Text,
  Flex,
  Metric,
  AreaChart,
  BarList,
  DonutChart,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
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
import { Building2, Plane, Store, ShieldCheck, Activity, TrendingUp, DollarSign } from 'lucide-react';

// --- Global Ecosystem KPIs ---
const kpiData = [
  { title: 'Global Ecosystem Yield', metric: '$12.4M', progress: 12.5, target: '$11.0M', icon: DollarSign },
  { title: 'SITA Marketplace Fees', metric: '$1.86M', progress: 8.2, target: '$1.5M', icon: TrendingUp },
  { title: 'Avg. Capture Rate', metric: '18.4%', progress: 2.1, target: '15.0%', icon: Activity },
  { title: 'PSS Sync Integrity', metric: '99.98%', progress: 0.01, target: '99.95%', icon: ShieldCheck },
];

// --- Airline Performance Data ---
const airlinePerformance = [
  { name: 'Global Airways (GAB)', volume: 45200, yield: 4200000, conversion: '22.1%', sync: '100%' },
  { name: 'SkyBridge Airlines (SBA)', volume: 28900, yield: 2100000, conversion: '15.8%', sync: '99.9%' },
  { name: 'MetroLink Air (MLN)', volume: 12400, yield: 850000, conversion: '12.4%', sync: '100%' },
  { name: 'EuroConnect', volume: 38200, yield: 3100000, conversion: '19.2%', sync: '99.9%' },
];

// --- Airport Node Analytics ---
const airportPerformance = [
  { node: 'LHR - Heathrow (T5)', throughput: '125K Events', yield: '$2.1M', capture: '24.5%', status: 'High Performance' },
  { node: 'JFK - John F. Kennedy (T4)', throughput: '98K Events', yield: '$1.5M', capture: '18.2%', status: 'Optimal' },
  { node: 'SIN - Changi (T3)', throughput: '82K Events', yield: '$1.2M', capture: '21.1%', status: 'Optimal' },
  { node: 'DXB - Dubai (T3)', throughput: '110K Events', yield: '$1.8M', capture: '16.5%', status: 'Maintenance' },
];

// --- Vendor / Partner Analytics ---
const vendorPerformance = [
  { partner: 'Lounge Stars', category: 'Lounge', revenue: 850000, commission: 127500, attach: '14.2%' },
  { partner: 'SkyCafe Gourmet', category: 'F&B', revenue: 420000, commission: 50400, attach: '22.8%' },
  { partner: 'Global Duty Free', category: 'Retail', revenue: 1200000, commission: 180000, attach: '8.5%' },
  { partner: 'Changi Valet', category: 'Parking', revenue: 310000, commission: 31000, attach: '5.2%' },
];

const chartFormatter = (number: number) =>
  `$${Intl.NumberFormat('us').format(number).toString()}`;

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat('us').format(number).toString()}`;

export default function SitaRetailingAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-primary">Ecosystem Retailing Analytics</h1>
        <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">
          Comprehensive Yield, Volume & Commission Intelligence for SITA Management
        </p>
      </div>

      {/* --- PLATFORM KPIs --- */}
      <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
        {kpiData.map((item) => (
          <Card key={item.title} className="p-6">
            <Flex alignItems="start">
              <div className="space-y-1">
                <Text className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">{item.title}</Text>
                <Metric className="text-2xl font-black text-primary">{item.metric}</Metric>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] font-bold">
                +{item.progress}%
              </Badge>
            </Flex>
            <div className="mt-4 flex items-center gap-2">
                <item.icon className="h-3 w-3 text-muted-foreground" />
                <Text className="text-[10px] text-muted-foreground font-medium">Target: {item.target}</Text>
            </div>
          </Card>
        ))}
      </Grid>

      <TabGroup className="mt-6">
        <TabList variant="line">
          <Tab icon={Plane}>Carrier Distribution</Tab>
          <Tab icon={Building2}>Airport Node Insights</Tab>
          <Tab icon={Store}>Vendor & Partner Yield</Tab>
        </TabList>
        <TabPanels>
          {/* --- AIRLINE ANALYTICS --- */}
          <TabPanel>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              <Card className="lg:col-span-8">
                <Title>Carrier Performance Matrix</Title>
                <Text>Yield and conversion efficiency across participating airlines.</Text>
                <Table className="mt-6">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Airline Partner</TableHead>
                      <TableHead className="text-right">Total Yield</TableHead>
                      <TableHead className="text-right">Order Volume</TableHead>
                      <TableHead className="text-right">Conversion</TableHead>
                      <TableHead className="text-right">PSS Sync</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {airlinePerformance.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-bold text-primary">{item.name}</TableCell>
                        <TableCell className="text-right font-mono font-black">{chartFormatter(item.yield)}</TableCell>
                        <TableCell className="text-right">{valueFormatter(item.volume)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{item.conversion}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-emerald-600 font-bold">{item.sync}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              <Card className="lg:col-span-4">
                <Title>Yield Share by Carrier</Title>
                <DonutChart
                  className="h-64 mt-6"
                  data={airlinePerformance}
                  category="yield"
                  index="name"
                  valueFormatter={chartFormatter}
                  colors={['blue', 'cyan', 'indigo', 'violet']}
                />
              </Card>
            </div>
          </TabPanel>

          {/* --- AIRPORT ANALYTICS --- */}
          <TabPanel>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
               <Card className="lg:col-span-4">
                <Title>Volume by Airport Node</Title>
                <BarList
                  data={airportPerformance.map(a => ({ name: a.node, value: parseInt(a.throughput.replace(/[^0-9]/g, '')) }))}
                  className="mt-6"
                  color="blue"
                />
              </Card>
              <Card className="lg:col-span-8">
                <Title>Node Operational Intelligence</Title>
                <Text>Real-time capture rates and throughput signals per terminal node.</Text>
                <Table className="mt-6">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Airport Hub & Terminal</TableHead>
                      <TableHead className="text-right">Yield</TableHead>
                      <TableHead className="text-right">Capture Rate</TableHead>
                      <TableHead>Health Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {airportPerformance.map((item) => (
                      <TableRow key={item.node}>
                        <TableCell className="font-bold">{item.node}</TableCell>
                        <TableCell className="text-right font-mono">{item.yield}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                <span className="font-bold">{item.capture}</span>
                                <div className="w-12 bg-muted rounded-full h-1">
                                    <div className="bg-primary h-1 rounded-full" style={{ width: item.capture }} />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'High Performance' ? 'default' : (item.status === 'Optimal' ? 'secondary' : 'outline')}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabPanel>

          {/* --- VENDOR ANALYTICS --- */}
          <TabPanel>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              <Card className="lg:col-span-12">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <Title>Partner Ecosystem Yield</Title>
                        <Text>Tracking vendor revenue and SITA marketplace commission attribution.</Text>
                    </div>
                    <div className="text-right">
                        <Text className="text-[10px] font-black uppercase text-muted-foreground">Total Commission</Text>
                        <Metric className="text-2xl font-black text-emerald-600">$388.9K</Metric>
                    </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Authorized Vendor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Total Revenue</TableHead>
                      <TableHead className="text-right">Marketplace Fee (SITA)</TableHead>
                      <TableHead className="text-right">Attach Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorPerformance.map((item) => (
                      <TableRow key={item.partner}>
                        <TableCell className="font-bold">
                            <div className="flex items-center gap-2">
                                <Store className="h-4 w-4 text-muted-foreground" />
                                {item.partner}
                            </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] uppercase">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">{chartFormatter(item.revenue)}</TableCell>
                        <TableCell className="text-right font-black text-emerald-600 font-mono">{chartFormatter(item.commission)}</TableCell>
                        <TableCell className="text-right font-bold text-primary">{item.attach}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
