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

const loyaltyTierSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Tier name is required.'),
  qualification: z.string().min(3, 'Qualification rule is required.'),
  benefits: z.string().min(3, 'Benefits description is required.'),
});

export type LoyaltyTier = z.infer<typeof loyaltyTierSchema>;

interface LoyaltyTierFormProps {
  tier: LoyaltyTier | null;
  onSubmit: (data: LoyaltyTier) => void;
  onCancel: () => void;
}

export function LoyaltyTierForm({ tier, onSubmit, onCancel }: LoyaltyTierFormProps) {
  const form = useForm<LoyaltyTier>({
    resolver: zodResolver(loyaltyTierSchema),
    defaultValues: tier || {
      name: '',
      qualification: '',
      benefits: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tier Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Gold" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="qualification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualification</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 25,000+ miles" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="benefits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Benefits</FormLabel>
              <FormControl>
                <Input placeholder="e.g., +50% bonus points, Lounge access" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{tier ? 'Save Changes' : 'Create Tier'}</Button>
        </div>
      </form>
    </Form>
  );
}
