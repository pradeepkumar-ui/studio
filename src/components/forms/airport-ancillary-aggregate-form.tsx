// 'use client';

// import * as React from 'react';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm, useFieldArray } from 'react-hook-form';
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
// import { useFirestore, useCollection } from '@/firebase';
// import { collection } from 'firebase/firestore';
// import { Building2, Info, DollarSign, PlusCircle, Trash2, Settings2 } from 'lucide-react';

// const dropdownOptions: Record<string, string[]> = {
//   'Cabin Class': ['Economy', 'Premium Economy', 'Business', 'First', 'All'],
//   'Fare Brand': ['Economy Light', 'Economy Flex', 'Business Saver', 'Business Flex'],
//   'Passenger Type': ['Adult', 'Child', 'Infant'],
//   'Channel': ['Web', 'Mobile', 'CUSS Kiosk', 'CUTE Agent', 'CUPPS'],
//   'Loyalty Tier': ['Platinum', 'Gold', 'Silver', 'Bronze', 'None'],
//   'Journey Stage': ['Departure', 'Arrival', 'Transit', 'All'],
//   'Security Lane Status': ['Open', 'Limited', 'Express Only', 'Closed'],
//   'Lounge Occupancy Level': ['Low', 'Moderate', 'High', 'At Capacity'],
//   'Operational Mode': ['NORMAL', 'CONGESTION', 'DISRUPTION'],
// };

// const MASTER_AIRPORT_PARAMETER_POOL = [
//   'Airport Code',
//   'Terminal',
//   'Concourse / Zone',
//   'Gate Area',
//   'Lounge Operator',
//   'Lounge Occupancy Level',
//   'Lounge Capacity',
//   'Security Pacing Level',
//   'Security Lane Status',
//   'Checkpoint Location',
//   'Ground Partner (Supplier)',
//   'Journey Stage',
//   'Layover Duration',
//   'Time Slot (Service Window)',
//   'Staff Availability Level',
//   'Vehicle Type (Transport)',
//   'Space Availability (Parking)',
//   'Zone Level (Parking)',
//   'Service Point ID',
//   'SITA Hardware ID',
//   'Channel',
//   'Passenger Type',
//   'Loyalty Tier',
//   'Cabin Class',
//   'Fare Brand',
//   'Operational Mode'
// ].sort();

// const airportAggregateSchema = z.object({
//   id: z.string().optional(),
//   configName: z.string().min(5, 'Configuration name is required.'),
//   ancillaryId: z.string().min(1, 'Please select an airport ancillary.'),
//   basePrice: z.coerce.number().min(0, 'Base price must be a non-negative number.'),
//   currency: z.string().length(3, 'Currency must be a 3-letter code.').toUpperCase().default('USD'),
//   status: z.enum(['Draft', 'Active', 'Archived']).default('Draft'),
//   parameters: z.array(z.object({
//     name: z.string().min(1, 'Select a parameter'),
//     value: z.string().min(1, 'Value is required')
//   })).default([]),
// });

// export type AirportAncillaryAggregate = z.infer<typeof airportAggregateSchema> & { ancillaryName?: string, category?: string };

// interface AirportAncillaryAggregateFormProps {
//   aggregate: any | null;
//   onSubmit: (data: AirportAncillaryAggregate) => void;
//   onCancel: () => void;
// }

// const mockAirportAncillariesFallback = [
//   { id: 'ap1', name: 'Executive Lounge Access', ancillaryCode: 'LOU', category: 'Lounge', airportCode: 'LHR' },
//   { id: 'ap2', name: 'Fast Track Security', ancillaryCode: 'FST', category: 'Priority service', airportCode: 'JFK' },
//   { id: 'ap3', name: 'VIP Valet Parking', ancillaryCode: 'VAL', category: 'Parking', airportCode: 'SIN' },
//   { id: 'ap4', name: 'Premium Sleeping Pod (6h)', ancillaryCode: 'POD', category: 'Inflight comfort', airportCode: 'DXB' },
//   { id: 'ap5', name: 'Porter Service (3 Bags)', ancillaryCode: 'PTR', category: 'Special service', airportCode: 'LHR' },
// ];

// export function AirportAncillaryAggregateForm({ aggregate, onSubmit, onCancel }: AirportAncillaryAggregateFormProps) {
//   const firestore = useFirestore();
//   const airportServicesQuery = React.useMemo(() => firestore ? collection(firestore, 'airportServices') : undefined, [firestore]);
//   const { data: airportServicesCollection } = useCollection(airportServicesQuery);

