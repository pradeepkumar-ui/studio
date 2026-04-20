
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

const partnerOnboardingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Partner name is required.'),
  airportCode: z.string({ required_error: 'Primary airport node is required.' }),
  terminal: z.string().min(2, 'Specific terminal/gate is required.'),
  category: z.enum(['F&B', 'Retail', 'Services', 'Transport']),
  status: z.enum(['Active', 'Inactive']),
  contactEmail: z.string().email('Valid contact email is required.'),
  commissionRate: z.coerce.number().min(0).max(100, 'Invalid commission rate.'),
});

export type PartnerOnboarding = z.infer<typeof partnerOnboardingSchema>;

const mockAirports = [
  { id: 'LHR', name: 'London Heathrow (LHR)' },
  { id: 'JFK', name: 'John F. Kennedy (JFK)' },
  { id: 'SIN', name: 'Singapore Changi (SIN)' },
  { id: 'DXB', label: 'Dubai International (DXB)' },
];

interface PartnerOnboardingFormProps {
  partner: PartnerOnboarding | null;
  onSubmit: (data: PartnerOnboarding) => void;
  onCancel: () => void;
}

export function PartnerOnboardingForm({ partner, onSubmit, onCancel }: PartnerOnboardingFormProps) {
  const form = useForm<PartnerOnboarding>({
    resolver: zodResolver(partnerOnboardingSchema),
    defaultValues: partner || {
      name: '',
      airportCode: '',
      terminal: '',
      category: 'Retail',
      status: 'Active',
      contactEmail: '',
      commissionRate: 15,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-4">
        <section className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Vendor Identity</h4>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand / Vendor Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., SkyCafe Gourmet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="F&B">Food & Beverage</SelectItem>
                      <SelectItem value="Retail">Retail / Duty-Free</SelectItem>
                      <SelectItem value="Services">Airport Services</SelectItem>
                      <SelectItem value="Transport">Ground Transport</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offersense Commission (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Placement & Deployment</h4>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="airportCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authorized Airport Node</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select airport..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockAirports.map(apt => (
                        <SelectItem key={apt.id} value={apt.id}>{apt.id}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Only registered nodes are selectable.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terminal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terminal / Gate Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., T5 B-Gates" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Communication & Status</h4>
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fulfillment Contact (API/Email)</FormLabel>
                <FormControl>
                  <Input placeholder="fulfillment@vendor.com" {...field} />
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
                <FormLabel>Operational Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Authorized / Selling</SelectItem>
                    <SelectItem value="Inactive">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{partner ? 'Save Changes' : 'Onboard Partner'}</Button>
        </div>
      </form>
    </Form>
  );
}
