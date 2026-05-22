import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { InsightsChat } from "@/components/dashboard/InsightsChat";

export const metadata: Metadata = {
  title: "Insights — Sonic Analytics",
  description: "AI-powered music strategy with Claude 3.5 Sonnet",
};

export default function InsightsPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col" style={{ height: "calc(100dvh - 64px)" }}>
      {/* Header */}
      <header className="py-5 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground leading-none">
              Sonic AI
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Llama 3.3 70B · Datos reales de Tierso
            </p>
          </div>
          <span className="ml-auto text-[10px] font-medium tracking-wide text-accent bg-accent/10 border border-accent/20 rounded-full px-2.5 py-1">
            LIVE
          </span>
        </div>
      </header>

      {/* Chat */}
      <InsightsChat />
    </section>
  );
}
