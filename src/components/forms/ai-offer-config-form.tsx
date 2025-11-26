'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Save, CalendarIcon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

const parameterCategories = {
  "Passenger Profile & Personal Attributes": [
    { id: "passenger_name_age_gender", label: "Passenger name, age, gender" },
    { id: "frequent_flyer_status", label: "Frequent flyer status / loyalty tier" },
    { id: "previous_booking_history", label: "Previous booking history" },
    { id: "travel_purpose", label: "Travel purpose (business/leisure)" },
    { id: "preferred_airline_alliance", label: "Preferred airline / alliance" },
    { id: "preferred_meals_seat_type", label: "Preferred meals / seat type" },
    { id: "travel_patterns", label: "Travel patterns (seasonal, destination repeat)" },
    { id: "spend_pattern", label: "Spend pattern / average ticket value" },
  ],
  "Flight / Trip Details": [
    { id: "origin_destination", label: "Origin & destination" },
    { id: "date_time", label: "Date & time" },
    { id: "cabin_requested", label: "Cabin requested (if any)" },
    { id: "fare_family_selected", label: "Fare family selected" },
    { id: "trip_type", label: "Trip type (one-way/return/multicity)" },
    { id: "number_of_travelers", label: "Number of travelers & type (adult/child/infant)" },
    { id: "layovers_duration", label: "Layovers & duration" },
    { id: "airline_codeshare", label: "Airline & codeshare options" },
  ],
  "Contextual & Behavioral Signals": [
    { id: "device_used", label: "Device used (mobile/web/app)" },
    { id: "search_history", label: "Search history / abandoned bookings" },
    { id: "look_to_book_ratio", label: "Look-to-book ratio" },
    { id: "time_since_search_start", label: "Time since search start" },
    { id: "geo_location", label: "Geo-location" },
  ],
  "Commercial & Airline Business Rules": [
    { id: "current_promotions", label: "Current promotions / campaigns" },
    { id: "route_profitability_targets", label: "Route-profitability targets" },
    { id: "inventory_availability", label: "Inventory availability" },
    { id: "corporate_contracts", label: "Corporate contracts" },
    { id: "alliances_codeshare", label: "Alliances / code-share partnership incentives" },
    { id: "fare_filing_atpco", label: "Fare filing & ATPCO rules" },
  ],
  "Real-Time Revenue Management Inputs": [
    { id: "demand_level", label: "Demand level / forecast load factor" },
    { id: "competitor_fare_monitoring", label: "Competitor fare monitoring" },
    { id: "seasonality_events", label: "Seasonality / events" },
  ],
};

const customParamSchema = z.object({ value: z.string().min(1, "Parameter cannot be empty.") });
const customCategorySchema = z.object({
  name: z.string().min(1, "Category name cannot be empty."),
  parameters: z.array(customParamSchema),
});

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, 'Configuration name is required.'),
  status: z.enum(['Draft', 'Active', 'Inactive']),
  validity: z.object({ from: z.date(), to: z.date() }),
  selectedParameters: z.array(z.string()).optional(),
  customParameters: z.object(
    Object.keys(parameterCategories).reduce((acc, key) => {
      acc[key] = z.array(customParamSchema).optional();
      return acc;
    }, {} as Record<string, z.ZodOptional<z.ZodArray<typeof customParamSchema>>>)
  ).optional(),
  newCategories: z.array(customCategorySchema).optional(),
});

export type AiOfferConfig = z.infer<typeof formSchema>;

interface AiOfferConfigFormProps {
    config: AiOfferConfig | null;
    onSubmit: (data: AiOfferConfig) => void;
    onCancel: () => void;
}

export function AiOfferConfigForm({ config, onSubmit, onCancel }: AiOfferConfigFormProps) {
  const form = useForm<AiOfferConfig>({
    resolver: zodResolver(formSchema),
    defaultValues: config || {
      name: '',
      status: 'Draft',
      validity: { from: new Date(), to: addDays(new Date(), 30) },
      selectedParameters: ["frequent_flyer_status", "travel_purpose", "origin_destination", "date_time", "inventory_availability"],
      customParameters: {},
      newCategories: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "newCategories",
  });

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Configuration Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Q4 Holiday Push" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
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
            </div>
             <FormField
                control={form.control}
                name="validity"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Validity Period</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                >
                                    {field.value?.from ? (field.value.to ? (<>{format(field.value.from, 'LLL dd, y')} - {format(field.value.to, 'LLL dd, y')}</>) : (format(field.value.from, 'LLL dd, y'))) : (<span>Pick a date range</span>)}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={field.value?.from}
                                selected={{ from: field.value.from, to: field.value.to }}
                                onSelect={(range) => range && form.setValue('validity', range as { from: Date, to: Date })}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
            
            <Separator />
            <h3 className="text-lg font-semibold">Parameters for AI Consideration</h3>
            
            <FormField
                control={form.control}
                name="selectedParameters"
                render={() => (
                <FormItem>
                    <Accordion type="multiple" className="w-full" defaultValue={Object.keys(parameterCategories)}>
                    {Object.entries(parameterCategories).map(([category, params]) => (
                        <AccordionItem value={category} key={category}>
                        <AccordionTrigger>{category}</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                            {params.map((item) => (
                                <FormField
                                key={item.id}
                                control={form.control}
                                name="selectedParameters"
                                render={({ field }) => (
                                    <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(field.value?.filter((value) => value !== item.id));
                                        }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                )}
                                />
                            ))}
                            </div>
                            <Separator className="my-4" />
                            <p className="text-xs font-semibold text-muted-foreground px-2 mb-2">Custom parameters for this category:</p>
                                <div className="px-2 space-y-2">
                                <CustomParameterFields category={category} form={form} />
                                </div>
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div>
                <h4 className="text-md font-semibold">Additional Categories & Parameters</h4>
                <div className="space-y-4 mt-2">
                    {fields.map((field, index) => (
                    <Card key={field.id} className="bg-muted/30 p-4">
                        <div className="flex justify-between items-center mb-2">
                        <FormField
                            control={form.control}
                            name={`newCategories.${index}.name`}
                            render={({ field }) => (
                            <FormItem className="flex-1 mr-2">
                                <FormLabel className="sr-only">Category Name</FormLabel>
                                <Input {...field} placeholder="New Category Name" className="font-semibold" />
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                        <CustomParameterFields category={`newCategories.${index}.parameters`} form={form} isNewCategory />
                    </Card>
                    ))}
                    <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", parameters: [{ value: "" }] })}
                    >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Category
                    </Button>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-6">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                </Button>
            </div>
        </form>
      </Form>
  );
}

// Helper component for dynamic custom fields
function CustomParameterFields({ category, form, isNewCategory = false }: { category: string, form: any, isNewCategory?: boolean }) {
  const fieldName = isNewCategory ? category : `customParameters.${category}`;
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name={`${fieldName}.${index}.value`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} placeholder="New parameter..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Parameter
      </Button>
    </div>
  );
}