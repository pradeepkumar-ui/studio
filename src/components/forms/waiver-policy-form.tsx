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
import { Checkbox } from '@/components/ui/checkbox';

const eventTypes = ['Cancellation', 'Delay', 'Weather', 'Schedule Change', 'Overbooking'] as const;
const fareDiffPolicies = ['None', 'Match or Lower', 'Cap at 100 USD', 'Cap at 500 USD'] as const;

const rulesToWaive = [
    { id: 'change_fee', label: 'Change Fee' },
    { id: 'refund_penalty', label: 'Refund Penalty' },
    { id: 'no_show_penalty', label: 'No-Show Penalty' },
    { id: 'min_stay', label: 'Minimum Stay' },
] as const;


const waiverPolicySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Policy name is required.'),
  eventType: z.enum(eventTypes),
  routes: z.string().min(3, 'Route is required.'),
  rulesWaived: z.array(z.string()).min(1, 'At least one rule must be selected.'),
  fareDifferencePolicy: z.enum(fareDiffPolicies),
  status: z.enum(['Draft', 'Approved', 'Published', 'Archived']),
});

export type WaiverPolicy = z.infer<typeof waiverPolicySchema>;

interface WaiverPolicyFormProps {
  policy: WaiverPolicy | null;
  onSubmit: (data: WaiverPolicy) => void;
  onCancel: () => void;
}

export function WaiverPolicyForm({ policy, onSubmit, onCancel }: WaiverPolicyFormProps) {
  const form = useForm<WaiverPolicy>({
    resolver: zodResolver(waiverPolicySchema),
    defaultValues: policy || {
      name: '',
      eventType: 'Weather',
      routes: '',
      rulesWaived: ['change_fee'],
      fareDifferencePolicy: 'Match or Lower',
      status: 'Draft',
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
              <FormLabel>Policy Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Winter Storm Waiver Europe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an event type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {eventTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="routes"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Affected Routes</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., LHR-FRA, LHR-CDG, or 'ALL'" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="rulesWaived"
            render={() => (
                <FormItem>
                    <div className="mb-4">
                        <FormLabel>Rules to be Waived</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    {rulesToWaive.map((item) => (
                        <FormField
                        key={item.id}
                        control={form.control}
                        name="rulesWaived"
                        render={({ field }) => {
                            return (
                            <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                            >
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== item.id
                                            )
                                        )
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal">
                                {item.label}
                                </FormLabel>
                            </FormItem>
                            )
                        }}
                        />
                    ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="fareDifferencePolicy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fare Difference Policy</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a fare difference policy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fareDiffPolicies.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
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
                  <SelectItem value="Archived">Archived</SelectItem>
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
