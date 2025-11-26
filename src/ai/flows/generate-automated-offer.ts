
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating automated offers based on high-level goals.
 *
 * - generateAutomatedOffer - The main function that triggers the flow.
 * - GenerateAutomatedOfferInput - The input type for the flow.
 * - GenerateAutomatedOfferOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAutomatedOfferInputSchema = z.object({
  goal: z.string().describe('The primary business goal for creating this offer.'),
  targetMarket: z.string().describe('The target market, audience, and/or timeframe.'),
  constraints: z.string().optional().describe('Any constraints or specific requirements for the offer.'),
});
export type GenerateAutomatedOfferInput = z.infer<typeof GenerateAutomatedOfferInputSchema>;

const GenerateAutomatedOfferOutputSchema = z.object({
  offerJson: z.string().describe('A structured JSON representation of the generated offer. This should be a stringified JSON object compatible with the Bundle form.'),
});
export type GenerateAutomatedOfferOutput = z.infer<typeof GenerateAutomatedOfferOutputSchema>;

export async function generateAutomatedOffer(input: GenerateAutomatedOfferInput): Promise<GenerateAutomatedOfferOutput> {
  return generateAutomatedOfferFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAutomatedOfferPrompt',
  input: { schema: GenerateAutomatedOfferInputSchema },
  output: { schema: GenerateAutomatedOfferOutputSchema },
  prompt: `You are an expert airline offer strategist. Your task is to generate a structured JSON offer based on a high-level goal.

  Analyze the following goal, target market, and constraints, and generate a complete offer JSON object as a string in 'offerJson'.

  The JSON object must conform to the following structure:
  - name: string (A creative and descriptive name for the offer)
  - description: string (A short, user-facing description)
  - category: 'Normal', 'Disruption', or 'Promotional'
  - status: 'Draft'
  - scope: object with optional keys: brand (string), channel (string), route (string)
  - components: object with optional keys for ancillary products like 'seat', 'baggage', 'meal', 'other'.
  - promotions: array of strings (promotion IDs)
  - pricingStrategy: 'Percent Discount', 'Fixed Discount', or 'Absolute Price'
  - discount: number (The value for the chosen pricing strategy)
  - itemCount: number (The total number of components and promotions)

  Goal: {{{goal}}}
  Target Market: {{{targetMarket}}}
  Constraints: {{{constraints}}}

  Generate a compelling and logical offer. Be creative with the naming and components.
  `,
});

const generateAutomatedOfferFlow = ai.defineFlow(
  {
    name: 'generateAutomatedOfferFlow',
    inputSchema: GenerateAutomatedOfferInputSchema,
    outputSchema: GenerateAutomatedOfferOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    
    try {
        const parsedJson = JSON.parse(output!.offerJson);
        output!.offerJson = JSON.stringify(parsedJson, null, 2);
    } catch (e) {
        // If it's not valid JSON, just return the raw output.
    }

    return output!;
  }
);
