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

const corporateContractSchema = z.object({
  id: z.string().optional(),
  companyName: z.string().min(3, 'Company name is required.'),
  contractId: z.string().min(3, 'Contract ID is required.'),
  status: z.enum(['Active', 'Expired', 'Negotiation']),
  activeFares: z.coerce.number().min(0, 'Active fares must be a non-negative number.'),
  administrator: z.string().min(3, 'Administrator name is required.'),
});

export type CorporateContract = z.infer<typeof corporateContractSchema>;

interface CorporateContractFormProps {
  contract: CorporateContract | null;
  onSubmit: (data: CorporateContract) => void;
  onCancel: () => void;
}

export function CorporateContractForm({ contract, onSubmit, onCancel }: CorporateContractFormProps) {
  const form = useForm<CorporateContract>({
    resolver: zodResolver(corporateContractSchema),
    defaultValues: contract || {
      companyName: '',
      contractId: '',
      status: 'Negotiation',
      activeFares: 0,
      administrator: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Globex Corporation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contractId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., GLX-2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="administrator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administrator</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Alice Johnson" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="activeFares"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Active Fares</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
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
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{contract ? 'Save Changes' : 'Create Contract'}</Button>
        </div>
      </form>
    </Form>
  );
}
