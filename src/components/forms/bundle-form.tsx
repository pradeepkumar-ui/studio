
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
    PlusCircle, 
    Trash2, 
    Package, 
    Check, 
    Target, 
    DollarSign, 
    ShieldCheck, 
    TrendingUp, 
    Zap, 
    Activity, 
    Settings, 
    Layers,
    AlertCircle,
    Calendar as CalendarIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MultiSelect } from '@/components/ui/multi-select';
import { Checkbox } from '@/components/ui/checkbox';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDays, format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';

const bundleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Monetization name is required.'),
  description: z.string().min(10, 'Technical description required.'),
  offerType: z.enum(['Single', 'Bundle', 'Upgrade', 'Conditional', 'Contextual']).default('Bundle'),
  status: z.enum(['Draft', 'Published', 'Archived']).default('Draft'),
  priority: z.coerce.number().min(1).max(100).default(50),
  validity: z.object({
    from: z.date(),
    to: z.date(),
  }),
  components: z.array(z.object({
    value: z.string().min(1, "Select SKU"),
    isMandatory: z.boolean().default(true),
    substitutionId: z.string().optional(),
  })).min(1, "Offer must contain at least one product."),
  
  pricing: z.object({
    strategy: z.enum(['Static', 'Dynamic', 'Demand', 'Time-based', 'Bid']),
    basePrice: z.coerce.number().min(0),
    currency: z.string().default('USD'),
    floorPrice: z.coerce.number().optional(),
    ceilingPrice: z.coerce.number().optional(),
    adjustmentType: z.enum(['Percentage', 'Fixed', 'Multiplier']).default('Percentage'),
    adjustmentValue: z.coerce.number().default(0),
    markupRules: z.array(z.object({
        channel: z.string(),
        uplift: z.coerce.number()
    })).optional(),
  }),

  targeting: z.object({
    cohortIds: z.array(z.string()).default([]),
    conflictPriority: z.coerce.number().default(1),
    channelExclusions: z.array(z.string()).default([]),
  }),
});

export type Bundle = z.infer<typeof bundleSchema>;

