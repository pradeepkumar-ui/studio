
'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  MoreHorizontal, 
  PlusCircle, 
  Loader2, 
  Search, 
  Package, 
  Tag, 
  TrendingUp, 
  ShieldCheck, 
  Users,
  Trash2,
  Edit,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { OfferStrategyForm, type OfferStrategy } from '@/components/pricing/offer-strategy-form';
import { cn } from '@/lib/utils';

export default function AirlineOffersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  // Memoize queries to prevent infinite loops
  const offersQuery = useMemo(() => 
    firestore ? query(collection(firestore, 'offers'), orderBy('createdAt', 'desc')) : undefined
  , [firestore]);
  
  const { data: offers, loading } = useCollection(offersQuery);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferStrategy | null>(null);

  const filteredOffers = useMemo(() => {
    if (!offers) return [];
    return (offers as OfferStrategy[]).filter(o => 
      o.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [offers, searchTerm]);

  const handleOpenDialog = (offer: OfferStrategy | null = null) => {
    setEditingOffer(offer);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: OfferStrategy) => {
    if (!firestore) return;
    try {
      if (editingOffer?.id) {
        const ref = doc(firestore, 'offers', editingOffer.id);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        toast({ title: 'Strategy Updated', description: `Successfully updated ${data.name}.` });
      } else {
        await addDoc(collection(firestore, 'offers'), { 
          ...data, 
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp() 
        });
        toast({ title: 'Strategy Created', description: `New retailing offer ${data.name} is now live.` });
      }
      setIsDialogOpen(false);
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'offers', id));
      toast({ title: 'Strategy Removed', variant: 'destructive' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Delete Failed', description: e.message });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-primary">Airline Offers Cockpit</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Unified Carrier Retailing & Dynamic Pricing</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold shadow-lg">
          <PlusCircle className="mr-2 h-4 w-4" /> Create Offer Strategy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Offers', value: filteredOffers.filter(o => o.status === 'Active').length, icon: Tag, color: 'text-primary' },
          { label: 'Dynamic Rules', value: filteredOffers.filter(o => o.dynamicPricing?.enabled).length, icon: Zap, color: 'text-amber-500' },
          { label: 'Cohort Targets', value: filteredOffers.filter(o => o.cohortIds && o.cohortIds.length > 0).length, icon: Users, color: 'text-blue-600' },
          { label: 'Sync Health', value: 'Live', icon: ShieldCheck, color: 'text-emerald-500' }
        ].map((kpi) => (
          <Card key={kpi.label} className="p-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.label}</p>
              <kpi.icon className={cn("h-4 w-4", kpi.color)} />
            </div>
            <p className="text-2xl font-black">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-primary/10 overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search strategies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow>
                  <TableHead className="text-[10px] uppercase font-black">Strategy Identity</TableHead>
                  <TableHead className="text-[10px] uppercase font-black">Composition</TableHead>
                  <TableHead className="text-[10px] uppercase font-black">Pricing Layer</TableHead>
                  <TableHead className="text-[10px] uppercase font-black">Targeting</TableHead>
                  <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.map((offer) => (
                  <TableRow key={offer.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                          {offer.type === 'Bundle' ? <Package className="h-4 w-4 text-primary" /> : <Tag className="h-4 w-4 text-primary" />}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{offer.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">ID: {offer.id?.slice(0, 8)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {offer.type} • {offer.ancillaryIds?.length || 1} SKUs
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="text-xs font-black text-primary">
                          {offer.pricing.type === 'PercentageDiscount' ? `${offer.pricing.value}% OFF` : 
                           offer.pricing.type === 'FixedDiscount' ? `$${offer.pricing.value} OFF` : 
                           `FIXED: $${offer.pricing.value}`}
                        </div>
                        {offer.dynamicPricing?.enabled && (
                          <div className="flex items-center gap-1 text-[9px] text-amber-600 font-black uppercase">
                            <Zap className="h-2.5 w-2.5" /> Dynamic Adjustment Active
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {offer.cohortIds?.length ? offer.cohortIds.map(c => (
                          <Badge key={c} variant="secondary" className="text-[9px] px-1.5 font-mono">{c}</Badge>
                        )) : <span className="text-[10px] text-muted-foreground italic">Global Access</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={offer.status === 'Active' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase tracking-wider">
                        {offer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground">Operations</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog(offer)}><Edit className="mr-2 h-4 w-4"/>Modify Strategy</DropdownMenuItem>
                          <DropdownMenuItem><Zap className="mr-2 h-4 w-4"/>Simulate Execution</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(offer.id!)}><Trash2 className="mr-2 h-4 w-4"/>Archive Offer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOffers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">No offer strategies configured.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl">
          <OfferStrategyForm 
            offer={editingOffer} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
