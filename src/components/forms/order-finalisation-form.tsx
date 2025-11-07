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
import { Textarea } from '../ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { CheckCircle2 } from 'lucide-react';

const finaliseOrderSchema = z.object({
  orderId: z.string(),
  approvalComments: z.string().optional(),
});

export type FinaliseOrder = z.infer<typeof finaliseOrderSchema>;

interface OrderFinalisationFormProps {
  order: { orderId: string; payment: boolean; inventory: boolean; services: boolean; } | null;
  onSubmit: (data: FinaliseOrder) => void;
  onCancel: () => void;
}

export function OrderFinalisationForm({ order, onSubmit, onCancel }: OrderFinalisationFormProps) {
  const form = useForm<FinaliseOrder>({
    resolver: zodResolver(finaliseOrderSchema),
    defaultValues: {
      orderId: order?.orderId || '',
      approvalComments: '',
    },
  });

  if (!order) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Validation Summary</AlertTitle>
            <AlertDescription>
                <ul className="list-disc list-inside mt-2 text-sm">
                    <li className={order.payment ? 'text-green-600' : 'text-yellow-600'}>Payment Status: {order.payment ? 'Settled' : 'Pending'}</li>
                    <li className={order.inventory ? 'text-green-600' : 'text-yellow-600'}>Inventory Status: {order.inventory ? 'Confirmed' : 'Pending'}</li>
                    <li className={order.services ? 'text-green-600' : 'text-yellow-600'}>Services Status: {order.services ? 'Confirmed' : 'Pending'}</li>
                </ul>
            </AlertDescription>
        </Alert>

        <FormField
            control={form.control}
            name="orderId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Order ID</FormLabel>
                <FormControl>
                    <Input {...field} disabled />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="approvalComments"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Approval Comments (Optional)</FormLabel>
                <FormControl>
                    <Textarea placeholder="e.g., Finance verified – OK to close." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!order.payment || !order.inventory || !order.services}>Finalise Order</Button>
        </div>
      </form>
    </Form>
  );
}
