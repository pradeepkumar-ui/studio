
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
import { Store, MapPin, Package, DollarSign } from 'lucide-react';
import { Separator } from '../ui/separator';

const ancillaryProductSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(3, 'SKU is required.').toUpperCase(),
  name: z.string().min(5, 'Product name is required.'),
  providerId: z.string({ required_error: 'Must select an authorized vendor.' }),
  airportCode: z.string({ required_error: 'Select a parent airport node.' }),
  terminal: z.string().min(2, 'Terminal is required.'),
  category: z.enum(['Lounge', 'Parking', 'Retail', 'Voucher', 'Merchandise', 'F&B']),
  price: z.coerce.number().min(0, 'Price must be non-negative.'),
  currency: z.string().length(3, '3-letter currency code.').toUpperCase(),
  stockType: z.enum(['Digital', 'Physical']),
  stockLevel: z.coerce.number().optional(),
  commissionRate: z.coerce.number().min(0).max(100),
  status: z.enum(['Active', 'Draft']),
});

export type AirportService = z.infer<typeof ancillaryProductSchema>;

const mockVendors = [
    { id: 'V-001', name: 'SkyLounge Partners', airport: 'LHR' },
    { id: 'V-002', name: 'Terminal Parking Co', airport: 'JFK' },
    { id: 'V-003', name: 'EcoVoucher Solutions', airport: 'Global' },
];

const airportOptions = [
    { value: 'LHR', label: 'London Heathrow (LHR)' },
    { value: 'JFK', label: 'John F. Kennedy (JFK)' },
    { value: 'SIN', label: 'Singapore Changi (SIN)' },
];

interface AirportServiceFormProps {
  product: AirportService | null;
  onSubmit: (data: AirportService) => void;
  onCancel: () => void;
}

export function AncillaryProductForm({ product, onSubmit, onCancel }: AirportServiceFormProps) {
  const form = useForm<AirportService>({
    resolver: zodResolver(ancillaryProductSchema),
    defaultValues: product || {
      sku: '',
      name: '',
      category: 'Lounge',
      price: 0,
      currency: 'USD',
      stockType: 'Digital',
      commissionRate: 15,
      status: 'Draft',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[75vh] overflow-y-auto pr-4">
        
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Package className="h-4 w-4" />
                Service Identity & SKU
            </div>
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                <FormLabel>Service Display Name</FormLabel>
                <FormControl><Input placeholder="e.g., LHR T5 Executive Lounge Pass" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="sku" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Unique SKU</FormLabel>
                    <FormControl><Input placeholder="e.g., LON-LOU-T5-01" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ecosystem Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Lounge">Lounge Access</SelectItem>
                            <SelectItem value="Parking">Airport Parking</SelectItem>
                            <SelectItem value="Retail">Retail Voucher</SelectItem>
                            <SelectItem value="Voucher">Digital Voucher</SelectItem>
                            <SelectItem value="Merchandise">Physical Merch</SelectItem>
                            <SelectItem value="F&B">Food & Beverage</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )} />
            </div>
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Store className="h-4 w-4" />
                Partner & Deployment
            </div>
            <FormField control={form.control} name="providerId" render={({ field }) => (
                <FormItem>
                <FormLabel>Authorized Vendor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {mockVendors.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="airportCode" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Airport Node</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select airport" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {airportOptions.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    </FormItem>
                )} />
                <FormField control={form.control} name="terminal" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Terminal / Gate</FormLabel>
                    <FormControl><Input placeholder="e.g., T5 B-Gates" {...field} /></FormControl>
                    </FormItem>
                )} />
            </div>
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <DollarSign className="h-4 w-4" />
                Commercials & Fulfillment
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Selling Price</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                )} />
                 <FormField control={form.control} name="commissionRate" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Marketplace Fee (%)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormDescription>Offersense platform commission.</FormDescription>
                    </FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="stockType" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fulfillment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Digital">Digital (Voucher/QR)</SelectItem>
                                <SelectItem value="Physical">Physical (Hand-over)</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />
                {form.watch('stockType') === 'Physical' && (
                     <FormField control={form.control} name="stockLevel" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Stock</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                    )} />
                )}
            </div>
        </section>

        <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-background py-4 border-t z-10">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{product ? 'Update Service' : 'Publish to Ecosystem'}</Button>
        </div>
      </form>
    </Form>
  );
}
