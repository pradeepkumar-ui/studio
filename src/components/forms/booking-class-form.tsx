
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '../ui/separator';

const bookingClassSchema = z.object({
  code: z.string().length(1, 'Code must be a single letter.').regex(/^[A-Z]$/, 'Code must be an uppercase letter.'),
  cabin: z.enum(['First', 'Business', 'Premium Economy', 'Economy']),
  description: z.string().min(3, 'Description is required.'),
  status: z.enum(['Active', 'Inactive']),
  overbookingCap: z.coerce.number().min(0).max(50),
  waitlist: z.boolean().default(true),
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
      overbookingCap: 0,
      waitlist: true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
                <FormItem>
                <FormLabel>RBD Code</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Y" {...field} maxLength={1} disabled={!!bookingClass}/>
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
                <FormLabel>Cabin Assignment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select cabin" />
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operational Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Full Fare Economy - Managed by Host PSS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />
        <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Retailing Integrity Controls</h4>
        
        <div className="grid grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="overbookingCap"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Overbooking Limit (Seats)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Additional seats retailable beyond physical capacity.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="waitlist"
                render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
                    <FormControl>
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                    <FormLabel>Permit Waitlist Retailing</FormLabel>
                    <FormDescription>Allow offers for this class when inventory is L (0).</FormDescription>
                    </div>
                </FormItem>
                )}
            />
        </div>

        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{bookingClass ? 'Update RBD' : 'Commit to PSS'}</Button>
        </div>
      </form>
    </Form>
  );
}
