'use client';

import { useState } from 'react';
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
  Ticket, 
  Clock, 
  Package, 
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
  Hotel,
  Truck,
  Gauge,
  CalendarDays
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// --- TYPES & SCHEMAS ---

type ComposerStep = 
  | 'identification' 
  | 'itinerary' 
  | 'boarding_pass_gen' 
  | 'boarding_pass_qr' 
  | 'personalized_offers' 
  | 'airline_payment' 
  | 'airport_payment' 
  | 'confirmation' 
  | 'final_summary';

const identificationSchema = z.object({
  airline: z.string().min(1, 'Select an airline.'),
  pnr: z.string().min(6, 'PNR must be 6 characters.').max(6).toUpperCase(),
  generateOffers: z.boolean().default(true),
});

type OfferItem = {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    adjustment: number;
    finalPrice: number;
    domain: 'Airline' | 'Airport' | 'ThirdParty' | 'Core';
};

// --- MOCK DATA ---

const mockAirlines = [
    { code: 'GAB', name: 'Global Airways' },
    { code: 'SBA', name: 'SkyBridge Airlines' },
    { code: 'MLN', name: 'MetroLink Air' }
];

const mockPassengers = [
    { id: 'PAX-1', name: 'John Smith', checkedIn: false },
    { id: 'PAX-2', name: 'Jane Smith', checkedIn: false }
];

const mockOffers: OfferItem[] = [
    { id: 'OFR-A1', name: 'Premium Cabin Upgrade', description: 'Move to Business Class for maximum comfort.', basePrice: 250, adjustment: -25, finalPrice: 225, domain: 'Airline' },
    { id: 'OFR-A2', name: 'Extra Baggage Allowance', description: '+23kg hold luggage for your journey.', basePrice: 45, adjustment: 0, finalPrice: 45, domain: 'Airline' },
    { id: 'OFR-A3', name: 'Priority Boarding', description: 'Be the first to board and secure overhead space.', basePrice: 15, adjustment: 5, finalPrice: 20, domain: 'Airline' },
    { id: 'OFR-P1', name: 'Executive Lounge Access', description: 'LHR T5 North Plaza - Food, Drinks & Wi-Fi.', basePrice: 55, adjustment: -10, finalPrice: 45, domain: 'Airport' },
    { id: 'OFR-P2', name: 'Security Fast Track', description: 'Skip the queues at T5 security checkpoints.', basePrice: 12, adjustment: 3, finalPrice: 15, domain: 'Airport' },
    { id: 'OFR-P3', name: 'Meet & Greet Assist', description: 'Personal concierge assistant from gate to curb.', basePrice: 80, adjustment: 0, finalPrice: 80, domain: 'Airport' },
];

