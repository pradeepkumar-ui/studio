'use client';

import { BarChart, Card, Title, Text } from '@tremor/react';
import {
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
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

type Result = {
  id: string;
  name: string;
  revenue: number;
  conversion: number;
  margin: number;
};

interface SimulationResultsProps {
  results: Result[] | null;
  isLoading: boolean;
}

const valueFormatter = (number: number) =>
  `$ ${new Intl.NumberFormat('us').format(number).toString()}`;

export function SimulationResults({ results, isLoading }: SimulationResultsProps) {
  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
            </CardContent>
        </Card>
    );
  }

  if (!results) return null;
  
  const baseline = results.find(r => r.id === 'base');
  if (!baseline) return null; // Should not happen

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Results</CardTitle>
        <CardDescription>
          Comparison of forecasted impact for each scenario against the baseline.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <Title>Revenue Forecast</Title>
            <BarChart
            className="mt-6"
            data={results}
            index="name"
            categories={['revenue']}
            colors={['blue']}
            valueFormatter={valueFormatter}
            yAxisWidth={48}
            />
        </div>
        <div>
            <Title>KPI Comparison</Title>
            <Table className="mt-2">
                <TableHeader>
                    <TableRow>
                        <TableHead>Scenario</TableHead>
                        <TableHead>Revenue Delta</TableHead>
                        <TableHead>Conversion Delta</TableHead>
                        <TableHead>Margin Delta</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.map(result => {
                        const revenueDelta = result.revenue - baseline.revenue;
                        const conversionDelta = result.conversion - baseline.conversion;
                        const marginDelta = result.margin - baseline.margin;

                        const renderDelta = (delta: number, unit: string = '') => {
                            const isPositive = delta > 0;
                            const formatted = `${isPositive ? '+' : ''}${delta.toFixed(1)}${unit}`;
                            return (
                                <span className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                    {formatted}
                                </span>
                            );
                        }

                        return (
                            <TableRow key={result.id}>
                                <TableCell className="font-medium">{result.name}</TableCell>
                                <TableCell>{renderDelta(revenueDelta / baseline.revenue * 100, '%')}</TableCell>
                                <TableCell>{renderDelta(conversionDelta, 'pp')}</TableCell>
                                <TableCell>{renderDelta(marginDelta, 'pp')}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
