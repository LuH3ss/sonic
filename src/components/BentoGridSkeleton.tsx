import { Skeleton } from "@/components/ui/Skeleton";

// ─── Individual card skeletons ────────────────────────────────────────────────

/** Large hero card — streams chart area */
function HeroCardSkeleton() {
  return (
    <div className="col-span-2 row-span-2 rounded-xl border border-[#1a1a1a] bg-card p-6 flex flex-col gap-4">
      {/* Card header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>

      {/* Fake chart area */}
      <Skeleton className="flex-1 min-h-[160px] rounded-lg" />

      {/* Bottom metric row */}
      <div className="flex gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Small stat card (streams, revenue, listeners…) */
function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        {/* Icon placeholder */}
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
      {/* Big number */}
      <Skeleton className="h-8 w-32" />
      {/* Trend badge */}
      <Skeleton className="h-3 w-24 rounded-full" />
    </div>
  );
}

/** Top tracks list card */
function TrackListSkeleton() {
  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-card p-5 flex flex-col gap-3">
      <Skeleton className="h-4 w-24 mb-1" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          {/* Album art */}
          <Skeleton className="h-9 w-9 rounded-md shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
          {/* Stream count */}
          <Skeleton className="h-3 w-12 shrink-0" />
        </div>
      ))}
    </div>
  );
}

/** Royalties summary card */
function RoyaltiesCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-card p-5 flex flex-col gap-4">
      <Skeleton className="h-4 w-28" />
      {/* Donut chart placeholder */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-2.5 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Full bento layout ────────────────────────────────────────────────────────

/**
 * Drop-in loading state for the main dashboard bento grid.
 *
 * Layout (desktop, 3-column grid):
 *   ┌─────────────────┬──────────┐
 *   │  HeroCard (2×2) │  Stat 1  │
 *   │                 ├──────────┤
 *   │                 │  Stat 2  │
 *   ├────────┬─────────┴──────────┤
 *   │Tracks  │  Royalties         │
 *   └────────┴────────────────────┘
 */
export function BentoGridSkeleton() {
  return (
    <section
      aria-label="Loading dashboard"
      aria-busy="true"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6"
    >
      <HeroCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <TrackListSkeleton />
      <RoyaltiesCardSkeleton />
    </section>
  );
}
