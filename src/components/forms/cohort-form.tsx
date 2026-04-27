// 'use client';

// import * as React from 'react';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Separator } from '@/components/ui/separator';
// import { MultiSelect } from '@/components/ui/multi-select';
// import { Checkbox } from '@/components/ui/checkbox';
// import { 
//   Plane, 
//   Settings, 
//   Globe, 
//   Activity, 
//   Users,
//   Trophy,
//   Ticket,
//   DollarSign,
//   Heart,
//   Sparkles,
//   Accessibility,
//   History
// } from 'lucide-react';
// import { Slider } from '@/components/ui/slider';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// const cohortSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(5, 'Cohort name is required.'),
//   cohortId: z.string().min(3, 'Cohort ID required.').toUpperCase().regex(/^[A-Z0-9_]+$/),
//   domain: z.literal('Airline').default('Airline'),
//   description: z.string().min(10, 'Logical description required.'),
//   type: z.enum(['static', 'dynamic', 'predictive']).default('static'),
//   status: z.enum(['Active', 'Inactive']).default('Active'),
//   priority: z.coerce.number().min(1).max(100).default(50),

//   // --- EXHAUSTIVE AIRLINE PARAMETERS ---
//   airlineParams: z.object({
//     // Passenger Type
//     paxTypes: z.array(z.string()).default([]),
//     compositions: z.array(z.string()).default([]),
//     isCorporate: z.boolean().default(false),
    
//     // Loyalty
//     loyaltyTiers: z.array(z.string()).default([]),
//     membershipStatus: z.string().optional(),
    
//     // Fare / Booking
//     fareFamilies: z.array(z.string()).default([]),
//     cabinClasses: z.array(z.string()).default([]),
//     bookingClasses: z.array(z.string()).default([]),
    
//     // Behavior
//     isFrequentTraveler: z.boolean().optional(),
//     travelPurpose: z.enum(['Any', 'Business', 'Leisure']).default('Any'),
//     haulLength: z.enum(['Any', 'Short', 'Long']).default('Any'),
    
//     // Purchase History
//     pastAncillaries: z.array(z.string()).default([]),
    
//     // Commercial Sensitivity
//     priceSensitivity: z.enum(['Any', 'High', 'Low']).default('Any'),
//     discountUsage: z.enum(['Any', 'Frequent', 'Rare']).default('Any'),
    
//     // Journey
//     geography: z.enum(['Any', 'Domestic', 'International']).default('Any'),
//     tripType: z.array(z.string()).default([]),
//     bookingWindow: z.enum(['Any', 'Early', 'Last-minute']).default('Any'),
    
//     // Preferences
//     seatPreference: z.string().optional(),
//     mealPreference: z.string().optional(),
    
//     // Premium Intent
//     hasUpgradeHistory: z.boolean().default(false),
//     hasLoungeHistory: z.boolean().default(false),
    
//     // Group Indicator
//     hasChildren: z.boolean().default(false),
//     isMultiPaxPnr: z.boolean().default(false),
    
//     // SSR
//     specialNeeds: z.array(z.string()).default([]),
//   }),
// });

// export type Cohort = z.infer<typeof cohortSchema>;

// interface CohortFormProps {
//   cohort: Cohort | null;
//   domain: 'Airline';
//   onSubmit: (data: Cohort) => void;
//   onCancel: () => void;
// }

// const paxTypeOpts = [
//   { value: 'Adult', label: 'Adult' },
//   { value: 'Child', label: 'Child' },
//   { value: 'Infant', label: 'Infant' }
// ];

// const compositionOpts = [
//   { value: 'Solo', label: 'Solo Traveler' },
//   { value: 'Family', label: 'Family' },
//   { value: 'Group', label: 'Large Group' }
// ];

// const tierOpts = [
//   { value: 'Silver', label: 'Silver' },
//   { value: 'Gold', label: 'Gold' },
//   { value: 'Platinum', label: 'Platinum' }
// ];

// const cabinOpts = [
//   { value: 'Economy', label: 'Economy' },
//   { value: 'Premium Economy', label: 'Premium Economy' },
//   { value: 'Business', label: 'Business' },
//   { value: 'First', label: 'First' }
// ];

// const ancillaryHistoryOpts = [
//   { value: 'seat', label: 'Seat Selections' },
//   { value: 'baggage', label: 'Extra Baggage' },
//   { value: 'meals', label: 'Premium Meals' },
//   { value: 'upgrades', label: 'Paid Upgrades' }
// ];

// const tripTypeOpts = [
//   { value: 'one_way', label: 'One-Way' },
//   { value: 'round-trip', label: 'Round-Trip' },
//   { value: 'connecting', label: 'Connecting' }
// ];

