
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating structured dynamic pricing rules
 * from a natural language description.
 *
 * @interface GeneratePricingRuleInput - The input schema for the flow.
 * @interface GeneratePricingRuleOutput - The output schema for the flow.
 * @function generatePricingRule - The main function that triggers the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePricingRuleInputSchema = z.object({
  description: z
    .string()
    .describe('A natural language description of the dynamic pricing rule.'),
});
export type GeneratePricingRuleInput = z.infer<typeof GeneratePricingRuleInputSchema>;

const GeneratePricingRuleOutputSchema = z.object({
  ruleJson: z
    .string()
    .describe('A structured JSON representation of the dynamic pricing rule. This should be a stringified JSON object.'),
  ruleSummary: z.string().describe("A human-readable summary of the rule's logic and action."),
  simulation: z.object({
      scenario: z.string().describe("A brief description of the simulation scenario, including any assumed context like route or cabin class."),
      assumptions: z.string().describe("A brief outline of all assumptions made for the simulation, such as base fare, load factor, route, cabin class, etc."),
      beforePrice: z.number().describe("The price before the rule is applied."),
      afterPrice: z.number().describe("The price after the rule is applied."),
      impact: z.string().describe("A short sentence describing the impact."),
  }).describe("A simulated scenario showing the rule's impact on a sample fare.")
});
export type GeneratePricingRuleOutput = z.infer<typeof GeneratePricingRuleOutputSchema>;

export async function generatePricingRule(input: GeneratePricingRuleInput): Promise<GeneratePricingRuleOutput> {
  return generatePricingRuleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePricingRulePrompt',
  input: {schema: GeneratePricingRuleInputSchema},
  output: {schema: GeneratePricingRuleOutputSchema},
  prompt: `You are an expert in converting natural language descriptions into structured JSON for an airline's dynamic pricing engine.

  Analyze the following description and generate three things:
  1. A structured JSON object as a string in 'ruleJson'. The JSON should include keys for 'name', 'status', 'trigger', 'conditions', 'action', and 'guardrails'.
     - 'trigger.type' can be 'Scheduled', 'OnDemand', or 'CompetitorPriceChange'.
     - 'conditions' can include 'route', 'market', 'loadFactorOperator' ('>' or '<'), 'loadFactorValue', 'departureOperator', 'departureValue' etc.
     - 'action.type' can be 'PERCENTAGE' or 'FIXED_AMOUNT'.
     - 'action.adjustment' should be a number (positive for increase, negative for decrease).
     - 'action.cabinClass' can be 'Economy', 'Premium Economy', 'Business', 'First', or 'All'.
  2. A short, human-readable summary of what the rule does in 'ruleSummary'.
  3. A simple simulation in 'simulation' showing the rule's effect. Create a realistic 'scenario' and a detailed 'assumptions' string listing all parameters used (e.g., base fare, route, cabin class, load factor). Calculate 'beforePrice' and 'afterPrice'.

  Description:
  {{{description}}}
  `,
});

const generatePricingRuleFlow = ai.defineFlow(
  {
    name: 'generatePricingRuleFlow',
    inputSchema: GeneratePricingRuleInputSchema,
    outputSchema: GeneratePricingRuleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    // Ensure the output is a nicely formatted JSON string.
    try {
        const parsedJson = JSON.parse(output!.ruleJson);
        output!.ruleJson = JSON.stringify(parsedJson, null, 2);
    } catch (e) {
        // If it's not valid JSON, just return the raw output.
    }
    
    return output!;
  }
);
