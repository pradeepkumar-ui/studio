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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';


const largePartyOrderSchema = z.object({
  id: z.string().optional(),
  groupName: z.string().min(5, 'Group name is required.'),
  leadPassenger: z.string().min(3, 'Lead passenger name is required.'),
  totalPassengers: z.coerce.number().min(10, 'Group must have at least 10 passengers.'),
  channel: z.enum(['Web', 'B2B', 'API']),
  paymentTerms: z.enum(['Deposit + Balance', 'Full Payment']),
  depositDueDate: z.date().optional(),
  fareType: z.enum(['Negotiated', 'Published']),
  remarks: z.string().optional(),
  status: z.enum(['Active', 'Pending Approval', 'Fulfilled']).optional(),
});

export type LargePartyOrder = z.infer<typeof largePartyOrderSchema>;

interface LargePartyOrderFormProps {
  order: LargePartyOrder | null;
  onSubmit: (data: LargePartyOrder) => void;
  onCancel: () => void;
}

export function LargePartyOrderForm({ order, onSubmit, onCancel }: LargePartyOrderFormProps) {
  const form = useForm<LargePartyOrder>({
    resolver: zodResolver(largePartyOrderSchema),
    defaultValues: order || {
      groupName: '',
      leadPassenger: '',
      totalPassengers: 10,
      channel: 'B2B',
      paymentTerms: 'Deposit + Balance',
      depositDueDate: new Date(),
      fareType: 'Negotiated',
      remarks: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Corporate Training Batch 2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="leadPassenger"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Lead Passenger</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., John Carter" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="totalPassengers"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Total Passengers</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 26" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
         <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Channel</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                    <SelectValue placeholder="Select a channel" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="B2B">B2B Portal</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="paymentTerms"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Payment Terms</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Deposit + Balance">Deposit + Balance</SelectItem>
                    <SelectItem value="Full Payment">Full Payment</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
                control={form.control}
                name="depositDueDate"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Deposit Due Date</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={'outline'}
                            className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
         <FormField
            control={form.control}
            name="fareType"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Fare Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select fare type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Negotiated">Negotiated</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Corporate booking with seat proximity preference."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{order ? 'Save Changes' : 'Create Group Order'}</Button>
        </div>
      </form>
    </Form>
  );
}
