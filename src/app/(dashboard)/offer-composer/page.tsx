

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format, differenceInHours, addDays, isBefore } from 'date-fns';
import { CalendarIcon, PlaneTakeoff, PlaneLanding, Users, Search, Wand2, Loader2, Armchair, Briefcase, Plus, Minus, FileJson, ShoppingBasket, BadgeCheck, XCircle, Tag, CheckSquare, Square, Gift, AlertCircle, RefreshCw, Package, Check, Circle, Workflow, Award, GraduationCap } from 'lucide-react';

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
import { Label } from '@/components/ui/label';
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
import { JourneyResultCard, type FlightJourney, type BrandedFare } from '@/components/offer-composer/journey-result-card';
import { AncillarySelection, Ancillary } from '@/components/offer-composer/ancillary-selection';
import { SeatMap } from '@/components/offer-composer/seat-map';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { OrderDetails } from '@/components/orders/order-details-view';
import { Checkbox } from '@/components/ui/checkbox';


type OfferStatus = 'OfferRequested' | 'OfferProcessing' | 'OfferCreated' | 'OfferSelected' | 'OfferPriceValidated' | 'OfferStockChecked' | 'OfferConvertedToOrder' | 'OfferExpired';

type Promotion = {
    id: string;
    title: string;
    description: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    requiredCohort?: string;
};

type AppliedRule = {
    name: string;
    adjustment: number;
};

type RecommendedBundle = {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    items: string[];
};

const offerSearchSchema = z.object({
  tripType: z.enum(['one-way', 'return']).default('one-way'),
  origin: z.string().length(3, 'Origin must be a 3-letter IATA code.').toUpperCase(),
  destination: z.string().length(3, 'Destination must be a 3-letter IATA code.').toUpperCase(),
  departureDate: z.date({
    required_error: 'A departure date is required.',
  }),
  returnDate: z.date().optional(),
  passengers: z.object({
      adt: z.coerce.number().min(1),
      chd: z.coerce.number().min(0),
  }),
  cabinClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']),
  brand: z.string().optional(),
  corporateId: z.string().optional(),
  channel: z.string().optional(),
  loyaltyTier: z.string().optional(),
  isStudent: z.boolean().default(false).optional(),
}).refine(data => {
    if (data.tripType === 'return' && !data.returnDate) {
        return false;
    }
    return true;
}, {
    message: 'Return date is required for a return trip.',
    path: ['returnDate'],
}).refine(data => {
    if (data.tripType === 'return' && data.returnDate && data.departureDate > data.returnDate) {
        return false;
    }
    return true;
}, {
    message: 'Return date must be after departure date.',
    path: ['returnDate'],
});

const aiSearchSchema = z.object({
  query: z.string().min(10, 'Please describe your search in at least 10 characters.'),
});

