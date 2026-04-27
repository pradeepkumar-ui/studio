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
//   FormDescription,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Textarea } from '../ui/textarea';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Separator } from '../ui/separator';
// import { Building2, MapPin, Calendar as CalendarIcon, Tag, ShieldCheck, Map, Terminal, Clock, Store } from 'lucide-react';
// import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
// import { Calendar } from '../ui/calendar';
// import { format } from 'date-fns';
// import { cn } from '@/lib/utils';
// import { useFirestore, useCollection } from '@/firebase';
// import { collection } from 'firebase/firestore';

// const categorySubcategoryMap: Record<string, string[]> = {
//   'Lounge': ['Lounge day pass', 'Lounge & Spa', 'Executive suite', 'Arrivals lounge'],
//   'Priority service': ['Fast track security', 'Priority check-in', 'Priority baggage', 'Express boarding'],
//   'Meal': ['Pre-book meal', 'Airport restaurant voucher', 'Gourmet meal box'],
//   'Wi-Fi / connectivity': ['Airport Wi-Fi pass', 'Business center access', 'Roaming SIM'],
//   'Parking': ['Valet parking', 'Short stay parking', 'Long stay parking', 'Premium parking'],
//   'Ground Transport': ['Chauffeur service', 'Airport shuttle', 'Luxury car transfer', 'Coach transfer'],
//   'Inflight comfort': ['Amenity kit', 'Blanket rental', 'Sleep pod (hourly)'],
//   'Special service': ['Porter service', 'Concierge service', 'Meet & Greet', 'Personal shopper'],
//   'Flexibility / protection': ['Cancel protection', 'Missed connection support'],
//   'Bundle': ['Premium Hub Pack', 'Family Transit Bundle', 'Executive Stopover'],
// };

// const mainCategories = Object.keys(categorySubcategoryMap);

// const categoryDefaults: Record<string, { name: string; code: string }> = {
//   'Lounge': { name: 'Lounge Entry', code: 'LOU' },
//   'Priority service': { name: 'Fast Track', code: 'PRTY' },
//   'Meal': { name: 'Pre-paid Meal', code: 'MEAL' },
//   'Wi-Fi / connectivity': { name: 'Wi-Fi Access', code: 'WIFI' },
//   'Parking': { name: 'Valet Parking', code: 'PRK' },
//   'Ground Transport': { name: 'Private Transfer', code: 'GND' },
//   'Inflight comfort': { name: 'Comfort Service', code: 'CMFT' },
//   'Special service': { name: 'Concierge Service', code: 'SPEC' },
//   'Flexibility / protection': { name: 'Flexibility Pack', code: 'FLEX' },
//   'Bundle': { name: 'Hub Bundle', code: 'BUN' },
// };

// const airportAncillarySchema = z.object({
//   id: z.string().optional(),
//   // 1. Core Details (Mandatory as per section 1 request)
//   category: z.enum(mainCategories as [string, ...string[]]),
//   subcategory: z.string().min(1, 'Subcategory is required.'),
//   ancillaryCode: z.string().min(1, 'Code is required.').toUpperCase(),
//   name: z.string().min(1, 'Name is required.'),
//   shortName: z.string().min(1, 'Short name is required.'),
//   description: z.string().min(1, 'Description is required.'),
//   serviceType: z.enum(['slot-based', 'on-demand', 'request-based']),
//   status: z.enum(['Active', 'Inactive']),
//   version: z.coerce.number().min(1, 'Version is required.'),
//   effectiveDate: z.object({
//     from: z.date().optional().nullable(),
//     to: z.date().optional().nullable(),
//   }).optional(),
  
//   // 2. Ownership & Provider (Mandatory: Airport code)
//   airportCode: z.string().min(1, 'Airport node is required.'),
//   airlineCode: z.string().optional(),
//   providerType: z.enum(['airport', 'lounge operator', 'vendor']).optional(),
//   supplierId: z.string().optional(),
//   providerName: z.string().optional(),
//   contractReference: z.string().optional(),
//   slaLevel: z.string().optional(),
//   confirmationType: z.enum(['instant', 'request', 'manual']).optional(),
//   contactDetails: z.string().optional(),
  
