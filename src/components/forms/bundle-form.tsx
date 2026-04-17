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
import { PlusCircle, Trash2, Eye, Package, Check } from 'lucide-react';
import { MultiSelect } from '../ui/multi-select';
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import Image from 'next/image';
import { Badge } from '../ui/badge';

const ancillaryProducts = [
  { id: 'ANC-001', name: '1st Checked Bag (23kg)', price: 35 },
  { id: 'ANC-007', name: '2nd Checked Bag (23kg)', price: 50 },
  { id: 'ANC-002', name: 'Extra Legroom Seat', price: 50 },
  { id: 'ANC-003', name: 'In-flight Wi-Fi', price: 8 },
  { id: 'ANC-006', name: 'Lounge Access', price: 45 },
  { id: 'ANC-010', name: 'Premium Meal', price: 25 },
  { id: 'ANC-FT-01', name: 'Fast Track Security', price: 15 },
  { id: 'ANC-MA-01', name: 'Meet & Assist VIP', price: 120 },
  { id: 'ANC-CH-01', name: 'Chauffeur Transfer', price: 85 },
];

const fareBrandOptions = [
  { value: 'Economy Flex', label: 'Economy Flex' },
  { value: 'Economy Saver', label: 'Economy Saver' },
  { value: 'Business Flex', label: 'Business Flex' },
  { value: 'Business Saver', label: 'Business Saver' },
];

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

const cohortOptions = [
  { value: 'BusinessLoyal_IN', label: 'Business Travelers India' },
  { value: 'Family_Leisure', label: 'Family Leisure' },
  { value: 'Short_Connection_Pax', label: 'Short Connection' },
];

const bundleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Offer name is required.'),
  description: z.string().min(5, 'Description is required.'),
  category: z.enum(['Normal', 'Disruption', 'Promotional']).default('Normal'),
  status: z.enum(['Draft', 'Published', 'Archived']),
  priority: z.enum(['Manual Override', 'AI Override']).default('Manual Override'),
  scope: z.object({
    brand: z.array(z.string()).optional(),
    channel: z.array(z.string()).optional(),
    cohorts: z.array(z.string()).optional(),
    market: z.array(z.string()).optional(),
  }),
  components: z.array(z.object({ value: z.string().min(1, "Select service") })).min(1, "Select at least one component"),
  pricingStrategy: z.enum(['Percent Discount', 'Fixed Discount', 'Absolute Price']),
  discount: z.coerce.number().min(0),
  source: z.enum(['Manual', 'AI']).optional(),
});

export type Bundle = z.infer<typeof bundleSchema> & {
  usage?: number;
  itemCount?: number;
  scope?: any;
  components?: any;
  promotions?: any;
};

interface BundleFormProps {
  bundle: Bundle | null;
  onSubmit: (data: Bundle) => void;
  onCancel: () => void;
}

