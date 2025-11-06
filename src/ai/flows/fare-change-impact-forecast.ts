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
    .describe('AI-generated recommendations based on the fare change query.'),
  forecast: z
    .string()
    .describe(
      'Forecasted impact of the fare changes based on the NLP query. This may include impact on revenue, bookings, etc.'
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
  prompt: `You are an AI assistant designed to forecast the impact of fare changes based on user queries.

  Given the following query, provide recommendations and a forecast of the impact of the fare changes.

  Query: {{{query}}}

  Recommendations:
  Forecast:
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
