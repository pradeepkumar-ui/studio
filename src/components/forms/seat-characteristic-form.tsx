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

const seatCharacteristicSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(3, 'Type name is required.'),
  defaultPrice: z.coerce.number().min(0, 'Price must be a non-negative number.'),
  currency: z.string().length(3, 'Must be a 3-letter currency code.'),
  attributes: z.string().min(3, 'At least one attribute is required.'),
  status: z.enum(['Active', 'Inactive']),
});

export type SeatCharacteristic = z.infer<typeof seatCharacteristicSchema>;

interface SeatCharacteristicFormProps {
  characteristic: SeatCharacteristic | null;
  onSubmit: (data: SeatCharacteristic) => void;
  onCancel: () => void;
}

export function SeatCharacteristicForm({ characteristic, onSubmit, onCancel }: SeatCharacteristicFormProps) {
  const form = useForm<SeatCharacteristic>({
    resolver: zodResolver(seatCharacteristicSchema),
    defaultValues: characteristic || {
      type: '',
      defaultPrice: 0,
      currency: 'INR',
      attributes: '',
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
              <FormLabel>Seat Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Extra Legroom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="defaultPrice"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Default Price</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 75" {...field} />
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
          name="attributes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attributes</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Forward Zone, Extra Space, Aisle" {...field} />
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
          <Button type="submit">{characteristic ? 'Save Changes' : 'Create'}</Button>
        </div>
      </form>
    </Form>
  );
}
