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
import { useEffect } from 'react';

const ancillaryProductSchema = z.object({
  sku: z.string().min(3, 'SKU is required.'),
  name: z.string().min(5, 'Product name is required.'),
  category: z.string().min(3, 'Category is required.'),
  subCategory: z.string().min(3, 'Sub-category is required.'),
  price: z.coerce.number().min(0, 'Price must be a non-negative number.'),
  currency: z.string().length(3, 'Must be a 3-letter currency code.'),
  stock: z.union([z.coerce.number().min(0), z.literal('N/A')]),
  status: z.enum(['Active', 'Draft']),
});

export type AncillaryProduct = z.infer<typeof ancillaryProductSchema>;

interface AncillaryProductFormProps {
  product: AncillaryProduct | null;
  onSubmit: (data: AncillaryProduct) => void;
  onCancel: () => void;
}

const ancillaryCategories = [
    'Baggage',
    'Seats',
    'On-board Services',
    'Flexibility',
    'Gift Cards',
    'Lounge Access',
    'Merchandise',
    'Vouchers',
    'Meals',
    'Other'
];

const subCategoryMap: Record<string, string[]> = {
    Baggage: ['First Bag', 'Second Bag', 'Oversized'],
    Seats: ['Extra Legroom', 'Up-front', 'Standard'],
    'On-board Services': ['Wi-Fi', 'Lounge Access', 'Priority Boarding'],
    Flexibility: ['Change Waiver', 'Cancellation'],
    'Gift Cards': ['$50 Card', '$100 Card', '$250 Card'],
    'Lounge Access': ['Standard Pass', 'Premium Pass'],
    Merchandise: ['Neck Pillow', 'Model Plane', 'Travel Kit'],
    Vouchers: ['Carbon Offset', 'Drink Voucher', 'Duty-Free'],
    Meals: ['Standard', 'Premium', 'Special (VGML, KSML)'],
    Other: ['General'],
};


export function AncillaryProductForm({ product, onSubmit, onCancel }: AncillaryProductFormProps) {
  const form = useForm<AncillaryProduct>({
    resolver: zodResolver(ancillaryProductSchema),
    defaultValues: product || {
      sku: '',
      name: '',
      category: 'Merchandise',
      subCategory: 'Model Plane',
      price: 0,
      currency: 'USD',
      stock: 0,
      status: 'Draft',
    },
  });
  
  const stockIsNA = form.watch('stock') === 'N/A';
  const selectedCategory = form.watch('category');

  useEffect(() => {
    // Reset subCategory when category changes, if it's not a new form with a product
    if (!product) {
        form.setValue('subCategory', subCategoryMap[selectedCategory]?.[0] || '');
    }
  }, [selectedCategory, form, product]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="e.g., GC-100-USD" {...field} disabled={!!product} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., $100 Gift Card" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {ancillaryCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="subCategory"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Sub-Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a sub-category" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {subCategoryMap[selectedCategory]?.map(subCat => <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>)}
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
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
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
                        <Input placeholder="USD" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
         <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Stock</FormLabel>
                <div className="flex items-center gap-2">
                    <FormControl>
                        <Input type="number" {...field} value={field.value === 'N/A' ? '' : field.value} onChange={e => field.onChange(parseInt(e.target.value))} disabled={stockIsNA}/>
                    </FormControl>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="stockNA"
                            checked={stockIsNA}
                            onChange={(e) => {
                                form.setValue('stock', e.target.checked ? 'N/A' : 0)
                            }}
                        />
                         <label htmlFor="stockNA" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">N/A</label>
                    </div>
                </div>
                <FormMessage />
                </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{product ? 'Save Changes' : 'Create Product'}</Button>
        </div>
      </form>
    </Form>
  );
}
