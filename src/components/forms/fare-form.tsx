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
import { DollarSign, CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { MultiSelect } from '../ui/multi-select';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { Timestamp } from 'firebase/firestore';

const scopeSchema = z.object({
    type: z.enum(['route-one-to-many', 'route-many-to-one', 'source', 'destination']).default('route-one-to-many'),
    source: z.array(z.string()).optional(),
    destination: z.array(z.string()).optional(),
});

const daysOfWeek = [
    { id: 'mon', label: 'Mon' },
    { id: 'tue', label: 'Tue' },
    { id: 'wed', label: 'Wed' },
    { id: 'thu', label: 'Thu' },
    { id: 'fri', label: 'Fri' },
    { id: 'sat', label: 'Sat' },
    { id: 'sun', label: 'Sun' },
] as const;

const fareSchema = z.object({
  id: z.string().optional(),
  fareBasisCode: z.string().min(1, 'Fare Basis Code is required.'),
  cabinClass: z.enum(['Economy', 'Premium Economy', 'Business', 'First', 'All']),
  scopes: z.array(scopeSchema).min(1, 'At least one scope must be defined.'),
  tripTypes: z.array(z.string()).min(1, "At least one trip type is required."),
  passengerTypes: z.array(z.string()).min(1, "At least one passenger type is required."),
  pointOfSale: z.array(z.string()).optional(),
  travelDate: z.object({ from: z.date().optional(), to: z.date().optional() }).optional(),
  travelDaysOfWeek: z.array(z.string()).optional(),
  bookingDate: z.object({ from: z.date().optional(), to: z.date().optional() }).optional(),
  bookingDaysOfWeek: z.array(z.string()).optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  refundability: z.enum(['Allowed', 'Allowed with Penalty', 'Not Allowed']),
  exchangeability: z.enum(['Allowed', 'Allowed with Penalty', 'Not Allowed']),
  transferability: z.enum(['Allowed', 'Not Allowed']),
  status: z.enum(['Active', 'Inactive', 'Draft']),
  version: z.number().optional(),
  route: z.string().optional(),
  class: z.string().optional(),
  validity: z.object({ effectiveDate: z.date(), expiryDate: z.date() }).optional(),
});

export type Fare = z.infer<typeof fareSchema>;

interface FareFormProps {
  fare: Fare | null;
  onSubmit: (data: Fare) => void;
  onCancel: () => void;
}

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

const posOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IN', label: 'India' },
    { value: 'SG', label: 'Singapore' },
    { value: 'AU', label: 'Australia' },
    { value: 'ALL', label: 'All' },
];

const tripTypeOptions = [
    { value: 'one_way', label: 'One Way' },
    { value: 'return', label: 'Return' },
    { value: 'multi_city', label: 'Multi-city' },
];

const passengerTypeOptions = [
    { value: 'ADT', label: 'Adult' },
    { value: 'CHD', label: 'Child' },
    { value: 'INF', label: 'Infant' },
];

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