// const ssrOpts = [
//   { value: 'wheelchair', label: 'Wheelchair Assistance' },
//   { value: 'special-meal', label: 'Special Meal Requirements' },
//   { value: 'infant-ssr', label: 'Infant / Bassinet' }
// ];

// export function CohortForm({ cohort, onSubmit, onCancel }: CohortFormProps) {
//   const form = useForm<Cohort>({
//     resolver: zodResolver(cohortSchema),
//     defaultValues: cohort || {
//       name: '',
//       cohortId: '',
//       domain: 'Airline',
//       description: '',
//       type: 'static',
//       status: 'Active',
//       priority: 50,
//       airlineParams: {
//         paxTypes: [],
//         compositions: [],
//         loyaltyTiers: [],
//         fareFamilies: [],
//         cabinClasses: [],
//         bookingClasses: [],
//         pastAncillaries: [],
//         tripType: [],
//         specialNeeds: [],
//         travelPurpose: 'Any',
//         haulLength: 'Any',
//         priceSensitivity: 'Any',
//         discountUsage: 'Any',
//         geography: 'Any',
//         bookingWindow: 'Any',
//       },
//     },
//   });

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
        
//         {/* --- SECTION 1: MASTER IDENTITY --- */}
//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
//                 <Settings className="h-3.5 w-3.5" /> 1. Segment Identity & State
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <FormField control={form.control} name="name" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Cohort Name</FormLabel>
//                   <FormControl><Input placeholder="e.g., Q4 High-Spend Leisure" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//               <FormField control={form.control} name="cohortId" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Logical Cohort ID</FormLabel>
//                   <FormControl><Input placeholder="e.g., Q4_PREMIUM_LEISURE" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//             </div>
//             <FormField control={form.control} name="description" render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Segment Intent Description</FormLabel>
//                 <FormControl><Input placeholder="Explain the commercial logic of this cohort..." {...field} /></FormControl>
//               </FormItem>
//             )} />
//             <div className="grid grid-cols-3 gap-4">
//               <FormField control={form.control} name="type" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Evaluation Type</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                     <SelectContent>
//                       <SelectItem value="static">Static Rules (Baseline)</SelectItem>
//                       <SelectItem value="dynamic">Dynamic (Request-time)</SelectItem>
//                       <SelectItem value="predictive">Predictive (ML Scoring)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </FormItem>
//               )} />
//                <FormField control={form.control} name="status" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Status</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                     <SelectContent>
//                       <SelectItem value="Active">Active</SelectItem>
//                       <SelectItem value="Inactive">Paused</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </FormItem>
//               )} />
//               <FormField control={form.control} name="priority" render={({ field }) => (
//                 <FormItem>
//                   <div className="flex justify-between">
//                     <FormLabel>Engine Priority</FormLabel>
//                     <span className="text-xs font-bold text-primary">{field.value}</span>
//                   </div>
//                   <FormControl>
//                     <Slider min={1} max={100} step={1} value={[field.value]} onValueChange={(v) => field.onChange(v[0])} />
//                   </FormControl>
//                 </FormItem>
//               )} />
//             </div>
//         </section>

//         <Separator />

//         {/* --- SECTION 2: AIRLINE PARAMETERS --- */}
//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
//                 <Plane className="h-3.5 w-3.5" /> 2. Airline Retailing Parameters
//             </div>
            
//             <Accordion type="multiple" className="w-full">
//                 {/* PASSENGER TYPE */}
//                 <AccordionItem value="pax">
//                     <AccordionTrigger className="text-sm font-bold"><Users className="h-4 w-4 mr-2" /> Passenger Type & Composition</AccordionTrigger>
//                     <AccordionContent className="space-y-4 pt-2">
//                         <div className="grid grid-cols-2 gap-4">
//                             <FormField control={form.control} name="airlineParams.paxTypes" render={({ field }) => (
//                                 <FormItem><FormLabel className="text-xs">Pax Type</FormLabel>
//                                 <MultiSelect options={paxTypeOpts} selected={field.value} onChange={field.onChange} placeholder="Adult, Child..." /></FormItem>
//                             )} />
//                             <FormField control={form.control} name="airlineParams.compositions" render={({ field }) => (
//                                 <FormItem><FormLabel className="text-xs">PNR Composition</FormLabel>
//                                 <MultiSelect options={compositionOpts} selected={field.value} onChange={field.onChange} placeholder="Solo, Family..." /></FormItem>
//                             )} />
//                         </div>
//                         <FormField control={form.control} name="airlineParams.isCorporate" render={({ field }) => (
//                             <FormItem className="flex items-center gap-2 space-y-0 rounded-md border p-3 bg-muted/20">
//                                 <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
//                                 <FormLabel className="text-xs font-bold">Is Corporate Traveler</FormLabel>
//                             </FormItem>
//                         )} />
//                     </AccordionContent>
//                 </AccordionItem>

