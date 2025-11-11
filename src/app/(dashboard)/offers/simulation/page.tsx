'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, PlusCircle, Trash2, Check, X, Loader2 } from 'lucide-react';
import { SimulationScenarioForm, type SimulationScenario } from '@/components/offer-simulation/scenario-form';
import { SimulationResults } from '@/components/offer-simulation/results';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function OfferSimulationPage() {
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([
    {
      id: 'base',
      name: 'Baseline',
      parameters: {
        targetAudience: 'All',
        priceAdjustment: 0,
        ancillaryDiscount: 0,
        status: 'default'
      },
    },
    {
      id: 'scenario-1',
      name: 'Aggressive Discount',
      parameters: {
        targetAudience: 'Leisure',
        priceAdjustment: -15,
        ancillaryDiscount: 25,
        status: 'editing'
      },
    },
  ]);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addScenario = () => {
    const newId = `scenario-${Date.now()}`;
    setScenarios([
      ...scenarios,
      {
        id: newId,
        name: `Scenario ${scenarios.length}`,
        parameters: { targetAudience: 'All', priceAdjustment: 0, ancillaryDiscount: 0, status: 'editing' },
      },
    ]);
  };

  const updateScenario = (id: string, updatedScenario: SimulationScenario) => {
    setScenarios(scenarios.map((s) => (s.id === id ? updatedScenario : s)));
  };
  
  const removeScenario = (id: string) => {
    if (id === 'base') return;
    setScenarios(scenarios.filter((s) => s.id !== id));
  };
  
  const runSimulation = () => {
    setIsLoading(true);
    setResults(null);
    toast({
      title: 'Running Simulations...',
      description: 'Please wait while we process the scenarios.'
    });

    setTimeout(() => {
        const mockResults = scenarios.map(s => ({
            id: s.id,
            name: s.name,
            revenue: Math.floor(Math.random() * (1 - s.parameters.priceAdjustment/100) * 500000) + 100000,
            conversion: Math.floor(Math.random() * (1 - s.parameters.priceAdjustment/100) * 15) + 5,
            margin: Math.floor(Math.random() * (1 - s.parameters.priceAdjustment/100) * 20) + 10,
        }));
        setResults(mockResults as any);
        setIsLoading(false);
        toast({
          title: 'Simulation Complete',
          description: 'Results are now available for review.'
        });
    }, 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
         <Button variant="outline" size="icon" asChild>
            <Link href="/offers">
              <ArrowLeft />
            </Link>
        </Button>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Offer Simulation</h1>
          <p className="text-muted-foreground">
            Model and compare the impact of different offer strategies.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Simulation Scenarios</CardTitle>
          <CardDescription>
            Define the scenarios to compare. Each scenario represents a different offer strategy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <SimulationScenarioForm
                key={scenario.id}
                scenario={scenario}
                onUpdate={updateScenario}
                onRemove={removeScenario}
              />
            ))}
            <Button
              variant="outline"
              className="h-full border-dashed flex flex-col gap-2 items-center justify-center"
              onClick={addScenario}
            >
              <PlusCircle className="h-8 w-8 text-muted-foreground" />
              <span>Add Scenario</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button size="lg" onClick={runSimulation} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
            Run Simulation
        </Button>
      </div>

      {(isLoading || results) && <SimulationResults results={results} isLoading={isLoading} />}
      
    </div>
  );
}