const mockFlightJourneys: FlightJourney[] = [
  {
    id: 'J-001',
    departureTime: '06:30', departureCode: 'JFK',
    arrivalTime: '09:45', arrivalCode: 'LAX',
    duration: '6h 15m', airline: 'Airline A', stops: 0,
    fares: [
      { id: 'F-001A', brand: 'Economy Light', cabinClass: 'ECONOMY', price: 280, basePrice: 280, includedServices: ['1 Carry-on', 'Standard Seat Selection'] },
      { id: 'F-001B', brand: 'Economy Flex', cabinClass: 'ECONOMY', price: 350, basePrice: 350, includedServices: ['1 Carry-on', '1 Checked Bag (23kg)', 'Standard Seat Selection', 'Flexibility'] },
      { id: 'F-001C', brand: 'Business Saver', cabinClass: 'BUSINESS', price: 1100, basePrice: 1100, includedServices: ['1 Carry-on', '2 Checked Bags (32kg)', 'Lounge Access', 'Priority Boarding'] },
    ]
  },
  {
    id: 'J-002',
    departureTime: '09:00', departureCode: 'JFK',
    arrivalTime: '12:15', arrivalCode: 'LAX',
    duration: '6h 15m', airline: 'Airline B', stops: 0,
    fares: [
      { id: 'F-002A', brand: 'Economy Saver', cabinClass: 'ECONOMY', price: 310, basePrice: 310, includedServices: ['1 Carry-on', '1 Checked Bag (23kg)', 'Standard Seat Selection'] },
      { id: 'F-002B', brand: 'Business Flex', cabinClass: 'BUSINESS', price: 1250, basePrice: 1250, includedServices: ['1 Carry-on', '2 Checked Bags (32kg)', 'Lounge Access', 'Priority Boarding', 'Flexibility', 'Free Wi-Fi'] },
    ]
  },
  {
    id: 'J-003',
    departureTime: '14:00', departureCode: 'LHR',
    arrivalTime: '18:30', arrivalCode: 'DXB',
    duration: '7h 30m', airline: 'Airline C', stops: 0,
    fares: [
        { id: 'F-003A', brand: 'Economy', cabinClass: 'ECONOMY', price: 450, basePrice: 450, includedServices: ['1 Carry-on', '1 Checked Bag (23kg)', 'Standard Seat Selection'] },
        { id: 'F-003B', brand: 'Business', cabinClass: 'BUSINESS', price: 2500, basePrice: 2500, includedServices: ['1 Carry-on', '2 Checked Bags (32kg)', 'Lounge Access', 'Priority Boarding', 'Flexibility'] },
        { id: 'F-003C', brand: 'First', cabinClass: 'FIRST', price: 4800, basePrice: 4800, includedServices: ['1 Carry-on', '3 Checked Bags (32kg)', 'Lounge Access', 'Priority Boarding', 'Flexibility', 'First Class Suite', 'Premium Dining'] },
    ]
  },
    {
    id: 'J-004',
    departureTime: '18:00', departureCode: 'DEL',
    arrivalTime: '22:30', arrivalCode: 'LHR',
    duration: '9h 30m', airline: 'Airline D', stops: 0,
    fares: [
        { id: 'F-004A', brand: 'Student Fare', cabinClass: 'ECONOMY', price: 850, basePrice: 850, includedServices: ['1 Carry-on', '1 Checked Bag (23kg)', 'Standard Seat Selection', 'Flexible Change'] },
        { id: 'F-004B', brand: 'Economy Flex', cabinClass: 'ECONOMY', price: 920, basePrice: 920, includedServices: ['1 Carry-on', '1 Checked Bag (23kg)', 'Standard Seat Selection', 'Flexibility'] },
    ]
    },
    {
    id: 'J-005',
    departureTime: '23:00', departureCode: 'DXB',
    arrivalTime: '11:20', arrivalCode: 'SIN',
    duration: '7h 20m', airline: 'Airline E', stops: 0,
    fares: [
        { id: 'F-005A', brand: 'Economy', cabinClass: 'ECONOMY', price: 900, basePrice: 900, includedServices: ['1 Carry-on', '1 Checked Bag (23kg)'] },
        { id: 'F-005B', brand: 'Business', cabinClass: 'BUSINESS', price: 2800, basePrice: 2800, includedServices: ['1 Carry-on', '2 Checked Bags (32kg)', 'Lounge Access'] },
    ]
  },
];

const mockPromotions: Promotion[] = [
    { id: 'PROMO-01', title: 'Winter Sale', description: '10% off base fare for winter travel.', type: 'PERCENTAGE', value: 10 },
    { id: 'PROMO-02', title: 'Loyalty Bonus', description: 'Earn double loyalty points on this booking.', type: 'FIXED', value: 0, requiredCohort: 'Platinum Elite' },
    { id: 'PROMO-04', title: 'Weekend Getaway', description: '$25 off your booking for weekend travel.', type: 'FIXED', value: 25 },
    { id: 'PROMO-05', title: 'First-time Booker', description: '15% off your first booking with us.', type: 'PERCENTAGE', value: 15 },
];

const mockBundles: RecommendedBundle[] = [
    { id: 'BUN-001', name: 'Business Comfort', description: 'Elevate your business trip.', price: 75, originalPrice: 100, items: ['Lounge Access', 'Premium Meal'] },
    { id: 'BUN-002', name: 'Family Pack', description: 'Convenience for the whole family.', price: 60, originalPrice: 85, items: ['1st Checked Bag', 'Standard Seat Selection (x3)'] },
    { id: 'BUN-003', name: 'Student Pack', description: 'Extra baggage and flexibility.', price: 60, originalPrice: 90, items: ['Extra Baggage', 'Free Meal'] },
    { id: 'BUN-004', name: 'Elite Privileges', description: 'Upgrade your elite experience.', price: 40, originalPrice: 60, items: ['Premium Meal', 'Double Miles'] },
];

