'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Building2, Info, DollarSign, PlusCircle, Trash2, Settings2 } from 'lucide-react';

const dropdownOptions: Record<string, string[]> = {
  'Cabin Class': ['Economy', 'Premium Economy', 'Business', 'First', 'All'],
  'Fare Brand': ['Economy Light', 'Economy Flex', 'Business Saver', 'Business Flex'],
  'Passenger Type': ['Adult', 'Child', 'Infant'],
  'Channel': ['Web', 'Mobile', 'CUSS Kiosk', 'CUTE Agent', 'CUPPS'],
  'Loyalty Tier': ['Platinum', 'Gold', 'Silver', 'Bronze', 'None'],
  'Journey Stage': ['Departure', 'Arrival', 'Transit', 'All'],
  'Security Lane Status': ['Open', 'Limited', 'Express Only', 'Closed'],
  'Lounge Occupancy Level': ['Low', 'Moderate', 'High', 'At Capacity'],
  'Operational Mode': ['NORMAL', 'CONGESTION', 'DISRUPTION'],
};

const MASTER_AIRPORT_PARAMETER_POOL = [
  'Airport Code',
  'Terminal',
  'Concourse / Zone',
  'Gate Area',
  'Lounge Operator',
  'Lounge Occupancy Level',
  'Lounge Capacity',
  'Security Pacing Level',
  'Security Lane Status',
  'Checkpoint Location',
  'Ground Partner (Supplier)',
  'Journey Stage',
  'Layover Duration',
  'Time Slot (Service Window)',
  'Staff Availability Level',
  'Vehicle Type (Transport)',
  'Space Availability (Parking)',
  'Zone Level (Parking)',
  'Service Point ID',
  'SITA Hardware ID',
  'Channel',
  'Passenger Type',
  'Loyalty Tier',
  'Cabin Class',
  'Fare Brand',
  'Operational Mode'
].sort();

const airportAggregateSchema = z.object({
  id: z.string().optional(),
  configName: z.string().min(5, 'Configuration name is required.'),
  ancillaryId: z.string().min(1, 'Please select an airport ancillary.'),
  basePrice: z.coerce.number().min(0, 'Base price must be a non-negative number.'),
  currency: z.string().length(3, 'Currency must be a 3-letter code.').toUpperCase().default('USD'),
  status: z.enum(['Draft', 'Active', 'Archived']).default('Draft'),
  parameters: z.array(z.object({
    name: z.string().min(1, 'Select a parameter'),
    value: z.string().min(1, 'Value is required')
  })).default([]),
});

export type AirportAncillaryAggregate = z.infer<typeof airportAggregateSchema> & { ancillaryName?: string, category?: string };

interface AirportAncillaryAggregateFormProps {
  aggregate: any | null;
  onSubmit: (data: AirportAncillaryAggregate) => void;
  onCancel: () => void;
}

const mockAirportAncillariesFallback = [
  { id: 'ap1', name: 'Executive Lounge Access', ancillaryCode: 'LOU', category: 'Lounge', airportCode: 'LHR' },
  { id: 'ap2', name: 'Fast Track Security', ancillaryCode: 'FST', category: 'Priority service', airportCode: 'JFK' },
  { id: 'ap3', name: 'VIP Valet Parking', ancillaryCode: 'VAL', category: 'Parking', airportCode: 'SIN' },
  { id: 'ap4', name: 'Premium Sleeping Pod (6h)', ancillaryCode: 'POD', category: 'Inflight comfort', airportCode: 'DXB' },
  { id: 'ap5', name: 'Porter Service (3 Bags)', ancillaryCode: 'PTR', category: 'Special service', airportCode: 'LHR' },
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

  const initialParameters = React.useMemo(() => {
    if (!aggregate?.parameters) return [];
    if (Array.isArray(aggregate.parameters)) return aggregate.parameters;
    return Object.entries(aggregate.parameters).map(([name, value]) => ({ 
      name, 
      value: String(value) 
    }));
  }, [aggregate]);

  const form = useForm<AirportAncillaryAggregate>({
    resolver: zodResolver(airportAggregateSchema),
    defaultValues: aggregate ? {
      ...aggregate,
      parameters: initialParameters
    } : {
      configName: '',
      ancillaryId: '',
      basePrice: 0,
      currency: 'USD',
      status: 'Draft',
      parameters: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parameters"
  });

  const selectedAncillaryId = form.watch('ancillaryId');
  const selectedAncillary = availableAncillaries.find(a => a.id === selectedAncillaryId);

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
                    <FormLabel>Linked Airport Ancillary Master*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Hub SKU..." /></SelectTrigger></FormControl>
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

        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                    <Settings2 className="h-3.5 w-3.5" /> 2. Hub-Managed Aggregate Parameters
                </div>
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => append({ name: '', value: '' })}
                    className="h-8 font-bold"
                >
                    <PlusCircle className="h-3.5 w-3.5 mr-2" /> Add Hub Parameter
                </Button>
            </div>

            {fields.length > 0 ? (
                <div className="space-y-3">
                    {fields.map((item, index) => {
                        const selectedParamName = form.watch(`parameters.${index}.name`);
                        const options = dropdownOptions[selectedParamName];

                        return (
                            <div key={item.id} className="grid grid-cols-12 gap-3 p-4 rounded-xl border bg-muted/20 items-end">
                                <div className="col-span-5">
                                    <FormField
                                        control={form.control}
                                        name={`parameters.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Airport Signal</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Select Signal..." /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {MASTER_AIRPORT_PARAMETER_POOL.map(p => (
                                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-6">
                                    <FormField
                                        control={form.control}
                                        name={`parameters.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Registry Value</FormLabel>
                                                {options ? (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Select Value..." /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <FormControl><Input placeholder="Set logic value..." className="h-9" {...field} /></FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => remove(index)}
                                        className="text-muted-foreground hover:text-destructive h-9 w-9"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-8 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl opacity-50 bg-muted/10">
                    <Info className="h-8 w-8 mb-2" />
                    <p className="text-sm font-medium text-center">No hub parameters defined. Select signals like "Lounge Occupancy" or "Security Pacing" to begin.</p>
                </div>
            )}
        </section>

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
