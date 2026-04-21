'use client';

import * as React from 'react';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Eye, Package, Check, Calendar as CalendarIcon, Target, DollarSign, Percent, ShieldCheck, TrendingUp, Laptop, Clock } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { Slider } from '@/components/ui/slider';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

const bundleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Offer name is required.'),
  description: z.string().min(5, 'Description is required.'),
  category: z.enum(['Normal', 'Disruption', 'Promotional']).default('Normal'),
  status: z.enum(['Draft', 'Published', 'Archived']),
  priorityLevel: z.coerce.number().min(1).max(100).default(50),
  validity: z.object({
    from: z.date(),
    to: z.date(),
  }),
  scope: z.object({
    brand: z.array(z.string()).default([]),
    channel: z.array(z.string()).default([]),
    cohorts: z.array(z.string()).default([]),
    market: z.array(z.string()).default([]),
  }),
  components: z.array(z.object({ value: z.string().min(1, "Select service") })).min(1, "Select at least one component"),
  
  // Exhaustive Pricing Strategy
  pricingStrategy: z.enum(['Percent Discount', 'Fixed Discount', 'Absolute Price']),
  discount: z.coerce.number().min(0),
  currency: z.string().default('USD'),
  
  // Advanced Commercial Rules
  channelMarkups: z.array(z.object({
      channel: z.string(),
      uplift: z.coerce.number()
  })).optional(),
  timeBasedAdjustments: z.object({
      lastMinuteMarkup: z.coerce.number().optional(),
      earlyBirdDiscount: z.coerce.number().optional(),
  }).optional(),
  guardrails: z.object({
      minPriceFloor: z.coerce.number().optional(),
      maxPriceCeiling: z.coerce.number().optional(),
  }).optional(),

  imageHint: z.string().optional(),
});

export type Bundle = z.infer<typeof bundleSchema>;

const channelOptions = [
  { value: 'Direct', label: 'Web/Mobile' },
  { value: 'CUSS', label: 'SITA CUSS Kiosk' },
  { value: 'CUTE', label: 'Agent Desktop' },
  { value: 'TMC', label: 'TMC Portal' },
];

const marketOptions = [
  { value: 'US', label: 'United States' },
  { value: 'EU', label: 'Europe' },
  { value: 'APAC', label: 'Asia-Pacific' },
  { value: 'ME', label: 'Middle East' },
];

interface BundleFormProps {
  bundle: any | null;
  onSubmit: (data: Bundle) => void;
  onCancel: () => void;
}

const parseScope = (scope: any) => {
  if (!scope) return { brand: [], channel: [], cohorts: [], market: [] };
  const parseVal = (val: any) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.length > 0) return val.split(',').map((s: string) => s.trim());
    return [];
  };
  return {
    brand: parseVal(scope.brand),
    channel: parseVal(scope.channel),
    cohorts: parseVal(scope.cohorts),
    market: parseVal(scope.market),
  };
};

