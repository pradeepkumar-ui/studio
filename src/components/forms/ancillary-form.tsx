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
import { DollarSign, Plane, Settings2 } from 'lucide-react';
import { MultiSelect } from '../ui/multi-select';
import { Separator } from '../ui/separator';

const ancillaryCategories = ['Baggage', 'Seat', 'On-board', 'Flexibility'] as const;
const cabinOptions = [
    { value: 'Economy', label: 'Economy' },
    { value: 'Premium Economy', label: 'Premium Economy' },
    { value: 'Business', label: 'Business' },
    { value: 'First', label: 'First' },
    { value: 'All', label: 'All Cabins' },
];

const ancillarySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Ancillary name is required.'),
  category: z.enum(ancillaryCategories),
  pssCode: z.string().min(2, 'PSS / SSR Code is required for host sync.').toUpperCase(),
  defaultPrice: z.coerce.number().min(0, 'Price must be a positive number.'),
  currency: z.string().length(3, 'Currency must be a 3-letter code.').toUpperCase(),
  status: z.enum(['Active', 'Disabled']),
  cabinEligibility: z.array(z.string()).min(1, 'Select at least one cabin.'),
  refundPolicy: z.enum(['Allowed', 'Allowed with Penalty', 'Not Allowed']),
});

export type Ancillary = z.infer<typeof ancillarySchema>;

interface AncillaryFormProps {
  ancillary: Ancillary | null;
  onSubmit: (data: Ancillary) => void;
  onCancel: () => void;
}

export function AncillaryForm({ ancillary, onSubmit, onCancel }: AncillaryFormProps) {
  const form = useForm<Ancillary>({
    resolver: zodResolver(ancillarySchema),
    defaultValues: ancillary || {
      name: '',
      category: 'Baggage',
      pssCode: '',
      defaultPrice: 0,
      currency: 'USD',
      status: 'Active',
      cabinEligibility: ['All'],
      refundPolicy: 'Not Allowed',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[75vh] overflow-y-auto pr-4">
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Plane className="h-4 w-4" />
                Service Identity
            </div>
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Service Name (Customer Facing)</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 1st Checked Bag (23kg)" {...field} />
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
                    <FormLabel>Air Category</FormLabel>
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
                        <Input placeholder="e.g., BAGG" {...field} maxLength={4} />
                    </FormControl>
                    <FormDescription>Used for PNR sync with Host system.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <DollarSign className="h-4 w-4" />
                Pricing & Integrity
            </div>
            <div className="flex gap-4">
                <FormField
                control={form.control}
                name="defaultPrice"
                render={({ field }) => (
                    <FormItem className="flex-1">
                    <FormLabel>Base Price</FormLabel>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                            <Input type="number" placeholder="35" {...field} className="pl-9" />
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
                        <Input placeholder="USD" {...field} className="w-24 uppercase" maxLength={3} />
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
                <FormLabel>Refundability</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                    <SelectItem value="Allowed">Fully Refundable</SelectItem>
                    <SelectItem value="Allowed with Penalty">Refundable with Fee</SelectItem>
                    <SelectItem value="Not Allowed">Non-Refundable</SelectItem>
                    </SelectContent>
                </Select>
                </FormItem>
            )}
            />
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Settings2 className="h-4 w-4" />
                Eligibility & Rules
            </div>
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
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Catalogue Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="Active">Active / Sellable</SelectItem>
                        <SelectItem value="Disabled">Inactive / Hidden</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
                />
        </section>

        <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-background py-4 border-t z-10">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{ancillary ? 'Update Definition' : 'Define Air Ancillary'}</Button>
        </div>
      </form>
    </Form>
  );
}
