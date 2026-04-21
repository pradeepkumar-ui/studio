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
  FormDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '../ui/separator';
import { Building2, MapPin, Briefcase, Calendar as CalendarIcon, Tag, ShieldCheck } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format, addYears } from 'date-fns';
import { cn } from '@/lib/utils';

const mainCategories = [
  'Lounge',
  'Priority service',
  'Meal',
  'Wi-Fi / connectivity',
  'Parking',
  'Ground Transport',
  'Inflight comfort',
  'Special service',
  'Flexibility / protection',
  'Bundle',
] as const;

const airportAncillarySchema = z.object({
  id: z.string().optional(),
  ancillaryCode: z.string().min(2, 'Code is required.').toUpperCase(),
  name: z.string().min(3, 'Name is required.'),
  shortName: z.string().min(2, 'Short name is required.'),
  description: z.string().optional(),
  category: z.enum(mainCategories),
  subcategory: z.string().min(2, 'Subcategory is required.'),
  productType: z.string().default('Airport Service'),
  status: z.enum(['Active', 'Inactive', 'Draft']),
  version: z.coerce.number().default(1),
  effectiveDate: z.object({
    from: z.date(),
    to: z.date(),
  }),
  // Ownership
  airportCode: z.string().length(3, '3-letter code required.').toUpperCase(),
  owningBusinessUnit: z.string().min(2, 'Business unit required.'),
  providerType: z.enum(['Internal', 'External']),
  providerName: z.string().min(2, 'Provider name required.'),
  internalOwner: z.string().min(2, 'Internal owner required.'),
  isExternalPartner: z.boolean().default(true),
  // Legacy price field for compatibility
  price: z.coerce.number().optional(),
  currency: z.string().optional(),
  sku: z.string().optional(),
});

export type AirportAncillary = z.infer<typeof airportAncillarySchema>;

interface AirportAncillaryFormProps {
  product: any | null;
  onSubmit: (data: AirportAncillary) => void;
  onCancel: () => void;
}

export function AncillaryProductForm({ product, onSubmit, onCancel }: AirportAncillaryFormProps) {
  const form = useForm<AirportAncillary>({
    resolver: zodResolver(airportAncillarySchema),
    defaultValues: product ? {
        ...product,
        effectiveDate: {
            from: product.effectiveDate?.from instanceof Date ? product.effectiveDate.from : new Date(),
            to: product.effectiveDate?.to instanceof Date ? product.effectiveDate.to : addYears(new Date(), 1)
        }
    } : {
      ancillaryCode: '',
      name: '',
      shortName: '',
      category: 'Lounge',
      subcategory: '',
      productType: 'Airport Service',
      status: 'Active',
      version: 1,
      effectiveDate: { from: new Date(), to: addYears(new Date(), 1) },
      airportCode: 'LHR',
      owningBusinessUnit: 'Hub Operations',
      providerType: 'External',
      providerName: 'Airport Partner',
      internalOwner: 'Commercial Hub',
      isExternalPartner: true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
        
        {/* --- BASIC DETAILS --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <Tag className="h-3.5 w-3.5" /> 1. Core Airport Ancillary Master
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Service Name*</FormLabel><FormControl><Input placeholder="e.g., Premium Lounge Entry" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="shortName" render={({ field }) => (
                    <FormItem><FormLabel>Short Name*</FormLabel><FormControl><Input placeholder="e.g., Prem Lounge" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="ancillaryCode" render={({ field }) => (
                    <FormItem><FormLabel>Service Code*</FormLabel><FormControl><Input placeholder="e.g., LOU01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="version" render={({ field }) => (
                    <FormItem><FormLabel>Version</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem><SelectItem value="Draft">Draft</SelectItem></SelectContent>
                    </Select></FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Main Category*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{mainCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select></FormItem>
                )} />
                <FormField control={form.control} name="subcategory" render={({ field }) => (
                    <FormItem><FormLabel>Subcategory*</FormLabel><FormControl><Input placeholder="e.g., Lounge day pass" {...field} /></FormControl></FormItem>
                )} />
            </div>
             <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Technical Description</FormLabel><FormControl><Textarea placeholder="Fulfillment details and SLA..." {...field} /></FormControl></FormItem>
            )} />
        </section>

        <Separator />

        {/* --- VALIDITY --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <CalendarIcon className="h-3.5 w-3.5" /> 2. Availability Window
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="effectiveDate.from" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Effective From</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4 opacity-50" />{field.value ? format(field.value, "PPP") : <span>Pick date</span>}</Button></FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                        </Popover>
                    </FormItem>
                )} />
                <FormField control={form.control} name="effectiveDate.to" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Effective To</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4 opacity-50" />{field.value ? format(field.value, "PPP") : <span>Pick date</span>}</Button></FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                        </Popover>
                    </FormItem>
                )} />
            </div>
        </section>

        <Separator />

        {/* --- OWNERSHIP --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <ShieldCheck className="h-3.5 w-3.5" /> 3. Ecosystem Ownership
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="airportCode" render={({ field }) => (
                    <FormItem><FormLabel>Hub Node Code*</FormLabel><FormControl><Input placeholder="e.g., LHR" {...field} maxLength={3} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="owningBusinessUnit" render={({ field }) => (
                    <FormItem><FormLabel>Owning Business Unit*</FormLabel><FormControl><Input placeholder="e.g., Hub Ops" {...field} /></FormControl></FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="providerType" render={({ field }) => (
                    <FormItem><FormLabel>Provider Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Internal">Hub-Operated</SelectItem><SelectItem value="External">Third-Party Partner</SelectItem></SelectContent>
                    </Select></FormItem>
                )} />
                <FormField control={form.control} name="providerName" render={({ field }) => (
                    <FormItem><FormLabel>Partner Name*</FormLabel><FormControl><Input placeholder="e.g., Global Lounges Inc" {...field} /></FormControl></FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
                <FormField control={form.control} name="internalOwner" render={({ field }) => (
                    <FormItem><FormLabel>Internal Node Owner*</FormLabel><FormControl><Input placeholder="e.g., Terminal Manager" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="isExternalPartner" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-muted/20 h-10">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none"><FormLabel>External Partner Flag</FormLabel></div>
                    </FormItem>
                )} />
            </div>
        </section>

        <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background py-4">
          <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
          <Button type="submit">Publish Hub Service</Button>
        </div>
      </form>
    </Form>
  );
}
