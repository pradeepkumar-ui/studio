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

const earningRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Rule name is required.'),
  rate: z.string().min(3, 'Earning rate is required.'),
  applicableTo: z.string().min(3, 'Applicable scope is required.'),
  tierBonus: z.string().min(3, 'Tier bonus is required.'),
});

export type EarningRule = z.infer<typeof earningRuleSchema>;

interface EarningRuleFormProps {
  rule: EarningRule | null;
  onSubmit: (data: EarningRule) => void;
  onCancel: () => void;
}

export function EarningRuleForm({ rule, onSubmit, onCancel }: EarningRuleFormProps) {
  const form = useForm<EarningRule>({
    resolver: zodResolver(earningRuleSchema),
    defaultValues: rule || {
      name: '',
      rate: '',
      applicableTo: 'All Fares',
      tierBonus: 'N/A',
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
              <FormLabel>Rule Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Standard Earning" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Earning Rate</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 5 points / USD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicableTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applicable To</FormLabel>
              <FormControl>
                <Input placeholder="e.g., All Economy Fares" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tierBonus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tier Bonus</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Gold: +50%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{rule ? 'Save Changes' : 'Create Rule'}</Button>
        </div>
      </form>
    </Form>
  );
}
