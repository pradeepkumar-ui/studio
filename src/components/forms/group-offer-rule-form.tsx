
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
} from '@/components/ui/select';
import { Separator } from '../ui/separator';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

const discountTierSchema = z.object({
  minPassengers: z.coerce.number(),
  maxPassengers: z.coerce.number(),
  discount: z.coerce.number(),
});

const ancillaryAttachmentTierSchema = z.object({
  minAttachmentRate: z.coerce.number().min(0, "Rate must be between 0 and 100.").max(100, "Rate must be between 0 and 100."),
  discount: z.coerce.number().min(0, "Discount must be a positive number."),
});

const groupOfferRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Rule name must be at least 5 characters long.'),
  status: z.enum(['Active', 'Inactive', 'Draft']),
  market: z.string().min(2, 'Market is required (e.g., US, EU, ALL).'),
  passengerCount: z.object({
    min: z.coerce.number().min(10, 'Minimum passengers must be at least 10.'),
    max: z.coerce.number().min(10, 'Maximum passengers must be at least 10.'),
  }),
  travelDates: z.object({ from: z.date().optional(), to: z.date().optional() }).optional(),
  
  travelSolution: z.object({
    connectionPreference: z.enum(['Allow Connections', 'Non-stop Only', 'Prefer Non-stop']).default('Allow Connections'),
    codesharePolicy: z.enum(['Allow All', 'Exclude Specific', 'Include Specific']).default('Allow All'),
    partnerAirlines: z.string().optional(),
    coTerminals: z.string().optional(),
  }).optional(),

  priceAdjustment: z.coerce.number(),
  discountTiers: z.array(discountTierSchema).optional(),
  ancillaryAttachmentTiers: z.array(ancillaryAttachmentTierSchema).optional(),
  terms: z.string().min(10, 'Terms and conditions must be defined.'),
});

export type GroupOfferRule = z.infer<typeof groupOfferRuleSchema>;

interface GroupOfferRuleFormProps {
  rule: GroupOfferRule | null;
  onSubmit: (data: GroupOfferRule) => void;
  onCancel: () => void;
}

