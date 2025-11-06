'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlaneTakeoff, PlaneLanding, Clock, Dot, Briefcase, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';

export type FlightOffer = {
  id: string;
  departureTime: string;
  departureCode: string;
  arrivalTime: string;
  arrivalCode: string;
  duration: string;
  stops: number;
  airline: string;
  price: number;
  currency: string;
  cabinClass: string;
  includedBaggage: string;
};

interface FlightResultCardProps {
  offer: FlightOffer;
}

export function FlightResultCard({ offer }: FlightResultCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Flight Details */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <PlaneTakeoff className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-bold text-lg">{offer.departureTime}</p>
                  <p className="text-sm text-muted-foreground">{offer.departureCode}</p>
                </div>
              </div>
              <div className="flex-1 text-center">
                <p className="text-sm text-muted-foreground">{offer.duration}</p>
                <div className="flex items-center justify-center">
                  <Separator className="w-full" />
                </div>
                <p className="text-xs text-muted-foreground">{offer.stops === 0 ? 'Non-stop' : `${offer.stops} stop(s)`}</p>
              </div>
              <div className="flex items-center gap-2 text-right">
                <div>
                  <p className="font-bold text-lg">{offer.arrivalTime}</p>
                  <p className="text-sm text-muted-foreground">{offer.arrivalCode}</p>
                </div>
                <PlaneLanding className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{offer.airline}</span>
                <Dot />
                <span>{offer.cabinClass}</span>
            </div>
          </div>

          {/* Price & Action */}
          <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-4 md:border-l md:pl-4">
            <div className="flex-1 text-center md:text-right">
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.currency }).format(offer.price)}
              </p>
              <div className="flex items-center justify-center md:justify-end gap-1 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{offer.includedBaggage}</span>
              </div>
            </div>
            <Button size="lg" className="w-full md:w-auto">
              Select Offer
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
