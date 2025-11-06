"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { fareChangeImpactForecast } from "@/ai/flows/fare-change-impact-forecast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Loader2, Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  query: z.string().min(10, {
    message: "Please enter a query of at least 10 characters.",
  }),
});

type ForecastOutput = {
  recommendations: string;
  forecast: string;
};

export default function FareChangeForecast() {
  const [result, setResult] = useState<ForecastOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const forecastResult = await fareChangeImpactForecast({
        query: values.query,
      });
      setResult(forecastResult);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate forecast. Please try again.",
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
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fare Change Scenario</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., increase business class fares by 15% to Dubai"
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
              <BarChart3 className="mr-2 h-4 w-4" />
            )}
            Forecast Impact
          </Button>
        </form>
      </Form>
      
      {(isLoading || result) && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary"/>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : (
                <div className="text-sm text-muted-foreground space-y-2" dangerouslySetInnerHTML={{ __html: result?.recommendations.replace(/\n/g, '<br />') || '' }} />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary"/>
              <CardTitle>Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                 <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <div className="text-sm text-muted-foreground space-y-2" dangerouslySetInnerHTML={{ __html: result?.forecast.replace(/\n/g, '<br />') || '' }} />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
