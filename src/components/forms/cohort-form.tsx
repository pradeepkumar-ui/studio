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
import { Separator } from '@/components/ui/separator';
import { MultiSelect } from '@/components/ui/multi-select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plane, 
  Building2, 
  Settings, 
  BrainCircuit, 
  Globe, 
  Laptop, 
  MapPin, 
  Target, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Users 
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

const cohortSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Cohort name is required.'),
  cohortId: z.string().min(3, 'Cohort ID required.').regex(/^[A-Z0-9_]+$/),
  description: z.string().min(10, 'Logical description required.'),
  type: z.enum(['static', 'dynamic', 'predictive']).default('static'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  priority: z.coerce.number().min(1).max(100).default(50),
  evaluation_mode: z.enum(['real-time', 'cached', 'batch']).default('real-time'),
  combination_logic: z.enum(['AND', 'OR']).default('AND'),
  override_flag: z.boolean().default(false),

  airlineRules: z.object({
    carrierCodes: z.array(z.string()).default([]),
    passengerTypes: z.array(z.string()).default([]),
    loyaltyTiers: z.array(z.string()).default([]),
    corporateFlag: z.boolean().default(false),
    cabinClasses: z.array(z.string()).default([]),
    isInternational: z.boolean().optional(),
    isLongHaul: z.boolean().optional(),
  }).optional(),

  airportRules: z.object({
    airportCodes: z.array(z.string()).default([]),
    terminals: z.array(z.string()).default([]),
    locationContext: z.enum(['Anywhere', 'Departure', 'Arrival', 'Lounge', 'Gate']).default('Anywhere'),
    minWaitTime: z.coerce.number().optional(),
    loungeOccupancy: z.coerce.number().optional(),
  }).optional(),

  ecosystemScope: z.object({
    channels: z.array(z.string()).default([]),
    regions: z.array(z.string()).default([]),
    countries: z.array(z.string()).default([]),
    pos: z.array(z.string()).default([]),
    sectors: z.array(z.string()).default([]),
  }).optional(),

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

const tierOptions = [
  { value: 'Bronze', label: 'Bronze' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Gold', label: 'Gold' },
  { value: 'Platinum', label: 'Platinum' }
];

const cabinOptions = [
  { value: 'Economy', label: 'Economy' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Business', label: 'Business' },
  { value: 'First', label: 'First' }
];

const channelOptions = [
  { value: 'Web', label: 'Web Direct' },
  { value: 'App', label: 'Mobile App' },
  { value: 'CUSS', label: 'SITA CUSS Kiosk' },
  { value: 'CUTE', label: 'SITA CUTE Agent' },
  { value: 'CUPPS', label: 'SITA CUPPS' },
  { value: 'OTA', label: 'OTA' },
  { value: 'NDC', label: 'NDC API' },
];

const regionOptions = [
  { value: 'EU', label: 'Europe' },
  { value: 'APAC', label: 'Asia-Pacific' },
  { value: 'NAM', label: 'North America' },
  { value: 'ME', label: 'Middle East' },
  { value: 'LATAM', label: 'Latin America' }
];

const paxTypeOptions = [
  { value: 'ADT', label: 'Adult' },
  { value: 'CHD', label: 'Child' },
  { value: 'INF', label: 'Infant' }
];

export function CohortForm({ cohort, onSubmit, onCancel }: CohortFormProps) {
  const firestore = useFirestore();
  const airlinesQuery = React.useMemo(() => firestore ? collection(firestore, 'airlines') : undefined, [firestore]);
  const { data: airlinesData } = useCollection(airlinesQuery);

  const airlineOptions = React.useMemo(() => {
    const options = (airlinesData || []).map((a: any) => ({
      value: a.icaoCode,
      label: `${a.name} (${a.icaoCode})`
    }));
    return options.length > 0 ? options : [
      { value: 'GAB', label: 'Global Airways (GAB)' },
      { value: 'SBA', label: 'SkyBridge Airlines (SBA)' }
    ];
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
            <TabsTrigger value="general" className="text-[10px] uppercase font-bold py-2">
              <Settings className="w-3 h-3 mr-1" /> General
            </TabsTrigger>
            <TabsTrigger value="scope" className="text-[10px] uppercase font-bold py-2">
              <Globe className="w-3 h-3 mr-1" /> Geography
            </TabsTrigger>
            <TabsTrigger value="airline" className="text-[10px] uppercase font-bold py-2">
              <Plane className="w-3 h-3 mr-1" /> Airline
            </TabsTrigger>
            <TabsTrigger value="airport" className="text-[10px] uppercase font-bold py-2">
              <Building2 className="w-3 h-3 mr-1" /> Airport
            </TabsTrigger>
            <TabsTrigger value="predictive" className="text-[10px] uppercase font-bold py-2">
              <BrainCircuit className="w-3 h-3 mr-1" /> Predictive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cohort Display Name</FormLabel>
                  <FormControl><Input placeholder="e.g., LHR High-Wait Business" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="cohortId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cohort ID (Upper/Alpha)</FormLabel>
                  <FormControl><Input placeholder="e.g., LHR_BIZ_LATE" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Input placeholder="Segment intent..." {...field} /></FormControl>
              </FormItem>
            )} />
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="static">Static Rules</SelectItem>
                      <SelectItem value="dynamic">Dynamic Real-time</SelectItem>
                      <SelectItem value="predictive">Predictive (AI)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name="evaluation_mode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaluation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="real-time">Request-time</SelectItem>
                      <SelectItem value="cached">Cache-lookup</SelectItem>
                      <SelectItem value="batch">Batch Job</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name="priority" render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Priority</FormLabel>
                    <span className="text-xs font-bold text-primary">{field.value}</span>
                  </div>
                  <FormControl>
                    <Slider 
                      min={1} 
                      max={100} 
                      step={1} 
                      value={[field.value]} 
                      onValueChange={(v) => field.onChange(v[0])} 
                    />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </TabsContent>

          <TabsContent value="scope" className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary flex items-center gap-2">
                  <Laptop className="w-3 h-3" /> Sales Channels
                </h4>
                <FormField control={form.control} name="ecosystemScope.channels" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authorized Channels</FormLabel>
                    <FormControl>
                      <MultiSelect 
                        options={channelOptions} 
                        selected={field.value || []} 
                        onChange={field.onChange} 
                        placeholder="All Channels" 
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Geo & POS
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="ecosystemScope.regions" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regions</FormLabel>
                      <FormControl>
                        <MultiSelect 
                          options={regionOptions} 
                          selected={field.value || []} 
                          onChange={field.onChange} 
                          placeholder="Global" 
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="ecosystemScope.countries" render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISO Countries</FormLabel>
                      <FormControl><Input placeholder="US, IN, GB" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="airline" className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary flex items-center gap-2">
                  <Users className="w-3 h-3" /> Profile & Loyalty
                </h4>
                <FormField control={form.control} name="airlineRules.carrierCodes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carrier Scope</FormLabel>
                    <FormControl>
                      <MultiSelect 
                        options={airlineOptions} 
                        selected={field.value || []} 
                        onChange={field.onChange} 
                        placeholder="All Carriers" 
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="airlineRules.loyaltyTiers" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loyalty Tiers</FormLabel>
                    <FormControl>
                      <MultiSelect 
                        options={tierOptions} 
                        selected={field.value || []} 
                        onChange={field.onChange} 
                        placeholder="All Tiers" 
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary flex items-center gap-2">
                  <Plane className="w-3 h-3" /> Itinerary
                </h4>
                <FormField control={form.control} name="airlineRules.cabinClasses" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eligible Cabins</FormLabel>
                    <FormControl>
                      <MultiSelect 
                        options={cabinOptions} 
                        selected={field.value || []} 
                        onChange={field.onChange} 
                        placeholder="All Cabins" 
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <FormField control={form.control} name="airlineRules.isInternational" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <FormLabel className="text-xs">International</FormLabel>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="airlineRules.isLongHaul" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <FormLabel className="text-xs">Long Haul</FormLabel>
                    </FormItem>
                  )} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="airport" className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Nodes
                </h4>
                <FormField control={form.control} name="airportRules.locationContext" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journey Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Anywhere">Anywhere</SelectItem>
                        <SelectItem value="Departure">Pre-Departure</SelectItem>
                        <SelectItem value="Arrival">On-Arrival</SelectItem>
                        <SelectItem value="Lounge">In-Lounge</SelectItem>
                        <SelectItem value="Gate">At Gate</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="airportRules.airportCodes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hub Codes</FormLabel>
                    <FormControl><Input placeholder="LHR, JFK, DXB" {...field} /></FormControl>
                  </FormItem>
                )} />
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-primary flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Live Signals
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="airportRules.minWaitTime" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wait Time &gt; (Min)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="airportRules.loungeOccupancy" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lounge &gt; (%)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6 py-4">
            <div className="space-y-4 p-4 border rounded-lg bg-indigo-50/50">
              <h4 className="text-xs font-black uppercase text-indigo-700 flex items-center gap-2">
                <BrainCircuit className="w-3 h-3" /> ML Scoring
              </h4>
              <div className="grid grid-cols-2 gap-8">
                <FormField control={form.control} name="personalization.propensityToBuyScore" render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Propensity &gt;</FormLabel>
                      <span className="font-bold text-indigo-600">{field.value || 0}%</span>
                    </div>
                    <FormControl>
                      <Slider 
                        min={0} 
                        max={100} 
                        value={[field.value || 0]} 
                        onValueChange={(v) => field.onChange(v[0])} 
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="personalization.priceSensitivityScore" render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Sensitivity &lt;</FormLabel>
                      <span className="font-bold text-indigo-600">{field.value || 0}%</span>
                    </div>
                    <FormControl>
                      <Slider 
                        min={0} 
                        max={100} 
                        value={[field.value || 0]} 
                        onValueChange={(v) => field.onChange(v[0])} 
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="px-10 font-bold">Commit Segment</Button>
        </div>
      </form>
    </Form>
  );
}
