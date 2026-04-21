
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
    Calendar as CalendarIcon,
    Plane,
    Building2,
    Briefcase
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
  domain: z.enum(['Airline', 'Airport', 'Hybrid']).default('Airline'),
  owningAirlineId: z.string().optional(),
  owningAirportId: z.string().optional(),
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
  }),

  targeting: z.object({
    cohortIds: z.array(z.string()).default([]),
    conflictPriority: z.coerce.number().default(1),
  }),
});

export type Bundle = z.infer<typeof bundleSchema>;

export function BundleForm({ bundle, onSubmit, onCancel }: { bundle: any | null, onSubmit: (data: Bundle) => void, onCancel: () => void }) {
  const firestore = useFirestore();
  const airlinesQuery = React.useMemo(() => firestore ? collection(firestore, 'airlines') : undefined, [firestore]);
  const airportsQuery = React.useMemo(() => firestore ? collection(firestore, 'airports') : undefined, [firestore]);
  const airlineAncillariesQuery = React.useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
  const airportServicesQuery = React.useMemo(() => firestore ? collection(firestore, 'airportServices') : undefined, [firestore]);
  const cohortsQuery = React.useMemo(() => firestore ? collection(firestore, 'cohorts') : undefined, [firestore]);

  const { data: airlines } = useCollection(airlinesQuery);
  const { data: airports } = useCollection(airportsQuery);
  const { data: airlineAncillaries } = useCollection(airlineAncillariesQuery);
  const { data: airportServices } = useCollection(airportServicesQuery);
  const { data: cohorts } = useCollection(cohortsQuery);

  const form = useForm<Bundle>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      name: bundle?.name || '',
      description: bundle?.description || '',
      domain: bundle?.domain || 'Airline',
      owningAirlineId: bundle?.owningAirlineId || '',
      owningAirportId: bundle?.owningAirportId || '',
      offerType: bundle?.offerType || 'Bundle',
      status: bundle?.status || 'Draft',
      priority: bundle?.priority || 50,
      validity: { 
          from: bundle?.validity?.from instanceof Date ? bundle.validity.from : (bundle?.validity?.from?.toDate ? bundle.validity.from.toDate() : new Date()), 
          to: bundle?.validity?.to instanceof Date ? bundle.validity.to : (bundle?.validity?.to?.toDate ? bundle.validity.to.toDate() : addDays(new Date(), 30)) 
      },
      components: bundle?.components || [{ value: '', isMandatory: true }],
      pricing: { 
          strategy: bundle?.pricing?.strategy || 'Static', 
          basePrice: bundle?.pricing?.basePrice || 0, 
          currency: bundle?.pricing?.currency || 'USD', 
          adjustmentType: bundle?.pricing?.adjustmentType || 'Percentage', 
          adjustmentValue: bundle?.pricing?.adjustmentValue || 0 
      },
      targeting: { 
          cohortIds: bundle?.targeting?.cohortIds || [], 
          conflictPriority: bundle?.targeting?.conflictPriority || 1, 
      },
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "components" });

  const domain = form.watch('domain');
  const owningAirlineId = form.watch('owningAirlineId');
  const owningAirportId = form.watch('owningAirportId');

  const filteredAirlineAncillaries = React.useMemo(() => {
    if (!airlineAncillaries) return [];
    if (domain === 'Airline' && owningAirlineId) {
        return airlineAncillaries.filter((a: any) => a.airlineId === owningAirlineId);
    }
    return airlineAncillaries;
  }, [airlineAncillaries, domain, owningAirlineId]);

  const filteredAirportServices = React.useMemo(() => {
    if (!airportServices) return [];
    if (domain === 'Airport' && owningAirportId) {
        return airportServices.filter((a: any) => a.airportId === owningAirportId);
    }
    return airportServices;
  }, [airportServices, domain, owningAirportId]);

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
                <FormField control={form.control} name="domain" render={({ field }) => (
                    <FormItem><FormLabel>Retailing Domain</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Airline">Carrier-Specific (Airline)</SelectItem>
                            <SelectItem value="Airport">Hub-Specific (Airport)</SelectItem>
                            <SelectItem value="Hybrid">Ecosystem (Hybrid Mix)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormDescription className="text-[10px]">Defines the product mapping scope.</FormDescription></FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Strategy Identity</FormLabel><FormControl><Input placeholder="e.g., LHR Luxury Bundle" {...field} /></FormControl></FormItem>
                )} />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {domain === 'Airline' && (
                    <FormField control={form.control} name="owningAirlineId" render={({ field }) => (
                        <FormItem><FormLabel>Owning Airline</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select Carrier..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {(airlines || []).map((a: any) => (
                                    <SelectItem key={a.id} value={a.id}>{a.name} ({a.icaoCode})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select></FormItem>
                    )} />
                )}
                {domain === 'Airport' && (
                    <FormField control={form.control} name="owningAirportId" render={({ field }) => (
                        <FormItem><FormLabel>Owning Hub Node</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select Airport..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {(airports || []).map((a: any) => (
                                    <SelectItem key={a.id} value={a.iataCode}>{a.name} ({a.iataCode})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select></FormItem>
                    )} />
                )}
                <FormField control={form.control} name="offerType" render={({ field }) => (
                    <FormItem><FormLabel>Strategy Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Single">Single SKU</SelectItem>
                            <SelectItem value="Bundle">Multi-SKU Bundle</SelectItem>
                            <SelectItem value="Upgrade">Upsell / Upgrade</SelectItem>
                        </SelectContent>
                    </Select></FormItem>
                )} />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="validity" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Active Monetization Window</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value?.from && 'text-muted-foreground')}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value?.from ? (
                                            field.value.to ? <>{format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}</> : format(field.value.from, "LLL dd, y")
                                        ) : <span>Pick dates</span>}
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar 
                                    initialFocus 
                                    mode="range" 
                                    selected={field.value ? { from: field.value.from, to: field.value.to } : undefined} 
                                    onSelect={(r: any) => r && field.onChange(r)} 
                                    numberOfMonths={2} 
                                />
                            </PopoverContent>
                        </Popover>
                    </FormItem>
                )} />
                 <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Orchestration Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Published">Live</SelectItem><SelectItem value="Archived">Archived</SelectItem></SelectContent>
                    </Select></FormItem>
                )} />
             </div>
          </TabsContent>

          {/* --- COMPOSITION --- */}
          <TabsContent value="composition" className="space-y-4 py-4">
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <FormLabel>Catalogue Mapping ({domain} Portfolio)</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '', isMandatory: true })}><PlusCircle className="h-3 w-3 mr-1" /> Add Component</Button>
                </div>
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg border bg-muted/20">
                        <div className="col-span-8">
                             <FormField control={form.control} name={`components.${index}.value`} render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Select Product SKU..." /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {(domain === 'Airline' || domain === 'Hybrid') && (
                                                <SelectGroup>
                                                    <SelectLabel className="flex items-center gap-2"><Plane className="h-3 w-3" /> Carrier Ancillaries</SelectLabel>
                                                    {filteredAirlineAncillaries.map((p: any) => (<SelectItem key={p.id} value={p.id!}>{p.name} ({p.pssCode})</SelectItem>))}
                                                </SelectGroup>
                                            )}
                                            {(domain === 'Airport' || domain === 'Hybrid') && (
                                                <SelectGroup>
                                                    <SelectLabel className="flex items-center gap-2"><Building2 className="h-3 w-3" /> Hub Services</SelectLabel>
                                                    {filteredAirportServices.map((p: any) => (<SelectItem key={p.id} value={p.id!}>{p.name} ({p.sku})</SelectItem>))}
                                                </SelectGroup>
                                            )}
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
                        <div className="col-span-1 flex justify-end">
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                ))}
             </div>
          </TabsContent>

          {/* --- PRICING --- */}
          <TabsContent value="pricing" className="space-y-6 py-4">
             <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="pricing.strategy" render={({ field }) => (
                    <FormItem><FormLabel>Dynamic Strategy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Static">Deterministic (Fixed)</SelectItem>
                            <SelectItem value="Dynamic">Continuous (Micro-adj)</SelectItem>
                            <SelectItem value="Demand">Demand-Based (Signals)</SelectItem>
                            <SelectItem value="Time-based">Temporal (DBD)</SelectItem>
                        </SelectContent>
                    </Select></FormItem>
                )} />
                 <FormField control={form.control} name="pricing.basePrice" render={({ field }) => (
                    <FormItem><FormLabel>Base Price (Bundle)</FormLabel>
                    <div className="relative"><DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><FormControl><Input type="number" className="pl-9 font-bold" {...field} /></FormControl></div>
                    </FormItem>
                )} />
                <FormField control={form.control} name="pricing.currency" render={({ field }) => (
                    <FormItem><FormLabel>ISO Currency</FormLabel><FormControl><Input maxLength={3} {...field} className="font-mono uppercase" /></FormControl></FormItem>
                )} />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 border rounded-xl bg-primary/5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest"><TrendingUp className="h-3 h-3" /> Yield Delta</div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="pricing.adjustmentType" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent><SelectItem value="Percentage">% Adjustment</SelectItem><SelectItem value="Fixed">Fixed Delta</SelectItem></SelectContent>
                            </Select></FormItem>
                        )} />
                        <FormField control={form.control} name="pricing.adjustmentValue" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Value</FormLabel><FormControl><Input type="number" className="h-8" {...field} /></FormControl></FormItem>
                        )} />
                    </div>
                </div>
                <div className="space-y-4 p-4 border rounded-xl bg-destructive/5">
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

          {/* --- TARGETING --- */}
          <TabsContent value="targeting" className="space-y-6 py-4">
             <FormField control={form.control} name="targeting.cohortIds" render={({ field }) => (
                <FormItem>
                  <FormLabel>Decision Engine Targets (Cohorts)</FormLabel>
                  <FormControl>
                    <MultiSelect 
                      options={(cohorts || []).map((c: any) => ({ value: c.cohortId, label: c.name }))} 
                      selected={field.value || []} 
                      onChange={field.onChange} 
                      placeholder="Search and map segments..." 
                    />
                  </FormControl>
                  <FormDescription className="text-[10px]">Real-time evaluation links these segments to the commercial logic defined.</FormDescription>
                </FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-6">
                <FormField control={form.control} name="priority" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Retailing Priority</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormDescription className="text-[10px]">Higher value ensures prominence in touchpoint carousels.</FormDescription>
                    </FormItem>
                )} />
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-800 leading-tight"><strong>Retailing Warning:</strong> Conflicting high-priority offers for the same cohort will be load-balanced by the SITA Decision Engine.</p>
                </div>
              </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
          <Button type="submit" className="px-10 font-bold">Commit Monetization Logic</Button>
        </div>
      </form>
    </Form>
  );
}
