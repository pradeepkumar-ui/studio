
'use client';

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

const fareProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  status: z.enum(['Active', 'Draft']),
  version: z.number().optional(),
  
  scopeType: z.enum(['route', 'source', 'destination']).default('route'),
  route: z.string().optional(), // Keep for backward compatibility/display
  source: z.array(z.string()).optional(),
  destination: z.array(z.string()).optional(),
  
  priceModificationType: z.enum(['PERCENTAGE', 'ABSOLUTE']),
  priceModificationValue: z.coerce.number(),

  refundability: z.enum(['Allowed', 'Allowed with Penalty', 'Not Allowed']),
  exchangeability: z.enum(['Allowed', 'Allowed with Penalty', 'Not Allowed']),
  transferability: z.enum(['Allowed', 'Not Allowed']),

  includedAncillaries: z.array(z.string()).optional(),
});

export type FareProduct = z.infer<typeof fareProductSchema>;

interface FareProductFormProps {
  product: FareProduct | null;
  onSubmit: (data: FareProduct) => void;
  onCancel: () => void;
}

const getRouteString = (data: Partial<FareProduct>): string => {
    switch (data.scopeType) {
        case 'source':
            return `From: ${data.source?.join(', ') || 'N/A'}`;
        case 'destination':
            return `To: ${data.destination?.join(', ') || 'N/A'}`;
        case 'route':
        default:
             if (data.source?.length && data.destination?.length) {
                if (data.source.length > 1 || data.destination.length > 1) {
                    return `${data.source.join('/')} to ${data.destination.join('/')}`;
                }
                return `${data.source[0]}-${data.destination[0]}`;
            }
            return 'ANY-ANY';
    }
}

export function FareProductForm({ product, onSubmit, onCancel }: FareProductFormProps) {
  const form = useForm<FareProduct>({
    resolver: zodResolver(fareProductSchema),
    defaultValues: product ? {
        ...product,
        includedAncillaries: product.includedAncillaries || [],
    } : {
      name: '',
      description: '',
      status: 'Draft',
      scopeType: 'route',
      source: [],
      destination: [],
      priceModificationType: 'PERCENTAGE',
      priceModificationValue: 10,
      refundability: 'Allowed with Penalty',
      exchangeability: 'Allowed with Penalty',
      transferability: 'Not Allowed',
      includedAncillaries: [],
    },
  });

  const scopeType = form.watch('scopeType');

  const handleFormSubmit = (data: FareProduct) => {
    const routeString = getRouteString(data);
    onSubmit({ ...data, route: routeString });
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
             <FormField
                control={form.control}
                name="scopeType"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Scope Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select scope type" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="route">Route (OD Pair)</SelectItem>
                            <SelectItem value="source">Source (Origin)</SelectItem>
                            <SelectItem value="destination">Destination</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            {scopeType === 'route' && (
                <div className="grid grid-cols-2 gap-2">
                    <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Origin(s)</FormLabel>
                                <MultiSelect
                                    options={airportOptions}
                                    selected={field.value || []}
                                    onChange={field.onChange}
                                    placeholder="Select origins..."
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                           <FormItem>
                                <FormLabel>Destination(s)</FormLabel>
                                <MultiSelect
                                    options={airportOptions}
                                    selected={field.value || []}
                                    onChange={field.onChange}
                                    placeholder="Select destinations..."
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}
             {scopeType === 'source' && (
                <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Source Airports</FormLabel>
                             <MultiSelect
                                options={airportOptions}
                                selected={field.value || []}
                                onChange={field.onChange}
                                placeholder="Select source airports..."
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
             {scopeType === 'destination' && (
                 <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Destination Airports</FormLabel>
                             <MultiSelect
                                options={airportOptions}
                                selected={field.value || []}
                                onChange={field.onChange}
                                placeholder="Select destination airports..."
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>


        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="priceModificationType"
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
                name="priceModificationValue"
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
