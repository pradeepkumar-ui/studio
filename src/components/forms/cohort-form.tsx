
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

const aircraftOptions = [
  { value: 'A320', label: 'Airbus A320 Family' },
  { value: 'A350', label: 'Airbus A350' },
  { value: 'A380', label: 'Airbus A380' },
  { value: 'B737', label: 'Boeing 737' },
  { value: 'B777', label: 'Boeing 777' },
  { value: 'B787', label: 'Boeing 787 Dreamliner' },
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
    airlines: z.array(z.string()).default([]),
    routes: z.string().optional(),
    cabinClasses: z.array(z.string()).default([]),
    aircraftTypes: z.array(z.string()).default([]),
    location: z.enum(['Anywhere', 'Airport_Departure', 'Airport_Arrival', 'At_Gate', 'In_Lounge']).default('Anywhere'),
    terminal: z.string().optional(),
    securityWaitTime: z.coerce.number().optional(),
    loyaltyTiers: z.array(z.string()).default([]),
  }),
});

export type Cohort = z.infer<typeof cohortSchema>;

interface CohortFormProps {
  cohort: Cohort | null;
  onSubmit: (data: Cohort) => void;
  onCancel: () => void;
}

export function CohortForm({ cohort, onSubmit, onCancel }: CohortFormProps) {
  const form = useForm<Cohort>({
    resolver: zodResolver(cohortSchema),
    defaultValues: cohort || {
      name: '',
      cohortId: '',
      description: '',
      status: 'Active',
      definition: {
        channels: [],
        airports: [],
        airlines: [],
        routes: '',
        cabinClasses: [],
        aircraftTypes: [],
        location: 'Anywhere',
        terminal: '',
        securityWaitTime: 0,
        loyaltyTiers: [],
      },
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
                <FormControl><Input placeholder="e.g., High-Wait Business LHR" {...field} /></FormControl>
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
                <FormControl><Input placeholder="e.g., LHR_BIZ_WAIT_HIGH" {...field} /></FormControl>
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
        <h4 className="text-md font-semibold">Ecosystem Context</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.channels"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Retailing Channels (SITA)</FormLabel>
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
                name="definition.routes"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Specific Routes</FormLabel>
                    <FormControl><Input placeholder="e.g., JFK-LHR, SIN-*" {...field} /></FormControl>
                </FormItem>
                )}
            />
        </div>

        <Separator />
        <h4 className="text-md font-semibold">Flight & Cabin Specifics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
             <FormField
                control={form.control}
                name="definition.aircraftTypes"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Aircraft Types</FormLabel>
                    <MultiSelect options={aircraftOptions} selected={field.value} onChange={field.onChange} placeholder="Select aircraft..." />
                </FormItem>
                )}
            />
        </div>

        <Separator />
        <h4 className="text-md font-semibold">Real-time Airport Signals</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="definition.location"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Passenger Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Anywhere">Anywhere</SelectItem>
                        <SelectItem value="Airport_Departure">At Departure Airport</SelectItem>
                        <SelectItem value="Airport_Arrival">At Arrival Airport</SelectItem>
                        <SelectItem value="At_Gate">At the Gate</SelectItem>
                        <SelectItem value="In_Lounge">In the Lounge</SelectItem>
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
                    <FormLabel>Min. Security Wait Time (Mins)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormDescription>Trigger offers when terminal is congested.</FormDescription>
                </FormItem>
                )}
            />
        </div>
        
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
          <Button type="submit">Save Cohort</Button>
        </div>
      </form>
    </Form>
  );
}
