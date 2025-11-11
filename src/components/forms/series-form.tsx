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

const seriesSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Series name must be at least 5 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

export type Series = z.infer<typeof seriesSchema>;

interface SeriesFormProps {
  series: Series | null;
  onSubmit: (data: Series) => void;
  onCancel: () => void;
}

export function SeriesForm({ series, onSubmit, onCancel }: SeriesFormProps) {
  const form = useForm<Series>({
    resolver: zodResolver(seriesSchema),
    defaultValues: series || {
      name: '',
      description: '',
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
              <FormLabel>Series Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Tour Operator A" {...field} />
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
                <Textarea placeholder="e.g., Winter 2025 Block for LHR-DXB" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
            </Button>
            <Button type="submit">{series ? 'Save Changes' : 'Create Series'}</Button>
        </div>
      </form>
    </Form>
  );
}
