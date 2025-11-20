
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
import { Checkbox } from '@/components/ui/checkbox';


// --- Zod Schema for the new detailed form ---
const pricingRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Rule name must be at least 5 characters.'),
  status: z.enum(['Active', 'Inactive', 'Test']),

  // --- Triggers ---
  trigger: z.object({
    type: z.enum(['Scheduled', 'OnDemand', 'CompetitorPriceChange']),
    source: z.string().optional(),
  }),

  // --- Conditions ---
  conditions: z.object({
    // Existing
    route: z.string().optional(),
    market: z.string().optional(),
    loadFactorOperator: z.enum(['>', '<']).optional(),
    loadFactorValue: z.coerce.number().optional(),
    departureOperator: z.enum(['>', '<']).optional(),
    departureValue: z.coerce.number().optional(), // in hours
    // New
    cohorts: z.array(z.string()).default([]),
    includedAncillaries: z.array(z.string()).default([]),
  }),
  
  // --- Action ---
  action: z.object({
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
    adjustment: z.coerce.number(),
    cabinClass: z.enum(['Economy', 'Premium Economy', 'Business', 'First', 'All']),
  }),

  // --- Guardrails ---
  guardrails: z.object({
    maxPriceAdjustment: z.coerce.number().optional(),
    minPriceAdjustment: z.coerce.number().optional(),
    velocityLimit: z.string().optional(), // e.g., "5 times per hour"
  }),
});


// The data structure for the page state needs to be updated.
// We'll keep a string representation for display purposes in the table.
export type PricingRule = {
  id: string;
  name: string;
  conditions: string;
  action: string;
  status: 'Active' | 'Inactive' | 'Test';
};

// Form data type from schema
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

const ancillaryOptions = [
    { id: 'anc_bag_1', label: '1st Checked Bag' },
    { id: 'anc_lounge_1', label: 'Lounge Access' },
    { id: 'anc_wifi_1', label: 'In-flight Wi-Fi' },
];

// Dummy function to parse string from table into form data
const parseRuleForForm = (rule: PricingRule | null): PricingRuleFormData | undefined => {
    if (!rule) return undefined;
    // This is a simplified parser. A real implementation would be more complex.
    return {
        id: rule.id,
        name: rule.name,
        status: rule.status,
        trigger: { type: 'Scheduled' }, // Default
        conditions: {
            route: rule.conditions.includes('Route:') ? rule.conditions.split('Route: ')[1]?.split(',')[0].trim() : undefined,
            market: rule.conditions.includes('Market:') ? rule.conditions.split('Market: ')[1]?.split(',')[0].trim() : undefined,
            loadFactorOperator: rule.conditions.includes('Load Factor >') ? '>' : (rule.conditions.includes('Load Factor <') ? '<' : undefined),
            loadFactorValue: rule.conditions.includes('Load Factor') ? parseInt(rule.conditions.split('Load Factor ')[1]?.split(' ')[1]) : undefined,
            departureOperator: rule.conditions.includes('Departure >') ? '>' : (rule.conditions.includes('Departure <') ? '<' : undefined),
            departureValue: rule.conditions.includes('Departure') ? parseInt(rule.conditions.split('Departure ')[1]?.split(' ')[1]) : undefined,
            cohorts: [],
            includedAncillaries: [],
        },
        action: {
            type: rule.action.includes('%') ? 'PERCENTAGE' : 'FIXED_AMOUNT',
            adjustment: parseInt(rule.action.match(/-?\\+?(\\d+)/)?.[0] || '0'),
            cabinClass: rule.action.includes('Economy') ? 'Economy' : (rule.action.includes('Business') ? 'Business' : 'All'),
        },
        guardrails: {},
    };
}

