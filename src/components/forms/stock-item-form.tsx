
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
// import { Package, ShieldCheck, Truck, Tag, Store, Info, Zap, RefreshCw } from 'lucide-react';
// import { Checkbox } from '../ui/checkbox';

// const stockItemSchema = z.object({
//   id: z.string().optional(),
//   sku: z.string().min(3, 'SKU must be at least 3 characters.').toUpperCase(),
//   category: z.string().min(3, 'Category is required.'),
//   supplier: z.string().min(3, 'Supplier/Vendor is required.'),
//   available: z.coerce.number().int().min(0, 'Available stock cannot be negative.'),
//   reserved: z.coerce.number().int().min(0, 'Reserved stock cannot be negative.'),
//   threshold: z.coerce.number().int().min(0, 'Low-stock threshold required.'),
//   status: z.enum(['In Stock', 'Low Stock', 'Out of Stock']).optional(),
//   fulfillmentSource: z.enum(['Offersense', 'PSS']).default('Offersense'),
//   type: z.enum(['Physical', 'Digital', 'Service_Capacity']).default('Digital'),
//   realTimePssSync: z.boolean().default(false),
// });

// export type StockItem = z.infer<typeof stockItemSchema>;

// interface StockItemFormProps {
//   item: StockItem | null;
//   onSubmit: (data: StockItem) => void;
//   onCancel: () => void;
// }

// export function StockItemForm({ item, onSubmit, onCancel }: StockItemFormProps) {
//   const form = useForm<StockItem>({
//     resolver: zodResolver(stockItemSchema),
//     defaultValues: item || {
//       sku: '',
//       category: '',
//       supplier: '',
//       available: 0,
//       reserved: 0,
//       threshold: 10,
//       fulfillmentSource: 'Offersense',
//       type: 'Digital',
//       realTimePssSync: false,
//     },
//   });

//   const watchFulfillmentSource = form.watch('fulfillmentSource');

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         {/* --- IDENTITY & SOURCE --- */}
//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
//                 <Package className="h-3 w-3" /> Identity & Fulfillment Source
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="sku"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="flex items-center gap-1.5"><Tag className="h-3 w-3" /> Inventory SKU*</FormLabel>
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
//                         <FormLabel className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-amber-500" /> Primary Source*</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                             <FormControl>
//                               <SelectTrigger className="h-10 font-bold"><SelectValue /></SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                                 <SelectItem value="Offersense">Local Registry (Offersense)</SelectItem>
//                                 <SelectItem value="PSS">External Host (PSS API)</SelectItem>
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
//                 name="realTimePssSync"
//                 render={({ field }) => (
//                     <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-primary/5 border-primary/10">
//                         <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <div className="space-y-1 leading-none">
//                             <FormLabel className="flex items-center gap-1.5">
//                                 <RefreshCw className="h-3 w-3 text-primary animate-spin-slow" />
//                                 Enable Real-time PSS Sync
//                             </FormLabel>
//                             <FormDescription className="text-[10px]">
//                                 Automatically push inventory updates and reservations back to the carrier PSS host.
//                             </FormDescription>
//                         </div>
//                     </FormItem>
//                 )}
//               />
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="category"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Logistics Category*</FormLabel>
//                         <FormControl>
//                             <Input placeholder="e.g., Lounge, Catering, Seats" {...field} className="h-10" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="supplier"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Primary Vendor*</FormLabel>
//                         <FormControl>
//                             <Input placeholder="e.g., SkyCaterers or Global Lounges" {...field} className="h-10" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                   )}
//                 />
//             </div>
//         </section>

//         <Separator />
        
//         {/* --- BALANCE CONTROL --- */}
//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
//                 <ShieldCheck className="h-3 w-3" /> Balance Control & Thresholds
//             </div>
//             <div className="grid grid-cols-3 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="available"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>In-Stock (Net)*</FormLabel>
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
//                         <FormDescription className="text-[9px] uppercase font-black tracking-tighter">Active in carts.</FormDescription>
//                       </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="threshold"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Alert Threshold*</FormLabel>
//                         <FormControl>
//                             <Input type="number" {...field} className="font-bold text-destructive h-10" />
//                         </FormControl>
//                         <FormDescription className="text-[9px] uppercase font-black tracking-tighter">Safety stock.</FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                   )}
//                 />
//             </div>
//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Fulfillment Protocol</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                             <SelectItem value="Physical">Physical Hand-over</SelectItem>
//                             <SelectItem value="Digital">Digital Unlock (Voucher)</SelectItem>
//                             <SelectItem value="Service_Capacity">Service Limit (Lounge/Seat)</SelectItem>
//                         </SelectContent>
//                     </Select>
//                   </FormItem>
//               )}
//             />
//         </section>