export function GroupOfferRuleForm({ rule, onSubmit, onCancel }: GroupOfferRuleFormProps) {
  const form = useForm<GroupOfferRule>({
    resolver: zodResolver(groupOfferRuleSchema),
    defaultValues: rule || {
      name: '',
      status: 'Draft',
      market: 'ALL',
      passengerCount: { min: 10, max: 100 },
      travelDates: { from: new Date(), to: addDays(new Date(), 365) },
      travelSolution: {
        connectionPreference: 'Allow Connections',
        codesharePolicy: 'Allow All',
        partnerAirlines: '',
        coTerminals: '',
      },
      priceAdjustment: 0,
      discountTiers: [{ minPassengers: 10, maxPassengers: 25, discount: 5 }],
      ancillaryAttachmentTiers: [],
      terms: 'Standard group travel terms apply. 10% deposit required within 14 days.',
    },
  });

  const { fields: discountFields, append: appendDiscount, remove: removeDiscount } = useFieldArray({
    control: form.control,
    name: "discountTiers",
  });
  
  const { fields: ancillaryFields, append: appendAncillary, remove: removeAncillary } = useFieldArray({
    control: form.control,
    name: "ancillaryAttachmentTiers",
  });
  
  const codesharePolicy = form.watch('travelSolution.codesharePolicy');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rule Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Student Group Discount (EU)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        <h4 className="text-md font-semibold">Scope</h4>
        
        <div className="grid grid-cols-3 gap-4">
            <FormField control={form.control} name="market" render={({ field }) => (<FormItem><FormLabel>Market</FormLabel><FormControl><Input placeholder="US, EU, APAC..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="passengerCount.min" render={({ field }) => (<FormItem><FormLabel>Min Passengers</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="passengerCount.max" render={({ field }) => (<FormItem><FormLabel>Max Passengers</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
        </div>
        
        <FormField
            control={form.control}
            name="travelDates"
            render={({ field }) => (
            <FormItem className="flex flex-col">
                <FormLabel>Travel Dates</FormLabel>
                <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                    <Button
                        variant={'outline'}
                        className={cn('w-full pl-3 text-left font-normal',!field.value?.from && 'text-muted-foreground')}
                    >
                        {field.value?.from ? (field.value.to ? (<>{format(field.value.from, 'LLL dd, y')} - {format(field.value.to, 'LLL dd, y')}</>) : (format(field.value.from, 'LLL dd, y'))) : (<span>Pick a date range</span>)}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar initialFocus mode="range" defaultMonth={field.value?.from} selected={field.value} onSelect={field.onChange} numberOfMonths={2}/>
                </PopoverContent>
                </Popover>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <Separator />
        <h4 className="text-md font-semibold">Travel Solution Selection</h4>

        <FormField control={form.control} name="travelSolution.connectionPreference" render={({ field }) => (
            <FormItem>
                <FormLabel>Connection Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select connection preference" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Allow Connections">Allow Connections</SelectItem>
                        <SelectItem value="Non-stop Only">Non-stop Only</SelectItem>
                        <SelectItem value="Prefer Non-stop">Prefer Non-stop</SelectItem>
                    </SelectContent>
                </Select>
            </FormItem>
        )}/>

        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="travelSolution.codesharePolicy" render={({ field }) => (
                <FormItem>
                    <FormLabel>Codeshare/Interline Policy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select partner policy" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Allow All">Allow All Partners</SelectItem>
                            <SelectItem value="Exclude Specific">Exclude Specific Partners</SelectItem>
                            <SelectItem value="Include Specific">Include Only Specific Partners</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            )}/>
            {(codesharePolicy === 'Exclude Specific' || codesharePolicy === 'Include Specific') && (
                <FormField control={form.control} name="travelSolution.partnerAirlines" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Partner Airline Codes</FormLabel>
                        <FormControl><Input placeholder="e.g., AA, DL, UA" {...field} /></FormControl>
                    </FormItem>
                )}/>
            )}
        </div>

        <FormField control={form.control} name="travelSolution.coTerminals" render={({ field }) => (
            <FormItem>
                <FormLabel>Co-terminal Airports (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., JFK, EWR, LGA; LHR, LGW" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )}/>


        <Separator />
        <h4 className="text-md font-semibold">Pricing</h4>

        <FormField control={form.control} name="priceAdjustment" render={({ field }) => (<FormItem><FormLabel>Base Fare Price Adjustment (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., -15 for 15% discount" {...field} /></FormControl><FormMessage /></FormItem>)}/>
        
        <div>
            <FormLabel>Tiered Fare Discounts (Optional)</FormLabel>
            <div className="space-y-2 mt-2">
                 {discountFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-4 gap-2 items-center">
                        <FormField control={form.control} name={`discountTiers.${index}.minPassengers`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Min Pax</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)}/>
                        <FormField control={form.control} name={`discountTiers.${index}.maxPassengers`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Max Pax</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)}/>
                        <FormField control={form.control} name={`discountTiers.${index}.discount`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Fare Discount (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)}/>
                        <Button type="button" variant="ghost" size="icon" className="self-end" onClick={() => removeDiscount(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendDiscount({ minPassengers: 0, maxPassengers: 0, discount: 0 })}><PlusCircle className="mr-2 h-4 w-4" /> Add Fare Tier</Button>
            </div>
        </div>

        <div className="pt-2">
            <FormLabel>Ancillary Attachment Discounts (Optional)</FormLabel>
            <FormDescription className="text-xs">
                Offer a discount on ancillaries based on the percentage of passengers in the group who purchase them.
            </FormDescription>
            <div className="space-y-2 mt-2">
                 {ancillaryFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-3 gap-2 items-center">
                        <FormField control={form.control} name={`ancillaryAttachmentTiers.${index}.minAttachmentRate`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Min Attachment Rate (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)}/>
                        <FormField control={form.control} name={`ancillaryAttachmentTiers.${index}.discount`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Ancillary Discount (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)}/>
                        <Button type="button" variant="ghost" size="icon" className="self-end" onClick={() => removeAncillary(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendAncillary({ minAttachmentRate: 50, discount: 30 })}><PlusCircle className="mr-2 h-4 w-4" /> Add Attachment Tier</Button>
            </div>
        </div>

        <Separator />
        <h4 className="text-md font-semibold">Terms & Conditions</h4>
        
        <FormField control={form.control} name="terms" render={({ field }) => (<FormItem><FormLabel>Terms & Conditions</FormLabel><FormControl><Textarea placeholder="Define payment, deposit, and cancellation rules..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
        
        <Separator />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
          <Button type="submit">{rule ? 'Save Changes' : 'Create Rule'}</Button>
        </div>
      </form>
    </Form>
  );
}
