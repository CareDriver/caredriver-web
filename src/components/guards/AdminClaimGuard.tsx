"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import PageLoading from "@/components/loaders/PageLoading";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserRole } from "@/interfaces/UserInterface";

interface Props {
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * Guard that protects admin routes by Firebase custom claim `admin: true`
 * or Firestore role `UserRole.Admin`.
 */
const AdminClaimGuard: React.FC<Props> = ({ children, fallbackUrl = "/" }) => {
  const { checkingUserAuth, isAdminClaim, user } = useContext(AuthContext);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("🛡️ [AdminClaimGuard] Status:", {
      checkingUserAuth,
      userEmail: user?.email,
      userRole: user?.role,
      isAdminClaim,
    });

    if (!checkingUserAuth) {
      const isAdmin = isAdminClaim || user?.role === UserRole.Admin;
      if (!isAdmin) {
        console.warn(
          "⛔ [AdminClaimGuard] User is not admin! Redirecting to",
          fallbackUrl,
        );
        toast.error(
          "Acceso denegado: se requieren privilegios de administrador",
          {
            toastId: "admin-claim-guard",
          },
        );
        router.replace(fallbackUrl);
      } else {
        console.log(
          "🔓 [AdminClaimGuard] Admin access granted for:",
          user?.email,
        );
        setAuthorized(true);
      }
    }
  }, [checkingUserAuth, isAdminClaim, user, router, fallbackUrl]);

  return checkingUserAuth || !authorized ? <PageLoading /> : <>{children}</>;
};

export default AdminClaimGuard;
