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
import { Separator } from '@/components/ui/separator';
import { MultiSelect } from '@/components/ui/multi-select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Building2, 
  Settings, 
  MapPin, 
  Activity, 
  Users,
  Trophy,
  Ticket,
  Clock,
  Accessibility,
  Store,
  Signal,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

const airportCohortSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Cohort name is required.'),
  cohortId: z.string().min(3, 'Cohort ID required.').toUpperCase(),
  airportCode: z.string().min(1, 'Select a target airport.'),
  description: z.string().min(10, 'Logical description required.'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  priority: z.coerce.number().min(1).max(100).default(50),

  // --- EXHAUSTIVE AIRPORT PARAMETERS ---
  airportParams: z.object({
    passengerJourneyType: z.enum(['Any', 'Departure', 'Arrival', 'Transit']).default('Any'),
    connectionLayover: z.enum(['Any', 'Short connection', 'Long layover']).default('Any'),
    passengerType: z.array(z.string()).default([]), // Solo, Family, Group, Corporate, VIP
    loyaltyTiers: z.array(z.string()).default([]),
    cabinClasses: z.array(z.string()).default([]),
    timeToDeparture: z.enum(['Any', 'Early arrival', 'Last-minute passenger']).default('Any'),
    airportBehavior: z.array(z.string()).default([]), // Lounge, Fast-track, Concierge
    comfortPreference: z.enum(['Any', 'Premium traveler', 'Time-saving traveler']).default('Any'),
    mobilityNeeds: z.array(z.string()).default([]), // Elderly, Wheelchair, Infant
    groupIndicator: z.array(z.string()).default([]), // Children, Large group
    spendBehavior: z.array(z.string()).default([]), // Lounge, Transfers, Services
    channelContext: z.array(z.string()).default([]), // App, Kiosk, Agent, Desk
  }),
});

export type AirportCohort = z.infer<typeof airportCohortSchema>;

const paxTypeOpts = [
    { value: 'Solo', label: 'Solo Traveler' },
    { value: 'Family', label: 'Family' },
    { value: 'Group', label: 'Large Group' },
    { value: 'Corporate', label: 'Corporate' },
    { value: 'VIP', label: 'VIP / CIP' }
];

const tierOpts = [
    { value: 'Silver', label: 'Silver' },
    { value: 'Gold', label: 'Gold' },
    { value: 'Platinum', label: 'Platinum' }
];

const cabinOpts = [
    { value: 'Economy', label: 'Economy' },
    { value: 'Premium Economy', label: 'Premium Economy' },
    { value: 'Business', label: 'Business' },
    { value: 'First', label: 'First' }
];

const behaviorOpts = [
    { value: 'lounge', label: 'Lounge User' },
    { value: 'fast-track', label: 'Fast-Track User' },
    { value: 'concierge', label: 'Concierge User' }
];

const mobilityOpts = [
    { value: 'elderly', label: 'Elderly' },
    { value: 'wheelchair', label: 'Wheelchair' },
    { value: 'infant', label: 'Infant Traveler' }
];

const indicatorOpts = [
    { value: 'children', label: 'Traveling with Children' },
    { value: 'large_group', label: 'Large Group indicator' }
];

const spendOpts = [
    { value: 'lounge_spend', label: 'Lounge Spend' },
    { value: 'transfers_spend', label: 'Transfer Spend' },
    { value: 'services_spend', label: 'Service Spend' }
];

const channelOpts = [
    { value: 'app', label: 'Mobile App' },
    { value: 'kiosk', label: 'CUSS Kiosk' },
    { value: 'agent', label: 'Agent (SITA CUTE)' },
    { value: 'desk', label: 'Airport Desk' }
];

const mockAirportsFallback = [
    { id: '1', name: 'Heathrow Airport', iataCode: 'LHR' },
    { id: '2', name: 'John F. Kennedy', iataCode: 'JFK' },
    { id: '3', name: 'Changi Airport', iataCode: 'SIN' },
];

