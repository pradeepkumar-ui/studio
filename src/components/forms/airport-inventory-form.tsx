
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
import { Store, MapPin, Clock, Signal, QrCode, Smartphone, UserCheck } from 'lucide-react';

const airportInventorySchema = z.object({
  id: z.string().optional(),
  ancillaryId: z.string({ required_error: 'Select an airport ancillary SKU.' }),
  ancillaryName: z.string().optional(),
  airportCode: z.string().optional(),
  terminal: z.string().optional(),
  supplier: z.string().optional(),
  totalCapacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
  available: z.coerce.number().min(0),
  timeSlotBased: z.boolean().default(false),
  syncStatus: z.enum(['Live', 'Critical', 'Maintenance']).default('Live'),
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
    return servicesData && servicesData.length > 0 ? servicesData : mockAirportAncillaries;
  }, [servicesData]);

  const form = useForm<AirportInventory>({
    resolver: zodResolver(airportInventorySchema),
    defaultValues: inventory || {
      ancillaryId: '',
      totalCapacity: 50,
      available: 50,
      timeSlotBased: false,
      syncStatus: 'Live',
      quotas: { CUSS: 10, CUTE: 10, Mobile: 30 },
    },
  });

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
                <Store className="h-3.5 w-3.5" /> Node & Service Scope
            </div>
            <FormField
                control={form.control}
                name="ancillaryId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Airport Ecosystem SKU*</FormLabel>
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
                    <FormDescription>Inventory is mapped per SITA node and vendor.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <MapPin className="h-3.5 w-3.5" /> Capacity & Balancing
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="totalCapacity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Peak Node Capacity*</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="available"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Immediate Availability*</FormLabel>
                        <FormControl><Input type="number" {...field} className="text-emerald-600 font-bold" /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="timeSlotBased"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Enable Time-Slot Inventory</FormLabel>
                        <FormDescription>Manage stock per specific arrival/departure time windows.</FormDescription>
                    </div>
                    </FormItem>
                )}
            />
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <Signal className="h-3.5 w-3.5" /> SITA Channel Orchestration
            </div>
            <div className="grid grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="quotas.CUSS"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-1"><QrCode className="h-3 w-3" /> CUSS</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quotas.CUTE"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-1"><UserCheck className="h-3 w-3" /> CUTE</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quotas.Mobile"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> Mobile</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </section>

        <Separator />

        <FormField
            control={form.control}
            name="syncStatus"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Fulfillment Sync Health</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Live">Live (Sync Operational)</SelectItem>
                        <SelectItem value="Critical">Sync Latency Detected</SelectItem>
                        <SelectItem value="Maintenance">Off-line Reconciliation</SelectItem>
                    </SelectContent>
                </Select>
                </FormItem>
            )}
        />

        <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background py-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Publish Inventory Node</Button>
        </div>
      </form>
    </Form>
  );
}
