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

const offerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Offer name is required and must be at least 5 characters.'),
  channel: z.string().min(1, 'Channel is required'),
  conditions: z.string().min(10, 'Conditions are required and must be at least 10 characters.'),
  status: z.enum(['Active', 'Inactive', 'Draft', 'Expired']),
});

export type Offer = z.infer<typeof offerSchema>;

interface OfferFormProps {
  offer: Offer | null;
  onSubmit: (data: Offer) => void;
  onCancel: () => void;
}

export function OfferForm({ offer, onSubmit, onCancel }: OfferFormProps) {
  const form = useForm<Offer>({
    resolver: zodResolver(offerSchema),
    defaultValues: offer || {
      name: '',
      channel: '',
      conditions: '',
      status: 'Draft',
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
              <FormLabel>Offer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Summer Getaway Sale" {...field} />
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
              <FormLabel>Channels</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Website, Mobile App" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="conditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conditions</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., 20% off Economy on NYC-MIA for travel in July." {...field} />
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
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
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
            <Button type="submit">{offer ? 'Save Changes' : 'Create Offer'}</Button>
        </div>
      </form>
    </Form>
  );
}
