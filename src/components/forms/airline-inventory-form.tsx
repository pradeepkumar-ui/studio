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
// import { useFirestore, useCollection } from '@/firebase';
// import { useMemo } from 'react';
// import { collection } from 'firebase/firestore';
// import { Plane, ShieldCheck, Zap, Globe, Laptop, RefreshCw } from 'lucide-react';
// import { Checkbox } from '@/components/ui/checkbox';

// const airlineInventorySchema = z.object({
//   id: z.string().optional(),
//   ancillaryId: z.string({ required_error: 'Select an ancillary SKU.' }),
//   ancillaryName: z.string().optional(),
//   pssCode: z.string().optional(),
//   flightNumber: z.string().min(1, 'Define flight scope (or "Global").').toUpperCase(),
//   aircraftType: z.string().default('All'),
//   totalCapacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
//   available: z.coerce.number().min(0),
//   reserved: z.coerce.number().min(0).default(0),
//   status: z.enum(['Open', 'Waitlist', 'Closed']),
//   fulfillmentSource: z.enum(['Offersense', 'PSS']).default('Offersense'),
//   realTimePssSync: z.boolean().default(false),
//   quotas: z.object({
//     Direct: z.coerce.number().min(0),
//     OTA: z.coerce.number().min(0),
//     GDS: z.coerce.number().min(0),
//   }),
// });

// export type AirlineInventory = z.infer<typeof airlineInventorySchema>;

// const mockAncillaries = [
//   { id: 'a1', name: 'Extra Legroom Seat', pssCode: 'EXLG' },
//   { id: 'a2', name: 'Gourmet Meal Pre-order', pssCode: 'MEAL' },
//   { id: 'a3', name: 'Premium Wi-Fi (Unlimited)', pssCode: 'WIFI' },
//   { id: 'a4', name: 'Preferred Zone Seat', pssCode: 'PFRD' },
//   { id: 'a5', name: 'Twin-Seat Blocking', pssCode: 'TSEAT' },
//   { id: 'a6', name: '1st Checked Bag (23kg)', pssCode: 'BAG1' },
//   { id: 'a7', name: 'Heavy Checked Bag (32kg)', pssCode: 'BAGH' },
//   { id: 'a8', name: 'Sports Equipment (Oversize)', pssCode: 'SPRT' },
//   { id: 'a9', name: 'Lounge Access Voucher', pssCode: 'LOUA' },
//   { id: 'a10', name: 'Standby Upgrade (J Class)', pssCode: 'UPGS' },
//   { id: 'a11', name: 'Pet in Cabin', pssCode: 'PETC' },
//   { id: 'a12', name: 'Unaccompanied Minor', pssCode: 'UMNR' },
//   { id: 'a13', name: 'Priority Boarding', pssCode: 'PBDG' },
// ];

// interface AirlineInventoryFormProps {
//   inventory: AirlineInventory | null;
//   onSubmit: (data: AirlineInventory) => void;
//   onCancel: () => void;
// }

// export function AirlineInventoryForm({ inventory, onSubmit, onCancel }: AirlineInventoryFormProps) {
//   const firestore = useFirestore();
//   const ancillariesQuery = useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
//   const { data: ancillariesData } = useCollection(ancillariesQuery);

//   const availableAncillaries = useMemo(() => {
//     return (ancillariesData && ancillariesData.length > 0) ? ancillariesData : mockAncillaries;
//   }, [ancillariesData]);

//   const form = useForm<AirlineInventory>({
//     resolver: zodResolver(airlineInventorySchema),
//     defaultValues: inventory || {
//       ancillaryId: '',
//       flightNumber: 'Global',
//       aircraftType: 'All',
//       totalCapacity: 10,
//       available: 10,
//       reserved: 0,
//       status: 'Open',
//       fulfillmentSource: 'Offersense',
//       realTimePssSync: false,
//       quotas: { Direct: 5, OTA: 3, GDS: 2 },
//     },
//   });

//   const watchFulfillmentSource = form.watch('fulfillmentSource');

