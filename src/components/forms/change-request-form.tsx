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
import { Textarea } from '../ui/textarea';

const changeRequestSchema = z.object({
  id: z.string().optional(),
  module: z.string().min(3, 'Module is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  requestedBy: z.string().email('Must be a valid email.'),
  status: z.enum(['Draft', 'Under Review', 'Approved', 'Published', 'Rolled Back']).default('Draft'),
  notes: z.string().optional(),
});

export type ChangeRequest = z.infer<typeof changeRequestSchema>;

interface ChangeRequestFormProps {
  onSubmit: (data: ChangeRequest) => void;
  onCancel: () => void;
  changeRequest?: ChangeRequest | null;
}

const modules = [
    'Seat Services', 
    'Ancillary Catalogue', 
    'Loyalty Awards', 
    'Dynamic Pricing', 
    'Fare Products',
    'Offers',
    'Bundles',
    'Compliance',
    'Other'
];

export function ChangeRequestForm({ onSubmit, onCancel, changeRequest }: ChangeRequestFormProps) {
  const form = useForm<ChangeRequest>({
    resolver: zodResolver(changeRequestSchema),
    defaultValues: changeRequest || {
      module: 'Offers',
      description: '',
      requestedBy: '',
      status: 'Draft',
      notes: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="module"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
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
                <Input placeholder="e.g., New pricing for exit-row seats" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requestedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requested By (Email)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., revenue.manager@airline.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any relevant notes or justification for this change."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Submit Request</Button>
        </div>
      </form>
    </Form>
  );
}
