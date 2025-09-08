
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { supportChatAction } from "@/app/actions";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function SupportChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await supportChatAction(input);
      if ("error" in aiResponse) {
         const errorMessage: Message = { id: `assistant-${Date.now()}`, role: 'assistant', content: aiResponse.error };
         setMessages((prev) => [...prev, errorMessage]);
      } else {
        const assistantMessage: Message = { id: `assistant-${Date.now()}`, role: 'assistant', content: aiResponse.reply };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
       const errorMessage: Message = { id: `assistant-${Date.now()}`, role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again later." };
       setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  return (
    <div className="bg-secondary/50">
      <div className="container py-12 md:py-24">
         <div className="mx-auto max-w-4xl text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline mt-4">
                AI Support Chat
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Ask me anything about finding resources, getting help, or safety procedures. I'm here to assist you 24/7.
            </p>
        </div>

        <Card className="max-w-2xl mx-auto mt-12 shadow-2xl">
            <CardContent className="p-0">
                <div className="flex flex-col h-[60vh]">
                     <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground">
                                    <p>Ask a question to start the conversation.</p>
                                    <p className="text-sm">e.g., "Where can I find a shelter?" or "What supplies are most needed?"</p>
                                </div>
                            )}
                            {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                "flex items-start gap-4",
                                message.role === "user" ? "justify-end" : ""
                                )}
                            >
                                {message.role === "assistant" && (
                                <Avatar className="h-8 w-8 border-2 border-primary/50">
                                    <AvatarFallback><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                                </Avatar>
                                )}
                                <div
                                className={cn(
                                    "max-w-[75%] rounded-2xl p-3 text-sm",
                                    message.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                    : "bg-muted text-foreground rounded-bl-none"
                                )}
                                >
                                <p>{message.content}</p>
                                </div>
                                 {message.role === "user" && (
                                <Avatar className="h-8 w-8 border-2 border-muted-foreground/50">
                                    <AvatarFallback><User className="h-5 w-5 text-muted-foreground" /></AvatarFallback>
                                </Avatar>
                                )}
                            </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-4">
                                     <Avatar className="h-8 w-8 border-2 border-primary/50">
                                        <AvatarFallback><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                                    </Avatar>
                                    <div className="max-w-[75%] rounded-2xl p-3 text-sm bg-muted text-foreground rounded-bl-none">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Ask about shelters, resources, etc."
                                className="flex-1"
                                disabled={isLoading}
                                autoComplete="off"
                            />
                            <Button type="submit" disabled={isLoading || !input.trim()}>
                                <Send className="mr-2 h-4 w-4" /> Send
                            </Button>
                        </form>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