//   const handleFinalSubmit = (data: AirlineInventory) => {
//       const selected = availableAncillaries.find(a => a.id === data.ancillaryId);
//       onSubmit({
//           ...data,
//           ancillaryName: selected?.name,
//           pssCode: selected?.pssCode,
//       });
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
        
//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
//                 <Plane className="h-3.5 w-3.5" /> Product & Fulfillment
//             </div>
//             <FormField
//                 control={form.control}
//                 name="ancillaryId"
//                 render={({ field }) => (
//                     <FormItem>
//                     <FormLabel>Ancillary SKU*</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl><SelectTrigger><SelectValue placeholder="Select Product..." /></SelectTrigger></FormControl>
//                         <SelectContent>
//                             {availableAncillaries.map(a => (
//                                 <SelectItem key={a.id} value={a.id!}>{a.name} ({a.pssCode})</SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                     <FormMessage />
//                     </FormItem>
//                 )}
//             />
//             <div className="grid grid-cols-2 gap-4">
//                  <FormField
//                     control={form.control}
//                     name="fulfillmentSource"
//                     render={({ field }) => (
//                         <FormItem>
//                         <FormLabel>Fulfillment Source*</FormLabel>
//                         <Select onValueChange={field.onChange} value={field.value}>
//                             <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                             <SelectContent>
//                                 <SelectItem value="Offersense">Local (Offersense)</SelectItem>
//                                 <SelectItem value="PSS">Host System (PSS)</SelectItem>
//                             </SelectContent>
//                         </Select>
//                         </FormItem>
//                     )}
//                 />
//                 {watchFulfillmentSource === 'Offersense' && (
//                     <FormField
//                         control={form.control}
//                         name="realTimePssSync"
//                         render={({ field }) => (
//                             <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-primary/5">
//                                 <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
//                                 <div className="space-y-1 leading-none">
//                                     <FormLabel className="text-xs font-bold flex items-center gap-1.5"><RefreshCw className="h-3 w-3" /> Real-time PSS Sync</FormLabel>
//                                 </div>
//                             </FormItem>
//                         )}
//                     />
//                 )}
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                     control={form.control}
//                     name="flightNumber"
//                     render={({ field }) => (
//                         <FormItem>
//                         <FormLabel>Flight Scope*</FormLabel>
//                         <FormControl><Input placeholder="e.g., AC101 or Global" {...field} /></FormControl>
//                         <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="aircraftType"
//                     render={({ field }) => (
//                         <FormItem>
//                         <FormLabel>Fleet Filter</FormLabel>
//                         <FormControl><Input placeholder="e.g., A350-900" {...field} /></FormControl>
//                         <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//             </div>
//         </section>

//         <Separator />

//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
//                 <ShieldCheck className="h-3.5 w-3.5" /> Capacity & Reservation
//             </div>
//             <div className="grid grid-cols-3 gap-4">
//                 <FormField
//                     control={form.control}
//                     name="totalCapacity"
//                     render={({ field }) => (
//                         <FormItem>
//                         <FormLabel>Total Seats/Units*</FormLabel>
//                         <FormControl><Input type="number" {...field} /></FormControl>
//                         <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="available"
//                     render={({ field }) => (
//                         <FormItem>
//                         <FormLabel>Currently Sellable*</FormLabel>
//                         <FormControl><Input type="number" {...field} className="text-emerald-600 font-bold" /></FormControl>
//                         <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="reserved"
//                     render={({ field }) => (
//                         <FormItem>
//                         <FormLabel>Active Holds</FormLabel>
//                         <FormControl><Input type="number" {...field} className="text-blue-600 font-bold" /></FormControl>
//                         </FormItem>
//                     )}
//                 />
//             </div>
//              <FormField
//                 control={form.control}
//                 name="status"
//                 render={({ field }) => (
//                     <FormItem>
//                     <FormLabel>Inventory State</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                         <SelectContent>
//                             <SelectItem value="Open">Open (Selling)</SelectItem>
//                             <SelectItem value="Waitlist">Waitlist Only</SelectItem>
//                             <SelectItem value="Closed">Closed (Stop-Sell)</SelectItem>
//                         </SelectContent>
//                     </Select>
//                     </FormItem>
//                 )}
//             />
//         </section>

//         <Separator />

