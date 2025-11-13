'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, PlaneTakeoff, PlaneLanding, Users, Search, Wand2, Loader2, Armchair, Briefcase, Plus, Minus, FileJson, ShoppingBasket, BadgeCheck, XCircle } from 'lucide-react';

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
import { AncillarySelection, Ancillary } from '@/components/offer-composer/ancillary-selection';
import { SeatMap } from '@/components/offer-composer/seat-map';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type OfferStatus = 'OfferRequested' | 'OfferProcessing' | 'OfferCreated' | 'OfferSelected' | 'OfferValidated' | 'OfferStockChecked' | 'OfferConvertedToOrder' | 'OfferExpired';


const offerSearchSchema = z.object({
  origin: z.string().length(3, 'Origin must be a 3-letter IATA code.').toUpperCase(),
  destination: z.string().length(3, 'Destination must be a 3-letter IATA code.').toUpperCase(),
  departureDate: z.date({
    required_error: 'A departure date is required.',
  }),
  passengers: z.object({
      adt: z.coerce.number().min(1),
      chd: z.coerce.number().min(0),
  }),
  cabinClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']),
  brand: z.string().optional(),
  corporateId: z.string().optional(),
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
      brand: 'Economy Light'
    },
    {
      id: 'OFF-FL-002',
      departureTime: '09:00',
      departureCode: 'LHR',
      arrivalTime: '13:30',
      arrivalCode: 'DXB',
      duration: '7h 30m',
      stops: 0,
      airline: 'Airline B',
      price: 2500,
      currency: 'GBP',
      cabinClass: 'Business',
      includedBaggage: '1 Carry-on, 1 Checked',
      brand: 'Business Saver'
    },
     {
      id: 'OFF-FL-003',
      departureTime: '14:00',
      departureCode: 'JFK',
      arrivalTime: '17:15',
      arrivalCode: 'LHR',
      duration: '6h 15m',
      stops: 0,
      airline: 'Airline A',
      price: 5500,
      currency: 'USD',
      cabinClass: 'First',
      includedBaggage: '1 Carry-on, 2 Checked',
      brand: 'First Class'
    },
];


