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
import { MultiSelect } from '../ui/multi-select';
import { Separator } from '../ui/separator';

const airlineOnboardingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Airline name is required.'),
  icaoCode: z.string().length(3, 'ICAO code must be exactly 3 characters.').toUpperCase(),
  pssType: z.enum(['Amadeus', 'Sabre', 'Navitaire', 'Custom']),
  status: z.enum(['Active', 'Onboarding', 'Inactive']),
  contactEmail: z.string().email('Valid contact email is required.'),
  operatingAirports: z.array(z.string()).min(1, 'Select at least one operating hub.'),
  pnrMessagingType: z.enum(['EDIFACT', 'NDC', 'JSON']).default('EDIFACT'),
});

export type AirlineOnboarding = z.infer<typeof airlineOnboardingSchema>;

const mockAirports = [
  { value: 'LHR', label: 'London Heathrow (LHR)' },
  { value: 'JFK', label: 'John F. Kennedy (JFK)' },
  { value: 'SIN', label: 'Singapore Changi (SIN)' },
  { value: 'DXB', label: 'Dubai International (DXB)' },
  { value: 'CDG', label: 'Paris Charles de Gaulle (CDG)' },
];

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
      operatingAirports: [],
      pnrMessagingType: 'EDIFACT',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-4">
        <section className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Identity & Operations</h4>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carrier Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Global Airways" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sync Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Onboarding">Pilot / Sandbox</SelectItem>
                      <SelectItem value="Active">Live Ecosystem</SelectItem>
                      <SelectItem value="Inactive">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="operatingAirports"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ecosystem Hubs (Operating Airports)</FormLabel>
                <FormControl>
                  <MultiSelect 
                    options={mockAirports} 
                    selected={field.value} 
                    onChange={field.onChange} 
                    placeholder="Map carrier to airports..."
                  />
                </FormControl>
                <FormDescription>Select the airport nodes where this airline will retail.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <Separator />

        <section className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Technical Integration</h4>
          <div className="grid grid-cols-2 gap-4">
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
              name="pnrMessagingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PNR Sync Protocol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select protocol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EDIFACT">IATA EDIFACT</SelectItem>
                      <SelectItem value="NDC">NDC API</SelectItem>
                      <SelectItem value="JSON">REST / JSON</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PSS Technical Lead</FormLabel>
                <FormControl>
                  <Input placeholder="pss.ops@airline.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{airline ? 'Update Configuration' : 'Onboard Carrier'}</Button>
        </div>
      </form>
    </Form>
  );
}
