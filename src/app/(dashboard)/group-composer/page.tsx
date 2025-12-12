
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, PlaneTakeoff, PlaneLanding, Users, Search, Loader2, PlusCircle, Trash2, ShoppingBasket, Workflow, Check, FileJson } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

const flightSegmentSchema = z.object({
  origin: z.string().length(3, 'Must be 3-letter IATA code.').toUpperCase(),
  destination: z.string().length(3, 'Must be 3-letter IATA code.').toUpperCase(),
  departureDate: z.date(),
});

const groupRequestSchema = z.object({
  groupName: z.string().min(3, 'Group name is required.'),
  groupType: z.enum(['Leisure', 'Corporate', 'Student', 'Other']),
  numberOfPassengers: z.coerce.number().min(10, 'Group must have at least 10 passengers.'),
  itinerary: z.array(flightSegmentSchema).min(1, 'At least one flight segment is required.'),
  remarks: z.string().optional(),
});

type GroupRequestForm = z.infer<typeof groupRequestSchema>;

type GroupOffer = {
    itinerary: {
        origin: string;
        destination: string;
        departureDate: string;
        flightNo: string;
    }[];
    totalPrice: number;
    pricePerPassenger: number;
}

const offerLifecycleSteps = [
    { status: 'Draft', label: 'Draft', description: 'Group request details are being entered.' },
    { status: 'Requested', label: 'Requested', description: 'Group request sent to pricing engine.' },
    { status: 'Priced', label: 'Offer Priced', description: 'A group offer has been received.' },
    { status: 'Confirmed', label: 'Order Confirmed', description: 'The group offer has been accepted and converted to an order.' },
];

