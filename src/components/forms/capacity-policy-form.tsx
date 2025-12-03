'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Card, CardContent } from '../ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';

const mockOffers = [
    { id: 'BUN-001', name: 'Business Saver+'},
    { id: 'BUN-002', name: 'Family Pack'},
    { id: 'BUN-004', name: 'Long Haul Comfort'},
    { id: 'BUN-006', name: 'Flexi Traveler'},
    { id: 'BUN-007', name: 'Holiday Special'},
];

const channelOptions = ['Direct', 'TMC', 'OTA', 'API', 'GDS'];

const capacityPolicySchema = z.object({
  id: z.string().optional(),
  offerId: z.string({ required_error: 'Please select an offer to apply this policy to.'}),
  offerName: z.string().optional(),
  caps: z.object({
    maxOffers: z.coerce.number().optional(),
    maxAccepted: z.coerce.number().optional(),
  }),
  quotas: z.array(z.object({
    channel: z.string().min(1, 'Channel is required.'),
    percentage: z.coerce.number().min(0).max(100, 'Percentage must be between 0 and 100.'),
  })).optional(),
  pacing: z.object({
    rate: z.coerce.number().optional(),
    unit: z.enum(['per_minute', 'per_hour', 'per_day']).optional(),
  }),
  status: z.enum(['Draft', 'Published']),
});

export type CapacityPolicy = z.infer<typeof capacityPolicySchema>;

interface CapacityPolicyFormProps {
  policy: CapacityPolicy & { caps: string, quotas: string, pacing: string } | null;
  onSubmit: (data: CapacityPolicy) => void;
  onCancel: () => void;
}

const parseRule = (rule: string, type: 'caps' | 'quotas' | 'pacing') => {
    if (!rule) {
        if (type === 'caps') return { maxOffers: undefined, maxAccepted: undefined };
        if (type === 'quotas') return [];
        if (type === 'pacing') return { rate: undefined, unit: undefined };
        return {};
    }

    if (type === 'caps') {
        const offersMatch = rule.match(/(\d+)\s*Offers/);
        const acceptedMatch = rule.match(/(\d+)\s*Accepted/);
        return {
            maxOffers: offersMatch ? parseInt(offersMatch[1]) : undefined,
            maxAccepted: acceptedMatch ? parseInt(acceptedMatch[1]) : undefined,
        };
    }

    if (type === 'quotas') {
        return rule.split('/').map(part => {
            const [channel, percentage] = part.trim().split(/\s+/);
            return { channel, percentage: parseInt(percentage) };
        }).filter(q => q.channel && !isNaN(q.percentage));
    }
    
    if (type === 'pacing') {
        const rateMatch = rule.match(/(\d+)\/min/);
        if (rateMatch) {
            return { rate: parseInt(rateMatch[1]), unit: 'per_minute' };
        }
    }
    
    return {};
};


const formatForDisplay = (data: CapacityPolicy): { caps: string, quotas: string, pacing: string } => {
    const capsParts = [];
    if (data.caps?.maxOffers) capsParts.push(`${data.caps.maxOffers.toLocaleString()} Offers`);
    if (data.caps?.maxAccepted) capsParts.push(`${data.caps.maxAccepted.toLocaleString()} Accepted`);
    
    const quotasString = data.quotas?.map(q => `${q.channel} ${q.percentage}%`).join(' / ') || 'N/A';
    
    let pacingString = 'N/A';
    if (data.pacing?.rate && data.pacing?.unit) {
        const unitMap = { per_minute: 'min', per_hour: 'hr', per_day: 'day' };
        pacingString = `${data.pacing.rate}/${unitMap[data.pacing.unit]}`;
    }

    return {
        caps: capsParts.join(', ') || 'N/A',
        quotas: quotasString,
        pacing: pacingString,
    };
};

export function CapacityPolicyForm({ policy, onSubmit, onCancel }: CapacityPolicyFormProps) {
  const form = useForm<CapacityPolicy>({
    resolver: zodResolver(capacityPolicySchema),
    defaultValues: policy ? {
      ...policy,
      caps: parseRule(policy.caps, 'caps') as any,
      quotas: parseRule(policy.quotas, 'quotas') as any,
      pacing: parseRule(policy.pacing, 'pacing') as any,
    } : {
      offerId: '',
      caps: {},
      quotas: [],
      pacing: {},
      status: 'Draft',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "quotas",
  });
  
  const handleFormSubmit = (data: CapacityPolicy) => {
    const selectedOffer = mockOffers.find(o => o.id === data.offerId);
    const displayData = formatForDisplay(data);

    onSubmit({
      ...data,
      offerName: selectedOffer?.name,
      ...displayData,
    } as any);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        
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
        <Card className="p-4 bg-muted/30">
            <FormLabel className="text-base">Caps</FormLabel>
            <CardContent className="p-0 pt-4">
                <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="caps.maxOffers"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Max Offers Created</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 5000" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="caps.maxAccepted"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Max Offers Accepted</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 1000" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
            </CardContent>
        </Card>
        
        <Card className="p-4 bg-muted/30">
            <FormLabel className="text-base">Quotas</FormLabel>
            <CardContent className="p-0 pt-4 space-y-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                         <FormField
                            control={form.control}
                            name={`quotas.${index}.channel`}
                            render={({ field }) => (
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select Channel" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {channelOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`quotas.${index}.percentage`}
                            render={({ field }) => (
                                 <Input type="number" placeholder="e.g., 60" {...field} />
                            )}
                        />
                        <span className="text-muted-foreground">%</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ channel: '', percentage: 0 })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Quota
                </Button>
            </CardContent>
        </Card>

         <Card className="p-4 bg-muted/30">
            <FormLabel className="text-base">Pacing</FormLabel>
            <CardContent className="p-0 pt-4">
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="pacing.rate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Rate</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 60" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="pacing.unit"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Per</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="per_minute">Minute</SelectItem>
                            <SelectItem value="per_hour">Hour</SelectItem>
                            <SelectItem value="per_day">Day</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </CardContent>
        </Card>


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
