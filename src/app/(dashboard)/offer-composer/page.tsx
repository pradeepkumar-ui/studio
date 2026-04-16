
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format, addDays, isBefore } from 'date-fns';
import { CalendarIcon, PlaneTakeoff, PlaneLanding, Search, Wand2, Loader2, Armchair, Briefcase, FileJson, ShoppingBasket, BadgeCheck, XCircle, Tag, Check, Workflow, Award, HeartHandshake, QrCode, MonitorDot, Store } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Checkbox } from '@/components/ui/checkbox';

type OfferStatus = 'OfferRequested' | 'OfferProcessing' | 'OfferCreated' | 'OfferSelected' | 'OfferPriceValidated' | 'OfferStockChecked' | 'OfferConvertedToOrder';

const offerSearchSchema = z.object({
  tripType: z.enum(['one-way', 'return']).default('one-way'),
  origin: z.string().length(3).toUpperCase(),
  destination: z.string().length(3).toUpperCase(),
  departureDate: z.date(),
  returnDate: z.date().optional(),
  passengers: z.object({ adt: z.coerce.number().min(1), chd: z.coerce.number().min(0) }),
  cabinClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']),
  source: z.enum(['Web', 'Mobile', 'CUSS', 'CUTE']).default('Web'),
  airportCode: z.string().optional(),
});

export default function AirportOfferComposerPage() {
  const [offerStatus, setOfferStatus] = useState<OfferStatus | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<BrandedFare | null>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof offerSearchSchema>>({
    resolver: zodResolver(offerSearchSchema),
    defaultValues: {
      tripType: 'one-way',
      origin: 'LHR',
      destination: 'JFK',
      passengers: { adt: 1, chd: 0 },
      cabinClass: 'ECONOMY',
      source: 'CUSS',
      airportCode: 'LHR',
    },
  });

  const handleGenerateQr = () => {
    if (!selectedOffer) return;
    setOfferStatus('OfferPriceValidated');
    setQrGenerated(true);
    toast({
      title: "SITA QR Generated",
      description: "Offer payload encoded for CUSS/CUTE terminal scanning.",
    });
  };

  const handlePushToTerminal = () => {
    toast({
      title: "Pushed to SITA Hardware",
      description: "Offer is now visible on Kiosk 42B at Terminal 5.",
    });
  }

  const offerLifecycleSteps = [
    { status: 'OfferRequested', label: 'Ecosystem Discovery', description: 'Checking Airline PSS & Airport Inventory.' },
    { status: 'OfferCreated', label: 'Offer Retailled', description: 'Dynamic pricing & SITA config applied.' },
    { status: 'OfferSelected', label: 'Touchpoint Selected', description: 'Passenger engaging with offer at kiosk/phone.' },
    { status: 'OfferConvertedToOrder', label: 'Order PSS Sync', description: 'Payment confirmed & PNR updated.' },
  ];

  const currentStatusIndex = offerLifecycleSteps.findIndex(step => step.status === offerStatus);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Airport & SITA Offer Composer</h1>
        <p className="text-muted-foreground">Compose multi-touchpoint offers for Airline PSS and SITA Terminal ecosystems.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Contextual Shopping</CardTitle>
              <CardDescription>Target passengers based on terminal location and travel context.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retailing Touchpoint</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="Web">Web Portal</SelectItem>
                              <SelectItem value="Mobile">Mobile App (Geo-fenced)</SelectItem>
                              <SelectItem value="CUSS">SITA CUSS Kiosk</SelectItem>
                              <SelectItem value="CUTE">Agent Desktop (CUTE)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="airportCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Airport Node</FormLabel>
                          <FormControl><Input placeholder="e.g., LHR" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="origin" render={({ field }) => (<FormItem><FormLabel>Origin</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="destination" render={({ field }) => (<FormItem><FormLabel>Destination</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                  </div>
                  <Button type="button" onClick={() => setOfferStatus('OfferCreated')} className="w-full">
                    <MonitorDot className="mr-2 h-4 w-4" /> Discover Real-time Opportunities
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {offerStatus === 'OfferCreated' && (
             <Card>
                <CardHeader>
                    <CardTitle>2. Available Ecosystem Offers</CardTitle>
                    <CardDescription>Bundled air ancillaries and airport-specific services.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors" onClick={() => { setSelectedOffer({ brand: 'Business Upgrade + Lounge' } as any); setOfferStatus('OfferSelected'); }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-lg">Smart Transit Bundle</h4>
                                <p className="text-sm text-muted-foreground">Fast Track Security + Lounge Access + Boarding Upgrade</p>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline">Airline PSS</Badge>
                                    <Badge variant="outline">Heathrow Partner</Badge>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">$120.00</p>
                                <p className="text-xs text-green-600">Save 25%</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
             </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
            {offerStatus && (
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Workflow className="h-5 w-5" />
                        <CardTitle>Retailing Lifecycle</CardTitle>
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
                                        "w-5 h-5 rounded-full flex items-center justify-center mt-0.5 z-10",
                                        isCompleted ? "bg-primary" : "bg-muted-foreground/30",
                                        isCurrent && "bg-primary ring-4 ring-primary/20"
                                    )}>
                                        {isCompleted && <Check className="w-3 h-3 text-primary-foreground" />}
                                    </div>
                                    <div className="pb-8">
                                        <p className="font-semibold text-sm">{step.label}</p>
                                        <p className="text-xs text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </CardContent>
                </Card>
            )}

            {selectedOffer && (
                <Card className="border-primary shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><QrCode className="h-5 w-5" /> Terminal Activation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-primary/50 relative overflow-hidden">
                            {qrGenerated ? (
                                <div className="text-center p-6">
                                     <Image 
                                        src="https://picsum.photos/seed/qr/200/200" 
                                        alt="Offer QR" 
                                        width={160} 
                                        height={160} 
                                        className="mx-auto rounded"
                                        data-ai-hint="qr code"
                                    />
                                    <p className="text-xs mt-4 text-muted-foreground font-mono">OFF_PAYLOAD_LHR_073A</p>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Ready to generate QR for SITA CUSS</p>
                            )}
                        </div>
                        <Button className="w-full" onClick={handleGenerateQr} disabled={qrGenerated}>
                            Generate Offer QR
                        </Button>
                        <Button variant="outline" className="w-full" onClick={handlePushToTerminal} disabled={!qrGenerated}>
                            Push to Physical Kiosk
                        </Button>
                        <Separator />
                        <div className="space-y-2 text-xs text-muted-foreground">
                            <p className="flex justify-between"><span>PSS Sync Status</span> <span className="text-green-600 font-bold">READY</span></p>
                            <p className="flex justify-between"><span>SITA CUPPS Compliance</span> <span className="text-green-600 font-bold">PASSED</span></p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