export function BundleForm({ bundle, onSubmit, onCancel }: { bundle: any | null, onSubmit: (data: Bundle) => void, onCancel: () => void }) {
  const firestore = useFirestore();
  const airlinesQuery = React.useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
  const airportQuery = React.useMemo(() => firestore ? collection(firestore, 'airportServices') : undefined, [firestore]);
  const cohortsQuery = React.useMemo(() => firestore ? collection(firestore, 'cohorts') : undefined, [firestore]);

  const { data: airlineAncillaries } = useCollection(airlinesQuery);
  const { data: airportServices } = useCollection(airportQuery);
  const { data: cohorts } = useCollection(cohortsQuery);

  const form = useForm<Bundle>({
    resolver: zodResolver(bundleSchema),
    defaultValues: bundle || {
      name: '',
      description: '',
      offerType: 'Bundle',
      status: 'Draft',
      priority: 50,
      validity: { from: new Date(), to: addDays(new Date(), 30) },
      components: [{ value: '', isMandatory: true }],
      pricing: { strategy: 'Static', basePrice: 0, currency: 'USD', adjustmentType: 'Percentage', adjustmentValue: 0 },
      targeting: { cohortIds: [], conflictPriority: 1, channelExclusions: [] },
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "components" });

  const pricingStrategy = form.watch('pricing.strategy');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted h-auto p-1">
            <TabsTrigger value="general" className="text-[10px] uppercase font-bold py-2"><Settings className="w-3 h-3 mr-1" /> General</TabsTrigger>
            <TabsTrigger value="composition" className="text-[10px] uppercase font-bold py-2"><Layers className="w-3 h-3 mr-1" /> composition</TabsTrigger>
            <TabsTrigger value="pricing" className="text-[10px] uppercase font-bold py-2"><DollarSign className="w-3 h-3 mr-1" /> Monetization</TabsTrigger>
            <TabsTrigger value="targeting" className="text-[10px] uppercase font-bold py-2"><Target className="w-3 h-3 mr-1" /> Real-Time Scope</TabsTrigger>
          </TabsList>

          {/* --- GENERAL IDENTITY --- */}
          <TabsContent value="general" className="space-y-4 py-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Monetization Identity</FormLabel><FormControl><Input placeholder="e.g., LHR Luxury Bundle" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="offerType" render={({ field }) => (
                    <FormItem><FormLabel>Strategy Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Single">Single Ancillary</SelectItem>
                            <SelectItem value="Bundle">Orchestrated Bundle</SelectItem>
                            <SelectItem value="Upgrade">Priority Upgrade</SelectItem>
                            <SelectItem value="Conditional">Rule-Conditional</SelectItem>
                        </SelectContent>
                    </Select></FormItem>
                )} />
             </div>
             <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Commercial Intent</FormLabel><FormControl><Input placeholder="Objective of this offer..." {...field} /></FormControl></FormItem>
             )} />
             <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="validity" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Active Monetization Window</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value?.from && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value?.from ? (field.value.to ? <>{format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}</> : format(field.value.from, "LLL dd, y")) : <span>Pick dates</span>}</Button></FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar initialFocus mode="range" selected={{ from: field.value.from, to: field.value.to }} onSelect={(r: any) => r && field.onChange(r)} numberOfMonths={2} /></PopoverContent>
                        </Popover>
                    </FormItem>
                )} />
                 <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Orchestration Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Draft">Sandboxed (Internal)</SelectItem><SelectItem value="Published">Live (Decision Engine)</SelectItem><SelectItem value="Archived">Historical</SelectItem></SelectContent>
                    </Select></FormItem>
                )} />
             </div>
          </TabsContent>

          {/* --- COMPOSITION & BUNDLING --- */}
          <TabsContent value="composition" className="space-y-4 py-4">
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <FormLabel>Product Mapping (Airline + Airport Mix)</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '', isMandatory: true })}><PlusCircle className="h-3 w-3 mr-1" /> Add Component</Button>
                </div>
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg border bg-muted/20">
                        <div className="col-span-6">
                             <FormField control={form.control} name={`components.${index}.value`} render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Select SKU..." /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectGroup><SelectLabel>Carrier Ancillaries</SelectLabel>{(airlineAncillaries || []).map(p => (<SelectItem key={p.id} value={p.id!}>{p.name} (${p.defaultPrice})</SelectItem>))}</SelectGroup>
                                            <SelectGroup><SelectLabel>Hub Services</SelectLabel>{(airportServices || []).map(p => (<SelectItem key={p.id} value={p.id!}>{p.name} (${p.price})</SelectItem>))}</SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        </div>
                        <div className="col-span-3">
                            <FormField control={form.control} name={`components.${index}.isMandatory`} render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0 h-9">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <FormLabel className="text-[10px] uppercase font-black">Mandatory</FormLabel>
                                </FormItem>
                            )} />
                        </div>
                        <div className="col-span-3 flex justify-end">
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                ))}
             </div>
             <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 flex items-start gap-2">
                 <Zap className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                 <p className="text-[10px] text-indigo-700 font-medium">Bundling engine automatically handles conflict resolution for overlapping SKUs within the same PNR context.</p>
             </div>
          </TabsContent>

          {/* --- PRICING ENGINE --- */}
          <TabsContent value="pricing" className="space-y-6 py-4">
             <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="pricing.strategy" render={({ field }) => (
                    <FormItem><FormLabel>Pricing Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Static">Static Price</SelectItem>
                            <SelectItem value="Dynamic">Continuous Pricing</SelectItem>
                            <SelectItem value="Demand">Demand-Driven (Load Factor)</SelectItem>
                            <SelectItem value="Time-based">Temporal (DBD)</SelectItem>
                            <SelectItem value="Bid">Auction/Bid Logic</SelectItem>
                        </SelectContent>
                    </Select></FormItem>
                )} />
                 <FormField control={form.control} name="pricing.basePrice" render={({ field }) => (
                    <FormItem><FormLabel>Base Ecosystem Price</FormLabel>
                    <div className="relative"><DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><FormControl><Input type="number" className="pl-9" {...field} /></FormControl></div>
                    </FormItem>
                )} />
                <FormField control={form.control} name="pricing.currency" render={({ field }) => (
                    <FormItem><FormLabel>Currency</FormLabel><FormControl><Input maxLength={3} {...field} className="font-mono" /></FormControl></FormItem>
                )} />
             </div>

             <Separator />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-700 tracking-widest"><TrendingUp className="h-3 h-3" /> Adjustment deltas</div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="pricing.adjustmentType" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent><SelectItem value="Percentage">% Adjustment</SelectItem><SelectItem value="Fixed">Fixed Amount</SelectItem><SelectItem value="Multiplier">Price Multiplier</SelectItem></SelectContent>
                            </Select></FormItem>
                        )} />
                        <FormField control={form.control} name="pricing.adjustmentValue" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Value</FormLabel><FormControl><Input type="number" className="h-8" {...field} /></FormControl></FormItem>
                        )} />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-destructive tracking-widest"><ShieldCheck className="h-3 h-3" /> Yield Guardrails</div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="pricing.floorPrice" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Min Floor ($)</FormLabel><FormControl><Input type="number" className="h-8" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="pricing.ceilingPrice" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Max Ceiling ($)</FormLabel><FormControl><Input type="number" className="h-8" {...field} /></FormControl></FormItem>
                        )} />
                    </div>
                </div>
             </div>
          </TabsContent>

          {/* --- TARGETING & ORCHESTRATION --- */}
          <TabsContent value="targeting" className="space-y-6 py-4">
             <FormField control={form.control} name="targeting.cohortIds" render={({ field }) => (
                <FormItem>
                  <FormLabel>Linked Retailing Cohorts</FormLabel>
                  <FormControl>
                    <MultiSelect 
                      options={(cohorts || []).map(c => ({ value: c.cohortId, label: c.name }))} 
                      selected={field.value || []} 
                      onChange={field.onChange} 
                      placeholder="Search segments..." 
                    />
                  </FormControl>
                  <FormDescription className="text-[10px]">Real-time evaluation will only trigger this offer if the passenger matches one of these cohorts.</FormDescription>
                </FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-6">
                <FormField control={form.control} name="priority" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Conflict Resolution Priority</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormDescription className="text-[10px]">Higher value wins in multi-cohort matches.</FormDescription>
                    </FormItem>
                )} />
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-800 leading-tight"><strong>Ecosystem Warning:</strong> Publishing multiple high-priority offers to the same cohort may result in decision engine throttling.</p>
                </div>
              </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="px-10 font-bold">Commit Strategized Offer</Button>
        </div>
      </form>
    </Form>
  );
}
