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
import { Package, ShieldCheck, Truck, Tag, Store } from 'lucide-react';

const stockItemSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(3, 'SKU must be at least 3 characters.').toUpperCase(),
  category: z.string().min(3, 'Category is required.'),
  supplier: z.string().min(3, 'Supplier/Vendor is required.'),
  available: z.coerce.number().int().min(0, 'Available stock cannot be negative.'),
  reserved: z.coerce.number().int().min(0, 'Reserved stock cannot be negative.'),
  threshold: z.coerce.number().int().min(0, 'Low-stock threshold required.'),
  status: z.enum(['In Stock', 'Low Stock', 'Out of Stock']).optional(),
  type: z.enum(['Physical', 'Digital', 'Service_Capacity']).default('Digital'),
});

export type StockItem = z.infer<typeof stockItemSchema>;

interface StockItemFormProps {
  item: StockItem | null;
  onSubmit: (data: StockItem) => void;
  onCancel: () => void;
}

export function StockItemForm({ item, onSubmit, onCancel }: StockItemFormProps) {
  const form = useForm<StockItem>({
    resolver: zodResolver(stockItemSchema),
    defaultValues: item || {
      sku: '',
      category: '',
      supplier: '',
      available: 0,
      reserved: 0,
      threshold: 10,
      type: 'Digital',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* --- IDENTITY & FULFILLMENT --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <Package className="h-3 w-3" /> Identity & Fulfillment
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-1.5"><Tag className="h-3 w-3" /> Inventory SKU*</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., LOU-LHR-T5-01" {...field} disabled={!!item} className="font-mono h-9" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fulfillment Protocol*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger className="h-9 font-medium"><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Physical">Physical Hand-over (Merch/Kits)</SelectItem>
                            <SelectItem value="Digital">Digital Unlock (Voucher/QR)</SelectItem>
                            <SelectItem value="Service_Capacity">Service Limit (Lounge/Valet)</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Logistics Category*</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Meals, Vouchers, Entry" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-1.5"><Store className="h-3 w-3" /> Primary Vendor*</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., SkyCaterers or Global Lounges" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </section>

        <Separator />
        
        {/* --- BALANCE CONTROL & THRESHOLDS --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                <ShieldCheck className="h-3 w-3" /> Balance Control & Thresholds
            </div>
            <div className="grid grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>In-Stock (Net)*</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} className="font-bold text-emerald-600 h-9" />
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
                    <FormLabel>Reservations</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} className="font-bold text-primary h-9" />
                    </FormControl>
                    <FormDescription className="text-[9px] uppercase font-black tracking-tighter">Held in carts.</FormDescription>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="threshold"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Alert Threshold*</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} className="font-bold text-destructive h-9" />
                    </FormControl>
                    <FormDescription className="text-[9px] uppercase font-black tracking-tighter">Safety stock level.</FormDescription>
                    </FormItem>
                )}
                />
            </div>
        </section>
        
        <div className="flex justify-end gap-4 pt-4 border-t sticky bottom-0 bg-background py-4">
            <Button type="button" variant="outline" onClick={onCancel} className="h-9">Discard Changes</Button>
            <Button type="submit" className="font-bold px-8 h-9">
                <Truck className="mr-2 h-4 w-4" />
                {item ? 'Synchronize Balance' : 'Commit Registry Entry'}
            </Button>
        </div>
      </form>
    </Form>
  );
}