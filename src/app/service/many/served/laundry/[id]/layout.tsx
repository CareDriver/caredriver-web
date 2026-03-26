import { ReactNode } from "react";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
