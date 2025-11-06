'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActiveWaiversDashboard } from '@/components/disruption/active-waivers-dashboard';
import { WaiverPolicyCatalogue } from '@/components/disruption/waiver-policy-catalogue';
import { EligibilityChecker } from '@/components/disruption/eligibility-checker';

export default function DisruptionWaiversPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Disruption Pricing Waivers
        </h1>
        <p className="text-muted-foreground">
          Manage pricing logic and rule relaxations for passengers affected by operational disruptions.
        </p>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Active Waivers Dashboard</TabsTrigger>
          <TabsTrigger value="policies">Waiver Policy Catalogue</TabsTrigger>
          <TabsTrigger value="checker">Eligibility Checker</TabsTrigger>
          <TabsTrigger value="audit">Audit & Reporting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <ActiveWaiversDashboard />
        </TabsContent>

        <TabsContent value="policies">
          <WaiverPolicyCatalogue />
        </TabsContent>

        <TabsContent value="checker">
           <EligibilityChecker />
        </TabsContent>
        
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit & Reporting</CardTitle>
              <CardDescription>
                Review waiver application history and performance metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Audit trails and reporting dashboards will be available here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
