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
    Target, 
    DollarSign, 
    ShieldCheck, 
    TrendingUp, 
    Settings, 
    Layers,
    Calendar as CalendarIcon,
    Plane,
    Building2,
    Briefcase
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MultiSelect } from '@/components/ui/multi-select';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDays, format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';

// --- MOCK FALLBACKS FOR PROTOTYPING ---
const mockAirlines = [
    { id: '1', name: 'Global Airways', icaoCode: 'GAB' },
    { id: '2', name: 'SkyBridge Airlines', icaoCode: 'SBA' },
];

const mockAirports = [
    { id: '1', name: 'Heathrow Airport', iataCode: 'LHR' },
    { id: '2', name: 'John F. Kennedy', iataCode: 'JFK' },
];

const mockAirlineAncillaries = [
  { id: 'ANC-001', name: 'Extra Legroom Seat', pssCode: 'EXLG', airlineId: '1' },
  { id: 'ANC-002', name: 'Premium Wi-Fi', pssCode: 'WIFI', airlineId: '1' },
  { id: 'ANC-003', name: 'Gourmet Meal', pssCode: 'MEAL', airlineId: '2' },
];

const mockAirportServices = [
  { id: 'APS-001', name: 'LHR Executive Lounge', sku: 'LHR-LOU', airportId: 'LHR' },
  { id: 'APS-002', name: 'JFK VIP Valet', sku: 'JFK-VAL', airportId: 'JFK' },
];

const mockCohorts = [
{ cohortId: 'BOM_BIZ_WAIT', name: 'BOM High-Wait Business' },
{ cohortId: 'IN_WEB_PROMO', name: 'India POS Web Promo' }
];

const bundleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Monetization name is required.'),
  description: z.string().optional(),
  domain: z.enum(['Airline', 'Airport', 'Hybrid']).default('Airline'),
  owningAirlineId: z.string().optional(),
  owningAirportId: z.string().optional(),
  status: z.enum(['Draft', 'Published', 'Archived']).default('Draft'),
  validity: z.object({
    from: z.date(),
    to: z.date(),
  }),
  components: z.array(z.object({
    value: z.string().min(1, "Select SKU"),
    isMandatory: z.boolean().default(true),
  })).min(1, "Offer must contain at least one product."),
  
  pricing: z.object({
    strategy: z.enum(['Static', 'Dynamic', 'Demand', 'Time-based']).default('Static'),
    basePrice: z.coerce.number().min(0),
    currency: z.string().default('USD'),
    floorPrice: z.coerce.number().optional(),
    ceilingPrice: z.coerce.number().optional(),
    adjustmentType: z.enum(['Percentage', 'Fixed']).default('Percentage'),
    adjustmentValue: z.coerce.number().default(0),
  }),

  targeting: z.object({
    cohortIds: z.array(z.string()).default([]),
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

  const { data: airlinesCollection } = useCollection(airlinesQuery);
  const { data: airportsCollection } = useCollection(airportsQuery);
  const { data: airlineAncillariesCollection } = useCollection(airlineAncillariesQuery);
  const { data: airportServicesCollection } = useCollection(airportServicesQuery);
  const { data: cohortsCollection } = useCollection(cohortsQuery);

  const airlines = (airlinesCollection && airlinesCollection.length > 0) ? airlinesCollection : mockAirlines;
  const airports = (airportsCollection && airportsCollection.length > 0) ? airportsCollection : mockAirports;
  const airlineAncillaries = (airlineAncillariesCollection && airlineAncillariesCollection.length > 0) ? airlineAncillariesCollection : mockAirlineAncillaries;
  const airportServices = (airportServicesCollection && airportServicesCollection.length > 0) ? airportServicesCollection : mockAirportServices;
  const cohorts = (cohortsCollection && cohortsCollection.length > 0) ? cohortsCollection : mockCohorts;

  const form = useForm<Bundle>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      name: bundle?.name || '',
      description: bundle?.description || '',
      domain: bundle?.domain || 'Airline',
      owningAirlineId: bundle?.owningAirlineId || '',
      owningAirportId: bundle?.owningAirportId || '',
      status: bundle?.status || 'Draft',
      validity: { 
          from: bundle?.validity?.from instanceof Date ? bundle.validity.from : (bundle?.validity?.from instanceof Timestamp ? bundle.validity.from.toDate() : new Date()), 
          to: bundle?.validity?.to instanceof Date ? bundle.validity.to : (bundle?.validity?.to instanceof Timestamp ? bundle.validity.to.toDate() : addDays(new Date(), 30)) 
      },
      components: bundle?.components || [{ value: '', isMandatory: true }],
      pricing: { 
          strategy: bundle?.pricing?.strategy || 'Static', 
          basePrice: bundle?.pricing?.basePrice || 0, 
          currency: bundle?.pricing?.currency || 'USD', 
          adjustmentType: bundle?.pricing?.adjustmentType || 'Percentage', 
          adjustmentValue: bundle?.pricing?.adjustmentValue || 0,
          floorPrice: bundle?.pricing?.floorPrice || 0,
          ceilingPrice: bundle?.pricing?.ceilingPrice || 0,
      },
      targeting: { 
          cohortIds: bundle?.targeting?.cohortIds || [], 
      },
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "components" });

  const domain = form.watch('domain');
  const owningAirlineId = form.watch('owningAirlineId');
  const owningAirportId = form.watch('owningAirportId');

  const availableAirlineAncillaries = React.useMemo(() => {
    if (domain === 'Airline' && owningAirlineId) {
        return airlineAncillaries.filter((a: any) => a.airlineId === owningAirlineId);
    }
    return airlineAncillaries;
  }, [airlineAncillaries, domain, owningAirlineId]);

  const availableAirportServices = React.useMemo(() => {
    if (domain === 'Airport' && owningAirportId) {
        return airportServices.filter((a: any) => a.airportId === owningAirportId);
    }
    return airportServices;
  }, [airportServices, domain, owningAirportId]);

  const cohortOptions = React.useMemo(() => {
      return cohorts.map((c: any) => ({
          value: c.cohortId || c.id,
          label: c.name || c.cohortId || 'Unnamed Cohort'
      }));
  }, [cohorts]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
            <TabsTrigger value="setup" className="text-[10px] uppercase font-bold py-2"><Settings className="w-3 h-3 mr-2" /> 1. Setup</TabsTrigger>
            <TabsTrigger value="products" className="text-[10px] uppercase font-bold py-2"><Layers className="w-3 h-3 mr-2" /> 2. Products</TabsTrigger>
            <TabsTrigger value="pricing" className="text-[10px] uppercase font-bold py-2"><DollarSign className="w-3 h-3 mr-2" /> 3. Pricing</TabsTrigger>
            <TabsTrigger value="targeting" className="text-[10px] uppercase font-bold py-2"><Target className="w-3 h-3 mr-2" /> 4. Targeting</TabsTrigger>
          </TabsList>

          {/* --- SETUP --- */}
          <TabsContent value="setup" className="space-y-4 pt-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="domain" render={({ field }) => (
                    <FormItem><FormLabel>Retailing Domain</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Airline">Airline Specific</SelectItem>
                            <SelectItem value="Airport">Airport Hub Specific</SelectItem>
                            <SelectItem value="Hybrid">Hybrid Ecosystem</SelectItem>
                        </SelectContent>
                    </Select></FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Offer Name</FormLabel><FormControl><Input placeholder="e.g., JFK Premium Bundle" {...field} /></FormControl></FormItem>
                )} />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {domain === 'Airline' && (
                    <FormField control={form.control} name="owningAirlineId" render={({ field }) => (
                        <FormItem><FormLabel>Select Carrier</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Which Airline?" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {airlines.map((a: any) => (
                                    <SelectItem key={a.id} value={a.id}>{a.name} ({a.icaoCode})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select></FormItem>
                    )} />
                )}
                {domain === 'Airport' && (
                    <FormField control={form.control} name="owningAirportId" render={({ field }) => (
                        <FormItem><FormLabel>Select Hub Node</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Which Airport?" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {airports.map((a: any) => (
                                    <SelectItem key={a.id} value={a.iataCode}>{a.name} ({a.iataCode})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select></FormItem>
                    )} />
                )}
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Published">Published</SelectItem><SelectItem value="Archived">Archived</SelectItem></SelectContent>
                    </Select></FormItem>
                )} />
             </div>

             <FormField control={form.control} name="validity" render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Active Period</FormLabel>
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
                                selected={{ 
                                    from: field.value?.from, 
                                    to: field.value?.to 
                                }} 
                                onSelect={(r: any) => r && field.onChange(r)} 
                                numberOfMonths={2} 
                            />
                        </PopoverContent>
                    </Popover>
                </FormItem>
            )} />
          </TabsContent>

          {/* --- PRODUCTS --- */}
          <TabsContent value="products" className="space-y-4 pt-4">
             <div className="flex items-center justify-between">
                <FormLabel>Selected Products (from Catalogue)</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '', isMandatory: true })}><PlusCircle className="h-3 w-3 mr-2" /> Add Component</Button>
             </div>
             {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg border bg-muted/20">
                    <div className="col-span-9">
                         <FormField control={form.control} name={`components.${index}.value`} render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Search SKU..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {(domain === 'Airline' || domain === 'Hybrid') && (
                                            <SelectGroup>
                                                <SelectLabel className="flex items-center gap-2"><Plane className="h-3 w-3" /> Airline Ancillaries</SelectLabel>
                                                {availableAirlineAncillaries.map((p: any) => (
                                                    <SelectItem key={p.id} value={p.id!}>{p.name} ({p.pssCode})</SelectItem>
                                                ))}
                                                {availableAirlineAncillaries.length === 0 && <SelectItem value="_none" disabled>No carrier products found</SelectItem>}
                                            </SelectGroup>
                                        )}
                                        {(domain === 'Airport' || domain === 'Hybrid') && (
                                            <SelectGroup>
                                                <SelectLabel className="flex items-center gap-2"><Building2 className="h-3 w-3" /> Airport Services</SelectLabel>
                                                {availableAirportServices.map((p: any) => (
                                                    <SelectItem key={p.id} value={p.id!}>{p.name} ({p.sku || p.pssCode})</SelectItem>
                                                ))}
                                                {availableAirportServices.length === 0 && <SelectItem value="_none_apt" disabled>No airport products found</SelectItem>}
                                            </SelectGroup>
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                    </div>
                    <div className="col-span-3 flex justify-end">
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                </div>
             ))}
          </TabsContent>

          {/* --- PRICING --- */}
          <TabsContent value="pricing" className="space-y-6 pt-4">
             <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="pricing.basePrice" render={({ field }) => (
                    <FormItem><FormLabel>Base Price</FormLabel>
                    <div className="relative"><DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><FormControl><Input type="number" className="pl-9 font-bold" {...field} /></FormControl></div></FormItem>
                )} />
                <FormField control={form.control} name="pricing.strategy" render={({ field }) => (
                    <FormItem><FormLabel>Dynamic Strategy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Static">Static Fixed</SelectItem>
                            <SelectItem value="Dynamic">Continuous pricing</SelectItem>
                            <SelectItem value="Demand">Demand-based</SelectItem>
                            <SelectItem value="Time-based">Temporal (DBD)</SelectItem>
                        </SelectContent>
                    </Select></FormItem>
                )} />
                <FormField control={form.control} name="pricing.currency" render={({ field }) => (
                    <FormItem><FormLabel>Currency</FormLabel><FormControl><Input maxLength={3} {...field} className="font-mono uppercase" /></FormControl></FormItem>
                )} />
             </div>

             <div className="space-y-4 p-4 border rounded-xl bg-primary/5">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest"><TrendingUp className="h-3 h-3" /> Yield Adjustments</div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="pricing.adjustmentType" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Percentage">Percentage %</SelectItem><SelectItem value="Fixed">Fixed Amount</SelectItem></SelectContent>
                        </Select></FormItem>
                    )} />
                    <FormField control={form.control} name="pricing.adjustmentValue" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Adjustment Value</FormLabel><FormControl><Input type="number" className="h-8" {...field} /></FormControl></FormItem>
                    )} />
                </div>
             </div>

             <div className="space-y-4 p-4 border rounded-xl bg-destructive/5">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-destructive tracking-widest"><ShieldCheck className="h-3 h-3" /> Monetization Guardrails</div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="pricing.floorPrice" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Absolute Floor (₹)</FormLabel><FormControl><Input type="number" className="h-8" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="pricing.ceilingPrice" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Absolute Ceiling (₹)</FormLabel><FormControl><Input type="number" className="h-8" {...field} /></FormControl></FormItem>
                    )} />
                </div>
             </div>
          </TabsContent>

          {/* --- TARGETING --- */}
          <TabsContent value="targeting" className="space-y-6 pt-4">
             <FormField control={form.control} name="targeting.cohortIds" render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Cohorts (Who sees this?)</FormLabel>
                  <FormControl>
                    <MultiSelect 
                      options={cohortOptions} 
                      selected={field.value || []} 
                      onChange={field.onChange} 
                      placeholder="Select configured cohorts..." 
                    />
                  </FormControl>
                  <FormDescription className="text-xs">Offer is only valid when passenger matches at least one selected cohort.</FormDescription>
                </FormItem>
              )} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
          <Button type="submit" className="px-10 font-bold">Commit Strategy</Button>
        </div>
      </form>
    </Form>
  );
}
