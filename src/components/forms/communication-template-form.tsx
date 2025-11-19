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
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';

const templateSchema = z.object({
  id: z.string().optional(),
  templateName: z.string().min(5, 'Template name is required.'),
  eventType: z.string().min(3, 'Event type is required.'),
  channel: z.enum(['Email', 'SMS', 'API']),
  language: z.enum(['EN', 'FR', 'AR', 'ES']),
  subject: z.string().optional(),
  body: z.string().min(10, 'Message body is required.'),
  variables: z.array(z.string()).optional(),
  requiresApproval: z.boolean().default(false),
  notes: z.string().optional(),
});

export type CommunicationTemplate = z.infer<typeof templateSchema>;

interface CommunicationTemplateFormProps {
  template: CommunicationTemplate | null;
  onSubmit: (data: CommunicationTemplate) => void;
  onCancel: () => void;
}

const availableVariables = ['orderId', 'passengerName', 'date', 'amount', 'supplierName', 'itinerary'];

export function CommunicationTemplateForm({ template, onSubmit, onCancel }: CommunicationTemplateFormProps) {
  const form = useForm<CommunicationTemplate>({
    resolver: zodResolver(templateSchema),
    defaultValues: template || {
      templateName: '',
      eventType: 'Order.Created',
      channel: 'Email',
      language: 'EN',
      subject: '',
      body: '',
      variables: ['orderId', 'passengerName'],
      requiresApproval: false,
      notes: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="templateName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Order_Confirmation_EN" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
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
                        <SelectItem value="Order.Created">Order.Created</SelectItem>
                        <SelectItem value="Order.Modified">Order.Modified</SelectItem>
                        <SelectItem value="Order.Cancelled">Order.Cancelled</SelectItem>
                        <SelectItem value="Payment.Success">Payment.Success</SelectItem>
                        <SelectItem value="Payment.Failed">Payment.Failed</SelectItem>
                         <SelectItem value="Fulfilment.Success">Fulfilment.Success</SelectItem>
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
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="API">API</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Language</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="EN">EN (English)</SelectItem>
                        <SelectItem value="FR">FR (French)</SelectItem>
                        <SelectItem value="AR">AR (Arabic)</SelectItem>
                        <SelectItem value="ES">ES (Spanish)</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Subject (for Email)</FormLabel>
                <FormControl>
                    <Input placeholder="Your Order {{orderId}} is Confirmed" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                    <Textarea className="min-h-32 font-mono text-xs" placeholder="Dear {{passengerName}}, your Order {{orderId}} has been confirmed." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="variables"
            render={() => (
                <FormItem>
                    <div className="mb-2">
                        <FormLabel>Available Variables</FormLabel>
                    </div>
                     <div className="flex flex-wrap gap-2">
                        {availableVariables.map((item) => (
                            <Badge key={item} variant="outline" className="font-mono">{`{{${item}}}`}</Badge>
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Notes (Internal Use)</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., For B2C web orders only" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="requiresApproval"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Requires dual approval before publishing
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{template ? 'Save Changes' : 'Create Template'}</Button>
        </div>
      </form>
    </Form>
  );
}
