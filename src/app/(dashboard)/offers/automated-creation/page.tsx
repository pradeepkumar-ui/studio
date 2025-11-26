
'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2, PlusCircle, Trash2, ClipboardCopy, FilePlus2, Lightbulb, Sparkles } from 'lucide-react';
import { generateAutomatedOffer, type GenerateAutomatedOfferOutput } from '@/ai/flows/generate-automated-offer';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import type { Bundle } from '@/components/forms/bundle-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
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

const formSchema = z.object({
  goal: z.string().min(10, 'Please describe the goal in at least 10 characters.'),
  targetMarket: z.string().min(3, 'Target market is required.'),
  constraints: z.string().optional(),
  selectedParameters: z.array(z.string()).optional(),
  additionalParameters: z.array(z.object({ category: z.string(), parameter: z.string() })).optional(),
});

export default function AutomatedOfferCreationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<GenerateAutomatedOfferOutput | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: '',
      targetMarket: '',
      constraints: '',
      selectedParameters: [],
      additionalParameters: [{ category: '', parameter: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalParameters",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAiResult(null);
    toast({
      title: 'Generating Offer...',
      description: 'The AI is creating a custom offer based on your parameters.',
    });

    try {
      const result = await generateAutomatedOffer(values);
      setAiResult(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate the offer. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateOffer = async () => {
    if (!aiResult) return;

    try {
      const newOffer = JSON.parse(aiResult.offerJson);

      if (!firestore) {
        throw new Error("Firestore not available");
      }
      
      const offerToSave: Partial<Bundle> = {
          ...newOffer,
          source: 'AI',
          createdAt: serverTimestamp(),
      }

      await addDoc(collection(firestore, "bundles"), offerToSave);

      toast({
        title: 'AI Offer Created!',
        description: `Offer "${newOffer.name}" has been created and is now available.`,
      });

      router.push('/bundles');
    } catch (e) {
      console.error("Failed to parse or save AI-generated offer:", e);
      toast({
        variant: "destructive",
        title: "Error Creating Offer",
        description: "There was an issue saving the AI's response.",
      });
    }
  };

  const handleCopyToClipboard = () => {
    if (aiResult?.offerJson) {
      navigator.clipboard.writeText(aiResult.offerJson);
      toast({
        title: 'Copied to clipboard!',
        description: 'The generated JSON has been copied.',
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Automated Offer Generation
        </h1>
        <p className="text-muted-foreground">
          Leverage AI to dynamically create and price targeted offers.
        </p>
      </div>

       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>1. Define Offer Goal</CardTitle>
                <CardDescription>
                    Provide the high-level business objective, target market, and any constraints.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Primary Goal</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="e.g., Increase load factor on underperforming EU-US routes during shoulder season."
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="targetMarket"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target Market / Timeframe</FormLabel>
                                <FormControl>
                                <Input
                                    placeholder="e.g., Leisure travelers from Germany in Q2"
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="constraints"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Constraints (Optional)</FormLabel>
                                <FormControl>
                                <Textarea
                                    placeholder="e.g., Discount cannot exceed 20%. Must include a baggage component."
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>2. Select AI Parameters</CardTitle>
                    <CardDescription>
                        Select the parameters the AI should use to construct the offer.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <FormField
                        control={form.control}
                        name="selectedParameters"
                        render={() => (
                        <FormItem>
                            <div className="mb-4">
                            <FormLabel className="text-base font-semibold">Parameters for AI Consideration</FormLabel>
                            </div>
                            <Accordion type="multiple" className="w-full">
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
                                disabled={fields.length <= 1}
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


              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Offer
              </Button>
            </form>
          </Form>
      
      {(isLoading || aiResult) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="text-yellow-500" />
                        3. AI Considerations & Simulation
                    </CardTitle>
                    <CardDescription>The AI's reasoning and a preview of the proposed offer.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                             <Separator />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    ) : (
                       aiResult && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-sm">Considerations</h4>
                                    <div className="text-sm text-muted-foreground mt-2 space-y-1" dangerouslySetInnerHTML={{ __html: aiResult.considerations.replace(/\n/g, '<br />') }}/>
                                </div>
                                <Separator />
                                <div>
                                    <h4 className="font-semibold text-sm">Simulated Offer Preview</h4>
                                    <div className="mt-2 rounded-lg border p-4 space-y-1">
                                        <p className="font-bold text-primary">{aiResult.simulation.name}</p>
                                        <p className="text-xs text-muted-foreground">{aiResult.simulation.description}</p>
                                        <p className="text-lg font-bold text-right pt-2">{aiResult.simulation.price}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        4. Generated Offer JSON
                    </CardTitle>
                     <CardDescription>Review the structured JSON output below. You can copy it or save it directly.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                    <div className="space-y-2 p-4 bg-muted rounded-md">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                    ) : (
                        aiResult && (
                            <pre className="p-4 bg-muted rounded-md text-sm text-secondary-foreground overflow-x-auto max-h-[22.5rem]">
                                <code>{aiResult.offerJson}</code>
                            </pre>
                        )
                    )}
                </CardContent>
             </Card>

        </div>
      )}

      {aiResult && !isLoading && (
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCopyToClipboard}><ClipboardCopy className="mr-2" /> Copy JSON</Button>
            <Button onClick={handleCreateOffer}><FilePlus2 className="mr-2" /> Create Offer from AI</Button>
        </div>
      )}

    </div>
  );
}

    