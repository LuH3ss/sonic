import { type HTMLAttributes } from "react";

/**
 * Base shimmer block. Use it wherever a piece of content is loading.
 *
 * Examples:
 *   <Skeleton className="h-4 w-32" />          — one-liner
 *   <Skeleton className="h-40 w-full rounded-xl" />  — card thumbnail
 */
export function Skeleton({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-white/[0.05] ${className}`}
      {...props}
    />
  );
}
