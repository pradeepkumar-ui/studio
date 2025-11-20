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
import { DollarSign, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const fareSchema = z.object({
  id: z.string().optional(),
  fareBasisCode: z.string().min(1, 'Fare Basis Code is required.'),
  rbd: z.string().length(1, 'RBD must be a single uppercase letter.').regex(/^[A-Z]$/),
  route: z
    .string()
    .min(7, 'Route must be in XXX-YYY format.')
    .max(7, 'Route must be in XXX-YYY format.')
    .regex(/^[A-Z]{3}-[A-Z]{3}$/, 'Route must be in XXX-YYY format'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  validity: z.object({
      effectiveDate: z.date(),
      expiryDate: z.date(),
  }),
  status: z.enum(['Active', 'Inactive', 'Draft']),
  version: z.number().optional(),
  class: z.string().optional(), // No longer primary input
});

export type Fare = z.infer<typeof fareSchema>;

interface FareFormProps {
  fare: Fare | null;
  onSubmit: (data: Fare) => void;
  onCancel: () => void;
}

export function FareForm({ fare, onSubmit, onCancel }: FareFormProps) {
  const form = useForm<Fare>({
    resolver: zodResolver(fareSchema),
    defaultValues: fare ? {
      ...fare,
      validity: {
        effectiveDate: fare.validity?.effectiveDate || new Date(),
        expiryDate: fare.validity?.expiryDate || new Date(new Date().setDate(new Date().getDate() + 30)),
      }
    } : {
      fareBasisCode: '',
      rbd: 'Y',
      route: '',
      price: 0,
      currency: 'USD',
      validity: {
        effectiveDate: new Date(),
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
      status: 'Draft',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="fareBasisCode"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fare Basis Code (FBC)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., YFLEX" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="rbd"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Booking Class (RBD)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Y" {...field} maxLength={1} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
          control={form.control}
          name="route"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Route</FormLabel>
              <FormControl>
                <Input placeholder="e.g., JFK-LAX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem className="flex-1">
                <FormLabel>Base Price</FormLabel>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                        <Input type="number" placeholder="e.g., 350" {...field} className="pl-9" />
                    </FormControl>
                </div>
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
                    <Input placeholder="USD" {...field} className="w-24" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
         <div className="grid grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="validity.effectiveDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Effective Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="validity.expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
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
                  <SelectItem value="Draft">Draft</SelectItem>
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
            <Button type="submit">{fare ? 'Save Changes' : 'Create Fare'}</Button>
        </div>
      </form>
    </Form>
  );
}
