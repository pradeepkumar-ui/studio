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

const redemptionRuleSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['Award Ticket', 'Upgrade', 'Ancillary']),
  scope: z.string().min(5, 'Scope/description is required.'),
  pointsCost: z.coerce.number().min(1, 'Points cost is required.'),
  coPay: z.coerce.number().min(0, 'Co-pay must be a non-negative number.'),
  currency: z.string().length(3, 'Currency code is required.'),
  status: z.enum(['Active', 'Inactive']),
});

export type RedemptionRule = z.infer<typeof redemptionRuleSchema>;

interface RedemptionRuleFormProps {
  rule: RedemptionRule | null;
  onSubmit: (data: RedemptionRule) => void;
  onCancel: () => void;
}

export function RedemptionRuleForm({ rule, onSubmit, onCancel }: RedemptionRuleFormProps) {
  const form = useForm<RedemptionRule>({
    resolver: zodResolver(redemptionRuleSchema),
    defaultValues: rule || {
      type: 'Award Ticket',
      scope: '',
      pointsCost: 10000,
      coPay: 0,
      currency: 'USD',
      status: 'Active',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Redemption Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a redemption type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Award Ticket">Award Ticket</SelectItem>
                  <SelectItem value="Upgrade">Upgrade</SelectItem>
                  <SelectItem value="Ancillary">Ancillary</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scope / Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Domestic Economy (one-way)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pointsCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points Cost</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 15000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="coPay"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Co-pay</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 25" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., USD" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
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
