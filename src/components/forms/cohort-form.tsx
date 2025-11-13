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

const cohortSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Cohort name must be at least 5 characters.'),
  cohortId: z.string().min(3, 'Cohort ID must be at least 3 characters.').regex(/^[A-Z0-9_]+$/, 'Cohort ID can only contain uppercase letters, numbers, and underscores.'),
  description: z.string().min(10, 'A clear description is required.'),
  status: z.enum(['Active', 'Inactive']),
  definition: z.object({
    device: z.enum(['All', 'Mobile', 'Desktop']).default('All'),
    channel: z.string().optional(),
    pos: z.string().optional(),
    purchaseCount: z.coerce.number().min(0).default(0),
    totalSpend: z.coerce.number().min(0).default(0),
    loyaltyTier: z.enum(['All', 'Bronze', 'Silver', 'Gold']).default('All'),
    corporateDomain: z.string().optional(),
  }),
});

export type Cohort = z.infer<typeof cohortSchema>;

interface CohortFormProps {
  cohort: Cohort | null;
  onSubmit: (data: Cohort) => void;
  onCancel: () => void;
}

export function CohortForm({ cohort, onSubmit, onCancel }: CohortFormProps) {
  const form = useForm<Cohort>({
    resolver: zodResolver(cohortSchema),
    defaultValues: cohort || {
      name: '',
      cohortId: '',
      description: '',
      status: 'Active',
      definition: {
        device: 'All',
        channel: '',
        pos: '',
        purchaseCount: 0,
        totalSpend: 0,
        loyaltyTier: 'All',
        corporateDomain: '',
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cohort Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Frequent Mobile Users UAE" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cohortId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cohort ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., FrequentMobile_UAE" {...field} />
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
                <Input placeholder="A brief description of this customer segment." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        <h4 className="text-md font-semibold">Definition Rules</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField
              control={form.control}
              name="definition.device"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Device Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                      <SelectTrigger>
                      <SelectValue placeholder="Select a device type" />
                      </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                      <SelectItem value="All">All Devices</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Desktop">Desktop</SelectItem>
                  </SelectContent>
                  </Select>
                  <FormMessage />
              </FormItem>
              )}
          />
           <FormField
              control={form.control}
              name="definition.channel"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Channel</FormLabel>
                  <FormControl>
                  <Input placeholder="e.g., TMC, Web (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
             <FormField
              control={form.control}
              name="definition.pos"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Point of Sale (e.g., AE, IN)</FormLabel>
                  <FormControl>
                  <Input placeholder="Leave blank for all" {...field} />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />
           <FormField
              control={form.control}
              name="definition.corporateDomain"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Corporate Email Domain</FormLabel>
                  <FormControl>
                  <Input placeholder="e.g., stark.com (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="definition.purchaseCount"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Min. Purchase Count</FormLabel>
                    <FormControl>
                    <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="definition.totalSpend"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Min. Total Spend (USD)</FormLabel>
                    <FormControl>
                    <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
         <FormField
              control={form.control}
              name="definition.loyaltyTier"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Loyalty Tier</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                      <SelectTrigger>
                      <SelectValue placeholder="Select a loyalty tier" />
                      </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                      <SelectItem value="All">All Tiers</SelectItem>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                  </SelectContent>
                  </Select>
                  <FormMessage />
              </FormItem>
              )}
          />

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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
          <Button type="submit">{cohort ? 'Save Changes' : 'Create Cohort'}</Button>
        </div>
      </form>
    </Form>
  );
}
