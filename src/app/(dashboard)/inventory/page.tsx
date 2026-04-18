
'use client';

import { BookingClasses } from '@/components/inventory/booking-classes';
import { FareBrandMapping } from '@/components/inventory/fare-brand-mapping';
import { FlightAvailability } from '@/components/inventory/flight-availability';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Activity, ShieldCheck, Database } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const kpiData = [
    { title: 'Global Seat Load Factor', value: '82.4%', icon: Activity, progress: 82.4, color: 'text-emerald-500' },
    { title: 'Host PSS Sync Health', value: '100%', icon: ShieldCheck, progress: 100, color: 'text-blue-500' },
    { title: 'Active Fare Classes', value: '18', icon: Database, progress: 75, color: 'text-indigo-500' },
];

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Aviation Inventory Console</h1>
          <p className="text-muted-foreground">
            Monitor flight availability, manage RBDs, and govern overbooking controls for the retailing engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpiData.map((kpi) => (
              <Card key={kpi.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                      <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{kpi.value}</div>
                      <Progress value={kpi.progress} className="h-1 mt-3" />
                  </CardContent>
              </Card>
          ))}
      </div>
      
      <FlightAvailability />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        <BookingClasses />
        <FareBrandMapping />
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
