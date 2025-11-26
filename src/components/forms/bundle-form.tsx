
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
import { PlusCircle, Trash2, CalendarIcon, Eye } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { MultiSelect } from '../ui/multi-select';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import Image from 'next/image';

const ancillaryProducts = [
  { id: 'ANC-001', name: '1st Checked Bag (23kg)', price: 35 },
  { id: 'ANC-002', name: 'Extra Legroom Seat', price: 50 },
  { id: 'ANC-003', name: 'In-flight Wi-Fi', price: 8 },
  { id: 'ANC-004', name: 'Priority Boarding', price: 15 },
  { id: 'ANC-006', name: 'Lounge Access', price: 45 },
  { id: 'ANC-010', name: 'Premium Meal', price: 25 },
  { id: 'ANC-011', name: 'Cancel for any reason', price: 40 },
];

const mockPromotionsData = [
    { id: 'PRO-001', name: 'WINTER10', description: '10% off' },
    { id: 'PRO-002', name: 'BIZ100', description: '$100 off Business' },
    { id: 'PRO-005', name: 'NEXT50', description: '$50 Future Credit' },
];

const fareBrandOptions = [
    { value: 'Economy Flex', label: 'Economy Flex' },
    { value: 'Economy Saver', label: 'Economy Saver' },
    { value: 'Business Flex', label: 'Business Flex' },
    { value: 'Business Saver', label: 'Business Saver' },
];
const channelOptions = [
    { value: 'Direct', label: 'Direct (Web & Mobile)' },
    { value: 'TMC', label: 'TMC' },
    { value: 'OTA', label: 'OTA' },
];
const cohortOptions = [
    { value: 'BusinessLoyal_IN', label: 'Business Travelers India' },
    { value: 'Family Leisure', label: 'Family Leisure' },
];

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

const marketOptions = [
    { value: 'US-DOM', label: 'US Domestic' },
    { value: 'EU', label: 'Europe' },
    { value: 'APAC', label: 'Asia-Pacific' },
    { value: 'ME', label: 'Middle East' },
    { value: 'AF', label: 'Africa' },
];

const routeScopeSchema = z.object({
    type: z.enum(['route-one-to-many', 'route-many-to-one', 'source', 'destination']).default('route-one-to-many'),
    source: z.array(z.string()).optional(),
    destination: z.array(z.string()).optional(),
});


const bundleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Offer name is required.'),
  description: z.string().min(5, 'Description is required.'),
  category: z.enum(['Normal', 'Disruption', 'Promotional']).default('Normal'),
  status: z.enum(['Draft', 'Published', 'Archived']),
  priority: z.enum(['Default', 'Manual Override', 'AI Override']).default('Default'),
  scope: z.object({
    brand: z.array(z.string()).optional(),
    channel: z.array(z.string()).optional(),
    routes: z.array(routeScopeSchema).optional(),
    cohorts: z.array(z.string()).optional(),
    route: z.string().optional(),
    market: z.array(z.string()).optional(),
  }),
  components: z.array(z.object({ value: z.string().min(1, "Please select an ancillary.") })).min(1, "At least one ancillary component is required."),
  promotions: z.array(z.object({ value: z.string().min(1, "Please select a promotion.") })).optional(),
  pricingStrategy: z.enum(['Percent Discount', 'Fixed Discount', 'Absolute Price']),
  discount: z.coerce.number().min(0),
  validity: z.object({
    effectiveDate: z.date(),
    expiryDate: z.date(),
  }).optional(),
  itemCount: z.number().optional(),
  source: z.enum(['Manual', 'AI']).optional(),
});

export type Bundle = z.infer<typeof bundleSchema>;

interface BundleFormProps {
  bundle: Bundle | null;
  onSubmit: (data: Bundle) => void;
  onCancel: () => void;
}

const getRouteStringFromScope = (scope: z.infer<typeof routeScopeSchema>): string => {
    switch (scope.type) {
        case 'source':
            return `From: ${scope.source?.join(', ') || 'N/A'}`;
        case 'destination':
            return `To: ${scope.destination?.join(', ') || 'N/A'}`;
        case 'route-one-to-many':
             return `${scope.source?.[0] || 'N/A'} -> ${scope.destination?.join(', ') || 'N/A'}`;
        case 'route-many-to-one':
             return `${scope.source?.join(', ') || 'N/A'} -> ${scope.destination?.[0] || 'N/A'}`;
        default:
            return 'Invalid Scope';
    }
}

