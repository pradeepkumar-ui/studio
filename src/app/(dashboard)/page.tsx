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
  ShoppingBag 
} from 'lucide-react';

const chartFormatter = (number: number) =>
  `$${Intl.NumberFormat('us').format(number).toString()}`;

const percentFormatter = (number: number) => `${number}%`;

// --- GLOBAL ADMIN DATA ---
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

// --- AIRLINE DATA ---
const airlineData = [
  { date: 'Oct 01', Fares: 4500, Ancillaries: 1200 },
  { date: 'Oct 02', Fares: 4200, Ancillaries: 1350 },
  { date: 'Oct 03', Fares: 5100, Ancillaries: 1800 },
  { date: 'Oct 04', Fares: 4800, Ancillaries: 1600 },
  { date: 'Oct 05', Fares: 5500, Ancillaries: 2100 },
];

// --- SITA DATA ---
const sitaMetrics = [
  { name: 'CUSS Kiosks', value: 85 },
  { name: 'CUTE Desktops', value: 12 },
  { name: 'Mobile App', value: 3 },
];

const sitaHealth = [
  { label: 'CUPPS Compliance', value: 99.8, color: 'emerald' },
  { label: 'QR Scan Success', value: 94.2, color: 'blue' },
  { label: 'API Uptime', value: 99.99, color: 'emerald' },
];

// --- AIRPORT DATA ---
const airportServicesPerformance = [
  { name: 'Lounge Access', value: 1240 },
  { name: 'Fast Track', value: 890 },
  { name: 'Parking', value: 450 },
  { name: 'F&B Pre-order', value: 320 },
  { name: 'Retail Vouchers', value: 210 },
];

export default function OffersenseMainDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Offersense Admin Console</h1>
        <p className="text-muted-foreground">
          Global oversight of airline retailing, airport ecosystem performance, and SITA infrastructure integration.
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
                <CardDescription>Split of ecosystem revenue by stakeholder type.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-80">
                <DonutChart
                  data={revenueByStakeholder}
                  category="value"
                  index="name"
                  valueFormatter={chartFormatter}
                  colors={['blue', 'cyan', 'indigo']}
                  className="h-64"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retailing Growth</CardTitle>
                <CardDescription>Total offer volume vs converted orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart
                  className="h-72 mt-4"
                  data={airlineData} // Using airline data for trend simulation
                  index="date"
                  categories={['Fares', 'Ancillaries']}
                  colors={['blue', 'indigo']}
                  valueFormatter={chartFormatter}
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
                  <Text>Seat Attach Rate</Text>
                  <Metric>32.4%</Metric>
                </div>
                <BadgeDelta deltaType="moderateIncrease">12%</BadgeDelta>
              </Flex>
              <ProgressBar value={32.4} color="blue" className="mt-3" />
            </Card>
            <Card>
              <Flex alignItems="start">
                <div>
                  <Text>Baggage Upsell</Text>
                  <Metric>24.1%</Metric>
                </div>
                <BadgeDelta deltaType="moderateDecrease">2%</BadgeDelta>
              </Flex>
              <ProgressBar value={24.1} color="indigo" className="mt-3" />
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
            </Card>
          </Grid>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-primary" />
                Fare vs Ancillary Conversion Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                className="h-72 mt-4"
                data={airlineData}
                index="date"
                categories={['Fares', 'Ancillaries']}
                colors={['blue', 'cyan']}
                valueFormatter={chartFormatter}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- SITA TAB --- */}
        <TabsContent value="sita" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MonitorDot className="h-5 w-5 text-primary" />
                  Touchpoint Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={sitaMetrics}
                  category="value"
                  index="name"
                  colors={['blue', 'indigo', 'slate']}
                  className="h-48 mt-4"
                />
                <div className="space-y-4 mt-6">
                  {sitaHealth.map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                      <ProgressBar value={item.value} color={item.color as any} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  Terminal Offer Uptake (QR Scans)
                </CardTitle>
                <CardDescription>Number of offers pushed to CUSS kiosks vs actually scanned by passengers.</CardDescription>
              </CardHeader>
              <CardContent>
                 <AreaChart
                    className="h-80 mt-4"
                    data={[
                      { time: '08:00', Pushed: 120, Scanned: 45 },
                      { time: '10:00', Pushed: 180, Scanned: 88 },
                      { time: '12:00', Pushed: 250, Scanned: 110 },
                      { time: '14:00', Pushed: 210, Scanned: 95 },
                      { time: '16:00', Pushed: 300, Scanned: 155 },
                    ]}
                    index="time"
                    categories={['Pushed', 'Scanned']}
                    colors={['slate', 'blue']}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- AIRPORT TAB --- */}
        <TabsContent value="airport" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Airport Service Performance
                </CardTitle>
                <CardDescription>Volume of non-air services sold through the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                 <BarChart
                    className="h-80 mt-4"
                    data={airportServicesPerformance}
                    index="name"
                    categories={['value']}
                    colors={['indigo']}
                    showLegend={false}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    Security Wait Threshold
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Metric>22 Mins</Metric>
                  <Text className="mt-1">Correlation: +15% Uptake in Fast-Track offers when wait {'>'} 20m.</Text>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    Top Partner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Metric>WorldDutyFree</Metric>
                  <Text className="mt-1">$45k revenue generated via QR vouchers this week.</Text>
                </CardContent>
              </Card>

               <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    Lounge Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Metric>88% Peak</Metric>
                  <ProgressBar value={88} color="blue" className="mt-3" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
