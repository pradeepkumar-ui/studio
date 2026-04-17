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

const partnerOnboardingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Partner name is required.'),
  airportCode: z.string().length(3, 'Airport code (IATA) is required.').toUpperCase(),
  category: z.enum(['F&B', 'Retail', 'Services', 'Transport']),
  status: z.enum(['Active', 'Inactive']),
  contactEmail: z.string().email('Valid contact email is required.'),
});

export type PartnerOnboarding = z.infer<typeof partnerOnboardingSchema>;

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
      category: 'Retail',
      status: 'Active',
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
              <FormLabel>Vendor Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., SkyCafe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="airportCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Airport Node</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., LHR" maxLength={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Partner Contact Email</FormLabel>
              <FormControl>
                <Input placeholder="contact@vendor.com" {...field} />
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
          <Button type="submit">{partner ? 'Save Changes' : 'Onboard Partner'}</Button>
        </div>
      </form>
    </Form>
  );
}
