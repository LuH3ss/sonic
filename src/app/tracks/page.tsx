import type { Metadata } from "next";
import { Music2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tracks — Sonic",
};

const TIERSO_ID = "ctierso000000000000000000";

export default async function TracksPage() {
  const tracks = await prisma.track.findMany({
    where: { artistId: TIERSO_ID },
    orderBy: { streams: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Music2 className="w-4 h-4 text-accent" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Tracks</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {tracks.length} tracks en el catálogo · ordenados por streams
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">#</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Título</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">Género</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">ISRC</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">Streams</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">Royalty rate</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, i) => (
              <tr
                key={track.id}
                className="border-b border-border last:border-0 hover:bg-card/50 transition-colors"
              >
                <td className="px-4 py-3.5 text-muted-foreground tabular-nums">{i + 1}</td>
                <td className="px-4 py-3.5 text-foreground font-medium">{track.title}</td>
                <td className="px-4 py-3.5 text-muted-foreground hidden sm:table-cell">
                  {track.genre ?? "—"}
                </td>
                <td className="px-4 py-3.5 text-muted-foreground font-mono text-xs hidden md:table-cell">
                  {track.isrc ?? "—"}
                </td>
                <td className="px-4 py-3.5 text-foreground text-right tabular-nums">
                  {Number(track.streams).toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3.5 text-muted-foreground text-right tabular-nums hidden sm:table-cell">
                  ${Number(track.royaltyRate).toFixed(5)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
