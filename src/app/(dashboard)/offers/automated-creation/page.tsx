
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2 } from 'lucide-react';
import { generateAutomatedOffer } from '@/ai/flows/generate-automated-offer';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import type { Bundle } from '@/components/forms/bundle-form';

const formSchema = z.object({
  goal: z.string().min(10, 'Please describe the goal in at least 10 characters.'),
  targetMarket: z.string().min(3, 'Target market is required.'),
  constraints: z.string().optional(),
});

export default function AutomatedOfferCreationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: '',
      targetMarket: '',
      constraints: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    toast({
      title: 'Generating Offer...',
      description: 'The AI is creating a custom offer based on your parameters.',
    });

    try {
      const result = await generateAutomatedOffer(values);
      const newOffer = JSON.parse(result.offerJson);

      if (!firestore) {
        throw new Error("Firestore not available");
      }
      
      const offerToSave: Partial<Bundle> = {
          ...newOffer,
          source: 'AI',
          createdAt: serverTimestamp(),
      }

      await addDoc(collection(firestore, "bundles"), offerToSave);

      toast({
        title: 'AI Offer Created!',
        description: `Offer "${newOffer.name}" has been created and is now available.`,
      });

      router.push('/bundles');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate and save the offer. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Automated Offer Generation
        </h1>
        <p className="text-muted-foreground">
          Leverage AI to dynamically create and price targeted offers.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Define Offer Parameters</CardTitle>
          <CardDescription>
            Provide high-level goals and constraints for the AI to generate a
            new offer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Goal</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Increase load factor on underperforming EU-US routes during shoulder season."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetMarket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Market / Timeframe</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Leisure travelers from Germany in Q2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="constraints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Constraints (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Discount cannot exceed 20%. Must include a baggage component. Avoid targeting business class."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate &amp; Save Offer
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