//   // 3. Location (Mandatory: Terminals)
//   terminals: z.string().min(1, 'Active terminal(s) required.'),
//   zone: z.string().optional(),
//   servicePoint: z.string().optional(),
//   isGateApplicable: z.boolean().default(false),
//   journeyStage: z.enum(['Departure', 'Arrival', 'Transit', 'All']).optional(),
//   multiLocationSupport: z.boolean().default(false),
// });

// export type AirportAncillary = z.infer<typeof airportAncillarySchema>;

// interface AirportAncillaryFormProps {
//   product: any | null;
//   onSubmit: (data: AirportAncillary) => void;
//   onCancel: () => void;
// }

// const mockAirportsFallback = [
//     { id: '1', name: 'Heathrow Airport', iataCode: 'LHR' },
//     { id: '2', name: 'John F. Kennedy', iataCode: 'JFK' },
// ];

// export function AncillaryProductForm({ product, onSubmit, onCancel }: AirportAncillaryFormProps) {
//   const firestore = useFirestore();
//   const airportsQuery = React.useMemo(() => firestore ? collection(firestore, 'airports') : undefined, [firestore]);
//   const { data: airportsCollection } = useCollection(airportsQuery);

//   const airports = (airportsCollection && airportsCollection.length > 0) ? airportsCollection : mockAirportsFallback;

//   const form = useForm<AirportAncillary>({
//     resolver: zodResolver(airportAncillarySchema),
//     defaultValues: product ? {
//         ...product,
//         effectiveDate: {
//             from: product.effectiveDate?.from ? (product.effectiveDate.from instanceof Date ? product.effectiveDate.from : product.effectiveDate.from.toDate()) : null,
//             to: product.effectiveDate?.to ? (product.effectiveDate.to instanceof Date ? product.effectiveDate.to : product.effectiveDate.to.toDate()) : null,
//         }
//     } : {
//       category: 'Lounge',
//       subcategory: 'Lounge day pass',
//       ancillaryCode: 'LOU',
//       name: 'Lounge Entry',
//       shortName: 'Lounge Entry',
//       description: 'Access to premium hub lounge facilities.',
//       serviceType: 'on-demand',
//       status: 'Active',
//       version: 1,
//       effectiveDate: { from: null, to: null },
//       airportCode: '',
//       airlineCode: '',
//       providerType: 'vendor',
//       supplierId: '',
//       providerName: '',
//       confirmationType: 'instant',
//       terminals: '',
//       zone: '',
//       servicePoint: '',
//       isGateApplicable: false,
//       journeyStage: 'Departure',
//       multiLocationSupport: false,
//     },
//   });

//   const selectedCategory = form.watch('category');
//   const availableSubcategories = categorySubcategoryMap[selectedCategory] || [];

//   // Logic to default name, shortName, and code based on category selection
//   React.useEffect(() => {
//     const subscription = form.watch((value, { name }) => {
//       if (name === 'category') {
//           const defaults = categoryDefaults[value.category as string];
//           if (defaults) {
//             form.setValue('name', defaults.name, { shouldValidate: true });
//             form.setValue('shortName', defaults.name, { shouldValidate: true });
//             form.setValue('ancillaryCode', defaults.code, { shouldValidate: true });
//           }
          
//           const newSubs = categorySubcategoryMap[value.category as string];
//           if (newSubs && newSubs.length > 0) {
//               form.setValue('subcategory', newSubs[0], { shouldValidate: true });
//           }
//       }
//     });
//     return () => subscription.unsubscribe();
//   }, [form]);

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-h-[80vh] overflow-y-auto pr-4">
        
