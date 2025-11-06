
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OptimisationDashboard } from '@/components/optimisation/dashboard';
import { RecommendationsQueue } from '@/components/optimisation/recommendations-queue';
import { ABTestCentre } from '@/components/optimisation/ab-test-centre';

export default function OptimisationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Offer Optimisation
        </h1>
        <p className="text-muted-foreground">
          Monitor and apply rule-driven and AI-assisted optimisations to lift conversion and yield.
        </p>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="ab-testing">A/B Test Centre</TabsTrigger>
          <TabsTrigger value="rules">Rules & Guardrails</TabsTrigger>
          <TabsTrigger value="models">Model Monitor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <OptimisationDashboard />
        </TabsContent>

        <TabsContent value="recommendations">
          <RecommendationsQueue />
        </TabsContent>
        
        <TabsContent value="ab-testing">
            <ABTestCentre />
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Rules & Guardrails</CardTitle>
              <CardDescription>
                Configure deterministic policies and global caps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Rule and guardrail configuration will be managed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>Model & Drift Monitor</CardTitle>
              <CardDescription>
                View model versions, metrics, drift alerts, and canary status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Model monitoring dashboards will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
