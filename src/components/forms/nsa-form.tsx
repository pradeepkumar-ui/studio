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
import { Separator } from '@/components/ui/separator';

const nsaSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(3, 'Contract Code is required.'),
  partnerId: z.string().min(3, 'Partner ID is required.'),
  scope: z.object({
    route: z.string().min(3, 'Route is required.'),
    season: z.string().min(3, 'Season is required.'),
    dow: z.string().min(3, 'DOW is required.'),
  }),
  capacity: z.coerce.number().min(1, 'Per-flight seats must be at least 1.'),
  rbd: z.string().min(1, 'At least one RBD is required.'),
  brand: z.string().min(3, 'Brand mapping is required.'),
  pricing: z.object({
    currency: z.string().length(3, 'Currency code is required.'),
    baseFareRange: z.string().min(3, 'Base fare range is required.'),
    commission: z.string().min(1, 'Commission is required.'),
  }),
  deadlines: z.object({
    release: z.string().min(3, 'Release deadline is required.'),
    name: z.string().min(3, 'Name deadline is required.'),
    issue: z.string().min(3, 'Issue deadline is required.'),
  }),
  finance: z.object({
    deposit: z.string().min(3, 'Deposit details are required.'),
    penalties: z.string().min(3, 'Penalty details are required.'),
  }),
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
      scope: {
        route: 'SZX-BOM',
        season: '2026-01-01 to 2026-03-31',
        dow: 'Sat out, Wed in',
      },
      capacity: 30,
      rbd: 'Q, N, V',
      brand: 'Value, Flex',
      pricing: {
        currency: 'INR',
        baseFareRange: '8999-9499',
        commission: '8%',
      },
      deadlines: {
        release: 'D-30, D-14',
        name: 'D-14',
        issue: 'D-7',
      },
      finance: {
        deposit: '10% at contract, 20% at D-45',
        penalties: 'Attrition penalties apply.',
      },
      status: 'Draft',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
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

        <h4 className="text-md font-semibold pt-4">Scope</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <FormField
            control={form.control}
            name="scope.route"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Route</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., SZX-BOM" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="scope.season"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Season</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 01-Jan..31-Mar" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="scope.dow"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Days of Week</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Sat out, Wed in" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Separator/>
        
        <h4 className="text-md font-semibold pt-2">Inventory & Pricing</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Per-Flight Seats</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
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

         <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <FormField
            control={form.control}
            name="pricing.currency"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., INR" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="pricing.baseFareRange"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Base Fare Range</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 8999-9499" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="pricing.commission"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Commission</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 8%" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Separator />
        
        <h4 className="text-md font-semibold pt-2">Rules & Deadlines</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <FormField
            control={form.control}
            name="deadlines.release"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Release</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., D-30, D-14" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="deadlines.name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., D-14" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="deadlines.issue"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Issue</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., D-7" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
            control={form.control}
            name="finance.deposit"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Deposits</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 10% at contract" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="finance.penalties"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Penalties</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Attrition penalties apply" {...field} />
                </FormControl>
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