//         <section className="space-y-4">
//             <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
//                 <Globe className="h-3.5 w-3.5" /> Multi-Channel Quotas
//             </div>
//             <div className="grid grid-cols-3 gap-4">
//                  <FormField
//                     control={form.control}
//                     name="quotas.Direct"
//                     render={({ field }) => (
//                         <FormItem>
//                         <FormLabel className="flex items-center gap-1"><Laptop className="h-3 w-3" /> Direct</FormLabel>
//                         <FormControl><Input type="number" {...field} /></FormControl>
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="quotas.OTA"
//                     render={({ field }) => (
//                         <FormItem>
//                         <FormLabel>OTA</FormLabel>
//                         <FormControl><Input type="number" {...field} /></FormControl>
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="quotas.GDS"
//                     render={({ field }) => (
//                         <FormItem>
//                         <FormLabel>GDS</FormLabel>
//                         <FormControl><Input type="number" {...field} /></FormControl>
//                         </FormItem>
//                     )}
//                 />
//             </div>
//         </section>

//         <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background py-4">
//           <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
//           <Button type="submit">Commit Inventory Adjustments</Button>
//         </div>
//       </form>
//     </Form>
//   );
// }



'use client';

import { useState, useMemo } from 'react';
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
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Plane, ShieldCheck, Zap, Globe, Laptop, RefreshCw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Stepper, type StepItem } from '../Stepper/Stepper';

const airlineInventorySchema = z.object({
  id: z.string().optional(),
  ancillaryId: z.string({ required_error: 'Select an ancillary SKU.' }),
  ancillaryName: z.string().optional(),
  pssCode: z.string().optional(),
  flightNumber: z.string().min(1, 'Define flight scope (or "Global").').toUpperCase(),
  aircraftType: z.string().default('All'),
  totalCapacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
  available: z.coerce.number().min(0),
  reserved: z.coerce.number().min(0).default(0),
  status: z.enum(['Open', 'Waitlist', 'Closed']),
  fulfillmentSource: z.enum(['Offersense', 'PSS']).default('Offersense'),
  realTimePssSync: z.boolean().default(false),
  quotas: z.object({
    Direct: z.coerce.number().min(0),
    OTA: z.coerce.number().min(0),
    GDS: z.coerce.number().min(0),
  }),
});

export type AirlineInventory = z.infer<typeof airlineInventorySchema>;

const mockAncillaries = [
  // { id: 'a1', name: 'Extra Legroom Seat', pssCode: 'EXLG' },
  // { id: 'a2', name: 'Gourmet Meal Pre-order', pssCode: 'MEAL' },
  // { id: 'a3', name: 'Premium Wi-Fi (Unlimited)', pssCode: 'WIFI' },
  // { id: 'a4', name: 'Preferred Zone Seat', pssCode: 'PFRD' },
  // { id: 'a5', name: 'Twin-Seat Blocking', pssCode: 'TSEAT' },
  // { id: 'a6', name: '1st Checked Bag (23kg)', pssCode: 'BAG1' },
  // { id: 'a7', name: 'Heavy Checked Bag (32kg)', pssCode: 'BAGH' },
  // { id: 'a8', name: 'Sports Equipment (Oversize)', pssCode: 'SPRT' },
  // { id: 'a9', name: 'Lounge Access Voucher', pssCode: 'LOUA' },
  // { id: 'a10', name: 'Standby Upgrade (J Class)', pssCode: 'UPGS' },
  // { id: 'a11', name: 'Pet in Cabin', pssCode: 'PETC' },
  // { id: 'a12', name: 'Unaccompanied Minor', pssCode: 'UMNR' },
  // { id: 'a13', name: 'Priority Boarding', pssCode: 'PBDG' },

    { id: 'a1', name: 'Extra Legroom', pssCode: 'EXLG' },
    { id: 'a2', name: 'Seat', pssCode: 'PFRD' },
    { id: 'a3', name: 'Premium Wi-Fi (Unlimited)', pssCode: 'WIFI' },
    { id: 'a4', name: 'Priority Baggage', pssCode: 'PBDG' },


];

