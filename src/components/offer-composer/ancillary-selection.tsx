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

const availableAncillaries: Ancillary[] = [
  { id: 'anc_bag_1', name: '1st Checked Bag (23kg)', price: 40, currency: 'USD' },
  { id: 'anc_bag_2', name: '2nd Checked Bag (23kg)', price: 60, currency: 'USD' },
  { id: 'anc_lounge_1', name: 'Lounge Access (JFK)', price: 55, currency: 'USD' },
  { id: 'anc_wifi_1', name: 'In-flight Wi-Fi', price: 15, currency: 'USD' },
  { id: 'anc_ins_1', name: 'Travel Insurance', price: 25, currency: 'USD' },
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
