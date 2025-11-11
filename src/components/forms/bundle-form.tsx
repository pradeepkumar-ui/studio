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
import { PlusCircle, Trash2 } from 'lucide-react';

const bundleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Bundle name is required.'),
  description: z.string().min(5, 'Description is required.'),
  status: z.enum(['Draft', 'Published', 'Archived']),
  scope: z.object({
    brand: z.array(z.object({ value: z.string() })).optional(),
    channel: z.array(z.object({ value: z.string() })).optional(),
    route: z.array(z.object({ value: z.string() })).optional(),
  }),
  components: z.object({
    seat: z.string().optional(),
    baggage: z.string().optional(),
    meal: z.string().optional(),
    other: z.string().optional(),
  }),
  pricingStrategy: z.enum(['Percent Discount', 'Fixed Discount', 'Absolute Price']),
  discount: z.coerce.number().min(0),
  itemCount: z.number().optional()
});

export type Bundle = z.infer<typeof bundleSchema>;

interface BundleFormProps {
  bundle: Bundle | null;
  onSubmit: (data: Bundle) => void;
  onCancel: () => void;
}

const parseStringToArray = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) return value.map(v => ({ value: v }));
    if (typeof value === 'string' && value.length > 0) return value.split(',').map(v => ({ value: v.trim() }));
    return [];
}

export function BundleForm({ bundle, onSubmit, onCancel }: BundleFormProps) {
  const form = useForm<Bundle>({
    resolver: zodResolver(bundleSchema),
    defaultValues: bundle ? {
        ...bundle,
        scope: {
            brand: parseStringToArray(bundle.scope.brand),
            channel: parseStringToArray(bundle.scope.channel),
            route: parseStringToArray(bundle.scope.route),
        }
    } : {
      name: '',
      description: '',
      status: 'Draft',
      scope: {
        brand: [],
        channel: [],
        route: [],
      },
      components: {
        seat: '',
        baggage: '',
        meal: '',
        other: ''
      },
      pricingStrategy: 'Percent Discount',
      discount: 10,
    },
  });

  const { fields: brandFields, append: appendBrand, remove: removeBrand } = useFieldArray({ control: form.control, name: "scope.brand" });
  const { fields: channelFields, append: appendChannel, remove: removeChannel } = useFieldArray({ control: form.control, name: "scope.channel" });
  const { fields: routeFields, append: appendRoute, remove: removeRoute } = useFieldArray({ control: form.control, name: "scope.route" });

  const handleFinalSubmit = (data: Bundle) => {
    const finalData = {
        ...data,
        scope: {
            brand: data.scope.brand?.map(item => item.value).filter(Boolean),
            channel: data.scope.channel?.map(item => item.value).filter(Boolean),
            route: data.scope.route?.map(item => item.value).filter(Boolean),
        }
    };
    onSubmit(finalData as any);
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
        <p className="text-sm text-muted-foreground -mt-2">Define the conditions under which this bundle is available.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
                <FormLabel>Fare Brands</FormLabel>
                {brandFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <FormField control={form.control} name={`scope.brand.${index}.value`} render={({field}) => <Input {...field} placeholder="e.g., Flex" />} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeBrand(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendBrand({ value: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Brand</Button>
            </div>
            <div className="space-y-2">
                <FormLabel>Channels</FormLabel>
                {channelFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <FormField control={form.control} name={`scope.channel.${index}.value`} render={({field}) => <Input {...field} placeholder="e.g., Direct" />} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeChannel(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendChannel({ value: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Channel</Button>
            </div>
            <div className="space-y-2">
                <FormLabel>Routes</FormLabel>
                {routeFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <FormField control={form.control} name={`scope.route.${index}.value`} render={({field}) => <Input {...field} placeholder="e.g., JFK-MIA" />} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeRoute(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendRoute({ value: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Route</Button>
            </div>
        </div>
        
        <h4 className="text-md font-semibold pt-4">Components</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <FormField
            control={form.control}
            name="components.seat"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Seat</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Front, Legroom" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="components.baggage"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Baggage</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 15kg, 23kg" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="components.meal"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Meal</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Veg, Child" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="components.other"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Other</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Wifi, Lounge" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
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
