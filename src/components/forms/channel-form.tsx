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

const channelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Channel name must be at least 3 characters.'),
  status: z.enum(['Active', 'Inactive']),
  fareBrand: z.string().min(3, 'Default fare brand must be at least 3 characters.'),
  campaigns: z.number().optional(),
});

export type Channel = z.infer<typeof channelSchema>;

interface ChannelFormProps {
  channel: Channel | null;
  onSubmit: (data: Channel) => void;
  onCancel: () => void;
}

export function ChannelForm({ channel, onSubmit, onCancel }: ChannelFormProps) {
  const form = useForm<Channel>({
    resolver: zodResolver(channelSchema),
    defaultValues: channel || {
      name: '',
      status: 'Active',
      fareBrand: 'All Brands',
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
              <FormLabel>Channel Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Airline Website" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fareBrand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Fare Brand</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Public Fares, All Brands" {...field} />
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
          <Button type="submit">{channel ? 'Save Changes' : 'Create Channel'}</Button>
        </div>
      </form>
    </Form>
  );
}
