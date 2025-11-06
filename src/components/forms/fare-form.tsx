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
import { DollarSign } from 'lucide-react';

const fareSchema = z.object({
  id: z.string().optional(),
  route: z
    .string()
    .min(3, 'Route is required')
    .regex(/^[A-Z]{3}-[A-Z]{3}$/, 'Route must be in XXX-YYY format'),
  class: z.string().min(1, 'Class is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  status: z.enum(['Active', 'Inactive', 'Draft']),
  version: z.number().optional(),
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
    defaultValues: fare || {
      route: '',
      class: '',
      price: 0,
      currency: 'USD',
      status: 'Draft',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="route"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Route</FormLabel>
              <FormControl>
                <Input placeholder="e.g., NYC-LAX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="class"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a fare class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Economy">Economy</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="First">First</SelectItem>
                </SelectContent>
              </Select>
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
                <FormLabel>Price</FormLabel>
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