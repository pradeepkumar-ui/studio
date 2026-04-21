
'use client';

import { useState, useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Search, 
  Loader2, 
  Workflow, 
  MonitorDot, 
  Store, 
  Check, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  History,
  CreditCard,
  Sparkles,
  Utensils,
  MapPin,
  Luggage,
  ExternalLink,
  ReceiptText,
  QrCode,
  Plane,
  User,
  Ticket,
  Clock,
  Package
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

type ComposerStep = 'pnr_discovery' | 'offer_generation' | 'results' | 'checkout' | 'confirmation';

const discoverySchema = z.object({
  pnr: z.string().min(6, 'PNR must be 6 characters.').max(6).toUpperCase(),
  touchpoint: z.enum(['CUSS_Kiosk', 'CUTE_Desktop', 'Mobile_App', 'NDC_API']).default('CUSS_Kiosk'),
  airportNode: z.string().length(3).toUpperCase().default('LHR'),
});

const mockBundlesFallback = [
    { 
        id: 'MOCK-OFR-001', 
        name: 'Executive Transit Pack', 
        description: 'Includes Lounge Access, Priority Boarding, and Ultra Wi-Fi.',
        domain: 'Hybrid',
        pricing: { strategy: 'Dynamic', basePrice: 85, currency: 'USD' }, 
        targeting: { cohortIds: ['Silver', 'Gold', 'CORP_PREMIUM'] } 
    },
    { 
        id: 'MOCK-OFR-002', 
        name: 'LHR Hub Fast-Track', 
        description: 'Skip the lines with dedicated Security Fast Track at Terminal 5.',
        domain: 'Airport',
        pricing: { strategy: 'Demand', basePrice: 15, currency: 'USD' }, 
        targeting: { cohortIds: ['LEISURE_PROMO', 'LHR_BIZ_WAIT'] } 
    },
    { 
        id: 'MOCK-OFR-003', 
        name: 'Family Travel Bundle', 
        description: 'Pre-ordered kids meals and dedicated family valet parking.',
        domain: 'Hybrid',
        pricing: { strategy: 'Static', basePrice: 45, currency: 'USD' }, 
        targeting: { cohortIds: ['FAMILY_TRIP'] } 
    },
    { 
        id: 'MOCK-OFR-004', 
        name: 'Elite Hub Access', 
        description: 'The ultimate airport experience: Private Porter + Suite Access.',
        domain: 'Airport',
        pricing: { strategy: 'Demand', basePrice: 120, currency: 'USD' }, 
        targeting: { cohortIds: ['Platinum', 'CORP_PREMIUM'] } 
    },
];

export default function AirportOfferComposerPage() {
  const [step, setStep] = useState<ComposerStep>('pnr_discovery');
  const [isLoading, setIsLoading] = useState(false);
  const [discoveryLog, setDiscoveryLog] = useState<string[]>([]);
  const [pnrData, setPnrData] = useState<any>(null);
  const [identifiedCohorts, setIdentifiedCohorts] = useState<string[]>([]);
  const [generatedOffers, setGeneratedOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const { toast } = useToast();
  const firestore = useFirestore();

  // Fetch bundles and cohorts for the engine
  const { data: allBundles } = useCollection(firestore ? collection(firestore, 'bundles') : undefined);

  const form = useForm<z.infer<typeof discoverySchema>>({
    resolver: zodResolver(discoverySchema),
    defaultValues: {
      pnr: 'L8Y2N3',
      touchpoint: 'CUSS_Kiosk',
      airportNode: 'LHR',
    },
  });

  const handlePnrSearch = async () => {
    setIsLoading(true);
    setDiscoveryLog(["Searching Host PSS for PNR " + form.getValues('pnr') + "..."]);
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Mock PNR Data Fetch
    const mockData = {
        pnr: form.getValues('pnr'),
        passenger: 'John Smith',
        airline: 'GAB',
        route: form.getValues('airportNode') + '-JFK',
        cabin: 'Economy Flex',
        loyaltyTier: 'Silver',
        tripPurpose: 'Leisure',
        baseFare: 850.00
    };
    
    setPnrData(mockData);
    setDiscoveryLog(prev => [...prev, "Passenger Profile: John Smith [Tier: Silver] retrieved."]);
    setDiscoveryLog(prev => [...prev, "Itinerary: " + mockData.route + " confirmed."]);
    
    setIsLoading(false);
    toast({ title: "PNR Context Retrieved", description: "Host PSS sync successful." });
  };

  const handleGenerateOffers = async () => {
    setIsLoading(true);
    setStep('offer_generation');
    setDiscoveryLog(["Triggering REAL-TIME OFFER DECISION ENGINE..."]);
    
    await new Promise(r => setTimeout(r, 600));
    setDiscoveryLog(prev => [...prev, "Analyzing " + form.getValues('touchpoint') + " channel constraints..."]);
    
    // Identify Cohorts
    const cohorts = [pnrData.loyaltyTier, pnrData.tripPurpose === 'Leisure' ? 'LEISURE_PROMO' : 'CORP_PREMIUM'];
    setIdentifiedCohorts(cohorts);
    setDiscoveryLog(prev => [...prev, "Identified Cohorts: " + cohorts.join(', ')]);

    await new Promise(r => setTimeout(r, 600));
    const sourceBundles = (allBundles && allBundles.length > 0) ? allBundles : mockBundlesFallback;
    setDiscoveryLog(prev => [...prev, "Evaluating " + sourceBundles.length + " available strategies..."]);

    // Evaluation Logic: Match Bundles to Identified Cohorts
    const eligible = sourceBundles.filter((b: any) => {
        // If no cohorts defined, it's global. Otherwise must match.
        if (!b.targeting?.cohortIds || b.targeting.cohortIds.length === 0) return true;
        return b.targeting.cohortIds.some((cid: string) => cohorts.includes(cid));
    });

    setDiscoveryLog(prev => [...prev, "Decision Engine: " + eligible.length + " eligible offers selected."]);
    
    await new Promise(r => setTimeout(r, 600));
    setDiscoveryLog(prev => [...prev, "Applying Dynamic Pricing & Yield Guardrails..."]);

    // Calculate Dynamic Prices
    const finalOffers = eligible.map((b: any) => {
        let price = b.pricing?.basePrice || 50;
        let adjustmentMsg = "Base";

        // Simulated Dynamic Logic
        if (b.pricing?.strategy === 'Demand') {
            price *= 1.15;
            adjustmentMsg = "Demand Surge (+15%)";
        } else if (b.pricing?.strategy === 'Dynamic') {
            price *= 0.9;
            adjustmentMsg = "Cohort Discount (-10%)";
        }

        // Apply Channel Markup
        if (form.getValues('touchpoint') === 'CUSS_Kiosk') {
            price += 10;
            adjustmentMsg += " | Kiosk Convenience (+$10)";
        }

        return {
            ...b,
            displayPrice: price,
            adjustmentMsg
        };
    });

    setGeneratedOffers(finalOffers);
    setDiscoveryLog(prev => [...prev, "Ranking Engine: Prioritized by revenue potential."]);
    
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);
    setStep('results');
  };

  const handleCompletePayment = async () => {
    if (!firestore) return;
    setIsLoading(true);
    
    try {
        const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
        const finalPrice = selectedOffer.displayPrice;

        const orderData = {
            id: orderId,
            customer: pnrData.passenger,
            email: 'j.smith@example.com',
            status: 'Fulfilled',
            date: new Date().toISOString().split('T')[0],
            amount: finalPrice,
            currency: 'USD',
            source: form.getValues('touchpoint'),
            airportCode: form.getValues('airportNode'),
            pnr: pnrData.pnr,
            route: pnrData.route,
            paymentStatus: 'Paid',
            isSimulated: true,
            fulfillmentSync: {
                pss: 'COMMITTED',
                dcs: 'SYNCED',
                airport: 'VIRTUAL_TOKEN_ISSUED'
            },
            services: [
                { id: selectedOffer.id, type: 'Bundle', provider: 'Offersense Ecosystem', status: 'Fulfilled', price: finalPrice, description: selectedOffer.name }
            ]
        };

        await addDoc(collection(firestore, 'orders'), {
            ...orderData,
            createdAt: serverTimestamp(),
        });

        setCreatedOrderId(orderId);
        await new Promise(r => setTimeout(r, 1500)); 
        setStep('confirmation');
        toast({ title: "Fulfillment Successful", description: "PSS Synchronised & Order Registered." });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Payment Error', description: e.message });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-primary">Airport Offer Composer</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">REAL-TIME OFFER DECISION & DELIVERY SIMULATOR</p>
        </div>
        <Button variant="ghost" onClick={() => { setStep('pnr_discovery'); setPnrData(null); }} className="text-muted-foreground">
            <History className="mr-2 h-4 w-4" /> Reset Simulation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT: CONTEXT & ENGINE TRACE --- */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <MonitorDot className="h-4 w-4 text-primary" /> 1. Touchpoint Context
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="touchpoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground">Channel</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={step !== 'pnr_discovery'}>
                          <FormControl><SelectTrigger className="h-10"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="CUSS_Kiosk">SITA CUSS Kiosk</SelectItem>
                            <SelectItem value="CUTE_Desktop">SITA CUTE Agent</SelectItem>
                            <SelectItem value="Mobile_App">Mobile App (Geo-fenced)</SelectItem>
                            <SelectItem value="NDC_API">NDC / API (Meta)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="airportNode" render={({ field }) => (
                        <FormItem><FormLabel className="text-[10px] uppercase font-black text-muted-foreground">Airport</FormLabel><FormControl><Input className="h-10 font-mono font-bold" {...field} disabled={step !== 'pnr_discovery'}/></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="pnr" render={({ field }) => (
                        <FormItem><FormLabel className="text-[10px] uppercase font-black text-muted-foreground">PNR Identity</FormLabel><FormControl><Input className="h-10 font-mono font-bold" {...field} disabled={step !== 'pnr_discovery'}/></FormControl></FormItem>
                    )} />
                  </div>
                  {step === 'pnr_discovery' && (
                    <Button type="button" onClick={handlePnrSearch} disabled={isLoading} className="w-full mt-4 font-black uppercase text-xs h-11 tracking-widest">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        Retrieve PNR Context
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* ENGINE TRACE LOG */}
          {(discoveryLog.length > 0) && (
            <Card className="bg-slate-900 border-none shadow-xl">
                <CardHeader className="py-3 border-b border-white/10">
                    <CardTitle className="text-[9px] font-black uppercase text-emerald-400 flex items-center gap-2">
                        <Activity className="h-3 w-3" /> System Execution Trace
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                    <div className="space-y-2 font-mono text-[10px] text-slate-300">
                        {discoveryLog.map((log, i) => (
                            <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="text-emerald-500 font-bold">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                {log}
                            </div>
                        ))}
                        {isLoading && <Loader2 className="h-3 w-3 animate-spin text-emerald-500 mt-2" />}
                    </div>
                </CardContent>
            </Card>
          )}
        </div>

        {/* --- RIGHT: SIMULATED UI & RESULTS --- */}
        <div className="lg:col-span-8">
            {/* STEP 1: Search Initial State */}
            {step === 'pnr_discovery' && !pnrData && (
                <div className="flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed rounded-2xl bg-muted/20">
                    <Workflow className="h-16 w-16 text-muted-foreground/20 mb-4" />
                    <p className="font-bold text-muted-foreground">Awaiting PNR Identity</p>
                    <p className="text-xs text-muted-foreground/60 uppercase tracking-widest mt-1">Enter a valid 6-character PNR to begin</p>
                </div>
            )}

            {/* STEP 2: PNR Found - Show Discovery Card */}
            {pnrData && (step === 'pnr_discovery' || step === 'offer_generation') && (
                <div className="space-y-6">
                    <Card className="border-emerald-200 bg-emerald-50/20 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg">Passenger Context Found</CardTitle>
                                <CardDescription>Retrieved from Global PSS Network</CardDescription>
                            </div>
                            <Badge variant="default" className="bg-emerald-600 font-mono">{pnrData.pnr}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
                                <div><p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Passenger</p><p className="font-bold flex items-center gap-2"><User className="h-3 w-3"/> {pnrData.passenger}</p></div>
                                <div><p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Itinerary</p><p className="font-bold flex items-center gap-2"><Plane className="h-3 w-3"/> {pnrData.route}</p></div>
                                <div><p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Cabin Class</p><p className="font-bold">{pnrData.cabin}</p></div>
                                <div><p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Loyalty Tier</p><Badge variant="outline" className="border-amber-400 text-amber-700 bg-amber-50">{pnrData.loyaltyTier}</Badge></div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-white/50 border-t flex justify-center py-4">
                            <Button size="lg" onClick={handleGenerateOffers} disabled={isLoading} className="font-black h-12 px-12 text-md shadow-xl bg-primary">
                                {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Zap className="mr-2 h-5 w-5 fill-current" />}
                                GENERATE REAL-TIME OFFERS
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}

            {/* STEP 3: Results Display */}
            {step === 'results' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black flex items-center gap-2 text-primary">
                            <Store className="h-6 w-6" /> Personalised Retailing Stream
                        </h3>
                        <div className="flex gap-2">
                             {identifiedCohorts.map(c => <Badge key={c} variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-mono text-[10px] uppercase">{c}</Badge>)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        {generatedOffers.map((offer) => (
                            <Card 
                                key={offer.id} 
                                className="group cursor-pointer hover:ring-2 hover:ring-primary transition-all relative overflow-hidden flex flex-col shadow-sm border-slate-200"
                                onClick={() => { setSelectedOffer(offer); setStep('checkout'); }}
                            >
                                <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black px-3 py-1 rounded-bl-lg">
                                    {offer.domain?.toUpperCase() || 'BUNDLE'}
                                </div>
                                <CardHeader>
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Package className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-black">{offer.name}</CardTitle>
                                            <CardDescription className="text-xs line-clamp-2 min-h-[2.5rem]">{offer.description || 'Offersense Dynamic Bundle'}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                     <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="flex items-center gap-1 font-bold text-muted-foreground uppercase"><ShieldCheck className="h-3 w-3 text-emerald-500" /> Decision Logic:</span>
                                            <span className="font-black text-primary uppercase">{offer.pricing?.strategy || 'Static'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="flex items-center gap-1 font-bold text-muted-foreground uppercase"><Zap className="h-3 w-3 text-amber-500" /> Price Delta:</span>
                                            <span className="font-bold text-indigo-600 truncate max-w-[150px]">{offer.adjustmentMsg}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-slate-50/50 border-t flex justify-between items-baseline pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground line-through opacity-50 font-bold">${(offer.pricing?.basePrice || 0).toFixed(2)}</span>
                                        <span className="text-3xl font-black text-primary font-mono">${offer.displayPrice.toFixed(2)}</span>
                                    </div>
                                    <Button variant="outline" className="rounded-full h-9 px-6 text-xs font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-colors">Select Offer</Button>
                                </CardFooter>
                            </Card>
                        ))}
                        {generatedOffers.length === 0 && (
                            <div className="col-span-2 py-20 text-center border rounded-xl bg-muted/10 opacity-50">
                                <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                                <p className="font-bold">No eligible offers found for the current context.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 4: Checkout */}
            {step === 'checkout' && selectedOffer && (
                <div className="space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-2 text-primary font-black uppercase text-sm tracking-widest">
                        <Button variant="ghost" size="icon" onClick={() => setStep('results')}><ArrowRight className="h-4 w-4 rotate-180" /></Button>
                        <span>Settlement & PSS Synchronisation</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="shadow-2xl border-primary/20 overflow-hidden">
                            <div className="bg-primary p-6 text-white">
                                <CardTitle className="text-white flex items-center gap-2"><CreditCard className="h-5 w-5" /> Transaction Authorization</CardTitle>
                                <p className="text-xs text-white/70 mt-1 uppercase font-bold tracking-widest">Master Order Summary</p>
                            </div>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <span>Parent PNR</span>
                                        <span className="text-primary font-mono">{pnrData.pnr}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-sm font-medium">Air Transportation ({pnrData.cabin})</span>
                                        <span className="font-mono text-sm text-slate-500">${pnrData.baseFare.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 text-primary font-black">
                                        <span className="text-sm">{selectedOffer.name}</span>
                                        <span className="font-mono text-sm">+${selectedOffer.displayPrice.toFixed(2)}</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-lg font-black uppercase text-slate-700">Total Settlement</span>
                                        <span className="text-3xl font-black text-primary font-mono tracking-tighter">${(pnrData.baseFare + selectedOffer.displayPrice).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 border rounded-2xl bg-blue-50/50 border-blue-100">
                                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white"><ShieldCheck className="h-6 w-6" /></div>
                                    <p className="text-xs text-blue-900 leading-tight">
                                        Proceeding will trigger a <strong>SITA Virtual EMD</strong> and commit SSR updates to the <strong>Host PSS</strong> system.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleCompletePayment} className="w-full h-14 text-lg font-black uppercase tracking-widest shadow-xl" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
                                    Commit & Sync PSS
                                </Button>
                            </CardFooter>
                        </Card>

                        <div className="space-y-6">
                            <Card className="bg-slate-50/50 border-dashed border-2">
                                <CardHeader className="pb-2"><CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Fulfillment Token Preview</CardTitle></CardHeader>
                                <CardContent className="flex flex-col items-center py-8">
                                    <div className="p-4 bg-white rounded-2xl shadow-xl border-2 border-white relative group">
                                        <Image src="https://picsum.photos/seed/sita-qr/200/200" alt="QR" width={180} height={180} className="opacity-80" data-ai-hint="qr code" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <QrCode className="h-10 w-10 text-primary" />
                                        </div>
                                    </div>
                                    <p className="mt-6 font-mono text-[10px] text-slate-400 font-bold uppercase">SITA_EMD_{selectedOffer.id?.slice(0,8)}</p>
                                </CardContent>
                            </Card>
                             <div className="p-5 border rounded-2xl bg-amber-50 border-amber-100 flex gap-4">
                                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase text-amber-800 tracking-wider">Compliance Enforcement</p>
                                    <p className="text-[10px] text-amber-700 leading-relaxed">Price recalculation verified against <strong>Policy Pack v18</strong>. Settlement complies with SITA CUPPS and carrier-specific retailing guardrails.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 5: Confirmation */}
            {step === 'confirmation' && (
                <div className="space-y-8 animate-in zoom-in-50 duration-700 pb-20">
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
                        <div className="relative">
                             <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20 scale-150"></div>
                             <div className="h-24 w-24 bg-emerald-500 rounded-full flex items-center justify-center relative z-10 shadow-2xl shadow-emerald-500/30">
                                <Check className="h-14 w-14 text-white stroke-[4]" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-4xl font-black tracking-tighter text-primary uppercase">Sync Complete</h2>
                            <p className="text-slate-500 max-w-sm mx-auto font-medium">Virtual EMD Issued. Synchronisation with Host PSS confirmed via SITA Broker.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl mx-auto">
                        <Card className="md:col-span-8 shadow-2xl border-emerald-100 overflow-hidden rounded-3xl">
                            <CardHeader className="bg-emerald-50/50 border-b p-6">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-md flex items-center gap-2 font-black">
                                        <ReceiptText className="h-5 w-5 text-emerald-600" />
                                        Order Receipt: {createdOrderId}
                                    </CardTitle>
                                    <Badge variant="default" className="bg-emerald-600 px-3 py-1 font-mono tracking-widest text-[9px]">PSS_COMMITTED</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p><p className="font-bold text-sm">{pnrData.passenger}</p></div>
                                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Master PNR</p><p className="font-mono font-black text-primary text-sm uppercase">{pnrData.pnr}</p></div>
                                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Terminal</p><p className="font-bold text-sm">@{form.getValues('airportNode')}</p></div>
                                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fulfillment</p><p className="font-bold text-sm text-emerald-600">Digital Token</p></div>
                                    </div>
                                    <Separator />
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Breakdown</p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-white rounded-xl border shadow-sm text-slate-400"><Activity className="h-5 w-5" /></div>
                                                    <div><p className="font-bold text-sm text-slate-700">Air Transportation Sync</p><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{pnrData.cabin} • {pnrData.route}</p></div>
                                                </div>
                                                <p className="font-mono font-black text-slate-400 text-sm">${pnrData.baseFare.toFixed(2)}</p>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-white rounded-xl border shadow-sm text-emerald-600"><Ticket className="h-5 w-5" /></div>
                                                    <div><p className="font-black text-sm text-emerald-900">{selectedOffer.name}</p><p className="text-[10px] text-emerald-600 uppercase font-black tracking-widest">ECOSYSTEM_BUNDLE</p></div>
                                                </div>
                                                <p className="font-mono font-black text-emerald-700 text-sm">${selectedOffer.displayPrice.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-8 flex justify-between items-center border-t">
                                    <p className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Total Settled</p>
                                    <p className="text-4xl font-black text-primary font-mono tracking-tighter">${(pnrData.baseFare + selectedOffer.displayPrice).toFixed(2)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="md:col-span-4 space-y-6">
                            <Card className="bg-indigo-50/50 border-indigo-100 rounded-3xl">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[10px] font-black uppercase text-indigo-700 flex items-center gap-2 tracking-widest">
                                        <History className="h-4 w-4" /> Orchestration Audit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="flex gap-4 relative">
                                        <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-indigo-200" />
                                        <div className="h-3 w-3 rounded-full bg-indigo-500 relative z-10 mt-1" />
                                        <div><p className="text-[10px] font-black text-indigo-400">14:02:11</p><p className="text-xs font-bold text-indigo-900">Ecosystem discovery complete.</p></div>
                                    </div>
                                    <div className="flex gap-4 relative">
                                        <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-indigo-200" />
                                        <div className="h-3 w-3 rounded-full bg-indigo-500 relative z-10 mt-1" />
                                        <div><p className="text-[10px] font-black text-indigo-400">14:02:45</p><p className="text-xs font-bold text-indigo-900">Dynamic price recalculated.</p></div>
                                    </div>
                                    <div className="flex gap-4 relative">
                                        <div className="h-3 w-3 rounded-full bg-emerald-500 relative z-10 mt-1 shadow-sm" />
                                        <div><p className="text-[10px] font-black text-emerald-500">14:03:02</p><p className="text-xs font-black text-emerald-700 uppercase tracking-tighter">Order committed & PSS synced.</p></div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col gap-3">
                                <Button className="w-full font-black uppercase tracking-widest h-12 rounded-xl" onClick={() => { setStep('pnr_discovery'); setPnrData(null); }}>
                                    New Simulation <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button variant="outline" className="w-full font-black uppercase tracking-widest h-12 rounded-xl" asChild>
                                    <Link href="/orders"><History className="mr-2 h-4 w-4" /> Transaction Log</Link>
                                </Button>
                                <Button variant="secondary" className="w-full font-black uppercase tracking-widest h-12 rounded-xl" asChild>
                                    <Link href={`/orders/${createdOrderId}`}><ExternalLink className="mr-2 h-4 w-4" /> Full Order Data</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
