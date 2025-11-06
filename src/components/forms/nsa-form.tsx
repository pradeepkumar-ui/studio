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

const nsaSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(3, 'Contract Code is required.'),
  partnerId: z.string().min(3, 'Partner ID is required.'),
  scope: z.string().min(5, 'Scope is required.'),
  capacity: z.coerce.number().min(1, 'Per-flight seats must be at least 1.'),
  rbd: z.string().min(1, 'At least one RBD is required.'),
  brand: z.string().min(3, 'Brand mapping is required.'),
  pricing: z.string().min(5, 'Pricing details are required.'),
  status: z.enum(['Draft', 'Approved', 'Published', 'Amended', 'Expired']),
});

export type NegotiatedSpaceAgreement = z.infer<typeof nsaSchema>;

interface NsaFormProps {
  nsa: NegotiatedSpaceAgreement | null;
  onSubmit: (data: NegotiatedSpaceAgreement) => void;
  onCancel: () => void;
}

export function NsaForm({ nsa, onSubmit, onCancel }: NsaFormProps) {
  const form = useForm<NegotiatedSpaceAgreement>({
    resolver: zodResolver(nsaSchema),
    defaultValues: nsa || {
      code: '',
      partnerId: '',
      scope: 'SZX-BOM / 2026-01-01 to 2026-03-31 / Sat out, Wed in',
      capacity: 30,
      rbd: 'Q, N, V',
      brand: 'Value, Flex',
      pricing: 'INR; base 8,999 -> 9,499; 8% commission',
      status: 'Draft',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., NSA-THR-2026" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="partnerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., TOUR-ALPHA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scope (Routes/Season/DOW)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., SZX-BOM / 01-Jan..31-Mar / Sat out, Wed in" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Per-Flight Seats (Series)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rbd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RBD Mapping</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Q,N,V" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Mapping</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Value, Flex" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
         <FormField
          control={form.control}
          name="pricing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pricing & Commission</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., INR; base 8,999 -> 9,499; 8% commission" {...field} />
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
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Amended">Amended</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
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
          <Button type="submit">{nsa ? 'Save Changes' : 'Create Agreement'}</Button>
        </div>
      </form>
    </Form>
  );
}
