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
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="ab-testing">A/B Test Centre</TabsTrigger>
          <TabsTrigger value="rules">Rules & Guardrails</TabsTrigger>
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
                Configure deterministic policies and global caps that govern the optimisation engine. This includes dynamic pricing rules.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">Manage all dynamic pricing rules from the central console.</p>
              <Button asChild>
                <Link href="/pricing/rules">Go to Dynamic Pricing Rules</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