const parseScope = (bundle: Bundle | null) => {
    if (!bundle || !bundle.scope) return { brand: [], channel: [], routes: [], cohorts: [], market: []};
    
    let routes = [];
     if (bundle.scope.route) { // Handle legacy string-based route
        if (bundle.scope.route.includes('->')) {
            const parts = bundle.scope.route.split('->');
            routes.push({ type: 'route-one-to-many', source: [parts[0]], destination: [parts[1]] });
        } else {
            routes.push({ type: 'route-one-to-many', source: [bundle.scope.route], destination: [] });
        }
    } else if (Array.isArray(bundle.scope.routes)) {
        routes = bundle.scope.routes;
    }

    return {
        brand: Array.isArray(bundle.scope.brand) ? bundle.scope.brand : (bundle.scope.brand ? (bundle.scope.brand as string).split(',').map(s => s.trim()) : []),
        channel: Array.isArray(bundle.scope.channel) ? bundle.scope.channel : (bundle.scope.channel ? (bundle.scope.channel as string).split(',').map(s => s.trim()) : []),
        routes: routes,
        cohorts: Array.isArray(bundle.scope.cohorts) ? bundle.scope.cohorts : (bundle.scope.cohorts ? (bundle.scope.cohorts as string).split(',').map(s => s.trim()) : []),
        market: Array.isArray(bundle.scope.market) ? bundle.scope.market : [],
    }
}


