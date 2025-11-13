'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
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
import { Timestamp } from 'firebase/firestore';
import { Textarea } from '../ui/textarea';

const offerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Offer name is required and must be at least 5 characters.'),
  scope: z.enum(['Airline', 'Brand', 'Market', 'Channel']),
  offerType: z.enum(['Discount', 'Fixed', 'Step']),
  currency: z.string().length(3, 'Must be a 3-letter currency code.'),
  rounding: z.enum(['None', 'Round Half-Up', 'Round Down']),
  criteria: z.string(),
  cohorts: z.array(z.object({ value: z.string() })).optional(),
  effectiveDate: z.union([z.instanceof(Date), z.instanceof(Timestamp)]),
  expiryDate: z.union([z.instanceof(Date), z.instanceof(Timestamp)]),
  notes: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Draft', 'Expired']),
  version: z.number().optional(),
  ttl: z.string().optional(),
});

export type Offer = z.infer<typeof offerSchema>;

interface OfferFormProps {
  offer: Offer | null;
  onSubmit: (data: Offer) => void;
  onCancel: () => void;
}

const toDate = (date: Date | Timestamp | undefined): Date => {
    if (!date) return new Date();
    if (date instanceof Timestamp) return date.toDate();
    return date;
}

const parseStringToArray = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) return value.map(v => ({ value: v }));
    if (typeof value === 'string' && value.length > 0) return value.split(',').map(v => ({ value: v.trim() }));
    return [];
}


export function OfferForm({ offer, onSubmit, onCancel }: OfferFormProps) {
  const form = useForm<Offer>({
    resolver: zodResolver(offerSchema),
    defaultValues: offer ? {
      ...offer,
      effectiveDate: toDate(offer.effectiveDate),
      expiryDate: toDate(offer.expiryDate),
      cohorts: parseStringToArray(offer.cohorts as any),
    } : {
      name: '',
      scope: 'Market',
      offerType: 'Discount',
      currency: 'USD',
      rounding: 'Round Half-Up',
      criteria: 'Market: US, EU',
      cohorts: [],
      effectiveDate: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      notes: '',
      status: 'Draft',
    },
  });

  const { fields: cohortFields, append: appendCohort, remove: removeCohort } = useFieldArray({ control: form.control, name: "cohorts" });

  const handleFinalSubmit = (data: Offer) => {
    const finalData = {
      ...data,
      cohorts: data.cohorts?.map(c => c.value).filter(Boolean) as string[],
    };
    onSubmit(finalData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Winter Flash Sale 2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="scope"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scope</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a scope" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Airline">Airline</SelectItem>
                    <SelectItem value="Brand">Brand</SelectItem>
                    <SelectItem value="Market">Market</SelectItem>
                    <SelectItem value="Channel">Channel</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="offerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offer Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an offer type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Discount">Discount (%)</SelectItem>
                    <SelectItem value="Fixed">Fixed Amount</SelectItem>
                    <SelectItem value="Step">Stepped Pricing</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Input placeholder="USD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="rounding"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rounding</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a rounding rule" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Round Half-Up">Round Half-Up</SelectItem>
                    <SelectItem value="Round Down">Round Down</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <FormField
          control={form.control}
          name="criteria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Criteria</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Market: US, EU" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
            <FormLabel>Target Cohorts (Optional)</FormLabel>
            {cohortFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                    <FormField control={form.control} name={`cohorts.${index}.value`} render={({field}) => <Input {...field} placeholder="e.g., BusinessLoyal_IN" />} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeCohort(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendCohort({ value: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Cohort</Button>
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
                        {field.value ? format(toDate(field.value), 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={toDate(field.value)} onSelect={field.onChange} initialFocus />
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
                        {field.value ? format(toDate(field.value), 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={toDate(field.value)} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Internal notes about this offer configuration." {...field} value={field.value ?? ''} />
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
