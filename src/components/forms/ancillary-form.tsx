'use client';

import * as React from 'react';
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
import { ShieldCheck, Plane, Briefcase, Calendar as CalendarIcon, Tag, Info, Layers } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

const categorySubcategoryMap: Record<string, string[]> = {
  'Baggage': ['Extra bag', 'Overweight bag', 'Sports equipment', 'Special baggage'],
  'Seat': ['Preferred seat', 'Extra legroom seat', 'Exit row seat', 'Twin-seat blocking'],
  'Upgrade': ['Upgrade to business', 'Upgrade to first', 'Instant upgrade'],
  'Priority service': ['Priority boarding', 'Fast track', 'Priority check-in', 'Priority baggage'],
  'Lounge': ['Lounge day pass', 'Lounge & Spa', 'Executive suite'],
  'Meal': ['Pre-book meal', 'Special meal', 'Gourmet meal', 'Buy-on-board voucher'],
  'Wi-Fi / connectivity': ['Wi-Fi pass', 'Streaming Wi-Fi', 'Messaging only'],
  'Inflight comfort': ['Amenity kit', 'Blanket & Pillow', 'Sleep kit'],
  'Flexibility / protection': ['Flex change', 'Cancel protection', 'Missed connection protection'],
  'Special service': ['Unaccompanied minor', 'Pet in cabin', 'Wheelchair assistance'],
  'Bundle': ['Economy bundle', 'Business bundle', 'Family bundle'],
};

const mainCategories = Object.keys(categorySubcategoryMap);

const categoryDefaultNames: Record<string, string> = {
  'Baggage': 'Baggage Service',
  'Seat': 'Seat Selection',
  'Upgrade': 'Upgrade Offer',
  'Priority service': 'Priority Service',
  'Lounge': 'Lounge Access',
  'Meal': 'Meal Product',
  'Wi-Fi / connectivity': 'Wi-Fi Service',
  'Inflight comfort': 'Comfort Kit',
  'Flexibility / protection': 'Flexibility Pack',
  'Special service': 'Special Assistance',
  'Bundle': 'Retailing Bundle',
};

const categoryDefaultCodes: Record<string, string> = {
  'Baggage': 'BAG',
  'Seat': 'SEAT',
  'Upgrade': 'UPGR',
  'Priority service': 'PRTY',
  'Lounge': 'LOU',
  'Meal': 'MEAL',
  'Wi-Fi / connectivity': 'WIFI',
  'Inflight comfort': 'CMFT',
  'Flexibility / protection': 'FLEX',
  'Special service': 'SPEC',
  'Bundle': 'BUN',
};

const ancillarySchema = z.object({
  id: z.string().optional(),
  // Mandatory Core Details
  category: z.enum(mainCategories as [string, ...string[]]),
  subcategory: z.string().min(1, 'Subcategory is required.'),
  ancillaryCode: z.string().min(1, 'Code is required.').toUpperCase(),
  name: z.string().min(1, 'Name is required.'),
  shortName: z.string().min(1, 'Short name is required.'),
  status: z.enum(['Active', 'Inactive', 'Draft']),
  version: z.coerce.number().min(1, 'Version is required.'),
  
  // Mandatory Ownership
  airlineCode: z.string().min(1, 'Airline selection is required.'),

  // Optional Fields
  description: z.string().optional(),
  productType: z.string().default('Ancillary'),
  effectiveDate: z.object({
    from: z.date().optional().nullable(),
    to: z.date().optional().nullable(),
  }).optional(),
  owningBusinessUnit: z.string().optional(),
  providerType: z.enum(['Internal', 'External']).optional(),
  providerName: z.string().optional(),
  internalOwner: z.string().optional(),
  isExternalPartner: z.boolean().default(false),
});

export type Ancillary = z.infer<typeof ancillarySchema>;

interface AncillaryFormProps {
  ancillary: any | null;
  onSubmit: (data: Ancillary) => void;
  onCancel: () => void;
}

const mockAirlinesFallback = [
    { id: '1', name: 'Global Airways', icaoCode: 'GAB' },
    { id: '2', name: 'SkyBridge Airlines', icaoCode: 'SBA' },
];

