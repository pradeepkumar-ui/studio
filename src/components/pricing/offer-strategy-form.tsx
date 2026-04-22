'use client';

import * as React from 'react';
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
  FormDescription,
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
import { MultiSelect } from '@/components/ui/multi-select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Tag, 
  Package, 
  Target, 
  Zap, 
  ShieldCheck, 
  Calculator, 
  Clock, 
  Boxes,
  ArrowRight,
  Info,
  PlusCircle
} from 'lucide-react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const offerStrategySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Offer name is required.'),
  type: z.enum(['Single', 'Bundle']).default('Single'),
  ancillaryIds: z.array(z.string()).min(1, 'Select at least one product.'),
  status: z.enum(['Draft', 'Active', 'Inactive']).default('Draft'),
  validity: z.object({
    from: z.string().min(1, 'Start date required.'),
    to: z.string().min(1, 'End date required.'),
  }),
  cohortIds: z.array(z.string()).default([]),
  pricing: z.object({
    type: z.enum(['PercentageDiscount', 'FixedDiscount', 'FixedPrice']).default('PercentageDiscount'),
    value: z.coerce.number().min(0),
    currency: z.string().default('USD'),
  }),
  dynamicPricing: z.object({
    enabled: z.boolean().default(false),
    ruleType: z.enum(['TimeBased', 'InventoryBased']).default('TimeBased'),
    threshold: z.string().optional(),
    adjustmentPercent: z.coerce.number().default(0),
  }),
  guardRails: z.object({
    minPrice: z.coerce.number().min(0),
    maxPrice: z.coerce.number().min(0),
  }),
});

export type OfferStrategy = z.infer<typeof offerStrategySchema>;

interface OfferStrategyFormProps {
  offer: OfferStrategy | null;
  onSubmit: (data: OfferStrategy) => void;
  onCancel: () => void;
}

const mockAncillariesFallback = [
    { id: 'AGG-001', configName: 'Premium Route Baggage', ancillaryName: '1st Checked Bag', basePrice: 35.00 },
    { id: 'AGG-002', configName: 'Long-Haul Seat', ancillaryName: 'Extra Legroom Seat', basePrice: 50.00 },
    { id: 'AGG-003', configName: 'Hub Lounge LHR', ancillaryName: 'Executive Lounge', basePrice: 45.00 },
];

