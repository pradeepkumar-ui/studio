'use server';

/**
 * @fileOverview This file defines a Genkit flow for building offer rules using natural language processing (NLP).
 *
 * The flow takes a natural language description of a rule as input and returns a structured JSON representation
 * of the rule that can be used by the offer creation system.
 *
 * @interface OfferRuleBuilderNLPInput - The input schema for the offer rule builder flow.
 * @interface OfferRuleBuilderNLPOutput - The output schema for the offer rule builder flow.
 * @function offerRuleBuilderNLP - The main function that triggers the offer rule builder flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OfferRuleBuilderNLPInputSchema = z.object({
  ruleDescription: z
    .string()
    .describe(
      'A natural language description of the rule to be created for offer creation.'
    ),
});

export type OfferRuleBuilderNLPInput = z.infer<typeof OfferRuleBuilderNLPInputSchema>;

const OfferRuleBuilderNLPOutputSchema = z.object({
  structuredRule: z
    .string()
    .describe(
      'A structured JSON representation of the rule. This should be a stringified JSON object.'
    ),
});

export type OfferRuleBuilderNLPOutput = z.infer<typeof OfferRuleBuilderNLPOutputSchema>;

export async function offerRuleBuilderNLP(input: OfferRuleBuilderNLPInput): Promise<OfferRuleBuilderNLPOutput> {
  return offerRuleBuilderNLPFlow(input);
}

const offerRuleBuilderPrompt = ai.definePrompt({
  name: 'offerRuleBuilderPrompt',
  input: {schema: OfferRuleBuilderNLPInputSchema},
  output: {schema: OfferRuleBuilderNLPOutputSchema},
  prompt: `You are an expert in converting natural language descriptions of airline offer rules into a structured JSON format.

  Analyze the following rule description and generate a structured JSON object as a string. The JSON should be well-formed and include keys such as 'ruleName', 'description', 'conditions', and 'action'.

  - 'conditions' should contain specifics like 'routes', 'travelDates', 'bookingClass', etc.
  - 'action' should detail the outcome, like a discount type and value.

  Rule Description:
  {{{ruleDescription}}}
  `,
});

const offerRuleBuilderNLPFlow = ai.defineFlow(
  {
    name: 'offerRuleBuilderNLPFlow',
    inputSchema: OfferRuleBuilderNLPInputSchema,
    outputSchema: OfferRuleBuilderNLPOutputSchema,
  },
  async input => {
    const {output} = await offerRuleBuilderPrompt(input);
    
    // Ensure the output is a nicely formatted JSON string.
    try {
        const parsedJson = JSON.parse(output!.structuredRule);
        output!.structuredRule = JSON.stringify(parsedJson, null, 2);
    } catch (e) {
        // If it's not valid JSON, just return the raw output. The user can refine the prompt.
    }
    
    return output!;
  }
);
