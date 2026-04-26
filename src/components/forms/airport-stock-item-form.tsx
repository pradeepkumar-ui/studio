
// 'use client';

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
// import { Separator } from '../ui/separator';
// import { Store, ShieldCheck, Clock, Tag, RefreshCw, Zap } from 'lucide-react';
// import { Checkbox } from '../ui/checkbox';

// const airportStockItemSchema = z.object({
//   id: z.string().optional(),
//   sku: z.string().min(3, 'SKU must be at least 3 characters.').toUpperCase(),
//   airportCode: z.string().min(3, 'Airport Code is required.').toUpperCase(),
//   terminal: z.string().min(1, 'Terminal is required.'),
//   category: z.enum(['Lounge', 'Fast-track', 'Meet & Assist', 'Ground Transport']),
//   fulfillmentSource: z.enum(['Offersense', 'Supplier_API']).default('Offersense'),
//   protocol: z.enum(['Slot-based', 'Capacity-based', 'Resource-count']).default('Capacity-based'),
//   resourceType: z.enum(['Seat', 'Staff', 'Vehicle', 'Bay']).default('Seat'),
//   available: z.coerce.number().int().min(0, 'Available cannot be negative.'),
//   reserved: z.coerce.number().int().min(0, 'Reserved cannot be negative.'),
//   threshold: z.coerce.number().int().min(0, 'Threshold required.'),
//   isSlotActive: z.boolean().default(false),
//   realTimeSync: z.boolean().default(false),
// });

// export type AirportStockItem = z.infer<typeof airportStockItemSchema>;

// interface AirportStockItemFormProps {
//   item: AirportStockItem | null;
//   onSubmit: (data: AirportStockItem) => void;
//   onCancel: () => void;
// }

// export function AirportStockItemForm({ item, onSubmit, onCancel }: AirportStockItemFormProps) {
//   const form = useForm<AirportStockItem>({
//     resolver: zodResolver(airportStockItemSchema),
//     defaultValues: item || {
//       sku: '',
//       airportCode: '',
//       terminal: '',
//       category: 'Lounge',
//       fulfillmentSource: 'Offersense',
//       protocol: 'Capacity-based',
//       resourceType: 'Seat',
//       available: 0,
//       reserved: 0,
//       threshold: 5,
//       isSlotActive: false,
//       realTimeSync: false,
//     },
//   });

//   const watchFulfillmentSource = form.watch('fulfillmentSource');

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
//                 <Store className="h-3 w-3" /> Hub Identity & Sync
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="sku"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="flex items-center gap-1.5"><Tag className="h-3 w-3" /> Hub SKU*</FormLabel>
//                         <FormControl>
//                             <Input placeholder="e.g., LOU-LHR-T5-01" {...field} disabled={!!item} className="font-mono h-10" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="fulfillmentSource"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-amber-500" /> Fulfillment Control*</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                             <FormControl>
//                               <SelectTrigger className="h-10 font-bold"><SelectValue /></SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                                 <SelectItem value="Offersense">Local Hub Control (Offersense)</SelectItem>
//                                 <SelectItem value="Supplier_API">External Supplier API</SelectItem>
//                             </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                   )}
//                 />
//             </div>

//             {watchFulfillmentSource === 'Offersense' && (
//               <FormField
//                 control={form.control}
//                 name="realTimeSync"
//                 render={({ field }) => (
//                     <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-primary/5 border-primary/10">
//                         <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <div className="space-y-1 leading-none">
//                             <FormLabel className="flex items-center gap-1.5">
//                                 <RefreshCw className="h-3 w-3 text-primary animate-spin-slow" />
//                                 Enable Real-time Hub Sync
//                             </FormLabel>
//                             <FormDescription className="text-[10px]">
//                                 Automatically synchronize stock balances and reservations with external airport/vendor systems.
//                             </FormDescription>
//                         </div>
//                     </FormItem>
//                 )}
//               />
//             )}

//             <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="airportCode"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Airport Node*</FormLabel>
//                         <FormControl><Input placeholder="e.g., LHR" {...field} maxLength={3} /></FormControl>
//                         <FormMessage />
//                       </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="terminal"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Terminal*</FormLabel>
//                         <FormControl><Input placeholder="e.g., T5" {...field} /></FormControl>
//                         <FormMessage />
//                       </FormItem>
//                   )}
//                 />
//             </div>
//         </section>

