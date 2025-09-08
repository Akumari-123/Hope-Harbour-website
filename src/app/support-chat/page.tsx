
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, MessageCircle, Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { supportChatAction, textToSpeechAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioDataUri?: string;
}

export default function SupportChatPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const playAudio = (audioDataUri: string) => {
    if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await supportChatAction(query);
      let assistantMessage: Message;

      if ("error" in aiResponse) {
         assistantMessage = { id: `assistant-${Date.now()}`, role: 'assistant', content: aiResponse.error };
      } else {
        const ttsResponse = await textToSpeechAction(aiResponse.reply);
        assistantMessage = { id: `assistant-${Date.now()}`, role: 'assistant', content: aiResponse.reply };
        if ("audioDataUri" in ttsResponse) {
            assistantMessage.audioDataUri = ttsResponse.audioDataUri;
        }
      }

      setMessages((prev) => [...prev, assistantMessage]);
      if (assistantMessage.audioDataUri) {
          playAudio(assistantMessage.audioDataUri);
      }
    } catch (error) {
       const errorMessage: Message = { id: `assistant-${Date.now()}`, role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again later." };
       setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
            variant: "destructive",
            title: "Voice Error",
            description: `Could not recognize speech: ${event.error}`
        });
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
          setIsRecording(false);
      }
    }
  }, [toast]);

  const toggleRecording = () => {
      if (!recognitionRef.current) {
          toast({
              variant: "destructive",
              title: "Browser not supported",
              description: "Your browser does not support voice recognition."
          })
          return;
      }

      if (isRecording) {
          recognitionRef.current.stop();
          setIsRecording(false);
      } else {
          recognitionRef.current.start();
          setIsRecording(true);
      }
  }


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
      <audio ref={audioRef} className="hidden" />
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
                                    "max-w-[75%] rounded-2xl p-3 text-sm flex items-center gap-2",
                                    message.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                    : "bg-muted text-foreground rounded-bl-none"
                                )}
                                >
                                <p>{message.content}</p>
                                {message.audioDataUri && (
                                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => playAudio(message.audioDataUri!)}>
                                        <Volume2 className="h-4 w-4" />
                                    </Button>
                                )}
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
                            <Button type="button" variant="outline" size="icon" onClick={toggleRecording} disabled={isLoading}>
                                {isRecording ? <MicOff className="text-destructive"/> : <Mic />}
                            </Button>
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
