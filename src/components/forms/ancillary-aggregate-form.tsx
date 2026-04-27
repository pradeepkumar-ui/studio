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
// import { Layers, Info, DollarSign, PlusCircle, Trash2, Settings2 } from 'lucide-react';

// const dropdownOptions: Record<string, string[]> = {
//   'Aircraft type': ['A320neo', 'A350-900', 'A380-800', 'B737 MAX', 'B777-300ER', 'B787-9'],
//   'Cabin class': ['Economy', 'Premium Economy', 'Business', 'First', 'All'],
//   'Flight duration': ['Short haul', 'Long haul'],
//   'Fare brand': ['Economy Light', 'Economy Flex', 'Business Saver', 'Business Flex'],
//   'Passenger type': ['Adult', 'Child', 'Infant'],
//   'Time to departure (DBD)': ['< 2hrs', '< 4hrs', '< 6 hrs', '< 8 hrs', '< 12 hrs', '< 24 hrs', '< 48 hrs'],
//   'Channel': ['Web', 'Mobile', 'Kiosk', 'NDC', 'GDS', 'Agent'],
//   'Loyalty tier': ['Platinum', 'Gold', 'Silver', 'Bronze', 'None'],
//   'Route type': ['Domestic', 'International', 'Regional'],
//   'Trip type': ['One-way', 'Round-trip', 'Multi-city'],
//   'Geography': ['Domestic', 'International', 'Transatlantic', 'Transpacific'],
// };

// const MASTER_PARAMETER_POOL = [
//   'Route', 
//   'Fare brand', 
//   'Cabin class', 
//   'Booking class (RBD)', 
//   'Passenger type', 
//   'Loyalty tier', 
//   'Load factor', 
//   'Time to departure (DBD)', 
//   'Booking window', 
//   'Lead time',
//   'Channel', 
//   'Aircraft type', 
//   'Flight duration', 
//   'Geography', 
//   'Trip type', 
//   'Point of Sale (POS)', 
//   'Passenger profile', 
//   'SSR type', 
//   'Meal inventory', 
//   'Seat availability', 
//   'Upgrade inventory', 
//   'Baggage allowance', 
//   'Device/Session rules',
//   'Aircraft retrofit/connectivity availability',
//   'Hold capacity',
//   'Weight/piece rules',
//   'Seat map / cabin layout',
//   'Check-in status',
//   'Premium cabin availability',
//   'Aircraft galley capability',
//   'Time of purchase',
//   'Available onboard inventory',
//   'Service level',
//   'Booking status'
// ].sort();

// const aggregateSchema = z.object({
//   id: z.string().optional(),
//   configName: z.string().min(5, 'Configuration name is required.'),
//   ancillaryId: z.string().min(1, 'Please select an ancillary.'),
//   basePrice: z.coerce.number().min(0, 'Base price must be a non-negative number.'),
//   currency: z.string().length(3, 'Currency must be a 3-letter code.').toUpperCase().default('USD'),
//   status: z.enum(['Draft', 'Active', 'Archived']).default('Draft'),
//   parameters: z.array(z.object({
//     name: z.string().min(1, 'Select a parameter'),
//     value: z.string().min(1, 'Value is required')
//   })).default([]),
// });

// export type AncillaryAggregate = z.infer<typeof aggregateSchema> & { ancillaryName?: string, category?: string };

// interface AncillaryAggregateFormProps {
//   aggregate: any | null;
//   onSubmit: (data: AncillaryAggregate) => void;
//   onCancel: () => void;
// }

// const mockAncillariesFallback = [
//   { id: '1', name: 'Extra Legroom Seat', ancillaryCode: 'EXLG', category: 'Seat' },
//   { id: '2', name: 'Premium Wi-Fi (Unlimited)', ancillaryCode: 'WIFU', category: 'Wi-Fi / connectivity' },
//   { id: '3', name: 'Standby Upgrade (J Class)', ancillaryCode: 'UPGS', category: 'Upgrade' },
//   { id: '4', name: '1st Checked Bag (23kg)', ancillaryCode: 'BAG1', category: 'Baggage' },
//   { id: '5', name: 'Priority Boarding', ancillaryCode: 'PBDG', category: 'Priority service' },
//   { id: '6', name: 'Executive Lounge Access', ancillaryCode: 'LOUA', category: 'Lounge' },
// ];

// export function AncillaryAggregateForm({ aggregate, onSubmit, onCancel }: AncillaryAggregateFormProps) {
//   const firestore = useFirestore();
//   const ancillariesQuery = React.useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
//   const { data: ancillariesCollection } = useCollection(ancillariesQuery);

//   const availableAncillaries = React.useMemo(() => {
//     return (ancillariesCollection && ancillariesCollection.length > 0) 
//       ? (ancillariesCollection as any[]) 
//       : mockAncillariesFallback;
//   }, [ancillariesCollection]);

//   const initialParameters = React.useMemo(() => {
//     if (!aggregate?.parameters) return [];
//     if (Array.isArray(aggregate.parameters)) return aggregate.parameters;
//     return Object.entries(aggregate.parameters).map(([name, value]) => ({ 
//       name, 
//       value: String(value) 
//     }));
//   }, [aggregate]);