interface AirlineInventoryFormProps {
  inventory: AirlineInventory | null;
  onSubmit: (data: AirlineInventory) => void;
  onCancel: () => void;
}

// ─── Steps Config ─────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  { id: 1, label: 'Product & Fulfillment' },
  { id: 2, label: 'Capacity & Reservation' },
  { id: 3, label: 'Multi-Channel Quotas' },
];

export function AirlineInventoryForm({ inventory, onSubmit, onCancel }: AirlineInventoryFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const firestore = useFirestore();
  const ancillariesQuery = useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
  const { data: ancillariesData } = useCollection(ancillariesQuery);

  const availableAncillaries = useMemo(() => {
    return (ancillariesData && ancillariesData.length > 0) ? ancillariesData : mockAncillaries;
  }, [ancillariesData]);

  const form = useForm<AirlineInventory>({
    resolver: zodResolver(airlineInventorySchema),
    defaultValues: inventory || {
      ancillaryId: '',
      flightNumber: 'Global',
      aircraftType: 'All',
      totalCapacity: 10,
      available: 10,
      reserved: 0,
      status: 'Open',
      fulfillmentSource: 'Offersense',
      realTimePssSync: false,
      quotas: { Direct: 5, OTA: 3, GDS: 2 },
    },
  });

  // ─── Step field map for validation ─────────────────────────────────────────
  const stepFields: Record<number, (keyof AirlineInventory)[]> = {
    1: ['ancillaryId', 'fulfillmentSource', 'flightNumber'],
    2: ['totalCapacity', 'available', 'status'],
    3: ['quotas.Direct', 'quotas.OTA', 'quotas.GDS'],
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const valid = await form.trigger(fields);
    if (!valid) return;
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const isLastStep = currentStep === 3;
  const isEditing = !!inventory;

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Select ancillary SKU and configure fulfillment source.";
      case 2: return "Define capacity limits and inventory state.";
      case 3: return "Set channel-specific quotas for distribution.";
      default: return "";
    }
  };

  const watchFulfillmentSource = form.watch('fulfillmentSource');

  const handleFinalSubmit = (data: AirlineInventory) => {
      const selected = availableAncillaries.find((a: any) => a.id === data.ancillaryId);
      onSubmit({
          ...data,
          ancillaryName: selected?.name,
          pssCode: selected?.pssCode,
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

          {/* Step 1 — Product & Fulfillment */}
          {currentStep === 1 && (
            <>
              <FormField
                control={form.control}
                name="ancillaryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Ancillary SKU <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                          <SelectValue placeholder="Select Product..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                        {availableAncillaries.map((a: any) => (
                          <SelectItem key={a.id} value={a.id!}>{a.name} ({a.pssCode})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fulfillmentSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Fulfillment Source <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                          <SelectItem value="Offersense">Local (Offersense)</SelectItem>
                          <SelectItem value="PSS">Host System (PSS)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {watchFulfillmentSource === 'Offersense' && (
                  <FormField
                    control={form.control}
                    name="realTimePssSync"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-slate-50/60 mt-7">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-xs font-bold flex items-center gap-1.5 text-slate-700">
                            <RefreshCw className="h-3 w-3" /> Real-time PSS Sync
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="flightNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Flight Scope <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., AC101 or Global" 
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
                  name="aircraftType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Fleet Filter
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., A350-900" 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          {/* Step 2 — Capacity & Reservation */}
          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="totalCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Total Seats/Units <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Currently Sellable <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-emerald-600 font-bold focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
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
                        Active Holds
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-blue-600 font-bold focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Inventory State <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                              <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                        <SelectItem value="Open">Open (Selling)</SelectItem>
                        <SelectItem value="Waitlist">Waitlist Only</SelectItem>
                        <SelectItem value="Closed">Closed (Stop-Sell)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Step 3 — Multi-Channel Quotas */}
          {currentStep === 3 && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="quotas.Direct"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                        <Laptop className="h-3 w-3" /> Direct <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quotas.OTA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        OTA <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quotas.GDS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        GDS <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>
              <FormDescription className="text-xs text-slate-400">
                Set channel-specific inventory quotas for distribution.
              </FormDescription>
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
                Commit Inventory Adjustments
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