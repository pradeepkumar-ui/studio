'use server';

/**
 * @fileOverview This file defines a Genkit flow for forecasting the impact of fare changes based on NLP queries.
 *
 * The flow takes an NLP query as input and returns AI-generated recommendations and forecasts.
 * - fareChangeImpactForecast - A function that handles the fare change impact forecast process.
 * - FareChangeImpactForecastInput - The input type for the fareChangeImpactForecast function.
 * - FareChangeImpactForecastOutput - The return type for the fareChangeImpactForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FareChangeImpactForecastInputSchema = z.object({
  query: z
    .string()
    .describe(
      'An NLP query related to fare changes for which impact needs to be forecasted.'
    ),
});
export type FareChangeImpactForecastInput = z.infer<
  typeof FareChangeImpactForecastInputSchema
>;

const FareChangeImpactForecastOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('AI-generated recommendations based on the fare change query. Provide at least 2-3 bullet points.'),
  forecast: z
    .string()
    .describe(
      'Forecasted impact of the fare changes based on the NLP query. This should include specific metrics like estimated revenue change, impact on bookings, and load factor.'
    ),
});
export type FareChangeImpactForecastOutput = z.infer<
  typeof FareChangeImpactForecastOutputSchema
>;

export async function fareChangeImpactForecast(
  input: FareChangeImpactForecastInput
): Promise<FareChangeImpactForecastOutput> {
  return fareChangeImpactForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fareChangeImpactForecastPrompt',
  input: {schema: FareChangeImpactForecastInputSchema},
  output: {schema: FareChangeImpactForecastOutputSchema},
  prompt: `You are an expert airline revenue management AI assistant. Your role is to forecast the impact of fare changes based on user queries.

  Analyze the following query and provide:
  1.  **Recommendations**: Actionable advice and strategic considerations. Format as a bulleted list.
  2.  **Forecast**: A detailed quantitative forecast including estimated impact on revenue, booking volume, and passenger load factor. Be specific and use metrics.

  Query: {{{query}}}
  `,
});

const fareChangeImpactForecastFlow = ai.defineFlow(
  {
    name: 'fareChangeImpactForecastFlow',
    inputSchema: FareChangeImpactForecastInputSchema,
    outputSchema: FareChangeImpactForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
