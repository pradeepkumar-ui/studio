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

const ancillaryCategories = ['Baggage', 'Seat', 'On-board', 'Flexibility'] as const;

const ancillarySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Ancillary name is required.'),
  category: z.enum(ancillaryCategories),
  defaultPrice: z.coerce.number().min(0, 'Price must be a positive number.'),
  currency: z.string().length(3, 'Currency must be a 3-letter code.'),
  status: z.enum(['Active', 'Disabled']),
});

export type Ancillary = z.infer<typeof ancillarySchema>;

interface AncillaryFormProps {
  ancillary: Ancillary | null;
  onSubmit: (data: Ancillary) => void;
  onCancel: () => void;
}

export function AncillaryForm({ ancillary, onSubmit, onCancel }: AncillaryFormProps) {
  const form = useForm<Ancillary>({
    resolver: zodResolver(ancillarySchema),
    defaultValues: ancillary || {
      name: '',
      category: 'Baggage',
      defaultPrice: 0,
      currency: 'USD',
      status: 'Active',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ancillary Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1st Checked Bag (23kg)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ancillaryCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
            <FormField
            control={form.control}
            name="defaultPrice"
            render={({ field }) => (
                <FormItem className="flex-1">
                <FormLabel>Default Price</FormLabel>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                        <Input type="number" placeholder="e.g., 35" {...field} className="pl-9" />
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
                  <SelectItem value="Disabled">Disabled</SelectItem>
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
            <Button type="submit">{ancillary ? 'Save Changes' : 'Create Ancillary'}</Button>
        </div>
      </form>
    </Form>
  );
}