//         <Separator />

//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
//                 <Clock className="h-3 w-3" /> Availability Protocol
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//                  <FormField
//                   control={form.control}
//                   name="category"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Service Category</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                             <FormControl><SelectTrigger className="h-10"><SelectValue /></SelectTrigger></FormControl>
//                             <SelectContent>
//                                 <SelectItem value="Lounge">Lounge Facilities</SelectItem>
//                                 <SelectItem value="Fast-track">Fast-track Channels</SelectItem>
//                                 <SelectItem value="Meet & Assist">Personal Services</SelectItem>
//                                 <SelectItem value="Ground Transport">Transfers & Buggy</SelectItem>
//                             </SelectContent>
//                         </Select>
//                       </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="protocol"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Operational Protocol</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                             <FormControl><SelectTrigger className="h-10"><SelectValue /></SelectTrigger></FormControl>
//                             <SelectContent>
//                                 <SelectItem value="Slot-based">Time-Slot Reservation</SelectItem>
//                                 <SelectItem value="Capacity-based">Bulk Capacity Limit</SelectItem>
//                                 <SelectItem value="Resource-count">Physical Resource Count</SelectItem>
//                             </SelectContent>
//                         </Select>
//                       </FormItem>
//                   )}
//                 />
//             </div>
//             <FormField
//               control={form.control}
//               name="isSlotActive"
//               render={({ field }) => (
//                   <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
//                       <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
//                       <div className="space-y-1 leading-none">
//                           <FormLabel>Enforce Temporal Windows</FormLabel>
//                           <FormDescription className="text-[10px]">Restricts availability to specific departure/arrival windows.</FormDescription>
//                       </div>
//                   </FormItem>
//               )}
//             />
//         </section>

//         <Separator />
        
//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
//                 <ShieldCheck className="h-3 w-3" /> Balance Control
//             </div>
//             <div className="grid grid-cols-3 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="available"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Net Capacity*</FormLabel>
//                         <FormControl>
//                             <Input type="number" {...field} className="font-bold text-emerald-600 h-10" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="reserved"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Holds (Soft)</FormLabel>
//                         <FormControl>
//                             <Input type="number" {...field} className="font-bold text-blue-600 h-10" />
//                         </FormControl>
//                       </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="threshold"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Alert Floor*</FormLabel>
//                         <FormControl>
//                             <Input type="number" {...field} className="font-bold text-destructive h-10" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                   )}
//                 />
//             </div>
//         </section>

//         <div className="flex justify-end gap-4 pt-6 border-t">
//             <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
//             <Button type="submit" className="font-bold px-8">
//                 Confirm Hub Balance
//             </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }



'use client';

import { useState } from 'react';
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
import { Separator } from '../ui/separator';
import { Store, ShieldCheck, Clock, Tag, RefreshCw, Zap } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Stepper, type StepItem } from '../Stepper/Stepper';

const airportStockItemSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(3, 'SKU must be at least 3 characters.').toUpperCase(),
  airportCode: z.string().min(3, 'Airport Code is required.').toUpperCase(),
  terminal: z.string().min(1, 'Terminal is required.'),
  category: z.enum(['Lounge', 'Fast-track', 'Meet & Assist', 'Ground Transport']),
  fulfillmentSource: z.enum(['Offersense', 'Supplier_API']).default('Offersense'),
  protocol: z.enum(['Slot-based', 'Capacity-based', 'Resource-count']).default('Capacity-based'),
  resourceType: z.enum(['Seat', 'Staff', 'Vehicle', 'Bay']).default('Seat'),
  available: z.coerce.number().int().min(0, 'Available cannot be negative.'),
  reserved: z.coerce.number().int().min(0, 'Reserved cannot be negative.'),
  threshold: z.coerce.number().int().min(0, 'Threshold required.'),
  isSlotActive: z.boolean().default(false),
  realTimeSync: z.boolean().default(false),
});

export type AirportStockItem = z.infer<typeof airportStockItemSchema>;

