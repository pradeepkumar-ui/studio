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

const bookingClassSchema = z.object({
  code: z.string().length(1, 'Code must be a single letter.').regex(/^[A-Z]$/, 'Code must be an uppercase letter.'),
  cabin: z.enum(['First', 'Business', 'Premium Economy', 'Economy']),
  description: z.string().min(3, 'Description is required.'),
  status: z.enum(['Active', 'Inactive']),
});

export type BookingClass = z.infer<typeof bookingClassSchema>;

interface BookingClassFormProps {
  bookingClass: BookingClass | null;
  onSubmit: (data: BookingClass) => void;
  onCancel: () => void;
}

export function BookingClassForm({ bookingClass, onSubmit, onCancel }: BookingClassFormProps) {
  const form = useForm<BookingClass>({
    resolver: zodResolver(bookingClassSchema),
    defaultValues: bookingClass || {
      code: '',
      cabin: 'Economy',
      description: '',
      status: 'Active',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Booking Class Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Y" {...field} maxLength={1} disabled={!!bookingClass}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Full Fare Economy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cabin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cabin</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cabin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Economy">Economy</SelectItem>
                  <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="First">First</SelectItem>
                </SelectContent>
              </Select>
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
            <Button type="submit">{bookingClass ? 'Save Changes' : 'Create Class'}</Button>
        </div>
      </form>
    </Form>
  );
}