export function BundleForm({ bundle, onSubmit, onCancel }: BundleFormProps) {
  const [showPreview, setShowPreview] = React.useState(false);
  const firestore = useFirestore();

  const ancillariesQuery = React.useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
  const airportQuery = React.useMemo(() => firestore ? collection(firestore, 'airportServices') : undefined, [firestore]);
  const cohortsQuery = React.useMemo(() => firestore ? collection(firestore, 'cohorts') : undefined, [firestore]);

  const { data: airlineAncillaries } = useCollection(ancillariesQuery);
  const { data: airportServices } = useCollection(airportQuery);
  const { data: cohorts } = useCollection(cohortsQuery);

  const form = useForm<Bundle>({
    resolver: zodResolver(bundleSchema),
    defaultValues: bundle ? {
      ...bundle,
      components: Array.isArray(bundle.components) 
        ? bundle.components.map((c: any) => ({ value: typeof c === 'string' ? c : (c.id || '') }))
        : (bundle.components ? Object.entries(bundle.components).map(([k]) => ({ value: k })) : []),
      scope: parseScope(bundle.scope),
      validity: {
        from: bundle.validity?.from instanceof Date ? bundle.validity.from : (bundle.validity?.from?.toDate?.() || new Date()),
        to: bundle.validity?.to instanceof Date ? bundle.validity.to : (bundle.validity?.to?.toDate?.() || addDays(new Date(), 30)),
      },
      status: bundle.status || 'Draft',
      pricingStrategy: bundle.pricingStrategy || 'Percent Discount',
      discount: bundle.discount || 0,
      priorityLevel: bundle.priorityLevel || 50,
      imageHint: bundle.imageHint || 'airport luxury',
    } : {
      name: '',
      description: '',
      category: 'Normal',
      status: 'Draft',
      priorityLevel: 50,
      validity: { from: new Date(), to: addDays(new Date(), 30) },
      scope: { brand: [], channel: [], cohorts: [], market: [] },
      components: [{ value: '' }],
      pricingStrategy: 'Percent Discount',
      discount: 10,
      imageHint: 'airport luxury',
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "components" });

  const selectedComponents = form.watch('components') || [];
  const pricingStrategy = form.watch('pricingStrategy');
  const discountValue = form.watch('discount') || 0;

  const allAvailableProducts = React.useMemo(() => {
    const air = (airlineAncillaries || []).map(p => ({ id: p.id, name: p.name, price: p.defaultPrice || 0, type: 'Airline' }));
    const port = (airportServices || []).map(p => ({ id: p.id, name: p.name, price: p.price || 0, type: 'Airport' }));
    return [...air, ...port];
  }, [airlineAncillaries, airportServices]);

  const totalComponentValue = React.useMemo(() => {
    return selectedComponents.reduce((total, current) => {
      const product = allAvailableProducts.find(p => p.id === current.value);
      return total + (product ? product.price : 0);
    }, 0);
  }, [selectedComponents, allAvailableProducts]);

  const finalPrice = React.useMemo(() => {
    if (pricingStrategy === 'Absolute Price') return discountValue;
    if (pricingStrategy === 'Fixed Discount') return Math.max(0, totalComponentValue - discountValue);
    return totalComponentValue * (1 - discountValue / 100);
  }, [pricingStrategy, discountValue, totalComponentValue]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-h-[80vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <Package className="h-4 w-4 text-primary" /> 1. Portfolio Definition
              </div>
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Retailing Offer Name</FormLabel><FormControl><Input placeholder="e.g., Platinum Fast-Track Bundle" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Touchpoint Display Text</FormLabel><FormControl><Input placeholder="Visual description for customer display" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent><SelectItem value="Normal">Standard</SelectItem><SelectItem value="Disruption">IROPS / Disruption</SelectItem><SelectItem value="Promotional">Flash Sale</SelectItem></SelectContent></Select></FormItem>
                )} />
                <FormField control={form.control} name="priorityLevel" render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between"><FormLabel>Priority</FormLabel><span className="text-[10px] font-black text-primary">{field.value}</span></div>
                    <Slider min={1} max={100} step={1} value={[field.value]} onValueChange={(v) => field.onChange(v[0])} />
                  </FormItem>
                )} />
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <Target className="h-4 w-4 text-primary" /> 2. Targeting Logic (Who)
              </div>
              <FormField control={form.control} name="scope.cohorts" render={({ field }) => (
                <FormItem>
                  <FormLabel>Linked Retailing Cohorts</FormLabel>
                  <MultiSelect 
                    options={(cohorts || []).map(c => ({ value: c.cohortId, label: c.name }))} 
                    selected={field.value || []} 
                    onChange={field.onChange} 
                    placeholder="Search segments..." 
                  />
                  <FormDescription className="text-[10px]">Commercials only applied to these segments.</FormDescription>
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="scope.channel" render={({ field }) => (
                  <FormItem><FormLabel>SITA Channels</FormLabel><MultiSelect options={channelOptions} selected={field.value || []} onChange={field.onChange} placeholder="All channels" /></FormItem>
                )} />
                <FormField control={form.control} name="scope.market" render={({ field }) => (
                  <FormItem><FormLabel>Markets</FormLabel><MultiSelect options={marketOptions} selected={field.value || []} onChange={field.onChange} placeholder="Global" /></FormItem>
                )} />
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <PlusCircle className="h-4 w-4 text-primary" /> 3. Components & Commercial Logic
              </div>
              <div className="space-y-2">
                <FormLabel>Included SKUs</FormLabel>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField control={form.control} name={`components.${index}.value`} render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Select SKU..." /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectGroup><SelectLabel>Carrier Ancillaries</SelectLabel>{(airlineAncillaries || []).map(p => (<SelectItem key={p.id} value={p.id!}>{p.name} (${p.defaultPrice})</SelectItem>))}</SelectGroup>
                            <SelectGroup><SelectLabel>Hub Services</SelectLabel>{(airportServices || []).map(p => (<SelectItem key={p.id} value={p.id!}>{p.name} (${p.price})</SelectItem>))}</SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })} className="w-full border-dashed"><PlusCircle className="mr-2 h-3 w-3" /> Add Component</Button>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-4 mt-4">
                <div className="flex items-center gap-2 text-indigo-700 font-bold uppercase text-[10px] tracking-widest mb-2">
                    <TrendingUp className="h-3 w-3" /> Pricing Strategy
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <FormField control={form.control} name="pricingStrategy" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs">Logic</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Percent Discount">Percent Discount</SelectItem><SelectItem value="Fixed Discount">Fixed Discount</SelectItem><SelectItem value="Absolute Price">Absolute Price</SelectItem></SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="discount" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs">Value</FormLabel>
                      <FormControl><div className="relative"><Input type="number" {...field} className="h-8 pl-7 text-xs" />
                      {pricingStrategy === 'Percent Discount' ? <Percent className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" /> : <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />}</div></FormControl>
                    </FormItem>
                  )} />
                </div>

                <Separator className="bg-indigo-200/50" />
                
                <div className="space-y-3">
                   <div className="flex items-center gap-2 text-[9px] font-black text-indigo-600 uppercase tracking-tighter">
                      <ShieldCheck className="h-3 w-3" /> Commercial Guardrails
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <FormField control={form.control} name="guardrails.minPriceFloor" render={({ field }) => (
                        <FormItem><FormControl><Input type="number" placeholder="Floor Price" className="h-7 text-[10px]" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="guardrails.maxPriceCeiling" render={({ field }) => (
                        <FormItem><FormControl><Input type="number" placeholder="Ceiling Price" className="h-7 text-[10px]" {...field} /></FormControl></FormItem>
                      )} />
                   </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] font-black text-indigo-700 uppercase">Est. Yield Per Acceptance</span>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground line-through opacity-50 mr-2">${totalComponentValue.toFixed(2)}</span>
                    <span className="text-xl font-black text-indigo-700 tabular-nums">${finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {showPreview && (
          <div className="bg-muted/40 p-8 rounded-2xl border-2 border-dashed border-muted-foreground/20 animate-in zoom-in-95">
            <div className="max-w-md mx-auto">
              <Card className="overflow-hidden border-0 shadow-2xl">
                <div className="relative h-48 bg-primary">
                  <Image src={`https://picsum.photos/seed/${form.getValues('name') || 'bundle'}/600/400`} alt="Preview" fill className="object-cover opacity-80" data-ai-hint="airport luxury" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <Badge className="mb-2 bg-indigo-500 text-white border-0">CONTEXTUAL OFFER</Badge>
                    <h3 className="text-2xl font-black leading-none tracking-tight">{form.getValues('name') || 'Your Bundle Name'}</h3>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4 italic">{form.getValues('description') || 'Visual description...'}</p>
                  <div className="space-y-2">
                    {selectedComponents.filter(c => c.value).map(c => (
                      <div key={c.value} className="flex items-center gap-3 text-xs font-bold p-2 bg-secondary/50 rounded-lg">
                        <Check className="h-3 w-3 text-indigo-600" /> {allAvailableProducts.find(p => p.id === c.value)?.name}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 p-6 flex justify-between items-center border-t">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground line-through opacity-60">${totalComponentValue.toFixed(2)}</span>
                    <span className="text-2xl font-black text-primary">${finalPrice.toFixed(2)}</span>
                  </div>
                  <Button className="rounded-full px-8 font-black shadow-lg">Activate</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 border-t z-20">
          <Button type="button" variant="ghost" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Close Preview' : 'Preview Touchpoint UI'}
          </Button>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
            <Button type="submit" className="font-bold px-10">Commit Retailing Item</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
