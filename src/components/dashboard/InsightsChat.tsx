"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Send, Square, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "¿Cuál es el track con mayor potencial para playlists editoriales?",
  "Analiza la distribución por género y sugiere dónde enfocar próximos lanzamientos.",
  "¿Cuál debería ser mi royalty rate objetivo para maximizar net earnings?",
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold",
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-accent/10 text-accent border border-accent/20"
        )}
      >
        {isUser ? "T" : <Sparkles className="w-3.5 h-3.5" />}
      </div>

      <div
        className={cn(
          "max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-secondary text-secondary-foreground rounded-tr-sm"
            : "bg-card border border-border text-foreground rounded-tl-sm"
        )}
      >
        {message.parts.map((part, i) =>
          part.type === "text" ? <span key={i}>{part.text}</span> : null
        )}
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 shrink-0 flex items-center justify-center">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
      </div>
      <div className="bg-card border border-border rounded-xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function EmptyState({ onPromptClick }: { onPromptClick: (p: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full gap-8 text-center py-12">
      <div>
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-base font-semibold text-foreground">
          Sonic Assistant
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-[260px] leading-relaxed">
          Estratega senior de la industria musical. Contexto real de Tierso
          cargado.
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-sm">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className="text-left text-sm text-muted-foreground bg-card border border-border rounded-lg px-4 py-3 hover:border-accent/30 hover:text-foreground transition-all duration-300"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function InsightsChat() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al conectar con Sonic AI"
      );
    },
  });

  const isActive = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isActive]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  function submit() {
    if (!input.trim() || isActive) return;
    sendMessage({ text: input });
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex flex-col min-h-0" style={{ flex: "1 1 0" }}>
      {/* Messages area */}
      <div className="overflow-y-auto space-y-5 py-6 pr-1 [scrollbar-width:thin] [scrollbar-color:hsl(var(--border))_transparent]" style={{ flex: "1 1 0" }}>
        {messages.length === 0 ? (
          <EmptyState onPromptClick={(p) => sendMessage({ text: p })} />
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {status === "submitted" && <ThinkingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-border pt-4 pb-2">
        <div className="flex items-end gap-3 bg-card rounded-xl border border-border p-3 focus-within:border-accent/40 transition-colors duration-300">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregunta sobre tu catálogo..."
            rows={1}
            disabled={isActive}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none leading-relaxed max-h-[120px] overflow-y-auto disabled:opacity-50"
          />

          {isActive ? (
            <button
              type="button"
              onClick={stop}
              className="shrink-0 w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors"
              aria-label="Detener generación"
            >
              <Square className="w-3 h-3 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!input.trim()}
              className="shrink-0 w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Enviar mensaje"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground/40 text-center mt-2">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
}
