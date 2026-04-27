// 'use client';

// import Link from 'next/link';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   User,
//   CreditCard,
//   Plane,
//   Plus,
//   Luggage,
//   Utensils,
//   GitCommitHorizontal,
//   CheckCircle,
//   Archive,
//   History,
//   FileEdit,
//   Trash2,
//   Ticket,
//   Building,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { useToast } from '@/hooks/use-toast';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '../ui/alert-dialog';

// export type OrderDetails = {
//     id: string;
//     customer: string;
//     email: string;
//     status: 'Fulfilled' | 'Pending' | 'Canceled' | 'Partially Fulfilled';
//     date: string;
//     amount: number;
//     currency: string;
//     payment: {
//         method: string;
//         last4: string;
//         status: string;
//     };
//     services: Array<{
//         id: string;
//         type: string;
//         description: string;
//         status: string;
//         price: number;
//     }>;
//     auditTrail: Array<{
//         version: number;
//         actor: string;
//         event: string;
//         timestamp: string;
//     }>;
// };

// const getStatusBadgeVariant = (status: OrderDetails['status']) => {
//   switch (status) {
//     case 'Fulfilled': return 'default';
//     case 'Pending': return 'secondary';
//     case 'Canceled': return 'destructive';
//     case 'Partially Fulfilled': return 'outline';
//     default: return 'outline';
//   }
// };

// const getServiceIcon = (type: string) => {
//     switch (type) {
//         case 'Flight': return <Plane className="h-4 w-4 text-muted-foreground" />;
//         case 'Baggage': return <Luggage className="h-4 w-4 text-muted-foreground" />;
//         case 'Seat': return <Ticket className="h-4 w-4 text-muted-foreground" />;
//         case 'Meal': return <Utensils className="h-4 w-4 text-muted-foreground" />;
//         case 'Supplier Service': return <Building className="h-4 w-4 text-muted-foreground" />;
//         default: return <Plus className="h-4 w-4 text-muted-foreground" />;
//     }
// }

// const getAuditIcon = (event: string) => {
//     if (event.includes('Created')) return <GitCommitHorizontal className="h-5 w-5 text-secondary-foreground" />;
//     if (event.includes('Added')) return <Plus className="h-5 w-5 text-secondary-foreground" />;
//     if (event.includes('Confirmed')) return <CheckCircle className="h-5 w-5 text-secondary-foreground" />;
//     if (event.includes('fulfilled')) return <Archive className="h-5 w-5 text-secondary-foreground" />;
//     if (event.includes('Upgraded')) return <CheckCircle className="h-5 w-5 text-secondary-foreground" />;
//     return <History className="h-5 w-5 text-secondary-foreground" />;
// }

// export function OrderDetailsView({ order }: { order: OrderDetails }) {
//     const { toast } = useToast();

//     const handleAction = (action: string, serviceId?: string) => {
//         toast({
//             title: 'Action Triggered',
//             description: `${action} on service ${serviceId} is not yet implemented.`,
//         });
//     };
    
