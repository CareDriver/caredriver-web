"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import PageLoading from "@/components/loaders/PageLoading";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * Guard for the directory business panel (`/directory/business/*`).
 *
 * Current scope (Prompt Maestro):
 * - Ensures the user is authenticated.
 * - Redirects unauthenticated users to the sign-in page.
 *
 * Future scope (Prompt 01):
 * - Add enterprise membership verification: the user must be an owner or
 *   member (`admin` | `marketing`) of at least one directory enterprise.
 * - Use the enterprise membership helper once the directory enterprise
 *   request/approval flow is wired in the web panel.
 */
const BusinessPanelGuard: React.FC<Props> = ({
  children,
  fallbackUrl = "/auth/signin",
}) => {
  const { checkingUserAuth, user } = useContext(AuthContext);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!checkingUserAuth) {
      if (!user) {
        toast.error("Iniciá sesión para acceder al panel de negocio", {
          toastId: "business-panel-guard",
        });
        router.replace(fallbackUrl);
      } else {
        setAuthorized(true);
      }
    }
  }, [checkingUserAuth, user, router, fallbackUrl]);

  return checkingUserAuth || !authorized ? <PageLoading /> : <>{children}</>;
};

export default BusinessPanelGuard;