//                 {/* LOYALTY */}
//                 <AccordionItem value="loyalty">
//                     <AccordionTrigger className="text-sm font-bold"><Trophy className="h-4 w-4 mr-2" /> Loyalty & Membership</AccordionTrigger>
//                     <AccordionContent className="space-y-4 pt-2">
//                         <FormField control={form.control} name="airlineParams.loyaltyTiers" render={({ field }) => (
//                             <FormItem><FormLabel className="text-xs">Frequent Flyer Tier</FormLabel>
//                             <MultiSelect options={tierOpts} selected={field.value} onChange={field.onChange} placeholder="Select tiers..." /></FormItem>
//                         )} />
//                         <FormField control={form.control} name="airlineParams.membershipStatus" render={({ field }) => (
//                             <FormItem><FormLabel className="text-xs">Membership Status</FormLabel>
//                             <FormControl><Input placeholder="e.g., Lifetime, Active, VIP" {...field} /></FormControl></FormItem>
//                         )} />
//                     </AccordionContent>
//                 </AccordionItem>

//                 {/* FARE & BOOKING */}
//                 <AccordionItem value="fare">
//                     <AccordionTrigger className="text-sm font-bold"><Ticket className="h-4 w-4 mr-2" /> Fare & Booking Context</AccordionTrigger>
//                     <AccordionContent className="space-y-4 pt-2">
//                          <FormField control={form.control} name="airlineParams.cabinClasses" render={({ field }) => (
//                             <FormItem><FormLabel className="text-xs">Cabin Class</FormLabel>
//                             <MultiSelect options={cabinOpts} selected={field.value} onChange={field.onChange} placeholder="Economy, Business..." /></FormItem>
//                         )} />
//                         <div className="grid grid-cols-2 gap-4">
//                             <FormField control={form.control} name="airlineParams.fareFamilies" render={({ field }) => (
//                                 <FormItem><FormLabel className="text-xs">Fare Family / Brand</FormLabel>
//                                 <FormControl><Input placeholder="e.g., Flex, Saver" value={field.value?.join(', ')} onChange={(e) => field.onChange(e.target.value.split(',').map(v => v.trim()))} /></FormControl></FormItem>
//                             )} />
//                             <FormField control={form.control} name="airlineParams.bookingClasses" render={({ field }) => (
//                                 <FormItem><FormLabel className="text-xs">Booking Class (RBD)</FormLabel>
//                                 <FormControl><Input placeholder="e.g., Y, J, F" value={field.value?.join(', ')} onChange={(e) => field.onChange(e.target.value.split(',').map(v => v.trim()))} /></FormControl></FormItem>
//                             )} />
//                         </div>
//                     </AccordionContent>
//                 </AccordionItem>

//                 {/* TRAVEL BEHAVIOR */}
//                 <AccordionItem value="behavior">
//                     <AccordionTrigger className="text-sm font-bold"><Activity className="h-4 w-4 mr-2" /> Travel Behavior & Intent</AccordionTrigger>
//                     <AccordionContent className="grid grid-cols-3 gap-4 pt-2">
//                          <FormField control={form.control} name="airlineParams.travelPurpose" render={({ field }) => (
//                             <FormItem><FormLabel className="text-xs">Purpose</FormLabel>
//                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                 <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                                 <SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="Business">Business</SelectItem><SelectItem value="Leisure">Leisure</SelectItem></SelectContent>
//                             </Select></FormItem>
//                         )} />
//                         <FormField control={form.control} name="airlineParams.haulLength" render={({ field }) => (
//                             <FormItem><FormLabel className="text-xs">Flight Duration</FormLabel>
//                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                 <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                                 <SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="Short">Short-Haul</SelectItem><SelectItem value="Long">Long-Haul</SelectItem></SelectContent>
//                             </Select></FormItem>
//                         )} />
//                         <FormField control={form.control} name="airlineParams.isFrequentTraveler" render={({ field }) => (
//                             <FormItem className="flex items-center gap-2 pt-8">
//                                 <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
//                                 <FormLabel className="text-xs">Frequent Traveler</FormLabel>
//                             </FormItem>
//                         )} />
//                     </AccordionContent>
//                 </AccordionItem>

//                 {/* ANCILLARY HISTORY */}
//                 <AccordionItem value="history">
//                     <AccordionTrigger className="text-sm font-bold"><History className="h-4 w-4 mr-2" /> Ancillary Purchase History</AccordionTrigger>
//                     <AccordionContent className="pt-2">
//                         <FormField control={form.control} name="airlineParams.pastAncillaries" render={({ field }) => (
//                             <FormItem><FormLabel className="text-xs">Historical Product Preferences</FormLabel>
//                             <MultiSelect options={ancillaryHistoryOpts} selected={field.value} onChange={field.onChange} placeholder="What have they bought before?" /></FormItem>
//                         )} />
//                     </AccordionContent>
//                 </AccordionItem>

