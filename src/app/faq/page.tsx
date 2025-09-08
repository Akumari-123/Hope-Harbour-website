
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle } from "lucide-react";

const faqItems = [
  {
    question: "What should I do during an earthquake?",
    answer:
      "If you are indoors, stay there. Drop to the ground, take cover under a sturdy table or desk, and hold on until the shaking stops. Stay away from windows, glass, and anything that could fall. If you are outdoors, find a clear spot away from buildings, trees, and power lines.",
  },
  {
    question: "How do I prepare a disaster emergency kit?",
    answer:
      "Your basic emergency kit should include: water (one gallon per person per day for at least three days), non-perishable food for at least three days, a battery-powered or hand-crank radio, a flashlight, a first aid kit, extra batteries, a whistle to signal for help, and moist towelettes.",
  },
  {
    question: "What are the first steps after a flood?",
    answer:
      "First, ensure it is safe to return to your home. Avoid moving water and be aware of contaminated floodwater. Check for structural damage before entering. Turn off electricity and gas lines if you can do so safely. Document the damage with photos for insurance purposes.",
  },
  {
    question: "How can I find a safe shelter?",
    answer:
      "Check the 'Updates' page on this platform for the latest information on official public shelters. You can also listen to local news radio or check official government disaster relief websites. The 'Resources' page may also list community-run shelters.",
  },
  {
    question: "What's the safest way to purify drinking water?",
    answer:
      "If you don't have bottled water, you can boil water to make it safe. Boil it for at least one minute. If you can't boil water, you can use regular household liquid chlorine bleach. Add 8 drops (about 1/8 teaspoon) of bleach per gallon of water and let it stand for 30 minutes before using.",
  },
];

export default function FaqPage() {
  return (
    <div className="bg-secondary/50">
      <div className="container py-12 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Community Support & FAQ
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Find answers to common questions and access resources for mental
            health and well-being. You are not alone.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold font-headline mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Mental Health Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  It's okay to not be okay. Reach out for help if you're feeling
                  overwhelmed.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">National Helpline</h4>
                      <p className="text-sm text-muted-foreground">
                        A 24/7 crisis support line.
                      </p>
                      <a
                        href="tel:988"
                        className="text-primary font-medium hover:underline"
                      >
                        Call 988
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Crisis Text Line</h4>
                       <p className="text-sm text-muted-foreground">
                        Text with a trained crisis counselor.
                      </p>
                      <p className="text-primary font-medium">
                        Text HOME to 741741
                      </p>
                    </div>
                  </div>
                </div>
                 <p className="text-xs text-muted-foreground pt-4 border-t">
                  Note: These are examples. In a real application, please use official, local crisis support numbers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