//   const availableAncillaries = React.useMemo(() => {
//     return (airportServicesCollection && airportServicesCollection.length > 0) 
//       ? (airportServicesCollection as any[]) 
//       : mockAirportAncillariesFallback;
//   }, [airportServicesCollection]);

//   const initialParameters = React.useMemo(() => {
//     if (!aggregate?.parameters) return [];
//     if (Array.isArray(aggregate.parameters)) return aggregate.parameters;
//     return Object.entries(aggregate.parameters).map(([name, value]) => ({ 
//       name, 
//       value: String(value) 
//     }));
//   }, [aggregate]);

//   const form = useForm<AirportAncillaryAggregate>({
//     resolver: zodResolver(airportAggregateSchema),
//     defaultValues: aggregate ? {
//       ...aggregate,
//       parameters: initialParameters
//     } : {
//       configName: '',
//       ancillaryId: '',
//       basePrice: 0,
//       currency: 'INR',
//       status: 'Draft',
//       parameters: [],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "parameters"
//   });

//   const selectedAncillaryId = form.watch('ancillaryId');
//   const selectedAncillary = availableAncillaries.find(a => a.id === selectedAncillaryId);

//   React.useEffect(() => {
//     if (selectedAncillary) {
//         const currentName = form.getValues('configName');
//         if (!currentName || currentName.includes('Hub Logic Set') || currentName === '') {
//             form.setValue('configName', `${selectedAncillary.name} (${selectedAncillary.airportCode}) Hub Logic Set`, { shouldValidate: true });
//         }
//     }
//   }, [selectedAncillaryId, selectedAncillary, form]);

//   const handleFinalSubmit = (data: AirportAncillaryAggregate) => {
//     onSubmit({
//       ...data,
//       ancillaryName: selectedAncillary?.name,
//       category: selectedAncillary?.category,
//     });
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
        
//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
//                 <Building2 className="h-3.5 w-3.5" /> 1. Hub Configuration Target
//             </div>
            
//             <FormField control={form.control} name="ancillaryId" render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>Linked Airport Ancillary Master*</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl><SelectTrigger><SelectValue placeholder="Select Hub SKU..." /></SelectTrigger></FormControl>
//                         <SelectContent>
//                             {availableAncillaries.map(a => (
//                                 <SelectItem key={a.id} value={a.id}>{a.name} ({a.airportCode})</SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                     <FormMessage />
//                 </FormItem>
//             )} />

//             <FormField control={form.control} name="configName" render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>Configuration Name*</FormLabel>
//                     <FormControl><Input placeholder="e.g., LHR T5 Lounge Optimization" {...field} /></FormControl>
//                     <FormMessage />
//                 </FormItem>
//             )} />

//             <div className="grid grid-cols-2 gap-4">
//               <FormField control={form.control} name="basePrice" render={({ field }) => (
//                   <FormItem>
//                       <FormLabel>Base Price (Per Unit)*</FormLabel>
//                       <div className="relative">
//                           <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                           <FormControl><Input type="number" placeholder="0.00" className="pl-9 font-bold" {...field} /></FormControl>
//                       </div>
//                       <FormMessage />
//                   </FormItem>
//               )} />
//               <FormField control={form.control} name="currency" render={({ field }) => (
//                   <FormItem>
//                       <FormLabel>ISO Currency*</FormLabel>
//                       <FormControl><Input placeholder="USD" className="font-mono uppercase" {...field} maxLength={3} /></FormControl>
//                       <FormMessage />
//                   </FormItem>
//               )} />
//             </div>
//         </section>

//         <Separator />

//         <section className="space-y-4">
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
//                     <Settings2 className="h-3.5 w-3.5" /> 2. Hub-Managed Aggregate Parameters
//                 </div>
//                 <Button 
//                     type="button" 
//                     variant="outline" 
//                     size="sm" 
//                     onClick={() => append({ name: '', value: '' })}
//                     className="h-8 font-bold"
//                 >
//                     <PlusCircle className="h-3.5 w-3.5 mr-2" /> Add Hub Parameter
//                 </Button>
//             </div>

//             {fields.length > 0 ? (
//                 <div className="space-y-3">
//                     {fields.map((item, index) => {
//                         const selectedParamName = form.watch(`parameters.${index}.name`);
//                         const options = dropdownOptions[selectedParamName];

