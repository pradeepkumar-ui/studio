
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
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

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
  selectedParameters: z.array(z.string()).optional(),
  customParameters: z.object(
    Object.keys(parameterCategories).reduce((acc, key) => {
      acc[key] = z.array(customParamSchema).optional();
      return acc;
    }, {} as Record<string, z.ZodOptional<z.ZodArray<typeof customParamSchema>>>)
  ).optional(),
  newCategories: z.array(customCategorySchema).optional(),
});

export default function AIConfigurationPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedParameters: ["frequent_flyer_status", "travel_purpose", "origin_destination", "date_time", "inventory_availability"],
      customParameters: {},
      newCategories: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "newCategories",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Saving AI configuration:", values);
    toast({
      title: 'Configuration Saved',
      description: 'The AI parameters have been successfully updated.',
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          AI Offer Configuration
        </h1>
        <p className="text-muted-foreground">
          Manage the parameters the AI should consider when generating offers.
        </p>
      </div>

       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Parameters for AI Consideration</CardTitle>
                    <CardDescription>
                        Select the parameters the AI should use to construct offers. These settings will apply to the 'Offer Composer'.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="selectedParameters"
                        render={() => (
                        <FormItem>
                            <div className="mb-4">
                            <FormLabel className="text-base font-semibold">Predefined Parameters</FormLabel>
                            </div>
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
                                                        );
                                                }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {item.label}
                                            </FormLabel>
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
                        <FormLabel className="text-base font-semibold">Additional Categories & Parameters</FormLabel>
                        <p className="text-sm text-muted-foreground">Add any extra categories or parameters for the AI.</p>
                        <div className="space-y-4 mt-4">
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
                </CardContent>
            </Card>
             <div className="flex justify-end">
                <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                </Button>
            </div>
        </form>
      </Form>
    </div>
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

