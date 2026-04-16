
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

const cohortSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Cohort name must be at least 5 characters.'),
  cohortId: z.string().min(3, 'Cohort ID must be at least 3 characters.').regex(/^[A-Z0-9_]+$/, 'Cohort ID can only contain uppercase letters, numbers, and underscores.'),
  description: z.string().min(10, 'A clear description is required.'),
  status: z.enum(['Active', 'Inactive']),
  definition: z.object({
    location: z.enum(['Anywhere', 'Airport_Departure', 'Airport_Arrival', 'At_Gate', 'In_Lounge']).default('Anywhere'),
    airportCode: z.string().optional(),
    terminal: z.string().optional(),
    securityWaitTime: z.coerce.number().optional(),
    purchaseHistory: z.coerce.number().optional(),
    loyaltyTier: z.enum(['All', 'Bronze', 'Silver', 'Gold', 'Platinum']).default('All'),
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
        location: 'Anywhere',
        airportCode: '',
        terminal: '',
        securityWaitTime: 0,
        purchaseHistory: 0,
        loyaltyTier: 'All',
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cohort Name</FormLabel>
                <FormControl><Input placeholder="e.g., High-Wait Passengers JFK" {...field} /></FormControl>
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
                <FormControl><Input placeholder="e.g., JFK_WAIT_HIGH" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <Separator />
        <h4 className="text-md font-semibold">Airport Ecosystem Signals</h4>
        <div className="grid grid-cols-2 gap-4">
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
                name="definition.airportCode"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Specific Airport (IATA)</FormLabel>
                    <FormControl><Input placeholder="e.g., LHR" {...field} /></FormControl>
                </FormItem>
                )}
            />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="definition.securityWaitTime"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Min. Security Wait Time (Mins)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormDescription>Target passengers frustrated by long waits.</FormDescription>
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="definition.loyaltyTier"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Loyalty Tier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="All">All Tiers</SelectItem>
                        <SelectItem value="Bronze">Bronze</SelectItem>
                        <SelectItem value="Silver">Silver</SelectItem>
                        <SelectItem value="Gold">Gold</SelectItem>
                        <SelectItem value="Platinum">Platinum</SelectItem>
                    </SelectContent>
                    </Select>
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
          <Button type="submit">Save Cohort</Button>
        </div>
      </form>
    </Form>
  );
}