export function AncillaryForm({ ancillary, onSubmit, onCancel }: AncillaryFormProps) {
  const firestore = useFirestore();
  const airlinesQuery = React.useMemo(() => firestore ? collection(firestore, 'airlines') : undefined, [firestore]);
  const { data: airlinesCollection } = useCollection(airlinesQuery);

  const airlines = (airlinesCollection && airlinesCollection.length > 0) ? airlinesCollection : mockAirlinesFallback;

  const form = useForm<Ancillary>({
    resolver: zodResolver(ancillarySchema),
    defaultValues: ancillary ? {
        ...ancillary,
        effectiveDate: {
            from: ancillary.effectiveDate?.from ? (ancillary.effectiveDate.from instanceof Date ? ancillary.effectiveDate.from : ancillary.effectiveDate.from.toDate()) : null,
            to: ancillary.effectiveDate?.to ? (ancillary.effectiveDate.to instanceof Date ? ancillary.effectiveDate.to : ancillary.effectiveDate.to.toDate()) : null,
        }
    } : {
      name: '',
      shortName: '',
      category: 'Baggage',
      subcategory: 'Extra bag',
      productType: 'Ancillary',
      status: 'Active',
      version: 1,
      effectiveDate: { from: null, to: null },
      airlineCode: '',
      ancillaryCode: '',
      owningBusinessUnit: '',
      providerType: 'Internal',
      providerName: '',
      internalOwner: '',
      isExternalPartner: false,
    },
  });

  const selectedCategory = form.watch('category');
  const availableSubcategories = categorySubcategoryMap[selectedCategory] || [];

  // Update name, shortName, and code based on category if not explicitly touched by user
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'category') {
          const newName = categoryDefaultNames[value.category as string] || '';
          const newCode = categoryDefaultCodes[value.category as string] || '';
          
          form.setValue('name', newName, { shouldValidate: true });
          form.setValue('shortName', newName, { shouldValidate: true });
          form.setValue('ancillaryCode', newCode, { shouldValidate: true });
          
          // Reset subcategory to first available for the new category
          const newSubs = categorySubcategoryMap[value.category as string];
          if (newSubs && newSubs.length > 0) {
              form.setValue('subcategory', newSubs[0]);
          }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
        
        {/* --- 1. CORE ANCILLARY MASTER DETAILS --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <Tag className="h-3.5 w-3.5" /> 1. Core Ancillary Master Details
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Main Category*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{mainCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="subcategory" render={({ field }) => (
                    <FormItem><FormLabel>Subcategory*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{availableSubcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Ancillary Name*</FormLabel><FormControl><Input placeholder="e.g., Preferred Seat" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="shortName" render={({ field }) => (
                    <FormItem><FormLabel>Short Name*</FormLabel><FormControl><Input placeholder="e.g., Pref Seat" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="ancillaryCode" render={({ field }) => (
                    <FormItem><FormLabel>Ancillary Code*</FormLabel><FormControl><Input placeholder="e.g., PRFD" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="version" render={({ field }) => (
                    <FormItem><FormLabel>Version*</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem><SelectItem value="Draft">Draft</SelectItem></SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="effectiveDate.from" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Effective From</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4 opacity-50" />{field.value ? format(field.value, "PPP") : <span>No Start Date</span>}</Button></FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} initialFocus /></PopoverContent>
                        </Popover>
                    </FormItem>
                )} />
                <FormField control={form.control} name="effectiveDate.to" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Effective To</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4 opacity-50" />{field.value ? format(field.value, "PPP") : <span>No End Date</span>}</Button></FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} initialFocus /></PopoverContent>
                        </Popover>
                    </FormItem>
                )} />
            </div>
             <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Detailed service description..." {...field} /></FormControl></FormItem>
            )} />
        </section>

        <Separator />

        {/* --- 2. OWNERSHIP DETAILS --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <ShieldCheck className="h-3.5 w-3.5" /> 2. Ownership Details
            </div>

            <FormField control={form.control} name="airlineCode" render={({ field }) => (
                <FormItem>
                    <FormLabel>Owning Airline*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Airline..." /></SelectTrigger></FormControl>
                        <SelectContent>
                            {airlines.map((a: any) => (
                                <SelectItem key={a.id} value={a.icaoCode}>{a.name} ({a.icaoCode})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="owningBusinessUnit" render={({ field }) => (
                    <FormItem><FormLabel>Owning Business Unit</FormLabel><FormControl><Input placeholder="e.g., Retailing" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="providerType" render={({ field }) => (
                    <FormItem><FormLabel>Provider Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Internal">Internal</SelectItem><SelectItem value="External">External</SelectItem></SelectContent>
                    </Select></FormItem>
                )} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="providerName" render={({ field }) => (
                    <FormItem><FormLabel>Provider Name</FormLabel><FormControl><Input placeholder="e.g., Global Airways" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="internalOwner" render={({ field }) => (
                    <FormItem><FormLabel>Internal Stakeholder</FormLabel><FormControl><Input placeholder="e.g., RM Team" {...field} /></FormControl></FormItem>
                )} />
            </div>

            <FormField control={form.control} name="isExternalPartner" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-muted/20">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none"><FormLabel>External Partner Fulfillment</FormLabel></div>
                </FormItem>
            )} />
        </section>

        <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background py-4">
          <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
          <Button type="submit" className="font-bold px-8">Commit to Carrier Catalogue</Button>
        </div>
      </form>
    </Form>
  );
}
