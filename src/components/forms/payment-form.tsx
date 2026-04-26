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
import { Textarea } from '../ui/textarea';

const paymentSchema = z.object({
  id: z.string().optional(),
  orderId: z.string().min(3, 'Order ID is required.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  currency: z.string().length(3, 'Must be a 3-letter currency code.'),
  method: z.enum(['Card', 'Wallet', 'Loyalty', 'UPI', 'BNPL']),
  psp: z.enum(['Worldpay', 'Stripe', 'Adyen', 'PayPal']),
  status: z.enum(['Pending', 'Authorized', 'Captured', 'Failed', 'Refunded', 'Settled']),
  remarks: z.string().optional(),
  timestamp: z.string().optional(),
});

export type Payment = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  payment: Payment | null;
  onSubmit: (data: Payment) => void;
  onCancel: () => void;
}

export function PaymentForm({ payment, onSubmit, onCancel }: PaymentFormProps) {
  const form = useForm<Payment>({
    resolver: zodResolver(paymentSchema),
    defaultValues: payment || {
      orderId: '',
      amount: 0,
      currency: 'INR',
      method: 'Card',
      psp: 'Stripe',
      status: 'Captured',
      remarks: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="orderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ORD_88213" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 320.50" {...field} />
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
                  <Input placeholder="e.g., GBP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a method" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Wallet">Wallet</SelectItem>
                        <SelectItem value="Loyalty">Loyalty</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="BNPL">BNPL</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="psp"
            render={({ field }) => (
                <FormItem>
                <FormLabel>PSP</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a PSP" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Stripe">Stripe</SelectItem>
                        <SelectItem value="Adyen">Adyen</SelectItem>
                        <SelectItem value="Worldpay">Worldpay</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Remarks (Optional)</FormLabel>
                <FormControl>
                    <Textarea placeholder="e.g., Manually captured via Stripe dashboard" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{payment ? 'Save Changes' : 'Capture Payment'}</Button>
        </div>
      </form>
    </Form>
  );
}
