
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { generatePricingRule } from "@/ai/flows/generate-pricing-rule";
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
import { Wand2, Loader2, ClipboardCopy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  description: z.string().min(10, {
    message: "Please enter a rule description of at least 10 characters.",
  }),
});

export function DynamicPricingRuleAssistant() {
  const [structuredRule, setStructuredRule] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setStructuredRule(null);
    try {
      const result = await generatePricingRule({
        description: values.description,
      });
      setStructuredRule(result.ruleJson);
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

  const handleCopyToClipboard = () => {
    if (structuredRule) {
      navigator.clipboard.writeText(structuredRule);
      toast({
        title: "Copied to clipboard!",
        description: "The generated JSON rule has been copied.",
      });
    }
  };


  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rule Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'For the LHR-JFK route, if load factor is over 80%, increase business class price by 10%'."
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
            Generate Rule JSON
          </Button>
        </form>
      </Form>
      
      {(isLoading || structuredRule) && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Generated Rule (JSON)</CardTitle>
            {structuredRule && !isLoading && (
              <Button variant="ghost" size="sm" onClick={handleCopyToClipboard}>
                <ClipboardCopy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2 p-4 bg-secondary rounded-md">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4/5" />
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