//         {/* --- 1. CORE AIRPORT ANCILLARY MASTER DETAILS --- */}
//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
//                 <Tag className="h-3.5 w-3.5" /> 1. Core Airport Ancillary Master Details
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//                 <FormField control={form.control} name="category" render={({ field }) => (
//                     <FormItem><FormLabel>Main Category*</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                         <SelectContent>{mainCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
//                     </Select>
//                     <FormMessage />
//                     </FormItem>
//                 )} />
//                 <FormField control={form.control} name="subcategory" render={({ field }) => (
//                     <FormItem><FormLabel>Subcategory*</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                         <SelectContent>{availableSubcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
//                     </Select>
//                     <FormMessage />
//                     </FormItem>
//                 )} />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField control={form.control} name="name" render={({ field }) => (
//                     <FormItem><FormLabel>Ancillary Name*</FormLabel><FormControl><Input placeholder="e.g., Executive Lounge" {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <FormField control={form.control} name="shortName" render={({ field }) => (
//                     <FormItem><FormLabel>Short Name*</FormLabel><FormControl><Input placeholder="e.g., Exec Lounge" {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//                 <FormField control={form.control} name="ancillaryCode" render={({ field }) => (
//                     <FormItem><FormLabel>Ancillary Code*</FormLabel><FormControl><Input placeholder="e.g., LOU" {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <FormField control={form.control} name="version" render={({ field }) => (
//                     <FormItem><FormLabel>Version*</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <FormField control={form.control} name="status" render={({ field }) => (
//                     <FormItem><FormLabel>Status*</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                         <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent>
//                     </Select>
//                     <FormMessage />
//                     </FormItem>
//                 )} />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//                  <FormField control={form.control} name="serviceType" render={({ field }) => (
//                     <FormItem><FormLabel>Service Type*</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                         <SelectContent>
//                             <SelectItem value="on-demand">On-demand</SelectItem>
//                             <SelectItem value="slot-based">Slot-based</SelectItem>
//                             <SelectItem value="request-based">Request-based</SelectItem>
//                         </SelectContent>
//                     </Select>
//                     <FormMessage />
//                     </FormItem>
//                 )} />
//                 <div className="flex flex-col gap-4">
//                     <FormLabel className="text-xs font-semibold text-muted-foreground uppercase">Validity Period (Optional)</FormLabel>
//                     <div className="grid grid-cols-2 gap-2">
//                         <FormField control={form.control} name="effectiveDate.from" render={({ field }) => (
//                             <FormItem className="flex flex-col">
//                                 <Popover>
//                                     <PopoverTrigger asChild>
//                                         <FormControl><Button variant="outline" size="sm" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-3 w-3 opacity-50" />{field.value ? format(field.value, "PP") : <span>Start</span>}</Button></FormControl>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} initialFocus /></PopoverContent>
//                                 </Popover>
//                             </FormItem>
//                         )} />
//                         <FormField control={form.control} name="effectiveDate.to" render={({ field }) => (
//                             <FormItem className="flex flex-col">
//                                 <Popover>
//                                     <PopoverTrigger asChild>
//                                         <FormControl><Button variant="outline" size="sm" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-3 w-3 opacity-50" />{field.value ? format(field.value, "PP") : <span>End</span>}</Button></FormControl>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} initialFocus /></PopoverContent>
//                                 </Popover>
//                             </FormItem>
//                         )} />
//                     </div>
//                 </div>
//             </div>

//              <FormField control={form.control} name="description" render={({ field }) => (
//                 <FormItem><FormLabel>Description*</FormLabel><FormControl><Textarea placeholder="Logical description for retailing..." {...field} /></FormControl><FormMessage /></FormItem>
//             )} />
//         </section>

//         <Separator />

