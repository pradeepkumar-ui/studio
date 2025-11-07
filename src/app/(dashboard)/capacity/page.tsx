'use client';

import { LiveUtilization } from '@/components/capacity/live-utilization';
import { CapacityPolicies } from '@/components/capacity/capacity-policies';
import { AlertsFeed } from '@/components/capacity/alerts-feed';

export default function CapacityPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Offer Capacity Management
        </h1>
        <p className="text-muted-foreground">
          Govern Offer exposure and acceptance via caps, quotas, and pacing rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <LiveUtilization />
          <CapacityPolicies />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <AlertsFeed />
        </div>
      </div>
    </div>
  );
}