// Function to format form data back into a display string for the table
const formatRuleForSubmit = (data: PricingRuleFormData): PricingRule => {
    const conditionsParts: string[] = [];
    if (data.conditions.route) conditionsParts.push(`Route: ${data.conditions.route}`);
    if (data.conditions.market) conditionsParts.push(`Market: ${data.conditions.market}`);
    if (data.conditions.loadFactorOperator && data.conditions.loadFactorValue) {
        conditionsParts.push(`Load Factor ${data.conditions.loadFactorOperator} ${data.conditions.loadFactorValue}%`);
    }
    if (data.conditions.departureOperator && data.conditions.departureValue) {
        conditionsParts.push(`Departure ${data.conditions.departureOperator} ${data.conditions.departureValue}h`);
    }
     if (data.conditions.cohorts && data.conditions.cohorts.length > 0) {
        conditionsParts.push(`Cohorts: ${data.conditions.cohorts.length}`);
    }
    if (data.conditions.includedAncillaries && data.conditions.includedAncillaries.length > 0) {
        conditionsParts.push(`Ancillaries: ${data.conditions.includedAncillaries.length}`);
    }


    const actionSign = data.action.adjustment >= 0 ? '+' : '';
    const actionValue = data.action.type === 'PERCENTAGE' ? `${data.action.adjustment}%` : `$${data.action.adjustment}`;
    const actionString = `${actionSign}${actionValue} on ${data.action.cabinClass}`;

    return {
        id: data.id || `dp-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        conditions: conditionsParts.join(', ') || 'N/A',
        action: actionString,
        status: data.status,
    };
}


export function PricingRuleForm({ rule, onSubmit, onCancel }: PricingRuleFormProps) {
  const form = useForm<PricingRuleFormData>({
    resolver: zodResolver(pricingRuleSchema),
    defaultValues: parseRuleForForm(rule) || {
      name: '',
      status: 'Test',
      trigger: { type: 'Scheduled', source: '' },
      conditions: { cohorts: [], includedAncillaries: [] },
      action: { type: 'PERCENTAGE', adjustment: 10, cabinClass: 'All' },
      guardrails: {},
    },
  });

  const handleFormSubmit = (data: PricingRuleFormData) => {
    const formattedData = formatRuleForSubmit(data);
    onSubmit(formattedData);
  }
  
  const triggerType = form.watch('trigger.type');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rule Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Weekend Surge - NYC/LAX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        <h4 className="text-md font-semibold">Triggers</h4>
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="trigger.type"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Trigger Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Trigger" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="OnDemand">On-Demand</SelectItem>
                            <SelectItem value="CompetitorPriceChange">Competitor Price Change</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            {triggerType === 'CompetitorPriceChange' && (
                 <FormField
                    control={form.control}
                    name="trigger.source"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Competitor Source</FormLabel>
                            <FormControl><Input placeholder="e.g., Competitor API" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>


        <Separator />
        <h4 className="text-md font-semibold">Conditions</h4>
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="conditions.route" render={({ field }) => (<FormItem><FormLabel>Route (Optional)</FormLabel><FormControl><Input placeholder="e.g., LHR-JFK" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="conditions.market" render={({ field }) => (<FormItem><FormLabel>Market (Optional)</FormLabel><FormControl><Input placeholder="e.g., US-DOM" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="conditions.loadFactorOperator" render={({ field }) => (<FormItem><FormLabel>Load Factor</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Operator" /></SelectTrigger></FormControl><SelectContent><SelectItem value=">">Greater than (&gt;)</SelectItem><SelectItem value="<">Less than (&lt;)</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="conditions.loadFactorValue" render={({ field }) => (<FormItem><FormLabel>Load Factor Value (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 80" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <FormField
            control={form.control}
            name="conditions.cohorts"
            render={() => (
                <FormItem>
                    <div className="mb-2"><FormLabel>Target Cohorts</FormLabel></div>
                     <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {cohortOptions.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name="conditions.cohorts"
                            render={({ field }) => (<FormItem key={item.id} className="flex flex-row items-start space-x-2 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))}} /></FormControl><FormLabel className="font-normal">{item.label}</FormLabel></FormItem>)}
                        />
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="conditions.includedAncillaries"
            render={() => (
                <FormItem>
                    <div className="mb-2"><FormLabel>Ancillary Conditions</FormLabel></div>
                     <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {ancillaryOptions.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name="conditions.includedAncillaries"
                            render={({ field }) => (<FormItem key={item.id} className="flex flex-row items-start space-x-2 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))}} /></FormControl><FormLabel className="font-normal">{item.label}</FormLabel></FormItem>)}
                        />
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />


        <Separator />
        <h4 className="text-md font-semibold">Action</h4>
        <div className="grid grid-cols-2 gap-4">
             <FormField control={form.control} name="action.type" render={({ field }) => (<FormItem><FormLabel>Adjustment Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="PERCENTAGE">Percentage (%)</SelectItem><SelectItem value="FIXED_AMOUNT">Fixed Amount ($)</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="action.adjustment" render={({ field }) => (<FormItem><FormLabel>Adjustment Value</FormLabel><FormControl><Input type="number" placeholder="e.g., 10 or -15" {...field} /></FormControl><FormMessage /></FormItem>)}/>
        </div>
         <FormField control={form.control} name="action.cabinClass" render={({ field }) => (<FormItem><FormLabel>On Cabin Class</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Cabin" /></SelectTrigger></FormControl><SelectContent><SelectItem value="All">All Classes</SelectItem><SelectItem value="Economy">Economy</SelectItem><SelectItem value="Premium Economy">Premium Economy</SelectItem><SelectItem value="Business">Business</SelectItem><SelectItem value="First">First</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />

        <Separator />
        <h4 className="text-md font-semibold">Guardrails</h4>
         <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="guardrails.minPriceAdjustment" render={({ field }) => (<FormItem><FormLabel>Min Price Adjustment ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., -50" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="guardrails.maxPriceAdjustment" render={({ field }) => (<FormItem><FormLabel>Max Price Adjustment ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 100" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <FormField control={form.control} name="guardrails.velocityLimit" render={({ field }) => (<FormItem><FormLabel>Velocity Limit</FormLabel><FormControl><Input placeholder="e.g., 5 times per hour" {...field} /></FormControl><FormMessage /></FormItem>)} />


        <Separator />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="Test">Test</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{rule ? 'Save Changes' : 'Create Rule'}</Button>
        </div>
      </form>
    </Form>
  );
}
