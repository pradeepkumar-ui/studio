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

const policyPackSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Pack name is required.'),
  status: z.enum(['Draft', 'Published', 'Archived']),
  ruleCount: z.number().optional(),
  createdBy: z.string().optional(),
  publishedAt: z.date().nullable().optional(),
});

export type PolicyPack = z.infer<typeof policyPackSchema>;

interface PolicyPackFormProps {
  pack: PolicyPack | null;
  onSubmit: (data: PolicyPack) => void;
  onCancel: () => void;
}

export function PolicyPackForm({ pack, onSubmit, onCancel }: PolicyPackFormProps) {
  const form = useForm<PolicyPack>({
    resolver: zodResolver(policyPackSchema),
    defaultValues: pack || {
      name: '',
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
              <FormLabel>Pack Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Policy Pack v20" {...field} />
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
                  <SelectItem value="Published">Published</SelectItem>
                   <SelectItem value="Archived">Archived</SelectItem>
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
          <Button type="submit">{pack ? 'Save Changes' : 'Create Pack'}</Button>
        </div>
      </form>
    </Form>
  );
}
