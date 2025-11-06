'use server';

/**
 * @fileOverview This file defines a Genkit flow for building offer rules using natural language processing (NLP).
 *
 * The flow takes a natural language description of a rule as input and returns a structured representation
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
      'A structured representation of the rule, such as JSON or a domain-specific language.'
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
  prompt: `You are an expert in converting natural language descriptions of offer rules into a structured format.

  The structured format should be suitable for use in an offer creation system. Consider factors such as pricing, availability, and customer segmentation.

  Based on the following rule description, generate a structured representation of the rule:

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
    return output!;
  }
);

