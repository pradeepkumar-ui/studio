
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
import { Check, X, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type Recommendation = {
    id: string;
    strategy: string;
    scope: string;
    proposed_delta: string;
    expected_uplift: string;
    guardrails_check: 'pass' | 'fail';
    explain: string;
    mode: 'approval_required' | 'auto';
};

const initialRecommendations: Recommendation[] = [
    {
        id: 'rec_78ab',
        strategy: 'Micro-adjust Price',
        scope: 'IN/Direct/Flex on weekends',
        proposed_delta: '-1.2% Price',
        expected_uplift: '+1.8% Conversion',
        guardrails_check: 'pass',
        explain: 'Elasticity band [-1.5%, -0.5%] for this cohort indicates high conversion lift potential.',
        mode: 'approval_required',
    },
    {
        id: 'rec_92cd',
        strategy: 'Extend TTL',
        scope: 'TMC Channel, AE market',
        proposed_delta: 'TTL 60m → 90m',
        expected_uplift: '-4% Expiry Rate',
        guardrails_check: 'pass',
        explain: 'Time-to-conversion analysis shows TMCs in this market require longer decision windows.',
        mode: 'approval_required',
    },
    {
        id: 'rec_34ef',
        strategy: 'Re-rank Ancillaries',
        scope: 'Family Cohort, Mobile',
        proposed_delta: 'Promote Seat+Bag Bundle',
        expected_uplift: '+5.2% Ancillary Attach',
        guardrails_check: 'pass',
        explain: 'Association rules show high co-occurrence of these items for the family cohort.',
        mode: 'auto',
    },
];

export function RecommendationsQueue() {
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const { toast } = useToast();

  const handleDecision = (id: string, decision: 'approved' | 'rejected') => {
    setRecommendations(recommendations.filter(rec => rec.id !== id));
    toast({
        title: `Recommendation ${decision}`,
        description: `The optimisation proposal has been ${decision}.`
    });
  }

  if (recommendations.length === 0) {
    return (
        <Card>
            <CardHeader>
              <CardTitle>Recommendations Queue</CardTitle>
              <CardDescription>
                A list of proposed optimisation actions pending review.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                    <p>No recommendations pending approval.</p>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations Queue</CardTitle>
        <CardDescription>
          A list of proposed optimisation actions pending review and approval.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
            <Card key={rec.id} className="p-4 flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                        <h4 className="font-semibold text-lg">{rec.strategy}</h4>
                         <Badge variant={rec.mode === 'auto' ? 'secondary' : 'default'}>{rec.mode === 'auto' ? 'Auto-Applied' : 'Approval Required'}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Scope:</span> {rec.scope}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Proposal:</span> {rec.proposed_delta} → <span className="font-medium text-green-600">{rec.expected_uplift}</span>
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                        {rec.explain}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2 text-sm">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span>Guardrails: Pass</span>
                    </div>
                    {rec.mode === 'approval_required' && (
                        <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => handleDecision(rec.id, 'rejected')}>
                                <X className="mr-2 h-4 w-4"/> Reject
                            </Button>
                            <Button size="sm" onClick={() => handleDecision(rec.id, 'approved')}>
                                <Check className="mr-2 h-4 w-4"/> Approve
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        ))}
      </CardContent>
    </Card>
  );
}
