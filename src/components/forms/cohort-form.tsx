
'use client';

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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '../ui/separator';
import { MultiSelect } from '../ui/multi-select';

const channelOptions = [
  { value: 'CUSS', label: 'SITA CUSS Kiosk' },
  { value: 'CUTE', label: 'Agent Desktop (CUTE)' },
  { value: 'CUPPS', label: 'CUPPS Platform' },
  { value: 'Mobile', label: 'Mobile App' },
  { value: 'Web', label: 'Web Portal' },
];

const airportOptions = [
  { value: 'LHR', label: 'London Heathrow (LHR)' },
  { value: 'JFK', label: 'John F. Kennedy (JFK)' },
  { value: 'SIN', label: 'Singapore Changi (SIN)' },
  { value: 'DXB', label: 'Dubai International (DXB)' },
  { value: 'CDG', label: 'Paris Charles de Gaulle (CDG)' },
];

const airlineOptions = [
  { value: 'BA', label: 'British Airways' },
  { value: 'AA', label: 'American Airlines' },
  { value: 'SQ', label: 'Singapore Airlines' },
  { value: 'EK', label: 'Emirates' },
  { value: 'LH', label: 'Lufthansa' },
];

const cabinOptions = [
  { value: 'Economy', label: 'Economy' },
  { value: 'Premium Economy', label: 'Premium Economy' },
  { value: 'Business', label: 'Business' },
  { value: 'First', label: 'First' },
];

const loyaltyOptions = [
  { value: 'Bronze', label: 'Bronze' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Gold', label: 'Gold' },
  { value: 'Platinum', label: 'Platinum' },
];

const fareBrandOptions = [
    { value: 'Saver', label: 'Saver / Basic' },
    { value: 'Standard', label: 'Standard / Value' },
    { value: 'Flex', label: 'Flex / Premium' },
];

const travelGroupOptions = [
    { value: 'Solo', label: 'Solo Traveler' },
    { value: 'Couple', label: 'Couple' },
    { value: 'Family', label: 'Family (With Children)' },
    { value: 'BusinessGroup', label: 'Business Group' },
];

const ssrOptions = [
    { value: 'WCHR', label: 'Wheelchair Assistance' },
    { value: 'VGML', label: 'Vegetarian Meal' },
    { value: 'KSML', label: 'Kosher Meal' },
    { value: 'PETC', label: 'Pet in Cabin' },
    { value: 'UMNR', label: 'Unaccompanied Minor' },
];

const cohortSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Cohort name must be at least 5 characters.'),
  cohortId: z.string().min(3, 'Cohort ID must be at least 3 characters.').regex(/^[A-Z0-9_]+$/, 'Cohort ID can only contain uppercase letters, numbers, and underscores.'),
  description: z.string().min(10, 'A clear description is required.'),
  status: z.enum(['Active', 'Inactive']),
  definition: z.object({
    channels: z.array(z.string()).default([]),
    airports: z.array(z.string()).default([]),
    terminals: z.string().optional(),
    gates: z.string().optional(),
    airlines: z.array(z.string()).default([]),
    routes: z.string().optional(),
    cabinClasses: z.array(z.string()).default([]),
    aircraftTypes: z.array(z.string()).default([]),
    fareBrands: z.array(z.string()).default([]),
    ssrs: z.array(z.string()).default([]),
    transitStatus: z.enum(['Any', 'Origin', 'Transit', 'Destination']).default('Any'),
    minConnectionTime: z.coerce.number().optional(),
    maxConnectionTime: z.coerce.number().optional(),
    hoursToDeparture: z.coerce.number().optional(),
    location: z.enum(['Anywhere', 'Airport_Departure', 'Airport_Arrival', 'At_Gate', 'In_Lounge']).default('Anywhere'),
    loyaltyTiers: z.array(z.string()).default([]),
    travelGroup: z.array(z.string()).default([]),
    bookingWindowDays: z.coerce.number().optional(),
    securityWaitTime: z.coerce.number().optional(),
  }),
});

export type Cohort = z.infer<typeof cohortSchema>;

interface CohortFormProps {
  cohort: Cohort | null;
  onSubmit: (data: Cohort) => void;
  onCancel: () => void;
}

