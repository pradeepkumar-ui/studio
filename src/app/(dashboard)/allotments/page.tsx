'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useSubcollection } from '@/firebase';
import { collection, doc, DocumentData } from 'firebase/firestore';

type Allotment = {
  id: string;
  date: string;
  capacity: number;
  booked: number;
  releaseDays: number;
  recallDays: number;
  nameTtlDays: number;
};

type Series = {
    id: string;
    name: string;
    description: string;
}

export default function AllotmentPage() {
  const firestore = useFirestore();
  const [seriesCollection, seriesLoading] = useCollection(firestore ? collection(firestore, 'series') : undefined);
  const seriesList = seriesCollection?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Series)) || [];

  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  
  // Set default selected series when data loads
  useEffect(() => {
    if (!selectedSeriesId && seriesList.length > 0) {
      setSelectedSeriesId(seriesList[0].id);
    }
  }, [seriesList, selectedSeriesId]);

  const [allotments, allotmentsLoading] = useSubcollection(
      firestore && selectedSeriesId ? collection(doc(firestore, 'series', selectedSeriesId), 'allotments') : undefined
  );
  
  const selectedSeries = seriesList.find(s => s.id === selectedSeriesId);
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Seat Entitlement Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor seat allocation entitlements for partners and channels.
          </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="w-64">
                {seriesLoading ? <Loader2 className="animate-spin" /> : (
                  <Select onValueChange={setSelectedSeriesId} value={selectedSeriesId || ''}>
                      <SelectTrigger>
                          <SelectValue placeholder="Select a series" />
                      </SelectTrigger>
                      <SelectContent>
                          {seriesList.map(series => (
                               <SelectItem key={series.id} value={series.id}>{series.name}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                )}
            </div>
            <Button>
                <PlusCircle className="mr-2" />
                Create Entitlement
            </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Entitlement Utilisation Grid</CardTitle>
          <CardDescription>
            {selectedSeries ? selectedSeries.description : 'Select a series to view details.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allotmentsLoading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {!allotmentsLoading && selectedSeriesId && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-1/4">Utilisation</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Booked</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Release D-</TableHead>
                    <TableHead>Recall D-</TableHead>
                    <TableHead>TTL Name D-</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(allotments as Allotment[]).map((allotment) => {
                    const remaining = allotment.capacity - allotment.booked;
                    const utilization = (allotment.booked / allotment.capacity) * 100;
                    return (
                      <TableRow key={allotment.id}>
                        <TableCell className="font-medium">{allotment.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={utilization} className="h-2"/>
                            <span className="text-xs text-muted-foreground">{utilization.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{allotment.capacity}</TableCell>
                        <TableCell>{allotment.booked}</TableCell>
                        <TableCell>{remaining}</TableCell>
                        <TableCell>{allotment.releaseDays}</TableCell>
                        <TableCell>{allotment.recallDays}</TableCell>
                        <TableCell>{allotment.nameTtlDays}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
