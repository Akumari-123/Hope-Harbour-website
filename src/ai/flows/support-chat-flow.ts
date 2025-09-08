
'use server';

/**
 * @fileOverview A support chatbot AI agent for a disaster relief platform.
 *
 * - supportChat - A function that provides answers to user queries.
 * - SupportChatInput - The input type for the supportChat function.
 * - SupportChatOutput - The return type for the supportChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SupportChatInputSchema = z.object({
  query: z.string().describe('The user\'s question or message.'),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.object({
  reply: z.string().describe('The AI assistant\'s response to the user query.'),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;

export async function supportChat(
  input: SupportChatInput
): Promise<SupportChatOutput> {
  return supportChatFlow(input);
}

const supportChatPrompt = ai.definePrompt({
  name: 'supportChatPrompt',
  input: { schema: SupportChatInputSchema },
  output: { schema: SupportChatOutputSchema },
  prompt: `You are "Harby", a friendly and helpful AI assistant for the "Hope Harbour" disaster relief platform. Your goal is to provide concise, accurate, and supportive information to users who may be in a stressful situation.

  CONTEXT:
  - The platform connects people who need help with people who can offer it.
  - Key features include: resource listings (food, water, shelter), volunteer registration, donations, and a lost & found board.
  - Assume there are relief centers, shelters, and donation drop-off points in affected areas like "North Valley", "Coastal City", and "Rivertown".
  - Emergency services can be reached by dialing 911 (in the US). For mental health, users can call 988.

  INSTRUCTIONS:
  - Be empathetic and reassuring.
  - Keep your answers short and to the point.
  - If you don't know an answer, say so and suggest they contact a human volunteer through the contact page.
  - When asked for locations (shelters, hospitals), tell them to check the "Updates" or "Resources" page for the most current, verified information. Don't invent addresses.
  - Guide users to the correct section of the website (e.g., "You can offer items on the Resources page," or "To find a missing person, please use the Lost & Found section.").
  
  User's query: {{{query}}}
  
  Your reply:
`,
});

const supportChatFlow = ai.defineFlow(
  {
    name: 'supportChatFlow',
    inputSchema: SupportChatInputSchema,
    outputSchema: SupportChatOutputSchema,
  },
  async (input) => {
    const { output } = await supportChatPrompt(input);
    return output!;
  }
);
