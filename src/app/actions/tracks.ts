"use server";

import { prisma } from "@/lib/prisma";
import { calculateArtistRoyalties } from "@/lib/royalties";

const TIERSO_ID = "ctierso000000000000000000";

// ─── Public types ─────────────────────────────────────────────────────────────

export interface TrackData {
  id: string;
  title: string;
  isrc: string | null;
  genre: string | null;
  /** Converted from Prisma BigInt — safe for JSON serialization */
  streams: number;
  /** Converted from Prisma Decimal */
  royaltyRate: number;
  releaseDate: string;
}

export interface DashboardData {
  tracks: TrackData[];
  totalStreams: number;
  totalGross: number;
  totalPlatformFee: number;
  totalNet: number;
}

// ─── Server Function ──────────────────────────────────────────────────────────

/**
 * Fetches all tracks for Tierso from Neon, then pipes them through
 * calculateArtistRoyalties to produce the full dashboard payload.
 *
 * BigInt (streams) and Decimal (royaltyRate) are serialized to plain numbers
 * so the result is safe to pass as props to Client Components.
 */
export async function getTiersoDashboard(): Promise<DashboardData> {
  const raw = await prisma.track.findMany({
    where: { artistId: TIERSO_ID },
    orderBy: { streams: "desc" },
  });

  const tracks: TrackData[] = raw.map((t) => ({
    id: t.id,
    title: t.title,
    isrc: t.isrc,
    genre: t.genre,
    streams: Number(t.streams),
    royaltyRate: Number(t.royaltyRate),
    releaseDate: t.releaseDate.toISOString(),
  }));

  const { totalStreams, totalGross, totalPlatformFee, totalNet } =
    calculateArtistRoyalties(
      tracks.map((t) => ({
        trackId: t.id,
        title: t.title,
        streams: t.streams,
        royaltyRate: t.royaltyRate,
      }))
    );

  return { tracks, totalStreams, totalGross, totalPlatformFee, totalNet };
}
