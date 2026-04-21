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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '../ui/separator';
import { MultiSelect } from '../ui/multi-select';
import { Checkbox } from '../ui/checkbox';
import { Plane, Building2, Settings2, BrainCircuit, Globe, Laptop, MapPin, Target } from 'lucide-react';
import { Slider } from '../ui/slider';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';

const cohortSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Cohort name is required.'),
  cohortId: z.string().min(3, 'Cohort ID required.').regex(/^[A-Z0-9_]+$/),
  description: z.string().min(10),
  type: z.enum(['static', 'dynamic', 'predictive']).default('static'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  priority: z.coerce.number().min(1).max(100).default(50),
  evaluation_mode: z.enum(['real-time', 'cached', 'batch']).default('real-time'),
  combination_logic: z.enum(['AND', 'OR']).default('AND'),
  override_flag: z.boolean().default(false),

  // Airline Parameters (Targeting Logic)
  airlineRules: z.object({
    carrierCodes: z.array(z.string()).default([]),
    passengerTypes: z.array(z.string()).default([]),
    loyaltyTiers: z.array(z.string()).default([]),
    corporateFlag: z.boolean().default(false),
    cabinClasses: z.array(z.string()).default([]),
    isInternational: z.boolean().optional(),
    isLongHaul: z.boolean().optional(),
  }).optional(),

  // Airport Parameters (Targeting Logic)
  airportRules: z.object({
    airportCodes: z.array(z.string()).default([]),
    terminals: z.array(z.string()).default([]),
    locationContext: z.enum(['Anywhere', 'Departure', 'Arrival', 'Lounge', 'Gate']).default('Anywhere'),
    minWaitTime: z.coerce.number().optional(),
  }).optional(),

  // Geo, Channel & Sector (Targeting Logic)
  ecosystemScope: z.object({
    channels: z.array(z.string()).default([]),
    regions: z.array(z.string()).default([]),
    countries: z.array(z.string()).default([]),
    pos: z.array(z.string()).default([]),
    sectors: z.array(z.string()).default([]),
  }).optional(),

  // Personalization Layer (Scoring Logic)
  personalization: z.object({
    propensityToBuyScore: z.coerce.number().optional(),
    priceSensitivityScore: z.coerce.number().optional(),
  }).optional(),
});

export type Cohort = z.infer<typeof cohortSchema>;

interface CohortFormProps {
  cohort: Cohort | null;
  onSubmit: (data: Cohort) => void;
  onCancel: () => void;
}

const tierOptions = [{ value: 'Bronze', label: 'Bronze' }, { value: 'Silver', label: 'Silver' }, { value: 'Gold', label: 'Gold' }, { value: 'Platinum', label: 'Platinum' }];
const cabinOptions = [{ value: 'Economy', label: 'Economy' }, { value: 'Premium', label: 'Premium' }, { value: 'Business', label: 'Business' }, { value: 'First', label: 'First' }];
const channelOptions = [
    { value: 'Web', label: 'Web Direct' }, 
    { value: 'App', label: 'Mobile App' }, 
    { value: 'CUSS', label: 'SITA CUSS Kiosk' }, 
    { value: 'CUTE', label: 'SITA CUTE Agent' },
    { value: 'CUPPS', label: 'SITA CUPPS' },
    { value: 'OTA', label: 'OTA' },
    { value: 'NDC', label: 'NDC API' },
];
const regionOptions = [{ value: 'EU', label: 'Europe' }, { value: 'APAC', label: 'Asia-Pacific' }, { value: 'NAM', label: 'North America' }, { value: 'ME', label: 'Middle East' }, { value: 'LATAM', label: 'Latin America' }];

const fallbackAirlines = [
    { value: 'GAB', label: 'Global Airways (GAB)' },
    { value: 'SBA', label: 'SkyBridge Airlines (SBA)' },
    { value: 'MLN', label: 'MetroLink Air (MLN)' },
];

