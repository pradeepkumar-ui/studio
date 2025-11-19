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

const loyaltyOrderSchema = z.object({
  id: z.string().optional(),
  memberId: z.string().min(3, 'Member ID is required.'),
  type: z.enum(['Award', 'Upgrade', 'Ancillary']),
  pointsUsed: z.coerce.number().min(1, 'Points used must be greater than 0.'),
  cashPortion: z.coerce.number().min(0, 'Cash portion cannot be negative.'),
  status: z.enum(['Confirmed', 'Pending', 'Reversed']).optional(),
  date: z.string().optional(),
});

export type LoyaltyOrder = z.infer<typeof loyaltyOrderSchema>;

interface LoyaltyOrderFormProps {
  order: LoyaltyOrder | null;
  onSubmit: (data: LoyaltyOrder) => void;
  onCancel: () => void;
}

export function LoyaltyOrderForm({ order, onSubmit, onCancel }: LoyaltyOrderFormProps) {
  const form = useForm<LoyaltyOrder>({
    resolver: zodResolver(loyaltyOrderSchema),
    defaultValues: order || {
      memberId: '',
      type: 'Award',
      pointsUsed: 0,
      cashPortion: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="memberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., FFP_12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  <SelectItem value="Award">Award Ticket</SelectItem>
                  <SelectItem value="Upgrade">Upgrade</SelectItem>
                  <SelectItem value="Ancillary">Ancillary</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="pointsUsed"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Points Used</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 55000" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="cashPortion"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cash Co-pay (USD)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 45.50" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{order ? 'Save Changes' : 'Create Order'}</Button>
        </div>
      </form>
    </Form>
  );
}
