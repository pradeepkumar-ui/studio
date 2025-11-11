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
import { Textarea } from '../ui/textarea';
import type { WaiverPolicy } from './waiver-policy-form';

const triggerWaiverSchema = z.object({
  name: z.string().min(5, 'Event name is required.'),
  policyId: z.string({ required_error: "You must select a policy."}),
  status: z.enum(['Active', 'Monitoring']),
  validity: z.string().min(10, 'Validity period is required.'),
  affectedFlights: z.coerce.number().min(1, 'At least one flight must be affected.'),
  rules: z.string(), // This will be populated from the selected policy
});

// Type for the form submission
type TriggerWaiverData = z.infer<typeof triggerWaiverSchema>;

// Type for the active waiver card
export type ActiveWaiver = {
  id: string;
  name: string;
  status: 'Active' | 'Monitoring';
  validity: string;
  affectedFlights: number;
  eligiblePax: number;
  repriced: number;
  rules: string;
}

interface TriggerWaiverFormProps {
  policies: WaiverPolicy[];
  onSubmit: (data: Omit<ActiveWaiver, 'id' | 'repriced' | 'eligiblePax'>) => void;
  onCancel: () => void;
}

export function TriggerWaiverForm({ policies, onSubmit, onCancel }: TriggerWaiverFormProps) {
  const form = useForm<TriggerWaiverData>({
    resolver: zodResolver(triggerWaiverSchema),
    defaultValues: {
      name: '',
      status: 'Active',
      validity: '',
      affectedFlights: 1,
      rules: '',
    },
  });
  
  const handlePolicyChange = (policyId: string) => {
    const selectedPolicy = policies.find(p => p.id === policyId);
    if (selectedPolicy) {
      form.setValue('rules', selectedPolicy.rulesWaived);
    }
  }

  const handleFormSubmit = (data: TriggerWaiverData) => {
    const { policyId, ...rest } = data;
    onSubmit(rest);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Winter Storm - East Coast" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="policyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Waiver Policy Template</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                handlePolicyChange(value);
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a policy to apply" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {policies.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.eventType})</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="rules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rules to be Waived (from policy)</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="validity"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Validity Period</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 28-Oct to 30-Oct" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="affectedFlights"
            render={({ field }) => (
                <FormItem>
                <FormLabel># Affected Flights</FormLabel>
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an initial status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Monitoring">Monitoring</SelectItem>
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
          <Button type="submit">Activate Waiver</Button>
        </div>
      </form>
    </Form>
  );
}
