"use client";

import { usePathname } from "next/navigation";

/**
 * Reads the dynamic [id] segment from the current URL pathname.
 * Unlike useParams(), this works correctly with static export
 * because it reads from the browser URL, not the pre-rendered data.
 */
export function useRouteId(): string {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] || "";
}