//                 {/* PRICE SENSITIVITY */}
//                 <AccordionItem value="sensitivity">
//                     <AccordionTrigger className="text-sm font-bold"><DollarSign className="h-4 w-4 mr-2" /> Commercial & Price Sensitivity</AccordionTrigger>
//                     <AccordionContent className="grid grid-cols-2 gap-4 pt-2">
//                         <FormField control={form.control} name="airlineParams.priceSensitivity" render={({ field }) => (
//                             <FormItem><FormLabel className="text-xs">Price Sensitivity Score</FormLabel>
//                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                 <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                                 <SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="High">High (Price Conscious)</SelectItem><SelectItem value="Low">Low (Yield Focused)</SelectItem></SelectContent>
//                             </Select></FormItem>
//                         )} />
//                          <FormField control={form.control} name="airlineParams.discountUsage" render={({ field }) => (
//                             <FormItem><FormLabel className="text-xs">Discount Usage Pattern</FormLabel>
//                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                 <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                                 <SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="Frequent">Frequent User</SelectItem><SelectItem value="Rare">Rarely Uses Promos</SelectItem></SelectContent>
//                             </Select></FormItem>
//                         )} />
//                     </AccordionContent>
//                 </AccordionItem>

//                 {/* JOURNEY LOGIC */}
//                 <AccordionItem value="journey">
//                     <AccordionTrigger className="text-sm font-bold"><Globe className="h-4 w-4 mr-2" /> Journey & Trip Type</AccordionTrigger>
//                     <AccordionContent className="space-y-4 pt-2">
//                          <div className="grid grid-cols-3 gap-4">
//                             <FormField control={form.control} name="airlineParams.geography" render={({ field }) => (
//                                 <FormItem><FormLabel className="text-xs">Geography</FormLabel>
//                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                     <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                                     <SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="Domestic">Domestic Only</SelectItem><SelectItem value="International">International Only</SelectItem></SelectContent>
//                                 </Select></FormItem>
//                             )} />
//                             <FormField control={form.control} name="airlineParams.bookingWindow" render={({ field }) => (
//                                 <FormItem><FormLabel className="text-xs">Time to Departure</FormLabel>
//                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                     <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                                     <SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="Early">Early Booker</SelectItem><SelectItem value="Last-minute">Last-minute Traveler</SelectItem></SelectContent>
//                                 </Select></FormItem>
//                             )} />
//                             <FormField control={form.control} name="airlineParams.tripType" render={({ field }) => (
//                                 <FormItem className="col-span-1"><FormLabel className="text-xs">Trip Cycle</FormLabel>
//                                 <MultiSelect options={tripTypeOpts} selected={field.value} onChange={field.onChange} placeholder="One-way..." /></FormItem>
//                             )} />
//                          </div>
//                     </AccordionContent>
//                 </AccordionItem>

//                 {/* PREFERENCES */}
//                 <AccordionItem value="preferences">
//                     <AccordionTrigger className="text-sm font-bold"><Heart className="h-4 w-4 mr-2" /> Preferences & Profiles</AccordionTrigger>
//                     <AccordionContent className="grid grid-cols-2 gap-4 pt-2">
//                         <FormField control={form.control} name="airlineParams.seatPreference" render={({ field }) => (
//                             <FormItem><FormLabel className="text-xs">Seat Attribute</FormLabel><FormControl><Input placeholder="Window, Aisle, Extra Legroom" {...field} /></FormControl></FormItem>
//                         )} />
//                         <FormField control={form.control} name="airlineParams.mealPreference" render={({ field }) => (
//                             <FormItem><FormLabel className="text-xs">Dietary / Meal</FormLabel><FormControl><Input placeholder="Vegetarian, Kosher, Gourmet" {...field} /></FormControl></FormItem>
//                         )} />
//                     </AccordionContent>
//                 </AccordionItem>

