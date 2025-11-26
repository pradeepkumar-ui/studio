
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { generatePricingRule, GeneratePricingRuleOutput } from "@/ai/flows/generate-pricing-rule";
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
import { Wand2, Loader2, ClipboardCopy, ArrowRight, PlusCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type PricingRule, formatRuleForSubmit } from "@/components/forms/pricing-rule-form";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
  description: z.string().min(10, {
    message: "Please enter a rule description of at least 10 characters.",
  }),
});

interface DynamicPricingRuleAssistantProps {
    onRuleCreate: (aiOutput: GeneratePricingRuleOutput, newRule: PricingRule) => void;
}

export function DynamicPricingRuleAssistant({ onRuleCreate }: DynamicPricingRuleAssistantProps) {
  const [result, setResult] = useState<GeneratePricingRuleOutput | null>(null);
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
    setResult(null);
    try {
      const result = await generatePricingRule({
        description: values.description,
      });
      setResult(result);
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

  const handleCreateRuleFromAI = () => {
    if (!result) return;
    try {
      const parsedRule = JSON.parse(result.ruleJson);
      // We need to shape this into PricingRuleFormData to use the formatter
      const formData = {
        name: parsedRule.name || 'AI Generated Rule',
        status: parsedRule.status === 'Active' ? 'Active' : 'Test',
        trigger: {
            type: parsedRule.trigger?.type || 'Scheduled'
        },
        target: {
            product: parsedRule.target?.product || 'Air'
        },
        conditions: {
            route: parsedRule.conditions?.route,
            market: parsedRule.conditions?.market,
            loadFactorOperator: parsedRule.conditions?.loadFactorOperator,
            loadFactorValue: parsedRule.conditions?.loadFactorValue,
            departureOperator: parsedRule.conditions?.departureOperator,
            departureValue: parsedRule.conditions?.departureValue,
        },
        action: {
            type: parsedRule.action?.type || 'PERCENTAGE',
            adjustment: parsedRule.action?.adjustment || 0,
            cabinClass: parsedRule.action?.cabinClass || 'All',
        },
        guardrails: {},
        validity: {},
      };
      
      const newRule = formatRuleForSubmit(formData as any, 'AI');
      onRuleCreate(result, newRule);

    } catch (e) {
      console.error("Failed to parse or format AI rule:", e);
      toast({
        variant: "destructive",
        title: "Error Creating Rule",
        description: "There was an issue processing the AI's response.",
      });
    }
  };


  const handleCopyToClipboard = () => {
    if (result?.ruleJson) {
      navigator.clipboard.writeText(result.ruleJson);
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

       {(isLoading || result) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mt-6">
            <Card>
                 <CardHeader>
                    <CardTitle>Rule Preview & Simulation</CardTitle>
                    <CardDescription>A summary and impact analysis of the generated rule.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isLoading ? (
                         <div className="space-y-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                             <div className="space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                     ) : (
                        result && (
                             <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-sm">Summary</h4>
                                    <p className="text-sm text-muted-foreground">{result.ruleSummary}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Simulation</h4>
                                    <p className="text-xs text-muted-foreground">{result.simulation.scenario}</p>
                                    <div className="flex items-center justify-around text-center mt-2 p-3 bg-muted rounded-md">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Before</p>
                                            <p className="text-lg font-bold">${result.simulation.beforePrice.toFixed(2)}</p>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">After</p>
                                            <p className="text-lg font-bold text-primary">${result.simulation.afterPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <p className="text-center text-xs text-muted-foreground mt-1">{result.simulation.impact}</p>
                                    <Alert variant="default" className="mt-4">
                                      <Info className="h-4 w-4" />
                                      <AlertTitle className="text-xs">Simulation Assumptions</AlertTitle>
                                      <AlertDescription className="text-xs">
                                        {result.simulation.assumptions}
                                      </AlertDescription>
                                    </Alert>
                                </div>
                            </div>
                        )
                     )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Generated Rule (JSON)</CardTitle>
                    {result && !isLoading && (
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
                    <pre className="p-4 bg-secondary rounded-md text-sm text-secondary-foreground overflow-x-auto max-h-[22.5rem]">
                        <code>{result?.ruleJson}</code>
                    </pre>
                    )}
                </CardContent>
                {result && !isLoading && (
                    <CardFooter>
                        <Button className="w-full" onClick={handleCreateRuleFromAI}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Rule from AI
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
      )}
    </div>
  );
}
