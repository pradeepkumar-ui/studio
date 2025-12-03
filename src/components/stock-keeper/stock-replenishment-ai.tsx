
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
import { Loader2, Wand2, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type Recommendation = {
  id: string;
  sku: string;
  reason: string;
  recommendation: string;
};

const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-01',
    sku: 'SEAT_KIT_01',
    reason: 'High consumption rate over last 7 days.',
    recommendation: 'Replenish 100 units.',
  },
  {
    id: 'rec-02',
    sku: 'LOUNGE_LHR_01',
    reason: 'Increased demand forecasted for next month.',
    recommendation: 'Increase stock level by 50 units.',
  },
  {
    id: 'rec-03',
    sku: 'MEAL_KSML_01',
    reason: 'Consistently low stock with steady demand.',
    recommendation: 'Replenish 20 units and increase threshold.',
  },
];

export function StockReplenishmentAI() {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchRecommendations = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 1500);
  };

  const handleDecision = (id: string, decision: 'approved' | 'dismissed') => {
    setRecommendations(prev => prev!.filter(rec => rec.id !== id));
    toast({
      title: `Recommendation ${decision}`,
      description: 'The recommendation has been processed.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Replenishment Advisor</CardTitle>
        <CardDescription>
          Get AI-powered recommendations for stock replenishment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground text-sm mt-2">Analyzing stock data...</p>
          </div>
        ) : recommendations ? (
          <div className="space-y-4">
            {recommendations.map(rec => (
              <div key={rec.id} className="p-3 border rounded-lg">
                <div className="font-semibold font-mono text-sm">{rec.sku}</div>
                <p className="text-xs text-muted-foreground italic">"{rec.reason}"</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge>{rec.recommendation}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDecision(rec.id, 'dismissed')}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600" onClick={() => handleDecision(rec.id, 'approved')}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Button onClick={handleFetchRecommendations} className="w-full">
            <Wand2 className="mr-2" />
            Get Recommendations
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
