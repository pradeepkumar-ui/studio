
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SchemaValidator } from '@/components/data-management/schema-validator';
import { ReconciliationDashboard } from '@/components/data-management/reconciliation-dashboard';
import { AuditViewer } from '@/components/data-management/audit-viewer';
import { ArchivalManager } from '@/components/data-management/archival-manager';

export default function OfferDataManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Offer Data Management
        </h1>
        <p className="text-muted-foreground">
          Manage, validate, and audit the lifecycle of Offer data.
        </p>
      </div>

      <Tabs defaultValue="validator">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="validator">Schema Validator</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="audit">Audit Viewer</TabsTrigger>
          <TabsTrigger value="archival">Archival Manager</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="validator">
            <SchemaValidator />
        </TabsContent>

        <TabsContent value="reconciliation">
            <ReconciliationDashboard />
        </TabsContent>

        <TabsContent value="audit">
            <AuditViewer />
        </TabsContent>
        
        <TabsContent value="archival">
            <ArchivalManager />
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Monitor cache hit rates, latency, and storage usage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Performance metrics will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
