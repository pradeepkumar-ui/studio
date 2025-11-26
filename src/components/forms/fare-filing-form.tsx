
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Checkbox } from 'lucide-react';
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
import type { Fare } from './fare-form';
import { MultiSelect } from '../ui/multi-select';

const fareFilingSchema = z.object({
  id: z.string().optional(),
  fareId: z.string({ required_error: "Please select a base fare." }),
  fareIdentifier: z.string().optional(),
  channel: z.string().min(1, "Channel is required."),
  pointOfSale: z.array(z.string()).optional(),
  travelDate: z.object({ from: z.date().optional(), to: z.date().optional() }).optional(),
  bookingDate: z.object({ from: z.date().optional(), to: z.date().optional() }).optional(),
  status: z.enum(['Active', 'Inactive', 'Draft']),
});

export type FareFiling = z.infer<typeof fareFilingSchema>;

interface FareFilingFormProps {
  filing: Partial<FareFiling> | null;
  fares: Fare[];
  onSubmit: (data: FareFiling) => void;
  onCancel: () => void;
}

const posOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IN', label: 'India' },
    { value: 'SG', label: 'Singapore' },
    { value: 'AU', label: 'Australia' },
    { value: 'ALL', label: 'All' },
];

export function FareFilingForm({ filing, fares, onSubmit, onCancel }: FareFilingFormProps) {
  const form = useForm<FareFiling>({
    resolver: zodResolver(fareFilingSchema),
    defaultValues: filing ? {
        ...filing,
        travelDate: filing.travelDate ? { from: new Date(filing.travelDate.from!), to: new Date(filing.travelDate.to!) } : {},
        bookingDate: filing.bookingDate ? { from: new Date(filing.bookingDate.from!), to: new Date(filing.bookingDate.to!) } : {},
    } : {
      fareId: '',
      channel: 'ALL',
      pointOfSale: ['ALL'],
      travelDate: {},
      bookingDate: {},
      status: 'Draft',
    },
  });

  const handleFormSubmit = (data: FareFiling) => {
    const selectedFare = fares.find(p => p.id === data.fareId);
    onSubmit({
      ...data,
      fareIdentifier: `${selectedFare?.fareBasisCode} (${selectedFare?.route})` || 'N/A',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="fareId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Fare</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a base fare to file" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fares.map(fare => (
                    <SelectItem key={fare.id} value={fare.id!}>
                      {fare.fareBasisCode} ({fare.route}) - ${fare.price}
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
            <FormField
                control={form.control}
                name="pointOfSale"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Point of Sale</FormLabel>
                    <MultiSelect options={posOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select points of sale..."/>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
         <div>
            <FormLabel>Travel Dates (Optional)</FormLabel>
            <div className="mt-2">
                <FormField control={form.control} name="travelDate" render={({ field }) => (
                    <FormItem>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value?.from && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value?.from ? (field.value.to ? <>{format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}</> : format(field.value.from, "LLL dd, y")) : <span>Pick a date range</span>}</Button></FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar initialFocus mode="range" defaultMonth={field.value?.from} selected={field.value as any} onSelect={field.onChange} numberOfMonths={2} /></PopoverContent>
                        </Popover>
                    </FormItem>
                )} />
            </div>
        </div>
         <div>
            <FormLabel>Booking Dates (Optional)</FormLabel>
            <div className="mt-2">
                <FormField control={form.control} name="bookingDate" render={({ field }) => (
                    <FormItem>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value?.from && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value?.from ? (field.value.to ? <>{format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}</> : format(field.value.from, "LLL dd, y")) : <span>Pick a date range</span>}</Button></FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar initialFocus mode="range" defaultMonth={field.value?.from} selected={field.value as any} onSelect={field.onChange} numberOfMonths={2} /></PopoverContent>
                        </Popover>
                    </FormItem>
                )} />
            </div>
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
