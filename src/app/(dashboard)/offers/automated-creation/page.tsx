
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

const formSchema = z.object({
  selectedParameters: z.array(z.string()).optional(),
  additionalParameters: z.array(z.object({ category: z.string(), parameter: z.string() })).optional(),
});

export default function AIConfigurationPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedParameters: ["frequent_flyer_status", "travel_purpose", "origin_destination", "date_time", "inventory_availability"],
      additionalParameters: [{ category: '', parameter: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalParameters",
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
                                </AccordionContent>
                                </AccordionItem>
                            ))}
                            </Accordion>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <div>
                        <FormLabel className="text-base font-semibold">Additional Parameters</FormLabel>
                        <p className="text-sm text-muted-foreground">Add any extra categories or parameters for the AI.</p>
                        <div className="space-y-2 mt-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name={`additionalParameters.${index}.category`}
                                render={({ field }) => (
                                <Input {...field} placeholder="Category (e.g., Competitor Actions)" />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`additionalParameters.${index}.parameter`}
                                render={({ field }) => (
                                <Input {...field} placeholder="Parameter (e.g., Delta launched a sale on LHR-JFK)" className="flex-1" />
                                )}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 1 && fields[0].category === '' && fields[0].parameter === ''}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ category: "", parameter: "" })}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Parameter
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