//   const form = useForm<AncillaryAggregate>({
//     resolver: zodResolver(aggregateSchema),
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
//         if (!currentName || currentName.includes('Logic Set') || currentName === '') {
//             form.setValue('configName', `${selectedAncillary.name} Logic Set`, { shouldValidate: true });
//         }
//     }
//   }, [selectedAncillaryId, selectedAncillary, form]);

//   const handleFinalSubmit = (data: AncillaryAggregate) => {
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
//                 <Layers className="h-3.5 w-3.5" /> 1. Configuration Target
//             </div>
            
//             <FormField control={form.control} name="ancillaryId" render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>Linked Airline Ancillary*</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl><SelectTrigger><SelectValue placeholder="Select SKU from Catalogue..." /></SelectTrigger></FormControl>
//                         <SelectContent>
//                             {availableAncillaries.map(a => (
//                                 <SelectItem key={a.id} value={a.id}>{a.name} ({a.ancillaryCode || 'NO_CODE'})</SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                     <FormMessage />
//                 </FormItem>
//             )} />

//             <FormField control={form.control} name="configName" render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>Configuration Name*</FormLabel>
//                     <FormControl><Input placeholder="e.g., LHR-JFK Premium Baggage Logic" {...field} /></FormControl>
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
//                     <Settings2 className="h-3.5 w-3.5" /> 2. User-Managed Aggregate Parameters
//                 </div>
//                 <Button 
//                     type="button" 
//                     variant="outline" 
//                     size="sm" 
//                     onClick={() => append({ name: '', value: '' })}
//                     className="h-8 font-bold"
//                 >
//                     <PlusCircle className="h-3.5 w-3.5 mr-2" /> Add Parameter
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
//                                                 <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Parameter Name</FormLabel>
//                                                 <Select onValueChange={field.onChange} value={field.value}>
//                                                     <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
//                                                     <SelectContent>
//                                                         {MASTER_PARAMETER_POOL.map(p => (
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
//                                                 <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Configuration Value</FormLabel>
//                                                 {options ? (
//                                                     <Select onValueChange={field.onChange} value={field.value}>
//                                                         <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Select Value..." /></SelectTrigger></FormControl>
//                                                         <SelectContent>
//                                                             {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
//                                                         </SelectContent>
//                                                     </Select>
//                                                 ) : (
//                                                     <FormControl><Input placeholder="Set value..." className="h-9" {...field} /></FormControl>
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
//                     <Settings2 className="h-8 w-8 mb-2" />
//                     <p className="text-sm font-medium">No parameters defined. Click "Add Parameter" to begin.</p>
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
//           <Button type="submit" className="font-bold px-8">Save Aggregate Logic</Button>
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
import { Layers, Info, DollarSign, PlusCircle, Trash2, Settings2 } from 'lucide-react';
import { Stepper, type StepItem } from '../Stepper/Stepper';

const dropdownOptions: Record<string, string[]> = {
  'Aircraft type': ['A320neo', 'A350-900', 'A380-800', 'B737 MAX', 'B777-300ER', 'B787-9'],
  'Cabin class': ['Economy', 'Premium Economy', 'Business', 'First', 'All'],
  'Flight duration': ['Short haul', 'Long haul'],
  'Fare brand': ['Economy Light', 'Economy Flex', 'Business Saver', 'Business Flex'],
  'Passenger type': ['Adult', 'Child', 'Infant'],
  'Time to departure (DBD)': ['< 2hrs', '< 4hrs', '< 6 hrs', '< 8 hrs', '< 12 hrs', '< 24 hrs', '< 48 hrs'],
  'Channel': ['Web', 'Mobile', 'Kiosk', 'NDC', 'GDS', 'Agent'],
  'Loyalty tier': ['Platinum', 'Gold', 'Silver', 'Bronze', 'None'],
  'Route type': ['Domestic', 'International', 'Regional'],
  'Trip type': ['One-way', 'Round-trip', 'Multi-city'],
  'Geography': ['Domestic', 'International', 'Transatlantic', 'Transpacific'],
};

const MASTER_PARAMETER_POOL = [
  'Route', 
  'Fare brand', 
  'Cabin class', 
  'Booking class (RBD)', 
  'Passenger type', 
  'Loyalty tier', 
  'Load factor', 
  'Time to departure (DBD)', 
  'Booking window', 
  'Lead time',
  'Channel', 
  'Aircraft type', 
  'Flight duration', 
  'Geography', 
  'Trip type', 
  'Point of Sale (POS)', 
  'Passenger profile', 
  'SSR type', 
  'Meal inventory', 
  'Seat availability', 
  'Upgrade inventory', 
  'Baggage allowance', 
  'Device/Session rules',
  'Aircraft retrofit/connectivity availability',
  'Hold capacity',
  'Weight/piece rules',
  'Seat map / cabin layout',
  'Check-in status',
  'Premium cabin availability',
  'Aircraft galley capability',
  'Time of purchase',
  'Available onboard inventory',
  'Service level',
  'Booking status'
].sort();

