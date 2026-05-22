import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics — Sonic",
};

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-accent" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Análisis detallado de performance por período, plataforma y región.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {["Revenue over time", "Streams by platform", "Geographic breakdown", "Genre performance", "Monthly growth", "Royalty trends"].map((label) => (
          <div
            key={label}
            className="h-48 rounded-xl border border-border bg-card flex flex-col items-center justify-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/50 text-center mt-8">
        Próximamente — conectá tu catálogo para ver métricas reales
      </p>
    </div>
  );
}
