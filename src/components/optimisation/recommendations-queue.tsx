
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
import { Check, X, ShieldCheck, Eye, GitCommitHorizontal, Wand2, PlusCircle, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

type Recommendation = {
    id: string;
    type: 'OPTIMIZE_EXISTING' | 'CREATE_NEW';
    strategy: string;
    targetId: string;
    targetName: string;
    currentConfig?: string;
    proposedConfig: string;
    expected_uplift: string;
    guardrails_check: 'pass' | 'fail';
    explain: string;
    mode: 'approval_required' | 'auto';
};

const initialRecommendations: Recommendation[] = [
    {
        id: 'rec_78ab',
        type: 'OPTIMIZE_EXISTING',
        strategy: 'Micro-adjust Price',
        targetId: 'OFF-001',
        targetName: 'Winter Flash Sale',
        currentConfig: 'Discount: 10%, Scope: Market',
        proposedConfig: 'Discount: 11.5%, Scope: Market & Mobile Channel',
        expected_uplift: '+1.8% Conversion',
        guardrails_check: 'pass',
        explain: 'Elasticity band [-1.5%, -0.5%] for this cohort indicates high conversion lift potential. Mobile channel shows higher price sensitivity.',
        mode: 'approval_required',
    },
    {
        id: 'rec_a1b2',
        type: 'CREATE_NEW',
        strategy: 'Create Ancillary Bundle',
        targetId: 'NEW_BUNDLE',
        targetName: 'US Business Traveler Pack',
        proposedConfig: 'Components: Lounge Access, In-flight Wi-Fi, Priority Boarding. Price: $55 (25% discount)',
        expected_uplift: '+7.5% Ancillary Attach (US Corp)',
        guardrails_check: 'pass',
        explain: 'Identified an unserved need for corporate travelers on US domestic routes who frequently purchase these ancillaries separately. A bundle will increase attach rate and provide better value.',
        mode: 'approval_required',
    },
    {
        id: 'rec_92cd',
        type: 'OPTIMIZE_EXISTING',
        strategy: 'Extend TTL',
        targetId: 'OFF-007',
        targetName: 'Corporate Traveler Discount',
        currentConfig: 'TTL: 01:00:00',
        proposedConfig: 'TTL: 01:30:00',
        expected_uplift: '-4% Expiry Rate',
        guardrails_check: 'pass',
        explain: 'Time-to-conversion analysis shows TMCs require longer decision windows.',
        mode: 'auto',
    },
];

export function RecommendationsQueue() {
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const { toast } = useToast();

  const handleDecision = (id: string, decision: 'approved' | 'rejected') => {
    setRecommendations(recommendations.filter(rec => rec.id !== id));
    setSelectedRec(null);
    toast({
        title: `Recommendation ${decision}`,
        description: `The optimisation proposal has been ${decision}.`
    });
  }
  
  const handleViewDetails = (recommendation: Recommendation) => {
    setSelectedRec(recommendation);
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
    <>
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
                        <div className="flex items-center gap-2">
                            {rec.type === 'CREATE_NEW' ? <PlusCircle className="h-5 w-5 text-primary" /> : <Wand2 className="h-5 w-5 text-primary" />}
                             <h4 className="font-semibold text-lg">{rec.strategy}</h4>
                        </div>
                         <Badge variant={rec.mode === 'auto' ? 'secondary' : 'default'}>{rec.mode === 'auto' ? 'Auto-Applied' : 'Approval Required'}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                             {rec.type === 'CREATE_NEW' ? 'New Offer:' : 'Target:'}
                        </span> {rec.targetName} 
                        {rec.type === 'OPTIMIZE_EXISTING' && <span className="font-mono text-xs"> ({rec.targetId})</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Est. Impact:</span> <span className="font-medium text-green-600">{rec.expected_uplift}</span>
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2 text-sm">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span>Guardrails: Pass</span>
                    </div>
                    {rec.mode === 'approval_required' && (
                        <Button size="sm" variant="outline" onClick={() => handleViewDetails(rec)}>
                            <Eye className="mr-2 h-4 w-4"/> View Details
                        </Button>
                    )}
                </div>
            </Card>
        ))}
      </CardContent>
    </Card>

    <Dialog open={!!selectedRec} onOpenChange={(open) => !open && setSelectedRec(null)}>
        <DialogContent className="max-w-2xl">
            {selectedRec && (
                <>
                <DialogHeader>
                    <DialogTitle>{selectedRec.strategy}</DialogTitle>
                    <DialogDescription>
                        {selectedRec.type === 'CREATE_NEW' 
                            ? `Proposal to create new offer: ${selectedRec.targetName}`
                            : `Reviewing proposal for: ${selectedRec.targetName} (${selectedRec.targetId})`
                        }
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {selectedRec.type === 'OPTIMIZE_EXISTING' && (
                        <div>
                            <h4 className="font-semibold mb-2">Proposed Change</h4>
                            <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4 bg-secondary">
                                    <CardTitle className="text-sm flex items-center gap-2 mb-2"><GitCommitHorizontal className="h-4 w-4"/>Current Config</CardTitle>
                                    <p className="text-sm text-muted-foreground">{selectedRec.currentConfig}</p>
                            </Card>
                                <Card className="p-4 bg-primary/10 border-primary">
                                    <CardTitle className="text-sm flex items-center gap-2 mb-2"><Wand2 className="h-4 w-4"/>Proposed Config</CardTitle>
                                    <p className="text-sm">{selectedRec.proposedConfig}</p>
                            </Card>
                            </div>
                        </div>
                    )}
                     {selectedRec.type === 'CREATE_NEW' && (
                        <div>
                            <h4 className="font-semibold mb-2">New Offer Details</h4>
                            <Card className="p-4 bg-primary/10 border-primary">
                                <p className="text-sm">{selectedRec.proposedConfig}</p>
                            </Card>
                        </div>
                    )}
                     <div>
                        <h4 className="font-semibold mb-2">Justification</h4>
                        <p className="text-sm text-muted-foreground italic">"{selectedRec.explain}"</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Expected Outcome</h4>
                        <Badge variant="default">{selectedRec.expected_uplift}</Badge>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="destructive" onClick={() => handleDecision(selectedRec.id, 'rejected')}>
                        <X className="mr-2 h-4 w-4"/> Reject
                    </Button>
                    <Button variant="outline" onClick={() => toast({ title: "Edit not implemented", description: "This would open the offer creation/edit form."})}>
                        <Pencil className="mr-2 h-4 w-4"/> Edit & Approve
                    </Button>
                    <Button onClick={() => handleDecision(selectedRec.id, 'approved')}>
                        <Check className="mr-2 h-4 w-4"/> Approve & Publish
                    </Button>
                </DialogFooter>
                </>
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}
