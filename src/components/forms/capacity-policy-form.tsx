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
import { Separator } from '../ui/separator';

const mockOffers = [
    { id: 'BUN-001', name: 'Business Saver+'},
    { id: 'BUN-002', name: 'Family Pack'},
    { id: 'BUN-004', name: 'Long Haul Comfort'},
    { id: 'BUN-006', name: 'Flexi Traveler'},
    { id: 'BUN-007', name: 'Holiday Special'},
];


const capacityPolicySchema = z.object({
  id: z.string().optional(),
  offerId: z.string({ required_error: 'Please select an offer to apply this policy to.'}),
  offerName: z.string().optional(),
  caps: z.string().min(3, 'Caps are required.'),
  quotas: z.string(),
  pacing: z.string(),
  status: z.enum(['Draft', 'Published']),
});

export type CapacityPolicy = z.infer<typeof capacityPolicySchema>;

interface CapacityPolicyFormProps {
  policy: CapacityPolicy | null;
  onSubmit: (data: CapacityPolicy) => void;
  onCancel: () => void;
}

export function CapacityPolicyForm({ policy, onSubmit, onCancel }: CapacityPolicyFormProps) {
  const form = useForm<CapacityPolicy>({
    resolver: zodResolver(capacityPolicySchema),
    defaultValues: policy || {
      offerId: '',
      caps: '',
      quotas: '',
      pacing: '',
      status: 'Draft',
    },
  });
  
  const handleFormSubmit = (data: CapacityPolicy) => {
    const selectedOffer = mockOffers.find(o => o.id === data.offerId);
    onSubmit({
      ...data,
      offerName: selectedOffer?.name,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        
        <h4 className="text-md font-semibold">Scope</h4>
        <FormField
          control={form.control}
          name="offerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Offer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an offer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockOffers.map(offer => (
                    <SelectItem key={offer.id} value={offer.id}>
                      {offer.name} ({offer.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator className="my-6" />

        <h4 className="text-md font-semibold">Rules</h4>
         <FormField
          control={form.control}
          name="caps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caps (Max Offers, Max Accepted)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1200 Offers, 400 Accepted" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quotas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quotas (Channel Ratios)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Direct 60% / OTA 40%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="pacing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pacing (Max per Minute)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 60/min" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-6" />
        
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
                  <SelectItem value="Published">Published</SelectItem>
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
          <Button type="submit">{policy ? 'Save Changes' : 'Create Policy'}</Button>
        </div>
      </form>
    </Form>
  );
}
