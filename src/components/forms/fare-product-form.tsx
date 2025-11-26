
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
import { PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const ancillaryOptions = [
    { id: 'ANC-001', label: '1st Checked Bag (23kg)', price: 35 },
    { id: 'ANC-007', label: '2nd Checked Bag (23kg)', price: 50 },
    { id: 'ANC-008', label: 'Oversize Baggage', price: 100 },
    { id: 'ANC-002', label: 'Extra Legroom Seat', price: 50 },
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
    priceModificationType: z.enum(['PERCENTAGE', 'ABSOLUTE']),
    priceModificationValue: z.coerce.number(),
});

const fareProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  status: z.enum(['Active', 'Draft']),
  version: z.number().optional(),
  
  scopes: z.array(scopeSchema).min(1, 'At least one scope must be defined.'),

  refundability: z.enum(['Allowed', 'Allowed with Penalty', 'Not Allowed']),
  exchangeability: z.enum(['Allowed', 'Allowed with Penalty', 'Not Allowed']),
  transferability: z.enum(['Allowed', 'Not Allowed']),

  includedAncillaries: z.array(z.string()).optional(),
  route: z.string().optional(), // For display only
  priceModificationType: z.enum(['PERCENTAGE', 'ABSOLUTE']).optional(),
  priceModificationValue: z.coerce.number().optional(),
});

export type FareProduct = z.infer<typeof fareProductSchema>;

interface FareProductFormProps {
  product: FareProduct | null;
  onSubmit: (data: FareProduct) => void;
  onCancel: () => void;
}

const getRouteStringFromScope = (scope: z.infer<typeof scopeSchema>): string => {
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

export function FareProductForm({ product, onSubmit, onCancel }: FareProductFormProps) {
  const form = useForm<FareProduct>({
    resolver: zodResolver(fareProductSchema),
    defaultValues: product ? {
        ...product,
        scopes: product.scopes || [{
            type: 'route-one-to-many',
            source: [],
            destination: [],
            priceModificationType: product.priceModificationType || 'PERCENTAGE',
            priceModificationValue: product.priceModificationValue || 0,
        }]
    } : {
      name: '',
      description: '',
      status: 'Draft',
      scopes: [{
        type: 'route-one-to-many',
        source: [],
        destination: [],
        priceModificationType: 'PERCENTAGE',
        priceModificationValue: 10,
      }],
      refundability: 'Allowed with Penalty',
      exchangeability: 'Allowed with Penalty',
      transferability: 'Not Allowed',
      includedAncillaries: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "scopes",
  });

  const handleFormSubmit = (data: FareProduct) => {
    // Create a summarized route string for display purposes
    const routeString = data.scopes.map(getRouteStringFromScope).join('; ');
    // For now, we will just take the first pricing rule for the top-level display
    const firstScope = data.scopes[0];
    onSubmit({ 
        ...data, 
        route: routeString, 
        priceModificationType: firstScope.priceModificationType, 
        priceModificationValue: firstScope.priceModificationValue 
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Economy Flex" {...field} />
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
                <Textarea placeholder="Describe the product and its key features." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        
        <h4 className="text-md font-semibold">Scope & Pricing</h4>
        
        <div className="space-y-4">
            {fields.map((field, index) => (
                <Card key={field.id} className="p-4 relative bg-muted/50">
                     <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 h-6 w-6" 
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="p-0 space-y-4">
                        <FormField
                            control={form.control}
                            name={`scopes.${index}.type`}
                            render={({ field }) => (
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
                            )}
                        />
                       
                        {form.watch(`scopes.${index}.type`) === 'route-one-to-many' && (
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name={`scopes.${index}.source`} render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Origin</FormLabel>
                                        <Select onValueChange={(value) => field.onChange([value])} defaultValue={field.value?.[0]}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select origin..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {airportOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name={`scopes.${index}.destination`} render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Destinations</FormLabel>
                                        <MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select..."/>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        )}
                        {form.watch(`scopes.${index}.type`) === 'route-many-to-one' && (
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name={`scopes.${index}.source`} render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Origins</FormLabel>
                                        <MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select..."/>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name={`scopes.${index}.destination`} render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Destination</FormLabel>
                                        <Select onValueChange={(value) => field.onChange([value])} defaultValue={field.value?.[0]}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select destination..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {airportOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        )}
                         {form.watch(`scopes.${index}.type`) === 'source' && (
                             <FormField control={form.control} name={`scopes.${index}.source`} render={({field}) => (
                                <FormItem>
                                    <FormLabel>Source Airports</FormLabel>
                                    <MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select..."/>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}
                        {form.watch(`scopes.${index}.type`) === 'destination' && (
                            <FormField control={form.control} name={`scopes.${index}.destination`} render={({field}) => (
                                <FormItem>
                                    <FormLabel>Destination Airports</FormLabel>
                                    <MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select..."/>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <FormField
                                control={form.control}
                                name={`scopes.${index}.priceModificationType`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price Adjustment Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                        <SelectItem value="ABSOLUTE">Absolute ($)</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`scopes.${index}.priceModificationValue`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adjustment Value</FormLabel>
                                    <FormControl>
                                    <Input type="number" placeholder="e.g., 10 or -25" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ type: 'route-one-to-many', source: [], destination: [], priceModificationType: 'PERCENTAGE', priceModificationValue: 0 })}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Scope & Pricing Block
            </Button>
        </div>

        <Separator />
        <h4 className="text-md font-semibold">Included Ancillaries (Free of Charge)</h4>
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
                                    render={({ field }) => {
                                    return (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <FormItem
                                                key={item.id}
                                                className="flex flex-row items-center space-x-3 space-y-0"
                                                >
                                                <FormControl>
                                                    <Checkbox
                                                    checked={field.value?.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                        ? field.onChange([...(field.value || []), item.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                                (value) => value !== item.id
                                                            )
                                                            )
                                                    }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">
                                                    {item.label}
                                                </FormLabel>
                                                </FormItem>
                                            </TooltipTrigger>
                                             <TooltipContent>
                                                <p>Default Price: ${item.price}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )
                                    }}
                                />
                            ))}
                        </TooltipProvider>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />


        <Separator />
        <h4 className="text-md font-semibold">Service Terms</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="refundability"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Refundability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a rule" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Allowed">Allowed</SelectItem>
                        <SelectItem value="Allowed with Penalty">Allowed with Penalty</SelectItem>
                        <SelectItem value="Not Allowed">Not Allowed</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="exchangeability"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Exchangeability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a rule" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Allowed">Allowed</SelectItem>
                        <SelectItem value="Allowed with Penalty">Allowed with Penalty</SelectItem>
                        <SelectItem value="Not Allowed">Not Allowed</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="transferability"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Transferability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a rule" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Allowed">Allowed</SelectItem>
                        <SelectItem value="Not Allowed">Not Allowed</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <Separator />

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
                  <SelectItem value="Active">Active</SelectItem>
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
            <Button type="submit">{product ? 'Save Changes' : 'Create Branded Fare'}</Button>
        </div>
      </form>
    </Form>
  );
}
