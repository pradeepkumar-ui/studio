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
import { Layers, Info, CheckCircle2 } from 'lucide-react';

const aggregateParamsByCategory: Record<string, string[]> = {
  'Baggage': ['Route', 'Fare brand', 'Baggage allowance', 'Aircraft type', 'Hold capacity', 'Passenger type', 'Airport restrictions', 'Weight/piece rules', 'Time to departure', 'Channel'],
  'Seat': ['Aircraft type', 'Seat map / cabin layout', 'Cabin class', 'Fare brand', 'Passenger profile', 'Loyalty tier', 'Seat availability', 'Check-in status', 'Route', 'Time to departure'],
  'Upgrade': ['Aircraft type', 'Premium cabin availability', 'Fare class', 'Ticket type', 'Loyalty tier', 'Load factor', 'Route', 'Time to departure', 'Check-in status', 'Upgrade inventory'],
  'Priority service': ['Airport capability', 'Route', 'Cabin class', 'Fare brand', 'Loyalty tier', 'Passenger type', 'Airport process setup', 'Time to departure', 'Channel'],
  'Lounge': ['Airport / terminal', 'Lounge provider availability', 'Cabin class', 'Loyalty tier', 'Fare brand', 'Route type', 'Departure/arrival/transit status', 'Capacity', 'Time slot', 'Channel'],
  'Meal': ['Flight duration', 'Route', 'Departure station catering capability', 'Aircraft galley capability', 'Cabin class', 'Meal inventory', 'Passenger dietary/SSR profile', 'Cutoff time', 'Channel'],
  'Wi-Fi / connectivity': ['Aircraft type', 'Aircraft retrofit/connectivity availability', 'Provider coverage', 'Route/geography', 'Flight duration', 'Cabin class', 'Device/session rules', 'Time of purchase'],
  'Inflight comfort': ['Aircraft type', 'Flight duration', 'Cabin class', 'Route', 'Available onboard inventory', 'Passenger profile', 'Service level', 'Fulfillment capability'],
  'Flexibility / protection': ['Fare type', 'Ticket rules', 'Booking status', 'Itinerary type', 'Route', 'Time to departure', 'Change/cancel policies', 'Passenger type', 'Insurer/provider rules if applicable'],
  'Special service': ['Passenger profile', 'SSR type', 'Medical/assistance need', 'Airport capability', 'Aircraft type', 'Route restrictions', 'Regulatory rules', 'Supplier/ground handling availability', 'Lead time'],
  'Bundle': ['Component ancillary availability', 'Route', 'Aircraft type', 'Cabin/fare applicability', 'Passenger/cohort type', 'Channel', 'Pricing strategy', 'Inventory across included products', 'Timing'],
};

const aggregateSchema = z.object({
  id: z.string().optional(),
  configName: z.string().min(5, 'Configuration name is required.'),
  ancillaryId: z.string().min(1, 'Please select an ancillary.'),
  status: z.enum(['Draft', 'Active', 'Archived']).default('Draft'),
  parameters: z.record(z.string(), z.string()).default({}),
});

export type AncillaryAggregate = z.infer<typeof aggregateSchema>;

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
  { id: '7', name: 'Gourmet Meal Pre-order', ancillaryCode: 'MEAL', category: 'Meal' },
  { id: '8', name: 'Premium Amenity Kit', ancillaryCode: 'AMEN', category: 'Inflight comfort' },
  { id: '9', name: 'Flex Change Protection', ancillaryCode: 'FLXP', category: 'Flexibility / protection' },
  { id: '10', name: 'Unaccompanied Minor', ancillaryCode: 'UMNR', category: 'Special service' },
  { id: '11', name: 'Transit Comfort Bundle', ancillaryCode: 'BUN1', category: 'Bundle' },
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
      status: 'Draft',
      parameters: {},
    },
  });

  const selectedAncillaryId = form.watch('ancillaryId');
  const selectedAncillary = availableAncillaries.find(a => a.id === selectedAncillaryId);
  const parameters = selectedAncillary ? (aggregateParamsByCategory[selectedAncillary.category] || []) : [];

  // Update configuration name based on selected ancillary
  React.useEffect(() => {
    if (selectedAncillary) {
        const currentName = form.getValues('configName');
        // Only update if current name is empty or was previously a default name
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
        </section>

        <Separator />

        {selectedAncillary ? (
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 2. Aggregate Parameters ({selectedAncillary.category})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {parameters.map(param => (
                        <FormField 
                            key={param}
                            control={form.control} 
                            name={`parameters.${param}`} 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">{param}</FormLabel>
                                    <FormControl><Input placeholder="Set aggregate value..." {...field} value={field.value || ''} /></FormControl>
                                </FormItem>
                            )} 
                        />
                    ))}
                </div>
                {parameters.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No predefined parameters for this category. You can define custom logic in the configuration name.</p>
                )}
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
