'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

type EligibilityResult = {
    status: 'Eligible' | 'Not Eligible' | 'Not Found';
    waiverId: string | null;
    waiverName: string | null;
    reason: string;
}

export function EligibilityChecker() {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!identifier) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a Passenger or Order ID.' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      const upperId = identifier.toUpperCase();
      if (upperId === 'ORD_7D91' || upperId === 'JSMITH') {
        setResult({
            status: 'Eligible',
            waiverId: 'WX-2025-DEL',
            waiverName: 'Storm DEL',
            reason: 'Passenger is on a flight affected by the disruption event.'
        });
      } else if (upperId === 'ORD_7D92' || upperId === 'JDOE') {
        setResult({
            status: 'Not Eligible',
            waiverId: null,
            waiverName: null,
            reason: 'Passenger itinerary is not affected by any active disruption events.'
        });
      } else {
        setResult({
            status: 'Not Found',
            waiverId: null,
            waiverName: null,
            reason: 'The provided identifier was not found in our system.'
        })
      }
      setIsLoading(false);
    }, 1500);
  };

  const getAlertVariant = (status: EligibilityResult['status']) => {
    switch(status) {
        case 'Eligible': return 'default';
        case 'Not Eligible': return 'destructive';
        case 'Not Found': return 'destructive';
        default: return 'default'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eligibility Checker</CardTitle>
        <CardDescription>
          Search for a passenger or order to check waiver applicability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full max-w-md items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter PNR, Order ID, or Passenger Name"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <Button type="submit" onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Check
          </Button>
        </div>

        {result && (
            <Alert variant={getAlertVariant(result.status)} className="mt-6">
                <AlertTitle>
                    {result.status === 'Eligible' && `Eligible for Waiver: ${result.waiverName} (${result.waiverId})`}
                    {result.status === 'Not Eligible' && 'Not Eligible for Waiver'}
                    {result.status === 'Not Found' && 'Identifier Not Found'}
                </AlertTitle>
                <AlertDescription>
                    {result.reason}
                </AlertDescription>
            </Alert>
        )}
         {isLoading && (
            <div className="mt-6 text-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p>Checking eligibility...</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
