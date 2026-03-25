"use client";

import { useParams } from "next/navigation";

/**
 * Wrapper that reads the `id` param client-side via useParams()
 * instead of relying on server-side params (baked at build time).
 */
export default function ClientIdPage({
  children,
}: {
  children: (id: string) => React.ReactNode;
}) {
  const params = useParams();
  const id = params.id as string;
  return <>{children(id)}</>;
}