export function CohortForm({ cohort, onSubmit, onCancel }: CohortFormProps) {
  const defaultDefinition = {
    channels: [],
    airports: [],
    terminals: '',
    gates: '',
    airlines: [],
    routes: '',
    cabinClasses: [],
    aircraftTypes: [],
    fareBrands: [],
    ssrs: [],
    transitStatus: 'Any' as const,
    location: 'Anywhere' as const,
    loyaltyTiers: [],
    travelGroup: [],
    securityWaitTime: 0,
  };

  const form = useForm<Cohort>({
    resolver: zodResolver(cohortSchema),
    defaultValues: cohort ? {
      ...cohort,
      definition: {
        ...defaultDefinition,
        ...cohort.definition,
        channels: cohort.definition?.channels || [],
        airports: cohort.definition?.airports || [],
        airlines: cohort.definition?.airlines || [],
        cabinClasses: cohort.definition?.cabinClasses || [],
        fareBrands: cohort.definition?.fareBrands || [],
        loyaltyTiers: cohort.definition?.loyaltyTiers || [],
        travelGroup: cohort.definition?.travelGroup || [],
        ssrs: cohort.definition?.ssrs || [],
      },
    } : {
      name: '',
      cohortId: '',
      description: '',
      status: 'Active',
      definition: defaultDefinition,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cohort Name</FormLabel>
                <FormControl><Input placeholder="e.g., Transit Families LHR T5" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="cohortId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cohort ID</FormLabel>
                <FormControl><Input placeholder="e.g., LHR_TRANSIT_FAM" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operational Description</FormLabel>
              <FormControl><Input placeholder="Highlight why this cohort is being targeted..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        <h4 className="text-md font-bold text-primary uppercase tracking-tighter">1. Ecosystem & Touchpoint Signals</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.channels"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>SITA Channels</FormLabel>
                    <FormControl>
                        <MultiSelect options={channelOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select channels..." />
                    </FormControl>
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.airports"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Airport Nodes</FormLabel>
                    <FormControl>
                        <MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select airports..." />
                    </FormControl>
                </FormItem>
                )}
            />
        </div>

        <Separator />
        <h4 className="text-md font-bold text-primary uppercase tracking-tighter">2. Airline Host & Flight Signals</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.airlines"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Carriers</FormLabel>
                    <FormControl>
                        <MultiSelect options={airlineOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select airlines..." />
                    </FormControl>
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.cabinClasses"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Cabin Classes</FormLabel>
                    <FormControl>
                        <MultiSelect options={cabinOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select cabins..." />
                    </FormControl>
                </FormItem>
                )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.fareBrands"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Fare Brand Inclusion</FormLabel>
                    <FormControl>
                        <MultiSelect options={fareBrandOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select brands..." />
                    </FormControl>
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.ssrs"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Passenger SSRs (PNR Sync)</FormLabel>
                    <FormControl>
                        <MultiSelect options={ssrOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select SSRs..." />
                    </FormControl>
                </FormItem>
                )}
            />
        </div>

        <Separator />
        <h4 className="text-md font-bold text-primary uppercase tracking-tighter">3. Passenger Behavior & Composition</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.travelGroup"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Travel Group Type</FormLabel>
                    <FormControl>
                        <MultiSelect options={travelGroupOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select group types..." />
                    </FormControl>
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.loyaltyTiers"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Loyalty Tiers</FormLabel>
                    <FormControl>
                        <MultiSelect options={loyaltyOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select tiers..." />
                    </FormControl>
                </FormItem>
                )}
            />
        </div>

        <Separator />
        <h4 className="text-md font-bold text-primary uppercase tracking-tighter">4. Real-time Operational Signals</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.transitStatus"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Journey Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Any">Any</SelectItem>
                        <SelectItem value="Origin">Originating (Checking-in)</SelectItem>
                        <SelectItem value="Transit">In Transit (Airside)</SelectItem>
                        <SelectItem value="Destination">Arriving (Baggage Claim)</SelectItem>
                    </SelectContent>
                    </Select>
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.securityWaitTime"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Security Wait Signal (Mins)</FormLabel>
                    <FormControl><Input type="number" placeholder="Trigger if > X mins" {...field} /></FormControl>
                    <FormDescription className="text-[10px]">Use for Fast Track upselling.</FormDescription>
                </FormItem>
                )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.minConnectionTime"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Min Connection (Mins)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.maxConnectionTime"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Max Connection (Mins)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                </FormItem>
                )}
            />
        </div>

        <Separator />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Segment Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active (Discovery Active)</SelectItem>
                  <SelectItem value="Inactive">Paused</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-background py-4 border-t z-10">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="px-8">Save Retailing Segment</Button>
        </div>
      </form>
    </Form>
  );
}
