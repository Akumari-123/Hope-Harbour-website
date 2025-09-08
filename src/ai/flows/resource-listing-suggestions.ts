'use server';

/**
 * @fileOverview A resource listing and safety suggestion AI agent.
 *
 * - getResourceListingSuggestions - A function that suggests resources and safety guidelines.
 * - ResourceListingInput - The input type for the getResourceListingSuggestions function.
 * - ResourceListingOutput - The return type for the getResourceListingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResourceListingInputSchema = z.object({
  listingType: z.enum(['offer', 'request']).describe('The type of listing: offer or request.'),
  resourceType: z.string().describe('The type of resource being offered or requested (e.g., food, clothing, shelter).'),
  details: z.string().describe('Specific details about the resource or request.'),
});
export type ResourceListingInput = z.infer<typeof ResourceListingInputSchema>;

const ResourceListingOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('Suggestions for the listing based on the resource type and details.'),
  safetyGuidelines: z.array(z.string()).describe('Safety guidelines for both providers and requestors. '),
});
export type ResourceListingOutput = z.infer<typeof ResourceListingOutputSchema>;

export async function getResourceListingSuggestions(
  input: ResourceListingInput
): Promise<ResourceListingOutput> {
  return resourceListingSuggestionsFlow(input);
}

const resourceListingPrompt = ai.definePrompt({
  name: 'resourceListingPrompt',
  input: {schema: ResourceListingInputSchema},
  output: {schema: ResourceListingOutputSchema},
  prompt: `You are an AI assistant designed to provide helpful suggestions and safety guidelines for resource listings on a disaster relief platform.

  Based on the type of listing (offer or request), the resource type, and the details provided, generate relevant suggestions to improve the listing and ensure safe exchanges.

  Listing Type: {{{listingType}}}
  Resource Type: {{{resourceType}}}
  Details: {{{details}}}

  Suggestions:
  - Provide specific suggestions related to the resource type and details.
  - Focus on clarity, completeness, and relevance to the disaster relief effort.

  Safety Guidelines:
  - Offer safety advice for both providers (those offering resources) and requestors (those seeking resources).
  - Address potential risks and precautions related to the specific resource type.
  - Include general guidelines for safe interactions and verifications.
  - Keep it concise and actionable.

  Output the suggestions and safety guidelines as arrays of strings. Focus on being informative and helpful.
`,
});

const resourceListingSuggestionsFlow = ai.defineFlow(
  {
    name: 'resourceListingSuggestionsFlow',
    inputSchema: ResourceListingInputSchema,
    outputSchema: ResourceListingOutputSchema,
  },
  async input => {
    const {output} = await resourceListingPrompt(input);
    return output!;
  }
);