//         {/* --- 2. OWNERSHIP & PROVIDER DETAILS --- */}
//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
//                 <Building2 className="h-3.5 w-3.5" /> 2. Ownership & Provider Details
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//                 <FormField control={form.control} name="airportCode" render={({ field }) => (
//                     <FormItem>
//                         <FormLabel>Authorized Airport Node*</FormLabel>
//                         <Select onValueChange={field.onChange} value={field.value}>
//                             <FormControl><SelectTrigger><SelectValue placeholder="Select Hub..." /></SelectTrigger></FormControl>
//                             <SelectContent>
//                                 {airports.map((a: any) => (
//                                     <SelectItem key={a.id} value={a.iataCode}>{a.name} ({a.iataCode})</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                         <FormMessage />
//                     </FormItem>
//                 )} />
//                 <FormField control={form.control} name="airlineCode" render={({ field }) => (
//                     <FormItem><FormLabel>Airline Code (Seller)</FormLabel><FormControl><Input placeholder="e.g., GAB" {...field} maxLength={3} /></FormControl></FormItem>
//                 )} />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//                 <FormField control={form.control} name="providerType" render={({ field }) => (
//                     <FormItem><FormLabel>Provider Type</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                         <SelectContent>
//                             <SelectItem value="airport">Airport Authority</SelectItem>
//                             <SelectItem value="lounge operator">Lounge Operator</SelectItem>
//                             <SelectItem value="vendor">Third-Party Vendor</SelectItem>
//                         </SelectContent>
//                     </Select></FormItem>
//                 )} />
//                 <FormField control={form.control} name="supplierId" render={({ field }) => (
//                     <FormItem><FormLabel>Supplier / Partner ID</FormLabel><FormControl><Input placeholder="e.g., PART-01" {...field} /></FormControl></FormItem>
//                 )} />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//                 <FormField control={form.control} name="providerName" render={({ field }) => (
//                     <FormItem><FormLabel>Supplier Name</FormLabel><FormControl><Input placeholder="e.g., Hub Lounges Global" {...field} /></FormControl></FormItem>
//                 )} />
//                 <FormField control={form.control} name="contractReference" render={({ field }) => (
//                     <FormItem><FormLabel>Contract Reference</FormLabel><FormControl><Input placeholder="e.g., CONT-2025" {...field} /></FormControl></FormItem>
//                 )} />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//                 <FormField control={form.control} name="confirmationType" render={({ field }) => (
//                     <FormItem><FormLabel>Confirmation Type</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                         <SelectContent>
//                             <SelectItem value="instant">Instant</SelectItem>
//                             <SelectItem value="request">On-Request</SelectItem>
//                             <SelectItem value="manual">Manual</SelectItem>
//                         </SelectContent>
//                     </Select></FormItem>
//                 )} />
//                 <FormField control={form.control} name="slaLevel" render={({ field }) => (
//                     <FormItem><FormLabel>SLA Level</FormLabel><FormControl><Input placeholder="e.g., 15m Response" {...field} /></FormControl></FormItem>
//                 )} />
//             </div>
            
//             <FormField control={form.control} name="contactDetails" render={({ field }) => (
//                 <FormItem><FormLabel>Contact / Escalation Details</FormLabel><FormControl><Input placeholder="ops@supplier.com | +44..." {...field} /></FormControl></FormItem>
//             )} />
//         </section>

//         <Separator />

//         {/* --- 3. LOCATION CONFIGURATION --- */}
//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
//                 <MapPin className="h-3.5 w-3.5" /> 3. Location Configuration
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//                 <FormField control={form.control} name="terminals" render={({ field }) => (
//                     <FormItem><FormLabel>Active Terminal(s)*</FormLabel><FormControl><Input placeholder="e.g., T2, T5" {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <FormField control={form.control} name="zone" render={({ field }) => (
//                     <FormItem><FormLabel>Concourse / Zone</FormLabel><FormControl><Input placeholder="e.g., North Plaza" {...field} /></FormControl></FormItem>
//                 )} />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//                 <FormField control={form.control} name="servicePoint" render={({ field }) => (
//                     <FormItem><FormLabel>Service Point</FormLabel><FormControl><Input placeholder="e.g., Lounge Desk B" {...field} /></FormControl><FormDescription className="text-[10px]">Specific area of consumption.</FormDescription></FormItem>
//                 )} />
//                 <FormField control={form.control} name="journeyStage" render={({ field }) => (
//                     <FormItem><FormLabel>Applicability</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                         <SelectContent>
//                             <SelectItem value="Departure">Departure Only</SelectItem>
//                             <SelectItem value="Arrival">Arrival Only</SelectItem>
//                             <SelectItem value="Transit">Transit Only</SelectItem>
//                             <SelectItem value="All">All Journey Stages</SelectItem>
//                         </SelectContent>
//                     </Select></FormItem>
//                 )} />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//                  <FormField control={form.control} name="isGateApplicable" render={({ field }) => (
//                     <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-muted/20">
//                         <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
//                         <div className="space-y-1 leading-none"><FormLabel>Gate Area Retailing</FormLabel></div>
//                     </FormItem>
//                 )} />
//                 <FormField control={form.control} name="multiLocationSupport" render={({ field }) => (
//                     <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-muted/20">
//                         <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
//                         <div className="space-y-1 leading-none"><FormLabel>Multi-Node Support</FormLabel></div>
//                     </FormItem>
//                 )} />
//             </div>
//         </section>

