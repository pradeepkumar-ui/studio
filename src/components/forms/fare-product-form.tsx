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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { MultiSelect } from '../ui/multi-select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PlusCircle, Trash2, ShieldCheck, Layers, Percent, DollarSign, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ancillaryOptions = [
    { id: 'ANC-001', label: '1st Checked Bag (23kg)', price: 35 },
    { id: 'ANC-007', label: '2nd Checked Bag (23kg)', price: 50 },
    { id: 'ANC-008', label: 'Oversize Baggage', price: 100 },
    { id: 'ANC-002', label: 'Extra Legroom', price: 50 },
    { id: 'ANC-009', label: 'Up-front Seat', price: 25 },
    { id: 'ANC-003', label: 'In-flight Wi-Fi', price: 8 },
    { id: 'ANC-006', label: 'Lounge Access', price: 45 },
    { id: 'ANC-010', label: 'Premium Meal', price: 25 },
    { id: 'ANC-004', label: 'Priority Boarding', price: 15 },
    { id: 'ANC-005', label: 'Flight Change Fee', price: 75 },
    { id: 'ANC-011', label: 'Cancel for any reason', price: 40 },
] as const;

const airportOptions = [
    { value: 'JFK', label: 'JFK - New York' },
    { value: 'LAX', label: 'LAX - Los Angeles' },
    { value: 'LHR', label: 'LHR - London Heathrow' },
    { value: 'DXB', label: 'DXB - Dubai' },
    { value: 'SIN', label: 'SIN - Singapore' },
    { value: 'HKG', label: 'HKG - Hong Kong' },
    { value: 'CDG', label: 'CDG - Paris' },
    { value: 'FRA', label: 'FRA - Frankfurt' },
    { value: 'MUC', label: 'MUC - Munich' },
    { value: 'DEL', label: 'DEL - Delhi' },
    { value: 'BOM', label: 'BOM - Mumbai' },
];

const scopeSchema = z.object({
    type: z.enum(['route-one-to-many', 'route-many-to-one', 'source', 'destination']).default('route-one-to-many'),
    source: z.array(z.string()).optional(),
    destination: z.array(z.string()).optional(),
});

const fareProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Brand Name is required.'),
  description: z.string().min(10, 'A customer-facing description is required.'),
  status: z.enum(['Active', 'Draft']),
  version: z.number().optional(),
  
  scopes: z.array(scopeSchema).min(1, 'At least one scope block is required.'),

  priceModificationType: z.enum(['PERCENTAGE', 'ABSOLUTE']),
  priceModificationValue: z.coerce.number(),

  refundability: z.enum(['Allowed', 'Allowed with Penalty', 'Not Allowed']),
  exchangeability: z.enum(['Allowed', 'Allowed with Penalty', 'Not Allowed']),
  transferability: z.enum(['Allowed', 'Not Allowed']),

  includedAncillaries: z.array(z.string()).optional(),
  route: z.string().optional(), 
});

export type FareProduct = z.infer<typeof fareProductSchema>;

interface FareProductFormProps {
  product: FareProduct | null;
  onSubmit: (data: FareProduct) => void;
  onCancel: () => void;
}

const getRouteStringFromScope = (scope: z.infer<typeof scopeSchema>): string => {
    switch (scope.type) {
        case 'source': return `From: ${scope.source?.join(', ')}`;
        case 'destination': return `To: ${scope.destination?.join(', ')}`;
        case 'route-one-to-many': return `${scope.source?.[0]} → ${scope.destination?.join(', ')}`;
        case 'route-many-to-one': return `${scope.source?.join(', ')} → ${scope.destination?.[0]}`;
        default: return 'Custom Scope';
    }
}

