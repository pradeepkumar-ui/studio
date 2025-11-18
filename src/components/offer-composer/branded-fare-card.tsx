'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CheckCircle } from "lucide-react";

export type BrandedFare = {
  id: string;
  brand: string;
  cabinClass: string;
  price: number;
  includedBaggage: string;
};

interface BrandedFareCardProps {
  fare: BrandedFare;
  onSelect: () => void;
  isSelected: boolean;
}

export function BrandedFareCard({ fare, onSelect, isSelected }: BrandedFareCardProps) {
  return (
    <div className="flex flex-col p-4">
      <div className="flex-grow space-y-3">
        <h4 className="font-semibold text-lg">{fare.brand}</h4>
        <Badge variant="outline">{fare.cabinClass}</Badge>
        <p className="text-xs text-muted-foreground h-10">{fare.includedBaggage}</p>
        <p className="text-3xl font-bold">
          ${fare.price.toFixed(2)}
        </p>
      </div>
      <Button className="w-full mt-4" onClick={onSelect} disabled={isSelected}>
        {isSelected ? <><CheckCircle className="mr-2" />Selected</> : 'Select'}
      </Button>
    </div>
  );
}