//         <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
//             <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
//             <Button type="submit" className="font-bold px-8">
//                 <Truck className="mr-2 h-4 w-4" />
//                 {item ? 'Save Adjustments' : 'Commit Registry Entry'}
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
import { Package, ShieldCheck, Truck, Tag, Store, Info, Zap, RefreshCw } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Stepper, type StepItem } from '../Stepper/Stepper';

const stockItemSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(3, 'SKU must be at least 3 characters.').toUpperCase(),
  category: z.string().min(3, 'Category is required.'),
  supplier: z.string().min(3, 'Supplier/Vendor is required.'),
  available: z.coerce.number().int().min(0, 'Available stock cannot be negative.'),
  reserved: z.coerce.number().int().min(0, 'Reserved stock cannot be negative.'),
  threshold: z.coerce.number().int().min(0, 'Low-stock threshold required.'),
  status: z.enum(['In Stock', 'Low Stock', 'Out of Stock']).optional(),
  fulfillmentSource: z.enum(['Offersense', 'PSS']).default('Offersense'),
  type: z.enum(['Physical', 'Digital', 'Service_Capacity']).default('Digital'),
  realTimePssSync: z.boolean().default(false),
});

export type StockItem = z.infer<typeof stockItemSchema>;

interface StockItemFormProps {
  item: StockItem | null;
  onSubmit: (data: StockItem) => void;
  onCancel: () => void;
}

// ─── Steps Config ─────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  { id: 1, label: 'Identity & Fulfillment Source' },
  { id: 2, label: 'Balance Control & Thresholds' },
];

export function StockItemForm({ item, onSubmit, onCancel }: StockItemFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<StockItem>({
    resolver: zodResolver(stockItemSchema),
    defaultValues: item || {
      sku: '',
      category: '',
      supplier: '',
      available: 0,
      reserved: 0,
      threshold: 10,
      fulfillmentSource: 'Offersense',
      type: 'Digital',
      realTimePssSync: false,
    },
  });

  // ─── Step field map for validation ─────────────────────────────────────────
  const stepFields: Record<number, (keyof StockItem)[]> = {
    1: ['sku', 'fulfillmentSource', 'category', 'supplier'],
    2: ['available', 'reserved', 'threshold'],
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const valid = await form.trigger(fields);
    if (!valid) return;
    setCurrentStep((s) => Math.min(s + 1, 2));
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const isLastStep = currentStep === 2;
  const isEditing = !!item;

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Define SKU identity, fulfillment source, and vendor details.";
      case 2: return "Configure stock levels, thresholds, and fulfillment protocol.";
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

          {/* Step 1 — Identity & Fulfillment Source */}
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                        <Tag className="h-3 w-3" /> Inventory SKU <span className="text-rose-500">*</span>
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
                        <Zap className="h-3 w-3 text-amber-500" /> Primary Source <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm font-bold text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                          <SelectItem value="Offersense">Local Registry (Offersense)</SelectItem>
                          <SelectItem value="PSS">External Host (PSS API)</SelectItem>
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
                  name="realTimePssSync"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-slate-50/60 border-slate-200">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <RefreshCw className="h-3 w-3 text-violet-600 animate-spin" />
                          Enable Real-time PSS Sync
                        </FormLabel>
                        <FormDescription className="text-[10px] text-slate-400">
                          Automatically push inventory updates and reservations back to the carrier PSS host.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Logistics Category <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Lounge, Catering, Seats" 
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
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Primary Vendor <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., SkyCaterers or Global Lounges" 
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

          {/* Step 2 — Balance Control & Thresholds */}
          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        In-Stock (Net) <span className="text-rose-500">*</span>
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
                      <FormDescription className="text-[9px] uppercase font-black tracking-tighter text-slate-400">
                        Active in carts.
                      </FormDescription>
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
                        Alert Threshold <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="font-bold text-rose-600 h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-[9px] uppercase font-black tracking-tighter text-slate-400">
                        Safety stock.
                      </FormDescription>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Fulfillment Protocol
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                        <SelectItem value="Physical">Physical Hand-over</SelectItem>
                        <SelectItem value="Digital">Digital Unlock (Voucher)</SelectItem>
                        <SelectItem value="Service_Capacity">Service Limit (Lounge/Seat)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="h-px bg-slate-100 mx-7" />

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="pt-7 bg-slate-50/50 flex items-center justify-between gap-3">
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
                <Truck className="mr-2 h-4 w-4" />
                {item ? 'Save Adjustments' : 'Commit Registry Entry'}
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