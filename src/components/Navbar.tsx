"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User } from "lucide-react";

interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  image: string | null;
}

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Tracks", href: "/tracks" },
  { label: "Insights", href: "/dashboard/insights" },
];

export function Navbar() {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-md bg-black/30">
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

        {/* Nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors duration-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth area */}
        {user ? (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:border-accent/30 transition-all duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.display_name}
                  width={22}
                  height={22}
                  className="rounded-full"
                />
              ) : (
                <span className="w-[22px] h-[22px] rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="w-3 h-3 text-accent" />
                </span>
              )}
              <span className="text-sm text-foreground font-medium max-w-[120px] truncate">
                {user.display_name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-0.5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden">
                <div className="px-3 py-2.5 border-b border-border">
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <a
                  href="/api/auth/logout"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Cerrar sesión
                </a>
              </div>
            )}
          </div>
        ) : (
          <a
            href="/api/auth/spotify"
            className={[
              "shrink-0 px-4 py-2 rounded-lg text-sm font-medium",
              "border transition-all duration-400 ease-smooth",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "bg-accent border-accent text-white hover:opacity-90 hover:shadow-glow hover:scale-[1.03] active:scale-100",
            ].join(" ")}
          >
            Conectar Spotify
          </a>
        )}
      </nav>
    </header>
  );
}