//     const handleAddService = () => {
//          toast({
//             title: 'Navigating to Offer Composer',
//             description: `A real implementation would link to the Offer Composer to add new services to order ${order.id}.`,
//         });
//     }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//         <div className="lg:col-span-2 flex flex-col gap-6">
//             <Card>
//                 <CardHeader className="flex flex-row items-center justify-between">
//                     <CardTitle>Services ({order.services.length})</CardTitle>
//                     <div className="flex gap-2">
//                         <Button variant="outline" size="sm" onClick={handleAddService}><Plus className="mr-2 h-4 w-4"/>Add Service</Button>
//                     </div>
//                 </CardHeader>
//                 <CardContent>
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Service</TableHead>
//                                 <TableHead>Details</TableHead>
//                                 <TableHead>Status</TableHead>
//                                 <TableHead className="text-right">Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {order.services.map(service => (
//                                 <TableRow key={service.id}>
//                                     <TableCell className="font-medium flex items-center gap-2">
//                                         {getServiceIcon(service.type)}
//                                         {service.type}
//                                     </TableCell>
//                                     <TableCell>{service.description}</TableCell>
//                                     <TableCell><Badge variant="secondary">{service.status}</Badge></TableCell>
//                                     <TableCell className="text-right">
//                                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAction('Edit', service.id)}>
//                                             <FileEdit className="h-4 w-4"/>
//                                         </Button>
//                                         <AlertDialog>
//                                             <AlertDialogTrigger asChild>
//                                                 <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
//                                                     <Trash2 className="h-4 w-4"/>
//                                                 </Button>
//                                             </AlertDialogTrigger>
//                                             <AlertDialogContent>
//                                                 <AlertDialogHeader>
//                                                 <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                                                 <AlertDialogDescription>
//                                                     This action cannot be undone. This will permanently remove the service
//                                                     from the order and may require a refund.
//                                                 </AlertDialogDescription>
//                                                 </AlertDialogHeader>
//                                                 <AlertDialogFooter>
//                                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                                 <AlertDialogAction onClick={() => handleAction('Delete', service.id)}>Continue</AlertDialogAction>
//                                                 </AlertDialogFooter>
//                                             </AlertDialogContent>
//                                         </AlertDialog>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </CardContent>
//             </Card>

//              <Card>
//                 <CardHeader>
//                     <div className="flex items-center gap-2">
//                         <History className="h-5 w-5" />
//                         <CardTitle>Audit Timeline</CardTitle>
//                     </div>
//                     <CardDescription>Chronological history of all actions and events for this order.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="relative pl-6 space-y-6 border-l-2 border-border">
//                         {order.auditTrail.map((event, index) => (
//                             <div key={index} className="relative">
//                                 <div className="absolute -left-[2.0rem] top-0 flex items-center justify-center w-14 h-14 bg-background rounded-full">
//                                     <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-secondary">
//                                     {getAuditIcon(event.event)}
//                                     </div>
//                                 </div>
//                                 <div className="pl-6">
//                                     <p className="font-semibold text-md">{event.event}</p>
//                                     <p className="text-sm text-muted-foreground">by {event.actor} (v{event.version})</p>
//                                     <p className="text-xs text-muted-foreground mt-1">{new Date(event.timestamp).toUTCString()}</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </CardContent>
//             </Card>

//         </div>
//         <div className="flex flex-col gap-6">
//             <Card>
//                 <CardHeader>
//                     <div className="flex items-center gap-2">
//                         <User className="h-5 w-5" />
//                         <CardTitle>Customer</CardTitle>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="space-y-1 text-sm">
//                     <p className="font-semibold">{order.customer}</p>
//                     <p className="text-muted-foreground">{order.email}</p>
//                 </CardContent>
//             </Card>
//              <Card>
//                 <CardHeader>
//                     <div className="flex items-center gap-2">
//                         <CreditCard className="h-5 w-5" />
//                         <CardTitle>Payment</CardTitle>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                      <div className="flex justify-between items-center text-sm">
//                         <span className="text-muted-foreground">Total Amount</span>
//                         <span className="font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency }).format(order.amount)}</span>
//                      </div>
//                      <Separator />
//                      <div className="flex justify-between items-center text-sm">
//                         <span className="text-muted-foreground">Method</span>
//                         <span className="font-medium">{order.payment.method} ending in {order.payment.last4}</span>
//                      </div>
//                      <div className="flex justify-between items-center text-sm">
//                         <span className="text-muted-foreground">Status</span>
//                         <Badge variant={order.payment.status === 'Paid' ? 'default' : 'secondary'}>{order.payment.status}</Badge>
//                      </div>
//                       <div className="pt-2">
//                          <Button variant="outline" size="sm" className="w-full" onClick={() => handleAction('Manage Payment')}>Manage Payment / Refund</Button>
//                       </div>
//                 </CardContent>
//             </Card>
//         </div>
//       </div>
//   )
// }
'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  FilePenLine,
  XCircle,
  User,
  CreditCard,
  Plane,
  Plus,
  Luggage,
  Utensils,
  GitCommitHorizontal,
  CheckCircle,
  Archive,
  History,
  FileEdit,
  Trash2,
  Ticket,
  Building,
  Coffee,
  Zap,
  ChevronRight,
  Tag,
  IndianRupee,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Suspense } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AncillaryItem = {
  offerId: string;
  label: string;
  includes: string[];
  basePrice: number;
  discount: number;
  finalPrice: number;
  status: string;
};