export default function OffersenseComposerPage() {
  const [step, setStep] = useState<ComposerStep>('identification');
  const [isLoading, setIsLoading] = useState(false);
  const [pnrContext, setPnrContext] = useState<any>(null);
  const [selectedPax, setSelectedPax] = useState<string[]>([]);
  const [selectedAirlineOffers, setSelectedAirlineOffers] = useState<string[]>([]);
  const [selectedAirportOffers, setSelectedAirportOffers] = useState<string[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { toast } = useToast();
  const firestore = useFirestore();

  const identificationForm = useForm<z.infer<typeof identificationSchema>>({
    resolver: zodResolver(identificationSchema),
    defaultValues: {
      airline: 'GAB',
      pnr: 'L8Y2N3',
      generateOffers: true,
    },
  });

  // --- ACTIONS ---

  const handleFetchItinerary = async (values: z.infer<typeof identificationSchema>) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    
    setPnrContext({
        ...values,
        flight: 'AC101',
        route: 'LHR - JFK',
        date: '28 OCT 2025',
        time: '14:20',
        aircraft: 'Airbus A350-900',
        influencers: {
            loadFactor: '82%',
            leadTime: '2 Days (T-2)',
            haulType: 'Long-Haul',
            paxCount: '2 Adults'
        },
        passengers: mockPassengers
    });
    
    setIsLoading(false);
    setStep('itinerary');
  };

  const handleCheckIn = async () => {
    if (selectedPax.length === 0) {
        toast({ title: "No Passengers Selected", description: "Please select at least one passenger.", variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    setStep('boarding_pass_gen');
  };

  const handleViewBoardingPass = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);
    setStep('boarding_pass_qr');
  };

  const triggerOfferEngine = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulated AI Engine processing
    setIsLoading(false);
    setStep('personalized_offers');
  };

  const handleProceedToAirlinePayment = () => {
      setStep('airline_payment');
  };

  const handleCompleteAirlinePayment = async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      setIsLoading(false);
      setStep('airport_payment');
  };

  const handleCompleteAirportPayment = async () => {
      setIsLoading(true);
      // Simulated processing time
      await new Promise(r => setTimeout(r, 1200));
      
      const newId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
      setOrderId(newId);

      // Persist to Firestore for the unified order view
      if (firestore && pnrContext) {
            const finalTotal = [...selectedAirlineOffers, ...selectedAirportOffers].reduce((sum, id) => {
                const offer = mockOffers.find(o => o.id === id);
                return sum + (offer?.finalPrice || 0);
            }, 0);

            const orderData = {
                id: newId,
                customer: pnrContext.passengers[0]?.name || 'Demo Passenger',
                pnr: pnrContext.pnr,
                route: pnrContext.route,
                amount: finalTotal,
                status: 'Fulfilled',
                date: new Date().toISOString().split('T')[0],
                source: 'CUSS_Kiosk',
                paymentStatus: 'Paid',
                isSimulated: true,
                createdAt: serverTimestamp()
            };

            addDoc(collection(firestore, 'orders'), orderData)
                .catch(err => console.error("Firestore persistence skipped (demo mode):", err));
      }

      setIsLoading(false);
      setStep('confirmation');
  };

  const toggleOffer = (id: string, domain: 'Airline' | 'Airport') => {
      if (domain === 'Airline') {
          setSelectedAirlineOffers(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
      } else {
          setSelectedAirportOffers(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
      }
  };

  // --- RENDERING HELPERS ---

  const TreeItem = ({ label, price, isLast = false, isCategory = false, children }: any) => (
      <div className="relative pl-6">
          {!isCategory && (
              <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200" />
          )}
          <div className="flex items-center gap-3 py-2">
              <div className={cn(
                  "relative flex items-center h-4 w-4",
                  isCategory ? "" : "before:absolute before:left-[-1.5rem] before:top-1/2 before:w-4 before:h-px before:bg-slate-200"
              )}>
                   {isCategory ? (
                        <div className="h-2 w-2 rounded-full bg-slate-300" />
                   ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                   )}
              </div>
              <div className="flex-1 flex justify-between items-center pr-4">
                  <span className={cn("text-sm", isCategory ? "font-black text-slate-700 uppercase tracking-widest text-[10px]" : "font-bold text-slate-500")}>{label}</span>
                  {price !== undefined && (
                      <span className="font-mono text-xs font-black text-slate-900">${price.toFixed(2)}</span>
                  )}
              </div>
          </div>
          {children}
          {isCategory && !isLast && (
              <div className="absolute left-0 top-4 bottom-0 w-px bg-slate-200" />
          )}
      </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full min-h-[80vh]">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-primary uppercase">Offersense Composer</h1>
          <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-primary/5">
                {step.replace('_', ' ')}
              </Badge>
              {step !== 'identification' && (
                  <Button variant="ghost" size="sm" onClick={() => window.location.reload()} className="h-6 text-[10px] font-bold uppercase underline">Restart Demo</Button>
              )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
            <MonitorDot className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">SITA CUSS Node: LHR-T5-K04</span>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center py-6">
        
        {/* STEP 1: IDENTIFICATION */}
        {step === 'identification' && (
            <Card className="w-full max-w-md shadow-2xl border-primary/20">
                <CardHeader className="bg-primary/5 border-b text-center">
                    <CardTitle className="text-xl font-black text-primary uppercase">Passenger Identification</CardTitle>
                    <CardDescription>Enter your flight details to begin check-in.</CardDescription>
                </CardHeader>
                <CardContent className="pt-8 pb-8">
                    <Form {...identificationForm}>
                        <form onSubmit={identificationForm.handleSubmit(handleFetchItinerary)} className="space-y-6">
                            <FormField control={identificationForm.control} name="airline" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Select Airline</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger className="h-12"><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {mockAirlines.map(a => <SelectItem key={a.code} value={a.code}>{a.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                            <FormField control={identificationForm.control} name="pnr" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Booking Reference (PNR)</FormLabel>
                                    <FormControl><Input className="h-12 font-mono font-bold text-xl uppercase tracking-[0.3em]" placeholder="XXXXXX" maxLength={6} {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={identificationForm.control} name="generateOffers" render={({ field }) => (
                                <FormItem className="flex items-start space-x-3 space-y-0 rounded-xl border p-4 bg-emerald-50/30 border-emerald-100">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                                            <Zap className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
                                            Generate real-time offers
                                        </FormLabel>
                                        <p className="text-[10px] text-emerald-600/70 font-medium">Activate Offersense engine for personalized bundles.</p>
                                    </div>
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={isLoading} className="w-full h-14 font-black uppercase text-xs tracking-widest shadow-xl">
                                {isLoading ? <Loader2 className="mr-2 animate-spin h-5 w-5" /> : <Search className="mr-2 h-5 w-5" />}
                                Fetch Itinerary
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        )}

        {/* STEP 2: ITINERARY & PAX SELECTION */}
        {step === 'itinerary' && pnrContext && (
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-primary/20 shadow-xl overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black text-primary uppercase">Itinerary Details</CardTitle>
                                <CardDescription>Review your flight and select passengers for check-in.</CardDescription>
                            </div>
                            <Badge variant="secondary" className="font-mono font-bold">{pnrContext.pnr}</Badge>
                        </CardHeader>
                        <CardContent className="pt-6 pb-6">
                            <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl border border-muted-foreground/10 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-white border flex items-center justify-center text-primary shadow-sm"><Plane className="h-6 w-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{pnrContext.flight}</p>
                                        <p className="font-black text-lg text-primary">{pnrContext.route}</p>
                                        <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mt-1">
                                            <Building2 className="h-3 w-3" /> {pnrContext.aircraft}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{pnrContext.date}</p>
                                    <p className="font-bold flex items-center gap-1.5 justify-end"><Clock className="h-3 w-3" /> {pnrContext.time}</p>
                                    <Badge variant="outline" className="text-[8px] mt-1 bg-white">Gate B45</Badge>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Passenger List</h4>
                                    <Button variant="link" size="sm" onClick={() => setSelectedPax(pnrContext.passengers.map((p: any) => p.id))} className="h-auto p-0 text-[10px] font-black uppercase">Select All</Button>
                                </div>
                                <div className="space-y-3">
                                    {pnrContext.passengers.map((pax: any) => (
                                        <div key={pax.id} className={cn(
                                            "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                                            selectedPax.includes(pax.id) ? "bg-primary/5 border-primary ring-1 ring-primary" : "bg-white"
                                        )} onClick={() => setSelectedPax(prev => prev.includes(pax.id) ? prev.filter(i => i !== pax.id) : [...prev, pax.id])}>
                                            <div className="flex items-center gap-3">
                                                <Checkbox checked={selectedPax.includes(pax.id)} onCheckedChange={() => {}} />
                                                <span className="font-bold text-sm">{pax.name}</span>
                                            </div>
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter">Economy Flex</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/5 border-t py-6 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setStep('identification')} className="font-bold">Back</Button>
                            <Button onClick={handleCheckIn} disabled={isLoading || selectedPax.length === 0} className="px-10 font-black uppercase text-xs tracking-widest">
                                {isLoading ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                                Check-in
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-slate-900 text-white border-none shadow-xl rounded-2xl overflow-hidden">
                        <CardHeader className="bg-white/10 pb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Zap className="h-4 w-4 text-emerald-400" /> Retailing Context Signals
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                The following parameters are currently influencing the Offersense engine results for this session:
                            </p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <Gauge className="h-3.5 w-3.5 text-blue-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight text-slate-300">Load Factor</span>
                                    </div>
                                    <span className="text-xs font-black text-white">{pnrContext.influencers.loadFactor}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight text-slate-300">Lead Time</span>
                                    </div>
                                    <span className="text-xs font-black text-white">{pnrContext.influencers.leadTime}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight text-slate-300">Haul Type</span>
                                    </div>
                                    <span className="text-xs font-black text-white">{pnrContext.influencers.haulType}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <User className="h-3.5 w-3.5 text-indigo-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight text-slate-300">Composition</span>
                                    </div>
                                    <span className="text-xs font-black text-white">{pnrContext.influencers.paxCount}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )}

        {/* STEP 3: BP GENERATION */}
        {step === 'boarding_pass_gen' && (
            <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
                <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 scale-150"></div>
                    <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                        <Loader2 className="h-12 w-12 text-white animate-spin" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">Issuing Boarding Pass</h2>
                    <p className="text-muted-foreground font-medium">Synchronizing with Departure Control System (DCS)...</p>
                </div>
                <Button onClick={handleViewBoardingPass} className="h-14 px-12 text-md font-black uppercase tracking-widest shadow-xl">
                    View Boarding Pass
                </Button>
            </div>
        )}

        {/* STEP 4: QR & TRIGGER */}
        {step === 'boarding_pass_qr' && (
             <Card className="w-full max-w-sm shadow-2xl border-slate-200 overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
                <CardHeader className="bg-slate-900 text-white p-6 pb-4">
                    <div className="flex justify-between items-center mb-4">
                         <div className="h-8 w-16 bg-white/20 rounded-md flex items-center justify-center font-black text-xs">GAB</div>
                         <Badge variant="outline" className="border-white/40 text-white font-mono">LHR - JFK</Badge>
                    </div>
                    <CardTitle className="text-xl font-black">John Smith</CardTitle>
                    <div className="flex justify-between mt-2 text-[10px] font-black uppercase text-white/60 tracking-widest">
                        <div><span>Seat</span><p className="text-white text-base">14C</p></div>
                        <div><span>Group</span><p className="text-white text-base">B</p></div>
                        <div><span>Gate</span><p className="text-white text-base">B45</p></div>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-10 bg-white">
                    <div className="p-4 bg-slate-50 rounded-3xl border-2 border-slate-100 mb-6 shadow-inner">
                        <Image 
                            src="https://picsum.photos/seed/bp-qr/250/250" 
                            alt="Boarding Pass QR" 
                            width={200} 
                            height={200} 
                            className="rounded-xl opacity-90 mix-blend-multiply" 
                            data-ai-hint="qr code"
                        />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="font-mono text-xs font-bold text-slate-400">SITA_DCS_TOKEN_88912</p>
                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Digital Boarding Pass Issued</p>
                    </div>
                </CardContent>
                <CardFooter className="p-0 border-t">
                    <Button onClick={triggerOfferEngine} variant="ghost" className="w-full h-20 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center justify-center gap-1 group">
                        <div className="flex items-center gap-2">
                             <Zap className="h-5 w-5 fill-white animate-pulse" />
                             <span className="text-sm font-black uppercase tracking-widest">View Personalized Offers</span>
                        </div>
                        <span className="text-[10px] font-bold text-white/70 group-hover:translate-x-1 transition-transform flex items-center gap-1">Exclusive Airline & Airport Upgrades <ArrowRight className="h-3 w-3" /></span>
                    </Button>
                </CardFooter>
             </Card>
        )}

        {/* STEP 5: PERSONALIZED OFFERS */}
        {step === 'personalized_offers' && (
            <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col items-center text-center space-y-2 mb-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-200 mb-2">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">Your Personalized Retailing Stream</h2>
                    <p className="text-muted-foreground max-w-xl">Our engine has tailored these offers based on your profile, itinerary, and current terminal context.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Airline Offers Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className="p-2 bg-blue-600 rounded-xl text-white"><Plane className="h-5 w-5" /></div>
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Airline Offers</h3>
                        </div>
                        <div className="space-y-4">
                            {mockOffers.filter(o => o.domain === 'Airline').map(offer => (
                                <Card key={offer.id} className={cn(
                                    "transition-all cursor-pointer group hover:shadow-lg",
                                    selectedAirlineOffers.includes(offer.id) ? "border-blue-600 ring-1 ring-blue-600 bg-blue-50/30" : "bg-white"
                                )} onClick={() => toggleOffer(offer.id, 'Airline')}>
                                    <CardContent className="p-5 flex justify-between items-start gap-4">
                                        <div className="flex-grow space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-black text-sm uppercase">{offer.name}</h4>
                                                {selectedAirlineOffers.includes(offer.id) && <Badge className="h-4 px-1.5 bg-blue-600"><Check className="h-2.5 w-2.5" /></Badge>}
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{offer.description}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-muted-foreground line-through opacity-50">${offer.basePrice}</span>
                                                <span className="text-xl font-black text-blue-600 font-mono">${offer.finalPrice}</span>
                                            </div>
                                            {offer.adjustment < 0 && <Badge variant="outline" className="text-[8px] border-emerald-200 bg-emerald-50 text-emerald-700 font-black">-{Math.abs(offer.adjustment)}% SAVING</Badge>}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Airport Offers Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className="p-2 bg-amber-600 rounded-xl text-white"><Building2 className="h-5 w-5" /></div>
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Airport Offers</h3>
                        </div>
                        <div className="space-y-4">
                             {mockOffers.filter(o => o.domain === 'Airport').map(offer => (
                                <Card key={offer.id} className={cn(
                                    "transition-all cursor-pointer group hover:shadow-lg",
                                    selectedAirportOffers.includes(offer.id) ? "border-amber-600 ring-1 ring-amber-600 bg-amber-50/30" : "bg-white"
                                )} onClick={() => toggleOffer(offer.id, 'Airport')}>
                                    <CardContent className="p-5 flex justify-between items-start gap-4">
                                        <div className="flex-grow space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-black text-sm uppercase">{offer.name}</h4>
                                                {selectedAirportOffers.includes(offer.id) && <Badge className="h-4 px-1.5 bg-amber-600"><Check className="h-2.5 w-2.5" /></Badge>}
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{offer.description}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-muted-foreground line-through opacity-50">${offer.basePrice}</span>
                                                <span className="text-xl font-black text-amber-600 font-mono">${offer.finalPrice}</span>
                                            </div>
                                             {offer.adjustment !== 0 && (
                                                 <Badge variant="outline" className={cn(
                                                     "text-[8px] font-black",
                                                     offer.adjustment < 0 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"
                                                 )}>
                                                     {offer.adjustment < 0 ? `-$${Math.abs(offer.adjustment)} BUNDLE SAVING` : `+$${offer.adjustment} PEAK SURCHARGE`}
                                                 </Badge>
                                             )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-10 pb-20">
                    <Button 
                        size="lg" 
                        onClick={handleProceedToAirlinePayment} 
                        disabled={selectedAirlineOffers.length === 0 && selectedAirportOffers.length === 0}
                        className="h-16 px-16 text-lg font-black uppercase tracking-widest shadow-2xl bg-slate-900"
                    >
                        Proceed to Payment
                        <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                </div>
            </div>
        )}

        {/* STEP 6: AIRLINE PAYMENT */}
        {step === 'airline_payment' && (
            <Card className="w-full max-w-2xl shadow-2xl border-blue-200 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <CardTitle className="text-white uppercase font-black tracking-tight">Airline Offers Settlement</CardTitle>
                        <p className="text-xs text-white/70 font-medium">Update PSS & Issue Virtual EMDs</p>
                    </div>
                    <Plane className="h-8 w-8 text-white/50" />
                </div>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Selected Carrier Ancillaries</p>
                        <div className="space-y-2">
                            {selectedAirlineOffers.map(id => {
                                const offer = mockOffers.find(o => o.id === id);
                                return (
                                    <div key={id} className="flex justify-between items-center p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white border flex items-center justify-center text-blue-600"><Star className="h-4 w-4" /></div>
                                            <span className="font-bold text-sm uppercase">{offer?.name}</span>
                                        </div>
                                        <span className="font-mono font-black text-blue-700">${offer?.finalPrice.toFixed(2)}</span>
                                    </div>
                                );
                            })}
                             {selectedAirlineOffers.length === 0 && <p className="text-sm italic text-muted-foreground py-4 text-center">No carrier ancillaries selected.</p>}
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-2">
                        <span className="text-lg font-black uppercase text-slate-700">Airline Settlement</span>
                        <span className="text-4xl font-black text-blue-600 font-mono tracking-tighter">
                            ${selectedAirlineOffers.reduce((sum, id) => sum + (mockOffers.find(o => o.id === id)?.finalPrice || 0), 0).toFixed(2)}
                        </span>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-2xl flex items-center gap-4 text-white border-2 border-blue-500/20">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white"><ShieldCheck className="h-6 w-6" /></div>
                        <p className="text-xs font-medium leading-tight">Settlement authorized via SITA Broker. Carrier SSRs will be committed to Global PSS on approval.</p>
                    </div>
                </CardContent>
                <CardFooter className="p-8 bg-slate-50 border-t flex justify-end">
                     <Button onClick={handleCompleteAirlinePayment} disabled={isLoading} className="w-full h-14 text-md font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 shadow-xl">
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2 h-5 w-5" />}
                        Complete Airline Payment
                    </Button>
                </CardFooter>
            </Card>
        )}

        {/* STEP 7: AIRPORT PAYMENT */}
        {step === 'airport_payment' && (
            <Card className="w-full max-w-2xl shadow-2xl border-amber-200 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-amber-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <CardTitle className="text-white uppercase font-black tracking-tight">Airport Offers Settlement</CardTitle>
                        <p className="text-xs text-white/70 font-medium">Trigger Hub Supplier Fulfillment</p>
                    </div>
                    <Building2 className="h-8 w-8 text-white/50" />
                </div>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Selected Ecosystem Services</p>
                        <div className="space-y-2">
                            {selectedAirportOffers.map(id => {
                                const offer = mockOffers.find(o => o.id === id);
                                return (
                                    <div key={id} className="flex justify-between items-center p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white border flex items-center justify-center text-amber-600"><Package className="h-4 w-4" /></div>
                                            <span className="font-bold text-sm uppercase">{offer?.name}</span>
                                        </div>
                                        <span className="font-mono font-black text-amber-700">${offer?.finalPrice.toFixed(2)}</span>
                                    </div>
                                );
                            })}
                            {selectedAirportOffers.length === 0 && <p className="text-sm italic text-muted-foreground py-4 text-center">No airport services selected.</p>}
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-2">
                        <span className="text-lg font-black uppercase text-slate-700">Airport Settlement</span>
                        <span className="text-4xl font-black text-amber-600 font-mono tracking-tighter">
                            ${selectedAirportOffers.reduce((sum, id) => sum + (mockOffers.find(o => o.id === id)?.finalPrice || 0), 0).toFixed(2)}
                        </span>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-2xl flex items-center gap-4 text-white border-2 border-amber-500/20">
                        <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white"><ShieldCheck className="h-6 w-6" /></div>
                        <p className="text-xs font-medium leading-tight">Supplier fulfillment tokens will be issued for terminal-side redemption via SITA hardware.</p>
                    </div>
                </CardContent>
                <CardFooter className="p-8 bg-slate-50 border-t flex justify-end">
                     <Button onClick={handleCompleteAirportPayment} disabled={isLoading} className="w-full h-14 text-md font-black uppercase tracking-widest bg-amber-600 hover:bg-amber-700 shadow-xl">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                        Complete Airport Payment
                    </Button>
                </CardFooter>
            </Card>
        )}

        {/* STEP 8: CONFIRMATION */}
        {step === 'confirmation' && (
            <div className="text-center space-y-8 animate-in zoom-in-50 duration-700">
                <div className="relative mx-auto w-fit">
                    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20 scale-150"></div>
                    <div className="h-24 w-24 bg-emerald-500 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                        <Check className="h-14 w-14 text-white stroke-[4]" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Transaction Successful</h2>
                    <p className="text-muted-foreground font-medium text-lg">Airline & Airport services have been confirmed.</p>
                </div>
                <div className="flex justify-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-xs border border-blue-100">
                        <Plane className="h-3 w-3" /> PSS Updated
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full font-bold text-xs border border-amber-100">
                        <Building2 className="h-3 w-3" /> Supplier Notified
                    </div>
                </div>
                <Button onClick={() => setStep('final_summary')} className="h-14 px-12 text-md font-black uppercase tracking-widest shadow-xl">
                    View Unified Order Summary
                </Button>
            </div>
        )}

        {/* STEP 9: FINAL UNIFIED SUMMARY */}
        {step === 'final_summary' && pnrContext && (
             <div className="w-full max-w-4xl space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-20">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em]">Unified Ecosystem Receipt</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{orderId || 'ORD-99999'}</h2>
                    </div>
                    <div className="text-right space-y-1">
                        <Badge className="bg-emerald-600 px-4 py-1 font-mono tracking-widest text-[10px]">TRANSACTION_SETTLED</Badge>
                        <p className="text-[10px] text-muted-foreground font-bold">Processed at {new Date().toLocaleTimeString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-8 space-y-6">
                        {/* THE MASTER ORDER TREE */}
                        <Card className="rounded-3xl border-slate-200 shadow-xl overflow-hidden bg-white">
                            <CardHeader className="bg-slate-900 py-4 px-6 text-white">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-emerald-400" /> Unified Order Structure
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-2 w-2 rounded-full bg-slate-900" />
                                        <h3 className="text-lg font-black uppercase text-slate-900">Order</h3>
                                    </div>

                                    {/* FLIGHT SECTION */}
                                    <TreeItem label="Flight (core product)" isCategory>
                                        <TreeItem label={`${pnrContext.route} • ${pnrContext.flight}`} price={890} />
                                    </TreeItem>

                                    {/* AIRLINE ANCILLARIES */}
                                    <TreeItem label="Airline Ancillaries" isCategory>
                                        {selectedAirlineOffers.map((id, idx) => {
                                            const offer = mockOffers.find(o => o.id === id);
                                            return (
                                                <TreeItem 
                                                    key={id} 
                                                    label={offer?.name} 
                                                    price={offer?.finalPrice} 
                                                />
                                            );
                                        })}
                                        {selectedAirlineOffers.length === 0 && <TreeItem label="No Airline Services" />}
                                    </TreeItem>

                                    {/* AIRPORT ANCILLARIES */}
                                    <TreeItem label="Airport Ancillaries" isCategory>
                                        {selectedAirportOffers.map((id, idx) => {
                                            const offer = mockOffers.find(o => o.id === id);
                                            return (
                                                <TreeItem 
                                                    key={id} 
                                                    label={offer?.name} 
                                                    price={offer?.finalPrice} 
                                                />
                                            );
                                        })}
                                        {selectedAirportOffers.length === 0 && <TreeItem label="No Airport Services" />}
                                    </TreeItem>

                                    {/* THIRD PARTY SERVICES (Mocked for structure) */}
                                    <TreeItem label="Third-party Services" isCategory isLast>
                                        <TreeItem label="City Transfer (Chauffeur)" price={45} />
                                        <TreeItem label="Airport Hotel (Pod)" price={80} isLast />
                                    </TreeItem>
                                </div>

                                <div className="mt-10 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                                     <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Settled Value</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                                <span className="text-xs font-bold text-slate-600">Cross-domain Settlement Finalized</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-5xl font-black font-mono tracking-tighter text-slate-900">
                                                ${(
                                                    890 + 45 + 80 + // Base/Third party
                                                    [...selectedAirlineOffers, ...selectedAirportOffers].reduce((sum, id) => sum + (mockOffers.find(o => o.id === id)?.finalPrice || 0), 0)
                                                ).toFixed(2)}
                                            </p>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">USD Combined Sum</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-4 space-y-6">
                        <Card className="rounded-3xl border-slate-200 shadow-sm p-6 space-y-6">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Ecosystem Fulfillment Tokens</p>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center">
                                    <div className="relative w-[150px] h-[150px] mix-blend-multiply opacity-80 grayscale">
                                         <Image 
                                            src="https://picsum.photos/seed/final-qr/200/200" 
                                            alt="Unified Token" 
                                            fill 
                                            className="rounded-lg"
                                            data-ai-hint="qr code"
                                        />
                                    </div>
                                    <p className="mt-4 font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest">ECO_TOKEN_{orderId?.slice(-5)}</p>
                                </div>
                                <div className="space-y-2">
                                     <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
                                        <Plane className="h-3 w-3" /> PSS SSR: COMMITTED
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                                        <Building2 className="h-3 w-3" /> HUB VOUCHERS: ISSUED
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                                        <Truck className="h-3 w-3" /> LOGISTICS: DISPATCHED
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex flex-col gap-3">
                            <Button className="w-full h-12 font-black uppercase text-xs tracking-widest" onClick={() => window.print()}>
                                <ReceiptText className="mr-2 h-4 w-4" /> Print Full Audit
                            </Button>
                            <Button variant="outline" className="w-full h-12 font-black uppercase text-xs tracking-widest" onClick={() => window.location.reload()}>
                                Start New Session
                            </Button>
                        </div>
                    </div>
                </div>
             </div>
        )}

      </div>
    </div>
  );
}
