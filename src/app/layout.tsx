import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RouteLoadingFallback } from "@/components/RouteLoadingFallback";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Cal Sans SemiBold — display font for headings (Industrial Dark spec)
const calSans = localFont({
  src: "./fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal",
  weight: "600",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sonic — Music Analytics",
  description: "AI-First music streaming analytics dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${calSans.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-dvh font-sans">
        <Navbar />
        {/*
          ErrorBoundary wraps all routes so any unhandled render error shows
          a graceful UI instead of a blank screen.

          Suspense handles async Server Components and lazy-loaded client chunks;
          the fallback spinner appears while they stream in.
        */}
        <ErrorBoundary>
          <Suspense fallback={<RouteLoadingFallback />}>
            <main className="relative z-10 pt-16">{children}</main>
          </Suspense>
        </ErrorBoundary>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--foreground))",
            },
          }}
        />
      </body>
    </html>
  );
}
