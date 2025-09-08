
'use server';

import { z } from 'zod';
import { getResourceListingSuggestions, type ResourceListingInput, type ResourceListingOutput } from '@/ai/flows/resource-listing-suggestions';
import { supportChat, type SupportChatInput, type SupportChatOutput } from '@/ai/flows/support-chat-flow';
import { textToSpeech, type TextToSpeechInput, type TextToSpeechOutput } from '@/ai/flows/tts-flow';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


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

export async function textToSpeechAction(
  text: string
): Promise<TextToSpeechOutput | { error: string }> {
  if (!text) {
    return { error: "Text cannot be empty." };
  }
  try {
    const aiInput: TextToSpeechInput = { text };
    const response = await textToSpeech(aiInput);
    return response;
  } catch (error) {
    console.error("Error in text-to-speech action: ", error);
    return { error: "Sorry, I couldn't process your request right now." };
  }
}

export async function submitDonation(data: { amount: number; donationType: string; name: string; email: string; }) {
    try {
        await addDoc(collection(db, "donations"), {
            ...data,
            createdAt: serverTimestamp(),
        });
        return { success: true, message: "Thank you for your generous donation!" };
    } catch (error) {
        console.error("Error submitting donation:", error);
        return { success: false, message: "Could not process your donation. Please try again." };
    }
}

export async function submitVolunteerForm(data: any) {
    try {
        await addDoc(collection(db, "volunteers"), {
            ...data,
            createdAt: serverTimestamp(),
        });
        return { success: true, message: "Thank you for volunteering! We will be in touch soon." };
    } catch (error) {
        console.error("Error submitting volunteer form:", error);
        return { success: false, message: "Could not process your registration. Please try again." };
    }
}

export async function submitResource(data: any) {
    try {
        await addDoc(collection(db, "resources"), {
            ...data,
            createdAt: serverTimestamp(),
        });
        return { success: true, message: "Your resource listing has been posted. Thank you for your contribution." };
    } catch (error) {
        console.error("Error submitting resource:", error);
        return { success: false, message: "Could not post your listing. Please try again." };
    }
}

export async function submitContactForm(data: any) {
    console.log("Contact form submitted:", data);
    // In a real app, you would send an email or save to a database
    return { success: true, message: "Your message has been sent. We will get back to you shortly." };
}
