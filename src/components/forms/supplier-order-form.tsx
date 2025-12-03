
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

const supplierOrderSchema = z.object({
  supplierName: z.string().min(3, 'Supplier name is required.'),
  offerId: z.string().min(3, 'Supplier Offer ID is required.'),
  masterOrderId: z.string().min(3, 'Master Order ID is required.'),
  passengerName: z.string().min(3, 'Passenger Name is required.'),
  serviceType: z.enum(['Hotel', 'Transfer', 'Insurance', 'Tour']),
  paymentReference: z.string().min(3, 'Payment reference is required.'),
  notes: z.string().optional(),
});

export type SupplierOrder = z.infer<typeof supplierOrderSchema>;

interface SupplierOrderFormProps {
  onSubmit: (data: SupplierOrder) => void;
  onCancel: () => void;
}

export function SupplierOrderForm({ onSubmit, onCancel }: SupplierOrderFormProps) {
  const form = useForm<SupplierOrder>({
    resolver: zodResolver(supplierOrderSchema),
    defaultValues: {
      supplierName: 'ABC Hotels',
      offerId: '',
      masterOrderId: '',
      passengerName: '',
      serviceType: 'Hotel',
      paymentReference: '',
      notes: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
            control={form.control}
            name="supplierName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Supplier Name</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a supplier" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="ABC Hotels">ABC Hotels</SelectItem>
                        <SelectItem value="City Transfers">City Transfers</SelectItem>
                        <SelectItem value="Global Insurance">Global Insurance</SelectItem>
                        <SelectItem value="Tour Group Inc.">Tour Group Inc.</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="offerId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Supplier Offer ID</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., SUPP_OFF_9012" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="masterOrderId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Master Order ID</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., ORD_91235" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
         <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="passengerName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Passenger Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="paymentReference"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Payment Reference</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., PAY_8843" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a service type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Hotel">Hotel</SelectItem>
                        <SelectItem value="Transfer">Transfer</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                        <SelectItem value="Tour">Tour</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                    <Textarea placeholder="e.g., Manual confirmation required from supplier." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Supplier Order</Button>
        </div>
      </form>
    </Form>
  );
}
