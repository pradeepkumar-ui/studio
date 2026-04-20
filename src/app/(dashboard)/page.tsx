
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Grid,
  BarChart,
  AreaChart,
  LineChart,
  Title,
  Text,
  Metric,
  Flex,
  ProgressBar,
  BarList,
  Tracker,
  type Color,
} from '@tremor/react';
import { 
  Activity, 
  Clock, 
  Zap, 
  AlertCircle, 
  ShieldCheck, 
  ArrowUpRight,
  MonitorDot,
  Server,
  Network,
  Search
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// --- DATA FORMATTERS ---
const valueFormatter = (number: number) =>
  `${Intl.NumberFormat('us').format(number).toString()}`;

const currencyFormatter = (number: number) =>
  `₹${Intl.NumberFormat('en-IN').format(number).toString()}`;

// --- MOCK DATA BASED ON IMAGE ---

const platformKpis = [
  { title: '% System Uptime', value: '99.99%', trend: '+0.01%', data: [10, 15, 8, 12, 11, 20, 14, 18, 15, 22] },
  { title: 'Avg. Latency', value: '1.8 sec', trend: '-200ms', data: [20, 18, 15, 14, 16, 12, 10, 11, 9, 8] },
  { title: 'Event Processing Volume', value: '1.25M', trend: '+12%', data: [5, 8, 12, 15, 14, 18, 22, 25, 28, 30] },
  { title: 'Processing Throughput', value: '0.9%', trend: 'Stable', data: [10, 12, 11, 10, 11, 12, 11, 10, 11, 10] },
  { title: 'Error Rate', value: '0.9%', trend: '-0.1%', data: [5, 4, 6, 3, 2, 3, 2, 1, 2, 1] },
];

const trafficSources = [
  { name: 'PNR Triggers', value: 420000 },
  { name: 'Manual Login', value: 220000 },
  { name: 'CUSS Check-ins', value: 120000 },
];

const latencyDistribution = [
  { name: '< 1s', value: 60, color: 'emerald' },
  { name: '1-2s', value: 22, color: 'blue' },
  { name: '2-3s', value: 10, color: 'yellow' },
  { name: '> 3s', value: 8, color: 'rose' },
];

const eventTimelineData = [
  { time: '0', 'Traffic Pulse': 150, 'Payment Initiated': 100, 'Order Created': 80 },
  { time: '5', 'Traffic Pulse': 180, 'Payment Initiated': 120, 'Order Created': 90 },
  { time: '10', 'Traffic Pulse': 140, 'Payment Initiated': 110, 'Order Created': 85 },
  { time: '15', 'Traffic Pulse': 210, 'Payment Initiated': 160, 'Order Created': 130 },
  { time: '20', 'Traffic Pulse': 250, 'Payment Initiated': 190, 'Order Created': 150 },
  { time: '25', 'Traffic Pulse': 230, 'Payment Initiated': 180, 'Order Created': 140 },
  { time: '30', 'Traffic Pulse': 257, 'Payment Initiated': 200, 'Order Created': 160 },
];

const apiPerformance = [
  { type: 'Airline PSS', current: '502 ms', avg: '480 ms', status: 'Operational' },
  { type: 'Airport Node', current: '668 ms', avg: '650 ms', status: 'Operational' },
  { type: 'Partner API', current: '883 ms', avg: '893 ms', status: 'Degraded' },
];

const errorBreakdown = [
  { issue: 'Partner API 503 Error', impact: '3,083ms' },
  { issue: 'Payment Timeout Error', impact: '2,438ms' },
  { issue: 'Inventory Check Failure', impact: '1,430ms' },
  { issue: 'Notification API Timeout', impact: '950ms' },
];

const recentActivity = [
  { date: '24 Apr', route: 'ORD37516', pnr: 'ORD37516', passenger: 'Rahul Sharma', price: 4000, conversion: 'Seat + Bag', rate: '12%' },
  { date: '24 Apr', route: 'MAA-DEL', pnr: 'ORD28745', passenger: 'Priya Kumar', price: 2900, conversion: 'Upgrade', rate: '109%' },
  { date: '24 Apr', route: 'BOM-SIN', pnr: 'ORD12998', passenger: 'Amit Patel', price: 8500, conversion: 'Full Bundle', rate: '85%' },
];

export default function SitaPlatformDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-primary flex items-center gap-3">
            <span className="bg-primary text-white px-2 py-0.5 rounded">SITA</span>
            Platform Dashboard
          </h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">
            Ecosystem Orchestration & Retailing Intelligence
          </p>
        </div>
        <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-white/50 text-xs py-1.5 px-4 rounded-lg font-bold border-muted-foreground/20">
                APRIL 1 – APRIL 30, 2025
            </Badge>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search logs..." className="pl-9 w-[200px] h-9 bg-white/50" />
            </div>
        </div>
      </div>

      {/* --- ROW 1: PRIMARY INFRASTRUCTURE KPIs --- */}
      <Grid numItemsSm={2} numItemsLg={5} className="gap-4">
        {platformKpis.map((kpi) => (
          <Card key={kpi.title} className="p-4 shadow-sm border-none bg-white">
            <Text className="text-[10px] font-black uppercase text-muted-foreground tracking-wider mb-1">
              {kpi.title}
            </Text>
            <div className="flex items-baseline justify-between mb-2">
              <Metric className="text-2xl font-black text-primary">{kpi.value}</Metric>
              <BadgeDelta deltaType={kpi.trend.startsWith('+') ? 'moderateIncrease' : 'moderateDecrease'} className="text-[10px]">
                  {kpi.trend}
              </BadgeDelta>
            </div>
            <AreaChart
              className="h-10 -mx-4"
              data={kpi.data.map((val, i) => ({ time: i, val }))}
              index="time"
              categories={['val']}
              colors={[kpi.title.includes('Error') ? 'rose' : 'blue']}
              showXAxis={false}
              showYAxis={false}
              showLegend={false}
              showGridLines={false}
              startEndOnly={true}
            />
          </Card>
        ))}
      </Grid>

      {/* --- ROW 2: TRAFFIC, TIMELINE, LATENCY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Traffic Sources */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Network className="h-4 w-4 text-primary" /> Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarList 
                data={trafficSources} 
                className="mt-2" 
                valueFormatter={valueFormatter}
                color="blue"
            />
            <div className="mt-8 pt-4 border-t">
                <Text className="text-[10px] uppercase font-black text-muted-foreground">Local Node Time</Text>
                <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-primary" />
                    <span className="text-xs font-bold">Apr 1, 2025 14:02 UTC</span>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Timeline */}
        <Card className="lg:col-span-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
                <CardTitle className="text-sm font-bold">Event Timeline & Volume</CardTitle>
                <CardDescription className="text-[10px] font-medium">Offers Sent vs. Conversions</CardDescription>
            </div>
            <div className="text-right">
                <Text className="text-[10px] font-black uppercase text-muted-foreground">Offers Sent</Text>
                <Metric className="text-xl font-black text-primary">3000K</Metric>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart
              className="h-48 mt-4"
              data={eventTimelineData}
              index="time"
              categories={['Traffic Pulse', 'Payment Initiated', 'Order Created']}
              colors={['blue', 'emerald', 'indigo']}
              valueFormatter={valueFormatter}
              showYAxis={false}
              showGridLines={false}
            />
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-bold text-muted-foreground">Traffic Pulse</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-muted-foreground">Payment Initiated</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-bold text-muted-foreground">Order Created</span>
                 </div>
            </div>
          </CardContent>
        </Card>

        {/* Latency Distribution */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Latency Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {latencyDistribution.map(item => (
                <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black">
                        <span>{item.name}</span>
                        <span>{item.value}%</span>
                    </div>
                    <ProgressBar value={item.value} color={item.color as any} className="h-1.5" />
                </div>
            ))}
            <div className="mt-6 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Unique PNRs</span>
                    <span className="font-black text-primary">₹ 88,900</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Sync Events</span>
                    <span className="font-black text-emerald-600">1,666</span>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- ROW 3: COMPLIANCE, API, ERRORS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SLA Compliance */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">SLA Compliance & Volume</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="relative">
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-black text-primary">88%</span>
                    <span className="text-[10px] font-black uppercase text-muted-foreground">Meet SLA</span>
                 </div>
                 <DonutChart
                    className="h-44 w-44"
                    data={[
                        { name: 'Compliant', value: 88 },
                        { name: 'Breached', value: 12 },
                    ]}
                    category="value"
                    index="name"
                    colors={['blue', 'slate']}
                    showLabel={false}
                    variant="donut"
                 />
              </div>
              <div className="w-full mt-6 space-y-2">
                 <div className="flex justify-between text-[10px] font-bold">
                    <span>Performance Target</span>
                    <span>88% achieved</span>
                 </div>
                 <ProgressBar value={88} color="blue" className="h-2" />
              </div>
          </CardContent>
        </Card>

        {/* API Performance */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-bold">API Performance</CardTitle>
            <Badge variant="outline" className="text-[10px] font-black">15 ACTIVE APIS</Badge>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow className="border-none">
                        <TableHead className="h-8 text-[9px] uppercase font-black">Service Node</TableHead>
                        <TableHead className="h-8 text-[9px] uppercase font-black text-center">Current</TableHead>
                        <TableHead className="h-8 text-[9px] uppercase font-black text-right">Avg SLA</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {apiPerformance.map((api) => (
                        <TableRow key={api.type} className="border-b last:border-none border-muted/50">
                            <TableCell className="py-3 text-xs font-bold">{api.type}</TableCell>
                            <TableCell className="py-3 text-xs font-black text-primary text-center">{api.current}</TableCell>
                            <TableCell className="py-3 text-xs font-medium text-muted-foreground text-right">{api.avg}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
             <div className="mt-4 p-3 bg-secondary rounded-lg">
                <Text className="text-[10px] font-black uppercase text-muted-foreground mb-2">Internal PSS Broker Lag</Text>
                <Tracker data={Array(20).fill({ color: 'emerald', tooltip: 'Healthy' })} className="h-4" />
             </div>
          </CardContent>
        </Card>

        {/* Error Breakdown */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Error Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-3">
                {errorBreakdown.map(error => (
                    <div key={error.issue} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors cursor-default">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                            <span className="text-xs font-medium">{error.issue}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-muted-foreground">{error.impact}</span>
                    </div>
                ))}
             </div>
             <div className="mt-8 pt-4 border-t flex justify-between items-center">
                <span className="text-lg font-black text-primary">₹ 8,900</span>
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Total Latency Impact</span>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* --- ROW 4: RECENT EVENTS / SYSTEM UPTIME TABLE --- */}
      <Card className="shadow-sm border-none overflow-hidden">
        <CardHeader className="bg-primary/5 py-4 border-b flex flex-row justify-between items-center">
            <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-primary" />
                <div>
                    <CardTitle className="text-md font-black">System Uptime Pulse</CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">Live Transaction Trace</CardDescription>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-primary">99.99%</span>
                <div className="flex gap-1 h-6 items-end">
                    {[3, 5, 4, 8, 7, 9, 6, 8].map((h, i) => (
                        <div key={i} className="w-1 bg-emerald-500 rounded-t" style={{ height: `${h * 10}%` }} />
                    ))}
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-[10px] uppercase font-black">Date</TableHead>
                <TableHead className="text-[10px] uppercase font-black">Route / ID</TableHead>
                <TableHead className="text-[10px] uppercase font-black">Master PNR</TableHead>
                <TableHead className="text-[10px] uppercase font-black">Passenger Context</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-right">Price</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-right">Retailing Conversion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((row, i) => (
                <TableRow key={i} className="hover:bg-muted/20">
                  <TableCell className="text-xs font-bold text-muted-foreground">{row.date}</TableCell>
                  <TableCell className="text-xs font-mono font-black">{row.route}</TableCell>
                  <TableCell className="text-xs font-mono text-primary font-bold">{row.pnr}</TableCell>
                  <TableCell className="text-xs font-semibold">{row.passenger}</TableCell>
                  <TableCell className="text-right text-xs font-black">{currencyFormatter(row.price)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] font-bold">
                            = {row.conversion}
                        </Badge>
                        <span className="text-[10px] font-black text-emerald-600">{row.rate}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* --- FOOTER BANNER --- */}
      <div className="bg-primary py-3 px-6 rounded-xl flex justify-between items-center shadow-lg shadow-primary/20">
         <span className="text-white font-black uppercase tracking-[0.3em] text-xs">
            SITA Platform Dashboard
         </span>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80 text-[10px] font-bold">Global Link Active</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80 text-[10px] font-bold">PSS Broker Synced</span>
            </div>
         </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function BadgeDelta({ deltaType, children, className }: { deltaType: string, children: React.ReactNode, className?: string }) {
    const isIncrease = deltaType === 'moderateIncrease';
    return (
        <span className={cn(
            "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold",
            isIncrease ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
            className
        )}>
            {isIncrease ? <ArrowUpRight className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
            {children}
        </span>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
