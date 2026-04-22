'use client';

import { useState, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Search, 
  Loader2, 
  Check, 
  Zap, 
  Activity, 
  CreditCard, 
  MapPin, 
  Luggage, 
  ReceiptText, 
  QrCode, 
  Plane, 
  User, 
  Users,
  Ticket, 
  Clock, 
  Building2,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Utensils,
  Armchair,
  Star,
  MonitorDot,
  Sparkles,
  Truck,
  Gauge,
  CalendarDays,
  Layers,
  Filter,
  Trash2,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  Trophy,
  Accessibility,
  Store,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Target,
  Calculator
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// --- SIMULATION SCHEMAS ---

const simulationSchema = z.object({
  // A. Flight / Journey
  airline: z.string().min(1, 'Required'),
  flightNumber: z.string().min(1, 'Required').toUpperCase(),
  travelDate: z.string().min(1, 'Required'),
  origin: z.string().length(3).toUpperCase(),
  destination: z.string().length(3).toUpperCase(),
  tripType: z.enum(['one_way', 'return']),
  geography: z.enum(['Domestic', 'International']),
  durationBand: z.enum(['Short-haul', 'Medium-haul', 'Long-haul']),
  daysToDeparture: z.coerce.number().min(0),
  bookingStage: z.enum(['At booking', 'Post-booking', 'Check-in', 'Airport', 'Gate']),
  channel: z.enum(['Web', 'App', 'NDC', 'CUSS', 'CUTE-CUPPS', 'Agent']),

  // B. Passenger Counts
  adults: z.coerce.number().min(1),
  children: z.coerce.number().min(0),
  infants: z.coerce.number().min(0),

  // C. Passenger Profile
  paxType: z.enum(['Solo', 'Family', 'Group', 'Corporate', 'VIP']),
  purpose: z.enum(['Business', 'Leisure']),
  isFrequent: z.boolean().default(false),
  isFirstTime: z.boolean().default(false),
  isLastMinute: z.boolean().default(false),
  isConnecting: z.boolean().default(false),

  // D. Loyalty
  isLoyaltyMember: z.boolean().default(false),
  loyaltyTier: z.enum(['None', 'Silver', 'Gold', 'Platinum']),
  isLoungeMember: z.boolean().default(false),
  hasCoBrandedCard: z.boolean().default(false),

  // E. Booking / Fare
  cabinClass: z.enum(['Economy', 'Premium Economy', 'Business', 'First']),
  fareFamily: z.enum(['Basic', 'Standard', 'Flex', 'Premium']),
  bookingClass: z.string().length(1).toUpperCase(),
  ticketType: z.enum(['Paid', 'Award']),
  isGroupBooking: z.boolean().default(false),

  // F. Preferences
  seatPref: z.enum(['Window', 'Aisle', 'No preference']),
  mealPref: z.enum(['Veg', 'Non-veg', 'Special meal', 'No preference']),
  baggagePref: z.enum(['Light', 'Standard', 'Heavy']),
  premiumPref: z.enum(['Low', 'Medium', 'High']),
  priceSensitivity: z.enum(['Low', 'Medium', 'High']),

  // G. Assistance / SSR
  withInfant: z.boolean().default(false),
  wheelchair: z.boolean().default(false),
  specialMeal: z.boolean().default(false),
  petTraveler: z.boolean().default(false),
  medicalRequired: z.boolean().default(false),

  // H. Existing Purchases
  hasPurchasedSeat: z.boolean().default(false),
  hasPurchasedBaggage: z.boolean().default(false),
  hasPurchasedMeal: z.boolean().default(false),
  hasPurchasedUpgrade: z.boolean().default(false),
  hasPurchasedPriority: z.boolean().default(false),
  hasPurchasedLounge: z.boolean().default(false),

  // I. Inventory / Operational
  aircraftType: z.string().default('A350-900'),
  remSeatInv: z.coerce.number().default(12),
  remUpgradeInv: z.coerce.number().default(2),
  remBagInv: z.coerce.number().default(50),
  loadFactor: z.coerce.number().min(0).max(100).default(82),
  isCheckInOpen: z.boolean().default(true),
  isAirportStage: z.boolean().default(false),

  // J. Controls
  genAirlineOffers: z.boolean().default(true),
  genAirportOffers: z.boolean().default(true),
  runExplanation: z.boolean().default(true),
});

type SimulationData = z.infer<typeof simulationSchema>;

type Step = 
    | 'INPUT' 
    | 'SUMMARY' 
    | 'COHORTS' 
    | 'UNIVERSE' 
    | 'FILTERING' 
    | 'PRICING' 
    | 'RANKING' 
    | 'LIMITING' 
    | 'DISPLAY' 
    | 'STOCK' 
    | 'PAYMENT' 
    | 'UPDATE' 
    | 'FINAL';

// --- MOCK CONSTANTS ---

const ALL_OFFERS = [
    { id: 'O-A1', name: 'Preferred Seat', domain: 'Airline', basePrice: 20, type: 'Seat' },
    { id: 'O-A2', name: 'Extra Legroom Seat', domain: 'Airline', basePrice: 50, type: 'Seat' },
    { id: 'O-A3', name: 'Extra Baggage (23kg)', domain: 'Airline', basePrice: 45, type: 'Baggage' },
    { id: 'O-A4', name: 'Priority Boarding', domain: 'Airline', basePrice: 15, type: 'Priority' },
    { id: 'O-A5', name: 'Gourmet Meal Upgrade', domain: 'Airline', basePrice: 25, type: 'Meal' },
    { id: 'O-A6', name: 'In-flight Wi-Fi', domain: 'Airline', basePrice: 10, type: 'Digital' },
    { id: 'O-A7', name: 'Lounge Access (Carrier)', domain: 'Airline', basePrice: 40, type: 'Lounge' },
    { id: 'O-A8', name: 'Business Class Upgrade', domain: 'Airline', basePrice: 250, type: 'Upgrade' },
    { id: 'O-P1', name: 'Executive Lounge Access', domain: 'Airport', basePrice: 55, type: 'Lounge' },
    { id: 'O-P2', name: 'Security Fast Track', domain: 'Airport', basePrice: 12, type: 'Priority' },
    { id: 'O-P3', name: 'Meet & Greet Assist', domain: 'Airport', basePrice: 80, type: 'Service' },
    { id: 'O-P4', name: 'VIP Buggy Service', domain: 'Airport', basePrice: 30, type: 'Service' },
];

export default function OffersenseSimulatorPage() {
  const [currentStep, setCurrentStep] = useState<Step>('INPUT');
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<SimulationData>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
        airline: 'GAB',
        flightNumber: 'AC101',
        travelDate: '2025-10-28',
        origin: 'LHR',
        destination: 'JFK',
        tripType: 'one_way',
        geography: 'International',
        durationBand: 'Long-haul',
        daysToDeparture: 2,
        bookingStage: 'Check-in',
        channel: 'CUSS',
        adults: 2,
        children: 1,
        infants: 0,
        paxType: 'Family',
        purpose: 'Leisure',
        isFrequent: true,
        loyaltyTier: 'Gold',
        isLoyaltyMember: true,
        cabinClass: 'Economy',
        fareFamily: 'Flex',
        bookingClass: 'Y',
        ticketType: 'Paid',
        seatPref: 'No preference',
        mealPref: 'Veg',
        baggagePref: 'Heavy',
        premiumPref: 'Medium',
        priceSensitivity: 'Medium',
        loadFactor: 82,
        aircraftType: 'A350-900',
        genAirlineOffers: true,
        genAirportOffers: true,
        runExplanation: true,
    },
  });

  const next = () => {
    const steps: Step[] = ['INPUT', 'SUMMARY', 'COHORTS', 'UNIVERSE', 'FILTERING', 'PRICING', 'RANKING', 'LIMITING', 'DISPLAY', 'STOCK', 'PAYMENT', 'UPDATE', 'FINAL'];
    const idx = steps.indexOf(currentStep);
    if (idx < steps.length - 1) setCurrentStep(steps[idx + 1]);
  };

  const back = () => {
    const steps: Step[] = ['INPUT', 'SUMMARY', 'COHORTS', 'UNIVERSE', 'FILTERING', 'PRICING', 'RANKING', 'LIMITING', 'DISPLAY', 'STOCK', 'PAYMENT', 'UPDATE', 'FINAL'];
    const idx = steps.indexOf(currentStep);
    if (idx > 0) setCurrentStep(steps[idx - 1]);
  };

  const handleRunSimulation = (data: SimulationData) => {
    setIsLoading(true);
    setSimulationData(data);
    setTimeout(() => {
        setIsLoading(false);
        setCurrentStep('SUMMARY');
    }, 1200);
  };

  // --- LOGIC HELPERS ---

  const evaluatedCohorts = useMemo(() => {
    if (!simulationData) return [];
    const results = [
        { id: 'C1', name: 'Frequent Traveler', matched: simulationData.isFrequent || simulationData.loyaltyTier !== 'None', reason: simulationData.isFrequent ? 'Marked as frequent traveler.' : 'Loyalty tier is active.' },
        { id: 'C2', name: 'Family Traveler', matched: simulationData.children > 0 || simulationData.infants > 0 || simulationData.paxType === 'Family', reason: 'Traveling with dependents or marked as family.' },
        { id: 'C3', name: 'Premium Upsell', matched: simulationData.cabinClass === 'Economy' && simulationData.loyaltyTier === 'Platinum', reason: 'High-tier member in standard cabin.' },
        { id: 'C4', name: 'Last-Minute Traveler', matched: simulationData.daysToDeparture <= 1 || simulationData.isLastMinute, reason: 'Booking/Session detected near departure.' },
        { id: 'C5', name: 'Price Sensitive', matched: simulationData.priceSensitivity === 'High' || simulationData.fareFamily === 'Basic', reason: 'Explicit preference or restricted fare family.' },
    ];
    return results;
  }, [simulationData]);

  const filteredOffers = useMemo(() => {
    if (!simulationData) return { remaining: [], removed: [] };
    
    let removed: any[] = [];
    let current = [...ALL_OFFERS];

    // Filter 1: Already Purchased
    const purchased = current.filter(o => 
        (o.type === 'Baggage' && simulationData.hasPurchasedBaggage) ||
        (o.type === 'Meal' && simulationData.hasPurchasedMeal) ||
        (o.type === 'Seat' && simulationData.hasPurchasedSeat) ||
        (o.type === 'Upgrade' && simulationData.hasPurchasedUpgrade) ||
        (o.type === 'Priority' && simulationData.hasPurchasedPriority) ||
        (o.type === 'Lounge' && simulationData.hasPurchasedLounge)
    );
    removed.push({ step: 'Already Purchased', items: purchased });
    current = current.filter(o => !purchased.includes(o));

    // Filter 2: Ineligible Products
    const ineligible = current.filter(o => 
        (o.name === 'Extra Legroom Seat' && simulationData.infants > 0) || // Exit row restriction
        (o.name === 'Business Class Upgrade' && simulationData.fareFamily === 'Basic') // Fare restriction
    );
    removed.push({ step: 'Ineligible Products', items: ineligible });
    current = current.filter(o => !ineligible.includes(o));

    // Filter 3: Inventory Unavailable
    const unavailable = current.filter(o => 
        (o.type === 'Lounge' && simulationData.remSeatInv === 0) || // Mocking lounge outage
        (o.name === 'Extra Legroom Seat' && simulationData.remSeatInv < 2)
    );
    removed.push({ step: 'Inventory Unavailable', items: unavailable });
    current = current.filter(o => !unavailable.includes(o));

    // Filter 4: Rule Violations
    const rules = current.filter(o => 
        (o.name === 'Priority Boarding' && simulationData.loyaltyTier === 'Platinum') || // Already included
        (o.name === 'In-flight Wi-Fi' && simulationData.aircraftType === 'B737-800') // Aircraft not enabled
    );
    removed.push({ step: 'Rule Violations', items: rules });
    current = current.filter(o => !rules.includes(o));

    // Filter 5: Channel/Stage
    const stage = current.filter(o => 
        (o.name === 'Gourmet Meal Upgrade' && simulationData.bookingStage === 'Gate') // Too late
    );
    removed.push({ step: 'Channel / Stage Rules', items: stage });
    current = current.filter(o => !stage.includes(o));

    return { remaining: current, removed };
  }, [simulationData]);

  const pricedOffers = useMemo(() => {
    if (!simulationData) return [];
    return filteredOffers.remaining.map(o => {
        let adjustment = 0;
        let reasons: string[] = [];

        // Cohort Discount
        if (evaluatedCohorts.find(c => c.name === 'Family Traveler' && c.matched)) {
            adjustment -= 0.15;
            reasons.push('Family Traveler Discount (-15%)');
        }

        // Inventory Adjustment
        if (simulationData.loadFactor > 90) {
            adjustment += 0.10;
            reasons.push('High Load Factor Surcharge (+10%)');
        }

        const finalPrice = o.basePrice * (1 + adjustment);
        return { ...o, finalPrice, reasons };
    });
  }, [simulationData, filteredOffers.remaining, evaluatedCohorts]);

  const rankedOffers = useMemo(() => {
      return [...pricedOffers].sort((a, b) => {
          // Mock ranking: Priority to high margin or high relevance
          if (a.type === 'Upgrade') return -1;
          if (b.type === 'Upgrade') return 1;
          return b.finalPrice - a.finalPrice;
      });
  }, [pricedOffers]);

  const limitedOffers = useMemo(() => {
      return rankedOffers.slice(0, 4); // Max 4 for simulation
  }, [rankedOffers]);

  // --- RENDER SCREENS ---

  const renderHeader = (title: string, desc: string, icon?: any) => (
      <div className="flex flex-col gap-1 mb-6 border-b pb-4">
          <h2 className="text-xl font-black text-primary uppercase flex items-center gap-2">
            {icon && <span className="p-1.5 bg-primary/10 rounded-lg">{icon}</span>}
            {title}
          </h2>
          <p className="text-sm text-muted-foreground font-medium">{desc}</p>
      </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full min-h-[85vh]">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-primary uppercase flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-500" />
            Offersense Simulator
          </h1>
          <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-primary/5">
                Stage: {currentStep}
              </Badge>
              {currentStep !== 'INPUT' && (
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep('INPUT')} className="h-6 text-[10px] font-bold uppercase underline">Reset Simulation</Button>
              )}
          </div>
        </div>
        <div className="flex items-center gap-3">
             {currentStep !== 'INPUT' && (
                <Button variant="outline" size="sm" onClick={back} className="h-9 font-bold"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
             )}
             {['SUMMARY', 'COHORTS', 'UNIVERSE', 'FILTERING', 'PRICING', 'RANKING', 'LIMITING'].includes(currentStep) && (
                <Button size="sm" onClick={next} className="h-9 font-bold">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
             )}
        </div>
      </div>

      <div className="flex-grow flex items-start justify-center py-4">
        
        {/* STEP 1: INPUT SCREEN */}
        {currentStep === 'INPUT' && (
            <Card className="w-full shadow-2xl border-primary/10 overflow-hidden">
                <CardHeader className="bg-primary/5 border-b text-center py-8">
                    <CardTitle className="text-2xl font-black text-primary uppercase">Simulator Context Configuration</CardTitle>
                    <CardDescription className="max-w-xl mx-auto">Define the exhaustive journey and passenger context to test the retailing engine logic.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleRunSimulation)}>
                            <div className="grid grid-cols-1 md:grid-cols-12">
                                {/* Left Sidebar: Navigation tabs for form sections if needed, or just scrolling */}
                                <div className="md:col-span-12 p-8 space-y-10">
                                    <Accordion type="multiple" defaultValue={['journey', 'pax', 'profile', 'purchases']} className="w-full">
                                        
                                        {/* A. JOURNEY */}
                                        <AccordionItem value="journey" className="border-none">
                                            <AccordionTrigger className="hover:no-underline py-4 bg-slate-50 px-4 rounded-xl mb-4">
                                                <div className="flex items-center gap-3 text-primary font-black uppercase text-xs tracking-widest">
                                                    <Plane className="h-4 w-4" /> A. Flight & Journey Context
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-8">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                                                    <FormField control={form.control} name="airline" render={({field}) => (
                                                        <FormItem><FormLabel>Airline</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                            <SelectContent><SelectItem value="GAB">Global Airways</SelectItem><SelectItem value="SBA">SkyBridge Airlines</SelectItem></SelectContent></Select></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="flightNumber" render={({field}) => (<FormItem><FormLabel>Flight #</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                                    <FormField control={form.control} name="travelDate" render={({field}) => (<FormItem><FormLabel>Travel Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>)} />
                                                    <FormField control={form.control} name="bookingStage" render={({field}) => (
                                                        <FormItem><FormLabel>Booking Stage</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                            <SelectContent><SelectItem value="At booking">At booking</SelectItem><SelectItem value="Check-in">Check-in</SelectItem><SelectItem value="Airport">Airport</SelectItem><SelectItem value="Gate">Gate</SelectItem></SelectContent></Select></FormItem>
                                                    )} />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                                                    <FormField control={form.control} name="origin" render={({field}) => (<FormItem><FormLabel>Origin (IATA)</FormLabel><FormControl><Input maxLength={3} {...field} /></FormControl></FormItem>)} />
                                                    <FormField control={form.control} name="destination" render={({field}) => (<FormItem><FormLabel>Destination (IATA)</FormLabel><FormControl><Input maxLength={3} {...field} /></FormControl></FormItem>)} />
                                                    <FormField control={form.control} name="geography" render={({field}) => (
                                                        <FormItem><FormLabel>Geography</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                            <SelectContent><SelectItem value="Domestic">Domestic</SelectItem><SelectItem value="International">International</SelectItem></SelectContent></Select></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="channel" render={({field}) => (
                                                        <FormItem><FormLabel>Sales Channel</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                            <SelectContent><SelectItem value="Web">Web</SelectItem><SelectItem value="App">App</SelectItem><SelectItem value="CUSS">CUSS Kiosk</SelectItem><SelectItem value="Agent">Agent Desktop</SelectItem></SelectContent></Select></FormItem>
                                                    )} />
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* B & C. PASSENGERS */}
                                        <AccordionItem value="pax" className="border-none">
                                            <AccordionTrigger className="hover:no-underline py-4 bg-slate-50 px-4 rounded-xl mb-4">
                                                <div className="flex items-center gap-3 text-primary font-black uppercase text-xs tracking-widest">
                                                    <Users className="h-4 w-4" /> B & C. Passenger Profile
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-8">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                                                    <FormField control={form.control} name="adults" render={({field}) => (<FormItem><FormLabel>Adults</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                                                    <FormField control={form.control} name="children" render={({field}) => (<FormItem><FormLabel>Children</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                                                    <FormField control={form.control} name="paxType" render={({field}) => (
                                                        <FormItem><FormLabel>Group Category</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                            <SelectContent><SelectItem value="Solo">Solo</SelectItem><SelectItem value="Family">Family</SelectItem><SelectItem value="Group">Group</SelectItem><SelectItem value="Corporate">Corporate</SelectItem><SelectItem value="VIP">VIP</SelectItem></SelectContent></Select></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="purpose" render={({field}) => (
                                                        <FormItem><FormLabel>Travel Purpose</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                            <SelectContent><SelectItem value="Business">Business</SelectItem><SelectItem value="Leisure">Leisure</SelectItem></SelectContent></Select></FormItem>
                                                    )} />
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                                    <FormField control={form.control} name="isFrequent" render={({field}) => (<FormItem className="flex items-center gap-2 space-y-0 rounded-lg border p-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Frequent Traveler</FormLabel></FormItem>)} />
                                                    <FormField control={form.control} name="isConnecting" render={({field}) => (<FormItem className="flex items-center gap-2 space-y-0 rounded-lg border p-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Connecting Trip</FormLabel></FormItem>)} />
                                                    <FormField control={form.control} name="wheelchair" render={({field}) => (<FormItem className="flex items-center gap-2 space-y-0 rounded-lg border p-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Wheelchair Required</FormLabel></FormItem>)} />
                                                    <FormField control={form.control} name="petTraveler" render={({field}) => (<FormItem className="flex items-center gap-2 space-y-0 rounded-lg border p-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Traveling with Pet</FormLabel></FormItem>)} />
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* D & E. LOYALTY & BOOKING */}
                                        <AccordionItem value="profile" className="border-none">
                                            <AccordionTrigger className="hover:no-underline py-4 bg-slate-50 px-4 rounded-xl mb-4">
                                                <div className="flex items-center gap-3 text-primary font-black uppercase text-xs tracking-widest">
                                                    <Trophy className="h-4 w-4" /> D & E. Loyalty & Fare Integrity
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-8">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                                                    <FormField control={form.control} name="loyaltyTier" render={({field}) => (
                                                        <FormItem><FormLabel>Loyalty Tier</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                            <SelectContent><SelectItem value="None">None</SelectItem><SelectItem value="Silver">Silver</SelectItem><SelectItem value="Gold">Gold</SelectItem><SelectItem value="Platinum">Platinum</SelectItem></SelectContent></Select></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="cabinClass" render={({field}) => (
                                                        <FormItem><FormLabel>Cabin Class</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                            <SelectContent><SelectItem value="Economy">Economy</SelectItem><SelectItem value="Premium Economy">Premium Economy</SelectItem><SelectItem value="Business">Business</SelectItem><SelectItem value="First">First</SelectItem></SelectContent></Select></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="fareFamily" render={({field}) => (
                                                        <FormItem><FormLabel>Fare Brand</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                            <SelectContent><SelectItem value="Basic">Basic</SelectItem><SelectItem value="Standard">Standard</SelectItem><SelectItem value="Flex">Flex</SelectItem><SelectItem value="Premium">Premium</SelectItem></SelectContent></Select></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="priceSensitivity" render={({field}) => (
                                                        <FormItem><FormLabel>Price Sensitivity</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                            <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent></Select></FormItem>
                                                    )} />
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* H. EXISTING PURCHASES */}
                                        <AccordionItem value="purchases" className="border-none">
                                            <AccordionTrigger className="hover:no-underline py-4 bg-slate-50 px-4 rounded-xl mb-4">
                                                <div className="flex items-center gap-3 text-primary font-black uppercase text-xs tracking-widest">
                                                    <ShoppingCart className="h-4 w-4" /> H. Existing PSS State (Inventory Filtration)
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-8">
                                                <p className="text-xs text-muted-foreground mb-4 font-medium italic">Checked items will be filtered out from the final simulation stream to prevent double-selling.</p>
                                                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                                    <FormField control={form.control} name="hasPurchasedSeat" render={({field}) => (<FormItem className="flex items-center gap-2 space-y-0 rounded-lg border p-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Seat</FormLabel></FormItem>)} />
                                                    <FormField control={form.control} name="hasPurchasedBaggage" render={({field}) => (<FormItem className="flex items-center gap-2 space-y-0 rounded-lg border p-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Baggage</FormLabel></FormItem>)} />
                                                    <FormField control={form.control} name="hasPurchasedMeal" render={({field}) => (<FormItem className="flex items-center gap-2 space-y-0 rounded-lg border p-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Meal</FormLabel></FormItem>)} />
                                                    <FormField control={form.control} name="hasPurchasedUpgrade" render={({field}) => (<FormItem className="flex items-center gap-2 space-y-0 rounded-lg border p-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Upgrade</FormLabel></FormItem>)} />
                                                    <FormField control={form.control} name="hasPurchasedPriority" render={({field}) => (<FormItem className="flex items-center gap-2 space-y-0 rounded-lg border p-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Priority</FormLabel></FormItem>)} />
                                                    <FormField control={form.control} name="hasPurchasedLounge" render={({field}) => (<FormItem className="flex items-center gap-2 space-y-0 rounded-lg border p-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Lounge</FormLabel></FormItem>)} />
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                    </Accordion>
                                </div>
                            </div>

                            <CardFooter className="bg-primary/5 border-t p-8 flex justify-between items-center">
                                <div className="flex items-center gap-6">
                                    <FormField control={form.control} name="runExplanation" render={({field}) => (<FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-black uppercase">Run Logic Explanation Trace</FormLabel></FormItem>)} />
                                </div>
                                <Button type="submit" disabled={isLoading} className="h-14 px-12 font-black uppercase tracking-widest shadow-xl">
                                    {isLoading ? <Loader2 className="mr-2 animate-spin h-5 w-5" /> : <Zap className="mr-2 h-5 w-5 fill-current" />}
                                    Initiate Engine Simulation
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        )}

        {/* STEP 2: SUMMARY SCREEN */}
        {currentStep === 'SUMMARY' && simulationData && (
            <Card className="w-full max-w-4xl shadow-xl animate-in fade-in zoom-in-95 duration-500">
                <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="text-lg font-black uppercase">Simulation Context Captured</CardTitle>
                    <CardDescription>Reviewing understood parameters before executing retailing logic.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Journey</p>
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <p className="font-black text-primary text-xl">{simulationData.origin} → {simulationData.destination}</p>
                                <p className="text-xs font-bold text-slate-500 mt-1">{simulationData.flightNumber} • {simulationData.travelDate}</p>
                                <Badge variant="outline" className="mt-2 text-[8px] bg-white">{simulationData.channel} Channel</Badge>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Passenger</p>
                            <div className="p-4 rounded-xl bg-slate-50 border space-y-1">
                                <p className="font-bold text-sm">{simulationData.adults} Adults, {simulationData.children} Children</p>
                                <p className="text-xs text-muted-foreground">{simulationData.paxType} • {simulationData.purpose}</p>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <Trophy className="h-3 w-3 text-amber-500" />
                                    <span className="text-[10px] font-black uppercase">{simulationData.loyaltyTier} Member</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Operational Pulse</p>
                            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-emerald-800 uppercase">Load Factor</span>
                                    <span className="font-mono font-black text-emerald-700">{simulationData.loadFactor}%</span>
                                </div>
                                <div className="w-full bg-emerald-200 rounded-full h-1">
                                    <div className="bg-emerald-600 h-1 rounded-full" style={{ width: `${simulationData.loadFactor}%` }} />
                                </div>
                                <p className="text-[9px] text-emerald-600 font-bold mt-2 uppercase tracking-tighter">{simulationData.aircraftType} Aircraft</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}

        {/* STEP 3: COHORTS EVALUATION */}
        {currentStep === 'COHORTS' && (
             <Card className="w-full max-w-4xl shadow-xl animate-in slide-in-from-right-4 duration-500">
                <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                        <Target className="h-5 w-5" /> 3. Ecosystem Cohort Evaluation
                    </CardTitle>
                    <CardDescription>Offersense evaluates over 50+ signals to group passengers into high-conversion segments.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Signals Considered</p>
                             <div className="flex flex-wrap gap-2">
                                {['Loyalty', 'Family Size', 'Fare Flex', 'Lead Time', 'Spend Pattern'].map(s => (
                                    <Badge key={s} variant="secondary" className="bg-slate-100 text-slate-700 font-bold">{s}</Badge>
                                ))}
                             </div>
                        </div>
                        <div className="space-y-4">
                             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Selection Logic</p>
                             <p className="text-xs text-muted-foreground leading-relaxed italic">"Dynamic Request-time evaluation uses Boolean logic trees to prioritize high-yield opportunities while maintaining relevance."</p>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        {evaluatedCohorts.map(cohort => (
                            <div key={cohort.id} className={cn(
                                "flex items-center justify-between p-4 rounded-xl border transition-all",
                                cohort.matched ? "bg-emerald-50 border-emerald-200" : "bg-white opacity-50 grayscale"
                            )}>
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center",
                                        cohort.matched ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                                    )}>
                                        {cohort.matched ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <p className="font-black text-sm uppercase">{cohort.name}</p>
                                        <p className="text-xs text-muted-foreground">{cohort.reason}</p>
                                    </div>
                                </div>
                                <Badge variant={cohort.matched ? "default" : "outline"} className={cn(cohort.matched && "bg-emerald-600")}>
                                    {cohort.matched ? 'MATCHED' : 'NOT MATCHED'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
             </Card>
        )}

        {/* STEP 4: OFFER UNIVERSE */}
        {currentStep === 'UNIVERSE' && (
            <Card className="w-full max-w-4xl shadow-xl animate-in slide-in-from-right-4 duration-500">
                <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                        <Layers className="h-5 w-5" /> 4. Global Offer Universe
                    </CardTitle>
                    <CardDescription>Initial pool of all retailable SKUs from Airline and Airport Ecosystems.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h4 className="font-black uppercase text-xs text-blue-600 flex items-center gap-2"><Plane className="h-4 w-4" /> Airline SKUs ({ALL_OFFERS.filter(o => o.domain === 'Airline').length})</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {ALL_OFFERS.filter(o => o.domain === 'Airline').map(o => (
                                    <div key={o.id} className="p-3 bg-white border rounded-xl flex justify-between items-center text-xs font-bold">
                                        <span>{o.name}</span>
                                        <span className="text-muted-foreground font-mono">${o.basePrice}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-black uppercase text-xs text-amber-600 flex items-center gap-2"><Building2 className="h-4 w-4" /> Airport Hub SKUs ({ALL_OFFERS.filter(o => o.domain === 'Airport').length})</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {ALL_OFFERS.filter(o => o.domain === 'Airport').map(o => (
                                    <div key={o.id} className="p-3 bg-white border rounded-xl flex justify-between items-center text-xs font-bold">
                                        <span>{o.name}</span>
                                        <span className="text-muted-foreground font-mono">${o.basePrice}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}

        {/* STEP 5: FILTERING SCREEN */}
        {currentStep === 'FILTERING' && (
            <Card className="w-full max-w-5xl shadow-xl animate-in slide-in-from-right-4 duration-500">
                <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                        <Filter className="h-5 w-5" /> 5. Offer Eligibility & Filtering
                    </CardTitle>
                    <CardDescription>Sequential filtration based on PSS state, regulatory safety, and technical availability.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="relative pl-8 space-y-12">
                        <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
                        {filteredOffers.removed.map((stage, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-[1.35rem] top-1 h-3 w-3 rounded-full bg-slate-200 border-2 border-white" />
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-black uppercase text-xs text-slate-800">Filter {idx + 1}: {stage.step}</h4>
                                        <Badge variant="outline" className="text-[10px] text-rose-600 border-rose-100 bg-rose-50">-{stage.items.length} SKUs Removed</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {stage.items.length > 0 ? stage.items.map((o: any) => (
                                            <div key={o.id} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 line-through">
                                                {o.name}
                                            </div>
                                        )) : <p className="text-[10px] text-muted-foreground italic">No SKUs removed in this filter pass.</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="relative">
                            <div className="absolute -left-[1.35rem] top-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                            <div className="space-y-4">
                                <h4 className="font-black uppercase text-xs text-emerald-600">Final Stage: Eligible Offers</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filteredOffers.remaining.map((o: any) => (
                                        <div key={o.id} className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-black text-emerald-800 shadow-sm">
                                            {o.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}

        {/* STEP 6: PRICING EVALUATION */}
        {currentStep === 'PRICING' && (
             <Card className="w-full max-w-4xl shadow-xl animate-in slide-in-from-right-4 duration-500">
                <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                        <Calculator className="h-5 w-5" /> 6. Dynamic Pricing Evaluation
                    </CardTitle>
                    <CardDescription>Calculating final sellable prices based on cohort adjustments and operational surcharges.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    {pricedOffers.map((offer, idx) => (
                        <div key={offer.id} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary font-black text-xs">{idx + 1}</div>
                                    <h4 className="font-black uppercase text-md">{offer.name}</h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-primary font-mono">${offer.finalPrice.toFixed(2)}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Final Price</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Calculation Steps</span>
                                    <span>Base: ${offer.basePrice}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 space-y-2">
                                    {offer.reasons.length > 0 ? offer.reasons.map((r, i) => (
                                        <div key={i} className="flex justify-between text-xs items-center">
                                            <span className="text-slate-600 font-medium flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-slate-400" /> {r}
                                            </span>
                                            <Badge variant="outline" className="bg-white text-[9px]">Adjusted</Badge>
                                        </div>
                                    )) : <p className="text-[10px] italic text-muted-foreground">Standard pricing applied.</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">All prices within commercial guardrails for {simulationData?.airline} pos.</p>
                    </div>
                </CardContent>
             </Card>
        )}

        {/* STEP 7: RANKING SCREEN */}
        {currentStep === 'RANKING' && (
             <Card className="w-full max-w-2xl shadow-xl animate-in zoom-in-95 duration-500">
                <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" /> 7. Offer Ranking & Re-Ordering
                    </CardTitle>
                    <CardDescription>Sorting by conversion probability and business priority.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        <span>Ranked Offer</span>
                        <span className="text-right">Ranking Signal</span>
                    </div>
                    {rankedOffers.map((offer, idx) => (
                        <div key={offer.id} className="flex justify-between items-center p-4 rounded-xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors" />
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black text-slate-300">#0{idx + 1}</span>
                                <span className="font-black text-sm">{offer.name}</span>
                            </div>
                            <div className="text-right">
                                <Badge variant="secondary" className="text-[9px]">{idx === 0 ? 'Highest Uplift' : 'High Relevance'}</Badge>
                            </div>
                        </div>
                    ))}
                </CardContent>
             </Card>
        )}

        {/* STEP 8: LIMITING SCREEN */}
        {currentStep === 'LIMITING' && (
             <Card className="w-full max-w-lg shadow-xl animate-in zoom-in-95 duration-500">
                <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                        <MonitorDot className="h-5 w-5" /> 8. UI Display Limiting
                    </CardTitle>
                    <CardDescription>Enforcing channel-specific UX constraints for {simulationData?.channel}.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-slate-900 text-white">
                        <div className="flex items-center gap-3">
                            <QrCode className="h-5 w-5 text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest">Kiosk Display Cap</span>
                        </div>
                        <span className="text-lg font-black font-mono">4</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Final Display Selection</p>
                        {limitedOffers.map(o => (
                            <div key={o.id} className="flex justify-between items-center p-3 rounded-lg border bg-emerald-50/50 border-emerald-100">
                                <span className="text-xs font-bold">{o.name}</span>
                                <Check className="h-3 w-3 text-emerald-600" />
                            </div>
                        ))}
                    </div>
                </CardContent>
             </Card>
        )}

        {/* STEP 9: FINAL OFFER DISPLAY */}
        {currentStep === 'DISPLAY' && (
            <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-700">
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Your Personalized Upgrades</h2>
                    <p className="text-muted-foreground">Hand-picked by Offersense for your trip to {simulationData?.destination}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="space-y-6">
                        <h3 className="text-sm font-black uppercase text-blue-600 flex items-center gap-2"><Plane className="h-4 w-4" /> Airline Offers</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {limitedOffers.filter(o => o.domain === 'Airline').map(offer => (
                                <Card key={offer.id} className={cn(
                                    "transition-all cursor-pointer border-2 hover:shadow-lg",
                                    selectedOffers.includes(offer.id) ? "border-blue-600 bg-blue-50/20" : "border-slate-100"
                                )} onClick={() => setSelectedOffers(prev => prev.includes(offer.id) ? prev.filter(i => i !== offer.id) : [...prev, offer.id])}>
                                    <CardContent className="p-6 flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h4 className="font-black uppercase text-sm">{offer.name}</h4>
                                            <p className="text-xs text-muted-foreground">Tailored for {simulationData?.loyaltyTier} member.</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-blue-600 font-mono">${offer.finalPrice.toFixed(2)}</p>
                                            <Checkbox checked={selectedOffers.includes(offer.id)} onCheckedChange={() => {}} className="mt-2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                    <section className="space-y-6">
                        <h3 className="text-sm font-black uppercase text-amber-600 flex items-center gap-2"><Building2 className="h-4 w-4" /> Airport Offers</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {limitedOffers.filter(o => o.domain === 'Airport').map(offer => (
                                <Card key={offer.id} className={cn(
                                    "transition-all cursor-pointer border-2 hover:shadow-lg",
                                    selectedOffers.includes(offer.id) ? "border-amber-600 bg-amber-50/20" : "border-slate-100"
                                )} onClick={() => setSelectedOffers(prev => prev.includes(offer.id) ? prev.filter(i => i !== offer.id) : [...prev, offer.id])}>
                                    <CardContent className="p-6 flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h4 className="font-black uppercase text-sm">{offer.name}</h4>
                                            <p className="text-xs text-muted-foreground">LHR T5 Exclusives.</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-amber-600 font-mono">${offer.finalPrice.toFixed(2)}</p>
                                            <Checkbox checked={selectedOffers.includes(offer.id)} onCheckedChange={() => {}} className="mt-2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="flex justify-center pt-8 pb-12">
                    <Button 
                        size="lg" 
                        disabled={selectedOffers.length === 0} 
                        onClick={next}
                        className="h-16 px-16 text-lg font-black uppercase tracking-widest shadow-2xl bg-slate-900"
                    >
                        Proceed to Checkout
                        <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                </div>
            </div>
        )}

        {/* STEP 10: STOCK VALIDATION */}
        {currentStep === 'STOCK' && (
            <div className="text-center space-y-12 animate-in fade-in duration-700 max-w-lg w-full">
                <div className="space-y-4">
                    <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">Stock Verification</h2>
                    <p className="text-muted-foreground font-medium">Validating selected SKU availability across ecosystem stock keepers.</p>
                </div>
                <div className="space-y-4">
                    {selectedOffers.map((id, idx) => {
                        const offer = ALL_OFFERS.find(o => o.id === id);
                        return (
                            <div key={id} className="p-4 rounded-xl border bg-white flex justify-between items-center animate-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 200}ms` }}>
                                <div className="flex items-center gap-3">
                                    <Store className="h-4 w-4 text-primary" />
                                    <div className="text-left">
                                        <p className="text-sm font-black">{offer?.name}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{offer?.domain === 'Airline' ? 'PSS / Offersense Inventory' : 'Airport Stock Keeper'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase">
                                    <ShieldCheck className="h-4 w-4" /> Available
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Button onClick={next} className="h-14 px-12 text-md font-black uppercase tracking-widest shadow-xl w-full">
                    Confirm & Settle
                </Button>
            </div>
        )}

        {/* STEP 11: PAYMENT */}
        {currentStep === 'PAYMENT' && (
             <Card className="w-full max-w-md shadow-2xl border-primary/20 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-slate-900 p-8 text-white text-center space-y-2">
                    <CardTitle className="text-white uppercase font-black tracking-tight text-xl">Order Settlement</CardTitle>
                    <p className="text-xs text-white/50 font-medium tracking-widest uppercase">Cross-Domain Unified Payment</p>
                </div>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Selected Add-ons</p>
                        {selectedOffers.map(id => {
                            const offer = limitedOffers.find(o => o.id === id);
                            return (
                                <div key={id} className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-slate-600">{offer?.name}</span>
                                    <span className="font-mono">${offer?.finalPrice.toFixed(2)}</span>
                                </div>
                            );
                        })}
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-black uppercase">Total Due</span>
                        <span className="text-3xl font-black text-primary font-mono">
                            ${selectedOffers.reduce((sum, id) => sum + (limitedOffers.find(o => o.id === id)?.finalPrice || 0), 0).toFixed(2)}
                        </span>
                    </div>
                    <Button onClick={next} className="w-full h-14 text-md font-black uppercase tracking-widest shadow-xl">
                        <CreditCard className="mr-2 h-5 w-5" /> Pay Now
                    </Button>
                </CardContent>
             </Card>
        )}

        {/* STEP 12: ORDER UPDATE */}
        {currentStep === 'UPDATE' && (
             <div className="text-center space-y-8 animate-in zoom-in-50 duration-700">
                <div className="relative mx-auto w-fit">
                    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20 scale-150"></div>
                    <div className="h-24 w-24 bg-emerald-500 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                        <Check className="h-14 w-14 text-white stroke-[4]" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Order Successfully Updated</h2>
                    <p className="text-muted-foreground font-medium text-lg">PSS Commit & Ecosystem Tokens Issued.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                    <div className="p-4 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-3">
                        <Plane className="h-5 w-5" />
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase">Carrier PSS</p>
                            <p className="text-xs font-bold">SSR COMMITTED</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-3">
                        <Building2 className="h-5 w-5" />
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase">Airport Hub</p>
                            <p className="text-xs font-bold">VOUCHERS ISSUED</p>
                        </div>
                    </div>
                </div>
                <Button onClick={next} className="h-14 px-12 text-md font-black uppercase tracking-widest shadow-xl">
                    View Final Updated Order
                </Button>
            </div>
        )}

        {/* STEP 13: FINAL ORDER SCREEN */}
        {currentStep === 'FINAL' && simulationData && (
             <div className="w-full max-w-4xl space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-20">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em]">Simulation Result: Final Order</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">ORD-SIM-{Math.floor(Math.random() * 90000) + 10000}</h2>
                    </div>
                    <Badge className="bg-emerald-600 px-6 py-2 font-mono tracking-widest text-[10px]">FULFILLED_ECOSYSTEM</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-8 space-y-6">
                        <Card className="rounded-3xl border-slate-200 shadow-xl overflow-hidden bg-white">
                            <CardHeader className="bg-slate-900 py-4 px-6 text-white">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-emerald-400" /> Unified Order Structure
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-slate-900" />
                                        <h3 className="text-lg font-black uppercase text-slate-900">Flight: {simulationData.origin} → {simulationData.destination}</h3>
                                    </div>
                                    <div className="pl-6 space-y-4 border-l">
                                        <div className="space-y-2">
                                             <p className="text-[10px] font-black uppercase text-slate-400">Airline Ancillaries</p>
                                             {selectedOffers.filter(id => ALL_OFFERS.find(o => o.id === id)?.domain === 'Airline').length > 0 ? selectedOffers.filter(id => ALL_OFFERS.find(o => o.id === id)?.domain === 'Airline').map(id => (
                                                 <div key={id} className="flex justify-between text-sm font-bold">
                                                     <span className="text-slate-700">{ALL_OFFERS.find(o => o.id === id)?.name}</span>
                                                     <span className="font-mono">${pricedOffers.find(o => o.id === id)?.finalPrice.toFixed(2)}</span>
                                                 </div>
                                             )) : <p className="text-xs italic text-muted-foreground">None added.</p>}
                                        </div>
                                        <div className="space-y-2">
                                             <p className="text-[10px] font-black uppercase text-slate-400">Airport Services</p>
                                             {selectedOffers.filter(id => ALL_OFFERS.find(o => o.id === id)?.domain === 'Airport').length > 0 ? selectedOffers.filter(id => ALL_OFFERS.find(o => o.id === id)?.domain === 'Airport').map(id => (
                                                 <div key={id} className="flex justify-between text-sm font-bold">
                                                     <span className="text-slate-700">{ALL_OFFERS.find(o => o.id === id)?.name}</span>
                                                     <span className="font-mono">${pricedOffers.find(o => o.id === id)?.finalPrice.toFixed(2)}</span>
                                                 </div>
                                             )) : <p className="text-xs italic text-muted-foreground">None added.</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                                    <p className="font-black text-primary uppercase text-sm">Ecosystem Order Value</p>
                                    <p className="text-4xl font-black font-mono tracking-tighter text-slate-900">
                                        ${selectedOffers.reduce((sum, id) => sum + (pricedOffers.find(o => o.id === id)?.finalPrice || 0), 0).toFixed(2)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-4 space-y-6">
                        <Card className="rounded-3xl p-6 space-y-4">
                             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Digital Fulfillment Tokens</p>
                             <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center">
                                 <Image 
                                    src="https://picsum.photos/seed/final-qr/200/200" 
                                    alt="Unified Token" 
                                    width={120} 
                                    height={120} 
                                    className="rounded-lg opacity-80 mix-blend-multiply"
                                    data-ai-hint="qr code"
                                />
                             </div>
                             <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-[9px] font-black text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-100 uppercase">
                                    <ShieldCheck className="h-3 w-3" /> PSS Sync: Completed
                                 </div>
                                 <div className="flex items-center gap-2 text-[9px] font-black text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 uppercase">
                                    <Store className="h-3 w-3" /> Hub Stocks: Reduced
                                 </div>
                             </div>
                        </Card>
                        <Button className="w-full h-14 font-black uppercase text-xs tracking-widest" onClick={() => setCurrentStep('INPUT')}>
                             Run New Simulation
                        </Button>
                    </div>
                </div>
             </div>
        )}

      </div>
    </div>
  );
}
