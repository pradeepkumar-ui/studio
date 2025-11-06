"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { offerRuleBuilderNLP } from "@/ai/flows/offer-rule-builder-nlp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  ruleDescription: z.string().min(10, {
    message: "Please enter a rule description of at least 10 characters.",
  }),
});

export default function OfferRuleBuilder() {
  const [structuredRule, setStructuredRule] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ruleDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setStructuredRule(null);
    try {
      const result = await offerRuleBuilderNLP({
        ruleDescription: values.ruleDescription,
      });
      setStructuredRule(result.structuredRule);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate the rule. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="ruleDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rule Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 20% off for round trips to Paris in July"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Rule
          </Button>
        </form>
      </Form>
      
      {(isLoading || structuredRule) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Generated Rule (JSON)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <pre className="p-4 bg-secondary rounded-md text-sm text-secondary-foreground overflow-x-auto">
                <code>{structuredRule}</code>
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
