'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type Ancillary = {
  id: string;
  name: string;
  price: number;
  currency: string;
};

// This data now matches the catalogue from `pricing/ancillary/page.tsx`
const availableAncillaries: Ancillary[] = [
  { id: 'ANC-001', name: '1st Checked Bag (23kg)', price: 35, currency: 'USD' },
  { id: 'ANC-003', name: 'In-flight Wi-Fi', price: 8, currency: 'USD' },
  { id: 'ANC-005', name: 'Flight Change Fee', price: 75, currency: 'USD' },
  { id: 'ANC-006', name: 'Lounge Access', price: 45, currency: 'USD' },
];

interface AncillarySelectionProps {
  selectedAncillaries: Ancillary[];
  onAncillaryChange: (ancillaries: Ancillary[]) => void;
}

export function AncillarySelection({ selectedAncillaries, onAncillaryChange }: AncillarySelectionProps) {
  const handleCheckedChange = (checked: boolean | 'indeterminate', ancillary: Ancillary) => {
    if (checked) {
      onAncillaryChange([...selectedAncillaries, ancillary]);
    } else {
      onAncillaryChange(selectedAncillaries.filter((a) => a.id !== ancillary.id));
    }
  };

  return (
    <div className="space-y-4">
        <h4 className="font-semibold">Optional Services</h4>
        <div className="space-y-3">
        {availableAncillaries.map((ancillary) => (
            <div key={ancillary.id} className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center space-x-3">
                <Checkbox
                id={ancillary.id}
                checked={selectedAncillaries.some((a) => a.id === ancillary.id)}
                onCheckedChange={(checked) => handleCheckedChange(checked, ancillary)}
                />
                <Label htmlFor={ancillary.id} className="font-medium">
                {ancillary.name}
                </Label>
            </div>
            <div className="text-sm font-semibold">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: ancillary.currency }).format(ancillary.price)}
            </div>
            </div>
        ))}
        </div>
    </div>
  );
}
