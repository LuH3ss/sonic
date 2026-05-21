"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";
import { TrendingUp, DollarSign, Music2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardData, TrackData } from "@/app/actions/tracks";

// ─── Animated counter ─────────────────────────────────────────────────────────

/**
 * Counts up from 0 → `to` over ~1.8s using Framer Motion's animate utility.
 * Uses a ref to write directly to the DOM, avoiding React re-renders on every tick.
 */
function AnimatedCounter({
  to,
  className,
}: {
  to: number;
  className?: string;
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        node.textContent = Math.floor(v).toLocaleString("en-US");
      },
    });
    return () => controls.stop();
  }, [to]);

  return (
    <span ref={nodeRef} className={className}>
      0
    </span>
  );
}

// ─── Shared card wrapper ──────────────────────────────────────────────────────

function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 flex flex-col gap-4",
        "hover:border-white/[0.08] transition-colors duration-400",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Card 1: Total Streams ────────────────────────────────────────────────────

function StreamsCard({
  totalStreams,
  trackCount,
}: {
  totalStreams: number;
  trackCount: number;
}) {
  return (
    <Card className="col-span-1 sm:col-span-2 lg:col-span-2 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Total de Streams
        </p>
        <span className="flex items-center gap-1.5 text-xs text-accent bg-accent/10 rounded-full px-2.5 py-1 shrink-0">
          <TrendingUp className="w-3 h-3" />
          {trackCount} tracks
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <AnimatedCounter
          to={totalStreams}
          className="text-5xl sm:text-6xl font-semibold tracking-tight text-foreground tabular-nums"
        />
        <span className="text-muted-foreground text-xl">plays</span>
      </div>

      <p className="text-xs text-muted-foreground mt-auto">
        Streams acumulados en todo el catálogo
      </p>
    </Card>
  );
}

// ─── Card 2: Net Earnings ─────────────────────────────────────────────────────

function EarningsCard({
  totalNet,
  totalGross,
  totalPlatformFee,
}: {
  totalNet: number;
  totalGross: number;
  totalPlatformFee: number;
}) {
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <Card className="col-span-1">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Ganancias Netas
        </p>
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <DollarSign className="w-4 h-4 text-accent" />
        </div>
      </div>

      <p className="text-4xl font-semibold tracking-tight text-foreground">
        {fmt(totalNet)}
      </p>

      <div className="flex flex-col gap-2 pt-3 border-t border-border mt-auto">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Gross earnings</span>
          <span className="text-foreground tabular-nums">{fmt(totalGross)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Platform fee (30%)</span>
          <span className="text-destructive tabular-nums">
            −{fmt(totalPlatformFee)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-muted-foreground">Net</span>
          <span className="text-accent tabular-nums">{fmt(totalNet)}</span>
        </div>
      </div>
    </Card>
  );
}

// ─── Card 3: Top 3 Tracks ─────────────────────────────────────────────────────

function TopTracksCard({ tracks }: { tracks: TrackData[] }) {
  const top3 = tracks.slice(0, 3);

  return (
    <Card className="col-span-1">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Top Tracks
        </p>
        <Music2 className="w-4 h-4 text-muted-foreground" />
      </div>

      <ol className="flex flex-col gap-4">
        {top3.map((track, idx) => (
          <li key={track.id} className="flex items-center gap-3">
            {/* Rank badge */}
            <span className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center text-[11px] font-bold text-accent shrink-0">
              {idx + 1}
            </span>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate leading-snug">
                {track.title}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {track.genre && (
                  <span className="text-[10px] text-muted-foreground bg-white/[0.05] rounded px-1.5 py-0.5 leading-none">
                    {track.genre}
                  </span>
                )}
                {track.isrc && (
                  <span className="text-[10px] text-muted-foreground font-mono truncate">
                    {track.isrc}
                  </span>
                )}
              </div>
            </div>

            {/* Stream count */}
            <span className="text-xs font-medium text-muted-foreground tabular-nums shrink-0">
              {track.streams.toLocaleString("en-US")}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

// ─── Card 4: AI Insights placeholder ─────────────────────────────────────────

function AIInsightsCard() {
  return (
    <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-none">
            Sonic AI
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Insights inteligentes sobre tu catálogo
          </p>
        </div>
        <span className="text-[10px] text-accent bg-accent/10 rounded-full px-2.5 py-1 font-medium shrink-0">
          Próximamente
        </span>
      </div>

      {/* Skeleton lines simulating AI output */}
      <div className="flex flex-col gap-2.5">
        {[
          { w: "82%", delay: "0ms" },
          { w: "64%", delay: "120ms" },
          { w: "48%", delay: "240ms" },
        ].map(({ w, delay }, i) => (
          <div
            key={i}
            className="h-2.5 rounded-full bg-white/[0.05] animate-pulse"
            style={{ width: w, animationDelay: delay }}
          />
        ))}
      </div>

      {/* Feature preview */}
      <div className="mt-auto border border-dashed border-border rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {[
            "Análisis de tendencias",
            "Predicción de royalties",
            "Recomendaciones de release",
          ].map((feat) => (
            <span
              key={feat}
              className="text-[11px] text-muted-foreground bg-white/[0.03] border border-border rounded-md px-2.5 py-1"
            >
              {feat}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── BentoGrid ────────────────────────────────────────────────────────────────

/**
 * Bento grid layout:
 *
 *  desktop (3-col):
 *  ┌─────────────────────────┬────────────┐
 *  │  Total Streams  (2/3)   │ Earnings   │
 *  ├────────────┬────────────┤  (1/3)     │
 *  │ Top Tracks │  AI Insights (2/3)      │
 *  │  (1/3)     │                         │
 *  └────────────┴────────────────────────┘
 */
export function BentoGrid({ data }: { data: DashboardData }) {
  return (
    <section
      aria-label="Dashboard overview"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <StreamsCard
        totalStreams={data.totalStreams}
        trackCount={data.tracks.length}
      />
      <EarningsCard
        totalNet={data.totalNet}
        totalGross={data.totalGross}
        totalPlatformFee={data.totalPlatformFee}
      />
      <TopTracksCard tracks={data.tracks} />
      <AIInsightsCard />
    </section>
  );
}