export function FareForm({ fare, onSubmit, onCancel }: FareFormProps) {
  const form = useForm<Fare>({
    resolver: zodResolver(fareSchema),
    defaultValues: fare ? {
      ...fare,
      travelDate: {
          from: fare.validity?.effectiveDate,
          to: fare.validity?.expiryDate,
      },
      bookingDate: {
          from: new Date(),
          to: new Date(new Date().setDate(new Date().getDate() + 15)),
      }
    } : {
      fareBasisCode: '',
      cabinClass: 'Economy',
      scopes: [{ type: 'route-one-to-many', source: [], destination: [] }],
      tripTypes: ['one_way', 'return'],
      passengerTypes: ['ADT'],
      pointOfSale: ['US'],
      travelDate: {},
      travelDaysOfWeek: [],
      bookingDate: {},
      bookingDaysOfWeek: [],
      price: 0,
      currency: 'INR',
      refundability: 'Allowed with Penalty',
      exchangeability: 'Allowed with Penalty',
      transferability: 'Not Allowed',
      status: 'Draft',
    },
  });
    
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "scopes",
  });

  const handleFormSubmit = (data: Fare) => {
    const routeString = data.scopes.map(getRouteStringFromScope).join('; ');
    onSubmit({ ...data, route: routeString, class: data.cabinClass });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="fareBasisCode"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fare Basis Code (FBC)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., YFLEX" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="cabinClass"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Cabin Class</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select cabin class" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Economy">Economy</SelectItem>
                            <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="First">First</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <Separator />
        <h4 className="text-md font-semibold">Scope & Routing</h4>
        <div className="space-y-4">
            {fields.map((field, index) => {
                const scopeType = form.watch(`scopes.${index}.type`);
                return (
                <Card key={field.id} className="p-4 relative bg-muted/50 border-dashed">
                     <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => remove(index)} disabled={fields.length <= 1} >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="p-0 space-y-4">
                        <FormField control={form.control} name={`scopes.${index}.type`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Routing Logic</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select routing logic" /></SelectTrigger></FormControl>
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
                                <FormField control={form.control} name={`scopes.${index}.source`} render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Origin Node</FormLabel>
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
                                        <FormLabel>Target Destinations</FormLabel>
                                        <MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select target nodes..."/>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        )}
                        {scopeType === 'route-many-to-one' && (
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name={`scopes.${index}.source`} render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Origin Nodes</FormLabel>
                                        <MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select origins..."/>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name={`scopes.${index}.destination`} render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Target Destination</FormLabel>
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
                         {scopeType === 'source' && (
                             <FormField control={form.control} name={`scopes.${index}.source`} render={({field}) => (
                                <FormItem>
                                    <FormLabel>Source Airports (Any Destination)</FormLabel>
                                    <MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select source nodes..."/>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}
                        {scopeType === 'destination' && (
                            <FormField control={form.control} name={`scopes.${index}.destination`} render={({field}) => (
                                <FormItem>
                                    <FormLabel>Destination Airports (Any Source)</FormLabel>
                                    <MultiSelect options={airportOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select target nodes..."/>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}
                    </CardContent>
                </Card>
            )})}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ type: 'route-one-to-many', source: [], destination: [] })} >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Scope Block
            </Button>
        </div>

        <Separator />
        <h4 className="text-md font-semibold">Eligibility Conditions</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="tripTypes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Trip Type Compatibility</FormLabel>
                        <MultiSelect options={tripTypeOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select trip types..."/>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="passengerTypes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Eligible Passenger Types</FormLabel>
                        <MultiSelect options={passengerTypeOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select passenger types..."/>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
            control={form.control}
            name="pointOfSale"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Market / Point of Sale (POS)</FormLabel>
                 <MultiSelect options={posOptions} selected={field.value || []} onChange={field.onChange} placeholder="Select markets..."/>
                 <FormDescription>Restrict this fare to specific geographical markets.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <Separator />
        <h4 className="text-md font-semibold">Temporal Constraints</h4>
        <div>
            <FormLabel>Travel Window</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <FormField control={form.control} name="travelDate" render={({ field }) => (
                    <FormItem>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value?.from && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value?.from ? (field.value.to ? <>{format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}</> : format(field.value.from, "LLL dd, y")) : <span>Pick travel date range</span>}</Button></FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar initialFocus mode="range" defaultMonth={field.value?.from} selected={field.value as any} onSelect={field.onChange} numberOfMonths={2} /></PopoverContent>
                        </Popover>
                    </FormItem>
                )} />
                 <FormField control={form.control} name="travelDaysOfWeek" render={() => (
                    <FormItem>
                        <div className="flex flex-wrap gap-x-3 gap-y-2 items-center h-full">
                            {daysOfWeek.map((item) => (<FormField key={item.id} control={form.control} name="travelDaysOfWeek" render={({ field }) => (<FormItem key={item.id} className="flex flex-row items-start space-x-2 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))}} /></FormControl><FormLabel className="font-normal text-xs">{item.label}</FormLabel></FormItem>)} />))}
                        </div>
                    </FormItem>
                )}/>
            </div>
        </div>
         <div>
            <FormLabel>Booking / Filing Window</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <FormField control={form.control} name="bookingDate" render={({ field }) => (
                    <FormItem>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value?.from && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value?.from ? (field.value.to ? <>{format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}</> : format(field.value.from, "LLL dd, y")) : <span>Pick booking window</span>}</Button></FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar initialFocus mode="range" defaultMonth={field.value?.from} selected={field.value as any} onSelect={field.onChange} numberOfMonths={2} /></PopoverContent>
                        </Popover>
                    </FormItem>
                )} />
                 <FormField control={form.control} name="bookingDaysOfWeek" render={() => (
                    <FormItem>
                        <div className="flex flex-wrap gap-x-3 gap-y-2 items-center h-full">
                            {daysOfWeek.map((item) => (<FormField key={item.id} control={form.control} name="bookingDaysOfWeek" render={({ field }) => (<FormItem key={item.id} className="flex flex-row items-start space-x-2 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))}} /></FormControl><FormLabel className="font-normal text-xs">{item.label}</FormLabel></FormItem>)} />))}
                        </div>
                    </FormItem>
                )}/>
            </div>
        </div>
        
        <Separator />
        <h4 className="text-md font-semibold">Commercial Pricing</h4>

        <div className="flex gap-4">
            <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem className="flex-1">
                <FormLabel>Base Price (excluding taxes)</FormLabel>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                        <Input type="number" placeholder="e.g., 350" {...field} className="pl-9" />
                    </FormControl>
                </div>
                <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="currency" render={({ field }) => (
                <FormItem>
                <FormLabel>ISO Currency</FormLabel>
                <FormControl>
                    <Input placeholder="USD" {...field} className="w-24 uppercase" maxLength={3} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )} />
        </div>
        
        <Separator />
        <h4 className="text-md font-semibold">Fare Integrity: Service Rules</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="refundability"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Refund Policy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a rule" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Allowed">Fully Refundable</SelectItem>
                        <SelectItem value="Allowed with Penalty">Refundable with Fee</SelectItem>
                        <SelectItem value="Not Allowed">Non-Refundable</SelectItem>
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
                    <FormLabel>Change Policy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a rule" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Allowed">Free Changes</SelectItem>
                        <SelectItem value="Allowed with Penalty">Changes with Fee</SelectItem>
                        <SelectItem value="Not Allowed">No Changes Permitted</SelectItem>
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
                    <FormLabel>Name Changes</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a rule" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Allowed">Name Transfer Allowed</SelectItem>
                        <SelectItem value="Not Allowed">Name Change Forbidden</SelectItem>
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
              <FormLabel>Filing Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Live (Published)</SelectItem>
                  <SelectItem value="Inactive">Deactivated</SelectItem>
                  <SelectItem value="Draft">Draft (Internal)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-background py-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
            </Button>
            <Button type="submit" className="px-8">{fare ? 'Save Changes' : 'Create Base Fare'}</Button>
        </div>
      </form>
    </Form>
  );
}
