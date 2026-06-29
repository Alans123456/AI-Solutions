import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatApiError, ChatMessage, sendChatMessage } from "@/api/chat";

type ChatBotProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const initialMessage: ChatMessage = {
  role: "bot",
  text: "Hi, I am the AI Solution assistant. Ask me how we can add AI to your current product or build a complete AI product for your team.",
};

export function ChatBot({ open, onOpenChange }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", text: trimmedInput },
    ];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(nextMessages);
      setMessages([...nextMessages, { role: "bot", text: reply }]);
    } catch (chatError) {
      const isQuotaError =
        chatError instanceof ChatApiError && chatError.status === 429;
      const isBalanceError =
        chatError instanceof ChatApiError && chatError.status === 402;
      const message = isBalanceError
        ? "DeepSeek says this API key has insufficient balance. Add credits or use another key."
        : isQuotaError
        ? "The AI provider quota is exhausted for this API key. Check billing, quota, or try again later."
        : chatError instanceof Error
          ? chatError.message
          : "The assistant is unavailable right now.";
      setError(message);
      setMessages([
        ...nextMessages,
        {
          role: "bot",
          text: isBalanceError
            ? "DeepSeek is connected, but this key has insufficient balance. Please add credits in DeepSeek or switch to another API key."
            : isQuotaError
            ? "The AI provider is currently refusing requests because this key has no available quota. AI Solution currently lists 4 services: Web Development, Mobile App Development, Cloud Solutions, and AI & Machine Learning."
            : "I could not connect to the AI service. Please try again in a moment or contact AI Solution directly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className={`fixed bottom-4 right-4 top-20 z-[70] flex w-[calc(100vw-2rem)] max-w-md transform flex-col overflow-hidden rounded-lg border border-border/70 bg-background/95 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:bottom-6 sm:right-6 sm:w-[420px] ${
        open
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-8 opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              AI Solution Chat
            </h2>
            <p className="text-xs text-muted-foreground">
              Product AI and full AI builds
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "border border-border/70 bg-muted text-foreground"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted px-3 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="border-t border-border/70 px-4 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-t border-border/70 p-4">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Ask about adding AI to your product..."
            className="max-h-32 min-h-[48px] resize-none"
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 shrink-0 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-700 hover:to-cyan-600"
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </aside>
  );
}