export function BundleForm({ bundle, onSubmit, onCancel }: BundleFormProps) {
  const [showPreview, setShowPreview] = useState(false);
    
  const form = useForm<Bundle>({
    resolver: zodResolver(bundleSchema),
    defaultValues: bundle ? {
      ...bundle,
      components: Array.isArray(bundle.components) ? Object.values(bundle.components).filter(c => typeof c === 'string').map(c => ({ value: c })) : [],
      promotions: bundle.promotions || [],
      scope: parseScope(bundle),
      validity: {
        effectiveDate: new Date(),
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
      priority: bundle.priority || 'Default',
    } : {
      name: '',
      description: '',
      category: 'Normal',
      status: 'Draft',
      priority: 'Default',
      scope: {
        brand: [],
        channel: [],
        routes: [{ type: 'route-one-to-many', source: [], destination: [] }],
        cohorts: [],
        market: [],
      },
      components: [{value: ''}],
      promotions: [],
      pricingStrategy: 'Percent Discount',
      discount: 10,
      validity: {
        effectiveDate: new Date(),
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      }
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "components"
  });

  const { fields: promoFields, append: appendPromo, remove: removePromo } = useFieldArray({
    control: form.control,
    name: "promotions"
  });

  const { fields: routeFields, append: appendRoute, remove: removeRoute } = useFieldArray({
    control: form.control,
    name: "scope.routes",
  });

  const handleFinalSubmit = (data: Bundle) => {
    const componentStrings = data.components.map(c => c.value);
    const componentObject: Record<string, string> = {};
    ancillaryProducts.forEach(p => {
        if (componentStrings.includes(p.id)) {
            const key = p.name.split(' ')[0].toLowerCase();
            componentObject[key] = p.name;
        }
    });

    const finalData = {
        ...data,
        itemCount: (data.components.filter(c => c.value).length) + (data.promotions?.filter(p => p.value).length || 0),
        components: componentObject,
        promotions: data.promotions?.map(p => p.value),
        scope: {
          ...data.scope,
          brand: data.scope.brand?.join(', '),
          channel: data.scope.channel?.join(', '),
          cohorts: data.scope.cohorts?.join(', '),
          route: data.scope.routes?.map(getRouteStringFromScope).join('; '),
          market: data.scope.market?.join(', '),
        }
    };
    
    onSubmit(finalData as any);
  }

  const selectedComponents = form.watch('components');
  const pricingStrategy = form.watch('pricingStrategy');
  const discountValue = form.watch('discount');
  const selectedPromotions = form.watch('promotions');

  const totalComponentValue = selectedComponents.reduce((total, current) => {
    const product = ancillaryProducts.find(p => p.id === current.value);
    return total + (product ? product.price : 0);
  }, 0);

  let finalPrice = 0;
  if (pricingStrategy === 'Absolute Price') {
    finalPrice = discountValue;
  } else if (pricingStrategy === 'Fixed Discount') {
    finalPrice = totalComponentValue - discountValue;
  } else if (pricingStrategy === 'Percent Discount') {
    finalPrice = totalComponentValue * (1 - discountValue / 100);
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        
        <h4 className="text-md font-semibold">Identity</h4>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Business Saver+" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Front seat + bag + meal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Disruption">Disruption</SelectItem>
                  <SelectItem value="Promotional">Promotional</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator className="my-6" />

        <h4 className="text-md font-semibold">Scope & Rules</h4>
        <p className="text-sm text-muted-foreground -mt-2">Define the conditions under which this bundle is available.</p>
        <div className="space-y-4">
            <FormField control={form.control} name="scope.brand" render={({field}) => <FormItem><FormLabel>Fare Brands</FormLabel><MultiSelect options={fareBrandOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select brands..."/><FormMessage/></FormItem>} />
            <FormField control={form.control} name="scope.channel" render={({field}) => <FormItem><FormLabel>Channels</FormLabel><MultiSelect options={channelOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select channels..."/><FormMessage/></FormItem>} />
            <FormField control={form.control} name="scope.market" render={({field}) => <FormItem><FormLabel>Markets</FormLabel><MultiSelect options={marketOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select markets..."/><FormMessage/></FormItem>} />
            
            <div className="space-y-2">
            <FormLabel>Routes</FormLabel>
            {routeFields.map((field, index) => {
                 const scopeType = form.watch(`scope.routes.${index}.type`);
                return (
                    <Card key={field.id} className="p-3 relative bg-muted/50">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeRoute(index)} disabled={routeFields.length <= 1} >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                         <CardContent className="p-0 space-y-4">
                            <FormField control={form.control} name={`scope.routes.${index}.type`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Scope Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select scope type" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="route-one-to-many">Route (One Origin to Many Destinations)</SelectItem>
                                            <SelectItem value="route-many-to-one">Route (Many Origins to One Destination)</SelectItem>
                                            <SelectItem value="source">Source (Any Destination)</SelectItem>
                                            <SelectItem value="destination">Destination (Any Source)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>
                            {scopeType === 'route-one-to-many' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name={`scope.routes.${index}.source`} render={({field}) => (
                                        <FormItem><FormLabel>Origin</FormLabel>
                                            <Select onValueChange={(value) => field.onChange([value])} defaultValue={field.value?.[0]}><FormControl><SelectTrigger><SelectValue placeholder="Select origin..." /></SelectTrigger></FormControl>
                                                <SelectContent>{airportOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name={`scope.routes.${index}.destination`} render={({field}) => (
                                        <FormItem><FormLabel>Destinations</FormLabel><MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select..."/>
                                        </FormItem>
                                    )} />
                                </div>
                            )}
                             {scopeType === 'route-many-to-one' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name={`scope.routes.${index}.source`} render={({field}) => (<FormItem><FormLabel>Origins</FormLabel><MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select..."/></FormItem>)} />
                                    <FormField control={form.control} name={`scope.routes.${index}.destination`} render={({field}) => (<FormItem><FormLabel>Destination</FormLabel><Select onValueChange={(value) => field.onChange([value])} defaultValue={field.value?.[0]}><FormControl><SelectTrigger><SelectValue placeholder="Select destination..." /></SelectTrigger></FormControl><SelectContent>{airportOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></FormItem>)} />
                                </div>
                            )}
                             {scopeType === 'source' && ( <FormField control={form.control} name={`scope.routes.${index}.source`} render={({field}) => ( <FormItem><FormLabel>Source Airports</FormLabel><MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select..."/></FormItem>)} />)}
                            {scopeType === 'destination' && (<FormField control={form.control} name={`scope.routes.${index}.destination`} render={({field}) => (<FormItem><FormLabel>Destination Airports</FormLabel><MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select..."/></FormItem>)} />)}
                         </CardContent>
                    </Card>
                )
            })}
             <Button type="button" variant="outline" size="sm" onClick={() => appendRoute({ type: 'route-one-to-many', source: [], destination: [] })}><PlusCircle className="mr-2 h-4 w-4" /> Add Route Scope</Button>
            </div>
            
            <FormField control={form.control} name="scope.cohorts" render={({field}) => <FormItem><FormLabel>Target Cohorts</FormLabel><MultiSelect options={cohortOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select cohorts..."/><FormMessage/></FormItem>} />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="validity.effectiveDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Effective Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="validity.expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <h4 className="text-md font-semibold pt-4">Components</h4>
        <div className="space-y-2">
            <FormLabel>Ancillaries</FormLabel>
            {fields.map((field, index) => {
              const selectedProduct = ancillaryProducts.find(p => p.id === selectedComponents[index]?.value);
              return (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`components.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an ancillary component" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ancillaryProducts.map(product => (
                              <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-20 text-right text-sm text-muted-foreground">
                    {selectedProduct ? `$${selectedProduct.price.toFixed(2)}` : ''}
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
             <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Ancillary
          </Button>
        </div>
         <div className="space-y-2 pt-4">
            <FormLabel>Promotions</FormLabel>
            {promoFields.map((field, index) => {
              return (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`promotions.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a promotion" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockPromotionsData.map(promo => (
                              <SelectItem key={promo.id} value={promo.id}>{promo.name} - {promo.description}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removePromo(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
             <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => appendPromo({ value: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Promotion
          </Button>
        </div>


        <Separator className="my-6" />

        <h4 className="text-md font-semibold">Pricing</h4>
        <div className="rounded-md border bg-muted p-3 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Total Component Value</span>
                <span className="font-semibold">${totalComponentValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Offer Price</span>
                <span className="font-semibold text-primary">${finalPrice.toFixed(2)}</span>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pricingStrategy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strategy</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Percent Discount">Percent Discount</SelectItem>
                    <SelectItem value="Fixed Discount">Fixed Discount</SelectItem>
                    <SelectItem value="Absolute Price">Absolute Price</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount / Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator className="my-6" />

        <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Default">Default</SelectItem>
                    <SelectItem value="Manual Override">Manual Override</SelectItem>
                    <SelectItem value="AI Override">AI Override</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showPreview && (
             <Card className="flex flex-col overflow-hidden">
                <CardHeader>
                    <CardTitle>Offer Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col overflow-hidden border rounded-lg">
                        <div className="relative w-full h-40">
                            <Image
                                src="https://picsum.photos/seed/bundle-preview/600/400"
                                alt={form.getValues('name') || 'Bundle'}
                                fill
                                style={{ objectFit: 'cover' }}
                                data-ai-hint="travel lifestyle"
                            />
                        </div>
                        <div className="p-4">
                            <h4 className="text-lg font-semibold">{form.getValues('name') || 'Your Offer Name'}</h4>
                            <p className="text-sm text-muted-foreground">{form.getValues('description') || 'Your offer description'}</p>
                            <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 space-y-1">
                                {form.getValues('components').filter(c => c.value).map(c => <li key={c.value}>{ancillaryProducts.find(p => p.id === c.value)?.name}</li>)}
                                {selectedPromotions?.filter(p => p.value).map(p => {
                                    const promoDetails = mockPromotionsData.find(promo => promo.id === p.value);
                                    return (
                                        <li key={p.value}>
                                            Promo Code Unlocked on Purchase ({promoDetails?.description})
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className="p-4 flex items-baseline gap-2 self-end border-t w-full mt-auto">
                           <span className="text-muted-foreground line-through">${totalComponentValue.toFixed(2)}</span>
                           <span className="text-2xl font-bold text-primary">${finalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
             </Card>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{bundle ? 'Save Changes' : 'Create Offer'}</Button>
        </div>
      </form>
    </Form>
  );
}
