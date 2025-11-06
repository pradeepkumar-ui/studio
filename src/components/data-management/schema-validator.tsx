
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

const examplePayload = `{
  "offer_id": "OFF_7D91A",
  "version": 4,
  "status": "Retailled",
  "price": {
    "total": "8990",
    "currency": "INR"
  },
  "items": [
    {
      "item_id": "FL_1",
      "price": { "total": "8990" }
    }
  ]
}`;

export function SchemaValidator() {
  const [payload, setPayload] = useState(examplePayload);
  const [result, setResult] = useState<{ status: 'valid' | 'invalid'; errors: string[] } | null>(null);
  const { toast } = useToast();

  const handleValidate = () => {
    try {
      const parsed = JSON.parse(payload);
      const errors: string[] = [];
      if (!parsed.offer_id) errors.push('Missing required field: offer_id');
      if (!parsed.price || !parsed.price.total || !parsed.price.currency) {
         errors.push('Missing or incomplete price object');
      }
      
      if (errors.length > 0) {
        setResult({ status: 'invalid', errors });
      } else {
        setResult({ status: 'valid', errors: [] });
      }

    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Invalid JSON',
        description: 'The provided payload is not valid JSON.',
      });
      setResult(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schema Validator Console</CardTitle>
        <CardDescription>
          Upload or paste an Offer payload to validate it against the canonical schema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder="Paste Offer payload here..."
          className="min-h-64 font-mono text-xs"
        />
        <Button onClick={handleValidate}>Validate Payload</Button>
        {result && (
          <Alert variant={result.status === 'valid' ? 'default' : 'destructive'} className="mt-4">
            {result.status === 'valid' ? 
              <CheckCircle2 className="h-4 w-4" /> : 
              <XCircle className="h-4 w-4" />
            }
            <AlertTitle>
              {result.status === 'valid' ? 'Validation Successful' : 'Validation Failed'}
            </AlertTitle>
            <AlertDescription>
              {result.status === 'valid' 
                ? 'The payload conforms to the canonical Offer schema.'
                : (
                    <ul>
                        {result.errors.map((err, i) => <li key={i}>- {err}</li>)}
                    </ul>
                )
              }
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
