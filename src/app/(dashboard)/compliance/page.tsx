'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GateMonitor } from '@/components/compliance/gate-monitor';
import { PolicyPacks } from '@/components/compliance/policy-packs';
import { DecisionInspector } from '@/components/compliance/decision-inspector';
import { NfrMonitor } from '@/components/compliance/nfr-monitor';

export default function CompliancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Offer & Order Compliance
        </h1>
        <p className="text-muted-foreground">
          Monitor, manage, and audit the rules that govern offer construction
          and order conversion.
        </p>
      </div>

      <Tabs defaultValue="monitor">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="monitor">Gate Monitor</TabsTrigger>
          <TabsTrigger value="policies">Policy Packs</TabsTrigger>
          <TabsTrigger value="inspector">Decision Inspector</TabsTrigger>
          <TabsTrigger value="reasons">Reason Code Explorer</TabsTrigger>
          <TabsTrigger value="nfr">NFR Monitor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monitor">
          <GateMonitor />
        </TabsContent>

        <TabsContent value="policies">
          <PolicyPacks />
        </TabsContent>

        <TabsContent value="inspector">
            <DecisionInspector />
        </TabsContent>
        
        <TabsContent value="reasons">
          <Card>
            <CardHeader>
              <CardTitle>Reason Code Explorer</CardTitle>
              <CardDescription>
                Browse the catalogue of compliance reason codes and their meanings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Reason Code Explorer will be managed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nfr">
            <NfrMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
