
'use client';

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
import { DollarSign, Plane, Settings2, ShieldCheck, Zap, Info } from 'lucide-react';
import { MultiSelect } from '../ui/multi-select';
import { Separator } from '../ui/separator';
import { useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

const ancillaryCategories = [
    'Baggage - Checked', 
    'Baggage - Special/Sport', 
    'Seat - Legroom', 
    'Seat - Twin/Preferred', 
    'On-board - Wi-Fi', 
    'On-board - Meal',
    'On-board - Premium Bar',
    'Priority - Fast Track',
    'Priority - Boarding',
    'Flexibility - Waiver',
    'Flexibility - Upgrade Standby',
    'Lounge Access'
] as const;

const cabinOptions = [
    { value: 'Economy', label: 'Economy' },
    { value: 'Premium Economy', label: 'Premium Economy' },
    { value: 'Business', label: 'Business' },
    { value: 'First', label: 'First' },
    { value: 'All', label: 'All Cabins' },
];

const aircraftOptions = [
    { value: 'A350', label: 'Airbus A350' },
    { value: 'A320', label: 'Airbus A320neo' },
    { value: 'B787', label: 'Boeing 787 Dreamliner' },
    { value: 'B777', label: 'Boeing 777' },
    { value: 'All', label: 'All Aircraft' },
];

const airlineAncillarySchema = z.object({
  id: z.string().optional(),
  airlineId: z.string({ required_error: 'Select the carrier this ancillary belongs to.' }),
  name: z.string().min(3, 'Service name is required.'),
  category: z.enum(ancillaryCategories),
  pssCode: z.string().min(2, 'PSS / SSR Code is required for host sync.').toUpperCase(),
  defaultPrice: z.coerce.number().min(0, 'Price must be a positive number.'),
  currency: z.string().length(3, 'Currency must be a 3-letter code.').toUpperCase(),
  status: z.enum(['Active', 'Disabled', 'Testing']),
  cabinEligibility: z.array(z.string()).min(1, 'Select at least one cabin.'),
  aircraftEligibility: z.array(z.string()).default(['All']),
  refundPolicy: z.enum(['Allowed', 'Allowed with Penalty', 'Not Allowed']),
  advancePurchaseDays: z.coerce.number().min(0).default(0),
  description: z.string().optional(),
});

export type Ancillary = z.infer<typeof airlineAncillarySchema>;

interface AncillaryFormProps {
  ancillary: Ancillary | null;
  onSubmit: (data: Ancillary) => void;
  onCancel: () => void;
}

export function AncillaryForm({ ancillary, onSubmit, onCancel }: AncillaryFormProps) {
  const firestore = useFirestore();
  const airlinesQuery = useMemo(() => firestore ? collection(firestore, 'airlines') : undefined, [firestore]);
  const { data: airlines } = useCollection(airlinesQuery);

  const form = useForm<Ancillary>({
    resolver: zodResolver(airlineAncillarySchema),
    defaultValues: ancillary || {
      airlineId: '',
      name: '',
      category: 'Baggage - Checked',
      pssCode: '',
      defaultPrice: 0,
      currency: 'USD',
      status: 'Testing',
      cabinEligibility: ['All'],
      aircraftEligibility: ['All'],
      refundPolicy: 'Not Allowed',
      advancePurchaseDays: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
        
        {/* --- IDENTITY --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <Plane className="h-3.5 w-3.5" />
                Carrier Context & Identity
            </div>
            <FormField
                control={form.control}
                name="airlineId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Parent Airline</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Carrier..." /></SelectTrigger></FormControl>
                        <SelectContent>
                            {(airlines || []).map(a => (
                                <SelectItem key={a.id} value={a.id!}>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{a.name}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase font-mono">({a.icaoCode})</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
            />
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Ancillary Display Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Heavy Checked Bag (32kg)" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Service Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                        {ancillaryCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="pssCode"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>PSS / SSR Code</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., BAGH" {...field} maxLength={4} />
                    </FormControl>
                    <FormDescription>Carrier's host PSS identifier.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </section>

        <Separator />

        {/* --- PRICING --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <DollarSign className="h-3.5 w-3.5" />
                Commercial Terms
            </div>
            <div className="grid grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="defaultPrice"
                render={({ field }) => (
                    <FormItem className="col-span-2">
                    <FormLabel>Base Sell Price</FormLabel>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                            <Input type="number" placeholder="50" {...field} className="pl-9" />
                        </FormControl>
                    </div>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                        <Input placeholder="USD" {...field} className="uppercase" maxLength={3} />
                    </FormControl>
                    </FormItem>
                )}
                />
            </div>
            <FormField
                control={form.control}
                name="advancePurchaseDays"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Min Advance Purchase (Days)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Only sell if D-minus > X days.</FormDescription>
                    </FormItem>
                )}
            />
        </section>

        <Separator />

        {/* --- ELIGIBILITY --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <Settings2 className="h-3.5 w-3.5" />
                Technical Compatibility
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="cabinEligibility"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Eligible Cabins</FormLabel>
                        <FormControl>
                            <MultiSelect 
                                options={cabinOptions} 
                                selected={field.value} 
                                onChange={field.onChange} 
                                placeholder="Select cabins..."
                            />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="aircraftEligibility"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Aircraft Type Compatibility</FormLabel>
                        <FormControl>
                            <MultiSelect 
                                options={aircraftOptions} 
                                selected={field.value} 
                                onChange={field.onChange} 
                                placeholder="Select aircraft..."
                            />
                        </FormControl>
                    </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="refundPolicy"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Refund Integrity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Allowed">Refundable</SelectItem>
                            <SelectItem value="Allowed with Penalty">Fee Applies</SelectItem>
                            <SelectItem value="Not Allowed">Non-Refundable</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
            />
        </section>

        <Separator />

        <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Network Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Testing">UAT / Sandbox</SelectItem>
                        <SelectItem value="Active">Live Ecosystem</SelectItem>
                        <SelectItem value="Disabled">Hidden</SelectItem>
                    </SelectContent>
                </Select>
                </FormItem>
            )}
        />

        <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-background py-4 border-t z-10">
            <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
            <Button type="submit" className="font-bold">{ancillary ? 'Update Portfolio Item' : 'Add to Carrier Portfolio'}</Button>
        </div>
      </form>
    </Form>
  );
}
