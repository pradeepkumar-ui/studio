
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MultiSelect } from '../ui/multi-select';
import type { Promotion } from './promotion-form';

const userPromotionMappingSchema = z.object({
  id: z.string().optional(),
  userId: z.string({ required_error: "Please select a user."}),
  promotionIds: z.array(z.string()).min(1, "Please select at least one promotion."),
  lastUpdated: z.string().optional(),
});

export type UserPromotionMapping = z.infer<typeof userPromotionMappingSchema>;

interface PromotionAssignmentFormProps {
  mapping: UserPromotionMapping | null;
  users: Array<{ id: string, name: string, email: string }>;
  promotions: Promotion[];
  onSubmit: (data: Omit<UserPromotionMapping, 'id' | 'lastUpdated'>) => void;
  onCancel: () => void;
}

export function PromotionAssignmentForm({ mapping, users, promotions, onSubmit, onCancel }: PromotionAssignmentFormProps) {
  const form = useForm<UserPromotionMapping>({
    resolver: zodResolver(userPromotionMappingSchema),
    defaultValues: mapping || {
      userId: '',
      promotionIds: [],
    },
  });

  const promotionOptions = promotions.map(p => ({ value: p.id!, label: p.name }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!mapping}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user to assign promotions" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="promotionIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Promotions</FormLabel>
              <MultiSelect
                options={promotionOptions}
                selected={field.value}
                onChange={field.onChange}
                placeholder="Select promotions..."
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{mapping ? 'Update Mapping' : 'Assign Promotions'}</Button>
        </div>
      </form>
    </Form>
  );
}
