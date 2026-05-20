import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

// Node.js < 22 doesn't have a global WebSocket — polyfill with `ws`.
if (typeof globalThis.WebSocket === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  neonConfig.webSocketConstructor = require("ws");
}

// ─── Client ───────────────────────────────────────────────────────────────────

// PrismaNeon accepts a PoolConfig directly — no Pool instance needed.
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// ─── Seed data ────────────────────────────────────────────────────────────────

/**
 * Fixed artist ID — stable across re-runs so relations stay consistent.
 * Matches CUID v1 format: c + 24 lowercase alphanumeric chars.
 */
const ARTIST_ID = "ctierso000000000000000000";

const tracks = [
  {
    title: "Espejo Roto",
    isrc: "ARF502400001",
    genre: "Soul",
    durationMs: 214_000,
    releaseDate: new Date("2024-03-15"),
    streams: BigInt(1_872_450),
    royaltyRate: 0.005,
  },
  {
    title: "Madrugada",
    isrc: "ARF502400002",
    genre: "Jazz",
    durationMs: 287_500,
    releaseDate: new Date("2024-05-20"),
    streams: BigInt(956_200),
    royaltyRate: 0.006,
  },
  {
    title: "Ciudad de Luz",
    isrc: "ARF502400003",
    genre: "Pop",
    durationMs: 193_000,
    releaseDate: new Date("2024-07-04"),
    streams: BigInt(2_011_800),
    royaltyRate: 0.004,
  },
  {
    title: "Río Hondo",
    isrc: "ARF502400004",
    genre: "Soul",
    durationMs: 241_000,
    releaseDate: new Date("2024-08-18"),
    streams: BigInt(674_900),
    royaltyRate: 0.005,
  },
  {
    title: "Viento Sur",
    isrc: "ARF502400005",
    genre: "Jazz",
    durationMs: 312_000,
    releaseDate: new Date("2024-09-30"),
    streams: BigInt(312_750),
    royaltyRate: 0.007,
  },
  {
    title: "Noche Eterna",
    isrc: "ARF502400006",
    genre: "Pop",
    durationMs: 208_000,
    releaseDate: new Date("2024-11-08"),
    streams: BigInt(1_245_600),
    royaltyRate: 0.004,
  },
  {
    title: "Terciopelo",
    isrc: "ARF502500001",
    genre: "Soul",
    durationMs: 264_000,
    releaseDate: new Date("2025-01-22"),
    streams: BigInt(88_400),
    royaltyRate: 0.005,
  },
  {
    title: "El Último Tren",
    isrc: "ARF502500002",
    genre: "Jazz",
    durationMs: 339_500,
    releaseDate: new Date("2025-03-10"),
    streams: BigInt(51_300),
    royaltyRate: 0.008,
  },
  {
    title: "Lluvia de Abril",
    isrc: "ARF502500003",
    genre: "Pop",
    durationMs: 182_000,
    releaseDate: new Date("2025-04-28"),
    streams: BigInt(430_200),
    royaltyRate: 0.004,
  },
] as const;

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...\n");

  const artist = await prisma.user.upsert({
    where: { id: ARTIST_ID },
    update: {},
    create: {
      id: ARTIST_ID,
      name: "Tierso",
      email: "tierso@sonic.app",
      role: "ARTIST",
      avatarUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=tierso",
    },
  });

  console.log(`✅ Artist upserted — ${artist.name} (${artist.id})\n`);

  for (const track of tracks) {
    const { isrc, ...rest } = track;

    const upserted = await prisma.track.upsert({
      where: { isrc },
      update: { streams: rest.streams, royaltyRate: rest.royaltyRate },
      create: { ...rest, isrc, artistId: ARTIST_ID },
    });

    const streams = upserted.streams.toLocaleString("en-US");
    console.log(
      `  🎵 ${upserted.title.padEnd(22)} | ${upserted.genre?.padEnd(5)} | ${streams.padStart(12)} streams`,
    );
  }

  console.log(`\n✅ Seed complete — ${tracks.length} tracks linked to Tierso.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
