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
  PlusCircle,
  Eye,
  Calendar as CalendarIcon,
  Ticket,
  DollarSign,
  Layers,
  Building2
} from 'lucide-react';
import { 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  Dialog,
  DialogContent,
  DialogFooter
} from '@/components/ui/dialog';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const airportOfferStrategySchema = z.object({
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
    ruleType: z.enum(['TimeBased', 'CapacityBased']).default('TimeBased'),
    threshold: z.string().optional(),
    adjustmentPercent: z.coerce.number().default(0),
  }),
  guardRails: z.object({
    minPrice: z.coerce.number().min(0),
    maxPrice: z.coerce.number().min(0),
  }),
});

export type AirportOfferStrategy = z.infer<typeof airportOfferStrategySchema>;

interface AirportOfferStrategyFormProps {
  offer: AirportOfferStrategy | null;
  onSubmit: (data: AirportOfferStrategy) => void;
  onCancel: () => void;
}

const mockAirportAncillariesFallback = [
    { id: 'HUB-AGG-001', configName: 'LHR T5 Lounge Logic', ancillaryName: 'Executive Lounge Access', basePrice: 45.00, currency: 'INR' },
    { id: 'HUB-AGG-002', configName: 'JFK Fast Track Pacing', ancillaryName: 'Fast Track Security', basePrice: 15.00, currency: 'INR' },
    { id: 'HUB-AGG-003', configName: 'SIN Valet Hub SKU', ancillaryName: 'VIP Valet Parking', basePrice: 20.00, currency: 'INR' },
    { id: 'HUB-AGG-004', configName: 'LHR Priority Boarding', ancillaryName: 'Priority Boarding Hub', basePrice: 10.00, currency: 'INR' },
    { id: 'HUB-AGG-005', configName: 'DXB Sleeping Pod Logic', ancillaryName: 'Sleeping Pod (6h)', basePrice: 60.00, currency: 'INR' },
    { id: 'HUB-AGG-006', configName: 'FRA Chauffeur Service', ancillaryName: 'Airport Chauffeur', basePrice: 85.00, currency: 'INR' },
    { id: 'HUB-AGG-007', configName: 'SIN Transit Comfort', ancillaryName: 'Amenity Kit Hub', basePrice: 15.00, currency: 'INR' },
];