export default function OfferComposerPage() {
  const [searchResults, setSearchResults] = useState<FlightOffer[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<FlightOffer | null>(null);
  const [selectedAncillaries, setSelectedAncillaries] = useState<Ancillary[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [offerStatus, setOfferStatus] = useState<OfferStatus | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof offerSearchSchema>>({
    resolver: zodResolver(offerSearchSchema),
    defaultValues: {
      origin: 'JFK',
      destination: 'LAX',
      passengers: { adt: 1, chd: 0},
      cabinClass: 'ECONOMY',
      brand: 'All',
      corporateId: ''
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
    setOfferStatus('OfferProcessing');
    try {
      const result = await searchFlightsNLP({ query: data.query });
      form.setValue('origin', result.origin);
      form.setValue('destination', result.destination);
      form.setValue('passengers.adt', result.passengers || 1);
      if (result.departureDate) {
        form.setValue('departureDate', new Date(result.departureDate));
      }
      toast({
        title: 'Form populated!',
        description: 'The search form has been filled based on your request.',
      });
      setOfferStatus(null);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not understand the request. Please try rephrasing.',
      });
       setOfferStatus(null);
    } finally {
      setIsAiLoading(false);
    }
  }

  function onSearchSubmit(data: z.infer<typeof offerSearchSchema>) {
    setIsLoading(true);
    setSearchResults(null);
    setSelectedOffer(null);
    setSelectedAncillaries([]);
    setSelectedSeat(null);
    setOfferStatus('OfferRequested');
    toast({
      title: 'Searching for offers...',
      description: 'Composing and pricing solutions based on your request.',
    });
    
    setTimeout(() => {
        const results = mockFlightOffers.filter(
            (offer) => offer.cabinClass.toUpperCase().replace(' ', '_') === data.cabinClass
        );
        setSearchResults(results);
        setIsLoading(false);
        setOfferStatus('OfferCreated');
        toast({
            title: 'Search complete!',
            description: `${results.length} offers found for the selected criteria.`,
          });
    }, 1500);
  }

  function handleSelectOffer(offer: FlightOffer) {
    setSelectedOffer(offer);
    setSelectedAncillaries([]);
    setSelectedSeat(null);
    setOfferStatus('OfferSelected');
    toast({
      title: 'Offer Added to Cart',
      description: `Offer ${offer.id} has been selected. You can now add ancillaries.`,
    });
  }
  
  function handleValidateOffer() {
    if(!selectedOffer) return;
    setOfferStatus('OfferValidated');
    toast({
      title: 'Offer Validated',
      description: 'Offer price and availability confirmed.',
    })
  }

  function handleStockCheck() {
    if(offerStatus !== 'OfferValidated') return;
    setOfferStatus('OfferStockChecked');
     toast({
      title: 'Stock Checked',
      description: 'Seat and ancillary inventory confirmed.',
    })
  }

  const totalAncillaryPrice = selectedAncillaries.reduce((acc, anc) => acc + anc.price, 0);
  const totalSeatPrice = selectedSeat ? 75 : 0; // Updated to match seat catalogue price
  const totalOrderPrice = (selectedOffer?.price || 0) + totalAncillaryPrice + totalSeatPrice;

  const orderCreatePayload = {
    context: { version: '21.3', timestamp: new Date().toISOString(), pos: 'US', channel: 'Web', currency: 'USD' },
    offer_ref: {
      parent_offer_id: selectedOffer?.id,
      status: offerStatus,
      items: [
        { offer_item_id: `flight-${selectedOffer?.id}`, passenger_refs: ['P1'], type: 'Flight' },
        ...selectedAncillaries.map(anc => ({ offer_item_id: anc.id, passenger_refs: ['P1'], type: 'Ancillary' })),
        ...(selectedSeat ? [{ offer_item_id: `seat-${selectedSeat}`, passenger_refs: ['P1'], type: 'Seat' }] : [])
      ]
    },
    passengers: [{ id: "P1", type: "ADT" }],
    pricing: { currency: "USD", total: totalOrderPrice },
  };

  const handleSendToOrderModule = () => {
    if (!selectedOffer || offerStatus !== 'OfferStockChecked') {
      toast({
        variant: 'destructive',
        title: 'Action Required',
        description: 'Please validate the offer and check stock availability before creating an order.',
      });
      return;
    }
    setOfferStatus('OfferConvertedToOrder');
    
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 1000)}`,
      customer: 'Composed Order Customer',
      email: 'customer@example.com',
      status: 'Pending' as const,
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: totalOrderPrice,
    };
    
    sessionStorage.setItem('newly_created_order', JSON.stringify(newOrder));
    
    toast({
      title: "Order Created",
      description: `Order ${newOrder.id} has been created and is pending processing.`,
    });
    
    router.push('/orders');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Offer Composer</h1>
        <p className="text-muted-foreground">
          Compose NDC-compatible offers by discovering and pricing solutions and ancillaries.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
              <CardHeader>
                  <CardTitle>1. Air Shopping</CardTitle>
                  <CardDescription>Find flights to begin composing an offer.</CardDescription>
              </CardHeader>
              <CardContent>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSearchSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                       <FormField
                        control={form.control}
                        name="departureDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col pt-2">
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
                        <div className="flex gap-4 pt-2">
                            <FormField
                            control={form.control}
                            name="passengers.adt"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                <FormLabel>Adults</FormLabel>
                                <FormControl>
                                    <Input type="number" min={1} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                             <FormField
                            control={form.control}
                            name="passengers.chd"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                <FormLabel>Children</FormLabel>
                                <FormControl>
                                    <Input type="number" min={0} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-4">
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
                        <FormField
                            control={form.control}
                            name="corporateId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Corporate ID (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., TCS_123" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                         />
                    </div>
                    <div className="flex justify-end pt-6">
                        <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                             Search Flights
                        </Button>
                    </div>
                  </form>
              </Form>
              </CardContent>
          </Card>
          
          {(isLoading || searchResults) && (
            <Card>
                <CardHeader>
                    <CardTitle>2. Select Flight</CardTitle>
                    <CardDescription>Choose a flight solution to add it to your cart.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                            <p>Loading offers...</p>
                        </div>
                    )}
                    {searchResults && !isLoading && (
                        searchResults.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No offers found. Try adjusting your search.</p>
                        </div>
                        ) : (
                        <div className="space-y-4">
                            {searchResults.map(offer => <FlightResultCard key={offer.id} offer={offer} onSelect={handleSelectOffer} isSelected={selectedOffer?.id === offer.id} />)}
                        </div>
                        )
                    )}
                </CardContent>
            </Card>
          )}

          {selectedOffer && (
             <Card>
                <CardHeader>
                    <CardTitle>3. Add Ancillaries & Seats</CardTitle>
                    <CardDescription>Select optional services for the chosen flight.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AncillarySelection selectedAncillaries={selectedAncillaries} onAncillaryChange={setSelectedAncillaries} />
                    <SeatMap selectedSeat={selectedSeat} onSeatSelect={setSelectedSeat} />
                </CardContent>
            </Card>
          )}

        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>AI Search Assistant</CardTitle>
                    <CardDescription>Describe your search in plain text.</CardDescription>
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
                            <Button type="submit" disabled={isAiLoading} className="w-full">
                                {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                Populate Form
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            {selectedOffer && (
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <ShoppingBasket className="h-5 w-5" />
                        <CardTitle>4. Shopping Cart</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Flight ({selectedOffer.departureCode}-{selectedOffer.arrivalCode})</span>
                                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedOffer.currency }).format(selectedOffer.price)}</span>
                            </div>
                            {selectedAncillaries.map(anc => (
                                <div key={anc.id} className="flex justify-between">
                                <span className="text-muted-foreground">{anc.name}</span>
                                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(anc.price)}</span>
                            </div>
                            ))}
                            {selectedSeat && (
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground">Seat {selectedSeat}</span>
                                    <span>${totalSeatPrice.toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedOffer.currency }).format(totalOrderPrice)}</span>
                        </div>
                        <Separator />
                        
                        <div className="space-y-2 pt-2">
                           <Button className="w-full" onClick={handleValidateOffer} disabled={offerStatus === 'OfferValidated' || offerStatus === 'OfferStockChecked'}>
                            {offerStatus === 'OfferValidated' || offerStatus === 'OfferStockChecked' ? <BadgeCheck className="mr-2 h-4 w-4" /> : null}
                                Validate Offer
                           </Button>
                           <Button className="w-full" variant="outline" onClick={handleStockCheck} disabled={offerStatus !== 'OfferValidated'}>
                            {offerStatus === 'OfferStockChecked' ? <BadgeCheck className="mr-2 h-4 w-4" /> : null}
                                Check Stock Availability
                           </Button>
                        </div>
                        
                        {(offerStatus === 'OfferValidated' || offerStatus === 'OfferStockChecked') && (
                            <Alert variant={offerStatus === 'OfferStockChecked' ? 'default' : 'destructive'}>
                                {offerStatus === 'OfferStockChecked' ? <BadgeCheck className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                <AlertTitle>
                                    {offerStatus === 'OfferStockChecked' ? 'Ready for Order Creation' : 'Validation Error'}
                                </AlertTitle>
                                <AlertDescription>
                                    {offerStatus === 'OfferStockChecked' 
                                        ? 'All items are validated and stock is confirmed. You can now create the order.' 
                                        : 'Offer must be validated and stock checked before creating an order.'
                                    }
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        <div className="pt-2">
                            <h4 className="font-semibold mb-2">OrderCreate Payload</h4>
                            <pre className="p-2 bg-secondary rounded-md text-xs text-secondary-foreground overflow-x-auto max-h-64">
                                {JSON.stringify(orderCreatePayload, null, 2)}
                            </pre>
                            <Button className="w-full mt-4" variant="secondary" onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(orderCreatePayload, null, 2));
                                toast({ title: "Payload Copied", description: "OrderCreate JSON has been copied to clipboard." });
                            }}>
                                <FileJson className="mr-2 h-4 w-4" />
                                Copy JSON
                            </Button>
                             <Button className="w-full mt-2" variant="default" onClick={handleSendToOrderModule}>
                                Send to Order Module
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}

    