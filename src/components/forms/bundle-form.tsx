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
import { PlusCircle, Trash2, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { MultiSelect } from '../ui/multi-select';

const ancillaryProducts = [
  { id: 'ANC-001', name: '1st Checked Bag (23kg)', price: 35 },
  { id: 'ANC-002', name: 'Extra Legroom Seat', price: 50 },
  { id: 'ANC-003', name: 'In-flight Wi-Fi', price: 8 },
  { id: 'ANC-004', name: 'Priority Boarding', price: 15 },
  { id: 'ANC-006', name: 'Lounge Access', price: 45 },
  { id: 'ANC-010', name: 'Premium Meal', price: 25 },
  { id: 'ANC-011', name: 'Cancel for any reason', price: 40 },
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


const bundleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Bundle name is required.'),
  description: z.string().min(5, 'Description is required.'),
  status: z.enum(['Draft', 'Published', 'Archived']),
  scope: z.object({
    brand: z.array(z.string()).optional(),
    channel: z.array(z.string()).optional(),
    route: z.string().optional(),
    cohorts: z.array(z.string()).optional(),
  }),
  components: z.array(z.object({ value: z.string().min(1, "Please select an ancillary.") })).min(1, "At least one ancillary component is required."),
  pricingStrategy: z.enum(['Percent Discount', 'Fixed Discount', 'Absolute Price']),
  discount: z.coerce.number().min(0),
  validity: z.object({
    effectiveDate: z.date(),
    expiryDate: z.date(),
  }).optional(),
  itemCount: z.number().optional()
});

export type Bundle = z.infer<typeof bundleSchema>;

interface BundleFormProps {
  bundle: Bundle | null;
  onSubmit: (data: Bundle) => void;
  onCancel: () => void;
}

const parseScope = (bundle: Bundle | null) => {
    if (!bundle || !bundle.scope) return { brand: [], channel: [], route: '', cohorts: []};
    return {
        brand: Array.isArray(bundle.scope.brand) ? bundle.scope.brand : (bundle.scope.brand ? (bundle.scope.brand as string).split(',').map(s => s.trim()) : []),
        channel: Array.isArray(bundle.scope.channel) ? bundle.scope.channel : (bundle.scope.channel ? (bundle.scope.channel as string).split(',').map(s => s.trim()) : []),
        route: bundle.scope.route,
        cohorts: Array.isArray(bundle.scope.cohorts) ? bundle.scope.cohorts : (bundle.scope.cohorts ? (bundle.scope.cohorts as string).split(',').map(s => s.trim()) : []),
    }
}


export function BundleForm({ bundle, onSubmit, onCancel }: BundleFormProps) {
  const form = useForm<Bundle>({
    resolver: zodResolver(bundleSchema),
    defaultValues: bundle ? {
      ...bundle,
      components: Array.isArray(bundle.components) ? Object.values(bundle.components).filter(c => typeof c === 'string').map(c => ({ value: c })) : [],
      scope: parseScope(bundle),
      validity: {
        effectiveDate: new Date(),
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      }
    } : {
      name: '',
      description: '',
      status: 'Draft',
      scope: {
        brand: [],
        channel: [],
        route: '',
        cohorts: [],
      },
      components: [{value: ''}],
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
        itemCount: data.components.filter(c => c.value).length,
        components: componentObject,
        scope: {
          ...data.scope,
          brand: data.scope.brand?.join(', '),
          channel: data.scope.channel?.join(', '),
          cohorts: data.scope.cohorts?.join(', '),
        }
    };
    
    onSubmit(finalData as any);
  }

  const selectedComponents = form.watch('components');
  const totalComponentValue = selectedComponents.reduce((total, current) => {
    const product = ancillaryProducts.find(p => p.id === current.value);
    return total + (product ? product.price : 0);
  }, 0);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        
        <h4 className="text-md font-semibold">Identity</h4>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bundle Name</FormLabel>
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
        
        <Separator className="my-6" />

        <h4 className="text-md font-semibold">Scope & Rules</h4>
        <p className="text-sm text-muted-foreground -mt-2">Define the conditions under which this bundle is available.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField control={form.control} name="scope.brand" render={({field}) => <FormItem><FormLabel>Fare Brands</FormLabel><MultiSelect options={fareBrandOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select brands..."/><FormMessage/></FormItem>} />
            <FormField control={form.control} name="scope.channel" render={({field}) => <FormItem><FormLabel>Channels</FormLabel><MultiSelect options={channelOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select channels..."/><FormMessage/></FormItem>} />
            <FormField control={form.control} name="scope.route" render={({field}) => <FormItem><FormLabel>Routes</FormLabel><FormControl><Input {...field} placeholder="e.g., JFK-MIA, LHR-*" /></FormControl><FormMessage/></FormItem>} />
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
            Add Component
          </Button>
        </div>


        <Separator className="my-6" />

        <h4 className="text-md font-semibold">Pricing</h4>
        <div className="rounded-md border bg-muted p-3 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Total Component Value</span>
                <span className="font-semibold">${totalComponentValue.toFixed(2)}</span>
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
        
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{bundle ? 'Save Changes' : 'Create Bundle'}</Button>
        </div>
      </form>
    </Form>
  );
}