export function AirportCohortForm({ cohort, onSubmit, onCancel }: { cohort: AirportCohort | null, onSubmit: (data: AirportCohort) => void, onCancel: () => void }) {
  const firestore = useFirestore();
  const airportsQuery = React.useMemo(() => firestore ? collection(firestore, 'airports') : undefined, [firestore]);
  const { data: airportsCollection } = useCollection(airportsQuery);
  const airports = (airportsCollection && airportsCollection.length > 0) ? airportsCollection : mockAirportsFallback;

  const form = useForm<AirportCohort>({
    resolver: zodResolver(airportCohortSchema),
    defaultValues: cohort || {
      name: '',
      cohortId: '',
      airportCode: '',
      description: '',
      status: 'Active',
      priority: 50,
      airportParams: {
        passengerJourneyType: 'Any',
        connectionLayover: 'Any',
        passengerType: [],
        loyaltyTiers: [],
        cabinClasses: [],
        timeToDeparture: 'Any',
        airportBehavior: [],
        comfortPreference: 'Any',
        mobilityNeeds: [],
        groupIndicator: [],
        spendBehavior: [],
        channelContext: [],
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
        
        {/* --- SECTION 1: MASTER IDENTITY & HUB --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <Settings className="h-3.5 w-3.5" /> 1. Segment Identity & Hub Node
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cohort Name</FormLabel>
                  <FormControl><Input placeholder="e.g., LHR T5 Premium Transit" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="airportCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Authorized Hub Node</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select Hub..." /></SelectTrigger></FormControl>
                    <SelectContent>
                        {airports.map((a: any) => (
                            <SelectItem key={a.id} value={a.iataCode}>{a.name} ({a.iataCode})</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="cohortId" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Logical Cohort ID</FormLabel>
                    <FormControl><Input placeholder="e.g., LHR_TRANSIT_PREMIUM" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="priority" render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Engine Priority</FormLabel>
                    <span className="text-xs font-bold text-primary">{field.value}</span>
                  </div>
                  <FormControl>
                    <Slider min={1} max={100} step={1} value={[field.value]} onValueChange={(v) => field.onChange(v[0])} />
                  </FormControl>
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Segment Intent Description</FormLabel>
                <FormControl><Input placeholder="Explain the commercial logic of this hub segment..." {...field} /></FormControl>
              </FormItem>
            )} />
        </section>

        <Separator />

        {/* --- SECTION 2: AIRPORT PARAMETERS --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <Building2 className="h-3.5 w-3.5" /> 2. Airport Ecosystem Parameters
            </div>
            
            <Accordion type="multiple" className="w-full">
                {/* JOURNEY & CONNECTION */}
                <AccordionItem value="journey">
                    <AccordionTrigger className="text-sm font-bold"><MapPin className="h-4 w-4 mr-2" /> Journey & Connection State</AccordionTrigger>
                    <AccordionContent className="grid grid-cols-2 gap-4 pt-2">
                        <FormField control={form.control} name="airportParams.passengerJourneyType" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Journey Stage</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="Departure">Departure</SelectItem><SelectItem value="Arrival">Arrival</SelectItem><SelectItem value="Transit">Transit</SelectItem></SelectContent>
                            </Select></FormItem>
                        )} />
                        <FormField control={form.control} name="airportParams.connectionLayover" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Connection Timing</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="Short connection">Short connection</SelectItem><SelectItem value="Long layover">Long layover</SelectItem></SelectContent>
                            </Select></FormItem>
                        )} />
                    </AccordionContent>
                </AccordionItem>

                {/* PASSENGER PROFILE */}
                <AccordionItem value="profile">
                    <AccordionTrigger className="text-sm font-bold"><Users className="h-4 w-4 mr-2" /> Passenger Profile & Identity</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                         <FormField control={form.control} name="airportParams.passengerType" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Passenger Segment</FormLabel>
                            <MultiSelect options={paxTypeOpts} selected={field.value} onChange={field.onChange} placeholder="Solo, Corporate..." /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="airportParams.loyaltyTiers" render={({ field }) => (
                                <FormItem><FormLabel className="text-xs">FFP Tier Mapping</FormLabel>
                                <MultiSelect options={tierOpts} selected={field.value} onChange={field.onChange} placeholder="Select tiers..." /></FormItem>
                            )} />
                            <FormField control={form.control} name="airportParams.cabinClasses" render={({ field }) => (
                                <FormItem><FormLabel className="text-xs">Cabin Class</FormLabel>
                                <MultiSelect options={cabinOpts} selected={field.value} onChange={field.onChange} placeholder="Business, First..." /></FormItem>
                            )} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* BEHAVIOR & PREFERENCE */}
                <AccordionItem value="behavior">
                    <AccordionTrigger className="text-sm font-bold"><Activity className="h-4 w-4 mr-2" /> Hub Behavior & Preferences</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="airportParams.timeToDeparture" render={({ field }) => (
                                <FormItem><FormLabel className="text-xs">Arrival Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="Early arrival">Early arrival</SelectItem><SelectItem value="Last-minute passenger">Last-minute passenger</SelectItem></SelectContent>
                                </Select></FormItem>
                            )} />
                            <FormField control={form.control} name="airportParams.comfortPreference" render={({ field }) => (
                                <FormItem><FormLabel className="text-xs">Comfort Preference</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="Premium traveler">Premium traveler</SelectItem><SelectItem value="Time-saving traveler">Time-saving traveler</SelectItem></SelectContent>
                                </Select></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="airportParams.airportBehavior" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Historical Hub Service Usage</FormLabel>
                            <MultiSelect options={behaviorOpts} selected={field.value} onChange={field.onChange} placeholder="Lounge, Fast-track..." /></FormItem>
                        )} />
                    </AccordionContent>
                </AccordionItem>

                {/* MOBILITY & GROUPS */}
                <AccordionItem value="mobility">
                    <AccordionTrigger className="text-sm font-bold"><Accessibility className="h-4 w-4 mr-2" /> Mobility & Group Indicators</AccordionTrigger>
                    <AccordionContent className="grid grid-cols-2 gap-4 pt-2">
                        <FormField control={form.control} name="airportParams.mobilityNeeds" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Assistance Requirements</FormLabel>
                            <MultiSelect options={mobilityOpts} selected={field.value} onChange={field.onChange} placeholder="Elderly, Wheelchair..." /></FormItem>
                        )} />
                        <FormField control={form.control} name="airportParams.groupIndicator" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Group Metadata</FormLabel>
                            <MultiSelect options={indicatorOpts} selected={field.value} onChange={field.onChange} placeholder="Children, Large group..." /></FormItem>
                        )} />
                    </AccordionContent>
                </AccordionItem>

                {/* SPEND & CHANNEL */}
                <AccordionItem value="logistics">
                    <AccordionTrigger className="text-sm font-bold"><CreditCard className="h-4 w-4 mr-2" /> Spend Behavior & Channels</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <FormField control={form.control} name="airportParams.spendBehavior" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Historical Hub Spend</FormLabel>
                            <MultiSelect options={spendOpts} selected={field.value} onChange={field.onChange} placeholder="Where do they spend?" /></FormItem>
                        )} />
                         <FormField control={form.control} name="airportParams.channelContext" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Retailing Channel Context</FormLabel>
                            <MultiSelect options={channelOpts} selected={field.value} onChange={field.onChange} placeholder="App, Kiosk, Agent..." /></FormItem>
                        )} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>

        <div className="flex justify-end gap-3 pt-6 border-t sticky bottom-0 bg-background py-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="px-10 font-bold">Commit Hub Segment</Button>
        </div>
      </form>
    </Form>
  );
}
