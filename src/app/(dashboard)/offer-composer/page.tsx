'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
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
  Clock
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
    title: 'Executive Lounge Access', 
    provider: 'LHR Partners', 
    type: 'Airport Service', 
    price: 45, 
    items: ['Complimentary Food', 'Quiet Zone', 'Premium Wifi'], 
    hint: 'luxury lounge',
    icon: Coffee
  },
  { 
    id: 'O-2', 
    title: 'Meet & Assist VIP', 
    provider: 'Airport Concierge', 
    type: 'Airport Service', 
    price: 120, 
    items: ['Personal Escort', 'Buggy Service', 'Porter Service'], 
    hint: 'concierge',
    icon: UserCheck
  },
  { 
    id: 'O-3', 
    title: 'Fast Track Security', 
    provider: 'LHR Operations', 
    type: 'Airport Service', 
    price: 15, 
    items: ['Skip Lines', 'Dedicated Lane'], 
    hint: 'fast line',
    icon: Zap
  },
  { 
    id: 'O-4', 
    title: 'Luxury Car Transfer', 
    provider: 'CityLimo', 
    type: 'Partner', 
    price: 85, 
    items: ['Mercedes S-Class', 'Meet at Arrivals', 'Wifi Onboard'], 
    hint: 'luxury car',
    icon: Car
  },
  { 
    id: 'O-5', 
    title: 'Valet Parking Upgrade', 
    provider: 'Airport Parking', 
    type: 'Airport Service', 
    price: 30, 
    items: ['Covered Parking', 'Car Wash Included'], 
    hint: 'parking valet',
    icon: MapPin
  },
  { 
    id: 'O-6', 
    title: 'Duty-Free Shopping Credit', 
    provider: 'WorldDutyFree', 
    type: 'Retail', 
    price: 40, 
    items: ['$50 Shopping Voucher', 'All Categories'], 
    hint: 'duty free',
    icon: ShoppingBag
  },
  { 
    id: 'O-7', 
    title: 'Gourmet Bento Pre-order', 
    provider: 'SkyCaterers', 
    type: 'F&B', 
    price: 25, 
    items: ['Chef Selected Menu', 'Drink Included'], 
    hint: 'gourmet food',
    icon: Coffee
  },
  { 
    id: 'O-8', 
    title: 'Business Cabin Upgrade', 
    provider: 'Airline PSS', 
    type: 'Air', 
    price: 250, 
    items: ['Flat Bed', 'Priority Bag', 'Premium Meal'], 
    hint: 'airplane interior',
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
    
    // Simulate multi-source discovery (PSS + Local Vendor Cache)
    setTimeout(() => {
      setIsLoading(false);
      setStatus('Retailled');
      toast({
        title: "Ecosystem Discovery Complete",
        description: `Retrieved 1 Airline offer and ${mockOffers.length - 1} Airport ecosystem offers.`,
      });
    }, 2000);
  };

  const handleSelectOffer = (offer: any) => {
    setSelectedOffer(offer);
    setStatus('TerminalSelected');
  };

  const handleGenerateQr = () => {
    setStatus('QRGenerated');
    toast({
      title: "SITA QR Generated",
      description: "Encoded payload ready for CUPPS terminal scanning.",
    });
  };

  const handlePushToHardware = () => {
    setIsLoading(true);
    setStatus('PushingToHardware');
    setTimeout(() => {
      setIsLoading(false);
      setStatus('PSSSyncPending');
      toast({
        title: "Pushed to Kiosk",
        description: "Offer payload sent to Kiosk ID: K-LHR-5521",
      });
    }, 1500);
  };

  const offerLifecycleSteps = [
    { id: 'EcosystemDiscovery', label: 'Ecosystem Discovery', desc: 'Querying PSS & Airport Cache' },
    { id: 'Retailled', label: 'Offer Retailled', desc: 'Dynamic pricing & rules applied' },
    { id: 'TerminalSelected', label: 'Touchpoint Ready', desc: 'Offer mapped to SITA device' },
    { id: 'PSSSyncPending', label: 'PSS Sync', desc: 'Awaiting payment confirmation' },
  ];

  const currentStepIndex = offerLifecycleSteps.findIndex(s => s.id === status);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Airport Ecosystem Offer Composer</h1>
        <p className="text-muted-foreground">Simulate real-time offer generation and SITA CUSS/CUTE integration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Context & Results */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Retailing Context</CardTitle>
              <CardDescription>Define the airport touchpoint and passenger metadata.</CardDescription>
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
                              <SelectItem value="Web">Web Portal</SelectItem>
                              <SelectItem value="Mobile">Mobile App (Geo-fenced)</SelectItem>
                              <SelectItem value="CUSS_Kiosk">SITA CUSS Kiosk</SelectItem>
                              <SelectItem value="CUTE_Desktop">Agent Desktop (CUTE)</SelectItem>
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
                          <FormLabel>Terminal / Gate</FormLabel>
                          <FormControl><Input placeholder="e.g., T5 / Gate B42" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="button" onClick={handleDiscover} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MonitorDot className="mr-2 h-4 w-4" />}
                    Discover Ecosystem Offers
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {status && status !== 'EcosystemDiscovery' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Store className="h-5 w-5" /> Available Real-time Offers
              </h3>
              <ScrollArea className="h-[600px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                  {mockOffers.map((offer) => (
                    <Card 
                      key={offer.id} 
                      className={cn(
                        "cursor-pointer hover:border-primary transition-all",
                        selectedOffer?.id === offer.id && "ring-2 ring-primary border-primary"
                      )}
                      onClick={() => handleSelectOffer(offer)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <offer.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-md">{offer.title}</CardTitle>
                              <CardDescription>{offer.provider}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline">{offer.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="relative w-full h-24 mb-3 rounded overflow-hidden">
                          <Image 
                            src={`https://picsum.photos/seed/${offer.id}/400/200`} 
                            alt={offer.title} 
                            fill 
                            className="object-cover"
                            data-ai-hint={offer.hint}
                          />
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {offer.items.map(i => <li key={i} className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> {i}</li>)}
                        </ul>
                      </CardContent>
                      <CardFooter className="flex justify-between items-baseline pt-0">
                        <span className="text-xl font-bold">${offer.price}</span>
                        <Button variant="ghost" size="sm" className="text-primary p-0">Details</Button>
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
                  <p>Discovering ecosystem assets...</p>
                </div>
              ) : (
                <>
                  <Workflow className="h-12 w-12 mb-4 opacity-20" />
                  <p>Set retailing context and click discover to simulate ecosystem offers.</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Column: SITA Integration & Lifecycle */}
        <div className="space-y-6">
          {/* Lifecycle Status */}
          {status && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Workflow className="h-4 w-4" /> Retailing Lifecycle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border" />
                  {offerLifecycleSteps.map((step, index) => {
                    const isCompleted = index < currentStepIndex || (status === 'PSSSyncPending' && index <= currentStepIndex);
                    const isCurrent = index === currentStepIndex && status !== 'PSSSyncPending';
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

          {/* Terminal Interaction */}
          {selectedOffer && (
            <Card className="border-primary shadow-lg overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <QrCode className="h-4 w-4" /> Terminal Activation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-primary/20 relative">
                  {status === 'QRGenerated' || status === 'PSSSyncPending' ? (
                    <div className="text-center p-4">
                      <Image 
                        src="https://picsum.photos/seed/sita-qr/200/200" 
                        alt="SITA QR" 
                        width={160} 
                        height={160} 
                        className="mx-auto rounded border p-1 bg-white"
                        data-ai-hint="qr code"
                      />
                      <p className="text-[10px] mt-4 font-mono text-muted-foreground uppercase">
                        SITA_CUPPS_OFF_{selectedOffer.id}_LHR
                      </p>
                    </div>
                  ) : (
                    <div className="text-center px-6">
                      <Smartphone className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-50" />
                      <p className="text-xs text-muted-foreground">Ready to generate activation token for CUSS hardware.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button className="w-full" onClick={handleGenerateQr} disabled={status === 'QRGenerated' || status === 'PSSSyncPending'}>
                    Generate Activation QR
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handlePushToHardware} disabled={status === 'PSSSyncPending'}>
                    {status === 'PushingToHardware' ? <Loader2 className="h-4 w-4 animate-spin" /> : <MonitorDot className="mr-2 h-4 w-4" />}
                    Push to CUSS Kiosk
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> SITA AE Compliance</span>
                    <span className="text-green-600 font-bold">CERTIFIED</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground flex items-center gap-1"><UserSquare2 className="h-3 w-3" /> PSS Sync Link</span>
                    <span className={cn("font-bold", status === 'PSSSyncPending' ? "text-amber-600" : "text-muted-foreground")}>
                      {status === 'PSSSyncPending' ? 'PENDING PAYMENT' : 'READY'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compliance Alerts */}
          {status === 'Retailled' && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 text-xs font-bold uppercase tracking-tight">Compliance Note</AlertTitle>
              <AlertDescription className="text-amber-700 text-[10px]">
                One local offer (O-3) requires age verification at the terminal before fulfilment.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
