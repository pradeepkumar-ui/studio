
'use client';

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
import { MoreHorizontal, Play, Pause, Flag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';

type Test = {
    id: string;
    name: string;
    status: 'Running' | 'Paused' | 'Completed';
    targetMetric: string;
    variants: number;
    sampleSize: number;
    progress: number;
    winner: string | null;
};

const tests: Test[] = [
    { id: 'ABT-001', name: 'Flex_microprice_IN_weekend', status: 'Running', targetMetric: 'Conversion', variants: 2, sampleSize: 20000, progress: 65, winner: null },
    { id: 'ABT-002', name: 'Ancillary_Bundle_Placement', status: 'Running', targetMetric: 'Attach Rate', variants: 3, sampleSize: 50000, progress: 30, winner: null },
    { id: 'ABT-003', name: 'TTL_Extension_TMC_AE', status: 'Completed', targetMetric: 'Expiry Rate', variants: 2, sampleSize: 10000, progress: 100, winner: '90m TTL' },
    { id: 'ABT-004', name: 'Price_Lock_Timer_Display', status: 'Paused', targetMetric: 'Conversion', variants: 2, sampleSize: 100000, progress: 80, winner: null },
];

const getStatusBadgeVariant = (status: Test['status']) => {
    switch (status) {
        case 'Running': return 'default';
        case 'Paused': return 'secondary';
        case 'Completed': return 'outline';
    }
}

export function ABTestCentre() {
  return (
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
                    <div className="text-xs text-muted-foreground">{test.targetMetric}</div>
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
                        <DropdownMenuItem>View Results</DropdownMenuItem>
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
  );
}
