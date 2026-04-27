'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

type Availability = {
    class: string;
    count: number | string;
};

type FlightAvailabilityResult = {
    flight: string;
    date: string;
    availability: Availability[];
}

const mockAvailability: FlightAvailabilityResult = {
    flight: '6E-6045',
    date: '2025-11-15',
    availability: [
        { class: 'J', count: 9 }, { class: 'C', count: 9 }, { class: 'D', count: 9 }, { class: 'Z', count: 7 }, { class: 'P', count: 0 },
        { class: 'Y', count: 9 }, { class: 'B', count: 9 }, { class: 'M', count: 9 }, { class: 'U', count: 9 }, { class: 'H', count: 5 },
        { class: 'Q', count: 2 }, { class: 'V', count: 0 }, { class: 'W', count: 0 }, { class: 'S', count: 0 }, { class: 'T', count: 0 },
        { class: 'L', count: 0 }, { class: 'K', count: 0 }, { class: 'G', count: 'A' },
    ]
}

export function FlightAvailability() {
    const [flightNumber, setFlightNumber] = useState('6E-6045');
    const [date, setDate] = useState('2025-11-15');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<FlightAvailabilityResult | null>(null);
    const { toast } = useToast();

    const handleSearch = () => {
        if (!flightNumber || !date) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please enter both flight number and date.' });
            return;
        }
        setIsLoading(true);
        setResult(null);
        setTimeout(() => {
            setResult(mockAvailability);
            setIsLoading(false);
        }, 1000);
    }
    
    const getAvailabilityColor = (count: number | string) => {
        if (count === 'A' || (typeof count === 'number' && count >= 9)) return 'bg-green-200 text-green-800';
        if (typeof count === 'number' && count >= 4 && count <= 8) return 'bg-yellow-200 text-yellow-800';
        if (typeof count === 'number' && count >= 1 && count <= 3) return 'bg-orange-200 text-orange-800';
        return 'bg-red-200 text-red-800';
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Flight Availability</CardTitle>
                <CardDescription>
                    View a live snapshot of inventory availability for a specific flight.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex w-full max-w-lg items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Flight Number (e.g., AC101)"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                    />
                     <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <Button type="submit" onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        Search
                    </Button>
                </div>

                {isLoading && (
                    <div className="mt-6 text-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p>Loading availability...</p>
                    </div>
                )}
                
                {result && (
                    <div className="mt-6 p-4 border rounded-lg">
                        <h3 className="font-semibold mb-4">Availability for {result.flight} on {result.date}</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.availability.map(item => (
                                <div key={item.class} className="flex items-center gap-1 font-mono text-sm">
                                    <Badge variant="outline">{item.class}</Badge>
                                    <span className={`w-6 h-6 flex items-center justify-center rounded ${getAvailabilityColor(item.count)}`}>
                                        {item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                         <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-green-200"></div> 9+ Seats (A)</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-yellow-200"></div> 4-8 Seats</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-orange-200"></div> 1-3 Seats</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-red-200"></div> 0 Seats (L)</div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
