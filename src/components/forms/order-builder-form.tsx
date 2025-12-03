
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
import { Checkbox } from '../ui/checkbox';
import { MultiSelect } from '../ui/multi-select';

const manualOrderSchema = z.object({
  offerId: z.string().min(3, 'Offer ID is required.'),
  passengerName: z.string().min(3, 'Passenger Name is required.'),
  channel: z.enum(['Web', 'API', 'Agent', 'GDS', 'TMC']),
  paymentReference: z.string().min(3, 'Payment reference is required.'),
  fareClass: z.enum(['Y', 'J', 'F', 'W']),
  ancillaries: z.array(z.string()).optional(),
  autoValidate: z.boolean().default(true),
  notes: z.string().optional(),
});

export type ManualOrder = z.infer<typeof manualOrderSchema>;

interface OrderBuilderFormProps {
  onSubmit: (data: ManualOrder) => void;
  onCancel: () => void;
}

const ancillaryOptions = [
    { value: 'seat', label: 'Seat' },
    { value: 'meal', label: 'Meal' },
    { value: 'bag', label: 'Baggage' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'wifi', label: 'Wi-Fi' },
    { value: 'lounge', label: 'Lounge Access' },
]

export function OrderBuilderForm({ onSubmit, onCancel }: OrderBuilderFormProps) {
  const form = useForm<ManualOrder>({
    resolver: zodResolver(manualOrderSchema),
    defaultValues: {
      offerId: '',
      passengerName: '',
      channel: 'Agent',
      paymentReference: '',
      fareClass: 'Y',
      ancillaries: [],
      autoValidate: true,
      notes: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="offerId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Offer ID</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., OFF_9821" {...field} />
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
                        <Input placeholder="e.g., PAY_4552" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
            control={form.control}
            name="passengerName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Passenger Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Channel</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a channel" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                    <SelectItem value="Agent">Agent Portal</SelectItem>
                    <SelectItem value="GDS">GDS</SelectItem>
                    <SelectItem value="TMC">TMC</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="fareClass"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Fare Class</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a fare class" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Y">Y (Economy)</SelectItem>
                    <SelectItem value="W">W (Premium Economy)</SelectItem>
                    <SelectItem value="J">J (Business)</SelectItem>
                    <SelectItem value="F">F (First)</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
         <FormField
            control={form.control}
            name="ancillaries"
            render={({ field }) => (
                <FormItem>
                    <div className="mb-2">
                        <FormLabel>Ancillaries</FormLabel>
                    </div>
                     <MultiSelect 
                        options={ancillaryOptions}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder="Select ancillaries..."
                     />
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                    <Textarea placeholder="e.g., Corporate traveller – approval verified." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="autoValidate"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Auto-validate policy and inventory
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Order</Button>
        </div>
      </form>
    </Form>
  );
}
