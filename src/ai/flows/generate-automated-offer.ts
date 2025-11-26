
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
  selectedParameters: z.array(z.string()).optional().describe('A list of specific parameters the AI should consider.'),
  additionalParameters: z.array(z.object({ category: z.string(), parameter: z.string() })).optional().describe('A list of additional custom parameters provided by the user.'),
});
export type GenerateAutomatedOfferInput = z.infer<typeof GenerateAutomatedOfferInputSchema>;

const GenerateAutomatedOfferOutputSchema = z.object({
  considerations: z.string().describe('A bulleted list summarizing the key strategic considerations for this offer.'),
  simulation: z.object({
    name: z.string().describe("A creative and descriptive name for the simulated offer."),
    description: z.string().describe("A short, user-facing description for the simulated offer."),
    price: z.string().describe("The final calculated price or discount for the offer (e.g., '$85' or '15% Off')."),
  }),
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
  prompt: `You are an expert airline offer strategist. Your task is to generate a structured JSON offer based on a high-level goal and a specific set of parameters.

  First, provide your strategic **considerations** as a bulleted list. Explain your reasoning for the components and pricing strategy you chose based on the user's goal.

  Second, create a simple **simulation** with a compelling name, description, and a final calculated price (e.g., '$85' or '15% Off').

  Finally, generate the complete offer **JSON object as a string** in 'offerJson'. The JSON object must conform to the following structure:
  - name: string (A creative and descriptive name for the offer)
  - description: string (A short, user-facing description)
  - category: 'Normal', 'Disruption', or 'Promotional'
  - status: 'Draft'
  - scope: object with optional keys: brand (string), channel (string), route (string), market (string)
  - components: object with optional keys for ancillary products like 'seat', 'baggage', 'meal', 'other'.
  - promotions: array of strings (promotion IDs)
  - pricingStrategy: 'Percent Discount', 'Fixed Discount', or 'Absolute Price'
  - discount: number (The value for the chosen pricing strategy)
  - itemCount: number (The total number of components and promotions)

  **Business Context:**
  - Goal: {{{goal}}}
  - Target Market: {{{targetMarket}}}
  - Constraints: {{{constraints}}}

  **Parameters to Consider:**
  {{#if selectedParameters}}
  - Selected Predefined Parameters: {{{json selectedParameters}}}
  {{/if}}

  {{#if additionalParameters}}
  - Additional User-Defined Parameters:
    {{#each additionalParameters}}
    - Category: {{this.category}}, Parameter: {{this.parameter}}
    {{/each}}
  {{/if}}

  Generate a compelling and logical offer that directly addresses the specified goals and parameters. Be creative with the naming and components.
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

    