const mockAirportCohortsFallback = [
    { id: 'AC-001', cohortId: 'BOM_BIZ_WAIT', name: 'BOM High-Wait Business' },
    { id: 'AC-002', cohortId: 'DEL_FAM_TRANSIT', name: 'DEL Transit Family' },
    { id: 'AC-003', cohortId: 'DEL_ELITE_ARRIVE', name: 'DEL Elite Arrivals' },
    { id: 'AC-004', cohortId: 'TRANSIT_LONG_HAUL', name: 'Global Long-Haul Transit' }
];
export function AirportOfferStrategyForm({ offer, onSubmit, onCancel }: AirportOfferStrategyFormProps) {
  const firestore = useFirestore();
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  
  const aggregatesQuery = React.useMemo(() => 
    firestore ? query(collection(firestore, 'airportAncillaryAggregates'), orderBy('createdAt', 'desc')) : undefined
  , [firestore]);
  
  const cohortsQuery = React.useMemo(() => 
    firestore ? query(collection(firestore, 'airportCohorts'), orderBy('createdAt', 'desc')) : undefined
  , [firestore]);

  const { data: aggregatesData } = useCollection(aggregatesQuery);
  const { data: cohortsData } = useCollection(cohortsQuery);

  const aggregates = (aggregatesData && aggregatesData.length > 0) ? aggregatesData : mockAirportAncillariesFallback;
  const cohorts = (cohortsData && cohortsData.length > 0) ? cohortsData : mockAirportCohortsFallback;

  const form = useForm<AirportOfferStrategy>({
    resolver: zodResolver(airportOfferStrategySchema),
    defaultValues: offer || {
      name: '',
      type: 'Single',
      ancillaryIds: [],
      status: 'Draft',
      validity: { from: new Date().toISOString().split('T')[0], to: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] },
      cohortIds: [],
      pricing: { type: 'PercentageDiscount', value: 10, currency: 'INR' },
      dynamicPricing: { enabled: false, ruleType: 'TimeBased', threshold: 'Peak Hour', adjustmentPercent: 10 },
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
        wasCapped,
        selectedProducts: selected
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
                        {offer ? <Building2 className="h-6 w-6" /> : <PlusCircle className="h-6 w-6" />}
                        {offer ? 'Edit Hub Strategy' : 'New Hub Retailing Strategy'}
                    </DialogTitle>
                    <DialogDescription>Define hub-specific bundles, target cohorts, and dynamic pricing adjustments.</DialogDescription>
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
                      <Tag className="h-3.5 w-3.5" /> 1. Hub Offer Identity & Products
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hub Offer Name*</FormLabel>
                            <FormControl><Input placeholder="e.g., LHR T5 Transit Pack" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="type" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Strategy Structure</FormLabel>
                            <Select onValueChange={(v) => {
                                field.onChange(v);
                                form.setValue('ancillaryIds', []);
                            }} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Single">Single Hub SKU</SelectItem>
                                    <SelectItem value="Bundle">Multi-Service Bundle</SelectItem>
                                </SelectContent>
                            </Select>
                          </FormItem>
                      )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="validity.from" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Active From*</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="validity.to" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Active To*</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="ancillaryIds" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Hub Product Linkage (from Airport Aggregates)*</FormLabel>
                          <FormControl>
                              <MultiSelect 
                                options={aggregates.map((a: any) => ({ 
                                    value: a.id, 
                                    label: `${a.configName} (${new Intl.NumberFormat('en-US', { style: 'currency', currency: a.currency || 'INR' }).format(a.basePrice || 0)})` 
                                }))}
                                selected={field.value}
                                onChange={(v) => field.onChange(watchType === 'Single' ? v.slice(-1) : v)}
                                placeholder="Search Hub Aggregate SKUs..."
                              />
                          </FormControl>
                          <FormDescription>Links to the authoritative hub aggregate registry for base pricing.</FormDescription>
                          <FormMessage />
                      </FormItem>
                  )} />

                  {calculation.selectedProducts.length > 0 && (
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                              {/* <DollarSign className="h-3 w-3" />  */}₹
                              Registry Base Values (Read-Only)
                          </p>
                          <div className="space-y-2">
                              {calculation.selectedProducts.map((p: any) => (
                                  <div key={p.id} className="flex justify-between items-center text-sm">
                                      <span className="text-muted-foreground font-medium">{p.ancillaryName || p.configName}</span>
                                      <span className="font-mono font-bold">${p.basePrice?.toFixed(2)}</span>
                                  </div>
                              ))}
                              <Separator className="my-2" />
                              <div className="flex justify-between items-center text-sm font-black">
                                  <span>Total Registry Starting Sum</span>
                                  <span className="text-primary">${calculation.baseTotal.toFixed(2)}</span>
                              </div>
                          </div>
                      </div>
                  )}
              </section>

              <Separator />

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                          <Calculator className="h-3.5 w-3.5" /> 2. Pricing Architecture
                      </div>
                      <FormField control={form.control} name="pricing.type" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adjustment Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="PercentageDiscount">Bundle Discount (%)</SelectItem>
                                    <SelectItem value="FixedDiscount">Fixed Discount ($)</SelectItem>
                                    <SelectItem value="FixedPrice">Specific Bundle Price</SelectItem>
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
                          <Target className="h-3.5 w-3.5" /> 3. Hub Segment Mapping
                      </div>
                      <FormField control={form.control} name="cohortIds" render={({ field }) => (
                          <FormItem>
                              <FormLabel>Target Hub Cohorts</FormLabel>
                              <FormControl>
                                  <MultiSelect 
                                    options={cohorts.map((c: any) => ({ value: c.cohortId || c.id, label: c.name }))}
                                    selected={field.value}
                                    onChange={field.onChange}
                                    placeholder="Search Airport Cohorts..."
                                  />
                              </FormControl>
                              <FormDescription>Offer is filtered by terminal-side passenger signals.</FormDescription>
                          </FormItem>
                      )} />
                  </div>
              </section>

              <Separator />

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 p-4 border rounded-xl bg-amber-50/30">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-600 font-bold uppercase text-[10px] tracking-widest">
                              <Zap className="h-3.5 w-3.5" /> 4. Hub Dynamic Pricing
                          </div>
                          <FormField control={form.control} name="dynamicPricing.enabled" render={({ field }) => (
                              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          )} />
                      </div>
                      <div className={cn("space-y-3", !watchDynamic.enabled && "opacity-30 pointer-events-none")}>
                        <FormField control={form.control} name="dynamicPricing.ruleType" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Driver Signal</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      <SelectItem value="TimeBased">Peak/Temporal Window</SelectItem>
                                      <SelectItem value="CapacityBased">Real-Time Hub Capacity</SelectItem>
                                  </SelectContent>
                              </Select>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="dynamicPricing.threshold" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Trigger (Threshold/Time)</FormLabel><FormControl><Input placeholder="e.g., < 10% Availability" className="h-8 text-xs" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="dynamicPricing.adjustmentPercent" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Dynamic Flex (%)</FormLabel><FormControl><Input type="number" className="h-8 text-xs" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                  </div>
                  <div className="space-y-4 p-4 border rounded-xl bg-emerald-50/30">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase text-[10px] tracking-widest">
                          <ShieldCheck className="h-3.5 w-3.5" /> 5. Commercial Integrity
                      </div>
                      <FormField control={form.control} name="guardRails.minPrice" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs">Absolute Floor ($)</FormLabel><FormControl><Input type="number" className="h-8 text-xs" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="guardRails.maxPrice" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs">Absolute Ceiling ($)</FormLabel><FormControl><Input type="number" className="h-8 text-xs" {...field} /></FormControl></FormItem>
                      )} />
                      <p className="text-[9px] text-muted-foreground italic">Enforced at hub checkout to protect ecosystem margins.</p>
                  </div>
              </section>
            </div>

            <div className="lg:col-span-4">
                <Card className="sticky top-0 bg-slate-900 text-white border-none shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white/10 pb-4">
                        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-emerald-400" /> Hub Strategy Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-bold tracking-tighter">
                                <span>Hub Base Sum</span>
                                <span className="font-mono text-slate-200">${calculation.baseTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-bold tracking-tighter">
                                <span>Promo Adjustment</span>
                                <div className="text-right">
                                    <div className="font-mono text-emerald-400">-${(calculation.baseTotal - calculation.offerAdjusted).toFixed(2)}</div>
                                </div>
                            </div>
                            {watchDynamic.enabled && (
                                <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-bold tracking-tighter">
                                    <span>Hub Flex ({watchDynamic.adjustmentPercent}%)</span>
                                    <span className="font-mono text-amber-400">+${(calculation.finalCalculated - calculation.offerAdjusted).toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                        
                        <Separator className="bg-white/10" />
                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Final Sellable Hub Price</span>
                                <div className="text-right">
                                    <div className={cn("text-4xl font-black font-mono tracking-tighter", calculation.wasCapped ? "text-amber-500" : "text-white")}>
                                        ${calculation.cappedPrice.toFixed(2)}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">per unit</div>
                                </div>
                            </div>
                            {calculation.wasCapped && (
                                <div className="flex items-center gap-2 p-2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
                                    <ShieldCheck className="h-3 w-3" /> Integrity Cap Applied
                                </div>
                            )}
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 space-y-3 border border-white/10">
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                                <Info className="h-3 w-3" /> Runtime Scope
                             </div>
                             <div className="space-y-1">
                                <p className="text-[10px] text-slate-300">Validity: {form.watch('validity.from')} - {form.watch('validity.to')}</p>
                                <p className="text-[10px] text-slate-300">Hub Segments: {form.watch('cohortIds').length || 'Global'}</p>
                             </div>
                        </div>

                        <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white font-black uppercase text-xs h-12 tracking-widest"
                            onClick={() => setIsPreviewOpen(true)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Generate Hub Summary
                        </Button>
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
                    Commit Hub Strategy
                </Button>
            </div>
        </div>

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-black">
                        <Building2 className="h-5 w-5 text-primary" />
                        Airport Offer Preview
                    </DialogTitle>
                    <DialogDescription>Simulated view of the final retailing package at the terminal node.</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-black text-primary uppercase">{form.getValues('name')}</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{form.getValues('type')} Hub Offer</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-primary font-mono">${calculation.cappedPrice.toFixed(2)}</p>
                                <Badge variant="outline" className="text-[9px] font-bold uppercase">Dynamic Final Price</Badge>
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hub Services Included</p>
                            <div className="grid grid-cols-1 gap-2">
                                {calculation.selectedProducts.map((p: any) => (
                                    <div key={p.id} className="flex items-center gap-2 p-2 rounded-xl bg-white border shadow-sm">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Building2 className="h-4 w-4" /></div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold">{p.ancillaryName}</p>
                                            <p className="text-[9px] text-muted-foreground uppercase font-mono">{p.configName}</p>
                                        </div>
                                        <Badge variant="outline" className="text-[9px] font-mono">${p.basePrice?.toFixed(2)}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hub Targeting</p>
                            <div className="flex flex-wrap gap-1">
                                {form.getValues('cohortIds').length > 0 ? form.getValues('cohortIds').map(cid => (
                                    <Badge key={cid} variant="secondary" className="text-[9px] font-mono bg-emerald-50 text-emerald-700">{cid}</Badge>
                                )) : <Badge variant="outline" className="text-[9px]">Global Node Reach</Badge>}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hub Availability</p>
                            <p className="text-xs font-bold font-mono">{form.getValues('validity.from')} → {form.getValues('validity.to')}</p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsPreviewOpen(false)} className="w-full font-black uppercase">Close Preview</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