export function OfferStrategyForm({ offer, onSubmit, onCancel }: OfferStrategyFormProps) {
  const firestore = useFirestore();
  
  const aggregatesQuery = React.useMemo(() => 
    firestore ? query(collection(firestore, 'airlineAncillaryAggregates'), orderBy('createdAt', 'desc')) : undefined
  , [firestore]);
  
  const cohortsQuery = React.useMemo(() => 
    firestore ? query(collection(firestore, 'cohorts'), orderBy('createdAt', 'desc')) : undefined
  , [firestore]);

  const { data: aggregatesData } = useCollection(aggregatesQuery);
  const { data: cohortsData } = useCollection(cohortsQuery);

  const aggregates = (aggregatesData && aggregatesData.length > 0) ? aggregatesData : mockAncillariesFallback;
  const cohorts = cohortsData || [];

  const form = useForm<OfferStrategy>({
    resolver: zodResolver(offerStrategySchema),
    defaultValues: offer || {
      name: '',
      type: 'Single',
      ancillaryIds: [],
      status: 'Draft',
      validity: { from: new Date().toISOString().split('T')[0], to: '' },
      cohortIds: [],
      pricing: { type: 'PercentageDiscount', value: 10, currency: 'USD' },
      dynamicPricing: { enabled: false, ruleType: 'TimeBased', threshold: 'T-7 Days', adjustmentPercent: 10 },
      guardRails: { minPrice: 0, maxPrice: 1000 },
    },
  });

  const watchType = form.watch('type');
  const watchAncillaryIds = form.watch('ancillaryIds');
  const watchPricing = form.watch('pricing');
  const watchDynamic = form.watch('dynamicPricing');
  const watchGuardRails = form.watch('guardRails');

  const calculation = React.useMemo(() => {
    const selected = aggregates.filter((a: any) => watchAncillaryIds.includes(a.id));
    const baseTotal = selected.reduce((sum, item) => sum + (Number(item.basePrice) || 0), 0);
    
    let offerAdjusted = baseTotal;
    if (watchPricing.type === 'PercentageDiscount') {
        offerAdjusted = baseTotal * (1 - watchPricing.value / 100);
    } else if (watchPricing.type === 'FixedDiscount') {
        offerAdjusted = Math.max(0, baseTotal - watchPricing.value);
    } else if (watchPricing.type === 'FixedPrice') {
        offerAdjusted = watchPricing.value;
    }

    let finalCalculated = offerAdjusted;
    if (watchDynamic.enabled) {
        finalCalculated = offerAdjusted * (1 + watchDynamic.adjustmentPercent / 100);
    }

    const cappedPrice = Math.min(Math.max(finalCalculated, watchGuardRails.minPrice), watchGuardRails.maxPrice);
    const wasCapped = cappedPrice !== finalCalculated;

    return {
        baseTotal,
        offerAdjusted,
        finalCalculated,
        cappedPrice,
        wasCapped
    };
  }, [watchAncillaryIds, watchPricing, watchDynamic, watchGuardRails, aggregates]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-[90vh]">
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
          
          <div className="flex items-center justify-between mb-4">
              <div>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-primary flex items-center gap-2">
                        {offer ? <Zap className="h-6 w-6" /> : <PlusCircle className="h-6 w-6" />}
                        {offer ? 'Edit Strategy' : 'New Retailing Strategy'}
                    </DialogTitle>
                    <DialogDescription>Define commercial logic, target cohorts, and dynamic pricing adjustments.</DialogDescription>
                  </DialogHeader>
              </div>
              <Badge variant={form.watch('status') === 'Active' ? 'default' : 'secondary'} className="h-7 px-4 font-black uppercase">
                  {form.watch('status')}
              </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              
              <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                      <Tag className="h-3.5 w-3.5" /> 1. Offer Identity & Scope
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Offer Display Name*</FormLabel>
                            <FormControl><Input placeholder="e.g., Summer Early Bird" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="type" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Strategy Type</FormLabel>
                            <Select onValueChange={(v) => {
                                field.onChange(v);
                                form.setValue('ancillaryIds', []);
                            }} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Single">Single Ancillary Offer</SelectItem>
                                    <SelectItem value="Bundle">Multi-Product Bundle</SelectItem>
                                </SelectContent>
                            </Select>
                          </FormItem>
                      )} />
                  </div>
                  <FormField control={form.control} name="ancillaryIds" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Linked Products (from Aggregate Registry)*</FormLabel>
                          <FormControl>
                              <MultiSelect 
                                options={aggregates.map((a: any) => ({ value: a.id, label: `${a.configName} ($${a.basePrice})` }))}
                                selected={field.value}
                                onChange={(v) => field.onChange(watchType === 'Single' ? v.slice(-1) : v)}
                                placeholder="Select SKUs..."
                              />
                          </FormControl>
                          <FormDescription>Pricing pulls base values directly from aggregate configurations.</FormDescription>
                          <FormMessage />
                      </FormItem>
                  )} />
              </section>

              <Separator />

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                          <Calculator className="h-3.5 w-3.5" /> 2. Pricing Layer
                      </div>
                      <FormField control={form.control} name="pricing.type" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adjustment Mode</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="PercentageDiscount">Percentage Discount (%)</SelectItem>
                                    <SelectItem value="FixedDiscount">Fixed Discount ($)</SelectItem>
                                    <SelectItem value="FixedPrice">Override: Fixed Price</SelectItem>
                                </SelectContent>
                            </Select>
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="pricing.value" render={({ field }) => (
                          <FormItem><FormLabel>Adjustment Value</FormLabel><FormControl><Input type="number" {...field} className="font-bold text-primary" /></FormControl></FormItem>
                      )} />
                  </div>
                  <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                          <Target className="h-3.5 w-3.5" /> 3. Cohort Targeting
                      </div>
                      <FormField control={form.control} name="cohortIds" render={({ field }) => (
                          <FormItem>
                              <FormLabel>Active Cohorts</FormLabel>
                              <FormControl>
                                  <MultiSelect 
                                    options={cohorts.map((c: any) => ({ value: c.cohortId || c.id, label: c.name }))}
                                    selected={field.value}
                                    onChange={field.onChange}
                                    placeholder="Global (Default)"
                                  />
                              </FormControl>
                              <FormDescription>Leave empty for global network availability.</FormDescription>
                          </FormItem>
                      )} />
                  </div>
              </section>

              <Separator />

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 p-4 border rounded-xl bg-amber-50/30">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-600 font-bold uppercase text-[10px] tracking-widest">
                              <Zap className="h-3.5 w-3.5" /> 4. Dynamic Flex
                          </div>
                          <FormField control={form.control} name="dynamicPricing.enabled" render={({ field }) => (
                              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          )} />
                      </div>
                      <div className={cn("space-y-3", !watchDynamic.enabled && "opacity-30 pointer-events-none")}>
                        <FormField control={form.control} name="dynamicPricing.ruleType" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Driver</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      <SelectItem value="TimeBased">Time to Departure (T-minus)</SelectItem>
                                      <SelectItem value="InventoryBased">Inventory Threshold</SelectItem>
                                  </SelectContent>
                              </Select>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="dynamicPricing.threshold" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Threshold (Condition)</FormLabel><FormControl><Input placeholder="e.g., < 48 Hours" className="h-8 text-xs" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="dynamicPricing.adjustmentPercent" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Flex Delta (%)</FormLabel><FormControl><Input type="number" className="h-8 text-xs" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                  </div>
                  <div className="space-y-4 p-4 border rounded-xl bg-emerald-50/30">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase text-[10px] tracking-widest">
                          <ShieldCheck className="h-3.5 w-3.5" /> 5. Commercial Guardrails
                      </div>
                      <FormField control={form.control} name="guardRails.minPrice" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs">Absolute Floor Price ($)</FormLabel><FormControl><Input type="number" className="h-8 text-xs" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="guardRails.maxPrice" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs">Absolute Ceiling Price ($)</FormLabel><FormControl><Input type="number" className="h-8 text-xs" {...field} /></FormControl></FormItem>
                      )} />
                      <p className="text-[9px] text-muted-foreground italic">Enforced at runtime before publishing.</p>
                  </div>
              </section>
            </div>

            <div className="lg:col-span-4">
                <Card className="sticky top-0 bg-slate-900 text-white border-none shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white/10 pb-4">
                        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-emerald-400" /> Real-Time Strategy Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-bold tracking-tighter">
                                <span>Base Aggregate Sum</span>
                                <span className="font-mono text-slate-200">${calculation.baseTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-bold tracking-tighter">
                                <span>Offer Adjusted</span>
                                <div className="text-right">
                                    <div className="font-mono text-emerald-400">-${(calculation.baseTotal - calculation.offerAdjusted).toFixed(2)}</div>
                                    <div className="text-[10px] text-slate-500">({watchPricing.type})</div>
                                </div>
                            </div>
                            {watchDynamic.enabled && (
                                <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-bold tracking-tighter">
                                    <span>Dynamic Flex ({watchDynamic.adjustmentPercent}%)</span>
                                    <span className="font-mono text-amber-400">+${(calculation.finalCalculated - calculation.offerAdjusted).toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                        
                        <Separator className="bg-white/10" />
                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Final Sellable Price</span>
                                <div className="text-right">
                                    <div className={cn("text-4xl font-black font-mono tracking-tighter", calculation.wasCapped ? "text-amber-500" : "text-white")}>
                                        ${calculation.cappedPrice.toFixed(2)}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">per {watchType.toLowerCase()}</div>
                                </div>
                            </div>
                            {calculation.wasCapped && (
                                <div className="flex items-center gap-2 p-2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
                                    <ShieldCheck className="h-3 w-3" /> Guardrail Enforcement Active
                                </div>
                            )}
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 space-y-3">
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                                <Info className="h-3 w-3" /> Runtime Context
                             </div>
                             <div className="space-y-1">
                                <p className="text-[10px] text-slate-300">Valid: {form.watch('validity.from')} → {form.watch('validity.to') || 'Open'}</p>
                                <p className="text-[10px] text-slate-300">Segments: {form.watch('cohortIds').length || 'Global'}</p>
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-white flex justify-between items-center">
            <div className="flex items-center gap-4">
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormLabel className="text-xs font-black uppercase text-muted-foreground">Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Paused</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />
            </div>
            <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onCancel} className="font-bold">Discard</Button>
                <Button type="submit" className="font-black px-10 shadow-indigo-200 shadow-xl">
                    <Zap className="mr-2 h-4 w-4 fill-current" />
                    Commit Strategy
                </Button>
            </div>
        </div>
      </form>
    </Form>
  );
}