interface AirportStockItemFormProps {
  item: AirportStockItem | null;
  onSubmit: (data: AirportStockItem) => void;
  onCancel: () => void;
}

// ─── Steps Config ─────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  { id: 1, label: 'Hub Identity & Sync' },
  { id: 2, label: 'Availability Protocol' },
  { id: 3, label: 'Balance Control' },
];

export function AirportStockItemForm({ item, onSubmit, onCancel }: AirportStockItemFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<AirportStockItem>({
    resolver: zodResolver(airportStockItemSchema),
    defaultValues: item || {
      sku: '',
      airportCode: '',
      terminal: '',
      category: 'Lounge',
      fulfillmentSource: 'Offersense',
      protocol: 'Capacity-based',
      resourceType: 'Seat',
      available: 0,
      reserved: 0,
      threshold: 5,
      isSlotActive: false,
      realTimeSync: false,
    },
  });

  // ─── Step field map for validation ─────────────────────────────────────────
  const stepFields: Record<number, (keyof AirportStockItem)[]> = {
    1: ['sku', 'fulfillmentSource', 'airportCode', 'terminal'],
    2: ['category', 'protocol'],
    3: ['available', 'threshold'],
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const valid = await form.trigger(fields);
    if (!valid) return;
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const isLastStep = currentStep === 3;
  const isEditing = !!item;

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Define hub SKU, fulfillment source, and node location.";
      case 2: return "Configure service category, protocol, and time windows.";
      case 3: return "Set capacity limits, holds, and alert thresholds.";
      default: return "";
    }
  };

  const watchFulfillmentSource = form.watch('fulfillmentSource');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0">

        {/* ── Stepper ──────────────────────────────────────────────────── */}
        <div className="pb-4">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="space-y-5 max-h-[50vh] overflow-y-auto">

          {/* Step 1 — Hub Identity & Sync */}
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                        <Tag className="h-3 w-3" /> Hub SKU <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., LOU-LHR-T5-01" 
                          disabled={!!item} 
                          className="font-mono h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fulfillmentSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-amber-500" /> Fulfillment Control <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm font-bold text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                          <SelectItem value="Offersense">Local Hub Control (Offersense)</SelectItem>
                          <SelectItem value="Supplier_API">External Supplier API</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>

              {watchFulfillmentSource === 'Offersense' && (
                <FormField
                  control={form.control}
                  name="realTimeSync"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-slate-50/60 border-slate-200">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <RefreshCw className="h-3 w-3 text-violet-600 animate-spin" />
                          Enable Real-time Hub Sync
                        </FormLabel>
                        <FormDescription className="text-[10px] text-slate-400">
                          Automatically synchronize stock balances and reservations with external airport/vendor systems.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="airportCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Airport Node <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., LHR" 
                          maxLength={3} 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terminal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Terminal <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., T5" 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          {/* Step 2 — Availability Protocol */}
          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Service Category <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                          <SelectItem value="Lounge">Lounge Facilities</SelectItem>
                          <SelectItem value="Fast-track">Fast-track Channels</SelectItem>
                          <SelectItem value="Meet & Assist">Personal Services</SelectItem>
                          <SelectItem value="Ground Transport">Transfers & Buggy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="protocol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Operational Protocol <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                          <SelectItem value="Slot-based">Time-Slot Reservation</SelectItem>
                          <SelectItem value="Capacity-based">Bulk Capacity Limit</SelectItem>
                          <SelectItem value="Resource-count">Physical Resource Count</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="resourceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Resource Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                        <SelectItem value="Seat">Seats</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                        <SelectItem value="Vehicle">Vehicles</SelectItem>
                        <SelectItem value="Bay">Bays</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isSlotActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-slate-50/60 border-slate-200">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-xs font-semibold text-slate-700">Enforce Temporal Windows</FormLabel>
                      <FormDescription className="text-[10px] text-slate-400">
                        Restricts availability to specific departure/arrival windows.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Step 3 — Balance Control */}
          {currentStep === 3 && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Net Capacity <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="font-bold text-emerald-600 h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reserved"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Holds (Soft)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="font-bold text-blue-600 h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Alert Floor <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="font-bold text-rose-600 h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
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
                Confirm Hub Balance
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all duration-150 cursor-pointer"
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