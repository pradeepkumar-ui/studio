
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
import { Separator } from '../ui/separator';

const airportOnboardingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Airport name is required.'),
  iataCode: z.string().length(3, 'IATA code must be exactly 3 characters.').toUpperCase(),
  location: z.string().min(3, 'Location (City) is required.'),
  sitaEnabled: z.boolean().default(true),
  hardwarePrefix: z.string().min(2, 'SITA Hardware prefix is required for CUSS sync.'),
  status: z.enum(['Active', 'Onboarding', 'Inactive']),
  terminals: z.string().describe('Comma separated list of terminals'),
  timeZone: z.string().min(3, 'Timezone is required.'),
  technicalContact: z.string().email('Valid contact email is required.'),
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
      hardwarePrefix: 'K-',
      status: 'Onboarding',
      terminals: 'T1, T2',
      timeZone: 'UTC',
      technicalContact: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-4">
        <section className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Identity & Location</h4>
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="timeZone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local Timezone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., GMT+1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="technicalContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="it.ops@airport.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Infrastructure & SITA</h4>
          <FormField
            control={form.control}
            name="terminals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active Terminals</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., T1, T2, T5" {...field} />
                </FormControl>
                <FormDescription>Define the terminals where retailing is permitted.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hardwarePrefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CUSS Hardware Prefix</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., K-LHR-" {...field} />
                  </FormControl>
                  <FormDescription>Identifier for SITA device mapping.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Onboarding">Onboarding / Sandbox</SelectItem>
                      <SelectItem value="Active">Active / Production</SelectItem>
                      <SelectItem value="Inactive">Deactivated</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="sitaEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Enable Real-Time Hardware Sync</FormLabel>
                  <FormDescription>
                    Permit the PSS broker to push offers directly to CUSS kiosks.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </section>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{airport ? 'Update Node' : 'Register Airport Node'}</Button>
        </div>
      </form>
    </Form>
  );
}
