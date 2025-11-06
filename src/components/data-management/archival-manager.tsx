'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ArchivalManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Archival Manager</CardTitle>
        <CardDescription>
          Configure retention policies, view archived Offers, and restore snapshots.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <div className="text-center py-12 text-muted-foreground">
            <p>Archival management tools will be available here.</p>
          </div>
      </CardContent>
    </Card>
  );
}
