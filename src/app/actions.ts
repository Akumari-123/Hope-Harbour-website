
'use server';

import { z } from 'zod';
import { getResourceListingSuggestions, type ResourceListingInput, type ResourceListingOutput } from '@/ai/flows/resource-listing-suggestions';
import { supportChat, type SupportChatInput, type SupportChatOutput } from '@/ai/flows/support-chat-flow';

const suggestionSchema = z.object({
  listingType: z.enum(['offer', 'request']),
  resourceType: z.string().min(1, 'Resource type is required.'),
  details: z.string().min(1, 'Details are required.'),
});

export async function getSuggestionsAction(
  values: z.infer<typeof suggestionSchema>
): Promise<ResourceListingOutput | { error: string }> {
  const validatedFields = suggestionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const aiInput: ResourceListingInput = validatedFields.data;
    const suggestions = await getResourceListingSuggestions(aiInput);
    return suggestions;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return { error: 'Failed to get suggestions from AI. Please try again.' };
  }
}

export async function supportChatAction(
  query: string
): Promise<SupportChatOutput | { error: string }> {
    if (!query) {
        return { error: "Query cannot be empty." };
    }
    try {
        const aiInput: SupportChatInput = { query };
        const response = await supportChat(aiInput);
        return response;
    } catch (error) {
        console.error("Error in support chat action: ", error);
        return { error: "Sorry, I couldn't process your request right now."}
    }
}

// Placeholder server action for form submissions
export async function submitDonation(data: any) {
    console.log("Donation submitted:", data);
    // In a real app, you would process the payment here
    return { success: true, message: "Thank you for your generous donation!" };
}

export async function submitVolunteerForm(data: any) {
    console.log("Volunteer registration submitted:", data);
    // In a real app, you would save this to a database
    return { success: true, message: "Thank you for volunteering! We will be in touch soon." };
}

export async function submitResource(data: any) {
    console.log("Resource submitted:", data);
    // In a real app, you would save this to a database
    return { success: true, message: "Your resource listing has been posted. Thank you for your contribution." };
}

export async function submitContactForm(data: any) {
    console.log("Contact form submitted:", data);
    // In a real app, you would send an email or save to a database
    return { success: true, message: "Your message has been sent. We will get back to you shortly." };
}