//                 {/* PREMIUM BEHAVIOR */}
//                 <AccordionItem value="premium">
//                     <AccordionTrigger className="text-sm font-bold"><Sparkles className="h-4 w-4 mr-2" /> Premium Travel Tendencies</AccordionTrigger>
//                     <AccordionContent className="grid grid-cols-2 gap-4 pt-2">
//                          <FormField control={form.control} name="airlineParams.hasUpgradeHistory" render={({ field }) => (
//                             <FormItem className="flex items-center gap-2 space-y-0 rounded-md border p-3 bg-muted/20">
//                                 <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
//                                 <FormLabel className="text-xs">History of Upgrading</FormLabel>
//                             </FormItem>
//                         )} />
//                          <FormField control={form.control} name="airlineParams.hasLoungeHistory" render={({ field }) => (
//                             <FormItem className="flex items-center gap-2 space-y-0 rounded-md border p-3 bg-muted/20">
//                                 <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
//                                 <FormLabel className="text-xs">Historical Lounge Usage</FormLabel>
//                             </FormItem>
//                         )} />
//                     </AccordionContent>
//                 </AccordionItem>

//                 {/* PNR METADATA */}
//                 <AccordionItem value="metadata">
//                     <AccordionTrigger className="text-sm font-bold"><Users className="h-4 w-4 mr-2" /> PNR Indicators</AccordionTrigger>
//                     <AccordionContent className="grid grid-cols-2 gap-4 pt-2">
//                          <FormField control={form.control} name="airlineParams.isMultiPaxPnr" render={({ field }) => (
//                             <FormItem className="flex items-center gap-2 space-y-0 rounded-md border p-3">
//                                 <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
//                                 <FormLabel className="text-xs">Multiple Passengers in PNR</FormLabel>
//                             </FormItem>
//                         )} />
//                          <FormField control={form.control} name="airlineParams.hasChildren" render={({ field }) => (
//                             <FormItem className="flex items-center gap-2 space-y-0 rounded-md border p-3">
//                                 <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
//                                 <FormLabel className="text-xs">Children Present in PNR</FormLabel>
//                             </FormItem>
//                         )} />
//                     </AccordionContent>
//                 </AccordionItem>

//                 {/* SSR */}
//                 <AccordionItem value="ssr">
//                     <AccordionTrigger className="text-sm font-bold"><Accessibility className="h-4 w-4 mr-2" /> Special Needs (SSR)</AccordionTrigger>
//                     <AccordionContent className="pt-2">
//                         <FormField control={form.control} name="airlineParams.specialNeeds" render={({ field }) => (
//                             <FormItem><FormLabel className="text-xs">Authorized SSR Toggles</FormLabel>
//                             <MultiSelect options={ssrOpts} selected={field.value} onChange={field.onChange} placeholder="Identify special assistance..." /></FormItem>
//                         )} />
//                     </AccordionContent>
//                 </AccordionItem>
//             </Accordion>
//         </section>

//         <div className="flex justify-end gap-3 pt-6 border-t sticky bottom-0 bg-background py-4">
//           <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
//           <Button type="submit" className="px-10 font-bold">Commit Segment Logic</Button>
//         </div>
//       </form>
//     </Form>
//   );
// }



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
  Plane, 
  Settings, 
  Globe, 
  Activity, 
  Users,
  Trophy,
  Ticket,
  DollarSign,
  Heart,
  Sparkles,
  Accessibility,
  History
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Stepper, type StepItem } from '../Stepper/Stepper';

const cohortSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Cohort name is required.'),
  cohortId: z.string().min(3, 'Cohort ID required.').toUpperCase().regex(/^[A-Z0-9_]+$/),
  domain: z.literal('Airline').default('Airline'),
  description: z.string().min(10, 'Logical description required.'),
  type: z.enum(['static', 'dynamic', 'predictive']).default('static'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  priority: z.coerce.number().min(1).max(100).default(50),

  // --- EXHAUSTIVE AIRLINE PARAMETERS ---
  airlineParams: z.object({
    // Passenger Type
    paxTypes: z.array(z.string()).default([]),
    compositions: z.array(z.string()).default([]),
    isCorporate: z.boolean().default(false),
    
    // Loyalty
    loyaltyTiers: z.array(z.string()).default([]),
    membershipStatus: z.string().optional(),
    
    // Fare / Booking
    fareFamilies: z.array(z.string()).default([]),
    cabinClasses: z.array(z.string()).default([]),
    bookingClasses: z.array(z.string()).default([]),
    
    // Behavior
    isFrequentTraveler: z.boolean().optional(),
    travelPurpose: z.enum(['Any', 'Business', 'Leisure']).default('Any'),
    haulLength: z.enum(['Any', 'Short', 'Long']).default('Any'),
    
    // Purchase History
    pastAncillaries: z.array(z.string()).default([]),
    
    // Commercial Sensitivity
    priceSensitivity: z.enum(['Any', 'High', 'Low']).default('Any'),
    discountUsage: z.enum(['Any', 'Frequent', 'Rare']).default('Any'),
    
    // Journey
    geography: z.enum(['Any', 'Domestic', 'International']).default('Any'),
    tripType: z.array(z.string()).default([]),
    bookingWindow: z.enum(['Any', 'Early', 'Last-minute']).default('Any'),
    
    // Preferences
    seatPreference: z.string().optional(),
    mealPreference: z.string().optional(),
    
    // Premium Intent
    hasUpgradeHistory: z.boolean().default(false),
    hasLoungeHistory: z.boolean().default(false),
    
    // Group Indicator
    hasChildren: z.boolean().default(false),
    isMultiPaxPnr: z.boolean().default(false),
    
    // SSR
    specialNeeds: z.array(z.string()).default([]),
  }),
});

