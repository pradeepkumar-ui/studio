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
import type { FareProduct } from './fare-product-form';

const fareFilingSchema = z.object({
  id: z.string().optional(),
  fareProductId: z.string({ required_error: "Please select a fare product." }),
  fareProductName: z.string().optional(),
  route: z.string().min(1, "Route is required."),
  channel: z.string().min(1, "Channel is required."),
  effectiveDate: z.date({ required_error: "Effective date is required." }),
  expiryDate: z.date({ required_error: "Expiry date is required." }),
  status: z.enum(['Active', 'Inactive', 'Draft']),
});

export type FareFiling = z.infer<typeof fareFilingSchema>;

interface FareFilingFormProps {
  filing: Partial<FareFiling> | null;
  fareProducts: FareProduct[];
  onSubmit: (data: FareFiling) => void;
  onCancel: () => void;
}

export function FareFilingForm({ filing, fareProducts, onSubmit, onCancel }: FareFilingFormProps) {
  const form = useForm<FareFiling>({
    resolver: zodResolver(fareFilingSchema),
    defaultValues: filing ? {
        ...filing,
        effectiveDate: filing.effectiveDate ? new Date(filing.effectiveDate) : new Date(),
        expiryDate: filing.expiryDate ? new Date(filing.expiryDate) : new Date(),
    } : {
      fareProductId: '',
      route: '',
      channel: 'ALL',
      effectiveDate: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      status: 'Draft',
    },
  });

  const handleFormSubmit = (data: FareFiling) => {
    const selectedProduct = fareProducts.find(p => p.id === data.fareProductId);
    onSubmit({
      ...data,
      fareProductName: selectedProduct?.name || 'N/A',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fareProductId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fare Product</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a fare product to file" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fareProducts.map(product => (
                    <SelectItem key={product.id} value={product.id!}>
                      {product.name} (v{product.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <h4 className="text-sm font-medium text-muted-foreground pt-2">Conditions</h4>
        <div className="grid grid-cols-2 gap-4">
           <FormField
              control={form.control}
              name="route"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., JFK-LAX or 'ALL'" {...field} />
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
                    <Input placeholder="e.g., Web, TMC, or 'ALL'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
         <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Effective Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
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
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
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
            <Button type="submit">{filing ? 'Save Changes' : 'Create Filing'}</Button>
        </div>
      </form>
    </Form>
  );
}
