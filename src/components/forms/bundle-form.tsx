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

const ancillaryProducts = [
  { id: 'ANC-001', name: '1st Checked Bag (23kg)' },
  { id: 'ANC-002', name: 'Extra Legroom Seat' },
  { id: 'ANC-003', name: 'In-flight Wi-Fi' },
  { id: 'ANC-004', name: 'Priority Boarding' },
  { id: 'ANC-006', name: 'Lounge Access' },
];

const bundleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Bundle name is required.'),
  description: z.string().min(5, 'Description is required.'),
  status: z.enum(['Draft', 'Published', 'Archived']),
  scope: z.object({
    brand: z.string().optional(),
    channel: z.string().optional(),
    route: z.string().optional(),
    cohorts: z.string().optional(),
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

export function BundleForm({ bundle, onSubmit, onCancel }: BundleFormProps) {
  const form = useForm<Bundle>({
    resolver: zodResolver(bundleSchema),
    defaultValues: bundle ? {
      ...bundle,
      components: Array.isArray(bundle.components) ? bundle.components.map(c => ({ value: c.seat || c.baggage || c.meal || c.other || '' })) : [],
      validity: {
        effectiveDate: new Date(),
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      }
    } : {
      name: '',
      description: '',
      status: 'Draft',
      scope: {
        brand: '',
        channel: '',
        route: '',
        cohorts: '',
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
    const itemCount = data.components.filter(c => c.value).length;
    onSubmit({ ...data, itemCount });
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
        <p className="text-sm text-muted-foreground -mt-2">Define the conditions under which this bundle is available. Use comma-separated values.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField control={form.control} name="scope.brand" render={({field}) => <FormItem><FormLabel>Fare Brands</FormLabel><FormControl><Input {...field} placeholder="e.g., Flex, Premium" /></FormControl><FormMessage/></FormItem>} />
            <FormField control={form.control} name="scope.channel" render={({field}) => <FormItem><FormLabel>Channels</FormLabel><FormControl><Input {...field} placeholder="e.g., Direct, TMC" /></FormControl><FormMessage/></FormItem>} />
            <FormField control={form.control} name="scope.route" render={({field}) => <FormItem><FormLabel>Routes</FormLabel><FormControl><Input {...field} placeholder="e.g., JFK-MIA, LHR-*" /></FormControl><FormMessage/></FormItem>} />
            <FormField control={form.control} name="scope.cohorts" render={({field}) => <FormItem><FormLabel>Target Cohorts</FormLabel><FormControl><Input {...field} placeholder="e.g., BusinessLoyal_IN" /></FormControl><FormMessage/></FormItem>} />
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
            {fields.map((field, index) => (
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
                 <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
