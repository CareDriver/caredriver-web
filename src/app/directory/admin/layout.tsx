"use client";

import AdminClaimGuard from "@/components/guards/AdminClaimGuard";
import { AdminPanelProvider } from "@/components/directory/admin-panel/AdminPanelContext";
import AdminPanelLayout from "@/components/directory/admin-panel/AdminPanelLayout";

/**
 * Layout for the CareDriver admin panel area.
 *
 * Route prefix: `/directory/admin/*`
 *
 * Protected by `AdminClaimGuard`, which validates the Firebase custom claim
 * `admin: true` from the user's JWT. This is the canonical protection for all
 * CareDriver admin functionality.
 */
export default function DirectoryAdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminClaimGuard fallbackUrl="/auth/signin">
      <AdminPanelProvider>
        <AdminPanelLayout>{children}</AdminPanelLayout>
      </AdminPanelProvider>
    </AdminClaimGuard>
  );
}