type OrderData = {
  id: string;
  airline: string;
  airlineCode: string;
  status: string;
  currency: string;
  passenger: {
    name: string;
    type: string;
  };
  flight: {
    flightNumber: string;
    route: string;
    origin: string;
    destination: string;
    cabin: string;
    fare: number;
  };
  airlineAncillaries: AncillaryItem[];
  airportServices: AncillaryItem[];
  thirdPartyServices: AncillaryItem[];
  payment: {
    method: string;
    last4: string;
    status: string;
  };
  auditTrail: Array<{
    version: number;
    actor: string;
    event: string;
    timestamp: string;
  }>;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockOrder: OrderData = {
  id: 'ORD-IND-01',
  airline: 'IndiGo',
  airlineCode: '6E',
  status: 'Confirmed',
  currency: 'INR',
  passenger: {
    name: 'Rahul Sharma',
    type: 'Adult',
  },
  flight: {
    flightNumber: '6E 1745',
    route: 'BOM → SIN',
    origin: 'Mumbai (BOM)',
    destination: 'Singapore (SIN)',
    cabin: 'Economy',
    fare: 15000,
  },
  airlineAncillaries: [
    {
      offerId: 'ABO1',
      label: 'Seat + Baggage Bundle',
      includes: ['Seat Selection', '10kg Extra Baggage'],
      basePrice: 2000,
      discount: 300,
      finalPrice: 1700,
      status: 'Confirmed',
    },
  ],
  airportServices: [
    {
      offerId: 'APBO1',
      label: 'Lounge + Fast Track',
      includes: ['Lounge Access', 'Fast Track Security'],
      basePrice: 2500,
      discount: 375,
      finalPrice: 2125,
      status: 'Confirmed',
    },
  ],
  thirdPartyServices: [],
  payment: {
    method: 'Credit Card',
    last4: '0042',
    status: 'Paid',
  },
  auditTrail: [
    { version: 1, actor: 'System (Offer Conversion)', event: 'Order Created', timestamp: '2024-07-15T10:30:00Z' },
    { version: 2, actor: 'System (Ancillary Engine)', event: 'Ancillary Bundle ABO1 Added', timestamp: '2024-07-15T10:31:00Z' },
    { version: 3, actor: 'System (Airport Services)', event: 'Airport Bundle APBO1 Added', timestamp: '2024-07-15T10:32:00Z' },
    { version: 4, actor: 'System (Payment Gateway)', event: 'Payment Confirmed', timestamp: '2024-07-15T10:33:45Z' },
    { version: 5, actor: 'System (Fulfilment)', event: 'All services fulfilled', timestamp: '2024-07-15T11:00:00Z' },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INR = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const getAuditIcon = (event: string) => {
  if (event.includes('Created')) return <GitCommitHorizontal className="h-5 w-5 text-secondary-foreground" />;
  if (event.includes('Added')) return <Plus className="h-5 w-5 text-secondary-foreground" />;
  if (event.includes('Confirmed')) return <CheckCircle className="h-5 w-5 text-secondary-foreground" />;
  if (event.includes('fulfilled')) return <Archive className="h-5 w-5 text-secondary-foreground" />;
  return <History className="h-5 w-5 text-secondary-foreground" />;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  accent: string;
}) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg mb-3 ${accent}`}>
      {icon}
      <span className="font-bold text-sm tracking-wide uppercase">{title}</span>
    </div>
  );
}

function AncillaryCard({
  item,
  onEdit,
  onDelete,
}: {
  item: AncillaryItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-[10px] font-mono text-muted-foreground">Offer ID: {item.offerId}</span>
            <Badge variant="secondary" className="text-[9px] h-4">{item.status}</Badge>
          </div>
          <p className="font-semibold text-sm mb-2">{item.label}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.includes.map((inc) => (
              <span
                key={inc}
                className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border"
              >
                {inc}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Base:</span>
              <span className="font-medium line-through">{INR(item.basePrice)}</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <span>Discount:</span>
              <span className="font-semibold">-{INR(item.discount)}</span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <span className="font-bold text-sm">{INR(item.finalPrice)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
            <FileEdit className="h-3.5 w-3.5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove this service?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove <strong>{item.label}</strong> from the order and may require a refund.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Remove</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function OrderDetailsView() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const orderId = (params?.id as string) ?? mockOrder.id;
  const order = mockOrder;

  const handleReshop = () => {
    sessionStorage.setItem('reshop_order_context', JSON.stringify(order));
    router.push('/offer-composer');
  };

  const handleCancel = () => {
    toast({
      title: 'Order Cancellation Initiated',
      description: `Cancellation process started for order ${order.id}.`,
      variant: 'destructive',
    });
  };

  const handleAction = (action: string, id?: string) => {
    toast({
      title: 'Action Triggered',
      description: `${action}${id ? ` on ${id}` : ''} — not yet implemented.`,
    });
  };

  const totalFlight = order.flight.fare;
  const totalAirlineAnc = order.airlineAncillaries.reduce((s, i) => s + i.finalPrice, 0);
  const totalAirportSvc = order.airportServices.reduce((s, i) => s + i.finalPrice, 0);
  const totalThirdParty = order.thirdPartyServices.reduce((s, i) => s + i.finalPrice, 0);
  const grandTotal = totalFlight + totalAirlineAnc + totalAirportSvc + totalThirdParty;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-6">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/orders">
                <ArrowLeft />
              </Link>
            </Button>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
                <Badge variant="outline" className="font-mono text-xs">{order.airlineCode}</Badge>
                <Badge
                  variant={order.status === 'Confirmed' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {order.status}
                </Badge>
              </div>
              <p className="text-muted-foreground font-mono text-sm">{orderId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReshop}>
              <FilePenLine className="mr-2 h-4 w-4" /> Reshop / Modify
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              <XCircle className="mr-2 h-4 w-4" /> Cancel Order
            </Button>
          </div>
        </div>

        {/* ── Main Layout ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT / MAIN COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* ── Flight (Core Product) ──────────────────────────────────── */}
            <Card>
              <CardHeader className="pb-3">
                <SectionHeader
                  icon={<Plane className="h-4 w-4 text-blue-600" />}
                  title="Flight — Core Product"
                  accent="bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                />
              </CardHeader>
              <CardContent>
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs">Flight</TableHead>
                        <TableHead className="text-xs">Route</TableHead>
                        <TableHead className="text-xs">Cabin</TableHead>
                        <TableHead className="text-xs text-right">Fare</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono font-bold text-sm">{order.flight.flightNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <span className="font-semibold">{order.flight.origin}</span>
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            <span className="font-semibold">{order.flight.destination}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{order.flight.cabin}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold font-mono">{INR(order.flight.fare)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* ── Airline Ancillaries ────────────────────────────────────── */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <SectionHeader
                    icon={<Luggage className="h-4 w-4 text-violet-600" />}
                    title="Airline Ancillaries"
                    accent="bg-violet-50 text-violet-800 dark:bg-violet-950 dark:text-violet-200"
                  />
                  <Button variant="outline" size="sm" className="-mt-1" onClick={() => handleAction('Add Airline Ancillary')}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Add
                  </Button>
                </div>
                <CardDescription className="text-xs -mt-1">
                  Seat selections, baggage, meals, and other airline-bundled services.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {order.airlineAncillaries.length > 0 ? (
                  order.airlineAncillaries.map((item) => (
                    <AncillaryCard
                      key={item.offerId}
                      item={item}
                      onEdit={() => handleAction('Edit', item.offerId)}
                      onDelete={() => handleAction('Delete', item.offerId)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No airline ancillaries added.</p>
                )}
              </CardContent>
            </Card>

            {/* ── Airport Ancillaries ────────────────────────────────────── */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <SectionHeader
                    icon={<Coffee className="h-4 w-4 text-amber-600" />}
                    title="Airport Services"
                    accent="bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                  />
                  <Button variant="outline" size="sm" className="-mt-1" onClick={() => handleAction('Add Airport Service')}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Add
                  </Button>
                </div>
                <CardDescription className="text-xs -mt-1">
                  Lounge access, fast track, meet &amp; assist, and airport-specific services.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {order.airportServices.length > 0 ? (
                  order.airportServices.map((item) => (
                    <AncillaryCard
                      key={item.offerId}
                      item={item}
                      onEdit={() => handleAction('Edit', item.offerId)}
                      onDelete={() => handleAction('Delete', item.offerId)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No airport services added.</p>
                )}
              </CardContent>
            </Card>

            {/* ── Third-party Services ──────────────────────────────────── */}
            {/* <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <SectionHeader
                    icon={<Building className="h-4 w-4 text-teal-600" />}
                    title="Third-party Services"
                    accent="bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200"
                  />
                  <Button variant="outline" size="sm" className="-mt-1" onClick={() => handleAction('Add Third-party Service')}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Add
                  </Button>
                </div>
                <CardDescription className="text-xs -mt-1">
                  Hotel stays, transfers, travel insurance, and external supplier services.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {order.thirdPartyServices.length > 0 ? (
                  order.thirdPartyServices.map((item) => (
                    <AncillaryCard
                      key={item.offerId}
                      item={item}
                      onEdit={() => handleAction('Edit', item.offerId)}
                      onDelete={() => handleAction('Delete', item.offerId)}
                    />
                  ))
                ) : (
                  <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 text-center">
                    <Building className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No third-party services added.</p>
                    <Button variant="outline" size="sm" onClick={() => handleAction('Add Third-party Service')}>
                      <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Transfer or Hotel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card> */}

            {/* ── Audit Timeline ─────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  <CardTitle>Audit Timeline</CardTitle>
                </div>
                <CardDescription>Chronological history of all actions and events for this order.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 space-y-6 border-l-2 border-border">
                  {order.auditTrail.map((event, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-[2.0rem] top-0 flex items-center justify-center w-14 h-14 bg-background rounded-full">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-secondary">
                          {getAuditIcon(event.event)}
                        </div>
                      </div>
                      <div className="pl-6">
                        <p className="font-semibold text-md">{event.event}</p>
                        <p className="text-sm text-muted-foreground">by {event.actor} (v{event.version})</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(event.timestamp).toUTCString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* ── Passenger ─────────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Passenger</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-semibold">{order.passenger.name}</p>
                <p className="text-muted-foreground">{order.passenger.type}</p>
                <div className="pt-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {order.airline} · {order.flight.flightNumber}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* ── Order Value Summary ───────────────────────────────────── */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5" />
                  <CardTitle>Order Value</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Plane className="h-3.5 w-3.5" /> Flight
                  </span>
                  <span className="font-mono font-medium">{INR(totalFlight)}</span>
                </div>
                {totalAirlineAnc > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Luggage className="h-3.5 w-3.5" /> Airline Ancillaries
                    </span>
                    <span className="font-mono font-medium">{INR(totalAirlineAnc)}</span>
                  </div>
                )}
                {totalAirportSvc > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Coffee className="h-3.5 w-3.5" /> Airport Services
                    </span>
                    <span className="font-mono font-medium">{INR(totalAirportSvc)}</span>
                  </div>
                )}
                {totalThirdParty > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Building className="h-3.5 w-3.5" /> Third-party Services
                    </span>
                    <span className="font-mono font-medium">{INR(totalThirdParty)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Paid</span>
                  <span className="font-black font-mono text-lg text-primary">{INR(grandTotal)}</span>
                </div>
              </CardContent>
            </Card>

            {/* ── Payment ───────────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <CardTitle>Payment</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">{order.payment.method} ···{order.payment.last4}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={order.payment.status === 'Paid' ? 'default' : 'secondary'}>
                    {order.payment.status}
                  </Badge>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleAction('Manage Payment')}>
                    Manage Payment / Refund
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Suspense>
  );
}