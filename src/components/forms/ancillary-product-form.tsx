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
import { Package, MapPin, DollarSign, Clock, Loader2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

const airportAncillarySchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(3, 'SKU is required.').toUpperCase(),
  name: z.string().min(5, 'Product name is required.'),
  providerId: z.string({ required_error: 'Select an authorized vendor.' }),
  airportId: z.string({ required_error: 'Select the airport hub.' }),
  terminal: z.string().min(1, 'Terminal is required.'),
  gate: z.string().optional(),
  category: z.enum([
    'Lounge - Airport', 
    'Parking - Valet', 
    'Parking - EV Charging', 
    'Retail - Voucher', 
    'F&B - Pre-order', 
    'Service - Meet & Assist', 
    'Service - Fast Track',
    'Service - Porter',
    'Service - Sleeping Pod'
  ]),
  price: z.coerce.number().min(0, 'Price must be non-negative.'),
  currency: z.string().length(3, '3-letter code.').toUpperCase(),
  stockType: z.enum(['Digital', 'Physical']),
  commissionRate: z.coerce.number().min(0).max(100),
  operatingHours: z.string().optional(),
  status: z.enum(['Active', 'Draft']),
  description: z.string().optional(),
});

export type AirportAncillary = z.infer<typeof airportAncillarySchema>;

const mockAirports = [
  { id: 'lhr-001', iataCode: 'LHR', name: 'London Heathrow' },
  { id: 'jfk-001', iataCode: 'JFK', name: 'John F. Kennedy' },
  { id: 'sin-001', iataCode: 'SIN', name: 'Singapore Changi' },
];

const mockVendors = [
  { id: 'v-001', name: 'SkyCafe Gourmet', category: 'F&B', airportCode: 'LHR' },
  { id: 'v-002', name: 'Global Duty Free', category: 'Retail', airportCode: 'JFK' },
  { id: 'v-003', name: 'Lounge Stars', category: 'Services', airportCode: 'SIN' },
];

interface AirportAncillaryFormProps {
  product: AirportAncillary | null;
  onSubmit: (data: AirportAncillary) => void;
  onCancel: () => void;
}

export function AncillaryProductForm({ product, onSubmit, onCancel }: AirportAncillaryFormProps) {
  const firestore = useFirestore();
  const airportsQuery = useMemo(() => firestore ? collection(firestore, 'airports') : undefined, [firestore]);
  const partnersQuery = useMemo(() => firestore ? collection(firestore, 'partners') : undefined, [firestore]);

  const { data: airportsData } = useCollection(airportsQuery);
  const { data: partnersData } = useCollection(partnersQuery);

  const availableAirports = useMemo(() => {
    return airportsData && airportsData.length > 0 ? airportsData : mockAirports;
  }, [airportsData]);

  const availableVendors = useMemo(() => {
    return partnersData && partnersData.length > 0 ? partnersData : mockVendors;
  }, [partnersData]);

  const form = useForm<AirportAncillary>({
    resolver: zodResolver(airportAncillarySchema),
    defaultValues: product || {
      sku: '',
      name: '',
      category: 'Lounge - Airport',
      price: 0,
      currency: 'USD',
      stockType: 'Digital',
      commissionRate: 15,
      status: 'Draft',
      airportId: '',
      providerId: '',
      terminal: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
        
        {/* --- IDENTITY --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <Package className="h-3.5 w-3.5" />
                Service Identity
            </div>
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                <FormLabel>Ancillary Product Name</FormLabel>
                <FormControl><Input placeholder="e.g., LHR T5 Private Sleeping Pod" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="sku" render={({ field }) => (
                    <FormItem>
                    <FormLabel>System SKU</FormLabel>
                    <FormControl><Input placeholder="e.g., POD-LHR-T5" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ecosystem Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Lounge - Airport">Airport Operated Lounge</SelectItem>
                            <SelectItem value="Parking - Valet">Valet Parking</SelectItem>
                            <SelectItem value="Parking - EV Charging">EV Charging Point</SelectItem>
                            <SelectItem value="F&B - Pre-order">Food & Beverage Pre-order</SelectItem>
                            <SelectItem value="Service - Meet & Assist">Meet & Assist (Concierge)</SelectItem>
                            <SelectItem value="Service - Fast Track">Security Fast Track</SelectItem>
                            <SelectItem value="Service - Sleeping Pod">Rest & Sleep Services</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )} />
            </div>
        </section>

        <Separator />

        {/* --- DEPLOYMENT --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <MapPin className="h-3.5 w-3.5" />
                Operational Node
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="airportId" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Airport Hub</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Hub..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {availableAirports.map(a => (
                                <SelectItem key={a.id} value={a.iataCode}>
                                  <div className="flex flex-col text-left">
                                    <span className="font-bold">{a.name}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-mono">{a.iataCode}</span>
                                  </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="providerId" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Authorized Vendor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Partner..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {availableVendors.map(p => (
                                <SelectItem key={p.id} value={p.id!}>
                                  <div className="flex flex-col text-left">
                                    <span className="font-bold">{p.name}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase">{p.category} • {p.airportCode}</span>
                                  </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="terminal" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Terminal</FormLabel>
                    <FormControl><Input placeholder="e.g., T5" {...field} /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="gate" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Gate/Area (Optional)</FormLabel>
                    <FormControl><Input placeholder="e.g., Gate B48" {...field} /></FormControl>
                    </FormItem>
                )} />
            </div>
        </section>

        <Separator />

        {/* --- COMMERCIALS --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <DollarSign className="h-3.5 w-3.5" />
                SITA Commercials
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Unit Price</FormLabel>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl><Input type="number" {...field} className="pl-9" /></FormControl>
                        </div>
                    </FormItem>
                )} />
                 <FormField control={form.control} name="commissionRate" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Marketplace Fee (%)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormDescription>SITA Platform revenue share.</FormDescription>
                    </FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="operatingHours" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Service Hours</FormLabel>
                        <FormControl><Input placeholder="e.g., 04:00 - 23:00" {...field} /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="stockType" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Inventory Mode</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Digital">Digital (Unlimited)</SelectItem>
                                <SelectItem value="Physical">Physical (Stocked)</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />
            </div>
        </section>

        <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-background py-4 border-t z-10">
            <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
            <Button type="submit" className="font-bold">{product ? 'Update Ancillary' : 'Commit to Ecosystem'}</Button>
        </div>
      </form>
    </Form>
  );
}