export default function GroupComposerPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [offer, setOffer] = useState<GroupOffer | null>(null);
    const [status, setStatus] = useState<typeof offerLifecycleSteps[number]['status']>('Draft');
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<GroupRequestForm>({
        resolver: zodResolver(groupRequestSchema),
        defaultValues: {
            groupName: '',
            groupType: 'Leisure',
            numberOfPassengers: 10,
            itinerary: [{
                origin: 'JFK',
                destination: 'LAX',
                departureDate: new Date(),
            }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'itinerary',
    });

    function onSubmit(data: GroupRequestForm) {
        setIsLoading(true);
        setOffer(null);
        setStatus('Requested');
        toast({ title: 'Finding group availability...', description: 'Please wait while we process your request.' });
        
        setTimeout(() => {
            const pricePerPassenger = 350 + Math.random() * 100;
            const newOffer: GroupOffer = {
                itinerary: data.itinerary.map(leg => ({
                    ...leg,
                    departureDate: format(leg.departureDate, 'yyyy-MM-dd'),
                    flightNo: `AC${Math.floor(100 + Math.random() * 899)}`,
                })),
                pricePerPassenger: pricePerPassenger,
                totalPrice: pricePerPassenger * data.numberOfPassengers,
            };
            setOffer(newOffer);
            setStatus('Priced');
            setIsLoading(false);
            toast({ title: 'Group offer received!', description: 'Review the details and confirm your booking.' });
        }, 2000);
    }
    
    function handleCreateOrder() {
        if (!offer) return;
        setStatus('Confirmed');

        const newOrder = {
            id: `GRP_${Math.floor(10000 + Math.random() * 90000)}`,
            groupName: form.getValues('groupName'),
            totalPassengers: form.getValues('numberOfPassengers'),
            status: 'Pending Approval',
            leadPassenger: 'TBD',
            paymentTerms: 'Deposit + Balance',
            fareType: 'Negotiated',
        };
        sessionStorage.setItem('newly_created_group_order', JSON.stringify(newOrder));

        toast({
            title: 'Group Booking Confirmed!',
            description: `Order ${newOrder.id} is being processed. You will be redirected.`,
        });
        setTimeout(() => router.push('/orders/group-dashboard'), 1000);
    }
    
    const currentStatusIndex = offerLifecycleSteps.findIndex(step => step.status === status);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Group Composer</h1>
                <p className="text-muted-foreground">
                    Create and price group travel requests.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Group Request</CardTitle>
                            <CardDescription>Enter the details for your group travel request.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="groupName" render={({ field }) => (<FormItem><FormLabel>Group Name</FormLabel><FormControl><Input placeholder="e.g., Annual Sales Conference" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                        <FormField control={form.control} name="groupType" render={({ field }) => (<FormItem><FormLabel>Group Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select group type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Leisure">Leisure</SelectItem><SelectItem value="Corporate">Corporate</SelectItem><SelectItem value="Student">Student</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                                    </div>
                                    <FormField control={form.control} name="numberOfPassengers" render={({ field }) => (<FormItem><FormLabel>Number of Passengers</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                    
                                    <Separator />
                                    
                                    <FormLabel>Itinerary</FormLabel>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-end gap-2 p-3 border rounded-lg relative">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                                                <FormField control={form.control} name={`itinerary.${index}.origin`} render={({ field }) => (<FormItem><FormLabel>Origin</FormLabel><FormControl><Input placeholder="JFK" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                                <FormField control={form.control} name={`itinerary.${index}.destination`} render={({ field }) => (<FormItem><FormLabel>Destination</FormLabel><FormControl><Input placeholder="LAX" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                                <FormField control={form.control} name={`itinerary.${index}.departureDate`} render={({ field }) => (<FormItem><FormLabel>Departure</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => remove(index)} disabled={fields.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => append({ origin: '', destination: '', departureDate: new Date() })}><PlusCircle className="mr-2 h-4 w-4" />Add Flight Leg</Button>
                                    
                                    <Separator />
                                    <FormField control={form.control} name="remarks" render={({ field }) => (<FormItem><FormLabel>Remarks (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., All passengers require vegetarian meals. Group is carrying sports equipment." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                    
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}Find Group Availability</Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {isLoading && (
                        <Card>
                            <CardHeader><CardTitle>Group Offer</CardTitle><CardDescription>Searching for the best available options for your group...</CardDescription></CardHeader>
                            <CardContent className="text-center py-12 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                <p>Processing Request</p>
                            </CardContent>
                        </Card>
                    )}

                    {offer && !isLoading && (
                         <Card>
                            <CardHeader><CardTitle>Group Offer</CardTitle><CardDescription>Review the generated offer for your group.</CardDescription></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {offer.itinerary.map((leg, index) => (
                                        <div key={index} className="p-3 border rounded-lg">
                                            <p className="font-semibold">{leg.origin} to {leg.destination}</p>
                                            <p className="text-sm text-muted-foreground">Date: {leg.departureDate}, Flight: {leg.flightNo}</p>
                                        </div>
                                    ))}
                                    <Separator />
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Total Price:</span>
                                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(offer.totalPrice)}</span>
                                    </div>
                                    <div className="text-right text-sm text-muted-foreground">
                                        ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(offer.pricePerPassenger)} per passenger)
                                    </div>
                                </div>
                            </CardContent>
                         </Card>
                    )}
                </div>

                <div className="space-y-6">
                     <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Workflow className="h-5 w-5" />
                            <CardTitle>Request Lifecycle</CardTitle>
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
                    
                    {offer && (
                         <Card>
                            <CardHeader className="flex flex-row items-center gap-2">
                                <ShoppingBasket className="h-5 w-5" />
                                <CardTitle>Confirm Booking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">Accepting this offer will create a group order. Further details like passenger names and payments can be managed from the Group Dashboard.</p>
                                <Button className="w-full" onClick={handleCreateOrder} disabled={status !== 'Priced'}>
                                    Confirm and Create Group Order
                                </Button>
                                <pre className="p-2 mt-4 bg-secondary rounded-md text-xs text-secondary-foreground overflow-x-auto max-h-64">
                                {JSON.stringify(offer, null, 2)}
                                </pre>
                                <Button className="w-full mt-2" variant="secondary" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(offer, null, 2));
                                    toast({ title: "Payload Copied", description: "Offer JSON has been copied to clipboard." });
                                }}>
                                    <FileJson className="mr-2 h-4 w-4" />
                                    Copy Offer JSON
                                </Button>
                            </CardContent>
                         </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
