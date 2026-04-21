
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '../ui/separator';
import { MultiSelect } from '../ui/multi-select';
import { Checkbox } from '../ui/checkbox';
import { Plane, Building2, User, Zap, ShieldCheck, Target, Activity, Settings2, Database, BrainCircuit } from 'lucide-react';
import { Slider } from '../ui/slider';

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

  // 2. Airline Parameters
  airlineRules: z.object({
    passengerTypes: z.array(z.string()).default([]),
    loyaltyTiers: z.array(z.string()).default([]),
    corporateFlag: z.boolean().default(false),
    bookingChannels: z.array(z.string()).default([]),
    tripTypes: z.array(z.string()).default([]),
    fareBrands: z.array(z.string()).default([]),
    cabinClasses: z.array(z.string()).default([]),
    isInternational: z.boolean().optional(),
    isLongHaul: z.boolean().optional(),
    seatAssigned: z.boolean().optional(),
  }).optional(),

  // 4. Airport Parameters
  airportRules: z.object({
    airportCodes: z.array(z.string()).default([]),
    terminals: z.array(z.string()).default([]),
    checkedIn: z.boolean().optional(),
    bagsDropped: z.boolean().optional(),
    minWaitTime: z.coerce.number().optional(),
    locationContext: z.enum(['Anywhere', 'Departure', 'Arrival', 'Lounge', 'Gate']).default('Anywhere'),
  }).optional(),

  // 3 & 5. Output Actions
  outputs: z.object({
    eligibleProducts: z.array(z.string()).default([]),
    bundleIds: z.array(z.string()).default([]),
    discount: z.coerce.number().min(0).max(100).default(0),
    markup: z.coerce.number().min(0).default(0),
    rankingBoost: z.coerce.number().default(0),
    messageTemplate: z.string().optional(),
  }).optional(),

  // 6. Personalization Layer
  personalization: z.object({
    propensityToBuyScore: z.coerce.number().optional(),
    priceSensitivityScore: z.coerce.number().optional(),
    isUpsellCandidate: z.boolean().optional(),
    minPriceFloor: z.coerce.number().optional(),
    maxPriceCap: z.coerce.number().optional(),
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

export function CohortForm({ cohort, onSubmit, onCancel }: CohortFormProps) {
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
      airlineRules: { passengerTypes: [], loyaltyTiers: [], bookingChannels: [], tripTypes: [], fareBrands: [], cabinClasses: [] },
      airportRules: { airportCodes: [], terminals: [], locationContext: 'Anywhere' },
      outputs: { eligibleProducts: [], bundleIds: [], discount: 0, markup: 0, rankingBoost: 0 },
      personalization: { propensityToBuyScore: 0, priceSensitivityScore: 0 },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted">
            <TabsTrigger value="general" className="text-[10px] uppercase font-bold py-2"><Settings2 className="w-3 h-3 mr-1" /> Core</TabsTrigger>
            <TabsTrigger value="airline" className="text-[10px] uppercase font-bold py-2"><Plane className="w-3 h-3 mr-1" /> Airline</TabsTrigger>
            <TabsTrigger value="airport" className="text-[10px] uppercase font-bold py-2"><Building2 className="w-3 h-3 mr-1" /> Airport</TabsTrigger>
            <TabsTrigger value="outputs" className="text-[10px] uppercase font-bold py-2"><Zap className="w-3 h-3 mr-1" /> Actions</TabsTrigger>
            <TabsTrigger value="predictive" className="text-[10px] uppercase font-bold py-2"><BrainCircuit className="w-3 h-3 mr-1" /> Personalized</TabsTrigger>
          </TabsList>

          {/* --- GENERAL SETTINGS --- */}
          <TabsContent value="general" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Master Cohort Name</FormLabel><FormControl><Input placeholder="e.g., LHR Priority Business" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="cohortId" render={({ field }) => (
                <FormItem><FormLabel>System ID (Unique)</FormLabel><FormControl><Input placeholder="e.g., LHR_BIZ_PREM" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Functional Description</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Evaluation Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="static">Static (Rule-based)</SelectItem><SelectItem value="dynamic">Dynamic (Real-time)</SelectItem><SelectItem value="predictive">Predictive (ML)</SelectItem></SelectContent></Select></FormItem>
              )} />
              <FormField control={form.control} name="evaluation_mode" render={({ field }) => (
                <FormItem><FormLabel>Mode</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="real-time">Real-time Evaluate</SelectItem><SelectItem value="cached">Cached Entry</SelectItem><SelectItem value="batch">Batch Pre-process</SelectItem></SelectContent></Select></FormItem>
              )} />
               <FormField control={form.control} name="priority" render={({ field }) => (
                <FormItem><div className="flex justify-between"><FormLabel>Priority Rank</FormLabel><span className="text-xs font-bold">{field.value}</span></div>
                <FormControl><Slider min={1} max={100} value={[field.value]} onValueChange={(v) => field.onChange(v[0])} /></FormControl></FormItem>
              )} />
            </div>
          </TabsContent>

          {/* --- AIRLINE RULES --- */}
          <TabsContent value="airline" className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><User className="w-3 h-3"/> Passenger Profile</h4>
                <FormField control={form.control} name="airlineRules.loyaltyTiers" render={({ field }) => (
                  <FormItem><FormLabel>Loyalty Tiers</FormLabel><MultiSelect options={tierOptions} selected={field.value || []} onChange={field.onChange} placeholder="All Tiers" /></FormItem>
                )} />
                <FormField control={form.control} name="airlineRules.corporateFlag" render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0 rounded-md border p-3 bg-muted/20">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="leading-none"><FormLabel>Corporate Traveler Only</FormLabel><FormDescription className="text-[10px]">Identify via B2B/Contract IDs.</FormDescription></div>
                  </FormItem>
                )} />
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><Database className="w-3 h-3"/> PNR & Itinerary</h4>
                <FormField control={form.control} name="airlineRules.cabinClasses" render={({ field }) => (
                  <FormItem><FormLabel>Eligible Cabins</FormLabel><MultiSelect options={cabinOptions} selected={field.value || []} onChange={field.onChange} placeholder="All Cabins" /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <FormField control={form.control} name="airlineRules.isInternational" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Intl. Travel</FormLabel></FormItem>
                  )} />
                   <FormField control={form.control} name="airlineRules.seatAssigned" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Has Seat Assigned</FormLabel></FormItem>
                  )} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* --- AIRPORT RULES --- */}
          <TabsContent value="airport" className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><Target className="w-3 h-3"/> Location Context</h4>
                <FormField control={form.control} name="airportRules.locationContext" render={({ field }) => (
                  <FormItem><FormLabel>Physical Presence</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent><SelectItem value="Anywhere">Anywhere in Ecosystem</SelectItem><SelectItem value="Departure">Departure Concourse</SelectItem><SelectItem value="Arrival">Arriving / Baggage</SelectItem><SelectItem value="Lounge">Inside Partner Lounge</SelectItem><SelectItem value="Gate">At Assigned Gate</SelectItem></SelectContent></Select></FormItem>
                )} />
                <FormField control={form.control} name="airportRules.airportCodes" render={({ field }) => (
                  <FormItem><FormLabel>Airport Nodes</FormLabel><FormControl><Input placeholder="e.g., LHR, JFK" {...field} /></FormControl><FormDescription className="text-[10px]">Comma separated list.</FormDescription></FormItem>
                )} />
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><Activity className="w-3 h-3"/> Real-time State</h4>
                <FormField control={form.control} name="airportRules.minWaitTime" render={({ field }) => (
                  <FormItem><FormLabel>Security Wait &gt; (Mins)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormDescription className="text-[10px]">Trigger if terminal wait exceeds limit.</FormDescription></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <FormField control={form.control} name="airportRules.checkedIn" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Checked-in</FormLabel></FormItem>
                  )} />
                   <FormField control={form.control} name="airportRules.bagsDropped" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Bags Dropped</FormLabel></FormItem>
                  )} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* --- OUTPUT ACTIONS --- */}
          <TabsContent value="outputs" className="space-y-6 py-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><Database className="w-3 h-3"/> Retailing Eligibility</h4>
                  <FormField control={form.control} name="outputs.bundleIds" render={({ field }) => (
                    <FormItem><FormLabel>Force-Include Bundles</FormLabel><FormControl><Input placeholder="e.g., BUN-001, BUN-002" {...field} /></FormControl></FormItem>
                  )} />
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> Pricing & Ranking</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="outputs.discount" render={({ field }) => (
                      <FormItem><FormLabel>Apply Discount (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="outputs.rankingBoost" render={({ field }) => (
                      <FormItem><FormLabel>Ranking Boost (Score)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                </div>
             </div>
          </TabsContent>

          {/* --- PERSONALIZATION LAYER --- */}
          <TabsContent value="predictive" className="space-y-6 py-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 border rounded-lg bg-indigo-50/50">
                    <h4 className="text-xs font-black uppercase text-indigo-700 tracking-widest flex items-center gap-2"><BrainCircuit className="w-3 h-3"/> ML Scoring Thresholds</h4>
                    <FormField control={form.control} name="personalization.propensityToBuyScore" render={({ field }) => (
                      <FormItem><div className="flex justify-between"><FormLabel>Propensity to Buy &gt;</FormLabel><span className="font-bold">{field.value}%</span></div>
                      <FormControl><Slider min={0} max={100} value={[field.value || 0]} onValueChange={(v) => field.onChange(v[0])} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="personalization.priceSensitivityScore" render={({ field }) => (
                      <FormItem><div className="flex justify-between"><FormLabel>Price Sensitivity &lt;</FormLabel><span className="font-bold">{field.value}%</span></div>
                      <FormControl><Slider min={0} max={100} value={[field.value || 0]} onValueChange={(v) => field.onChange(v[0])} /></FormControl></FormItem>
                    )} />
                </div>
                <div className="space-y-4 p-4 border rounded-lg bg-emerald-50/50">
                    <h4 className="text-xs font-black uppercase text-emerald-700 tracking-widest flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> Commercial Guardrails</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="personalization.minPriceFloor" render={({ field }) => (
                        <FormItem><FormLabel>Min Price Floor ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="personalization.maxPriceCap" render={({ field }) => (
                        <FormItem><FormLabel>Max Price Cap ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                </div>
             </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Discard Changes</Button>
          <Button type="submit" className="px-8 font-bold">Commit Segment to Ecosystem</Button>
        </div>
      </form>
    </Form>
  );
}
