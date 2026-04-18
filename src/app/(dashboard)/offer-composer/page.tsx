
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Search, 
  Wand2, 
  Loader2, 
  Workflow, 
  QrCode, 
  MonitorDot, 
  Store, 
  Smartphone, 
  UserSquare2, 
  Check, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Coffee,
  Car,
  Zap,
  ShoppingBag,
  UserCheck,
  MapPin,
  Clock,
  Ticket,
  Luggage,
  CloudSun,
  Activity,
  History
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

type OfferStatus = 'EcosystemDiscovery' | 'Retailled' | 'TerminalSelected' | 'QRGenerated' | 'PushingToHardware' | 'PSSSyncPending' | 'Completed';

const sitaSearchSchema = z.object({
  touchpoint: z.enum(['Web', 'Mobile', 'CUSS_Kiosk', 'CUTE_Desktop']).default('CUSS_Kiosk'),
  airportNode: z.string().min(3).max(3).toUpperCase(),
  terminal: z.string().optional(),
  pnr: z.string().min(6).max(6).toUpperCase().optional(),
  passengerName: z.string().optional(),
});

const mockOffers = [
  { 
    id: 'O-1', 
    title: 'LHR Executive Lounge', 
    provider: 'LHR T5 Partners', 
    type: 'Lounge', 
    price: 45, 
    dynamicAdjustment: 4.50,
    items: ['Quiet Zone', 'Premium Dining', 'Shower Suites'], 
    hint: 'airport lounge',
    isDynamicBundle: false,
    icon: Coffee
  },
  { 
    id: 'O-2', 
    title: 'VIP Fast-Track Bundle', 
    provider: 'Offersense Engine', 
    type: 'Dynamic Bundle', 
    price: 135, 
    dynamicAdjustment: -15.00,
    items: ['SITA VIP Meet & Assist', 'Fast Track Security', 'Lounge Priority'], 
    hint: 'vip concierge',
    isDynamicBundle: true,
    icon: UserCheck
  },
  { 
    id: 'O-3', 
    title: 'Fast Track Security', 
    provider: 'Airport Ops', 
    type: 'Priority', 
    price: 15, 
    dynamicAdjustment: 2.50,
    items: ['Bypass Main Queues', 'Priority Lane Access'], 
    hint: 'fast security',
    isDynamicBundle: false,
    icon: Zap
  },
  { 
    id: 'O-8', 
    title: 'Business Cabin Upgrade', 
    provider: 'Airline PSS', 
    type: 'Air', 
    price: 250, 
    dynamicAdjustment: 12.80,
    items: ['Flat Bed Seat', 'Priority Baggage', 'Fine Dining'], 
    hint: 'business cabin',
    isDynamicBundle: false,
    icon: Zap
  },
];