const offerLifecycleSteps = [
    { status: 'OfferRequested', label: 'Offer Requested', description: 'Shopping request received from the channel.' },
    { status: 'OfferProcessing', label: 'Offer Processing', description: 'Constructing and pricing solutions.' },
    { status: 'OfferCreated', label: 'Offer Created', description: 'Priced offers returned to the channel.' },
    { status: 'OfferSelected', label: 'Offer Selected', description: 'An offer has been added to the cart.' },
    { status: 'OfferPriceValidated', label: 'Price Validated', description: 'Offer price and rules re-validated.' },
    { status: 'OfferStockChecked', label: 'Stock Checked', description: 'Seat and ancillary inventory confirmed.' },
    { status: 'OfferConvertedToOrder', label: 'Order Created', description: 'Offer converted to a confirmed order.' },
];


export default function OfferComposerPage() {
  const [searchResults, setSearchResults] = useState<FlightJourney[] | null>(null);
  const [recommendedBundles, setRecommendedBundles] = useState<RecommendedBundle[] | null>(null);
  const [availablePromotions, setAvailablePromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<BrandedFare | null>(null);
  const [appliedRules, setAppliedRules] = useState<AppliedRule[]>([]);
  const [activeCohort, setActiveCohort] = useState<string | null>(null);
  const [selectedAncillaries, setSelectedAncillaries] = useState<Ancillary[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<RecommendedBundle | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [offerStatus, setOfferStatus] = useState<OfferStatus | null>(null);
  const [validTill, setValidTill] = useState<Date | undefined>(addDays(new Date(), 1));
  const [reshopContext, setReshopContext] = useState<OrderDetails | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof offerSearchSchema>>({
    resolver: zodResolver(offerSearchSchema),
    defaultValues: {
      tripType: 'one-way',
      origin: 'JFK',
      destination: 'LAX',
      passengers: { adt: 1, chd: 0},
      cabinClass: 'ECONOMY',
      brand: 'All',
      corporateId: '',
      channel: 'Direct',
      loyaltyTier: 'None',
      isStudent: false,
    },
  });
  
  const aiForm = useForm<z.infer<typeof aiSearchSchema>>({
    resolver: zodResolver(aiSearchSchema),
    defaultValues: {
      query: '',
    },
  });
  
  const tripType = form.watch('tripType');

  useEffect(() => {
    const reshopOrderString = sessionStorage.getItem('reshop_order_context');
    if (reshopOrderString) {
        try {
            const order: OrderDetails = JSON.parse(reshopOrderString);
            setReshopContext(order);
            
            // For now, we'll make a best-effort to parse the route from the first flight service
            const flightService = order.services.find(s => s.type === 'Flight');
            if (flightService) {
                const parts = flightService.description.split(', ')[1]?.split('-');
                if (parts && parts.length === 2) {
                    form.setValue('origin', parts[0]);
                    form.setValue('destination', parts[1]);
                }
            }
            form.setValue('departureDate', new Date(order.date));
            // This is a simplification; a real app would need to parse passenger types
            const passengerCount = order.auditTrail[0]?.actor.includes('Pax') ? parseInt(order.auditTrail[0].actor.split(' ')[0]) : 1;
            form.setValue('passengers.adt', passengerCount);

            toast({
              title: 'Reshop Mode Activated',
              description: `Loaded context for Order ${'order.id'}.`,
            });

        } catch (e) {
            console.error("Failed to parse reshop context:", e);
            toast({ variant: "destructive", title: "Error", description: "Could not load reshop context." });
        } finally {
            sessionStorage.removeItem('reshop_order_context');
        }
    }
  }, [form, toast]);


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
      if (result.returnDate) {
        form.setValue('tripType', 'return');
        form.setValue('returnDate', new Date(result.returnDate));
      } else {
        form.setValue('tripType', 'one-way');
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
    setRecommendedBundles(null);
    setSelectedOffer(null);
    setAppliedRules([]);
    setActiveCohort(null);
    setSelectedAncillaries([]);
    setSelectedSeat(null);
    setSelectedPromotion(null);
    setAvailablePromotions([]);
    setOfferStatus('OfferRequested');
    toast({
      title: 'Searching for offers...',
      description: 'Composing and pricing solutions based on your request.',
    });
    
    setTimeout(() => {
        let results = mockFlightJourneys.map(journey => ({
            ...journey,
            fares: journey.fares.filter(fare => fare.cabinClass.toUpperCase() === data.cabinClass)
        })).filter(journey => journey.fares.length > 0);
        
        let activeRules: AppliedRule[] = [];
        let cohortName: string | null = null;
        let bundlesToShow: RecommendedBundle[] = [];

        // ** SIMULATED ENGINE LOGIC **
        if (data.corporateId && data.cabinClass === 'BUSINESS') {
            cohortName = "Corporate Traveller";
            bundlesToShow.push(mockBundles[0]);
            results = results.map(j => ({
                ...j,
                fares: j.fares.map(f => {
                    if (f.cabinClass === 'BUSINESS') {
                        const discount = f.basePrice * 0.05;
                        activeRules.push({ name: 'Corporate Discount', adjustment: -discount });
                        const newIncluded = [...f.includedServices, 'Lounge Access', 'Priority Boarding', 'Wi-Fi'];
                        return { ...f, price: f.basePrice - discount, includedServices: Array.from(new Set(newIncluded)) };
                    }
                    return f;
                })
            }));
        } else if ((data.passengers.adt + data.passengers.chd) >= 3 && data.passengers.chd > 0) {
            cohortName = "Family Leisure";
            bundlesToShow.push(mockBundles[1]);
             results = results.map(j => ({...j, fares: j.fares.map(f => {
                const discount = f.basePrice * 0.10;
                activeRules.push({ name: 'Family Offer', adjustment: -discount });
                return {...f, price: f.basePrice - discount };
             }) }));
        } else if (data.isStudent) {
            cohortName = "Student";
            bundlesToShow.push(mockBundles[2]);
            results = results.map(j => ({...j, fares: j.fares.map(f => {
                const discount = f.basePrice * 0.08;
                activeRules.push({ name: 'Student Discount', adjustment: -discount });
                return {...f, price: f.basePrice - discount };
            })}));
        } else if (data.loyaltyTier === 'Platinum') {
            cohortName = "Platinum Elite";
            bundlesToShow.push(mockBundles[3]);
            results = results.map(j => ({...j, fares: j.fares.map(f => {
                const discount = f.basePrice * 0.07;
                activeRules.push({ name: 'Elite Discount', adjustment: -discount });
                return {...f, price: f.basePrice - discount };
            })}));
        }
        
        if (data.departureDate && differenceInHours(data.departureDate, new Date()) < 48) {
            cohortName = cohortName ? `${cohortName}, Last-Minute` : 'Last-Minute Traveller';
            results = results.map(j => ({...j, fares: j.fares.map(f => {
                const surge = f.basePrice * 0.15;
                activeRules.push({ name: 'Last-Minute Surge', adjustment: surge });
                return {...f, price: f.price + surge };
            })}));
        }
        
        if (data.channel === 'OTA') {
             cohortName = cohortName ? `${cohortName}, OTA` : 'OTA Shopper';
             results = results.map(j => ({...j, fares: j.fares.map(f => {
                const markup = f.price * 0.02;
                activeRules.push({ name: 'OTA Channel Markup', adjustment: markup });
                return {...f, price: f.price + markup };
            }) }));
        }
        
        setActiveCohort(cohortName);
        setAppliedRules(activeRules);
        setRecommendedBundles(bundlesToShow);
        setSearchResults(results);
        setIsLoading(false);
        setOfferStatus('OfferCreated');
        toast({
            title: 'Search complete!',
            description: `${results.reduce((acc, j) => acc + j.fares.length, 0)} offers found.`,
          });
    }, 1500);
  }

  function handleSelectOffer(offer: BrandedFare) {
    setSelectedOffer(offer);
    setSelectedAncillaries([]);
    setSelectedSeat(null);
    setSelectedPromotion(null);
    setSelectedBundle(null);

    // Filter available promotions based on cohort
    const filteredPromos = mockPromotions.filter(promo => 
        !promo.requiredCohort || promo.requiredCohort === activeCohort
    );
    setAvailablePromotions(filteredPromos);

    setOfferStatus('OfferSelected');
    toast({
      title: 'Offer Added to Cart',
      description: `Fare "${offer.brand}" has been selected. Review applied rules before adding ancillaries.`,
    });
  }

  function handleSelectPromotion(promoId: string) {
    const promotion = mockPromotions.find(p => p.id === promoId);
    setSelectedPromotion(promotion || null);
    // Reset validation status on change
    if (offerStatus === 'OfferPriceValidated' || offerStatus === 'OfferStockChecked') {
        setOfferStatus('OfferSelected');
    }
  }

  function handleAncillaryChange(ancillaries: Ancillary[]) {
    setSelectedAncillaries(ancillaries);
    // Reset validation status on change
    if (offerStatus === 'OfferPriceValidated' || offerStatus === 'OfferStockChecked') {
        setOfferStatus('OfferSelected');
    }
  }

  function handleSelectBundle(bundle: RecommendedBundle) {
    setSelectedBundle(bundle);
    toast({ title: 'Bundle Added', description: `The "${bundle.name}" bundle has been added to your cart.`});
    // Reset validation status on change
    if (offerStatus === 'OfferPriceValidated' || offerStatus === 'OfferStockChecked') {
        setOfferStatus('OfferSelected');
    }
  }

  function handleSeatSelect(seat: string | null) {
      setSelectedSeat(seat);
       // Reset validation status on change
    if (offerStatus === 'OfferPriceValidated' || offerStatus === 'OfferStockChecked') {
        setOfferStatus('OfferSelected');
    }
  }
  
  function handleValidateOffer() {
    if(!selectedOffer) return;
    setOfferStatus('OfferPriceValidated');
    toast({
      title: 'Offer Price Validated',
      description: 'Offer price and rules have been re-validated successfully.',
    })
  }

  function handleStockCheck() {
    if(offerStatus !== 'OfferPriceValidated') return;
    setOfferStatus('OfferStockChecked');
     toast({
      title: 'Stock Checked',
      description: 'Seat and ancillary inventory confirmed and held.',
    })
  }

  const totalAncillaryPrice = selectedAncillaries.reduce((acc, anc) => acc + anc.price, 0);
  const totalBundlePrice = selectedBundle?.price || 0;
  const totalSeatPrice = selectedSeat ? 75 : 0; 
  const passengerCount = (form.getValues().passengers.adt || 1) + (form.getValues().passengers.chd || 0);

  const baseOfferPrice = (selectedOffer?.price || 0) * passengerCount;
  let promotionDiscount = 0;
  if (selectedPromotion) {
    if (selectedPromotion.type === 'PERCENTAGE') {
        promotionDiscount = baseOfferPrice * (selectedPromotion.value / 100);
    } else { // FIXED
        promotionDiscount = selectedPromotion.value;
    }
  }

  const totalOrderPrice = (baseOfferPrice - promotionDiscount) + totalBundlePrice + (totalAncillaryPrice * passengerCount) + (totalSeatPrice * passengerCount);
  
  const passengerRefs = Array.from({ length: passengerCount }, (_, i) => `P${i + 1}`);

  const orderCreatePayload = {
    context: { version: '21.3', timestamp: new Date().toISOString(), pos: 'US', channel: 'Direct', currency: 'USD' },
    offer_ref: {
      parent_offer_id: selectedOffer?.id,
      status: offerStatus,
      valid_till: validTill?.toISOString(),
      items: [
        { offer_item_id: `flight-${selectedOffer?.id}`, passenger_refs: passengerRefs, type: 'Flight' },
        ...selectedAncillaries.map(anc => ({ offer_item_id: anc.id, passenger_refs: passengerRefs, type: 'Ancillary' })),
        ...(selectedBundle ? [{ offer_item_id: selectedBundle.id, passenger_refs: passengerRefs, type: 'Bundle' }] : []),
        ...(selectedPromotion ? [{ offer_item_id: selectedPromotion.id, passenger_refs: passengerRefs, type: 'Promotion' }] : []),
        ...(selectedSeat ? [{ offer_item_id: `seat-${selectedSeat}`, passenger_refs: passengerRefs, type: 'Seat' }] : [])
      ]
    },
    passengers: [
        ...Array.from({length: form.getValues().passengers.adt}, () => ({ type: "ADT" })),
        ...Array.from({length: form.getValues().passengers.chd}, () => ({ type: "CHD" })),
    ].map((p, i) => ({...p, id: `P${i+1}`})),
    pricing: { currency: "USD", total: totalOrderPrice },
  };

  const handleSendToOrderModule = () => {
    // 1. Expiry Check
    if (validTill && isBefore(validTill, new Date())) {
        toast({
            variant: 'destructive',
            title: 'Offer Expired',
            description: 'This offer has expired. Please start a new search.',
        });
        setOfferStatus('OfferExpired');
        return;
    }

    // 2. Status Check
    if (offerStatus !== 'OfferStockChecked') {
      toast({
        variant: 'destructive',
        title: 'Action Required',
        description: 'Please validate the offer price and check stock availability before creating an order.',
      });
      return;
    }

    // 3. (Simulated) Price Integrity Check
    const calculatedPrice = (baseOfferPrice - promotionDiscount) + totalBundlePrice + (totalAncillaryPrice * passengerCount) + (totalSeatPrice * passengerCount);
    if (Math.abs(calculatedPrice - totalOrderPrice) > 0.01) {
         toast({
            variant: 'destructive',
            title: 'Price Mismatch Error',
            description: 'The final price has changed. Please re-validate the offer.',
        });
        setOfferStatus('OfferSelected');
        return;
    }
    
    // All checks passed, proceed to create order
    setOfferStatus('OfferConvertedToOrder');
    
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 1000)}`,
      customer: `Composed Order (${passengerCount} Pax)`,
      email: 'customer@example.com',
      status: 'Pending' as const,
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: totalOrderPrice,
    };
    
    sessionStorage.setItem('newly_created_order', JSON.stringify(newOrder));
    
    toast({
      title: "Order Creation Initiated",
      description: `Order ${newOrder.id} is now being processed. You will be redirected to the Orders page.`,
    });
    
    setTimeout(() => router.push('/orders'), 1000);
  };
  
  const currentStatusIndex = offerLifecycleSteps.findIndex(step => step.status === offerStatus);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Offer Composer</h1>
        <p className="text-muted-foreground">
          Compose NDC-compatible offers by discovering and pricing solutions and ancillaries.
        </p>
      </div>

       {reshopContext && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Reshop Mode</AlertTitle>
          <AlertDescription>
            You are modifying Order <span className="font-mono">{reshopContext.id}</span>. Any new selections will be added to this existing order.
          </AlertDescription>
        </Alert>
      )}
      
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
                    <FormField
                        control={form.control}
                        name="tripType"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Trip Type</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center gap-4"
                                    >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="one-way" id="one-way" />
                                        </FormControl>
                                        <FormLabel htmlFor="one-way" className="font-normal">One Way</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="return" id="return" />
                                        </FormControl>
                                        <FormLabel htmlFor="return" className="font-normal">Return</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
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
                         {tripType === 'return' && (
                            <FormField
                            control={form.control}
                            name="returnDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col pt-2">
                                <FormLabel>Return Date</FormLabel>
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
                                        disabled={(date) => date < form.getValues().departureDate}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        )}
                    </div>
                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                 <div className="relative">
                                     <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <FormControl>
                                        <Input placeholder="e.g., TCS_123" {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                         />
                    </div>
                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-4">
                     <FormField
                        control={form.control}
                        name="channel"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Channel</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select channel" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Direct">Direct</SelectItem>
                                        <SelectItem value="TMC">TMC</SelectItem>
                                        <SelectItem value="OTA">OTA</SelectItem>
                                    </SelectContent>
                                </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-4">
                         <FormField
                            control={form.control}
                            name="loyaltyTier"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loyalty Tier (Optional)</FormLabel>
                                <div className="relative">
                                <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                    <SelectTrigger className="pl-9">
                                        <SelectValue placeholder="Select loyalty tier" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="None">None</SelectItem>
                                    <SelectItem value="Silver">Silver</SelectItem>
                                    <SelectItem value="Gold">Gold</SelectItem>
                                    <SelectItem value="Platinum">Platinum Elite</SelectItem>
                                    </SelectContent>
                                </Select>
                                </div>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isStudent"
                            render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2 pt-8">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        id="isStudent"
                                    />
                                </FormControl>
                                 <Label htmlFor="isStudent" className="flex items-center gap-2 font-normal">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    Student
                                </Label>
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
                    <CardTitle>2. Select Flight &amp; Fare</CardTitle>
                    <CardDescription>Choose a flight and a branded fare to add it to your cart.</CardDescription>
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
                            {searchResults.map(journey => <JourneyResultCard key={journey.id} journey={journey} onSelectFare={handleSelectOffer} selectedFareId={selectedOffer?.id} />)}
                        </div>
                        )
                    )}
                </CardContent>
            </Card>
          )}

           {selectedOffer && recommendedBundles && recommendedBundles.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>3. Recommended Bundles</CardTitle>
                    <CardDescription>Save more by choosing one of our recommended bundles for your trip.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedBundles.map(bundle => (
                        <Card key={bundle.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">{bundle.name}</CardTitle>
                                <CardDescription>{bundle.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                                    {bundle.items.map(item => <li key={item}>{item}</li>)}
                                </ul>
                            </CardContent>
                            <div className="p-4 flex flex-col items-end gap-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-muted-foreground line-through">${bundle.originalPrice.toFixed(2)}</span>
                                    <span className="text-2xl font-bold">${bundle.price.toFixed(2)}</span>
                                </div>
                                <Button onClick={() => handleSelectBundle(bundle)} disabled={selectedBundle?.id === bundle.id} className="w-full">
                                    {selectedBundle?.id === bundle.id ? 'Added' : 'Add Bundle'}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
           )}
          
          {selectedOffer && (
            <>
              <Card>
                <CardHeader>
                    <CardTitle>4. Dynamic Offers &amp; Promotions</CardTitle>
                    <CardDescription>
                        Review auto-applied rules and select any additional promotions for your offer.
                        {activeCohort && (
                            <span className="block mt-1 text-primary font-semibold">
                                Identified Cohort: {activeCohort}
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-md mb-2">Automatically Applied Rules</h4>
                        {appliedRules.length > 0 ? (
                             <div className="space-y-1 text-sm text-muted-foreground">
                                {appliedRules.map((rule, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span>{rule.name}</span>
                                        <span className={cn('font-medium', rule.adjustment > 0 ? 'text-destructive' : 'text-green-600')}>{rule.adjustment > 0 ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rule.adjustment)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No automatic rules were applied for this search.</p>
                        )}
                    </div>
                    {availablePromotions.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-md mb-3">Available Promotions</h4>
                            <RadioGroup onValueChange={handleSelectPromotion} value={selectedPromotion?.id}>
                                <div className="space-y-2">
                                    {availablePromotions.map(promo => (
                                        <Label key={promo.id} htmlFor={promo.id} className={cn("p-3 border rounded-md flex items-start justify-between transition-colors cursor-pointer", selectedPromotion?.id === promo.id && "bg-accent/50 border-primary")}>
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem value={promo.id} id={promo.id} />
                                                <div>
                                                    <p className="font-medium">{promo.title}</p>
                                                    <p className="text-sm text-muted-foreground font-normal">{promo.description}</p>
                                                </div>
                                            </div>
                                            <div className="font-semibold text-sm">
                                                {promo.type === 'PERCENTAGE' ? `${promo.value}% OFF` : `-$${promo.value}`}
                                            </div>
                                        </Label>
                                    ))}
                                </div>
                            </RadioGroup>
                        </div>
                    )}
                </CardContent>
              </Card>
              
              <Card>
                  <CardHeader>
                      <CardTitle>5. Add Ancillaries &amp; Seats</CardTitle>
                      <CardDescription>Select optional services for the chosen flight.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AncillarySelection selectedAncillaries={selectedAncillaries} onAncillaryChange={handleAncillaryChange} selectedFare={selectedOffer} />
                      <SeatMap selectedSeat={selectedSeat} onSeatSelect={handleSeatSelect} />
                  </CardContent>
              </Card>
            </>
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

            {offerStatus && (
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Workflow className="h-5 w-5" />
                        <CardTitle>Offer Lifecycle</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border" />
                            {offerLifecycleSteps.map((step, index) => {
                                const isCompleted = index < currentStatusIndex;
                                const isCurrent = index === currentStatusIndex;
                                return (
                                <div key={step.status} className="flex items-start gap-4 relative">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                                        isCompleted ? "bg-primary" : "bg-muted-foreground/30",
                                        isCurrent && "bg-primary ring-4 ring-primary/20"
                                    )}>
                                        {isCompleted && <Check className="w-3 h-3 text-primary-foreground" />}
                                    </div>
                                    <div className="pb-8">
                                        <p className="font-semibold">{step.label}</p>
                                        <p className="text-xs text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </CardContent>
                </Card>
            )}

            {selectedOffer && (
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <ShoppingBasket className="h-5 w-5" />
                        <CardTitle>6. Shopping Cart</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-mono">{selectedOffer.id} (x{passengerCount})</span>
                                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(baseOfferPrice)}</span>
                            </div>
                             {selectedPromotion && (
                                <div className="flex justify-between text-green-600">
                                    <span className="text-muted-foreground font-mono">{selectedPromotion.id}</span>
                                    <span>
                                        {selectedPromotion.type === 'PERCENTAGE' ? `-${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(promotionDiscount)}` : `-$${selectedPromotion.value.toFixed(2)}`}
                                    </span>
                                </div>
                            )}
                             {selectedBundle && (
                                <div className="flex justify-between">
                                <span className="text-muted-foreground font-mono">{selectedBundle.id} (x1)</span>
                                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedBundle.price)}</span>
                            </div>
                            )}
                            {selectedAncillaries.map(anc => (
                                <div key={anc.id} className="flex justify-between">
                                <span className="text-muted-foreground font-mono">{anc.id} (x{passengerCount})</span>
                                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(anc.price * passengerCount)}</span>
                            </div>
                            ))}
                            {selectedSeat && (
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground font-mono">SEAT-{selectedSeat} (x{passengerCount})</span>
                                    <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalSeatPrice * passengerCount)}</span>
                                </div>
                            )}
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalOrderPrice)}</span>
                        </div>
                        
                        <div className="space-y-2 pt-2">
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="validTill">Valid Till</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="validTill"
                                            variant={'outline'}
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !validTill && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {validTill ? format(validTill, 'PPP') : <span>Pick an expiry date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={validTill}
                                            onSelect={setValidTill}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                           <Button className="w-full" onClick={handleValidateOffer} disabled={offerStatus === 'OfferPriceValidated' || offerStatus === 'OfferStockChecked'}>
                            {offerStatus === 'OfferPriceValidated' || offerStatus === 'OfferStockChecked' ? <BadgeCheck className="mr-2 h-4 w-4" /> : null}
                                Validate Price
                           </Button>
                           <Button className="w-full" variant="outline" onClick={handleStockCheck} disabled={offerStatus !== 'OfferPriceValidated'}>
                            {offerStatus === 'OfferStockChecked' ? <BadgeCheck className="mr-2 h-4 w-4" /> : null}
                                Check Stock Availability
                           </Button>
                        </div>
                        
                        {(offerStatus === 'OfferPriceValidated' || offerStatus === 'OfferStockChecked') && (
                            <Alert variant={offerStatus === 'OfferStockChecked' ? 'default' : 'destructive'}>
                                {offerStatus === 'OfferStockChecked' ? <BadgeCheck className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                <AlertTitle>
                                    {offerStatus === 'OfferStockChecked' ? 'Ready for Order Creation' : 'Validation Error'}
                                </AlertTitle>
                                <AlertDescription>
                                    {offerStatus === 'OfferStockChecked' 
                                        ? 'All items are validated and stock is confirmed. You can now create the order.' 
                                        : 'Offer must be price validated and stock checked before creating an order.'
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




    