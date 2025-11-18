
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export type Ancillary = {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
};

const availableAncillaries: Ancillary[] = [
  { id: 'ANC-001', name: '1st Checked Bag (23kg)', price: 35, currency: 'USD', category: 'Baggage' },
  { id: 'ANC-007', name: '2nd Checked Bag (23kg)', price: 50, currency: 'USD', category: 'Baggage' },
  { id: 'ANC-008', name: 'Oversize Baggage', price: 100, currency: 'USD', category: 'Baggage' },
  { id: 'ANC-002', name: 'Extra Legroom Seat', price: 50, currency: 'USD', category: 'Seats' },
  { id: 'ANC-009', name: 'Up-front Seat', price: 25, currency: 'USD', category: 'Seats' },
  { id: 'ANC-003', name: 'In-flight Wi-Fi', price: 8, currency: 'USD', category: 'On-board Services' },
  { id: 'ANC-006', name: 'Lounge Access', price: 45, currency: 'USD', category: 'On-board Services' },
  { id: 'ANC-010', name: 'Premium Meal', price: 25, currency: 'USD', category: 'On-board Services' },
  { id: 'ANC-004', name: 'Priority Boarding', price: 15, currency: 'USD', category: 'On-board Services' },
  { id: 'ANC-005', name: 'Flight Change Fee', price: 75, currency: 'USD', category: 'Flexibility' },
  { id: 'ANC-011', name: 'Cancel for any reason', price: 40, currency: 'USD', category: 'Flexibility' },
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
  
  const groupedAncillaries = availableAncillaries.reduce((acc, ancillary) => {
    (acc[ancillary.category] = acc[ancillary.category] || []).push(ancillary);
    return acc;
  }, {} as Record<string, Ancillary[]>);

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Optional Services</h4>
      <Accordion type="multiple" defaultValue={Object.keys(groupedAncillaries)} className="w-full">
        {Object.entries(groupedAncillaries).map(([category, ancillaries]) => (
          <AccordionItem value={category} key={category}>
            <AccordionTrigger className="text-base">{category}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {ancillaries.map((ancillary) => (
                  <div key={ancillary.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={ancillary.id}
                        checked={selectedAncillaries.some((a) => a.id === ancillary.id)}
                        onCheckedChange={(checked) => handleCheckedChange(checked, ancillary)}
                      />
                      <Label htmlFor={ancillary.id} className="font-medium text-sm">
                        {ancillary.name}
                      </Label>
                    </div>
                    <div className="text-sm font-semibold">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: ancillary.currency }).format(ancillary.price)}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