export type Cohort = z.infer<typeof cohortSchema>;

interface CohortFormProps {
  cohort: Cohort | null;
  domain: 'Airline';
  onSubmit: (data: Cohort) => void;
  onCancel: () => void;
}

const paxTypeOpts = [
  { value: 'Adult', label: 'Adult' },
  { value: 'Child', label: 'Child' },
  { value: 'Infant', label: 'Infant' }
];

const compositionOpts = [
  { value: 'Solo', label: 'Solo Traveler' },
  { value: 'Family', label: 'Family' },
  { value: 'Group', label: 'Large Group' }
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

const ancillaryHistoryOpts = [
  { value: 'seat', label: 'Seat Selections' },
  { value: 'baggage', label: 'Extra Baggage' },
  { value: 'meals', label: 'Premium Meals' },
  { value: 'upgrades', label: 'Paid Upgrades' }
];

const tripTypeOpts = [
  { value: 'one_way', label: 'One-Way' },
  { value: 'round-trip', label: 'Round-Trip' },
  { value: 'connecting', label: 'Connecting' }
];

const ssrOpts = [
  { value: 'wheelchair', label: 'Wheelchair Assistance' },
  { value: 'special-meal', label: 'Special Meal Requirements' },
  { value: 'infant-ssr', label: 'Infant / Bassinet' }
];

// ─── Steps Config ─────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  { id: 1, label: 'Segment Identity & State' },
  { id: 2, label: 'Airline Retailing Parameters' },
];

