'use client';

import { useState, useMemo } from 'react';
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
  Coffee,
  Zap,
  Activity,
  History,
  Clock,
  CreditCard,
  Sparkles
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type ComposerStep = 'discovery' | 'results' | 'checkout' | 'confirmation';

const contextSchema = z.object({
  touchpoint: z.enum(['CUSS_Kiosk', 'CUTE_Desktop', 'Mobile_App']).default('CUSS_Kiosk'),
  airportNode: z.string().min(3).max(3).toUpperCase(),
  pnr: z.string().min(6).max(6).toUpperCase(),
  loyaltyTier: z.enum(['None', 'Bronze', 'Silver', 'Gold', 'Platinum']).default('None'),
  waitTime: z.coerce.number().min(0).default(5),
  timeToDeparture: z.coerce.number().min(0).default(120),
  paxCount: z.coerce.number().min(1).default(1),
  tripPurpose: z.enum(['Leisure', 'Business', 'Disruption']).default('Leisure'),
});

const mockBaseOffer = {
    pnr: 'L8Y2N3',
    passenger: 'John Smith',
    route: 'LHR-JFK',
    cabin: 'Economy Flex',
    baseFare: 850.00
};

export default function AirportOfferComposerPage() {
  const [step, setStep] = useState<ComposerStep>('discovery');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [discoveryLog, setDiscoveryLog] = useState<string[]>([]);
  const { toast } = useToast();
  const firestore = useFirestore();

  // Pull active bundles and ancillaries from live ecosystem
  const bundlesQuery = useMemo(() => firestore ? collection(firestore, 'bundles') : undefined, [firestore]);
  const ancillariesQuery = useMemo(() => firestore ? collection(firestore, 'airlineAncillaries') : undefined, [firestore]);
  
  const { data: liveBundles } = useCollection(bundlesQuery);
  const { data: liveAncillaries } = useCollection(ancillariesQuery);

  const form = useForm<z.infer<typeof contextSchema>>({
    resolver: zodResolver(contextSchema),
    defaultValues: {
      touchpoint: 'CUSS_Kiosk',
      airportNode: 'LHR',
      pnr: 'L8Y2N3',
      loyaltyTier: 'Silver',
      waitTime: 25,
      timeToDeparture: 90,
      paxCount: 1,
      tripPurpose: 'Leisure',
    },
  });

  const handleSimulate = async () => {
    setIsLoading(true);
    setStep('discovery');
    setDiscoveryLog([]);
    
    // Simulate real-time logic processing
    const logs = [
      "Querying Host PSS for PNR L8Y2N3...",
      "Analyzing Airport Node LHR operational signals...",
      `Detected ${form.getValues('waitTime')}m security wait at T5.`,
      "Applying Continuous Pricing rules...",
      "Assembling dynamic bundles for 'Silver' tier..."
    ];

    for(let i = 0; i < logs.length; i++) {
        setDiscoveryLog(prev => [...prev, logs[i]]);
        await new Promise(r => setTimeout(r, 600));
    }
    
    setIsLoading(false);
    setStep('results');
    toast({ title: "Offers Personalized", description: "Contextual retailing applied successfully." });
  };

  const handleSelectOffer = (offer: any) => {
    setSelectedOffer(offer);
    setStep('checkout');
  };

  const handleCompletePayment = async () => {
    if (!firestore) return;
    setIsLoading(true);
    
    try {
        const orderData = {
            customer: mockBaseOffer.passenger,
            email: 'john.smith@example.com',
            status: 'Fulfilled',
            date: new Date().toISOString().split('T')[0],
            amount: mockBaseOffer.baseFare + selectedOffer.price,
            currency: 'USD',
            source: form.getValues('touchpoint').replace('_', ' '),
            airportCode: form.getValues('airportNode'),
            payment: { method: 'Credit Card', status: 'Paid' },
            services: [
                { id: 'FL-001', type: 'Flight', provider: 'Airline Host', status: 'Confirmed', price: mockBaseOffer.baseFare },
                { id: selectedOffer.id, type: 'Lounge', provider: 'Offersense Ecosystem', status: 'Fulfilled', price: selectedOffer.price }
            ]
        };

        await addDoc(collection(firestore, 'orders'), {
            ...orderData,
            createdAt: serverTimestamp(),
            pnr: form.getValues('pnr'),
            isSimulated: true
        });

        await new Promise(r => setTimeout(r, 1500)); // Simulate PSS sync latency
        setStep('confirmation');
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Order Sync Failed', description: e.message });
    } finally {
        setIsLoading(false);
    }
  };

  // Logic to simulate dynamic results based on form inputs
  const simulatedOffers = useMemo(() => {
    const context = form.getValues();
    const offers = [
      { 
        id: 'SIM-001', 
        title: 'Executive Lounge Pass', 
        price: context.loyaltyTier === 'Gold' ? 35 : 55, 
        originalPrice: 65,
        adjustment: context.loyaltyTier === 'Gold' ? '-$30 (Loyalty)' : '-$10 (Channel)',
        items: ['Fast Wi-Fi', 'Hot Buffet', 'Showers'],
        icon: Coffee,
        type: 'Service'
      },
      { 
        id: 'SIM-002', 
        title: 'VIP Fast-Track Bundle', 
        price: context.waitTime > 20 ? 85 : 110, 
        originalPrice: 135,
        adjustment: context.waitTime > 20 ? '-$50 (Queue Relief)' : '-$25 (Promo)',
        items: ['Security Priority', 'Lounge Access', 'Porter'],
        icon: Sparkles,
        type: 'Dynamic Bundle'
      }
    ];

    if (context.timeToDeparture < 60) {
        offers.unshift({
            id: 'SIM-003',
            title: 'Last-Minute Boarding+ ',
            price: 15,
            originalPrice: 25,
            adjustment: '-$10 (Urgency)',
            items: ['Zone 1 Boarding', 'Personal Alert'],
            icon: Zap,
            type: 'Service'
        });
    }

    return offers;
  }, [form.getValues(), step]); // eslint-disable-line

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Airport Offer Composer</h1>
          <p className="text-muted-foreground font-medium">Simulator for Contextual Retailing & SITA Touchpoint Integration.</p>
        </div>
        {step !== 'discovery' && (
            <Button variant="ghost" onClick={() => setStep('discovery')} className="text-muted-foreground">
                <History className="mr-2 h-4 w-4" /> Reset Simulator
            </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
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
                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">SITA Device</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="CUSS_Kiosk">SITA CUSS Kiosk (LHR-K-01)</SelectItem>
                            <SelectItem value="CUTE_Desktop">Agent CUTE Desktop</SelectItem>
                            <SelectItem value="Mobile_App">Mobile App (Geo-fenced)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="airportNode" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs uppercase font-bold text-muted-foreground">Airport</FormLabel><FormControl><Input className="h-9" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="pnr" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs uppercase font-bold text-muted-foreground">PNR</FormLabel><FormControl><Input className="h-9" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                  <Separator className="my-2" />
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">Environment Signals</p>
                    <div className="grid grid-cols-2 gap-3">
                         <FormField control={form.control} name="loyaltyTier" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Loyalty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="None">None</SelectItem><SelectItem value="Bronze">Bronze</SelectItem><SelectItem value="Silver">Silver</SelectItem><SelectItem value="Gold">Gold</SelectItem></SelectContent></Select></FormItem>
                        )} />
                        <FormField control={form.control} name="tripPurpose" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Purpose</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Leisure">Leisure</SelectItem><SelectItem value="Business">Business</SelectItem><SelectItem value="Disruption">Disruption</SelectItem></SelectContent></Select></FormItem>
                        )} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField control={form.control} name="waitTime" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Security Wait (m)</FormLabel><FormControl><Input type="number" className="h-8" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="timeToDeparture" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Depart in (m)</FormLabel><FormControl><Input type="number" className="h-8" {...field} /></FormControl></FormItem>
                        )} />
                    </div>
                  </div>
                  <Button type="button" onClick={handleSimulate} disabled={isLoading} className="w-full mt-4 font-bold">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Simulate Ecosystem Discovery
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {step === 'results' && (
             <Alert className="bg-indigo-50 border-indigo-200">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <AlertTitle className="text-indigo-800 text-xs font-bold uppercase">Intelligence Applied</AlertTitle>
                <AlertDescription className="text-indigo-700 text-xs">
                    Continuous pricing applied based on {form.getValues('loyaltyTier')} tier and {form.getValues('waitTime')}m wait time signal.
                </AlertDescription>
             </Alert>
          )}
        </div>

        <div className="lg:col-span-8">
            {step === 'discovery' && (
                <div className="flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed rounded-xl bg-muted/20">
                    {isLoading ? (
                        <div className="space-y-6 text-center max-w-sm">
                            <div className="relative">
                                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 scale-150"></div>
                                <Activity className="h-12 w-12 text-primary mx-auto relative z-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold">Discovering Ecosystem...</h3>
                                <div className="text-left bg-background p-4 rounded-lg border shadow-inner font-mono text-[10px] space-y-1">
                                    {discoveryLog.map((log, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="text-primary font-bold">✓</span>
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <Workflow className="h-16 w-12 text-muted-foreground/30 mx-auto" />
                            <div className="space-y-1">
                                <p className="font-bold text-muted-foreground">Awaiting Simulation Trigger</p>
                                <p className="text-sm text-muted-foreground/70">Define a touchpoint context to discover personalized offers.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {step === 'results' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold flex items-center gap-2"><Store className="h-5 w-5 text-primary" /> Available Retailing Stream</h3>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Continuous Pricing Active</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {simulatedOffers.map((offer) => (
                            <Card 
                                key={offer.id} 
                                className="group cursor-pointer hover:ring-2 hover:ring-primary transition-all relative overflow-hidden flex flex-col"
                                onClick={() => handleSelectOffer(offer)}
                            >
                                <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black px-3 py-1 rounded-bl-lg">
                                    {offer.type.toUpperCase()}
                                </div>
                                <CardHeader>
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <offer.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle>{offer.title}</CardTitle>
                                            <CardDescription className="text-xs">Provided by Offersense Ecosystem</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <ul className="space-y-2 mb-4">
                                        {offer.items.map(item => (
                                            <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Check className="h-3 w-3 text-emerald-500" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="p-2 rounded bg-muted/50 border border-muted text-[10px] flex justify-between items-center">
                                        <span className="flex items-center gap-1 font-bold text-muted-foreground"><ShieldCheck className="h-3 w-3" /> Policy Adjustment:</span>
                                        <span className="font-black text-indigo-600 uppercase">{offer.adjustment}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/30 border-t flex justify-between items-baseline pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground line-through opacity-50">${offer.originalPrice.toFixed(2)}</span>
                                        <span className="text-2xl font-black text-primary">${offer.price.toFixed(2)}</span>
                                    </div>
                                    <Button variant="outline" className="rounded-full h-8 px-4 text-xs font-bold group-hover:bg-primary group-hover:text-white transition-colors">Select Offer</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {step === 'checkout' && selectedOffer && (
                <div className="space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <Button variant="ghost" size="icon" onClick={() => setStep('results')}><ArrowRight className="h-4 w-4 rotate-180" /></Button>
                        <h3 className="text-xl">Authorization & Fulfillment</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="shadow-lg">
                            <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 p-4 bg-muted rounded-lg border">
                                    <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        <span>Current PNR</span>
                                        <span className="text-primary">{form.getValues('pnr')}</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">{mockBaseOffer.cabin} (Base)</span>
                                        <span className="font-mono">${mockBaseOffer.baseFare.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-primary font-bold">
                                        <span className="text-sm">{selectedOffer.title}</span>
                                        <span className="font-mono">+${selectedOffer.price.toFixed(2)}</span>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-black uppercase">Total Authorized</span>
                                        <span className="text-2xl font-black text-primary">${(mockBaseOffer.baseFare + selectedOffer.price).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black">Settlement Logic</p>
                                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-emerald-50/50">
                                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                        <p className="text-xs text-emerald-800 leading-tight">Proceeding will issue a <strong>SITA Virtual EMD</strong> and commit real-time updates to the Host PSS system.</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleCompletePayment} className="w-full h-12 text-lg font-black" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
                                    Authorize & Sync PSS
                                </Button>
                            </CardFooter>
                        </Card>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle className="text-sm">Hardware Token Preview</CardTitle></CardHeader>
                                <CardContent className="flex flex-col items-center">
                                    <div className="p-4 bg-white rounded-xl shadow-inner border">
                                        <Image src="https://picsum.photos/seed/qr/200/200" alt="QR" width={180} height={180} className="opacity-80" data-ai-hint="qr code" />
                                    </div>
                                    <p className="mt-4 font-mono text-[10px] text-muted-foreground uppercase">TOKEN_{selectedOffer.id}</p>
                                </CardContent>
                            </Card>
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle className="text-xs font-bold uppercase">Compliance Check</AlertTitle>
                                <AlertDescription className="text-xs text-muted-foreground">Price is within ±15% band of fair-market value. Order is compliant with SITA CUPPS protocols.</AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </div>
            )}

            {step === 'confirmation' && (
                <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-8 animate-in zoom-in-50 duration-700">
                    <div className="relative">
                         <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20 scale-150"></div>
                         <div className="h-24 w-24 bg-emerald-500 rounded-full flex items-center justify-center relative z-10 shadow-xl shadow-emerald-500/20">
                            <Check className="h-12 w-12 text-white stroke-[4]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black tracking-tight">Retailing Complete</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto">PNR successfully updated. EMD Issued. Synchronization with Host PSS confirmed.</p>
                    </div>
                    
                    <Card className="w-full max-w-lg border-emerald-100 bg-emerald-50/20">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Order ID</p>
                                    <p className="font-mono text-sm">#{Math.floor(Math.random() * 90000) + 10000}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Sync Hub</p>
                                    <p className="font-mono text-sm">{form.getValues('airportNode')}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
                                    <Badge variant="default" className="bg-emerald-600">PSS_COMMITTED</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/orders"><History className="mr-2 h-4 w-4" /> View Order Dashboard</Link>
                        </Button>
                        <Button onClick={() => setStep('discovery')} className="font-bold">
                            New Simulation <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
