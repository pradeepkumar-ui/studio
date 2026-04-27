
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
// import { MultiSelect } from '../ui/multi-select';
// import { Separator } from '../ui/separator';

// const airlineOnboardingSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(3, 'Airline name is required.'),
//   icaoCode: z.string().length(3, 'ICAO code must be exactly 3 characters.').toUpperCase(),
//   pssType: z.enum(['Amadeus', 'Sabre', 'Navitaire', 'Custom']),
//   status: z.enum(['Active', 'Onboarding', 'Inactive']),
//   contactEmail: z.string().email('Valid contact email is required.'),
//   operatingAirports: z.array(z.string()).min(1, 'Select at least one operating hub.'),
//   pnrMessagingType: z.enum(['EDIFACT', 'NDC', 'JSON']).default('EDIFACT'),
// });

// export type AirlineOnboarding = z.infer<typeof airlineOnboardingSchema>;

// const mockAirports = [
//   { value: 'LHR', label: 'London Heathrow (LHR)' },
//   { value: 'JFK', label: 'John F. Kennedy (JFK)' },
//   { value: 'SIN', label: 'Singapore Changi (SIN)' },
//   { value: 'DXB', label: 'Dubai International (DXB)' },
//   { value: 'CDG', label: 'Paris Charles de Gaulle (CDG)' },
// ];

// interface AirlineOnboardingFormProps {
//   airline: AirlineOnboarding | null;
//   onSubmit: (data: AirlineOnboarding) => void;
//   onCancel: () => void;
// }

// export function AirlineOnboardingForm({ airline, onSubmit, onCancel }: AirlineOnboardingFormProps) {
//   const form = useForm<AirlineOnboarding>({
//     resolver: zodResolver(airlineOnboardingSchema),
//     defaultValues: airline || {
//       name: '',
//       icaoCode: '',
//       pssType: 'Amadeus',
//       status: 'Onboarding',
//       contactEmail: '',
//       operatingAirports: [],
//       pnrMessagingType: 'EDIFACT',
//     },
//   });

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-4">
//         <section className="space-y-4">
//           <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Identity & Operations</h4>
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Carrier Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="e.g., Global Airways" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="icaoCode"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>ICAO Code</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., GAB" maxLength={3} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//              <FormField
//               control={form.control}
//               name="status"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Sync Status</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Onboarding">Pilot / Sandbox</SelectItem>
//                       <SelectItem value="Active">Live Ecosystem</SelectItem>
//                       <SelectItem value="Inactive">Paused</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <FormField
//             control={form.control}
//             name="operatingAirports"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Ecosystem Hubs (Operating Airports)</FormLabel>
//                 <FormControl>
//                   <MultiSelect 
//                     options={mockAirports} 
//                     selected={field.value} 
//                     onChange={field.onChange} 
//                     placeholder="Map carrier to airports..."
//                   />
//                 </FormControl>
//                 <FormDescription>Select the airport nodes where this airline will retail.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </section>

//         <Separator />

//         <section className="space-y-4">
//           <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Technical Integration</h4>
//           <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="pssType"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Host PSS System</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select PSS type" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Amadeus">Amadeus Altéa</SelectItem>
//                       <SelectItem value="Sabre">Sabre Sonic</SelectItem>
//                       <SelectItem value="Navitaire">Navitaire NewSkies</SelectItem>
//                       <SelectItem value="Custom">Custom / In-house</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="pnrMessagingType"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>PNR Sync Protocol</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select protocol" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="EDIFACT">IATA EDIFACT</SelectItem>
//                       <SelectItem value="NDC">NDC API</SelectItem>
//                       <SelectItem value="JSON">REST / JSON</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <FormField
//             control={form.control}
//             name="contactEmail"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>PSS Technical Lead</FormLabel>
//                 <FormControl>
//                   <Input placeholder="pss.ops@airline.com" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </section>

//         <div className="flex justify-end gap-2 pt-4">
//           <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
//           <Button type="submit">{airline ? 'Update Configuration' : 'Onboard Carrier'}</Button>
//         </div>
//       </form>
//     </Form>
//   );
// }


'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
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
import { MultiSelect } from '../ui/multi-select';
import { Stepper, type StepItem } from '../Stepper/Stepper';

// ─── Schema (unchanged) ───────────────────────────────────────────────────────
const airlineOnboardingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Airline name is required.'),
  icaoCode: z.string().length(3, 'ICAO code must be exactly 3 characters.').toUpperCase(),
  pssType: z.enum(['Amadeus', 'Sabre', 'Navitaire', 'Custom']),
  status: z.enum(['Active', 'Onboarding', 'Inactive']),
  contactEmail: z.string().email('Valid contact email is required.'),
  operatingAirports: z.array(z.string()).min(1, 'Select at least one operating hub.'),
  pnrMessagingType: z.enum(['EDIFACT', 'NDC', 'JSON']).default('EDIFACT'),
});