export function CohortForm({ cohort, onSubmit, onCancel }: CohortFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1);

  const form = useForm<Cohort>({
    resolver: zodResolver(cohortSchema),
    defaultValues: cohort || {
      name: '',
      cohortId: '',
      domain: 'Airline',
      description: '',
      type: 'static',
      status: 'Active',
      priority: 50,
      airlineParams: {
        paxTypes: [],
        compositions: [],
        loyaltyTiers: [],
        fareFamilies: [],
        cabinClasses: [],
        bookingClasses: [],
        pastAncillaries: [],
        tripType: [],
        specialNeeds: [],
        travelPurpose: 'Any',
        haulLength: 'Any',
        priceSensitivity: 'Any',
        discountUsage: 'Any',
        geography: 'Any',
        bookingWindow: 'Any',
      },
    },
  });

  // ─── Step field map for validation ─────────────────────────────────────────
  const stepFields: Record<number, (keyof Cohort)[]> = {
    1: ['name', 'cohortId', 'description'],
    2: [],
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const valid = await form.trigger(fields);
    if (!valid) return;
    setCurrentStep((s) => Math.min(s + 1, 2));
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const isLastStep = currentStep === 2;
  const isEditing = !!cohort;

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Establish cohort identity, logical ID, and evaluation priority.";
      case 2: return "Define exhaustive airline retailing parameters and behavior rules.";
      default: return "";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0">

        {/* ── Stepper ──────────────────────────────────────────────────── */}
        <div className="pb-4">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="space-y-5 max-h-[50vh] overflow-y-auto">

          {/* Step 1 — Segment Identity & State */}
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Cohort Name <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Q4 High-Spend Leisure" 
                        className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cohortId" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Logical Cohort ID <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Q4_PREMIUM_LEISURE" 
                        className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Segment Intent Description <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Explain the commercial logic of this cohort..." 
                      className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )} />

              <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Evaluation Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                        <SelectItem value="static">Static Rules (Baseline)</SelectItem>
                        <SelectItem value="dynamic">Dynamic (Request-time)</SelectItem>
                        <SelectItem value="predictive">Predictive (ML Scoring)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="priority" render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Engine Priority
                      </FormLabel>
                      <span className="text-xs font-bold text-violet-600">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider 
                        min={1} 
                        max={100} 
                        step={1} 
                        value={[field.value]} 
                        onValueChange={(v) => field.onChange(v[0])} 
                        className="mt-2"
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
            </>
          )}

          {/* Step 2 — Airline Retailing Parameters */}
          {currentStep === 2 && (
            <>
              <Accordion type="multiple" className="w-full">
                {/* PASSENGER TYPE */}
                <AccordionItem value="pax">
                  <AccordionTrigger className="text-sm font-bold text-slate-800">
                    <Users className="h-4 w-4 mr-2 text-violet-600" /> Passenger Type & Composition
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="airlineParams.paxTypes" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-500">Pax Type</FormLabel>
                          <MultiSelect 
                            options={paxTypeOpts} 
                            selected={field.value} 
                            onChange={field.onChange} 
                            placeholder="Adult, Child..." 
                          />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="airlineParams.compositions" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-500">PNR Composition</FormLabel>
                          <MultiSelect 
                            options={compositionOpts} 
                            selected={field.value} 
                            onChange={field.onChange} 
                            placeholder="Solo, Family..." 
                          />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="airlineParams.isCorporate" render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0 rounded-md border p-3 bg-slate-50/60">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-xs font-bold text-slate-700">Is Corporate Traveler</FormLabel>
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>

                {/* LOYALTY */}
                <AccordionItem value="loyalty">
                  <AccordionTrigger className="text-sm font-bold text-slate-800">
                    <Trophy className="h-4 w-4 mr-2 text-amber-500" /> Loyalty & Membership
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <FormField control={form.control} name="airlineParams.loyaltyTiers" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500">Frequent Flyer Tier</FormLabel>
                        <MultiSelect 
                          options={tierOpts} 
                          selected={field.value} 
                          onChange={field.onChange} 
                          placeholder="Select tiers..." 
                        />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="airlineParams.membershipStatus" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500">Membership Status</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Lifetime, Active, VIP" 
                            className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>

                {/* FARE & BOOKING */}
                <AccordionItem value="fare">
                  <AccordionTrigger className="text-sm font-bold text-slate-800">
                    <Ticket className="h-4 w-4 mr-2 text-blue-500" /> Fare & Booking Context
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <FormField control={form.control} name="airlineParams.cabinClasses" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500">Cabin Class</FormLabel>
                        <MultiSelect 
                          options={cabinOpts} 
                          selected={field.value} 
                          onChange={field.onChange} 
                          placeholder="Economy, Business..." 
                        />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="airlineParams.fareFamilies" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-500">Fare Family / Brand</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Flex, Saver" 
                              value={field.value?.join(', ')} 
                              onChange={(e) => field.onChange(e.target.value.split(',').map(v => v.trim()))}
                              className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                            />
                          </FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="airlineParams.bookingClasses" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-500">Booking Class (RBD)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Y, J, F" 
                              value={field.value?.join(', ')} 
                              onChange={(e) => field.onChange(e.target.value.split(',').map(v => v.trim()))}
                              className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                            />
                          </FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* TRAVEL BEHAVIOR */}
                <AccordionItem value="behavior">
                  <AccordionTrigger className="text-sm font-bold text-slate-800">
                    <Activity className="h-4 w-4 mr-2 text-emerald-500" /> Travel Behavior & Intent
                  </AccordionTrigger>
                  <AccordionContent className="grid grid-cols-3 gap-4 pt-2">
                    <FormField control={form.control} name="airlineParams.travelPurpose" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500">Purpose</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                            <SelectItem value="Any">Any</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Leisure">Leisure</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="airlineParams.haulLength" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500">Flight Duration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                            <SelectItem value="Any">Any</SelectItem>
                            <SelectItem value="Short">Short-Haul</SelectItem>
                            <SelectItem value="Long">Long-Haul</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="airlineParams.isFrequentTraveler" render={({ field }) => (
                      <FormItem className="flex items-center gap-2 pt-8">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-xs font-semibold text-slate-700">Frequent Traveler</FormLabel>
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>

                {/* ANCILLARY HISTORY */}
                <AccordionItem value="history">
                  <AccordionTrigger className="text-sm font-bold text-slate-800">
                    <History className="h-4 w-4 mr-2 text-indigo-500" /> Ancillary Purchase History
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <FormField control={form.control} name="airlineParams.pastAncillaries" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500">Historical Product Preferences</FormLabel>
                        <MultiSelect 
                          options={ancillaryHistoryOpts} 
                          selected={field.value} 
                          onChange={field.onChange} 
                          placeholder="What have they bought before?" 
                        />
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>

                {/* PRICE SENSITIVITY */}
                <AccordionItem value="sensitivity">
                  <AccordionTrigger className="text-sm font-bold text-slate-800">
                    <DollarSign className="h-4 w-4 mr-2 text-green-600" /> Commercial & Price Sensitivity
                  </AccordionTrigger>
                  <AccordionContent className="grid grid-cols-2 gap-4 pt-2">
                    <FormField control={form.control} name="airlineParams.priceSensitivity" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500">Price Sensitivity Score</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                            <SelectItem value="Any">Any</SelectItem>
                            <SelectItem value="High">High (Price Conscious)</SelectItem>
                            <SelectItem value="Low">Low (Yield Focused)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="airlineParams.discountUsage" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500">Discount Usage Pattern</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                            <SelectItem value="Any">Any</SelectItem>
                            <SelectItem value="Frequent">Frequent User</SelectItem>
                            <SelectItem value="Rare">Rarely Uses Promos</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>

                {/* JOURNEY LOGIC */}
                <AccordionItem value="journey">
                  <AccordionTrigger className="text-sm font-bold text-slate-800">
                    <Globe className="h-4 w-4 mr-2 text-cyan-500" /> Journey & Trip Type
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="grid grid-cols-3 gap-4">
                      <FormField control={form.control} name="airlineParams.geography" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-500">Geography</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                              <SelectItem value="Any">Any</SelectItem>
                              <SelectItem value="Domestic">Domestic Only</SelectItem>
                              <SelectItem value="International">International Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="airlineParams.bookingWindow" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-500">Time to Departure</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                              <SelectItem value="Any">Any</SelectItem>
                              <SelectItem value="Early">Early Booker</SelectItem>
                              <SelectItem value="Last-minute">Last-minute Traveler</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="airlineParams.tripType" render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel className="text-xs font-semibold text-slate-500">Trip Cycle</FormLabel>
                          <MultiSelect 
                            options={tripTypeOpts} 
                            selected={field.value} 
                            onChange={field.onChange} 
                            placeholder="One-way..." 
                          />
                        </FormItem>
                      )} />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* PREFERENCES */}
                <AccordionItem value="preferences">
                  <AccordionTrigger className="text-sm font-bold text-slate-800">
                    <Heart className="h-4 w-4 mr-2 text-red-500" /> Preferences & Profiles
                  </AccordionTrigger>
                  <AccordionContent className="grid grid-cols-2 gap-4 pt-2">
                    <FormField control={form.control} name="airlineParams.seatPreference" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500">Seat Attribute</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Window, Aisle, Extra Legroom" 
                            className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="airlineParams.mealPreference" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500">Dietary / Meal</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Vegetarian, Kosher, Gourmet" 
                            className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>

                {/* PREMIUM BEHAVIOR */}
                <AccordionItem value="premium">
                  <AccordionTrigger className="text-sm font-bold text-slate-800">
                    <Sparkles className="h-4 w-4 mr-2 text-purple-500" /> Premium Travel Tendencies
                  </AccordionTrigger>
                  <AccordionContent className="grid grid-cols-2 gap-4 pt-2">
                    <FormField control={form.control} name="airlineParams.hasUpgradeHistory" render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0 rounded-md border p-3 bg-slate-50/60">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-xs font-bold text-slate-700">History of Upgrading</FormLabel>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="airlineParams.hasLoungeHistory" render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0 rounded-md border p-3 bg-slate-50/60">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-xs font-bold text-slate-700">Historical Lounge Usage</FormLabel>
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>

                {/* PNR METADATA */}
                <AccordionItem value="metadata">
                  <AccordionTrigger className="text-sm font-bold text-slate-800">
                    <Users className="h-4 w-4 mr-2 text-gray-500" /> PNR Indicators
                  </AccordionTrigger>
                  <AccordionContent className="grid grid-cols-2 gap-4 pt-2">
                    <FormField control={form.control} name="airlineParams.isMultiPaxPnr" render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0 rounded-md border p-3 bg-slate-50/60">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-xs font-bold text-slate-700">Multiple Passengers in PNR</FormLabel>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="airlineParams.hasChildren" render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0 rounded-md border p-3 bg-slate-50/60">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-xs font-bold text-slate-700">Children Present in PNR</FormLabel>
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>

                {/* SSR */}
                <AccordionItem value="ssr">
                  <AccordionTrigger className="text-sm font-bold text-slate-800">
                    <Accessibility className="h-4 w-4 mr-2 text-sky-500" /> Special Needs (SSR)
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <FormField control={form.control} name="airlineParams.specialNeeds" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500">Authorized SSR Toggles</FormLabel>
                        <MultiSelect 
                          options={ssrOpts} 
                          selected={field.value} 
                          onChange={field.onChange} 
                          placeholder="Identify special assistance..." 
                        />
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="h-px bg-slate-100 mx-7" />

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="pt-7 bg-slate-50/50 flex items-center justify-between gap-3">
          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-semibold text-slate-500 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:text-slate-700 transition-all duration-150 cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {/* Previous */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>

            {/* Next / Submit */}
            {isLastStep ? (
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all duration-150 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Commit Segment Logic
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-[hsl(var(--primary))] hover:bg-violet-700 active:bg-violet-800 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all duration-150 cursor-pointer"
              >
                Next Step
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

      </form>
    </Form>
  );
}