'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';

const promotionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Promotion name is required and must be at least 5 characters.'),
  description: z.string().min(10, 'A brief description is required.'),
  prefix: z.string().min(3, 'A code prefix is required.').max(10, 'Prefix cannot exceed 10 characters.'),
  poolSize: z.coerce.number().min(1, 'Pool size must be at least 1.'),
  usageType: z.enum(['single', 'multi', 'unlimited']),
  expiryDate: z.union([z.instanceof(Date), z.instanceof(Timestamp)]),
  status: z.enum(['Active', 'Draft', 'Expired']),
});

export type Promotion = z.infer<typeof promotionSchema>;

interface PromotionFormProps {
  promotion: Promotion | null;
  onSubmit: (data: Promotion) => void;
  onCancel: () => void;
}

export function PromotionForm({ promotion, onSubmit, onCancel }: PromotionFormProps) {
  const form = useForm<Promotion>({
    resolver: zodResolver(promotionSchema),
    defaultValues: promotion ? {
      ...promotion,
      expiryDate: promotion.expiryDate ? (promotion.expiryDate as Timestamp).toDate() : new Date(),
    } : {
      name: '',
      description: '',
      prefix: '',
      poolSize: 1000,
      usageType: 'multi',
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      status: 'Draft',
    },
  });

  const formatDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'PPP');
    }
    return format(date, 'PPP');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Promotion Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Weekend Special" {...field} />
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
                <Textarea placeholder="Describe the promotion and its purpose." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code Prefix</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., WEEKEND15" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="poolSize"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Pool Size</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
           />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="usageType"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Usage Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a usage type" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="single">Single Use</SelectItem>
                        <SelectItem value="multi">Multi-Use</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? formatDate(field.value) : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value instanceof Timestamp ? field.value.toDate() : field.value} onSelect={field.onChange} initialFocus />
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
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
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
          <Button type="submit">{promotion ? 'Save Changes' : 'Create Promotion'}</Button>
        </div>
      </form>
    </Form>
  );
}
