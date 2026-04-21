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
import { Building2, Info, CheckCircle2 } from 'lucide-react';

const airportAggregateParamsByCategory: Record<string, string[]> = {
  'Lounge': ['Airport', 'Terminal/Concourse', 'Lounge Provider', 'Passenger Type (Departure/Arrival/Transit)', 'Cabin/Fare/Loyalty', 'Capacity', 'Time Slot', 'Occupancy Level', 'Channel'],
  'Priority service': ['Airport Capability', 'Terminal/Checkpoint', 'Security Lane Availability', 'Time Slot', 'Congestion Level', 'Passenger Eligibility (Departure)', 'Channel'],
  'Special service': ['Airport', 'Terminal', 'Service Type (Arrival/Departure/Transit)', 'Staff Availability', 'Time Slot', 'Passenger Profile (VIP/Family/Elderly)', 'Flight Timing', 'Supplier Capacity'],
  'Ground Transport': ['Airport/City', 'Pickup/Drop Location', 'Vehicle Availability', 'Passenger Count', 'Baggage Volume', 'Time Slot', 'Supplier Availability'],
  'Parking': ['Airport', 'Parking Zone', 'Space Availability', 'Vehicle Type', 'Duration of Stay', 'Time Slot', 'Service Type (Self/Valet)'],
  'Inflight comfort': ['Airport Terminal/Zone', 'Gate Distance', 'Vehicle Availability', 'Staff Availability', 'Passenger Mobility Need', 'Time Slot', 'Service Hours'],
  'Flexibility / protection': ['Airport Protocol', 'Partner SLA', 'Validation Time', 'Time to Departure', 'Route Exclusion'],
  'Bundle': ['Ecosystem Partners', 'Combined Price Logic', 'Inventory Sync Status', 'Time Slot Alignment', 'Channel Priority'],
};

const airportAggregateSchema = z.object({
  id: z.string().optional(),
  configName: z.string().min(5, 'Configuration name is required.'),
  ancillaryId: z.string().min(1, 'Please select an airport ancillary.'),
  status: z.enum(['Draft', 'Active', 'Archived']).default('Draft'),
  parameters: z.record(z.string(), z.string()).default({}),
});

export type AirportAncillaryAggregate = z.infer<typeof airportAggregateSchema>;

interface AirportAncillaryAggregateFormProps {
  aggregate: any | null;
  onSubmit: (data: AirportAncillaryAggregate) => void;
  onCancel: () => void;
}

const mockAirportAncillariesFallback = [
  { id: 'ap1', name: 'Executive Lounge Access', ancillaryCode: 'LOU', category: 'Lounge', airportCode: 'LHR' },
  { id: 'ap2', name: 'Fast Track Security', ancillaryCode: 'FST', category: 'Priority service', airportCode: 'JFK' },
  { id: 'ap3', name: 'VIP Valet Parking', ancillaryCode: 'PRK', category: 'Parking', airportCode: 'SIN' },
  { id: 'ap4', name: 'Meet & Greet Service', ancillaryCode: 'MTG', category: 'Special service', airportCode: 'DXB' },
  { id: 'ap5', name: 'Luxury Chauffeur', ancillaryCode: 'GND', category: 'Ground Transport', airportCode: 'LHR' },
];

export function AirportAncillaryAggregateForm({ aggregate, onSubmit, onCancel }: AirportAncillaryAggregateFormProps) {
  const firestore = useFirestore();
  const airportServicesQuery = React.useMemo(() => firestore ? collection(firestore, 'airportServices') : undefined, [firestore]);
  const { data: airportServicesCollection } = useCollection(airportServicesQuery);

  const availableAncillaries = React.useMemo(() => {
    return (airportServicesCollection && airportServicesCollection.length > 0) 
      ? (airportServicesCollection as any[]) 
      : mockAirportAncillariesFallback;
  }, [airportServicesCollection]);

  const form = useForm<AirportAncillaryAggregate>({
    resolver: zodResolver(airportAggregateSchema),
    defaultValues: aggregate || {
      configName: '',
      ancillaryId: '',
      status: 'Draft',
      parameters: {},
    },
  });

  const selectedAncillaryId = form.watch('ancillaryId');
  const selectedAncillary = availableAncillaries.find(a => a.id === selectedAncillaryId);
  const parameters = selectedAncillary ? (airportAggregateParamsByCategory[selectedAncillary.category] || []) : [];

  // Update configuration name based on selected ancillary
  React.useEffect(() => {
    if (selectedAncillary) {
        const currentName = form.getValues('configName');
        if (!currentName || currentName.includes('Hub Logic Set') || currentName === '') {
            form.setValue('configName', `${selectedAncillary.name} (${selectedAncillary.airportCode}) Hub Logic Set`, { shouldValidate: true });
        }
    }
  }, [selectedAncillaryId, selectedAncillary, form]);

  const handleFinalSubmit = (data: AirportAncillaryAggregate) => {
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
                <Building2 className="h-3.5 w-3.5" /> 1. Hub Configuration Target
            </div>
            
            <FormField control={form.control} name="ancillaryId" render={({ field }) => (
                <FormItem>
                    <FormLabel>Linked Airport Ancillary*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Hub SKU from Catalogue..." /></SelectTrigger></FormControl>
                        <SelectContent>
                            {availableAncillaries.map(a => (
                                <SelectItem key={a.id} value={a.id}>{a.name} ({a.airportCode})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="configName" render={({ field }) => (
                <FormItem>
                    <FormLabel>Configuration Name*</FormLabel>
                    <FormControl><Input placeholder="e.g., LHR T5 Lounge Optimization" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </section>

        <Separator />

        {selectedAncillary ? (
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 2. Hub Aggregate Parameters ({selectedAncillary.category})
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
                    <p className="text-xs text-muted-foreground italic">No predefined hub parameters for this category. Custom logic can be defined in the configuration name.</p>
                )}
            </section>
        ) : (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl opacity-50 bg-muted/20">
                <Info className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium">Select an airport ancillary to reveal its retailing parameters.</p>
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
          <Button type="submit" className="font-bold px-8">Save Hub Aggregate Logic</Button>
        </div>
      </form>
    </Form>
  );
}