//         <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background py-4 z-20">
//           <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
//           <Button type="submit" className="font-bold px-8">Publish Hub Master SKU</Button>
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
import { Building2, MapPin, Calendar as CalendarIcon, Tag, ShieldCheck, Map, Terminal, Clock, Store } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Stepper, type StepItem } from '../Stepper/Stepper';

const categorySubcategoryMap: Record<string, string[]> = {
  'Lounge': ['Lounge day pass', 'Lounge & Spa', 'Executive suite', 'Arrivals lounge'],
  'Priority service': ['Fast track security', 'Priority check-in', 'Priority baggage', 'Express boarding'],
  'Meal': ['Pre-book meal', 'Airport restaurant voucher', 'Gourmet meal box'],
  'Wi-Fi / connectivity': ['Airport Wi-Fi pass', 'Business center access', 'Roaming SIM'],
  'Parking': ['Valet parking', 'Short stay parking', 'Long stay parking', 'Premium parking'],
  'Ground Transport': ['Chauffeur service', 'Airport shuttle', 'Luxury car transfer', 'Coach transfer'],
  'Inflight comfort': ['Amenity kit', 'Blanket rental', 'Sleep pod (hourly)'],
  'Special service': ['Porter service', 'Concierge service', 'Meet & Greet', 'Personal shopper'],
  'Flexibility / protection': ['Cancel protection', 'Missed connection support'],
  'Bundle': ['Premium Hub Pack', 'Family Transit Bundle', 'Executive Stopover'],
};

const mainCategories = Object.keys(categorySubcategoryMap);

const categoryDefaults: Record<string, { name: string; code: string }> = {
  'Lounge': { name: 'Lounge Entry', code: 'LOU' },
  'Priority service': { name: 'Fast Track', code: 'PRTY' },
  'Meal': { name: 'Pre-paid Meal', code: 'MEAL' },
  'Wi-Fi / connectivity': { name: 'Wi-Fi Access', code: 'WIFI' },
  'Parking': { name: 'Valet Parking', code: 'PRK' },
  'Ground Transport': { name: 'Private Transfer', code: 'GND' },
  'Inflight comfort': { name: 'Comfort Service', code: 'CMFT' },
  'Special service': { name: 'Concierge Service', code: 'SPEC' },
  'Flexibility / protection': { name: 'Flexibility Pack', code: 'FLEX' },
  'Bundle': { name: 'Hub Bundle', code: 'BUN' },
};

const airportAncillarySchema = z.object({
  id: z.string().optional(),
  // 1. Core Details (Mandatory as per section 1 request)
  category: z.enum(mainCategories as [string, ...string[]]),
  subcategory: z.string().min(1, 'Subcategory is required.'),
  ancillaryCode: z.string().min(1, 'Code is required.').toUpperCase(),
  name: z.string().min(1, 'Name is required.'),
  shortName: z.string().min(1, 'Short name is required.'),
  description: z.string().min(1, 'Description is required.'),
  serviceType: z.enum(['slot-based', 'on-demand', 'request-based']),
  status: z.enum(['Active', 'Inactive']),
  version: z.coerce.number().min(1, 'Version is required.'),
  effectiveDate: z.object({
    from: z.date().optional().nullable(),
    to: z.date().optional().nullable(),
  }).optional(),
  
  // 2. Ownership & Provider (Mandatory: Airport code)
  airportCode: z.string().min(1, 'Airport node is required.'),
  airlineCode: z.string().optional(),
  providerType: z.enum(['airport', 'lounge operator', 'vendor']).optional(),
  supplierId: z.string().optional(),
  providerName: z.string().optional(),
  contractReference: z.string().optional(),
  slaLevel: z.string().optional(),
  confirmationType: z.enum(['instant', 'request', 'manual']).optional(),
  contactDetails: z.string().optional(),
  
  // 3. Location (Mandatory: Terminals)
  terminals: z.string().min(1, 'Active terminal(s) required.'),
  zone: z.string().optional(),
  servicePoint: z.string().optional(),
  isGateApplicable: z.boolean().default(false),
  journeyStage: z.enum(['Departure', 'Arrival', 'Transit', 'All']).optional(),
  multiLocationSupport: z.boolean().default(false),
});

