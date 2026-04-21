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
import { Building2, MapPin, Briefcase, Calendar as CalendarIcon, Tag, ShieldCheck, Info, Map, Terminal, Clock, Plane } from 'lucide-react';
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
  // 1. Core Details
  ancillaryCode: z.string().min(2, 'Code is required.').toUpperCase(),
  name: z.string().min(3, 'Name is required.'),
  shortName: z.string().min(2, 'Short name is required.'),
  description: z.string().optional(),
  category: z.enum(mainCategories),
  subcategory: z.string().min(2, 'Subcategory is required.'),
  serviceType: z.enum(['slot-based', 'on-demand', 'request-based']).default('on-demand'),
  status: z.enum(['Active', 'Inactive', 'Draft']),
  version: z.coerce.number().default(1),
  effectiveDate: z.object({
    from: z.date(),
    to: z.date(),
  }),
  // 2. Ownership & Provider
  airlineCode: z.string().length(3, '3-letter airline code required.').toUpperCase(),
  airportCode: z.string().length(3, '3-letter airport code required.').toUpperCase(),
  providerType: z.enum(['airport', 'lounge operator', 'vendor']),
  supplierId: z.string().min(2, 'Supplier ID required.'),
  providerName: z.string().min(2, 'Provider name required.'),
  contractReference: z.string().optional(),
  slaLevel: z.string().optional(),
  confirmationType: z.enum(['instant', 'request', 'manual']).default('instant'),
  contactDetails: z.string().optional(),
  // 3. Location
  terminals: z.string().min(1, 'Terminal(s) required.'),
  zone: z.string().min(1, 'Concourse/zone required.'),
  servicePoint: z.string().min(1, 'Service point required.'),
  isGateApplicable: z.boolean().default(false),
  journeyStage: z.enum(['Departure', 'Arrival', 'Transit', 'All']).default('Departure'),
  multiLocationSupport: z.boolean().default(false),
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
      serviceType: 'on-demand',
      status: 'Active',
      version: 1,
      effectiveDate: { from: new Date(), to: addYears(new Date(), 1) },
      airlineCode: 'GAB',
      airportCode: 'LHR',
      providerType: 'vendor',
      supplierId: '',
      providerName: '',
      confirmationType: 'instant',
      terminals: 'T5',
      zone: 'North Concourse',
      servicePoint: 'Desk A1',
      isGateApplicable: false,
      journeyStage: 'Departure',
      multiLocationSupport: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-h-[80vh] overflow-y-auto pr-4">
        
        {/* --- 1. CORE MASTER DETAILS --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <Tag className="h-3.5 w-3.5" /> 1. Core Airport Ancillary Master
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Ancillary Name*</FormLabel><FormControl><Input placeholder="e.g., Executive Lounge Access" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="shortName" render={({ field }) => (
                    <FormItem><FormLabel>Short Name*</FormLabel><FormControl><Input placeholder="e.g., Exec Lounge" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="ancillaryCode" render={({ field }) => (
                    <FormItem><FormLabel>Ancillary Code*</FormLabel><FormControl><Input placeholder="e.g., LOU01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="serviceType" render={({ field }) => (
                    <FormItem><FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="slot-based">Slot-based</SelectItem>
                            <SelectItem value="on-demand">On-demand</SelectItem>
                            <SelectItem value="request-based">Request-based</SelectItem>
                        </SelectContent>
                    </Select></FormItem>
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
             <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Service Description</FormLabel><FormControl><Textarea placeholder="Detailed description for the retailing engine..." {...field} /></FormControl></FormItem>
            )} />
        </section>

        <Separator />

        {/* --- 2. OWNERSHIP & PROVIDER DETAILS --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <Building2 className="h-3.5 w-3.5" /> 2. Ownership & Provider Governance
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="airlineCode" render={({ field }) => (
                    <FormItem><FormLabel>Airline Code (Seller)*</FormLabel><FormControl><Input placeholder="e.g., GAB" {...field} maxLength={3} /></FormControl><FormDescription className="text-[10px]">The airline responsible for retailing.</FormDescription></FormItem>
                )} />
                <FormField control={form.control} name="airportCode" render={({ field }) => (
                    <FormItem><FormLabel>Airport Code (Node)*</FormLabel><FormControl><Input placeholder="e.g., LHR" {...field} maxLength={3} /></FormControl></FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="providerType" render={({ field }) => (
                    <FormItem><FormLabel>Provider Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="airport">Airport Authority</SelectItem>
                            <SelectItem value="lounge operator">Lounge Operator</SelectItem>
                            <SelectItem value="vendor">Third-Party Vendor</SelectItem>
                        </SelectContent>
                    </Select></FormItem>
                )} />
                <FormField control={form.control} name="supplierId" render={({ field }) => (
                    <FormItem><FormLabel>Supplier / Partner ID*</FormLabel><FormControl><Input placeholder="e.g., PART-01" {...field} /></FormControl></FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="providerName" render={({ field }) => (
                    <FormItem><FormLabel>Partner Legal Name*</FormLabel><FormControl><Input placeholder="e.g., Hub Lounges Global" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="contractReference" render={({ field }) => (
                    <FormItem><FormLabel>Contract Reference</FormLabel><FormControl><Input placeholder="e.g., CONT-2025-LHR" {...field} /></FormControl></FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="confirmationType" render={({ field }) => (
                    <FormItem><FormLabel>Confirmation Protocol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="instant">Instant (Auto-Sync)</SelectItem>
                            <SelectItem value="request">Request Required</SelectItem>
                            <SelectItem value="manual">Manual Entry</SelectItem>
                        </SelectContent>
                    </Select></FormItem>
                )} />
                <FormField control={form.control} name="slaLevel" render={({ field }) => (
                    <FormItem><FormLabel>SLA Level</FormLabel><FormControl><Input placeholder="e.g., Gold (15m response)" {...field} /></FormControl></FormItem>
                )} />
            </div>
            <FormField control={form.control} name="contactDetails" render={({ field }) => (
                <FormItem><FormLabel>Escalation & Contact Details</FormLabel><FormControl><Input placeholder="ops.center@partner.com | +44..." {...field} /></FormControl></FormItem>
            )} />
        </section>

        <Separator />

        {/* --- 3. LOCATION CONFIGURATION --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <MapPin className="h-3.5 w-3.5" /> 3. High-Fidelity Location Mapping
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="terminals" render={({ field }) => (
                    <FormItem><FormLabel>Active Terminal(s)*</FormLabel><FormControl><Input placeholder="e.g., T2, T5" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="zone" render={({ field }) => (
                    <FormItem><FormLabel>Concourse / Zone*</FormLabel><FormControl><Input placeholder="e.g., North Plaza" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="servicePoint" render={({ field }) => (
                    <FormItem><FormLabel>Primary Service Point*</FormLabel><FormControl><Input placeholder="e.g., Lounge Desk B" {...field} /></FormControl><FormDescription className="text-[10px]">Exact point of consumption.</FormDescription></FormItem>
                )} />
                <FormField control={form.control} name="journeyStage" render={({ field }) => (
                    <FormItem><FormLabel>Journey Applicability</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Departure">Departure Only</SelectItem>
                            <SelectItem value="Arrival">Arrival Only</SelectItem>
                            <SelectItem value="Transit">Transit Only</SelectItem>
                            <SelectItem value="All">All Journey Stages</SelectItem>
                        </SelectContent>
                    </Select></FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="isGateApplicable" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-muted/20">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none"><FormLabel>Gate Area Retailing</FormLabel></div>
                    </FormItem>
                )} />
                <FormField control={form.control} name="multiLocationSupport" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-muted/20">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none"><FormLabel>Multi-Node Support</FormLabel></div>
                    </FormItem>
                )} />
            </div>
        </section>

        <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background py-4">
          <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
          <Button type="submit">Publish Hub Master SKU</Button>
        </div>
      </form>
    </Form>
  );
}
