import { Suspense } from "react";
import type { Metadata } from "next";
import { getTiersoDashboard } from "@/app/actions/tracks";
import { BentoGrid } from "@/components/dashboard/BentoGrid";
import { BentoGridSkeleton } from "@/components/BentoGridSkeleton";

export const metadata: Metadata = {
  title: "Dashboard — Sonic Analytics",
  description: "Streaming analytics and royalty insights for Tierso",
};

// ─── Inner async component ────────────────────────────────────────────────────
// Separating data-fetching into its own async Server Component lets Next.js
// stream the page: the outer shell renders immediately and Suspense shows the
// BentoGridSkeleton while Neon responds.

async function DashboardContent() {
  const data = await getTiersoDashboard();
  return <BentoGrid data={data} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <header className="mb-8">
        <p className="text-xs font-medium text-accent uppercase tracking-widest mb-1">
          Artista
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Tierso
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Resumen de streaming y royalties en tiempo real
        </p>
      </header>

      <Suspense fallback={<BentoGridSkeleton />}>
        <DashboardContent />
      </Suspense>
    </section>
  );
}
