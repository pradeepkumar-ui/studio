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
import { Separator } from '../ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useFirestore, useCollection } from '@/firebase';
import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { Store, MapPin, Clock, Signal, QrCode, Smartphone, UserCheck, ShieldCheck, Briefcase, Zap, RefreshCw } from 'lucide-react';

const airportInventorySchema = z.object({
  id: z.string().optional(),
  ancillaryId: z.string({ required_error: 'Select an airport ancillary SKU.' }),
  ancillaryName: z.string().optional(),
  airportCode: z.string().optional(),
  terminal: z.string().optional(),
  zone: z.string().min(1, 'Define specific service zone/gate.'),
  supplier: z.string().optional(),
  totalCapacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
  available: z.coerce.number().min(0),
  bufferLimit: z.coerce.number().min(0).default(5),
  timeSlotBased: z.boolean().default(false),
  fulfillmentSource: z.enum(['Offersense', 'Supplier_API']).default('Offersense'),
  realTimeSync: z.boolean().default(false),
  resourceType: z.enum(['Seat', 'Staff', 'Vehicle', 'Bay']).default('Seat'),
  fulfillmentMode: z.enum(['Instant', 'Request']).default('Instant'),
  entitlementType: z.enum(['QR_Code', 'Virtual_Token', 'Agent_Direct']).default('QR_Code'),
  syncStatus: z.enum(['Live', 'Critical', 'Maintenance']).default('Live'),
  operationalMode: z.enum(['NORMAL', 'CONGESTION', 'DISRUPTION']).default('NORMAL'),
  quotas: z.object({
    CUSS: z.coerce.number().min(0),
    CUTE: z.coerce.number().min(0),
    Mobile: z.coerce.number().min(0),
  }),
});

export type AirportInventory = z.infer<typeof airportInventorySchema>;

const mockAirportAncillaries = [
  { id: 'ap1', name: 'Executive Lounge Entry', airportId: 'LHR', terminal: 'T5', providerId: 'Lounge Stars' },
  { id: 'ap2', name: 'Fast Track Security', airportId: 'JFK', terminal: 'T4', providerId: 'Airport Authority' },
  { id: 'ap3', name: 'VIP Valet Parking', airportId: 'SIN', terminal: 'T1', providerId: 'Changi Valet' },
  { id: 'ap4', name: 'Premium Sleeping Pod (6h)', airportId: 'DXB', terminal: 'T3', providerId: "Sleep'nFly" },
  { id: 'ap5', name: 'Porter Service (3 Bags)', airportId: 'LHR', terminal: 'T2', providerId: 'Baggage Helpers' },
];

interface AirportInventoryFormProps {
  inventory: AirportInventory | null;
  onSubmit: (data: AirportInventory) => void;
  onCancel: () => void;
}

export function AirportInventoryForm({ inventory, onSubmit, onCancel }: AirportInventoryFormProps) {
  const firestore = useFirestore();
  const servicesQuery = useMemo(() => firestore ? collection(firestore, 'airportServices') : undefined, [firestore]);
  const { data: servicesData } = useCollection(servicesQuery);

  const availableServices = useMemo(() => {
    return (servicesData && servicesData.length > 0) ? servicesData : mockAirportAncillaries;
  }, [servicesData]);

  const form = useForm<AirportInventory>({
    resolver: zodResolver(airportInventorySchema),
    defaultValues: inventory || {
      ancillaryId: '',
      zone: '',
      totalCapacity: 50,
      available: 50,
      bufferLimit: 5,
      timeSlotBased: false,
      fulfillmentSource: 'Offersense',
      realTimeSync: false,
      resourceType: 'Seat',
      fulfillmentMode: 'Instant',
      entitlementType: 'QR_Code',
      syncStatus: 'Live',
      operationalMode: 'NORMAL',
      quotas: { CUSS: 10, CUTE: 10, Mobile: 30 },
    },
  });

  const watchFulfillmentSource = form.watch('fulfillmentSource');

  const handleFinalSubmit = (data: AirportInventory) => {
      const selected = availableServices.find(s => s.id === data.ancillaryId);
      onSubmit({
          ...data,
          ancillaryName: selected?.name,
          airportCode: selected?.airportId,
          terminal: selected?.terminal,
          supplier: selected?.providerId,
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
        
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <Store className="h-3.5 w-3.5" /> 1. Fulfillment Control
            </div>
            <FormField
                control={form.control}
                name="ancillaryId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ecosystem SKU*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Service..." /></SelectTrigger></FormControl>
                        <SelectContent>
                            {availableServices.map(s => (
                                <SelectItem key={s.id} value={s.id!}>
                                    {s.name} ({s.airportId} {s.terminal})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="fulfillmentSource"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Source Control*</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Offersense">Local Hub Control</SelectItem>
                                <SelectItem value="Supplier_API">External Vendor API</SelectItem>
                            </SelectContent>
                        </Select>
                        </FormItem>
                    )}
                />
                {watchFulfillmentSource === 'Offersense' && (
                    <FormField
                        control={form.control}
                        name="realTimeSync"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-emerald-50/30">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-xs font-bold flex items-center gap-1.5"><RefreshCw className="h-3 w-3" /> Real-time Hub Sync</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                )}
            </div>
            <FormField control={form.control} name="zone" render={({ field }) => (
                <FormItem>
                    <FormLabel>Service Zone / Gate*</FormLabel>
                    <FormControl><Input placeholder="e.g., North Concourse / Gate B-22" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <ShieldCheck className="h-3.5 w-3.5" /> 2. Resource & Capacity
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="resourceType" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Resource Unit</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Seat">Seats</SelectItem>
                                <SelectItem value="Staff">Staff</SelectItem>
                                <SelectItem value="Vehicle">Vehicles</SelectItem>
                                <SelectItem value="Bay">Bays</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />
                <FormField control={form.control} name="bufferLimit" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Safety Buffer</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="totalCapacity" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Peak Capacity*</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="available" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Currently Sellable*</FormLabel>
                        <FormControl><Input type="number" {...field} className="text-emerald-600 font-bold" /></FormControl>
                    </FormItem>
                )} />
            </div>
             <FormField
                control={form.control}
                name="timeSlotBased"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Time-Slot Orchestration</FormLabel>
                    </div>
                    </FormItem>
                )}
            />
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <Signal className="h-3.5 w-3.5" /> 3. SITA Touchpoint Quotas
            </div>
            <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="quotas.CUSS" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-1"><QrCode className="h-3 w-3" /> CUSS</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="quotas.CUTE" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-1"><UserCheck className="h-3 w-3" /> CUTE</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="quotas.Mobile" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> App</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
            </div>
        </section>

        <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background py-4 z-20">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Commit Inventory Node</Button>
        </div>
      </form>
    </Form>
  );
}