//                         return (
//                             <div key={item.id} className="grid grid-cols-12 gap-3 p-4 rounded-xl border bg-muted/20 items-end">
//                                 <div className="col-span-5">
//                                     <FormField
//                                         control={form.control}
//                                         name={`parameters.${index}.name`}
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Airport Signal</FormLabel>
//                                                 <Select onValueChange={field.onChange} value={field.value}>
//                                                     <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Select Signal..." /></SelectTrigger></FormControl>
//                                                     <SelectContent>
//                                                         {MASTER_AIRPORT_PARAMETER_POOL.map(p => (
//                                                             <SelectItem key={p} value={p}>{p}</SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 </div>
//                                 <div className="col-span-6">
//                                     <FormField
//                                         control={form.control}
//                                         name={`parameters.${index}.value`}
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Registry Value</FormLabel>
//                                                 {options ? (
//                                                     <Select onValueChange={field.onChange} value={field.value}>
//                                                         <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Select Value..." /></SelectTrigger></FormControl>
//                                                         <SelectContent>
//                                                             {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
//                                                         </SelectContent>
//                                                     </Select>
//                                                 ) : (
//                                                     <FormControl><Input placeholder="Set logic value..." className="h-9" {...field} /></FormControl>
//                                                 )}
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 </div>
//                                 <div className="col-span-1 flex justify-end">
//                                     <Button 
//                                         type="button" 
//                                         variant="ghost" 
//                                         size="icon" 
//                                         onClick={() => remove(index)}
//                                         className="text-muted-foreground hover:text-destructive h-9 w-9"
//                                     >
//                                         <Trash2 className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             ) : (
//                 <div className="py-8 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl opacity-50 bg-muted/10">
//                     <Info className="h-8 w-8 mb-2" />
//                     <p className="text-sm font-medium text-center">No hub parameters defined. Select signals like "Lounge Occupancy" or "Security Pacing" to begin.</p>
//                 </div>
//             )}
//         </section>

//         <Separator />

//         <FormField control={form.control} name="status" render={({ field }) => (
//             <FormItem>
//                 <FormLabel>Deployment Status</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                     <SelectContent>
//                         <SelectItem value="Draft">Draft</SelectItem>
//                         <SelectItem value="Active">Active</SelectItem>
//                         <SelectItem value="Archived">Archived</SelectItem>
//                     </SelectContent>
//                 </Select>
//             </FormItem>
//         )} />

//         <div className="flex justify-end gap-3 pt-6 border-t sticky bottom-0 bg-background py-4 z-10">
//           <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
//           <Button type="submit" className="font-bold px-8">Save Hub Aggregate Logic</Button>
//         </div>
//       </form>
//     </Form>
//   );
// }




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
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Building2, Info, DollarSign, PlusCircle, Trash2, Settings2 } from 'lucide-react';
import { Stepper, type StepItem } from '../Stepper/Stepper';

const dropdownOptions: Record<string, string[]> = {
  'Cabin Class': ['Economy', 'Premium Economy', 'Business', 'First', 'All'],
  'Fare Brand': ['Economy Light', 'Economy Flex', 'Business Saver', 'Business Flex'],
  'Passenger Type': ['Adult', 'Child', 'Infant'],
  'Channel': ['Web', 'Mobile', 'CUSS Kiosk', 'CUTE Agent', 'CUPPS'],
  'Loyalty Tier': ['Platinum', 'Gold', 'Silver', 'Bronze', 'None'],
  'Journey Stage': ['Departure', 'Arrival', 'Transit', 'All'],
  'Security Lane Status': ['Open', 'Limited', 'Express Only', 'Closed'],
  'Lounge Occupancy Level': ['Low', 'Moderate', 'High', 'At Capacity'],
  'Operational Mode': ['NORMAL', 'CONGESTION', 'DISRUPTION'],
};

const MASTER_AIRPORT_PARAMETER_POOL = [
  'Airport Code',
  'Terminal',
  'Concourse / Zone',
  'Gate Area',
  'Lounge Operator',
  'Lounge Occupancy Level',
  'Lounge Capacity',
  'Security Pacing Level',
  'Security Lane Status',
  'Checkpoint Location',
  'Ground Partner (Supplier)',
  'Journey Stage',
  'Layover Duration',
  'Time Slot (Service Window)',
  'Staff Availability Level',
  'Vehicle Type (Transport)',
  'Space Availability (Parking)',
  'Zone Level (Parking)',
  'Service Point ID',
  'SITA Hardware ID',
  'Channel',
  'Passenger Type',
  'Loyalty Tier',
  'Cabin Class',
  'Fare Brand',
  'Operational Mode'
].sort();

