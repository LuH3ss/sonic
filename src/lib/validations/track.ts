import { z } from "zod";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * ISRC format: CCXXXYYNNNNNN (ISO 3901) — 12 alphanumeric chars, dashes stripped.
 * Example: "USS1Z9900001"
 */
const ISRC_REGEX = /^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/;

/** CUID v1 pattern used by Prisma @default(cuid()) */
const CUID_REGEX = /^c[a-z0-9]{24}$/;

/**
 * Accepted music genres — extend as the catalog grows.
 */
export const GENRES = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "R&B",
  "Electronic",
  "Jazz",
  "Classical",
  "Country",
  "Latin",
  "Reggae",
  "Metal",
  "Folk",
  "Indie",
  "Soul",
  "Other",
] as const;

export type Genre = (typeof GENRES)[number];

// ─── Schema ───────────────────────────────────────────────────────────────────

export const createTrackSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(200, "Title must be 200 characters or fewer"),

  isrc: z
    .string()
    .trim()
    .toUpperCase()
    .regex(ISRC_REGEX, "Invalid ISRC format (e.g. USS1Z9900001)")
    .optional(),

  genre: z
    .enum(GENRES, { error: `Genre must be one of: ${GENRES.join(", ")}` })
    .optional(),

  /**
   * Duration in milliseconds — must be between 1 s and 2 h.
   */
  durationMs: z
    .number()
    .int("Duration must be a whole number of milliseconds")
    .min(1_000, "Track must be at least 1 second long")
    .max(7_200_000, "Track cannot exceed 2 hours"),

  releaseDate: z
    .string()
    .date("Release date must be a valid ISO date (YYYY-MM-DD)")
    .transform((d) => new Date(d)),

  coverUrl: z.string().url("Cover URL must be a valid URL").optional().or(z.literal("")),

  /**
   * USD per stream rate — validated server-side so clients can't inflate royalties.
   * Typical range: $0.001 – $0.010 per stream.
   */
  royaltyRate: z
    .number()
    .positive("Royalty rate must be positive")
    .min(0.001, "Royalty rate must be at least $0.001 per stream")
    .max(0.01, "Royalty rate cannot exceed $0.01 per stream")
    .default(0.004),

  artistId: z
    .string()
    .regex(CUID_REGEX, "Artist ID must be a valid CUID"),
});

export type CreateTrackInput = z.input<typeof createTrackSchema>;
export type CreateTrackPayload = z.output<typeof createTrackSchema>;