const parseScope = (bundle: Bundle | null) => {
  if (!bundle || !bundle.scope) return { brand: [], channel: [], cohorts: [], market: [] };
  const scope = bundle.scope;
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

  const form = useForm<Bundle>({
    resolver: zodResolver(bundleSchema),
    defaultValues: bundle ? {
      ...bundle,
      components: Array.isArray(bundle.components) 
        ? bundle.components.map((c: any) => ({ value: typeof c === 'string' ? c : (c.id || '') }))
        : (bundle.components ? Object.entries(bundle.components).map(([k]) => ({ value: k })) : []),
      scope: parseScope(bundle),
      status: bundle.status || 'Draft',
      pricingStrategy: bundle.pricingStrategy || 'Percent Discount',
      discount: bundle.discount || 0,
      priority: bundle.priority || 'Manual Override',
    } : {
      name: '',
      description: '',
      category: 'Normal',
      status: 'Draft',
      priority: 'Manual Override',
      scope: { brand: [], channel: [], cohorts: [], market: [] },
      components: [{ value: '' }],
      pricingStrategy: 'Percent Discount',
      discount: 10,
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "components" });

  const handleFinalSubmit = (data: Bundle) => {
    const finalData = {
      ...data,
      itemCount: data.components.filter(c => c.value).length,
      scope: {
        ...data.scope,
        brand: data.scope.brand?.join(', '),
        channel: data.scope.channel?.join(', '),
        cohorts: data.scope.cohorts?.join(', '),
        market: data.scope.market?.join(', '),
      }
    };
    onSubmit(finalData as any);
  };

  const selectedComponents = form.watch('components') || [];
  const pricingStrategy = form.watch('pricingStrategy');
  const discountValue = form.watch('discount') || 0;

  const totalComponentValue = selectedComponents.reduce((total, current) => {
    const product = ancillaryProducts.find(p => p.id === current.value);
    return total + (product ? product.price : 0);
  }, 0);

  let finalPrice = 0;
  if (pricingStrategy === 'Absolute Price') {
    finalPrice = discountValue;
  } else if (pricingStrategy === 'Fixed Discount') {
    finalPrice = Math.max(0, totalComponentValue - discountValue);
  } else if (pricingStrategy === 'Percent Discount') {
    finalPrice = totalComponentValue * (1 - discountValue / 100);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6 max-h-[75vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <section className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" /> Identity
              </h4>
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Bundle Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Executive Gateway" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl><Input placeholder="e.g., Lounge + Fast Track" {...field} /></FormControl>
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
                    <FormLabel>Status</FormLabel>
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
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Scope & Targeting</h4>
              <FormField control={form.control} name="scope.brand" render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Brands</FormLabel>
                  <MultiSelect options={fareBrandOptions} selected={field.value || []} onChange={field.onChange} placeholder="Any Brand" />
                </FormItem>
              )} />
              <FormField control={form.control} name="scope.channel" render={({ field }) => (
                <FormItem>
                  <FormLabel>Touchpoints</FormLabel>
                  <MultiSelect options={channelOptions} selected={field.value || []} onChange={field.onChange} placeholder="Any Channel" />
                </FormItem>
              )} />
              <FormField control={form.control} name="scope.market" render={({ field }) => (
                <FormItem>
                  <FormLabel>Point of Sale</FormLabel>
                  <MultiSelect options={marketOptions} selected={field.value || []} onChange={field.onChange} placeholder="All Markets" />
                </FormItem>
              )} />
              <FormField control={form.control} name="scope.cohorts" render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Cohorts</FormLabel>
                  <MultiSelect options={cohortOptions} selected={field.value || []} onChange={field.onChange} placeholder="Broad Audience" />
                </FormItem>
              )} />
            </section>
          </div>
          <div className="space-y-6">
            <section className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Components</h4>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField control={form.control} name={`components.${index}.value`} render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select Service" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {ancillaryProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.name} (${p.price})</SelectItem>)}
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
            </section>
            <Separator />
            <section className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pricing Strategy</h4>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Individual Total</span>
                  <span className="font-bold">${totalComponentValue.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="pricingStrategy" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logic</FormLabel>
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
                      <FormLabel>Value</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-sm font-semibold">Bundle Price</span>
                  <span className="text-2xl font-black text-primary">${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
        {showPreview && (
          <div className="space-y-4 bg-muted/30 p-6 rounded-xl border-2 border-dashed">
            <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
              <Eye className="h-3 w-3" /> Live Customer View Preview
            </h4>
            <div className="max-w-md mx-auto">
              <Card className="overflow-hidden border-0 shadow-xl">
                <div className="relative h-40 bg-primary">
                  <Image src={`https://picsum.photos/seed/${form.getValues('name') || 'default'}/600/400`} alt="Bundle" fill className="object-cover opacity-80" data-ai-hint="airport lounge" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-0 backdrop-blur-sm">Limited Time Offer</Badge>
                    <h3 className="text-xl font-bold leading-tight">{form.getValues('name') || 'Your Bundle Name'}</h3>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">{form.getValues('description') || 'Select your components'}</p>
                  <div className="space-y-2">
                    {(form.getValues('components') || []).filter(c => c.value).map(c => (
                      <div key={c.value} className="flex items-center gap-2 text-xs font-medium">
                        <div className="p-1 rounded-full bg-green-100 text-green-700"><Check className="h-3 w-3" /></div>
                        {ancillaryProducts.find(p => p.id === c.value)?.name}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-4 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground line-through">${totalComponentValue.toFixed(2)}</span>
                    <span className="text-2xl font-black text-primary">${finalPrice.toFixed(2)}</span>
                  </div>
                  <Button size="sm" className="rounded-full px-6" type="button">Select Offer</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center pt-4 sticky bottom-0 bg-background py-4 border-t">
          <Button type="button" variant="ghost" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Hide Preview' : 'Preview Offer Card'}
          </Button>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="px-8">{bundle ? 'Update Bundle' : 'Create Bundle'}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}