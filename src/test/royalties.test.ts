import { describe, it, expect } from "vitest";
import {
  calculateArtistRoyalties,
  PLATFORM_FEE_RATE,
  type TrackRoyaltyInput,
} from "@/lib/royalties";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const singleTrack: TrackRoyaltyInput[] = [
  {
    trackId: "track_1",
    title: "Neon Drift",
    streams: 1_000_000,
    royaltyRate: 0.004,
  },
];

const multiTrack: TrackRoyaltyInput[] = [
  { trackId: "track_1", title: "Neon Drift", streams: 1_000_000, royaltyRate: 0.004 },
  { trackId: "track_2", title: "Solar Flare", streams: 500_000, royaltyRate: 0.005 },
  { trackId: "track_3", title: "Empty Space", streams: 0, royaltyRate: 0.004 },
];

// ─── Gross / net calculations ─────────────────────────────────────────────────

describe("calculateArtistRoyalties — single track", () => {
  it("computes gross earnings correctly (streams × royaltyRate)", () => {
    const { tracks } = calculateArtistRoyalties(singleTrack);
    // 1_000_000 × 0.004 = 4000
    expect(tracks[0].grossEarnings).toBe(4000);
  });

  it("deducts the platform fee (30 % of gross)", () => {
    const { tracks } = calculateArtistRoyalties(singleTrack);
    expect(tracks[0].platformFee).toBeCloseTo(4000 * PLATFORM_FEE_RATE, 2);
  });

  it("returns net earnings equal to gross minus platform fee", () => {
    const { tracks } = calculateArtistRoyalties(singleTrack);
    const { grossEarnings, platformFee, netEarnings } = tracks[0];
    expect(netEarnings).toBeCloseTo(grossEarnings - platformFee, 2);
  });
});

// ─── Aggregated totals ────────────────────────────────────────────────────────

describe("calculateArtistRoyalties — multiple tracks", () => {
  it("sums totalStreams across all tracks", () => {
    const { totalStreams } = calculateArtistRoyalties(multiTrack);
    expect(totalStreams).toBe(1_500_000);
  });

  it("sums totalGross correctly", () => {
    const { totalGross } = calculateArtistRoyalties(multiTrack);
    // track_1: 4000, track_2: 2500, track_3: 0 → 6500
    expect(totalGross).toBe(6500);
  });

  it("totalNet equals totalGross minus totalPlatformFee", () => {
    const { totalGross, totalPlatformFee, totalNet } =
      calculateArtistRoyalties(multiTrack);
    expect(totalNet).toBeCloseTo(totalGross - totalPlatformFee, 2);
  });

  it("returns zero earnings for a track with 0 streams", () => {
    const { tracks } = calculateArtistRoyalties(multiTrack);
    const emptyTrack = tracks.find((t) => t.trackId === "track_3")!;
    expect(emptyTrack.grossEarnings).toBe(0);
    expect(emptyTrack.netEarnings).toBe(0);
  });
});

// ─── Empty catalogue ──────────────────────────────────────────────────────────

describe("calculateArtistRoyalties — edge cases", () => {
  it("returns all-zero summary for an empty track list", () => {
    const result = calculateArtistRoyalties([]);
    expect(result.tracks).toHaveLength(0);
    expect(result.totalStreams).toBe(0);
    expect(result.totalGross).toBe(0);
    expect(result.totalNet).toBe(0);
  });

  it("preserves original track metadata in results", () => {
    const { tracks } = calculateArtistRoyalties(singleTrack);
    expect(tracks[0].trackId).toBe("track_1");
    expect(tracks[0].title).toBe("Neon Drift");
  });
});

// ─── Input validation / guard clauses ─────────────────────────────────────────

describe("calculateArtistRoyalties — invalid inputs", () => {
  it("throws RangeError when a track has negative streams", () => {
    expect(() =>
      calculateArtistRoyalties([
        { trackId: "x", title: "Bad Track", streams: -1, royaltyRate: 0.004 },
      ])
    ).toThrow(RangeError);
  });

  it("throws RangeError when royaltyRate is zero", () => {
    expect(() =>
      calculateArtistRoyalties([
        { trackId: "x", title: "Bad Track", streams: 100, royaltyRate: 0 },
      ])
    ).toThrow(RangeError);
  });

  it("throws RangeError when royaltyRate is negative", () => {
    expect(() =>
      calculateArtistRoyalties([
        { trackId: "x", title: "Bad Track", streams: 100, royaltyRate: -0.002 },
      ])
    ).toThrow(RangeError);
  });

  it("throws TypeError when argument is not an array", () => {
    expect(() =>
      // @ts-expect-error intentional wrong type for runtime test
      calculateArtistRoyalties(null)
    ).toThrow(TypeError);
  });
});
