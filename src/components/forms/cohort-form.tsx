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
    // Ecosystem
    channels: z.array(z.string()).default([]),
    airports: z.array(z.string()).default([]),
    terminals: z.string().optional(),
    gates: z.string().optional(),
    
    // Airline/Flight
    airlines: z.array(z.string()).default([]),
    routes: z.string().optional(),
    cabinClasses: z.array(z.string()).default([]),
    aircraftTypes: z.array(z.string()).default([]),
    fareBrands: z.array(z.string()).default([]),
    ssrs: z.array(z.string()).default([]),
    
    // Journey Status
    transitStatus: z.enum(['Any', 'Origin', 'Transit', 'Destination']).default('Any'),
    minConnectionTime: z.coerce.number().optional(), // in minutes
    maxConnectionTime: z.coerce.number().optional(), // in minutes
    hoursToDeparture: z.coerce.number().optional(),
    
    // Passenger Profile
    location: z.enum(['Anywhere', 'Airport_Departure', 'Airport_Arrival', 'At_Gate', 'In_Lounge']).default('Anywhere'),
    loyaltyTiers: z.array(z.string()).default([]),
    travelGroup: z.array(z.string()).default([]),
    bookingWindowDays: z.coerce.number().optional(), // Days before departure
    
    // Real-time Airport Signals
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
              <FormLabel>Description</FormLabel>
              <FormControl><Input placeholder="Describe the segment logic..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        <h4 className="text-md font-semibold text-primary">Airport & Ecosystem Context</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.channels"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>SITA Retailing Channels</FormLabel>
                    <MultiSelect options={channelOptions} selected={field.value} onChange={field.onChange} placeholder="Select channels..." />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.airports"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Participating Airports</FormLabel>
                    <MultiSelect options={airportOptions} selected={field.value} onChange={field.onChange} placeholder="Select airports..." />
                </FormItem>
                )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.terminals"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Terminals</FormLabel>
                    <FormControl><Input placeholder="e.g., T2, T5" {...field} /></FormControl>
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.gates"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Gate Areas</FormLabel>
                    <FormControl><Input placeholder="e.g., B30-B48" {...field} /></FormControl>
                </FormItem>
                )}
            />
        </div>

        <Separator />
        <h4 className="text-md font-semibold text-primary">Airline & Flight Context</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.airlines"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Airlines</FormLabel>
                    <MultiSelect options={airlineOptions} selected={field.value} onChange={field.onChange} placeholder="Select airlines..." />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.cabinClasses"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Cabin Classes</FormLabel>
                    <MultiSelect options={cabinOptions} selected={field.value} onChange={field.onChange} placeholder="Select cabins..." />
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
                    <FormLabel>Fare Brands / Families</FormLabel>
                    <MultiSelect options={fareBrandOptions} selected={field.value} onChange={field.onChange} placeholder="Select brands..." />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.ssrs"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Present SSRs in PNR</FormLabel>
                    <MultiSelect options={ssrOptions} selected={field.value} onChange={field.onChange} placeholder="Select SSRs..." />
                </FormItem>
                )}
            />
        </div>

        <Separator />
        <h4 className="text-md font-semibold text-primary">Journey & Timing Signals</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.transitStatus"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Passenger Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Any">Any</SelectItem>
                        <SelectItem value="Origin">Originating</SelectItem>
                        <SelectItem value="Transit">Transiting</SelectItem>
                        <SelectItem value="Destination">Arriving (Destination)</SelectItem>
                    </SelectContent>
                    </Select>
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.hoursToDeparture"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Hours to Departure</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
                    <FormDescription>Target time-sensitive offers.</FormDescription>
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
                    <FormLabel>Min Connection Time (Mins)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.maxConnectionTime"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Max Connection Time (Mins)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                </FormItem>
                )}
            />
        </div>

        <Separator />
        <h4 className="text-md font-semibold text-primary">Passenger Behavior & Profiling</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.travelGroup"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Travel Group Composition</FormLabel>
                    <MultiSelect options={travelGroupOptions} selected={field.value} onChange={field.onChange} placeholder="Select group types..." />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="definition.loyaltyTiers"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Loyalty Tiers</FormLabel>
                    <MultiSelect options={loyaltyOptions} selected={field.value} onChange={field.onChange} placeholder="Select tiers..." />
                </FormItem>
                )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.location"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Current Location Signal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Anywhere">Anywhere</SelectItem>
                        <SelectItem value="Airport_Departure">At Departure Terminal</SelectItem>
                        <SelectItem value="Airport_Arrival">At Arrival Terminal</SelectItem>
                        <SelectItem value="At_Gate">In Gate Area</SelectItem>
                        <SelectItem value="In_Lounge">In Lounge</SelectItem>
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
                    <FormLabel>Security Wait Time Signal (Mins)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormDescription>Contextual fast-track upsells.</FormDescription>
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
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Cohort Definition</Button>
        </div>
      </form>
    </Form>
  );
}
