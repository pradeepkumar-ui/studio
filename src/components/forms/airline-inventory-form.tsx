
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
import { Checkbox } from '../ui/checkbox';
import { useFirestore, useCollection } from '@/firebase';
import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { Plane, ShieldCheck, Zap, Globe, Laptop } from 'lucide-react';

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
  quotas: z.object({
    Direct: z.coerce.number().min(0),
    OTA: z.coerce.number().min(0),
    GDS: z.coerce.number().min(0),
  }),
});

export type AirlineInventory = z.infer<typeof airlineInventorySchema>;

const mockAncillaries = [
  { id: 'a1', name: 'Extra Legroom Seat', pssCode: 'EXLG' },
  { id: 'a2', name: 'Gourmet Meal', pssCode: 'MEAL' },
  { id: 'a3', name: 'Premium Wi-Fi', pssCode: 'WIFI' },
];

interface AirlineInventoryFormProps {
  inventory: AirlineInventory | null;
  onSubmit: (data: AirlineInventory) => void;
  onCancel: () => void;
}

export function AirlineInventoryForm({ inventory, onSubmit, onCancel }: AirlineInventoryFormProps) {
  const firestore = useFirestore();
  const ancillariesQuery = useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
  const { data: ancillariesData } = useCollection(ancillariesQuery);

  const availableAncillaries = useMemo(() => {
    return ancillariesData && ancillariesData.length > 0 ? ancillariesData : mockAncillaries;
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
      quotas: { Direct: 5, OTA: 3, GDS: 2 },
    },
  });

  const handleFinalSubmit = (data: AirlineInventory) => {
      const selected = availableAncillaries.find(a => a.id === data.ancillaryId);
      onSubmit({
          ...data,
          ancillaryName: selected?.name,
          pssCode: selected?.pssCode,
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
        
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <Plane className="h-3.5 w-3.5" /> Product & Scoping
            </div>
            <FormField
                control={form.control}
                name="ancillaryId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ancillary SKU*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Product..." /></SelectTrigger></FormControl>
                        <SelectContent>
                            {availableAncillaries.map(a => (
                                <SelectItem key={a.id} value={a.id!}>{a.name} ({a.pssCode})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="flightNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Flight Scope*</FormLabel>
                        <FormControl><Input placeholder="e.g., AC101 or Global" {...field} /></FormControl>
                        <FormDescription>Use 'Global' for fleet-wide stock.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="aircraftType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Fleet Filter</FormLabel>
                        <FormControl><Input placeholder="e.g., A350-900" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <ShieldCheck className="h-3.5 w-3.5" /> Capacity & Reservation
            </div>
            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="totalCapacity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Total Seats/Units*</FormLabel>
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
                        <FormLabel>Currently Sellable*</FormLabel>
                        <FormControl><Input type="number" {...field} className="text-emerald-600 font-bold" /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reserved"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Active Holds</FormLabel>
                        <FormControl><Input type="number" {...field} className="text-blue-600 font-bold" /></FormControl>
                        <FormDescription>In-cart reservations.</FormDescription>
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Inventory State</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Open">Open (Selling)</SelectItem>
                            <SelectItem value="Waitlist">Waitlist Only</SelectItem>
                            <SelectItem value="Closed">Closed (Stop-Sell)</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
            />
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <Globe className="h-3.5 w-3.5" /> Multi-Channel Quotas
            </div>
            <div className="grid grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="quotas.Direct"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-1"><Laptop className="h-3 w-3" /> Direct</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quotas.OTA"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>OTA</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quotas.GDS"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>GDS</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                    )}
                />
            </div>
            <p className="text-[10px] text-muted-foreground italic">Quotas are enforced per-channel to ensure commercial priority.</p>
        </section>

        <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background py-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Commit Inventory Adjustments</Button>
        </div>
      </form>
    </Form>
  );
}
