
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlaneTakeoff, PlaneLanding, Dot, Briefcase, ChevronRight, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { BrandedFareCard } from './branded-fare-card';

export type BrandedFare = {
  id: string;
  brand: string;
  cabinClass: string;
  price: number;
  includedServices: string[];
};

export type FlightJourney = {
  id: string;
  departureTime: string;
  departureCode: string;
  arrivalTime: string;
  arrivalCode: string;
  duration: string;
  stops: number;
  airline: string;
  fares: BrandedFare[];
};

interface JourneyResultCardProps {
  journey: FlightJourney;
  onSelectFare: (fare: BrandedFare) => void;
  selectedFareId?: string;
}

export function JourneyResultCard({ journey, onSelectFare, selectedFareId }: JourneyResultCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 p-4">
        <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
                <PlaneTakeoff className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-bold">{journey.departureTime}</p>
                  <p className="text-muted-foreground">{journey.departureCode}</p>
                </div>
            </div>
            <div className="flex-1 text-center">
                <p className="text-xs text-muted-foreground">{journey.duration}</p>
                <div className="flex items-center justify-center">
                  <Separator className="w-full" />
                </div>
                <p className="text-xs text-muted-foreground">{journey.stops === 0 ? 'Non-stop' : `${journey.stops} stop(s)`}</p>
            </div>
            <div className="flex items-center gap-2 text-right">
                 <div>
                  <p className="font-bold">{journey.arrivalTime}</p>
                  <p className="text-muted-foreground">{journey.arrivalCode}</p>
                </div>
                <PlaneLanding className="h-5 w-5 text-muted-foreground" />
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
          {journey.fares.map(fare => (
            <BrandedFareCard 
              key={fare.id}
              fare={fare}
              onSelect={() => onSelectFare(fare)}
              isSelected={selectedFareId === fare.id}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

    