const airportAggregateSchema = z.object({
  id: z.string().optional(),
  configName: z.string().min(5, 'Configuration name is required.'),
  ancillaryId: z.string().min(1, 'Please select an airport ancillary.'),
  basePrice: z.coerce.number().min(0, 'Base price must be a non-negative number.'),
  currency: z.string().length(3, 'Currency must be a 3-letter code.').toUpperCase().default('USD'),
  status: z.enum(['Draft', 'Active', 'Archived']).default('Draft'),
  parameters: z.array(z.object({
    name: z.string().min(1, 'Select a parameter'),
    value: z.string().min(1, 'Value is required')
  })).default([]),
});

export type AirportAncillaryAggregate = z.infer<typeof airportAggregateSchema> & { ancillaryName?: string, category?: string };

interface AirportAncillaryAggregateFormProps {
  aggregate: any | null;
  onSubmit: (data: AirportAncillaryAggregate) => void;
  onCancel: () => void;
}

const mockAirportInventory: any[] = [
{ id: '1', ancillaryName: 'Executive Lounge Entry', airportCode: 'BOM', terminal: 'T5', zone: 'North Plaza', supplier: 'Lounge Stars', totalCapacity: 45, available: 12, syncStatus: 'Live', quotas: { CUSS: 10, CUTE: 5, Mobile: 30 }, timeSlotBased: true, operationalMode: 'NORMAL', realTimeSync: true, ancillaryCategory: 'Lounge', basePrice: 1800, currency: 'INR', timeSlot: '20:00 - 23:00', airportConfigMatch: true },
{ id: '2', ancillaryName: 'Fast Track Security', airportCode: 'DEL', terminal: 'T4', zone: 'Terminal 4 East', supplier: 'Airport Authority', totalCapacity: 200, available: 45, syncStatus: 'Live', quotas: { CUSS: 50, CUTE: 50, Mobile: 100 }, timeSlotBased: false, operationalMode: 'CONGESTION', realTimeSync: false, ancillaryCategory: 'Fast Track', basePrice: 750, currency: 'INR', timeSlot: null, airportConfigMatch: true },
{ id: '3', ancillaryName: 'VIP Valet Parking', airportCode: 'DEL', terminal: 'T1', zone: 'Carpark A', supplier: 'Changi Valet', totalCapacity: 20, available: 0, syncStatus: 'Critical', quotas: { CUSS: 2, CUTE: 2, Mobile: 16 }, timeSlotBased: true, operationalMode: 'NORMAL', realTimeSync: true, ancillaryCategory: 'Parking', basePrice: 600, currency: 'INR', timeSlot: '20:00 - 23:00', airportConfigMatch: true }
];

// ─── Steps Config ─────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  { id: 1, label: 'Hub Configuration Target' },
  { id: 2, label: 'Hub-Managed Aggregate Parameters' },
];

