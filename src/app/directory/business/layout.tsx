"use client";

import BusinessPanelGuard from "@/components/guards/BusinessPanelGuard";
import { BusinessPanelProvider } from "@/components/directory/business-panel/BusinessPanelContext";
import BusinessPanelLayout from "@/components/directory/business-panel/BusinessPanelLayout";

/**
 * Layout for the directory business panel area.
 *
 * Route prefix: `/directory/business/*`
 *
 * Protected by `BusinessPanelGuard` and wrapped with `BusinessPanelProvider`,
 * which loads the enterprise, sets up real-time listeners and resolves role.
 */
export default function DirectoryBusinessRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessPanelGuard>
      <BusinessPanelProvider>
        <BusinessPanelLayout>{children}</BusinessPanelLayout>
      </BusinessPanelProvider>
    </BusinessPanelGuard>
  );
}
