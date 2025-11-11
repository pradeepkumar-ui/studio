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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const stockItemSchema = z.object({
  sku: z.string().min(3, 'SKU must be at least 3 characters.'),
  category: z.string().min(3, 'Category is required.'),
  supplier: z.string().min(3, 'Supplier is required.'),
  available: z.coerce.number().int().min(0, 'Available stock cannot be negative.'),
  reserved: z.coerce.number().int().min(0, 'Reserved stock cannot be negative.'),
  threshold: z.coerce.number().int().min(0, 'Threshold cannot be negative.'),
  status: z.enum(['In Stock', 'Low Stock', 'Out of Stock']).optional(),
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
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., MEAL_VG_01" {...field} disabled={!!item} />
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
                <FormLabel>Category</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Meals" {...field} />
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
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., SkyCaterers" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-3 gap-4">
            <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Available</FormLabel>
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
                <FormLabel>Reserved</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="threshold"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Threshold</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
            </Button>
            <Button type="submit">{item ? 'Save Changes' : 'Create Item'}</Button>
        </div>
      </form>
    </Form>
  );
}