export function FareProductForm({ product, onSubmit, onCancel }: FareProductFormProps) {
  const form = useForm<FareProduct>({
    resolver: zodResolver(fareProductSchema),
    defaultValues: product || {
      name: '',
      description: '',
      status: 'Draft',
      scopes: [{ type: 'route-one-to-many', source: [], destination: [] }],
      priceModificationType: 'PERCENTAGE',
      priceModificationValue: 10,
      refundability: 'Allowed with Penalty',
      exchangeability: 'Allowed with Penalty',
      transferability: 'Not Allowed',
      includedAncillaries: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "scopes" });

  const handleFormSubmit = (data: FareProduct) => {
    const routeString = data.scopes.map(getRouteStringFromScope).join('; ');
    onSubmit({ ...data, route: routeString });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 max-h-[80vh] overflow-y-auto pr-4">
        
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Layers className="h-4 w-4" />
                Identity & Positioning
            </div>
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Brand / Commercial Name</FormLabel>
                <FormControl><Input placeholder="e.g., Economy Flex Plus" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Commercial Description (Marketing)</FormLabel>
                <FormControl><Textarea placeholder="Highlight the key benefits of this fare brand..." {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </section>

        <Separator />
        
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Target className="h-4 w-4" />
                Network Scope
            </div>
            <div className="space-y-4">
                {fields.map((field, index) => {
                    const scopeType = form.watch(`scopes.${index}.type`);
                    return (
                    <Card key={field.id} className="relative bg-muted/30 border-dashed">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => remove(index)} disabled={fields.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                        <CardContent className="p-4 space-y-4">
                            <FormField control={form.control} name={`scopes.${index}.type`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Applicable Markets</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select scope type" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="route-one-to-many">One Origin to Many Destinations</SelectItem>
                                            <SelectItem value="route-many-to-one">Many Origins to One Destination</SelectItem>
                                            <SelectItem value="source">Entire Hub (Source)</SelectItem>
                                            <SelectItem value="destination">Entire Market (Destination)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>
                            <div className="grid grid-cols-2 gap-4">
                                {(scopeType === 'route-one-to-many' || scopeType === 'source' || scopeType === 'route-many-to-one') && (
                                    <FormField control={form.control} name={`scopes.${index}.source`} render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{scopeType === 'route-one-to-many' ? 'Origin' : 'Origins'}</FormLabel>
                                            {scopeType === 'route-one-to-many' ? (
                                                <Select onValueChange={(v) => field.onChange([v])} defaultValue={field.value?.[0]}>
                                                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                                    <SelectContent>{airportOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                                </Select>
                                            ) : <MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="All Hubs"/>}
                                        </FormItem>
                                    )} />
                                )}
                                {(scopeType === 'route-one-to-many' || scopeType === 'destination' || scopeType === 'route-many-to-one') && (
                                    <FormField control={form.control} name={`scopes.${index}.destination`} render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{scopeType === 'route-many-to-one' ? 'Destination' : 'Destinations'}</FormLabel>
                                            {scopeType === 'route-many-to-one' ? (
                                                <Select onValueChange={(v) => field.onChange([v])} defaultValue={field.value?.[0]}>
                                                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                                    <SelectContent>{airportOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                                </Select>
                                            ) : <MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="All Markets"/>}
                                        </FormItem>
                                    )} />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )})}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ type: 'route-one-to-many', source: [], destination: [] })}><PlusCircle className="mr-2 h-4 w-4" /> Add Scope block</Button>
            </div>
        </section>

        <Separator />
        
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Percent className="h-4 w-4" />
                Pricing Architecture
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="priceModificationType"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Adjustment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                            <SelectItem value="ABSOLUTE">Absolute (₹)</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormDescription>Calculated on top of Base Fare.</FormDescription>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="priceModificationValue"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Adjustment Value</FormLabel>
                        <div className="relative">
                            {form.watch('priceModificationType') === 'PERCENTAGE' ? <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /> : <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                            <FormControl><Input type="number" className="pl-9" {...field} /></FormControl>
                        </div>
                    </FormItem>
                    )}
                />
            </div>
        </section>

        <Separator />
        
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Layers className="h-4 w-4" />
                Included Ancillary Services
            </div>
            <FormField
                control={form.control}
                name="includedAncillaries"
                render={() => (
                    <FormItem>
                         <div className="grid grid-cols-2 gap-4 pt-2">
                            <TooltipProvider>
                                {ancillaryOptions.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="includedAncillaries"
                                        render={({ field }) => (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-muted/50 cursor-pointer">
                                                        <FormControl>
                                                            <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((v) => v !== item.id))} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer flex-1">{item.label}</FormLabel>
                                                    </FormItem>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Current Market Value: ${item.price}</p></TooltipContent>
                                            </Tooltip>
                                        )}
                                    />
                                ))}
                            </TooltipProvider>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </section>

        <Separator />
        
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <ShieldCheck className="h-4 w-4" />
                Branded Service Rules
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="refundability" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Refunds</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Allowed">Allowed</SelectItem><SelectItem value="Allowed with Penalty">With Fee</SelectItem><SelectItem value="Not Allowed">Not Allowed</SelectItem></SelectContent>
                        </Select>
                    </FormItem>
                )} />
                <FormField control={form.control} name="exchangeability" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Changes</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Allowed">Allowed</SelectItem><SelectItem value="Allowed with Penalty">With Fee</SelectItem><SelectItem value="Not Allowed">Not Allowed</SelectItem></SelectContent>
                        </Select>
                    </FormItem>
                )} />
                 <FormField control={form.control} name="transferability" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Transfer</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Allowed">Allowed</SelectItem><SelectItem value="Not Allowed">Not Allowed</SelectItem></SelectContent>
                        </Select>
                    </FormItem>
                )} />
            </div>
        </section>

        <Separator />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catalogue Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="Draft">Draft (Internal)</SelectItem><SelectItem value="Active">Active (Retailable)</SelectItem></SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-background py-4 border-t z-10">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="px-10">{product ? 'Update Brand' : 'Publish Branded Fare'}</Button>
        </div>
      </form>
    </Form>
  );
}
