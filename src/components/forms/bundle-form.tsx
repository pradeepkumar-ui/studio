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
import { Separator } from '../ui/separator';
import { PlusCircle, Trash2, Eye, Package, Check, Calendar as CalendarIcon, Info, Percent, DollarSign, ListFilter, Target, Zap, Loader2 } from 'lucide-react';
import { MultiSelect } from '../ui/multi-select';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Slider } from '../ui/slider';
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
  constraints: z.object({
    minPassengers: z.coerce.number().min(1).default(1),
    maxPassengers: z.coerce.number().optional(),
    minCartValue: z.coerce.number().optional(),
  }),
  components: z.array(z.object({ value: z.string().min(1, "Select service") })).min(1, "Select at least one component"),
  associatedPromotions: z.array(z.string()).default([]),
  pricingStrategy: z.enum(['Percent Discount', 'Fixed Discount', 'Absolute Price']),
  discount: z.coerce.number().min(0),
  source: z.enum(['Manual', 'AI']).optional(),
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
  const [showPreview, setShowPreview] = useState(false);
  const firestore = useFirestore();

  const ancillariesQuery = useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
  const airportQuery = useMemo(() => firestore ? collection(firestore, 'airportServices') : undefined, [firestore]);
  const faresQuery = useMemo(() => firestore ? collection(firestore, 'fareProducts') : undefined, [firestore]);
  const cohortsQuery = useMemo(() => firestore ? collection(firestore, 'cohorts') : undefined, [firestore]);
  const promotionsQuery = useMemo(() => firestore ? collection(firestore, 'promotions') : undefined, [firestore]);

  const { data: airlineAncillaries, loading: loadingAir } = useCollection(ancillariesQuery);
  const { data: airportServices, loading: loadingAirport } = useCollection(airportQuery);
  const { data: fareProducts, loading: loadingFares } = useCollection(faresQuery);
  const { data: cohorts, loading: loadingCohorts } = useCollection(cohortsQuery);
  const { data: promotions, loading: loadingPromos } = useCollection(promotionsQuery);

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
      constraints: bundle.constraints || { minPassengers: 1 },
      associatedPromotions: Array.isArray(bundle.associatedPromotions) ? bundle.associatedPromotions : [],
      imageHint: bundle.imageHint || 'airport luxury',
    } : {
      name: '',
      description: '',
      category: 'Normal',
      status: 'Draft',
      priorityLevel: 50,
      validity: { from: new Date(), to: addDays(new Date(), 30) },
      scope: { brand: [], channel: [], cohorts: [], market: [] },
      constraints: { minPassengers: 1 },
      components: [{ value: '' }],
      associatedPromotions: [],
      pricingStrategy: 'Percent Discount',
      discount: 10,
      imageHint: 'airport luxury',
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "components" });

  const selectedComponents = form.watch('components') || [];
  const pricingStrategy = form.watch('pricingStrategy');
  const discountValue = form.watch('discount') || 0;

  const allAvailableProducts = useMemo(() => {
    const air = (airlineAncillaries || []).map(p => ({ id: p.id, name: p.name, price: p.defaultPrice || 0, type: 'Airline' }));
    const port = (airportServices || []).map(p => ({ id: p.id, name: p.name, price: p.price || 0, type: 'Airport' }));
    return [...air, ...port];
  }, [airlineAncillaries, airportServices]);

  const totalComponentValue = useMemo(() => {
    return selectedComponents.reduce((total, current) => {
      const product = allAvailableProducts.find(p => p.id === current.value);
      return total + (product ? product.price : 0);
    }, 0);
  }, [selectedComponents, allAvailableProducts]);

  const finalPrice = useMemo(() => {
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
              <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Package className="h-4 w-4" />
                Offer Identity
              </div>
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer/Bundle Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Executive Gateway Pack" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Description</FormLabel>
                  <FormControl><Input placeholder="Brief, compelling description for the user" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Disruption">Disruption</SelectItem>
                        <SelectItem value="Promotional">Promotional</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Zap className="h-4 w-4" />
                Priority & Timing
              </div>
              <FormField control={form.control} name="priorityLevel" render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Priority Ranking</FormLabel>
                    <span className="text-xs font-mono font-bold text-primary">{field.value}</span>
                  </div>
                  <FormControl>
                    <Slider 
                      min={1} 
                      max={100} 
                      step={1} 
                      value={[field.value]} 
                      onValueChange={(vals) => field.onChange(vals[0])} 
                      className="py-4"
                    />
                  </FormControl>
                  <FormDescription className="text-[10px]">Higher values take precedence during cohort overlapping.</FormDescription>
                </FormItem>
              )} />
              <div className="grid grid-cols-1 gap-4">
                <FormLabel>Offer Validity Period</FormLabel>
                <FormField control={form.control} name="validity" render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (field.value.to ? <>{format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}</> : format(field.value.from, "LLL dd, y")) : <span>Pick dates</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar initialFocus mode="range" defaultMonth={field.value?.from} selected={field.value as any} onSelect={field.onChange} numberOfMonths={2} />
                    </PopoverContent>
                  </Popover>
                )} />
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Target className="h-4 w-4" />
                Targeting Scope
              </div>
              <FormField control={form.control} name="scope.cohorts" render={({ field }) => (
                <FormItem>
                  <FormLabel>Retailing Cohorts</FormLabel>
                  <MultiSelect 
                    options={(cohorts || []).map(c => ({ value: c.cohortId, label: c.name }))} 
                    selected={field.value || []} 
                    onChange={field.onChange} 
                    placeholder={loadingCohorts ? "Loading cohorts..." : "Select segments..."} 
                  />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="scope.channel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>SITA Channels</FormLabel>
                    <MultiSelect options={channelOptions} selected={field.value || []} onChange={field.onChange} placeholder="All channels" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="scope.market" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Markets</FormLabel>
                    <MultiSelect options={marketOptions} selected={field.value || []} onChange={field.onChange} placeholder="All markets" />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="scope.brand" render={({ field }) => (
                <FormItem>
                  <FormLabel>Eligible Fare Brands</FormLabel>
                  <MultiSelect 
                    options={(fareProducts || []).map(f => ({ value: f.name, label: f.name }))} 
                    selected={field.value || []} 
                    onChange={field.onChange} 
                    placeholder={loadingFares ? "Loading brands..." : "All brands"} 
                  />
                </FormItem>
              )} />
            </section>

            <Separator />

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <ListFilter className="h-4 w-4" />
                Components & Pricing
              </div>
              <div className="space-y-2">
                <FormLabel>Select Product(s)</FormLabel>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField control={form.control} name={`components.${index}.value`} render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select from Catalogue" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Airline Ancillaries</SelectLabel>
                              {(airlineAncillaries || []).map(p => (
                                <SelectItem key={p.id} value={p.id!}>{p.name} (${p.defaultPrice})</SelectItem>
                              ))}
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Airport Services</SelectLabel>
                              {(airportServices || []).map(p => (
                                <SelectItem key={p.id} value={p.id!}>{p.name} (${p.price})</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Component
                </Button>
              </div>

              <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <FormField control={form.control} name="pricingStrategy" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Logic</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Percent Discount">Percent Discount</SelectItem>
                          <SelectItem value="Fixed Discount">Fixed Discount</SelectItem>
                          <SelectItem value="Absolute Price">Absolute Price</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="discount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adjustment</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <Input type="number" {...field} className="pl-8" />
                           {pricingStrategy === 'Percent Discount' ? <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> : <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />}
                        </div>
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-bold text-primary uppercase">Calculated Offer Price</span>
                  <span className="text-2xl font-black text-primary tabular-nums">${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {showPreview && (
          <div className="space-y-4 bg-muted/40 p-8 rounded-2xl border-2 border-dashed border-muted-foreground/20">
            <div className="max-w-md mx-auto">
              <Card className="overflow-hidden border-0 shadow-2xl">
                <div className="relative h-48 bg-primary">
                  <Image 
                    src={`https://picsum.photos/seed/${form.getValues('name') || 'bundle'}/600/400`} 
                    alt="Offer Preview" 
                    fill 
                    className="object-cover opacity-80" 
                    data-ai-hint="airport luxury" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <Badge variant="secondary" className="mb-2 bg-primary text-white border-0 shadow-lg">EXCLUSIVE OFFER</Badge>
                    <h3 className="text-2xl font-black leading-none tracking-tight">{form.getValues('name') || 'Your Offer Name'}</h3>
                  </div>
                </div>
                <CardContent className="pt-6 pb-2">
                  <p className="text-sm text-muted-foreground mb-4">{form.getValues('description') || 'Compelling value proposition for your passengers.'}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedComponents.filter(c => c.value).map(c => (
                      <div key={c.value} className="flex items-center gap-3 text-xs font-semibold p-2 bg-secondary/50 rounded-lg">
                        <div className="p-1 rounded-full bg-green-500 text-white"><Check className="h-3 w-3" /></div>
                        {allAvailableProducts.find(p => p.id === c.value)?.name || "Service Item"}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 p-6 flex justify-between items-center border-t border-muted">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground line-through opacity-60">${totalComponentValue.toFixed(2)}</span>
                    <span className="text-2xl font-black text-primary tabular-nums">${finalPrice.toFixed(2)}</span>
                  </div>
                  <Button className="rounded-full px-8 h-12 text-sm font-bold shadow-lg" type="button">Enhance My Trip</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 border-t z-20">
          <Button type="button" variant="ghost" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Close Preview' : 'Preview Touchpoint'}
          </Button>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
            <Button type="submit" className="px-10 font-bold">
              {bundle?.id ? 'Update Retailing Item' : 'Publish to Ecosystem'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
