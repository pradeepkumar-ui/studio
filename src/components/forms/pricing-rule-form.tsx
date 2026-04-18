
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, ShieldAlert, Zap, Target, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';

// --- Zod Schema for exhaustive Pricing Rules ---
const pricingRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Rule name must be at least 5 characters.'),
  status: z.enum(['Active', 'Inactive', 'Test']),

  // --- Triggers ---
  trigger: z.object({
    type: z.enum(['Scheduled', 'OnDemand', 'CompetitorPriceChange']),
    source: z.string().optional(),
  }),

  // --- Target ---
  target: z.object({
    product: z.enum(['Air', 'Ancillary']).default('Air'),
    ancillaryId: z.string().optional(),
  }),

  // --- Conditions ---
  conditions: z.object({
    route: z.string().optional(),
    market: z.string().optional(),
    loadFactorOperator: z.enum(['>', '<']).optional(),
    loadFactorValue: z.coerce.number().optional(),
    departureOperator: z.enum(['>', '<']).optional(),
    departureValue: z.coerce.number().optional(), // in hours
    cohorts: z.array(z.string()).default([]),
    stockLevelOperator: z.enum(['>', '<']).optional(),
    stockLevelValue: z.coerce.number().optional(),
  }),
  
  // --- Action (Continuous Pricing) ---
  action: z.object({
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
    adjustment: z.coerce.number(),
    cabinClass: z.enum(['Economy', 'Premium Economy', 'Business', 'First', 'All']).optional(),
  }),

  // --- Guardrails ---
  guardrails: z.object({
    maxPriceAdjustment: z.coerce.number().optional(),
    minPriceAdjustment: z.coerce.number().optional(),
    velocityLimit: z.object({
        value: z.coerce.number().optional(),
        unit: z.enum(['per_minute', 'per_hour', 'per_day']).optional(),
    }).optional(),
  }),
  
  // --- Validity ---
  validity: z.object({
      effectiveDate: z.date().optional(),
      expiryDate: z.date().optional(),
  }).optional(),
});

export type PricingRule = {
  id: string;
  name: string;
  targetProduct: 'Air' | 'Ancillary';
  targetIdentifier?: string;
  conditions: string;
  adjustment: string;
  status: 'Active' | 'Inactive' | 'Test';
  source: 'Manual' | 'AI';
};

export type PricingRuleFormData = z.infer<typeof pricingRuleSchema>;

interface PricingRuleFormProps {
  rule: PricingRule | null;
  onSubmit: (data: PricingRule) => void;
  onCancel: () => void;
}

const cohortOptions = [
    { id: 'FrequentMobile_UAE', label: 'Frequent Mobile Users UAE' },
    { id: 'BusinessLoyal_IN', label: 'Business Travelers India' },
    { id: 'NewUsers', label: 'New Users' },
];

export function PricingRuleForm({ rule, onSubmit, onCancel }: PricingRuleFormProps) {
  const form = useForm<PricingRuleFormData>({
    resolver: zodResolver(pricingRuleSchema),
    defaultValues: {
      name: '',
      status: 'Test',
      trigger: { type: 'Scheduled' },
      target: { product: 'Air' },
      conditions: { cohorts: [] },
      action: { type: 'PERCENTAGE', adjustment: 0, cabinClass: 'All' },
      guardrails: { velocityLimit: { unit: 'per_hour' } },
      validity: {},
    },
  });

  const handleFormSubmit = (data: PricingRuleFormData) => {
    // Format for display in the table
    const formattedData: PricingRule = {
        id: data.id || `dp-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        targetProduct: data.target.product,
        targetIdentifier: data.target.product === 'Air' ? data.action.cabinClass : 'Ancillary Service',
        conditions: `${data.conditions.route || 'Global'} | ${data.conditions.loadFactorOperator || ''}${data.conditions.loadFactorValue || ''}% Load`,
        adjustment: `${data.action.adjustment >= 0 ? '+' : ''}${data.action.adjustment}${data.action.type === 'PERCENTAGE' ? '%' : '$'}`,
        status: data.status,
        source: 'Manual'
    };
    onSubmit(formattedData);
  }
  
  const triggerType = form.watch('trigger.type');
  const targetProduct = form.watch('target.product');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 max-h-[75vh] overflow-y-auto pr-4">
        
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Zap className="h-4 w-4" />
                Rule Identity & Status
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rule Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Weekend Surge - NYC/LAX" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Deployment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Test">A/B Testing (Sandboxed)</SelectItem>
                            <SelectItem value="Active">Active (Production)</SelectItem>
                            <SelectItem value="Inactive">Paused</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}/>
            </div>
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Target className="h-4 w-4" />
                Trigger & Scope
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="trigger.type" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Trigger Mechanism</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Scheduled">Scheduled (Temporal Window)</SelectItem>
                            <SelectItem value="OnDemand">On-Demand API Call</SelectItem>
                            <SelectItem value="CompetitorPriceChange">Competitor Signal</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="target.product" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Target Domain</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Air">Air (Continuous Pricing)</SelectItem>
                            <SelectItem value="Ancillary">Ancillaries (Dynamic Yield)</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}/>
            </div>
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Gauge className="h-4 w-4" />
                Pricing Logic (continuous Pricing)
            </div>
            <Card className="bg-muted/20 border-dashed">
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="action.type" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adjustment Mode</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                        <SelectItem value="FIXED_AMOUNT">Fixed Amount ($)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="action.adjustment" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adjustment Value</FormLabel>
                                <FormControl><Input type="number" placeholder="e.g. 5 or -2.5" {...field} /></FormControl>
                                <FormDescription>Negative values for discounts.</FormDescription>
                            </FormItem>
                        )}/>
                    </div>
                </CardContent>
            </Card>
        </section>

        <Separator />

        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <ShieldAlert className="h-4 w-4 text-destructive" />
                Commercial Guardrails
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="guardrails.minPriceAdjustment" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Max Floor Discount ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="Limit how much price can drop" {...field} /></FormControl>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="guardrails.maxPriceAdjustment" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Max Ceiling Markup ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="Limit how much price can rise" {...field} /></FormControl>
                    </FormItem>
                )}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="guardrails.velocityLimit.value" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Velocity Limit (Max Updates)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g. 10" {...field} /></FormControl>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="guardrails.velocityLimit.unit" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Per Interval</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="per_minute">Per Minute</SelectItem>
                                <SelectItem value="per_hour">Per Hour</SelectItem>
                                <SelectItem value="per_day">Per Day</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}/>
            </div>
        </section>

        <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-background py-4 border-t z-10">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="px-8">Save Pricing Policy</Button>
        </div>
      </form>
    </Form>
  );
}
