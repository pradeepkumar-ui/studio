'use server';

/**
 * @fileOverview This file defines a Genkit flow for parsing natural language flight search queries.
 *
 * The flow takes a natural language query as input and returns a structured JSON object
 * containing the parsed flight search parameters.
 *
 * - searchFlightsNLP - The main function that triggers the flow.
 * - SearchFlightsNLPInput - The input type for the flow.
 * - SearchFlightsNLPOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { format } from 'date-fns';

const SearchFlightsNLPInputSchema = z.object({
  query: z.string().describe('A natural language query for a flight search.'),
});
export type SearchFlightsNLPInput = z.infer<typeof SearchFlightsNLPInputSchema>;

const SearchFlightsNLPOutputSchema = z.object({
  origin: z
    .string()
    .describe(
      'The IATA code for the origin airport, extracted from the query.'
    ),
  destination: z
    .string()
    .describe(
      'The IATA code for the destination airport, extracted from the query.'
    ),
  departureDate: z
    .string()
    .describe('The departure date in YYYY-MM-DD format.'),
  returnDate: z
    .string()
    .optional()
    .describe('The return date in YYYY-MM-DD format, if specified.'),
  passengers: z.number().describe('The number of passengers.'),
});
export type SearchFlightsNLPOutput = z.infer<typeof SearchFlightsNLPOutputSchema>;

export async function searchFlightsNLP(
  input: SearchFlightsNLPInput
): Promise<SearchFlightsNLPOutput> {
  return searchFlightsNLPFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchFlightsNLPPrompt',
  input: { schema: SearchFlightsNLPInputSchema },
  output: { schema: SearchFlightsNLPOutputSchema },
  prompt: `You are an expert at parsing natural language flight search queries into structured data.
    The current date is ${format(new Date(), 'yyyy-MM-dd')}.

    Analyze the following user query and extract the Origin, Destination, Departure Date, Return Date (if any), and number of passengers.
    - Always respond with a valid IATA code for origin and destination.
    - If the user provides a vague date like "next month", calculate the actual date based on the current date.
    - Default to 1 passenger if not specified.

    Query:
    {{{query}}}
  `,
});

const searchFlightsNLPFlow = ai.defineFlow(
  {
    name: 'searchFlightsNLPFlow',
    inputSchema: SearchFlightsNLPInputSchema,
    outputSchema: SearchFlightsNLPOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
