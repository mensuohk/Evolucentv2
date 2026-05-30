"use client";

import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "bot";
  text: string;
};

type FeedChatbotProps = {
  posts: Array<{ title: string; body: string }>;
};

export function FeedChatbot({ posts }: FeedChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hello! I can help you understand or summarize any of the news stories in your feed above. What would you like to know?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const query = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          // Only send title and body to save tokens
          posts: posts.map((p) => ({
            title: p.title,
            body: p.body,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.text }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I ran into an issue connecting to the AI. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm dark:bg-card/50">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
          <Bot className="size-4 text-civic-green" />
          Civic Feed AI
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Ask questions about the stories above
        </p>
      </div>

      <div className="flex h-64 flex-col gap-4 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex w-full max-w-[85%] gap-2 ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            <div className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-civic-green/10 text-civic-green"}`}>
              {msg.role === "user" ? <User className="size-3" /> : <Bot className="size-3" />}
            </div>
            <div
              className={`rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted text-foreground rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full max-w-[85%] gap-2">
            <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-civic-green/10 text-civic-green">
              <Bot className="size-3" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm text-muted-foreground">
              <span className="flex gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50" />
              </span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-border bg-background p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 rounded-full border border-input bg-transparent px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="size-9 rounded-full"
        >
          <Send className="size-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