export default function AirportOfferComposerPage() {
  const [status, setStatus] = useState<OfferStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof sitaSearchSchema>>({
    resolver: zodResolver(sitaSearchSchema),
    defaultValues: {
      touchpoint: 'CUSS_Kiosk',
      airportNode: 'LHR',
      terminal: 'T5',
      pnr: 'L8Y2N3',
    },
  });

  const handleDiscover = async () => {
    setIsLoading(true);
    setStatus('EcosystemDiscovery');
    setSelectedOffer(null);
    
    setTimeout(() => {
      setIsLoading(false);
      setStatus('Retailled');
      toast({
        title: "Retailing Simulation Active",
        description: "Applying Continuous Pricing and Dynamic Bundling logic.",
      });
    }, 2000);
  };

  const handleSelectOffer = (offer: any) => {
    setSelectedOffer(offer);
    setStatus('TerminalSelected');
  };

  const offerLifecycleSteps = [
    { id: 'EcosystemDiscovery', label: 'Ecosystem Discovery', desc: 'Querying Host PSS & Airport Cache' },
    { id: 'Retailled', label: 'Policy Execution', desc: 'Applying Guardrails & Adjustments' },
    { id: 'TerminalSelected', label: 'Hardware Mapping', desc: 'Offer bound to SITA touchpoint' },
    { id: 'Completed', label: 'Settlement Sync', desc: 'Finalizing PNR state' },
  ];

  const currentStepIndex = offerLifecycleSteps.findIndex(s => s.id === status);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Airport Offer Composer</h1>
        <p className="text-muted-foreground">Simulator for SITA CUSS/CUTE hardware discovery and continuous pricing enforcement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Touchpoint Context (Simulated)</CardTitle>
              <CardDescription>Simulate hardware ID and passenger data to trigger dynamic assembly.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="touchpoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SITA Touchpoint</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="CUSS_Kiosk">SITA CUSS Kiosk (LHR-K-01)</SelectItem>
                              <SelectItem value="CUTE_Desktop">Agent CUTE Desktop</SelectItem>
                              <SelectItem value="Mobile">Mobile (Geo-fenced)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="airportNode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Airport Node (IATA)</FormLabel>
                          <FormControl><Input placeholder="e.g., LHR" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pnr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passenger PNR</FormLabel>
                          <FormControl><Input placeholder="e.g., ABC123" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="terminal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Logic (Gate/Zone)</FormLabel>
                          <FormControl><Input placeholder="e.g., T5 Gate B42" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="button" onClick={handleDiscover} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
                    Simulate Offer Assembly
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {status && status !== 'EcosystemDiscovery' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Store className="h-5 w-5" /> Active Retailing Stream
                </h3>
                <Badge variant="outline" className="text-[10px] uppercase font-mono">Real-time Policy Enforced</Badge>
              </div>
              <ScrollArea className="h-[600px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                  {mockOffers.map((offer) => (
                    <Card 
                      key={offer.id} 
                      className={cn(
                        "cursor-pointer hover:border-primary transition-all relative overflow-hidden",
                        selectedOffer?.id === offer.id && "ring-2 ring-primary border-primary",
                        offer.isDynamicBundle && "border-primary/50 bg-primary/5"
                      )}
                      onClick={() => handleSelectOffer(offer)}
                    >
                      {offer.isDynamicBundle && (
                        <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-md">
                          DYNAMIC BUNDLE
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <offer.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-md">{offer.title}</CardTitle>
                              <CardDescription className="text-[10px]">{offer.provider}</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                          {offer.items.map(i => <li key={i} className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> {i}</li>)}
                        </ul>
                        <div className="p-2 rounded bg-muted/50 border border-muted flex items-center justify-between text-[10px]">
                           <span className="flex items-center gap-1 text-muted-foreground"><ShieldCheck className="h-3 w-3" /> Continuous Price Adjustment:</span>
                           <span className={cn("font-bold", offer.dynamicAdjustment > 0 ? "text-amber-600" : "text-green-600")}>
                             {offer.dynamicAdjustment > 0 ? `+${offer.dynamicAdjustment.toFixed(2)}` : `${offer.dynamicAdjustment.toFixed(2)}`}
                           </span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-baseline pt-2">
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground line-through opacity-50">${(offer.price - offer.dynamicAdjustment).toFixed(2)}</span>
                           <span className="text-xl font-bold">${offer.price.toFixed(2)}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary text-[10px] p-0">Detailed Insights</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 border-2 border-dashed rounded-lg">
              {isLoading ? (
                <div className="text-center">
                  <Loader2 className="h-12 w-12 mb-4 animate-spin mx-auto opacity-20" />
                  <p>Assembling Dynamic Packages...</p>
                </div>
              ) : (
                <>
                  <MonitorDot className="h-12 w-12 mb-4 opacity-20" />
                  <p>Initialize touchpoint context to simulate retailing discovery.</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {status && (
            <Card className="border-primary/20 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <History className="h-4 w-4" /> Discovery Orchestration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border" />
                  {offerLifecycleSteps.map((step, index) => {
                    const isCompleted = index < currentStepIndex || (status === 'Retailled' && index <= currentStepIndex);
                    const isCurrent = index === currentStepIndex;
                    return (
                      <div key={step.id} className="flex items-start gap-4 relative pb-6 last:pb-0">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center mt-0.5 z-10",
                          isCompleted ? "bg-primary" : "bg-muted-foreground/30",
                          isCurrent && "bg-primary ring-4 ring-primary/20"
                        )}>
                          {isCompleted && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <div>
                          <p className="font-semibold text-xs">{step.label}</p>
                          <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {status === 'Retailled' && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800 text-xs font-bold uppercase tracking-tight">Ecosystem Intelligence</AlertTitle>
              <AlertDescription className="text-blue-700 text-[10px] space-y-2">
                <p><strong>Dynamic Bundling Triggered:</strong> Passenger has > 2.5h transit window. Assembling VIP Fast-Track bundle (Lounge + Security).</p>
                <p><strong>Continuous Pricing applied:</strong> Base fares adjusted +5% based on load factor signal from Airline Host PSS.</p>
              </AlertDescription>
            </Alert>
          )}

          {selectedOffer && (
             <Card className="border-primary shadow-lg overflow-hidden">
             <CardHeader className="bg-primary/5 pb-4">
               <CardTitle className="text-sm flex items-center gap-2">
                 <QrCode className="h-4 w-4" /> Hardware Activation
               </CardTitle>
             </CardHeader>
             <CardContent className="pt-6 space-y-4">
               <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-primary/20 relative">
                    <div className="text-center p-4">
                     <Image 
                       src="https://picsum.photos/seed/sita-qr/200/200" 
                       alt="Activation QR" 
                       width={160} 
                       height={160} 
                       className="mx-auto rounded border p-1 bg-white"
                       data-ai-hint="qr code"
                     />
                     <p className="text-[10px] mt-4 font-mono text-muted-foreground uppercase">
                       SITA_TOK_{selectedOffer.id}
                     </p>
                   </div>
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-bold text-primary mb-1 uppercase">Policy Verified</p>
                  <p className="text-[9px] text-muted-foreground italic">Guardrails checked: Price within ±15% band. Update committed to PSS.</p>
               </div>
               <Button className="w-full h-8 text-xs font-bold">Commit & Sync to PSS</Button>
             </CardContent>
           </Card>
          )}
        </div>
      </div>
    </div>
  );
}
