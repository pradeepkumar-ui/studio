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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '../ui/separator';

const fareProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  status: z.enum(['Active', 'Draft']),
  version: z.number().optional(),
  refundability: z.enum(['Allowed', 'Allowed with Penalty', 'Not Allowed']),
  exchangeability: z.enum(['Allowed', 'Allowed with Penalty', 'Not Allowed']),
  transferability: z.enum(['Allowed', 'Not Allowed']),
});

export type FareProduct = z.infer<typeof fareProductSchema>;

interface FareProductFormProps {
  product: FareProduct | null;
  onSubmit: (data: FareProduct) => void;
  onCancel: () => void;
}

export function FareProductForm({ product, onSubmit, onCancel }: FareProductFormProps) {
  const form = useForm<FareProduct>({
    resolver: zodResolver(fareProductSchema),
    defaultValues: product || {
      name: '',
      description: '',
      status: 'Draft',
      refundability: 'Allowed with Penalty',
      exchangeability: 'Allowed with Penalty',
      transferability: 'Not Allowed',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Economy Flex" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the product and its key features." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <h4 className="text-md font-semibold">Service Terms</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="refundability"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Refundability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a rule" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Allowed">Allowed</SelectItem>
                        <SelectItem value="Allowed with Penalty">Allowed with Penalty</SelectItem>
                        <SelectItem value="Not Allowed">Not Allowed</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="exchangeability"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Exchangeability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a rule" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Allowed">Allowed</SelectItem>
                        <SelectItem value="Allowed with Penalty">Allowed with Penalty</SelectItem>
                        <SelectItem value="Not Allowed">Not Allowed</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="transferability"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Transferability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a rule" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Allowed">Allowed</SelectItem>
                        <SelectItem value="Not Allowed">Not Allowed</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <Separator />

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
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
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
