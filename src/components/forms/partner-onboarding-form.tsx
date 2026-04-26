
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

// const partnerOnboardingSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(3, 'Partner name is required.'),
//   airportCode: z.string({ required_error: 'Primary airport node is required.' }),
//   terminal: z.string().min(2, 'Specific terminal/gate is required.'),
//   category: z.enum(['F&B', 'Retail', 'Services', 'Transport']),
//   status: z.enum(['Active', 'Inactive']),
//   contactEmail: z.string().email('Valid contact email is required.'),
//   commissionRate: z.coerce.number().min(0).max(100, 'Invalid commission rate.'),
// });

// export type PartnerOnboarding = z.infer<typeof partnerOnboardingSchema>;

// const mockAirports = [
//   { id: 'LHR', name: 'London Heathrow (LHR)' },
//   { id: 'JFK', name: 'John F. Kennedy (JFK)' },
//   { id: 'SIN', name: 'Singapore Changi (SIN)' },
//   { id: 'DXB', label: 'Dubai International (DXB)' },
// ];

// interface PartnerOnboardingFormProps {
//   partner: PartnerOnboarding | null;
//   onSubmit: (data: PartnerOnboarding) => void;
//   onCancel: () => void;
// }

// export function PartnerOnboardingForm({ partner, onSubmit, onCancel }: PartnerOnboardingFormProps) {
//   const form = useForm<PartnerOnboarding>({
//     resolver: zodResolver(partnerOnboardingSchema),
//     defaultValues: partner || {
//       name: '',
//       airportCode: '',
//       terminal: '',
//       category: 'Retail',
//       status: 'Active',
//       contactEmail: '',
//       commissionRate: 15,
//     },
//   });

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-4">
//         <section className="space-y-4">
//           <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Vendor Identity</h4>
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Brand / Vendor Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="e.g., SkyCafe Gourmet" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="category"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Service Category</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select category" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="F&B">Food & Beverage</SelectItem>
//                       <SelectItem value="Retail">Retail / Duty-Free</SelectItem>
//                       <SelectItem value="Services">Airport Services</SelectItem>
//                       <SelectItem value="Transport">Ground Transport</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="commissionRate"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Offersense Commission (%)</FormLabel>
//                   <FormControl>
//                     <Input type="number" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </section>

//         <Separator />

//         <section className="space-y-4">
//           <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Placement & Deployment</h4>
//           <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="airportCode"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Authorized Airport Node</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select airport..." />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {mockAirports.map(apt => (
//                         <SelectItem key={apt.id} value={apt.id}>{apt.id}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormDescription>Only registered nodes are selectable.</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="terminal"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Terminal / Gate Location</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., T5 B-Gates" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </section>

//         <Separator />

//         <section className="space-y-4">
//           <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Communication & Status</h4>
//           <FormField
//             control={form.control}
//             name="contactEmail"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Fulfillment Contact (API/Email)</FormLabel>
//                 <FormControl>
//                   <Input placeholder="fulfillment@vendor.com" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Operational Status</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="Active">Authorized / Selling</SelectItem>
//                     <SelectItem value="Inactive">Paused</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </section>

//         <div className="flex justify-end gap-2 pt-4">
//           <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
//           <Button type="submit">{partner ? 'Save Changes' : 'Onboard Partner'}</Button>
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
import { Stepper, type StepItem } from '../Stepper/Stepper';

const partnerOnboardingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Partner name is required.'),
  airportCode: z.string({ required_error: 'Primary airport node is required.' }),
  terminal: z.string().min(2, 'Specific terminal/gate is required.'),
  category: z.enum(['F&B', 'Retail', 'Services', 'Transport']),
  status: z.enum(['Active', 'Inactive']),
  contactEmail: z.string().email('Valid contact email is required.'),
  commissionRate: z.coerce.number().min(0).max(100, 'Invalid commission rate.'),
});

export type PartnerOnboarding = z.infer<typeof partnerOnboardingSchema>;

const mockAirports = [
  { id: 'LHR', name: 'London Heathrow (LHR)' },
  { id: 'JFK', name: 'John F. Kennedy (JFK)' },
  { id: 'SIN', name: 'Singapore Changi (SIN)' },
  { id: 'DXB', label: 'Dubai International (DXB)' },
];

// ─── Steps Config ─────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  { id: 1, label: 'Vendor Identity' },
  { id: 2, label: 'Placement & Deployment' },
  { id: 3, label: 'Communication & Status' },
];

interface PartnerOnboardingFormProps {
  partner: PartnerOnboarding | null;
  onSubmit: (data: PartnerOnboarding) => void;
  onCancel: () => void;
}

export function PartnerOnboardingForm({ partner, onSubmit, onCancel }: PartnerOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<PartnerOnboarding>({
    resolver: zodResolver(partnerOnboardingSchema),
    defaultValues: partner || {
      name: '',
      airportCode: '',
      terminal: '',
      category: 'Retail',
      status: 'Active',
      contactEmail: '',
      commissionRate: 15,
    },
  });

  // ─── Step field map for validation ─────────────────────────────────────────
  const stepFields: Record<number, (keyof PartnerOnboarding)[]> = {
    1: ['name', 'category', 'commissionRate'],
    2: ['airportCode', 'terminal'],
    3: ['contactEmail', 'status'],
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const valid = await form.trigger(fields);
    if (!valid) return;
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const isLastStep = currentStep === 3;
  const isEditing = !!partner;

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Establish vendor identity and commercial terms.";
      case 2: return "Define authorized airport node and terminal placement.";
      case 3: return "Configure communication and operational status.";
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

          {/* Step 1 — Vendor Identity */}
          {currentStep === 1 && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Brand / Vendor Name <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., SkyCafe Gourmet"
                        className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />

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
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                          <SelectItem value="F&B">Food & Beverage</SelectItem>
                          <SelectItem value="Retail">Retail / Duty-Free</SelectItem>
                          <SelectItem value="Services">Airport Services</SelectItem>
                          <SelectItem value="Transport">Ground Transport</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commissionRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Offersense Commission (%) <span className="text-rose-500">*</span>
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
                  )}
                />
              </div>
            </>
          )}

          {/* Step 2 — Placement & Deployment */}
          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="airportCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Authorized Airport Node <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                            <SelectValue placeholder="Select airport..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                          {mockAirports.map(apt => (
                            <SelectItem key={apt.id} value={apt.id}>{apt.name || apt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs text-slate-400">
                        Only registered nodes are selectable.
                      </FormDescription>
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
                        Terminal / Gate Location <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., T5 B-Gates"
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

          {/* Step 3 — Communication & Status */}
          {currentStep === 3 && (
            <>
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Fulfillment Contact (API/Email) <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="fulfillment@vendor.com"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Operational Status <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                        <SelectItem value="Active">Authorized / Selling</SelectItem>
                        <SelectItem value="Inactive">Paused</SelectItem>
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
        <div className="px-7 py-4 bg-slate-50/50 flex items-center justify-between gap-3">
          {/* Cancel / Save & Exit */}
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-semibold text-slate-500 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:text-slate-700 transition-all duration-150 cursor-pointer"
          >
            Save &amp; Exit
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
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-[hsl(var(--primary))] hover:bg-violet-700 active:bg-violet-800 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all duration-150 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isEditing ? 'Confirm & Update' : 'Confirm & Onboard'}
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