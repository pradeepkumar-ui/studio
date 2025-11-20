'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/fare-change-impact-forecast.ts';
import '@/ai/flows/search-flights-nlp.ts';
import '@/ai/flows/generate-pricing-rule.ts';
