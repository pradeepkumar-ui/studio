
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

  Analyze the following description and generate a structured JSON object as a string. The JSON should be well-formed and include keys for 'name', 'status', 'trigger', 'conditions', 'action', and 'guardrails'.

  - 'trigger.type' can be 'Scheduled', 'OnDemand', or 'CompetitorPriceChange'.
  - 'conditions' can include 'route', 'market', 'loadFactorOperator' ('>' or '<'), 'loadFactorValue', 'departureOperator', 'departureValue' etc.
  - 'action.type' can be 'PERCENTAGE' or 'FIXED_AMOUNT'.
  - 'action.adjustment' should be a number (positive for increase, negative for decrease).
  - 'action.cabinClass' can be 'Economy', 'Premium Economy', 'Business', 'First', or 'All'.

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