export type AirportAncillary = z.infer<typeof airportAncillarySchema>;

interface AirportAncillaryFormProps {
  product: any | null;
  onSubmit: (data: AirportAncillary) => void;
  onCancel: () => void;
}

const mockAirportsFallback = [
    { id: '1', name: 'Chhatrapati Shivaji Maharaj International Airport', iataCode: 'BOM' },
    { id: '2', name: 'Dubai International Airport', iataCode: 'DXB' },
    { id: '3', name: 'Indira Gandhi International Airport', iataCode: 'DEL' },
    { id: '4', name: 'Singapore Changi Airport', iataCode: 'SIN' },
];

// ─── Steps Config ─────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  { id: 1, label: 'Core Airport Ancillary Master Details' },
  { id: 2, label: 'Ownership & Provider Details' },
  { id: 3, label: 'Location Configuration' },
];

export function AncillaryProductForm({ product, onSubmit, onCancel }: AirportAncillaryFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const firestore = useFirestore();
  const airportsQuery = React.useMemo(() => firestore ? collection(firestore, 'airports') : undefined, [firestore]);
  const { data: airportsCollection } = useCollection(airportsQuery);

  const airports = (airportsCollection && airportsCollection.length > 0) ? airportsCollection : mockAirportsFallback;

  const form = useForm<AirportAncillary>({
    resolver: zodResolver(airportAncillarySchema),
    defaultValues: product ? {
        ...product,
        effectiveDate: {
            from: product.effectiveDate?.from ? (product.effectiveDate.from instanceof Date ? product.effectiveDate.from : product.effectiveDate.from.toDate()) : null,
            to: product.effectiveDate?.to ? (product.effectiveDate.to instanceof Date ? product.effectiveDate.to : product.effectiveDate.to.toDate()) : null,
        }
    } : {
      category: 'Lounge',
      subcategory: 'Lounge day pass',
      ancillaryCode: 'LOU',
      name: 'Lounge Entry',
      shortName: 'Lounge Entry',
      description: 'Access to premium hub lounge facilities.',
      serviceType: 'on-demand',
      status: 'Active',
      version: 1,
      effectiveDate: { from: null, to: null },
      airportCode: '',
      airlineCode: '',
      providerType: 'vendor',
      supplierId: '',
      providerName: '',
      confirmationType: 'instant',
      terminals: '',
      zone: '',
      servicePoint: '',
      isGateApplicable: false,
      journeyStage: 'Departure',
      multiLocationSupport: false,
    },
  });

  // ─── Step field map for validation ─────────────────────────────────────────
  const stepFields: Record<number, (keyof AirportAncillary)[]> = {
    1: ['category', 'subcategory', 'ancillaryCode', 'name', 'shortName', 'description', 'serviceType', 'status', 'version'],
    2: ['airportCode'],
    3: ['terminals'],
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const valid = await form.trigger(fields);
    if (!valid) return;
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const isLastStep = currentStep === 3;
  const isEditing = !!product;

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Define core ancillary details, categorization, and master data.";
      case 2: return "Specify ownership, provider, and commercial terms.";
      case 3: return "Configure location, terminals, and service points.";
      default: return "";
    }
  };

  const selectedCategory = form.watch('category');
  const availableSubcategories = categorySubcategoryMap[selectedCategory] || [];

  // Logic to default name, shortName, and code based on category selection
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'category') {
          const defaults = categoryDefaults[value.category as string];
          if (defaults) {
            form.setValue('name', defaults.name, { shouldValidate: true });
            form.setValue('shortName', defaults.name, { shouldValidate: true });
            form.setValue('ancillaryCode', defaults.code, { shouldValidate: true });
          }
          
          const newSubs = categorySubcategoryMap[value.category as string];
          if (newSubs && newSubs.length > 0) {
              form.setValue('subcategory', newSubs[0], { shouldValidate: true });
          }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0">

        {/* ── Stepper ──────────────────────────────────────────────────── */}
        <div className="pb-4">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="space-y-5 max-h-[50vh] overflow-y-auto">

          {/* Step 1 — Core Airport Ancillary Master Details */}
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Main Category <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                          {mainCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="subcategory" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Subcategory <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                          {availableSubcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Ancillary Name <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Executive Lounge" 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="shortName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Short Name <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Exec Lounge" 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="ancillaryCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Ancillary Code <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., LOU" 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="version" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Version <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Status <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="serviceType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Service Type <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                          <SelectItem value="on-demand">On-demand</SelectItem>
                          <SelectItem value="slot-based">Slot-based</SelectItem>
                          <SelectItem value="request-based">Request-based</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                )} />
                <div className="flex flex-col gap-4">
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Validity Period (Optional)
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField control={form.control} name="effectiveDate.from" render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" size="sm" className={cn(
                                "h-10 rounded-xl border-2 border-slate-200 bg-slate-50/60 text-sm text-slate-800 hover:border-slate-300 transition-all",
                                !field.value && "text-slate-400"
                              )}>
                                <CalendarIcon className="mr-2 h-3 w-3 opacity-50" />
                                {field.value ? format(field.value, "PP") : <span>Start</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="effectiveDate.to" render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" size="sm" className={cn(
                                "h-10 rounded-xl border-2 border-slate-200 bg-slate-50/60 text-sm text-slate-800 hover:border-slate-300 transition-all",
                                !field.value && "text-slate-400"
                              )}>
                                <CalendarIcon className="mr-2 h-3 w-3 opacity-50" />
                                {field.value ? format(field.value, "PP") : <span>End</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )} />
                  </div>
                </div>
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Description <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Logical description for retailing..." 
                      className="rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )} />
            </>
          )}

          {/* Step 2 — Ownership & Provider Details */}
          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="airportCode" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Authorized Airport Node <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                          <SelectValue placeholder="Select Hub..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                        {airports.map((a: any) => (
                          <SelectItem key={a.id} value={a.iataCode}>{a.name} ({a.iataCode})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="airlineCode" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Airline Code (Seller)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., GAB" 
                        maxLength={3} 
                        className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="providerType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Provider Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                        <SelectItem value="airport">Airport Authority</SelectItem>
                        <SelectItem value="lounge operator">Lounge Operator</SelectItem>
                        <SelectItem value="vendor">Third-Party Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="supplierId" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Supplier / Partner ID
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., PART-01" 
                        className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="providerName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Supplier Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Hub Lounges Global" 
                        className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="contractReference" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Contract Reference
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., CONT-2025" 
                        className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="confirmationType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Confirmation Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="request">On-Request</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="slaLevel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      SLA Level
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 15m Response" 
                        className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
              
              <FormField control={form.control} name="contactDetails" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Contact / Escalation Details
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ops@supplier.com | +44..." 
                      className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )} />
            </>
          )}

          {/* Step 3 — Location Configuration */}
          {currentStep === 3 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="terminals" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Active Terminal(s) <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., T2, T5" 
                        className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="zone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Concourse / Zone
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., North Plaza" 
                        className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="servicePoint" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Service Point
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Lounge Desk B" 
                        className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-[10px] text-slate-400">Specific area of consumption.</FormDescription>
                  </FormItem>
                )} />
                <FormField control={form.control} name="journeyStage" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Applicability
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                        <SelectItem value="Departure">Departure Only</SelectItem>
                        <SelectItem value="Arrival">Arrival Only</SelectItem>
                        <SelectItem value="Transit">Transit Only</SelectItem>
                        <SelectItem value="All">All Journey Stages</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="isGateApplicable" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-slate-50/60">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-xs font-semibold text-slate-700">Gate Area Retailing</FormLabel>
                    </div>
                  </FormItem>
                )} />
                <FormField control={form.control} name="multiLocationSupport" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-slate-50/60">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-xs font-semibold text-slate-700">Multi-Node Support</FormLabel>
                    </div>
                  </FormItem>
                )} />
              </div>
            </>
          )}
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="h-px bg-slate-100 mx-7" />

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="px-7 py-4 bg-slate-50/50 flex items-center justify-between gap-3">
          {/* Cancel / Discard */}
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-semibold text-slate-500 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:text-slate-700 transition-all duration-150 cursor-pointer"
          >
            Discard
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
                Publish Hub Master SKU
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