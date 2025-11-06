'use client';

import { useState } from 'react';
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

type Allotment = {
  date: string;
  capacity: number;
  booked: number;
  releaseDays: number;
  recallDays: number;
  nameTtlDays: number;
};

const seriesData: { [key: string]: Allotment[] } = {
  'NSA-THR-2026': [
    { date: '2026-01-03', capacity: 30, booked: 12, releaseDays: 30, recallDays: 10, nameTtlDays: 14 },
    { date: '2026-01-10', capacity: 30, booked: 25, releaseDays: 30, recallDays: 10, nameTtlDays: 14 },
    { date: '2026-01-17', capacity: 30, booked: 30, releaseDays: 30, recallDays: 10, nameTtlDays: 14 },
    { date: '2026-01-24', capacity: 30, booked: 18, releaseDays: 30, recallDays: 10, nameTtlDays: 14 },
    { date: '2026-01-31', capacity: 30, booked: 22, releaseDays: 30, recallDays: 10, nameTtlDays: 14 },
  ],
  'NSA-CORP-ACME': [
    { date: '2025-07-05', capacity: 10, booked: 8, releaseDays: 14, recallDays: 7, nameTtlDays: 7 },
    { date: '2025-07-12', capacity: 10, booked: 2, releaseDays: 14, recallDays: 7, nameTtlDays: 7 },
    { date: '2025-07-19', capacity: 10, booked: 10, releaseDays: 14, recallDays: 7, nameTtlDays: 7 },
  ]
};

export default function AllotmentPage() {
  const [selectedSeries, setSelectedSeries] = useState('NSA-THR-2026');

  const allotments = seriesData[selectedSeries] || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Allotment Board
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor series allotments for Negotiated Space Agreements.
          </p>
        </div>
        <div className="w-64">
            <Select onValueChange={setSelectedSeries} defaultValue={selectedSeries}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a series" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="NSA-THR-2026">NSA-THR-2026 (SZX-BOM)</SelectItem>
                    <SelectItem value="NSA-CORP-ACME">NSA-CORP-ACME (LHR-JFK)</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Series Allotment Grid</CardTitle>
          <CardDescription>
            Series: {selectedSeries === 'NSA-THR-2026' ? 'Sat out / Wed in' : 'Daily'} for {selectedSeries}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {allotments.map((allotment) => {
                const remaining = allotment.capacity - allotment.booked;
                const utilization = (allotment.booked / allotment.capacity) * 100;
                return (
                  <TableRow key={allotment.date}>
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
        </CardContent>
      </Card>
    </div>
  );
}
