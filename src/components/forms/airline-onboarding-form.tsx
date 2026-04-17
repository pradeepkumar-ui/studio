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

const airlineOnboardingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Airline name is required.'),
  icaoCode: z.string().length(3, 'ICAO code must be exactly 3 characters.').toUpperCase(),
  pssType: z.enum(['Amadeus', 'Sabre', 'Navitaire', 'Custom']),
  status: z.enum(['Active', 'Onboarding', 'Inactive']),
  contactEmail: z.string().email('Valid contact email is required.'),
});

export type AirlineOnboarding = z.infer<typeof airlineOnboardingSchema>;

interface AirlineOnboardingFormProps {
  airline: AirlineOnboarding | null;
  onSubmit: (data: AirlineOnboarding) => void;
  onCancel: () => void;
}

export function AirlineOnboardingForm({ airline, onSubmit, onCancel }: AirlineOnboardingFormProps) {
  const form = useForm<AirlineOnboarding>({
    resolver: zodResolver(airlineOnboardingSchema),
    defaultValues: airline || {
      name: '',
      icaoCode: '',
      pssType: 'Amadeus',
      status: 'Onboarding',
      contactEmail: '',
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
              <FormLabel>Airline Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Global Airways" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icaoCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ICAO Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., GAB" maxLength={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pssType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Host PSS System</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select PSS type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Amadeus">Amadeus Altéa</SelectItem>
                  <SelectItem value="Sabre">Sabre Sonic</SelectItem>
                  <SelectItem value="Navitaire">Navitaire NewSkies</SelectItem>
                  <SelectItem value="Custom">Custom / In-house</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technical Contact Email</FormLabel>
              <FormControl>
                <Input placeholder="tech.ops@airline.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Onboarding Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Onboarding">Onboarding / Sandbox</SelectItem>
                  <SelectItem value="Active">Active / Production</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{airline ? 'Save Changes' : 'Onboard Airline'}</Button>
        </div>
      </form>
    </Form>
  );
}
