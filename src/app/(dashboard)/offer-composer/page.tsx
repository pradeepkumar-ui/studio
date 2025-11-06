'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, PlaneTakeoff, PlaneLanding, Users, Search } from 'lucide-react';

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

const offerSearchSchema = z.object({
  origin: z.string().length(3, 'Origin must be a 3-letter IATA code.'),
  destination: z.string().length(3, 'Destination must be a 3-letter IATA code.'),
  departureDate: z.date({
    required_error: 'A departure date is required.',
  }),
  returnDate: z.date().optional(),
  passengers: z.string().min(1),
});

export default function OfferComposerPage() {
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof offerSearchSchema>>({
    resolver: zodResolver(offerSearchSchema),
    defaultValues: {
      origin: '',
      destination: '',
      passengers: '1',
    },
  });

  function onSubmit(data: z.infer<typeof offerSearchSchema>) {
    setIsLoading(true);
    toast({
      title: 'Searching for offers...',
      description: 'Composing and pricing solutions based on your request.',
    });
    
    // Simulate API call
    setTimeout(() => {
        setSearchResults([]);
        setIsLoading(false);
        toast({
            title: 'Search complete!',
            description: 'No offers found for the selected criteria.',
          });
    }, 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Offer Composer</h1>
        <p className="text-muted-foreground">
          Compose NDC-compatible offers by discovering and pricing solutions and ancillaries.
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Flight Search</CardTitle>
            <CardDescription>Find flights to begin composing an offer.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin</FormLabel>
                      <div className="relative">
                        <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="e.g., JFK" {...field} className="pl-9" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                       <div className="relative">
                        <PlaneLanding className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="e.g., LAX" {...field} className="pl-9" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Departure Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0,0,0,0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="passengers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passengers</FormLabel>
                      <div className="relative">
                         <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="pl-9">
                                <SelectValue placeholder="Select number of passengers" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {[...Array(8)].map((_, i) => (
                                    <SelectItem key={i+1} value={String(i + 1)}>{i + 1} Passenger{i > 0 ? 's' : ''}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        <Search className="mr-2 h-4 w-4" /> Search
                    </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {searchResults && (
         <Card>
            <CardHeader>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>The best offers based on your search criteria.</CardDescription>
            </CardHeader>
            <CardContent>
                {searchResults.length === 0 ? (
                     <div className="text-center py-12 text-muted-foreground">
                        <p>No offers found for the selected criteria.</p>
                        <p className="text-sm">Try adjusting your search parameters.</p>
                    </div>
                ) : (
                    <div>{/* Offer results will be rendered here */}</div>
                )}
            </CardContent>
         </Card>
      )}

    </div>
  );
}
