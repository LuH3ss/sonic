"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Dashboard", href: "#" },
  { label: "Analytics", href: "#" },
  { label: "Tracks", href: "#" },
  { label: "Insights", href: "#" },
];

export function Navbar() {
  const [connected, setConnected] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] backdrop-blur-md bg-black/30">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span className="w-7 h-7 rounded-md bg-accent flex items-center justify-center text-white text-xs font-bold tracking-tight group-hover:shadow-glow transition-shadow duration-400">
            S
          </span>
          <span className="text-foreground font-semibold text-sm tracking-tight">
            Sonic
          </span>
        </Link>

        {/* Center nav links — hidden on mobile */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="px-3 py-1.5 rounded-md text-sm text-muted hover:text-foreground transition-colors duration-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Connect button */}
        <button
          onClick={() => setConnected((prev) => !prev)}
          className={[
            "shrink-0 px-4 py-2 rounded-lg text-sm font-medium",
            "border transition-all duration-400 ease-smooth",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            connected
              ? "bg-accent/10 border-accent text-accent hover:bg-accent/20 hover:shadow-glow-sm"
              : "bg-accent border-accent text-white hover:bg-accent-hover hover:shadow-glow hover:scale-[1.03] active:scale-100",
          ].join(" ")}
        >
          {connected ? "● Connected" : "Connect Wallet / Spotify"}
        </button>
      </nav>
    </header>
  );
}
