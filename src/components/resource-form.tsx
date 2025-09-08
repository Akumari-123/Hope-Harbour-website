
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Send, Lightbulb, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getSuggestionsAction, submitResource } from "@/app/actions";
import type { ResourceListingOutput } from "@/ai/flows/resource-listing-suggestions";

const formSchema = z.object({
  resourceType: z.string().min(3, "Resource type is required."),
  details: z.string().min(10, "Please provide more details."),
  listingType: z.enum(["offer", "request"]),
});

type ResourceFormProps = {
  listingType: "offer" | "request";
};

export function ResourceForm({ listingType }: ResourceFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] =
    useState<ResourceListingOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resourceType: "",
      details: "",
      listingType: listingType,
    },
  });

  async function onGetSuggestions(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const result = await getSuggestionsAction(values);
    setIsLoading(false);

    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      setAiSuggestions(result);
      setAlertOpen(true);
    }
  }

  async function handleFinalSubmit() {
    setAlertOpen(false);
    setIsSubmitting(true);
    const values = form.getValues();
    const result = await submitResource(values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Success!",
        description: "Your listing has been posted.",
      });
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Could not post your listing. Please try again.",
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onGetSuggestions)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="resourceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource Type</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Canned Food, Blankets, Medical Supplies"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  What kind of resource are you {listingType === "offer" ? "offering" : "requesting"}?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide details like quantity, condition, location, and urgency."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Posting..." : "Get Suggestions & Post"}
          </Button>
        </form>
      </Form>

      <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>AI-Powered Suggestions</AlertDialogTitle>
            <AlertDialogDescription>
              Here are some AI-generated suggestions and safety guidelines to
              improve your listing and ensure a safe exchange.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-[40vh] overflow-y-auto pr-4 space-y-6">
            {aiSuggestions?.suggestions && (
              <div>
                <h3 className="font-semibold flex items-center mb-2">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                  Listing Suggestions
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {aiSuggestions.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            {aiSuggestions?.safetyGuidelines && (
              <div>
                <h3 className="font-semibold flex items-center mb-2">
                  <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
                  Safety Guidelines
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {aiSuggestions.safetyGuidelines.map((guideline, i) => (
                    <li key={i}>{guideline}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back & Edit</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalSubmit}>
              Looks Good, Post It!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
