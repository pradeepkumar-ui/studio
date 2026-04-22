'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Layers, Info, CheckCircle2, DollarSign } from 'lucide-react';

const dropdownOptions: Record<string, string[]> = {
  'Aircraft type': ['A320neo', 'A350-900', 'A380-800', 'B737 MAX', 'B777-300ER', 'B787-9'],
  'Cabin class': ['Economy', 'Premium Economy', 'Business', 'First', 'All'],
  'Flight duration': ['Short haul', 'Long haul'],
  'Fare brand': ['Economy Light', 'Economy Flex', 'Business Saver', 'Business Flex'],
  'Passenger type': ['Adult', 'Child', 'Infant'],
  'Time to departure': ['< 2hrs', '< 4hrs', '< 6 hrs', '< 8 hrs', '< 12 hrs'],
  'Channel': ['Web', 'Mobile', 'Kiosk'],
  'Loyalty tier': ['Platinum', 'Gold', 'Silver', 'Bronze'],
};

const aggregateParamsByCategory: Record<string, string[]> = {
  'Baggage': ['Route', 'Fare brand', 'Baggage allowance', 'Aircraft type', 'Hold capacity', 'Passenger type', 'Airport restrictions', 'Weight/piece rules', 'Time to departure', 'Channel'],
  'Seat': ['Aircraft type', 'Seat map / cabin layout', 'Cabin class', 'Fare brand', 'Passenger profile', 'Loyalty tier', 'Seat availability', 'Check-in status', 'Route', 'Time to departure'],
  'Upgrade': ['Aircraft type', 'Premium cabin availability', 'Cabin class', 'Fare brand', 'Loyalty tier', 'Load factor', 'Route', 'Time to departure', 'Check-in status', 'Upgrade inventory'],
  'Priority service': ['Airport capability', 'Route', 'Cabin class', 'Fare brand', 'Loyalty tier', 'Passenger type', 'Airport process setup', 'Time to departure', 'Channel'],
  'Lounge': ['Airport / terminal', 'Lounge provider availability', 'Cabin class', 'Loyalty tier', 'Fare brand', 'Route type', 'Departure/arrival/transit status', 'Capacity', 'Time slot', 'Channel'],
  'Meal': ['Flight duration', 'Route', 'Departure station catering capability', 'Aircraft galley capability', 'Cabin class', 'Meal inventory', 'Passenger type', 'Cutoff time', 'Channel'],
  'Wi-Fi / connectivity': ['Aircraft type', 'Aircraft retrofit/connectivity availability', 'Provider coverage', 'Route/geography', 'Flight duration', 'Cabin class', 'Device/session rules', 'Time of purchase'],
  'Inflight comfort': ['Aircraft type', 'Flight duration', 'Cabin class', 'Route', 'Available onboard inventory', 'Passenger type', 'Service level', 'Fulfillment capability'],
  'Flexibility / protection': ['Fare brand', 'Booking status', 'Route', 'Time to departure', 'Passenger type'],
  'Special service': ['Passenger type', 'SSR type', 'Airport capability', 'Aircraft type', 'Route restrictions', 'Lead time'],
  'Bundle': ['Route', 'Aircraft type', 'Cabin class', 'Fare brand', 'Passenger type', 'Channel', 'Time to departure'],
};

const aggregateSchema = z.object({
  id: z.string().optional(),
  configName: z.string().min(5, 'Configuration name is required.'),
  ancillaryId: z.string().min(1, 'Please select an ancillary.'),
  basePrice: z.coerce.number().min(0, 'Base price must be a non-negative number.'),
  currency: z.string().length(3, 'Currency must be a 3-letter code.').toUpperCase().default('USD'),
  status: z.enum(['Draft', 'Active', 'Archived']).default('Draft'),
  parameters: z.record(z.string(), z.string()).default({}),
});

export type AncillaryAggregate = z.infer<typeof aggregateSchema> & { ancillaryName?: string, category?: string };

interface AncillaryAggregateFormProps {
  aggregate: any | null;
  onSubmit: (data: AncillaryAggregate) => void;
  onCancel: () => void;
}

