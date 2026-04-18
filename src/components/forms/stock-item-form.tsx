
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

const stockItemSchema = z.object({
  sku: z.string().min(3, 'SKU must be at least 3 characters.'),
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
        <section className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Identity & Fulfillment</h4>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Inventory SKU</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., LOU-LHR-T5-01" {...field} disabled={!!item} />
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
                    <FormLabel>Item Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Physical">Physical (Amenity Kits, Merch)</SelectItem>
                            <SelectItem value="Digital">Digital (Voucher, Wi-Fi Code)</SelectItem>
                            <SelectItem value="Service_Capacity">Service Capacity (Lounge, Valet)</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Logistics Category</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Meals, Vouchers" {...field} />
                    </FormControl>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Vendor / Source</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., SkyCaterers" {...field} />
                    </FormControl>
                    </FormItem>
                )}
                />
            </div>
        </section>

        <Separator />
        <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Balance Control</h4>
        
        <div className="grid grid-cols-3 gap-4">
            <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
                <FormItem>
                <FormLabel>In-Stock (Available)</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
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
                <FormLabel>Retailing Reservations</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormDescription className="text-[10px]">Held for unpaid carts.</FormDescription>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="threshold"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Safety Threshold</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormDescription className="text-[10px]">Triggers low-stock alert.</FormDescription>
                </FormItem>
            )}
            />
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{item ? 'Synchronize Balance' : 'Register SKU'}</Button>
        </div>
      </form>
    </Form>
  );
}
