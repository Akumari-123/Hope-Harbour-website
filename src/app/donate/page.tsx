
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Heart,
  CreditCard,
  Building,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { submitDonation } from "@/app/actions";

const donationAmounts = [25, 50, 100, 250, 500];

const formSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Donation amount must be positive." }),
  donationType: z.enum(["one-time", "recurring"]),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
});

export default function DonatePage() {
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 50,
      donationType: "one-time",
      name: "",
      email: "",
    },
  });

  const selectedAmount = form.watch("amount");

  const handleAmountClick = (amount: number) => {
    form.setValue("amount", amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      form.setValue("amount", value);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const result = await submitDonation(values);
    setIsSubmitting(false);

    if (result.success) {
      setSubmissionComplete(true);
      toast({
        title: "Success!",
        description: result.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error processing your donation. Please try again.",
      });
    }
  }

  if (submissionComplete) {
    return (
      <div className="container py-20 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-3 rounded-full mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle as="h2" className="text-3xl">Thank You!</CardTitle>
            <CardDescription>
              Your generous donation is greatly appreciated. You are making a
              real difference.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>
              Make another donation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container py-12 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Your Support Matters
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Every contribution, big or small, helps us provide critical aid to
            communities in crisis. Join us in making a difference today.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mt-16">
          <CardHeader>
            <CardTitle as="h2">Make a Donation</CardTitle>
            <CardDescription>
              Choose an amount and tell us how you'd like to contribute.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-semibold">
                        Select Amount
                      </FormLabel>
                      <div className="grid grid-cols-3 gap-4">
                        {donationAmounts.map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={
                              selectedAmount === amount ? "default" : "outline"
                            }
                            onClick={() => handleAmountClick(amount)}
                            className="h-14 text-lg"
                          >
                            ${amount}
                          </Button>
                        ))}
                        <Input
                          type="number"
                          placeholder="Custom"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          className={cn(
                            "h-14 text-lg text-center col-span-3",
                            selectedAmount > 0 &&
                              !donationAmounts.includes(selectedAmount)
                              ? "border-primary ring-2 ring-primary"
                              : ""
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="donationType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold">
                        Donation Frequency
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="one-time" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              One-Time Donation
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="recurring" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Monthly Donation
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-base font-semibold">Your Information</h3>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold">Payment Method</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                     <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="mr-2 h-4 w-4" />
                      )}
                      Pay with Card
                    </Button>
                     <Button type="button" variant="secondary" className="w-full" disabled={isSubmitting}>
                        <Building className="mr-2 h-4 w-4" /> Pay with Corporate Account
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