export type AirlineOnboarding = z.infer<typeof airlineOnboardingSchema>;

// ─── Mock Airports (unchanged) ────────────────────────────────────────────────
const mockAirports = [
  { value: 'LHR', label: 'London Heathrow (LHR)' },
  { value: 'JFK', label: 'John F. Kennedy (JFK)' },
  { value: 'SIN', label: 'Singapore Changi (SIN)' },
  { value: 'DXB', label: 'Dubai International (DXB)' },
  { value: 'CDG', label: 'Paris Charles de Gaulle (CDG)' },
];

// ─── Steps Config (using StepItem type from old code) ─────────────────────────
const STEPS: StepItem[] = [
  { id: 1, label: 'Identity & Operations' },
  { id: 2, label: 'Network Config' },
  { id: 3, label: 'Technical Integration' },
];

// ─── Eligibility Banner ───────────────────────────────────────────────────────
const EligibilityBanner = ({ name }: { name: string }) => (
  <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-violet-50 border border-violet-100">
    <div className="w-8 h-8 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center shrink-0 mt-0.5">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div>
      <p className="text-xs font-bold text-indigo-600 mb-0.5">Carrier Eligibility</p>
      <p className="text-xs text-indigo-600 leading-relaxed">
        By proceeding, you verify that{' '}
        <span className="font-semibold">{name || 'this carrier'}</span> has signed the
        Interline Retailing Agreement (IRA-2024). Standard onboarding fees apply to new Tier 1 connections.
      </p>
    </div>
  </div>
);

// ─── Props ────────────────────────────────────────────────────────────────────
interface AirlineOnboardingFormProps {
  airline: AirlineOnboarding | null;
  onSubmit: (data: AirlineOnboarding) => void;
  onCancel: () => void;
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export function AirlineOnboardingForm({ airline, onSubmit, onCancel }: AirlineOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<AirlineOnboarding>({
    resolver: zodResolver(airlineOnboardingSchema),
    defaultValues: airline || {
      name: '',
      icaoCode: '',
      pssType: 'Amadeus',
      status: 'Onboarding',
      contactEmail: '',
      operatingAirports: [],
      pnrMessagingType: 'EDIFACT',
    },
  });

  // ─── Step field map for validation ─────────────────────────────────────────
  const stepFields: Record<number, (keyof AirlineOnboarding)[]> = {
    1: ['name', 'icaoCode', 'status'],
    2: ['operatingAirports'],
    3: ['pssType', 'pnrMessagingType', 'contactEmail'],
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const valid = await form.trigger(fields);
    if (!valid) return;
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const isLastStep = currentStep === 3;
  const isEditing  = !!airline;

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Establish carrier identity and sync status.";
      case 2: return "Select operating hubs for the carrier.";
      case 3: return "Configure PSS and protocol settings.";
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

          {/* Step 1 — Basic Info */}
          {currentStep === 1 && (
            <>
              <div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                          Carrier Name <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Global Airways"
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
                      name="icaoCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                            ICAO Code <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., GAB"
                              maxLength={3}
                              className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-[11px] text-slate-400 mt-1">Unique 2–4 character identifier</p>
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
                            Sync Status <span className="text-rose-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                              <SelectItem value="Onboarding">Pilot / Sandbox</SelectItem>
                              <SelectItem value="Active">Live Ecosystem</SelectItem>
                              <SelectItem value="Inactive">Paused</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs text-rose-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Eligibility Banner */}
              <EligibilityBanner name={form.watch('name')} />
            </>
          )}

          {/* Step 2 — Network Config */}
          {currentStep === 2 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600 mb-4">
                Network Configuration
              </p>
              <FormField
                control={form.control}
                name="operatingAirports"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Ecosystem Hubs (Operating Airports) <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={mockAirports}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Map carrier to airports..."
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400">
                      Select the airport nodes where this airline will retail.
                    </FormDescription>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 3 — Technical Integration */}
          {currentStep === 3 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600 mb-4">
                Technical Integration
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pssType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                          Host PSS System
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                              <SelectValue placeholder="Select PSS type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                            <SelectItem value="Amadeus">Amadeus Altéa</SelectItem>
                            <SelectItem value="Sabre">Sabre Sonic</SelectItem>
                            <SelectItem value="Navitaire">Navitaire NewSkies</SelectItem>
                            <SelectItem value="Custom">Custom / In-house</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs text-rose-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pnrMessagingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                          PNR Sync Protocol
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 hover:border-slate-300 transition-all">
                              <SelectValue placeholder="Select protocol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                            <SelectItem value="EDIFACT">IATA EDIFACT</SelectItem>
                            <SelectItem value="NDC">NDC API</SelectItem>
                            <SelectItem value="JSON">REST / JSON</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs text-rose-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        PSS Technical Lead <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="pss.ops@airline.com"
                          className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-50 hover:border-slate-300 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all duration-150 cursor-pointer"
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