export function CohortForm({ cohort, onSubmit, onCancel }: CohortFormProps) {
  const firestore = useFirestore();
  const airlinesQuery = useMemo(() => firestore ? collection(firestore, 'airlines') : undefined, [firestore]);
  const { data: airlinesData } = useCollection(airlinesQuery);

  const airlineOptions = useMemo(() => {
    const options = (airlinesData || []).map((a: any) => ({
        value: a.icaoCode,
        label: `${a.name} (${a.icaoCode})`
    }));
    return options.length > 0 ? options : fallbackAirlines;
  }, [airlinesData]);

  const form = useForm<Cohort>({
    resolver: zodResolver(cohortSchema),
    defaultValues: cohort || {
      name: '',
      cohortId: '',
      description: '',
      type: 'static',
      status: 'Active',
      priority: 50,
      evaluation_mode: 'real-time',
      combination_logic: 'AND',
      override_flag: false,
      airlineRules: { carrierCodes: [], passengerTypes: [], loyaltyTiers: [], cabinClasses: [] },
      airportRules: { airportCodes: [], terminals: [], locationContext: 'Anywhere' },
      ecosystemScope: { channels: [], regions: [], countries: [], pos: [], sectors: [] },
      personalization: { propensityToBuyScore: 0, priceSensitivityScore: 0 },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted">
            <TabsTrigger value="general" className="text-[10px] uppercase font-bold py-2"><Settings2 className="w-3 h-3 mr-1" /> Core Identity</TabsTrigger>
            <TabsTrigger value="scope" className="text-[10px] uppercase font-bold py-2"><Globe className="w-3 h-3 mr-1" /> Geo & Channel</TabsTrigger>
            <TabsTrigger value="airline" className="text-[10px] uppercase font-bold py-2"><Plane className="w-3 h-3 mr-1" /> Airline Context</TabsTrigger>
            <TabsTrigger value="airport" className="text-[10px] uppercase font-bold py-2"><Building2 className="w-3 h-3 mr-1" /> Airport Context</TabsTrigger>
            <TabsTrigger value="predictive" className="text-[10px] uppercase font-bold py-2"><BrainCircuit className="w-3 h-3 mr-1" /> ML Signals</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Cohort Display Name</FormLabel><FormControl><Input placeholder="e.g., LHR High-Wait Business" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="cohortId" render={({ field }) => (
                <FormItem><FormLabel>Cohort ID (Upper/Alpha)</FormLabel><FormControl><Input placeholder="e.g., LHR_BIZ_LATE" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Logical Description</FormLabel><FormControl><Input placeholder="Define the business intent for this segment..." {...field} /></FormControl></FormItem>
            )} />
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Segment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="static">Static Rules</SelectItem><SelectItem value="dynamic">Dynamic Real-time</SelectItem><SelectItem value="predictive">Predictive (AI)</SelectItem></SelectContent></Select></FormItem>
              )} />
              <FormField control={form.control} name="evaluation_mode" render={({ field }) => (
                <FormItem><FormLabel>Evaluation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="real-time">Request-time</SelectItem><SelectItem value="cached">Cache-lookup</SelectItem><SelectItem value="batch">Batch Job</SelectItem></SelectContent></Select></FormItem>
              )} />
               <FormField control={form.control} name="priority" render={({ field }) => (
                <FormItem><div className="flex justify-between"><FormLabel>Priority (1-100)</FormLabel><span className="text-xs font-bold text-primary">{field.value}</span></div>
                <FormControl><Slider min={1} max={100} value={[field.value]} onValueChange={(v) => field.onChange(v[0])} /></FormControl></FormItem>
              )} />
            </div>
          </TabsContent>

          <TabsContent value="scope" className="space-y-6 py-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><Laptop className="w-3 h-3"/> Sales Channels</h4>
                    <FormField control={form.control} name="ecosystemScope.channels" render={({ field }) => (
                        <FormItem><FormLabel>Authorized Channels</FormLabel>
                        <MultiSelect options={channelOptions} selected={field.value || []} onChange={field.onChange} placeholder="All SITA Channels" /></FormItem>
                    )} />
                </div>
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><Globe className="w-3 h-3"/> Geography & POS</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="ecosystemScope.regions" render={({ field }) => (
                            <FormItem><FormLabel>Target Regions</FormLabel>
                            <MultiSelect options={regionOptions} selected={field.value || []} onChange={field.onChange} placeholder="Global" /></FormItem>
                        )} />
                         <FormField control={form.control} name="ecosystemScope.countries" render={({ field }) => (
                            <FormItem><FormLabel>ISO Countries</FormLabel><FormControl><Input placeholder="e.g., US, IN, GB" {...field} /></FormControl></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="ecosystemScope.pos" render={({ field }) => (
                        <FormItem><FormLabel>Point of Sale (POS) Nodes</FormLabel><FormControl><Input placeholder="e.g., NYC, LON, BOM" {...field} /></FormControl></FormItem>
                    )} />
                </div>
             </div>
             <Separator />
             <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3"/> Sector Mapping</h4>
                <FormField control={form.control} name="ecosystemScope.sectors" render={({ field }) => (
                    <FormItem><FormLabel>Eligible Sectors / O&D Pairs</FormLabel><FormControl><Input placeholder="e.g., LHR-JFK, SIN-HKG" {...field} /></FormControl></FormItem>
                )} />
             </div>
          </TabsContent>

          <TabsContent value="airline" className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><Target className="w-3 h-3"/> Profile & Loyalty</h4>
                <FormField control={form.control} name="airlineRules.carrierCodes" render={({ field }) => (
                    <FormItem><FormLabel>Airline / Carrier Scope</FormLabel>
                    <MultiSelect options={airlineOptions} selected={field.value || []} onChange={field.onChange} placeholder="All Onboarded Carriers" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="airlineRules.loyaltyTiers" render={({ field }) => (
                  <FormItem><FormLabel>Loyalty Tiers</FormLabel><MultiSelect options={tierOptions} selected={field.value || []} onChange={field.onChange} placeholder="All Tiers" /></FormItem>
                )} />
                <FormField control={form.control} name="airlineRules.corporateFlag" render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0 rounded-md border p-3 bg-muted/20">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="leading-none"><FormLabel>B2B / Corporate Only</FormLabel></div>
                  </FormItem>
                )} />
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><Plane className="w-3 h-3"/> PNR & Cabin</h4>
                <FormField control={form.control} name="airlineRules.cabinClasses" render={({ field }) => (
                  <FormItem><FormLabel>Eligible Cabins</FormLabel><MultiSelect options={cabinOptions} selected={field.value || []} onChange={field.onChange} placeholder="All Cabins" /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <FormField control={form.control} name="airlineRules.isInternational" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Intl. Sector</FormLabel></FormItem>
                  )} />
                   <FormField control={form.control} name="airlineRules.isLongHaul" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Long Haul</FormLabel></FormItem>
                  )} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="airport" className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><Building2 className="w-3 h-3"/> Location Node</h4>
                <FormField control={form.control} name="airportRules.locationContext" render={({ field }) => (
                  <FormItem><FormLabel>Journey Stage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent><SelectItem value="Anywhere">Anywhere</SelectItem><SelectItem value="Departure">Pre-Departure</SelectItem><SelectItem value="Arrival">On-Arrival</SelectItem><SelectItem value="Lounge">In-Lounge</SelectItem><SelectItem value="Gate">At Gate</SelectItem></SelectContent></Select></FormItem>
                )} />
                <FormField control={form.control} name="airportRules.airportCodes" render={({ field }) => (
                  <FormItem><FormLabel>Specific Airport Hubs</FormLabel><FormControl><Input placeholder="e.g., LHR, JFK, DXB" {...field} /></FormControl></FormItem>
                )} />
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><Laptop className="w-3 h-3"/> Operational State</h4>
                <FormField control={form.control} name="airportRules.minWaitTime" render={({ field }) => (
                  <FormItem><FormLabel>Security Wait > (Mins)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6 py-4">
             <div className="space-y-4 p-4 border rounded-lg bg-indigo-50/50">
                <h4 className="text-xs font-black uppercase text-indigo-700 tracking-widest flex items-center gap-2"><BrainCircuit className="w-3 h-3"/> ML Propensity Scoring</h4>
                <div className="grid grid-cols-2 gap-8">
                    <FormField control={form.control} name="personalization.propensityToBuyScore" render={({ field }) => (
                      <FormItem><div className="flex justify-between"><FormLabel>Propensity Score ></FormLabel><span className="font-bold text-indigo-600">{field.value}%</span></div>
                      <FormControl><Slider min={0} max={100} value={[field.value || 0]} onValueChange={(v) => field.onChange(v[0])} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="personalization.priceSensitivityScore" render={({ field }) => (
                      <FormItem><div className="flex justify-between"><FormLabel>Sensitivity <</FormLabel><span className="font-bold text-indigo-600">{field.value}%</span></div>
                      <FormControl><Slider min={0} max={100} value={[field.value || 0]} onValueChange={(v) => field.onChange(v[0])} /></FormControl></FormItem>
                    )} />
                </div>
                <p className="text-[10px] text-indigo-600/70 italic mt-2">These scores are dynamically calculated by the SITA Intelligence engine and used for real-time segment matching.</p>
             </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="px-10 font-bold">Define Segment</Button>
        </div>
      </form>
    </Form>
  );
}
