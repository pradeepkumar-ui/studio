
'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CheckCircle, Check } from "lucide-react";

export type BrandedFare = {
  id: string;
  brand: string;
  cabinClass: string;
  price: number;
  basePrice: number;
  includedServices: string[];
};

interface BrandedFareCardProps {
  fare: BrandedFare;
  onSelect: () => void;
  isSelected: boolean;
}

export function BrandedFareCard({ fare, onSelect, isSelected }: BrandedFareCardProps) {
  const hasDiscount = fare.price < fare.basePrice;
  const hasMarkup = fare.price > fare.basePrice;

  return (
    <div className="flex flex-col p-4">
      <div className="flex-grow space-y-3">
        <h4 className="font-semibold text-lg">{fare.brand}</h4>
        <Badge variant="outline">{fare.cabinClass}</Badge>
        <ul className="text-xs text-muted-foreground space-y-1.5 h-24">
            {fare.includedServices.map(service => (
                <li key={service} className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500"/>
                    <span>{service}</span>
                </li>
            ))}
        </ul>
        <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">
            ${fare.price.toFixed(2)}
            </p>
            {(hasDiscount || hasMarkup) && (
                <p className="text-sm text-muted-foreground line-through">${fare.basePrice.toFixed(2)}</p>
            )}
        </div>
      </div>
      <Button className="w-full mt-4" onClick={onSelect} disabled={isSelected}>
        {isSelected ? <><CheckCircle className="mr-2" />Selected</> : 'Select'}
      </Button>
    </div>
  );
}