const aggregateSchema = z.object({
  id: z.string().optional(),
  configName: z.string().min(5, 'Configuration name is required.'),
  ancillaryId: z.string().min(1, 'Please select an ancillary.'),
  basePrice: z.coerce.number().min(0, 'Base price must be a non-negative number.'),
  currency: z.string().length(3, 'Currency must be a 3-letter code.').toUpperCase().default('USD'),
  status: z.enum(['Draft', 'Active', 'Archived']).default('Draft'),
  parameters: z.array(z.object({
    name: z.string().min(1, 'Select a parameter'),
    value: z.string().min(1, 'Value is required')
  })).default([]),
});

export type AncillaryAggregate = z.infer<typeof aggregateSchema> & { ancillaryName?: string, category?: string };

interface AncillaryAggregateFormProps {
  aggregate: any | null;
  onSubmit: (data: AncillaryAggregate) => void;
  onCancel: () => void;
}

const mockAncillariesFallback = [
  { id: '1', name: 'Extra Legroom Seat', ancillaryCode: 'EXLG', category: 'Seat' },
  { id: '2', name: 'Premium Wi-Fi (Unlimited)', ancillaryCode: 'WIFU', category: 'Wi-Fi / connectivity' },
  { id: '3', name: 'Standby Upgrade (J Class)', ancillaryCode: 'UPGS', category: 'Upgrade' },
  { id: '4', name: '1st Checked Bag (23kg)', ancillaryCode: 'BAG1', category: 'Baggage' },
  { id: '5', name: 'Priority Boarding', ancillaryCode: 'PBDG', category: 'Priority service' },
  { id: '6', name: 'Executive Lounge Access', ancillaryCode: 'LOUA', category: 'Lounge' },
];

// ─── Steps Config ─────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  { id: 1, label: 'Configuration Target' },
  { id: 2, label: 'User-Managed Aggregate Parameters' },
];

export function AncillaryAggregateForm({ aggregate, onSubmit, onCancel }: AncillaryAggregateFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const firestore = useFirestore();
  const ancillariesQuery = React.useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
  const { data: ancillariesCollection } = useCollection(ancillariesQuery);

  const availableAncillaries = React.useMemo(() => {
    return (ancillariesCollection && ancillariesCollection.length > 0) 
      ? (ancillariesCollection as any[]) 
      : mockAncillariesFallback;
  }, [ancillariesCollection]);

  const initialParameters = React.useMemo(() => {
    if (!aggregate?.parameters) return [];
    if (Array.isArray(aggregate.parameters)) return aggregate.parameters;
    return Object.entries(aggregate.parameters).map(([name, value]) => ({ 
      name, 
      value: String(value) 
    }));
  }, [aggregate]);

  const form = useForm<AncillaryAggregate>({
    resolver: zodResolver(aggregateSchema),
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
  const stepFields: Record<number, (keyof AncillaryAggregate)[]> = {
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
      case 1: return "Select ancillary SKU and configure base pricing.";
      case 2: return "Define aggregate parameters for the logic set.";
      default: return "";
    }
  };

  const selectedAncillaryId = form.watch('ancillaryId');
  const selectedAncillary = availableAncillaries.find(a => a.id === selectedAncillaryId);

  React.useEffect(() => {
    if (selectedAncillary) {
        const currentName = form.getValues('configName');
        if (!currentName || currentName.includes('Logic Set') || currentName === '') {
            form.setValue('configName', `${selectedAncillary.name} Logic Set`, { shouldValidate: true });
        }
    }
  }, [selectedAncillaryId, selectedAncillary, form]);

  const handleFinalSubmit = (data: AncillaryAggregate) => {
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

          {/* Step 1 — Configuration Target */}
          {currentStep === 1 && (
            <>
              <FormField control={form.control} name="ancillaryId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Linked Airline Ancillary <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                        <SelectValue placeholder="Select SKU from Catalogue..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                      {availableAncillaries.map(a => (
                        <SelectItem key={a.id} value={a.id}>{a.name} ({a.ancillaryCode || 'NO_CODE'})</SelectItem>
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
                      placeholder="e.g., LHR-JFK Premium Baggage Logic" 
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

          {/* Step 2 — User-Managed Aggregate Parameters */}
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
                  <PlusCircle className="h-3.5 w-3.5 mr-2" /> Add Parameter
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
                                <FormLabel className="text-[10px] font-black uppercase text-slate-500">Parameter Name</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-9 rounded-lg border-2 border-slate-200 bg-white text-sm text-slate-800 focus:border-violet-400">
                                      <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                                    {MASTER_PARAMETER_POOL.map(p => (
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
                                <FormLabel className="text-[10px] font-black uppercase text-slate-500">Configuration Value</FormLabel>
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
                                      placeholder="Set value..." 
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
                  <Settings2 className="h-8 w-8 mb-2" />
                  <p className="text-sm font-medium">No parameters defined. Click "Add Parameter" to begin.</p>
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
                Save Aggregate Logic
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