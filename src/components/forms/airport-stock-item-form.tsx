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
import { Store, ShieldCheck, Clock, Tag, Building2, Zap, MonitorDot } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';

const airportStockItemSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(3, 'SKU must be at least 3 characters.').toUpperCase(),
  airportCode: z.string().min(3, 'Airport Code is required.').toUpperCase(),
  terminal: z.string().min(1, 'Terminal is required.'),
  category: z.enum(['Lounge', 'Fast-track', 'Meet & Assist', 'Ground Transport']),
  fulfillmentSource: z.enum(['Offersense', 'Supplier_API']).default('Offersense'),
  protocol: z.enum(['Slot-based', 'Capacity-based', 'Resource-count']).default('Capacity-based'),
  resourceType: z.enum(['Seat', 'Staff', 'Vehicle', 'Bay']).default('Seat'),
  available: z.coerce.number().int().min(0, 'Available cannot be negative.'),
  reserved: z.coerce.number().int().min(0, 'Reserved cannot be negative.'),
  threshold: z.coerce.number().int().min(0, 'Threshold required.'),
  isSlotActive: z.boolean().default(false),
});

export type AirportStockItem = z.infer<typeof airportStockItemSchema>;

interface AirportStockItemFormProps {
  item: AirportStockItem | null;
  onSubmit: (data: AirportStockItem) => void;
  onCancel: () => void;
}

export function AirportStockItemForm({ item, onSubmit, onCancel }: AirportStockItemFormProps) {
  const form = useForm<AirportStockItem>({
    resolver: zodResolver(airportStockItemSchema),
    defaultValues: item || {
      sku: '',
      airportCode: '',
      terminal: '',
      category: 'Lounge',
      fulfillmentSource: 'Offersense',
      protocol: 'Capacity-based',
      resourceType: 'Seat',
      available: 0,
      reserved: 0,
      threshold: 5,
      isSlotActive: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <Store className="h-3 w-3" /> Hub Identity & Sync
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5"><Tag className="h-3 w-3" /> Hub SKU*</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., LOU-LHR-T5-01" {...field} disabled={!!item} className="font-mono h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fulfillmentSource"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-amber-500" /> Fulfillment Control*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10 font-bold"><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Offersense">Local Hub Control (Offersense)</SelectItem>
                                <SelectItem value="Supplier_API">External Supplier API</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                  )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="airportCode"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Airport Node*</FormLabel>
                        <FormControl><Input placeholder="e.g., LHR" {...field} maxLength={3} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terminal"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terminal*</FormLabel>
                        <FormControl><Input placeholder="e.g., T5" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                />
            </div>
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <Clock className="h-3 w-3" /> Availability Protocol
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="h-10"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Lounge">Lounge Facilities</SelectItem>
                                <SelectItem value="Fast-track">Fast-track Channels</SelectItem>
                                <SelectItem value="Meet & Assist">Personal Services</SelectItem>
                                <SelectItem value="Ground Transport">Transfers & Buggy</SelectItem>
                            </SelectContent>
                        </Select>
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="protocol"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operational Protocol</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="h-10"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Slot-based">Time-Slot Reservation</SelectItem>
                                <SelectItem value="Capacity-based">Bulk Capacity Limit</SelectItem>
                                <SelectItem value="Resource-count">Physical Resource Count</SelectItem>
                            </SelectContent>
                        </Select>
                      </FormItem>
                  )}
                />
            </div>
            <FormField
              control={form.control}
              name="isSlotActive"
              render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1 leading-none">
                          <FormLabel>Enforce Temporal Windows</FormLabel>
                          <FormDescription className="text-[10px]">Restricts availability to specific departure/arrival windows.</FormDescription>
                      </div>
                  </FormItem>
              )}
            />
        </section>

        <Separator />
        
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <ShieldCheck className="h-3 w-3" /> Balance Control
            </div>
            <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Net Capacity*</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} className="font-bold text-emerald-600 h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reserved"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Holds (Soft)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} className="font-bold text-blue-600 h-10" />
                        </FormControl>
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="threshold"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alert Floor*</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} className="font-bold text-destructive h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                />
            </div>
        </section>

        <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
            <Button type="submit" className="font-bold px-8">
                <MonitorDot className="mr-2 h-4 w-4" />
                {item ? 'Update Node Balance' : 'Initialize Hub Node'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
