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
import { Checkbox } from '@/components/ui/checkbox';

const airportOnboardingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Airport name is required.'),
  iataCode: z.string().length(3, 'IATA code must be exactly 3 characters.').toUpperCase(),
  location: z.string().min(3, 'Location (City) is required.'),
  sitaEnabled: z.boolean().default(true),
  status: z.enum(['Active', 'Onboarding', 'Inactive']),
  terminals: z.string().optional().describe('Comma separated list of terminals'),
});

export type AirportOnboarding = z.infer<typeof airportOnboardingSchema>;

interface AirportOnboardingFormProps {
  airport: AirportOnboarding | null;
  onSubmit: (data: AirportOnboarding) => void;
  onCancel: () => void;
}

export function AirportOnboardingForm({ airport, onSubmit, onCancel }: AirportOnboardingFormProps) {
  const form = useForm<AirportOnboarding>({
    resolver: zodResolver(airportOnboardingSchema),
    defaultValues: airport || {
      name: '',
      iataCode: '',
      location: '',
      sitaEnabled: true,
      status: 'Onboarding',
      terminals: 'T1, T2',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Airport Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., London Heathrow Airport" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="iataCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IATA Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., LHR" maxLength={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City / Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., London" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="terminals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terminals</FormLabel>
              <FormControl>
                <Input placeholder="e.g., T1, T2, T5" {...field} />
              </FormControl>
              <FormDescription>Comma-separated list of terminals at this airport.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sitaEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>SITA Retailing Enabled</FormLabel>
                <FormDescription>
                  Enable connection to CUSS kiosks and CUTE desktops at this airport.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Onboarding">Onboarding</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{airport ? 'Save Changes' : 'Onboard Airport'}</Button>
        </div>
      </form>
    </Form>
  );
}
