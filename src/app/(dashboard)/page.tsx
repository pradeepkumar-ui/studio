
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Grid,
  BarChart,
  AreaChart,
  DonutChart,
  Title,
  Text,
  Metric,
  Flex,
  ProgressBar,
  BadgeDelta,
  BarList,
  Tracker,
  type Color,
} from '@tremor/react';
import { KpiCard } from '@/components/analytics/kpi-card';
import { 
  ShieldCheck, 
  Plane, 
  Building2, 
  MonitorDot, 
  TrendingUp, 
  QrCode, 
  Clock, 
  ShoppingBag,
  Zap,
  Activity,
  AlertCircle
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const chartFormatter = (number: number) =>
  `$${Intl.NumberFormat('us').format(number).toString()}`;

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat('us').format(number).toString()}`;

// --- MOCK DATA ---

const globalKpis = [
  { title: 'Total Ecosystem Revenue', metric: '$4.2M', progress: 12.5, target: '$3.8M', deltaType: 'moderateIncrease' },
  { title: 'Global Conversion Rate', metric: '18.4%', progress: 4.2, target: '15%', deltaType: 'moderateIncrease' },
  { title: 'Offers Generated (24h)', metric: '42,550', progress: 8.9, target: '40,000', deltaType: 'moderateIncrease' },
  { title: 'Active Partners', metric: '124', progress: 2.1, target: '115', deltaType: 'moderateIncrease' },
];

const revenueByStakeholder = [
  { name: 'Airlines (Air)', value: 2800000 },
  { name: 'Airports (Services)', value: 950000 },
  { name: 'Retail Partners', value: 450000 },
];

const topPerformers = [
  { name: 'LHR - Heathrow', type: 'Airport', revenue: '$1.1M', conversion: '22%' },
  { name: 'Air Canada', type: 'Airline', revenue: '$850k', conversion: '19%' },
  { name: 'SIN - Changi', type: 'Airport', revenue: '$720k', conversion: '25%' },
  { name: 'Lufthansa', type: 'Airline', revenue: '$640k', conversion: '16%' },
];

const ecosystemHealth: { color: Color; tooltip: string }[] = [
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'yellow', tooltip: 'Degraded - SITA API Latency' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
];

const airlineAncillaryYield = [
  { name: 'Seat Selection', value: 340000 },
  { name: 'Priority Baggage', value: 180000 },
  { name: 'Cabin Upgrades', value: 450000 },
  { name: 'Flexibility Waivers', value: 120000 },
];

const sitaAlerts = [
  { terminal: 'LHR-T5', device: 'CUSS-042', issue: 'Paper Out', severity: 'low' },
  { terminal: 'DXB-T3', device: 'CUTE-881', issue: 'Auth Failure', severity: 'high' },
  { terminal: 'JFK-T4', device: 'CUPPS-GateB', issue: 'High Latency', severity: 'medium' },
];

export default function OffersenseMainDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Offersense Admin Console</h1>
        <p className="text-muted-foreground">
          Real-time global oversight of airport retailing, SITA infrastructure, and airline conversion performance.
        </p>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="global">Global Admin</TabsTrigger>
          <TabsTrigger value="airline">Airlines</TabsTrigger>
          <TabsTrigger value="sita">SITA Ops</TabsTrigger>
          <TabsTrigger value="airport">Airports</TabsTrigger>
        </TabsList>

        {/* --- GLOBAL ADMIN TAB --- */}
        <TabsContent value="global" className="space-y-6">
          <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
            {globalKpis.map((item) => (
              <KpiCard key={item.title} item={item as any} />
            ))}
          </Grid>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Global Ecosystem Health</CardTitle>
                <CardDescription>System-wide API and service availability across all partners.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-500" /> Uptime: 99.98%</span>
                    <span className="text-muted-foreground">Last 15 minutes</span>
                  </div>
                  <Tracker data={ecosystemHealth} className="mt-2" />
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <Text className="text-xs">SITA Broker</Text>
                      <Metric className="text-sm font-bold text-emerald-600">ACTIVE</Metric>
                    </div>
                    <div>
                      <Text className="text-xs">Airline PSS Gateway</Text>
                      <Metric className="text-sm font-bold text-emerald-600">ACTIVE</Metric>
                    </div>
                    <div>
                      <Text className="text-xs">Payment PSP</Text>
                      <Metric className="text-sm font-bold text-yellow-600">DEGRADED</Metric>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Top Revenue Contributors</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableBody>
                    {topPerformers.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell className="py-3">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">{item.type}</div>
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <div className="font-bold text-sm">{item.revenue}</div>
                          <div className="text-[10px] text-emerald-600 font-bold">{item.conversion} Conv.</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ecosystem Revenue Split</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <DonutChart
                  data={revenueByStakeholder}
                  category="value"
                  index="name"
                  valueFormatter={chartFormatter}
                  colors={['blue', 'cyan', 'indigo']}
                  className="h-full"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retailing Growth (24h)</CardTitle>
                <CardDescription>Volume of offers pushed through SITA vs converted to orders.</CardDescription>
              </CardHeader>
              <CardContent>
                 <BarChart
                    className="h-72 mt-4"
                    data={[
                      { time: '00:00', Offers: 1200, Orders: 210 },
                      { time: '04:00', Offers: 800, Orders: 150 },
                      { time: '08:00', Offers: 3200, Orders: 640 },
                      { time: '12:00', Offers: 4500, Orders: 920 },
                      { time: '16:00', Offers: 3800, Orders: 780 },
                      { time: '20:00', Offers: 2100, Orders: 410 },
                    ]}
                    index="time"
                    categories={['Offers', 'Orders']}
                    colors={['slate', 'blue']}
                    valueFormatter={valueFormatter}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- AIRLINE TAB --- */}
        <TabsContent value="airline" className="space-y-6">
          <Grid numItemsSm={1} numItemsLg={3} className="gap-6">
            <Card>
              <Flex alignItems="start">
                <div>
                  <Text>Upsell Yield per Pax</Text>
                  <Metric>$42.50</Metric>
                </div>
                <BadgeDelta deltaType="moderateIncrease">15%</BadgeDelta>
              </Flex>
              <Text className="mt-2 text-xs text-muted-foreground">Incremental revenue purely from Offersense ancillaries.</Text>
            </Card>
            <Card>
              <Flex alignItems="start">
                <div>
                  <Text>PSS PNR Sync Rate</Text>
                  <Metric>99.98%</Metric>
                </div>
                <BadgeDelta deltaType="unchanged">0%</BadgeDelta>
              </Flex>
              <ProgressBar value={99.9} color="emerald" className="mt-3" />
              <Text className="mt-2 text-xs text-muted-foreground">Successful real-time updates to Host PSS systems.</Text>
            </Card>
             <Card>
              <Flex alignItems="start">
                <div>
                  <Text>Seat Map Monetization</Text>
                  <Metric>32.4%</Metric>
                </div>
                <BadgeDelta deltaType="moderateIncrease">8%</BadgeDelta>
              </Flex>
              <ProgressBar value={32.4} color="blue" className="mt-3" />
              <Text className="mt-2 text-xs text-muted-foreground">Ratio of paid vs. free seat selections via CUSS.</Text>
            </Card>
          </Grid>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card>
              <CardHeader>
                <CardTitle>Ancillary Revenue Breakdown</CardTitle>
                <CardDescription>Value distribution across offer types.</CardDescription>
              </CardHeader>
              <CardContent>
                <BarList data={airlineAncillaryYield} valueFormatter={chartFormatter} className="mt-4" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Conversion by Booking Window</CardTitle>
                <CardDescription>How offer uptake varies based on hours to departure.</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart
                  className="h-72 mt-4"
                  data={[
                    { htd: '48h', Conv: 5 },
                    { htd: '24h', Conv: 12 },
                    { htd: '12h', Conv: 18 },
                    { htd: '4h (Terminal)', Conv: 28 },
                    { htd: '1h (Gate)', Conv: 35 },
                  ]}
                  index="htd"
                  categories={['Conv']}
                  colors={['indigo']}
                  valueFormatter={(v) => `${v}%`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- SITA TAB --- */}
        <TabsContent value="sita" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hardware Connectivity Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>CUSS Kiosks (Operational)</span>
                    <span>142 / 150</span>
                  </div>
                  <ProgressBar value={94.6} color="blue" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>CUTE Agent Desktops</span>
                    <span>45 / 45</span>
                  </div>
                  <ProgressBar value={100} color="emerald" />
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs">
                    <span>CUPPS Core Link</span>
                    <span>Operational</span>
                  </div>
                  <Tracker data={Array(20).fill({ color: 'emerald', tooltip: 'Healthy' })} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
               <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Live SITA Infrastructure Alerts</CardTitle>
                  <CardDescription>Critical and informational events from airport terminals.</CardDescription>
                </div>
                <Badge variant="outline" className="flex gap-1"><Activity className="h-3 w-3" /> Monitor Active</Badge>
              </CardHeader>
              <CardContent>
                 <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Issue</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sitaAlerts.map((alert, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-bold text-xs">{alert.terminal}</TableCell>
                          <TableCell className="font-mono text-xs">{alert.device}</TableCell>
                          <TableCell className="text-xs">{alert.issue}</TableCell>
                          <TableCell>
                            <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                 </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SITA Activation Flow Performance</CardTitle>
              <CardDescription>Latency breakdown of the "Offer -> QR -> Scan -> Fulfil" cycle.</CardDescription>
            </CardHeader>
            <CardContent>
               <BarChart
                className="h-72 mt-4"
                data={[
                  { step: 'Offer Gen', ms: 240 },
                  { step: 'QR Sync', ms: 110 },
                  { step: 'Kiosk Push', ms: 450 },
                  { step: 'Scan Auth', ms: 320 },
                  { step: 'PSS Update', ms: 890 },
                ]}
                index="step"
                categories={['ms']}
                colors={['slate']}
                valueFormatter={(v) => `${v}ms`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- AIRPORT TAB --- */}
        <TabsContent value="airport" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Wait-Time Impact Analysis</CardTitle>
                <CardDescription>Correlation between security wait times and "Fast Track" offer uptake.</CardDescription>
              </CardHeader>
              <CardContent>
                 <AreaChart
                    className="h-80 mt-4"
                    data={[
                      { time: '08:00', Wait: 12, Sales: 45 },
                      { time: '10:00', Wait: 25, Sales: 180 },
                      { time: '12:00', Wait: 35, Sales: 310 },
                      { time: '14:00', Wait: 15, Sales: 90 },
                      { time: '16:00', Wait: 22, Sales: 145 },
                    ]}
                    index="time"
                    categories={['Wait', 'Sales']}
                    colors={['orange', 'emerald']}
                    valueFormatter={(v) => `${v}`}
                />
                <Text className="mt-4 text-xs italic text-muted-foreground text-center">
                  Insight: Every 5-minute increase in wait time {'>'} 20m generates +22% uplift in Fast-Track offers.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vendor Performance</CardTitle>
                <CardDescription>Conversion volume by partner category.</CardDescription>
              </CardHeader>
              <CardContent>
                <BarList 
                  data={[
                    { name: 'Duty Free (Vouchers)', value: 1240 },
                    { name: 'Lounge Access', value: 890 },
                    { name: 'VIP Meet & Assist', value: 450 },
                    { name: 'F&B Pre-orders', value: 320 },
                    { name: 'Parking Valet', value: 210 },
                  ]} 
                  className="mt-6" 
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Terminal Asset Yield
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Metric>$18.40</Metric>
                <Text className="mt-1 text-xs">Revenue per departing passenger from non-air services.</Text>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MonitorDot className="h-4 w-4 text-blue-500" />
                  Self-Service Penetration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Metric>68%</Metric>
                <ProgressBar value={68} color="blue" className="mt-3" />
                <Text className="mt-1 text-xs">Offers accepted via CUSS Kiosks vs. Mobile/Web.</Text>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Lounge Capacity Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Metric>88% Peak</Metric>
                <ProgressBar value={88} color="orange" className="mt-3" />
                <Text className="mt-1 text-xs">3 Lounge offers automatically paused due to capacity caps.</Text>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

