'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, PlaneTakeoff, PlaneLanding, Users, Search, Wand2, Loader2, Armchair } from 'lucide-react';

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { searchFlightsNLP } from '@/ai/flows/search-flights-nlp';
import { FlightResultCard, type FlightOffer } from '@/components/offer-composer/flight-result-card';

const offerSearchSchema = z.object({
  origin: z.string().length(3, 'Origin must be a 3-letter IATA code.').toUpperCase(),
  destination: z.string().length(3, 'Destination must be a 3-letter IATA code.').toUpperCase(),
  departureDate: z.date({
    required_error: 'A departure date is required.',
  }),
  returnDate: z.date().optional(),
  passengers: z.string().min(1),
  cabinClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']),
});

const aiSearchSchema = z.object({
  query: z.string().min(10, 'Please describe your search in at least 10 characters.'),
});

const mockFlightOffers: FlightOffer[] = [
    {
      id: 'OFF-FL-001',
      departureTime: '06:30',
      departureCode: 'JFK',
      arrivalTime: '09:45',
      arrivalCode: 'LAX',
      duration: '6h 15m',
      stops: 0,
      airline: 'Airline A',
      price: 350,
      currency: 'USD',
      cabinClass: 'Economy',
      includedBaggage: '1 Carry-on',
    },
    {
      id: 'OFF-FL-002',
      departureTime: '09:00',
      departureCode: 'JFK',
      arrivalTime: '13:30',
      arrivalCode: 'LAX',
      duration: '7h 30m',
      stops: 1,
      airline: 'Airline B',
      price: 295,
      currency: 'USD',
      cabinClass: 'Economy',
      includedBaggage: '1 Carry-on',
    },
     {
      id: 'OFF-FL-003',
      departureTime: '14:00',
      departureCode: 'JFK',
      arrivalTime: '17:15',
      arrivalCode: 'LAX',
      duration: '6h 15m',
      stops: 0,
      airline: 'Airline A',
      price: 1250,
      currency: 'USD',
      cabinClass: 'Business',
      includedBaggage: '1 Carry-on, 2 Checked',
    },
];


export default function OfferComposerPage() {
  const [searchResults, setSearchResults] = useState<FlightOffer[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof offerSearchSchema>>({
    resolver: zodResolver(offerSearchSchema),
    defaultValues: {
      origin: '',
      destination: '',
      passengers: '1',
      cabinClass: 'ECONOMY',
    },
  });
  
  const aiForm = useForm<z.infer<typeof aiSearchSchema>>({
    resolver: zodResolver(aiSearchSchema),
    defaultValues: {
      query: '',
    },
  });

  async function onAiSubmit(data: z.infer<typeof aiSearchSchema>) {
    setIsAiLoading(true);
    toast({
      title: 'AI is thinking...',
      description: 'Parsing your flight search request.',
    });
    try {
      const result = await searchFlightsNLP({ query: data.query });
      form.setValue('origin', result.origin);
      form.setValue('destination', result.destination);
      form.setValue('passengers', String(result.passengers));
      if (result.departureDate) {
        form.setValue('departureDate', new Date(result.departureDate));
      }
      if (result.returnDate) {
        form.setValue('returnDate', new Date(result.returnDate));
      }
      toast({
        title: 'Form populated!',
        description: 'The search form has been filled based on your request.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not understand the request. Please try rephrasing.',
      });
    } finally {
      setIsAiLoading(false);
    }
  }

  function onSearchSubmit(data: z.infer<typeof offerSearchSchema>) {
    setIsLoading(true);
    setSearchResults(null);
    toast({
      title: 'Searching for offers...',
      description: 'Composing and pricing solutions based on your request.',
    });
    
    // Simulate API call
    setTimeout(() => {
        const results = mockFlightOffers.filter(
            (offer) => offer.cabinClass.toUpperCase().replace(' ', '_') === data.cabinClass
        );
        setSearchResults(results);
        setIsLoading(false);
        toast({
            title: 'Search complete!',
            description: `${results.length} offers found for the selected criteria.`,
          });
    }, 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Offer Composer</h1>
        <p className="text-muted-foreground">
          Compose NDC-compatible offers by discovering and pricing solutions and ancillaries.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Flight Search</CardTitle>
                <CardDescription>Find flights to begin composing an offer.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSearchSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Origin</FormLabel>
                          <div className="relative">
                              <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <FormControl>
                              <Input placeholder="e.g., JFK" {...field} className="pl-9" />
                              </FormControl>
                          </div>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                      <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Destination</FormLabel>
                          <div className="relative">
                              <PlaneLanding className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <FormControl>
                              <Input placeholder="e.g., LAX" {...field} className="pl-9" />
                              </FormControl>
                          </div>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                      <FormField
                      control={form.control}
                      name="departureDate"
                      render={({ field }) => (
                          <FormItem className="flex flex-col">
                          <FormLabel>Departure Date</FormLabel>
                          <Popover>
                              <PopoverTrigger asChild>
                              <FormControl>
                                  <Button
                                  variant={'outline'}
                                  className={cn(
                                      'w-full pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                  )}
                                  >
                                  {field.value ? (
                                      format(field.value, 'PPP')
                                  ) : (
                                      <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                              </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                  date < new Date(new Date().setHours(0,0,0,0))
                                  }
                                  initialFocus
                              />
                              </PopoverContent>
                          </Popover>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                      <FormField
                      control={form.control}
                      name="passengers"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Passengers</FormLabel>
                          <div className="relative">
                              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                  <FormControl>
                                      <SelectTrigger className="pl-9">
                                      <SelectValue placeholder="Select number of passengers" />
                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {[...Array(8)].map((_, i) => (
                                          <SelectItem key={i+1} value={String(i + 1)}>{i + 1} Passenger{i > 0 ? 's' : ''}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                     <FormField
                      control={form.control}
                      name="cabinClass"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Cabin Class</FormLabel>
                           <div className="relative">
                               <Armchair className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="pl-9">
                                        <SelectValue placeholder="Select cabin class" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ECONOMY">Economy</SelectItem>
                                        <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                                        <SelectItem value="BUSINESS">Business</SelectItem>
                                        <SelectItem value="FIRST">First</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                    <div className="flex items-end lg:col-start-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                             Search
                        </Button>
                    </div>
                  </div>
                </form>
            </Form>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>AI Search Assistant</CardTitle>
                <CardDescription>Describe the flight you're looking for in plain text.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...aiForm}>
                    <form onSubmit={aiForm.handleSubmit(onAiSubmit)} className="space-y-4">
                        <FormField
                            control={aiForm.control}
                            name="query"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">AI Search Query</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="e.g., Round trip for 2 people from NYC to London next month in Business class" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isAiLoading}>
                            {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            Populate Form
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
      
      {searchResults !== null && (
         <Card>
            <CardHeader>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>The best offers based on your search criteria.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p>Loading offers...</p>
                    </div>
                ) : searchResults.length === 0 ? (
                     <div className="text-center py-12 text-muted-foreground">
                        <p>No offers found for the selected criteria.</p>
                        <p className="text-sm">Try adjusting your search parameters.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {searchResults.map(offer => <FlightResultCard key={offer.id} offer={offer} />)}
                    </div>
                )}
            </CardContent>
         </Card>
      )}

    </div>
  );
}
