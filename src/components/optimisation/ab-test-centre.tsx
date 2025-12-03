
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Play, Pause, Flag, Eye, TestTube2, Trophy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { BarChart, Title, Text } from '@tremor/react';

type TestVariant = {
  name: string;
  description: string;
  conversion: number;
  revenue: number;
  ancillaryAttach: number;
};

type Test = {
    id: string;
    name: string;
    status: 'Running' | 'Paused' | 'Completed';
    targetMetric: 'Conversion' | 'Attach Rate' | 'Expiry Rate';
    variants: TestVariant[];
    sampleSize: number;
    progress: number;
    winner: string | null;
};

const tests: Test[] = [
    { 
        id: 'ABT-001', 
        name: 'Flex_microprice_IN_weekend', 
        status: 'Running', 
        targetMetric: 'Conversion', 
        variants: [
            { name: 'Control', description: 'No change', conversion: 14.2, revenue: 120500, ancillaryAttach: 22.1 },
            { name: 'Variant A', description: '-1.5% Price Discount', conversion: 16.1, revenue: 155400, ancillaryAttach: 23.5 },
        ], 
        sampleSize: 20000, 
        progress: 65, 
        winner: null 
    },
    { 
        id: 'ABT-002', 
        name: 'Ancillary_Bundle_Placement', 
        status: 'Running', 
        targetMetric: 'Attach Rate', 
         variants: [
            { name: 'Control', description: 'Show in sidebar', conversion: 15.5, revenue: 89000, ancillaryAttach: 28.4 },
            { name: 'Variant A', description: 'Show as modal popup', conversion: 15.3, revenue: 91200, ancillaryAttach: 32.1 },
        ], 
        sampleSize: 50000, 
        progress: 30, 
        winner: null 
    },
    { 
        id: 'ABT-003', 
        name: 'TTL_Extension_TMC_AE', 
        status: 'Completed', 
        targetMetric: 'Expiry Rate', 
        variants: [
            { name: 'Control', description: 'TTL: 60 minutes', conversion: 12.8, revenue: 210000, ancillaryAttach: 18.2 },
            { name: 'Variant A', description: 'TTL: 90 minutes', conversion: 13.1, revenue: 215000, ancillaryAttach: 18.5 },
        ], 
        sampleSize: 10000, 
        progress: 100, 
        winner: 'Variant A' 
    },
];

const getStatusBadgeVariant = (status: Test['status']) => {
    switch (status) {
        case 'Running': return 'default';
        case 'Paused': return 'secondary';
        case 'Completed': return 'outline';
    }
};

const valueFormatter = (number: number) =>
  `$${new Intl.NumberFormat('us').format(number).toString()}`;

export function ABTestCentre() {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const getWinner = (test: Test): TestVariant | null => {
      if (test.status !== 'Completed' || !test.winner) return null;
      return test.variants.find(v => v.name === test.winner) || test.variants[1];
  }
  
  const winner = selectedTest ? getWinner(selectedTest) : null;
  const control = selectedTest?.variants[0];

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>A/B Test Centre</CardTitle>
        <CardDescription>
          Design, monitor, and manage optimisation experiments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Winner</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">
                    <div>{test.name}</div>
                    <div className="text-xs text-muted-foreground">Target: {test.targetMetric}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(test.status)}>{test.status}</Badge>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Progress value={test.progress} className="h-2"/>
                        <span className="text-xs text-muted-foreground">{test.progress}%</span>
                    </div>
                </TableCell>
                <TableCell>{test.winner || 'N/A'}</TableCell>
                <TableCell className="text-right">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedTest(test)}>
                            <Eye className="mr-2 h-4 w-4"/> View Results
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            {test.status === 'Running' ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Resume</>}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                           <Flag className="mr-2 h-4 w-4" /> End Test
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    
    <Dialog open={!!selectedTest} onOpenChange={(open) => !open && setSelectedTest(null)}>
        <DialogContent className="max-w-4xl">
           {selectedTest && (
            <>
                <DialogHeader>
                    <DialogTitle>A/B Test Results: {selectedTest.name}</DialogTitle>
                    <DialogDescription>
                        Comparison of variants for the target metric: <span className="font-semibold">{selectedTest.targetMetric}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {selectedTest.variants.map((variant, index) => (
                        <Card key={variant.name} className={index === 0 ? '' : 'border-primary'}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                     {index === 0 ? <TestTube2 className="h-5 w-5" /> : <Trophy className="h-5 w-5 text-primary" />}
                                     {variant.name}
                                </CardTitle>
                                <CardDescription>{variant.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Conversion Rate</TableCell>
                                            <TableCell className="text-right font-medium">{variant.conversion.toFixed(1)}%</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Revenue</TableCell>
                                            <TableCell className="text-right font-medium">{valueFormatter(variant.revenue)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Ancillary Attach</TableCell>
                                            <TableCell className="text-right font-medium">{variant.ancillaryAttach.toFixed(1)}%</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                 <div>
                    <Title>Revenue Comparison</Title>
                    <BarChart
                        className="mt-4 h-60"
                        data={selectedTest.variants}
                        index="name"
                        categories={['revenue']}
                        colors={['gray', 'blue']}
                        valueFormatter={valueFormatter}
                        yAxisWidth={80}
                        showLegend={false}
                    />
                </div>
                 {winner && control && (
                     <div className="p-4 bg-secondary rounded-lg">
                        <h4 className="font-semibold">Conclusion</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            {`The winner is `} 
                            <span className="font-bold text-primary">{winner.name}</span>
                            {`, showing a `}
                            <span className="font-bold text-green-600">
                                {`${(winner.conversion - control.conversion).toFixed(1)}pp increase`}
                            </span>
                            {` in Conversion Rate compared to the Control.`}
                        </p>
                    </div>
                )}
            </>
           )}
        </DialogContent>
    </Dialog>
    </>
  );
}