const mockAncillariesFallback = [
  { id: '1', name: 'Extra Legroom Seat', ancillaryCode: 'EXLG', category: 'Seat' },
  { id: '2', name: 'Premium Wi-Fi (Unlimited)', ancillaryCode: 'WIFU', category: 'Wi-Fi / connectivity' },
  { id: '3', name: 'Standby Upgrade (J Class)', ancillaryCode: 'UPGS', category: 'Upgrade' },
  { id: '4', name: '1st Checked Bag (23kg)', ancillaryCode: 'BAG1', category: 'Baggage' },
  { id: '5', name: 'Priority Boarding', ancillaryCode: 'PBDG', category: 'Priority service' },
  { id: '6', name: 'Executive Lounge Access', ancillaryCode: 'LOUA', category: 'Lounge' },
];

export function AncillaryAggregateForm({ aggregate, onSubmit, onCancel }: AncillaryAggregateFormProps) {
  const firestore = useFirestore();
  const ancillariesQuery = React.useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
  const { data: ancillariesCollection } = useCollection(ancillariesQuery);

  const availableAncillaries = React.useMemo(() => {
    return (ancillariesCollection && ancillariesCollection.length > 0) 
      ? (ancillariesCollection as any[]) 
      : mockAncillariesFallback;
  }, [ancillariesCollection]);

  const form = useForm<AncillaryAggregate>({
    resolver: zodResolver(aggregateSchema),
    defaultValues: aggregate || {
      configName: '',
      ancillaryId: '',
      basePrice: 0,
      currency: 'USD',
      status: 'Draft',
      parameters: {},
    },
  });

  const selectedAncillaryId = form.watch('ancillaryId');
  const selectedAncillary = availableAncillaries.find(a => a.id === selectedAncillaryId);
  const parameters = selectedAncillary ? (aggregateParamsByCategory[selectedAncillary.category] || []) : [];

  React.useEffect(() => {
    if (selectedAncillary) {
        const currentName = form.getValues('configName');
        if (!currentName || currentName.includes('Logic Set') || currentName === '') {
            form.setValue('configName', `${selectedAncillary.name} Logic Set`, { shouldValidate: true });
        }
    }
  }, [selectedAncillaryId, selectedAncillary, form]);

  const handleFinalSubmit = (data: AncillaryAggregate) => {
    onSubmit({
      ...data,
      ancillaryName: selectedAncillary?.name,
      category: selectedAncillary?.category,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
        
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <Layers className="h-3.5 w-3.5" /> 1. Configuration Target
            </div>
            
            <FormField control={form.control} name="ancillaryId" render={({ field }) => (
                <FormItem>
                    <FormLabel>Linked Airline Ancillary*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select SKU from Catalogue..." /></SelectTrigger></FormControl>
                        <SelectContent>
                            {availableAncillaries.map(a => (
                                <SelectItem key={a.id} value={a.id}>{a.name} ({a.ancillaryCode || 'NO_CODE'})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="configName" render={({ field }) => (
                <FormItem>
                    <FormLabel>Configuration Name*</FormLabel>
                    <FormControl><Input placeholder="e.g., LHR-JFK Premium Baggage Logic" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="basePrice" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Base Price (Per Unit)*</FormLabel>
                      <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl><Input type="number" placeholder="0.00" className="pl-9 font-bold" {...field} /></FormControl>
                      </div>
                      <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="currency" render={({ field }) => (
                  <FormItem>
                      <FormLabel>ISO Currency*</FormLabel>
                      <FormControl><Input placeholder="USD" className="font-mono uppercase" {...field} maxLength={3} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
            </div>
        </section>

        <Separator />

        {selectedAncillary ? (
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 2. Aggregate Parameters ({selectedAncillary.category})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {parameters.map(param => {
                        const options = dropdownOptions[param];
                        return (
                            <FormField 
                                key={param}
                                control={form.control} 
                                name={`parameters.${param}`} 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">{param}</FormLabel>
                                        {options ? (
                                            <Select onValueChange={field.onChange} value={field.value || ''}>
                                                <FormControl>
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue placeholder={`Select ${param.toLowerCase()}...`} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <FormControl><Input placeholder="Set value..." {...field} value={field.value || ''} /></FormControl>
                                        )}
                                    </FormItem>
                                )} 
                            />
                        );
                    })}
                </div>
            </section>
        ) : (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl opacity-50 bg-muted/20">
                <Info className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium">Select an airline ancillary to reveal its aggregate parameters.</p>
            </div>
        )}

        <Separator />

        <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
                <FormLabel>Deployment Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </FormItem>
        )} />

        <div className="flex justify-end gap-3 pt-6 border-t sticky bottom-0 bg-background py-4 z-10">
          <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
          <Button type="submit" className="font-bold px-8">Save Aggregate Logic</Button>
        </div>
      </form>
    </Form>
  );
}
