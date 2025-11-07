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

const fareBrandMappingSchema = z.object({
  id: z.string().optional(),
  brandName: z.string().min(3, 'Brand Name is required.'),
  mappedClasses: z.string().min(1, 'At least one booking class is required.'),
  channel: z.string().min(3, 'Channel is required'),
});

export type FareBrandMap = z.infer<typeof fareBrandMappingSchema>;

interface FareBrandMappingFormProps {
  mapping: FareBrandMap | null;
  onSubmit: (data: FareBrandMap) => void;
  onCancel: () => void;
}

export function FareBrandMappingForm({ mapping, onSubmit, onCancel }: FareBrandMappingFormProps) {
  const form = useForm<FareBrandMap>({
    resolver: zodResolver(fareBrandMappingSchema),
    defaultValues: mapping || {
      brandName: '',
      mappedClasses: '',
      channel: 'All',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="brandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fare Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Economy Saver" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mappedClasses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mapped Booking Classes (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Y,B,M" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel</FormLabel>
              <FormControl>
                <Input placeholder="e.g., All, Website, GDS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
            </Button>
            <Button type="submit">{mapping ? 'Save Changes' : 'Create Mapping'}</Button>
        </div>
      </form>
    </Form>
  );
}
