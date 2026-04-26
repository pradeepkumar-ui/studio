
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
// import { Checkbox } from '@/components/ui/checkbox';
// import { Separator } from '../ui/separator';

// const airportOnboardingSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(5, 'Airport name is required.'),
//   iataCode: z.string().length(3, 'IATA code must be exactly 3 characters.').toUpperCase(),
//   location: z.string().min(3, 'Location (City) is required.'),
//   sitaEnabled: z.boolean().default(true),
//   hardwarePrefix: z.string().min(2, 'SITA Hardware prefix is required for CUSS sync.'),
//   status: z.enum(['Active', 'Onboarding', 'Inactive']),
//   terminals: z.string().describe('Comma separated list of terminals'),
//   timeZone: z.string().min(3, 'Timezone is required.'),
//   technicalContact: z.string().email('Valid contact email is required.'),
// });

// export type AirportOnboarding = z.infer<typeof airportOnboardingSchema>;

// interface AirportOnboardingFormProps {
//   airport: AirportOnboarding | null;
//   onSubmit: (data: AirportOnboarding) => void;
//   onCancel: () => void;
// }

// export function AirportOnboardingForm({ airport, onSubmit, onCancel }: AirportOnboardingFormProps) {
//   const form = useForm<AirportOnboarding>({
//     resolver: zodResolver(airportOnboardingSchema),
//     defaultValues: airport || {
//       name: '',
//       iataCode: '',
//       location: '',
//       sitaEnabled: true,
//       hardwarePrefix: 'K-',
//       status: 'Onboarding',
//       terminals: 'T1, T2',
//       timeZone: 'UTC',
//       technicalContact: '',
//     },
//   });

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-4">
//         <section className="space-y-4">
//           <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Identity & Location</h4>
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Airport Full Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="e.g., London Heathrow Airport" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="iataCode"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>IATA Code</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., LHR" maxLength={3} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="location"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>City / Location</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., London" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="timeZone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Local Timezone</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., GMT+1" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="technicalContact"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Technical Contact</FormLabel>
//                   <FormControl>
//                     <Input placeholder="it.ops@airport.com" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </section>

//         <Separator />

//         <section className="space-y-4">
//           <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Infrastructure & SITA</h4>
//           <FormField
//             control={form.control}
//             name="terminals"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Active Terminals</FormLabel>
//                 <FormControl>
//                   <Input placeholder="e.g., T1, T2, T5" {...field} />
//                 </FormControl>
//                 <FormDescription>Define the terminals where retailing is permitted.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="hardwarePrefix"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>CUSS Hardware Prefix</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., K-LHR-" {...field} />
//                   </FormControl>
//                   <FormDescription>Identifier for SITA device mapping.</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//              <FormField
//               control={form.control}
//               name="status"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Network Status</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Onboarding">Onboarding / Sandbox</SelectItem>
//                       <SelectItem value="Active">Active / Production</SelectItem>
//                       <SelectItem value="Inactive">Deactivated</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <FormField
//             control={form.control}
//             name="sitaEnabled"
//             render={({ field }) => (
//               <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
//                 <FormControl>
//                   <Checkbox
//                     checked={field.value}
//                     onCheckedChange={field.onChange}
//                   />
//                 </FormControl>
//                 <div className="space-y-1 leading-none">
//                   <FormLabel>Enable Real-Time Hardware Sync</FormLabel>
//                   <FormDescription>
//                     Permit the PSS broker to push offers directly to CUSS kiosks.
//                   </FormDescription>
//                 </div>
//               </FormItem>
//             )}
//           />
//         </section>

//         <div className="flex justify-end gap-2 pt-4">
//           <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
//           <Button type="submit">{airport ? 'Update Node' : 'Register Airport Node'}</Button>
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '../ui/separator';
import { Stepper, type StepItem } from '../Stepper/Stepper';

// ─── Steps Config ─────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  { id: 1, label: "Identity & Location" },
  { id: 2, label: "Infrastructure & SITA" },
];

const airportOnboardingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Airport name is required.'),
  iataCode: z.string().length(3, 'IATA code must be exactly 3 characters.').toUpperCase(),
  location: z.string().min(3, 'Location (City) is required.'),
  sitaEnabled: z.boolean().default(true),
  hardwarePrefix: z.string().min(2, 'SITA Hardware prefix is required for CUSS sync.'),
  status: z.enum(['Active', 'Onboarding', 'Inactive']),
  terminals: z.string().describe('Comma separated list of terminals'),
  timeZone: z.string().min(3, 'Timezone is required.'),
  technicalContact: z.string().email('Valid contact email is required.'),
});

export type AirportOnboarding = z.infer<typeof airportOnboardingSchema>;

interface AirportOnboardingFormProps {
  airport: AirportOnboarding | null;
  onSubmit: (data: AirportOnboarding) => void;
  onCancel: () => void;
}

export function AirportOnboardingForm({ airport, onSubmit, onCancel }: AirportOnboardingFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1);

  const form = useForm<AirportOnboarding>({
    resolver: zodResolver(airportOnboardingSchema),
    defaultValues: airport || {
      name: '',
      iataCode: '',
      location: '',
      sitaEnabled: true,
      hardwarePrefix: 'K-',
      status: 'Onboarding',
      terminals: 'T1, T2',
      timeZone: 'UTC',
      technicalContact: '',
    },
  });

  // ─── Step field map for validation ─────────────────────────────────────────
  const stepFields: Record<number, (keyof AirportOnboarding)[]> = {
    1: ['name', 'iataCode', 'location', 'timeZone', 'technicalContact'],
    2: ['terminals', 'hardwarePrefix', 'status', 'sitaEnabled'],
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const valid = await form.trigger(fields);
    if (!valid) return;
    setCurrentStep((s) => Math.min(s + 1, 2));
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const isLastStep = currentStep === 2;
  const isEditing = !!airport;

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Establish airport identity and location details.";
      case 2: return "Configure infrastructure and SITA integration.";
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
          {/* Step 1 — Identity & Location */}
          {currentStep === 1 && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Airport Full Name <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., London Heathrow Airport"
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
                  name="iataCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        IATA Code <span className="text-rose-500">*</span>
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        City / Location <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., London"
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Local Timezone <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., GMT+1"
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
                  name="technicalContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Technical Contact <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="it.ops@airport.com"
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

          {/* Step 2 — Infrastructure & SITA */}
          {currentStep === 2 && (
            <>
              <FormField
                control={form.control}
                name="terminals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Active Terminals <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., T1, T2, T5"
                        className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400">
                      Define the terminals where retailing is permitted.
                    </FormDescription>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hardwarePrefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        CUSS Hardware Prefix <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., K-LHR-"
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-slate-400">
                        Identifier for SITA device mapping.
                      </FormDescription>
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
                        Network Status <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                          <SelectItem value="Onboarding">Onboarding / Sandbox</SelectItem>
                          <SelectItem value="Active">Active / Production</SelectItem>
                          <SelectItem value="Inactive">Deactivated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sitaEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Enable Real-Time Hardware Sync
                      </FormLabel>
                      <FormDescription className="text-xs text-slate-400">
                        Permit the PSS broker to push offers directly to CUSS kiosks.
                      </FormDescription>
                    </div>
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