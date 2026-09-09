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
 * Guard that protects admin routes by Firebase custom claim `admin: true`.
 *
 * This is the canonical guard for the CareDriver admin panel.
 * It checks the JWT custom claim set by the backend, NOT the Firestore role field.
 *
 * For legacy role-based guards (UserRole enum from Firestore), use GuardOfPage.
 */
const AdminClaimGuard: React.FC<Props> = ({
  children,
  fallbackUrl = "/",
}) => {
  const { checkingUserAuth, isAdminClaim } = useContext(AuthContext);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!checkingUserAuth) {
      if (!isAdminClaim) {
        toast.error("Acceso denegado: se requieren privilegios de administrador", {
          toastId: "admin-claim-guard",
        });
        router.replace(fallbackUrl);
      } else {
        setAuthorized(true);
      }
    }
  }, [checkingUserAuth, isAdminClaim, router, fallbackUrl]);

  return checkingUserAuth || !authorized ? <PageLoading /> : <>{children}</>;
};

export default AdminClaimGuard;
