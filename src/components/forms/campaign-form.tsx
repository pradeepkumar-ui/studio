
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
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

const campaignSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Campaign name must be at least 5 characters.'),
  status: z.enum(['Draft', 'Scheduled', 'Active', 'Paused', 'Completed']),
  channels: z.array(z.string()).min(1, 'At least one channel is required.'),
  targetAudience: z.string().min(3, 'Target audience is required.'),
  schedule: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine((data) => data.to > data.from, {
      message: 'End date must be after start date.',
      path: ['to'],
    }),
  template: z.string().min(1, 'Please select a template.'),
  conversions: z.number().optional(),
  channel: z.string().optional(),
});

export type Campaign = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  campaign: Campaign | null;
  onSubmit: (data: Campaign) => void;
  onCancel: () => void;
}

const channels = [
  { id: 'email', label: 'Email' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile App' },
  { id: 'tmc', label: 'TMC/API' },
  { id: 'gds', label: 'GDS' },
];

const templates = [
  'Q4_Holiday_Promo_EN',
  'Early_Bird_2025_Banner',
  'New_Route_Launch_Email_SEA',
];

export function CampaignForm({ campaign, onSubmit, onCancel }: CampaignFormProps) {
  const form = useForm<Campaign>({
    resolver: zodResolver(campaignSchema),
    defaultValues:
      campaign
        ? {
            ...campaign,
            channels: campaign.channel ? campaign.channel.split(', ') : [],
            schedule: {
              from: new Date(campaign.schedule.split(' to ')[0]),
              to: new Date(campaign.schedule.split(' to ')[1]),
            },
          }
        : {
            name: '',
            status: 'Draft',
            channels: ['email', 'web'],
            targetAudience: 'All Users',
            schedule: {
              from: new Date(),
              to: addDays(new Date(), 30),
            },
            template: templates[0],
          },
  });

  function onFormSubmit(data: Campaign) {
    const formattedData: Campaign = {
        ...data,
        channel: data.channels.join(', '),
        schedule: `${format(data.schedule.from, 'yyyy-MM-dd')} to ${format(data.schedule.to, 'yyyy-MM-dd')}`,
    };
    onSubmit(formattedData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Winter Early Bird Special" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="channels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channels</FormLabel>
              <div className="flex flex-wrap gap-4">
                {channels.map((channel) => (
                  <FormField
                    key={channel.id}
                    control={form.control}
                    name="channels"
                    render={({ field }) => (
                      <FormItem
                        key={channel.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(channel.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, channel.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== channel.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {channel.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience / Cohort</FormLabel>
              <FormControl>
                <Input placeholder="e.g., EU Leisure Travelers" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Schedule</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      id="date"
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, 'LLL dd, y')} -{' '}
                            {format(field.value.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(field.value.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value?.from}
                    selected={{ from: field.value.from, to: field.value.to }}
                    onSelect={(range) => {
                      if (range) {
                        form.setValue('schedule', range as { from: Date; to: Date });
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
         <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message Template</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template} value={template}>{template}</SelectItem>
                  ))}
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
                    <SelectValue placeholder="Select campaign status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
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
          <Button type="submit">
            {campaign ? 'Save Changes' : 'Create Campaign'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
