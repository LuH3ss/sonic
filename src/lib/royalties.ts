// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrackRoyaltyInput {
  trackId: string;
  title: string;
  /** Cumulative stream count (use number for JS-safe integers, BigInt for DB values) */
  streams: number;
  /** USD per stream, e.g. 0.004 */
  royaltyRate: number;
}

export interface TrackRoyaltyResult extends TrackRoyaltyInput {
  /** Gross earnings before platform cut, rounded to 6 decimal places */
  grossEarnings: number;
  /** Platform cut (30 %) */
  platformFee: number;
  /** Net earnings after the platform cut, rounded to 2 decimal places */
  netEarnings: number;
}

export interface ArtistRoyaltySummary {
  tracks: TrackRoyaltyResult[];
  totalStreams: number;
  totalGross: number;
  totalPlatformFee: number;
  totalNet: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Platform revenue share: 30 % of gross earnings */
export const PLATFORM_FEE_RATE = 0.3;

// ─── Core function ────────────────────────────────────────────────────────────

/**
 * Calculate gross and net royalty earnings for an artist across all their tracks.
 *
 * Formula:
 *   grossEarnings  = streams × royaltyRate
 *   platformFee    = grossEarnings × PLATFORM_FEE_RATE
 *   netEarnings    = grossEarnings − platformFee
 *
 * @param tracks - Array of track objects with stream counts and royalty rates.
 * @returns A summary object with per-track breakdowns and aggregated totals.
 * @throws {Error} If any track has negative streams or a non-positive royaltyRate.
 */
export function calculateArtistRoyalties(
  tracks: TrackRoyaltyInput[]
): ArtistRoyaltySummary {
  if (!Array.isArray(tracks)) {
    throw new TypeError("tracks must be an array");
  }

  const results: TrackRoyaltyResult[] = tracks.map((track) => {
    if (track.streams < 0) {
      throw new RangeError(
        `Track "${track.title}" has negative streams (${track.streams})`
      );
    }
    if (track.royaltyRate <= 0) {
      throw new RangeError(
        `Track "${track.title}" has a non-positive royaltyRate (${track.royaltyRate})`
      );
    }

    const grossEarnings =
      Math.round(track.streams * track.royaltyRate * 1_000_000) / 1_000_000;
    const platformFee =
      Math.round(grossEarnings * PLATFORM_FEE_RATE * 1_000_000) / 1_000_000;
    const netEarnings = Math.round((grossEarnings - platformFee) * 100) / 100;

    return { ...track, grossEarnings, platformFee, netEarnings };
  });

  const totalStreams = results.reduce((sum, t) => sum + t.streams, 0);
  const totalGross =
    Math.round(results.reduce((sum, t) => sum + t.grossEarnings, 0) * 100) /
    100;
  const totalPlatformFee =
    Math.round(results.reduce((sum, t) => sum + t.platformFee, 0) * 100) / 100;
  const totalNet =
    Math.round(results.reduce((sum, t) => sum + t.netEarnings, 0) * 100) / 100;

  return { tracks: results, totalStreams, totalGross, totalPlatformFee, totalNet };
}
