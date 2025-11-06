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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const pricingRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Rule name must be at least 5 characters.'),
  conditions: z.string().min(10, 'Conditions must be at least 10 characters.'),
  action: z.string().min(3, 'Action is required.'),
  status: z.enum(['Active', 'Inactive', 'Test']),
});

export type PricingRule = z.infer<typeof pricingRuleSchema>;

interface PricingRuleFormProps {
  rule: PricingRule | null;
  onSubmit: (data: PricingRule) => void;
  onCancel: () => void;
}

export function PricingRuleForm({ rule, onSubmit, onCancel }: PricingRuleFormProps) {
  const form = useForm<PricingRule>({
    resolver: zodResolver(pricingRuleSchema),
    defaultValues: rule || {
      name: '',
      conditions: '',
      action: '',
      status: 'Test',
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
                <Input placeholder="e.g., Weekend Surge - NYC/LAX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="conditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conditions</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Route: NYC-LAX, Day: Fri-Sun, Load Factor > 85%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <FormControl>
                <Input placeholder="e.g., +15% on Economy" {...field} />
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
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Test">Test</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