export function AirportAncillaryAggregateForm({ aggregate, onSubmit, onCancel }: AirportAncillaryAggregateFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const firestore = useFirestore();
  const airportServicesQuery = React.useMemo(() => firestore ? collection(firestore, 'airportServices') : undefined, [firestore]);
  const { data: airportServicesCollection } = useCollection(airportServicesQuery);

  const availableAncillaries = React.useMemo(() => {
    return (airportServicesCollection && airportServicesCollection.length > 0) 
      ? (airportServicesCollection as any[]) 
      : mockAirportAncillariesFallback;
  }, [airportServicesCollection]);

  const initialParameters = React.useMemo(() => {
    if (!aggregate?.parameters) return [];
    if (Array.isArray(aggregate.parameters)) return aggregate.parameters;
    return Object.entries(aggregate.parameters).map(([name, value]) => ({ 
      name, 
      value: String(value) 
    }));
  }, [aggregate]);

  const form = useForm<AirportAncillaryAggregate>({
    resolver: zodResolver(airportAggregateSchema),
    defaultValues: aggregate ? {
      ...aggregate,
      parameters: initialParameters
    } : {
      configName: '',
      ancillaryId: '',
      basePrice: 0,
      currency: 'INR',
      status: 'Draft',
      parameters: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parameters"
  });

  // ─── Step field map for validation ─────────────────────────────────────────
  const stepFields: Record<number, (keyof AirportAncillaryAggregate)[]> = {
    1: ['ancillaryId', 'configName', 'basePrice', 'currency'],
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
  const isEditing = !!aggregate;

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Select hub ancillary SKU and configure base pricing.";
      case 2: return "Define aggregate parameters for hub logic and signals.";
      default: return "";
    }
  };

  const selectedAncillaryId = form.watch('ancillaryId');
  const selectedAncillary = availableAncillaries.find(a => a.id === selectedAncillaryId);

  React.useEffect(() => {
    if (selectedAncillary) {
        const currentName = form.getValues('configName');
        if (!currentName || currentName.includes('Hub Logic Set') || currentName === '') {
            form.setValue('configName', `${selectedAncillary.name} (${selectedAncillary.airportCode}) Hub Logic Set`, { shouldValidate: true });
        }
    }
  }, [selectedAncillaryId, selectedAncillary, form]);

  const handleFinalSubmit = (data: AirportAncillaryAggregate) => {
    onSubmit({
      ...data,
      ancillaryName: selectedAncillary?.name,
      category: selectedAncillary?.category,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="flex flex-col gap-0">

        {/* ── Stepper ──────────────────────────────────────────────────── */}
        <div className="pb-4">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="space-y-5 max-h-[50vh] overflow-y-auto">

          {/* Step 1 — Hub Configuration Target */}
          {currentStep === 1 && (
            <>
              <FormField control={form.control} name="ancillaryId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Linked Airport Ancillary Master <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                        <SelectValue placeholder="Select Hub SKU..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                      {availableAncillaries.map(a => (
                        <SelectItem key={a.id} value={a.id}>{a.name} ({a.airportCode})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )} />

              <FormField control={form.control} name="configName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Configuration Name <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., LHR T5 Lounge Optimization" 
                      className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="basePrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Base Price (Per Unit) <span className="text-rose-500">*</span>
                    </FormLabel>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-9 font-bold h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 text-sm text-slate-800 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="currency" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      ISO Currency <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="USD" 
                        className="font-mono uppercase h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field} 
                        maxLength={3} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Deployment Status
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
            </>
          )}

          {/* Step 2 — Hub-Managed Aggregate Parameters */}
          {currentStep === 2 && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                  <Settings2 className="h-3.5 w-3.5 text-violet-600" /> Aggregate Parameters
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ name: '', value: '' })}
                  className="h-8 font-bold rounded-lg border-2 border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all"
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-2" /> Add Hub Parameter
                </Button>
              </div>

              {fields.length > 0 ? (
                <div className="space-y-3">
                  {fields.map((item, index) => {
                    const selectedParamName = form.watch(`parameters.${index}.name`);
                    const options = dropdownOptions[selectedParamName];

                    return (
                      <div key={item.id} className="grid grid-cols-12 gap-3 p-4 rounded-xl border-2 border-slate-100 bg-slate-50/30 items-end">
                        <div className="col-span-5">
                          <FormField
                            control={form.control}
                            name={`parameters.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-500">Airport Signal</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-9 rounded-lg border-2 border-slate-200 bg-white text-sm text-slate-800 focus:border-violet-400">
                                      <SelectValue placeholder="Select Signal..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                                    {MASTER_AIRPORT_PARAMETER_POOL.map(p => (
                                      <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs text-rose-500" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-6">
                          <FormField
                            control={form.control}
                            name={`parameters.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-500">Registry Value</FormLabel>
                                {options ? (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-9 rounded-lg border-2 border-slate-200 bg-white text-sm text-slate-800 focus:border-violet-400">
                                        <SelectValue placeholder="Select Value..." />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                                      {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <FormControl>
                                    <Input 
                                      placeholder="Set logic value..." 
                                      className="h-9 rounded-lg border-2 border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50"
                                      {...field} 
                                    />
                                  </FormControl>
                                )}
                                <FormMessage className="text-xs text-rose-500" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => remove(index)}
                            className="text-slate-400 hover:text-red-500 h-9 w-9"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed rounded-xl opacity-50 bg-slate-50/30">
                  <Info className="h-8 w-8 mb-2" />
                  <p className="text-sm font-medium text-center">No hub parameters defined. Select signals like "Lounge Occupancy" or "Security Pacing" to begin.</p>
                </div>
              )}
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
                Save Hub Aggregate Logic
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