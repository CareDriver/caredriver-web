"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/interfaces/UserInterface";
import { toast } from "react-toastify";
import PageLoading from "../../../loaders/PageLoading";
import { fetchUserDirectoryEnterprise } from "@/utils/requesters/DirectoryRequester";

const UserRedirect = () => {
  const { checkingUserAuth, user, isAdminClaim } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const handleRedirect = async () => {
      if (!checkingUserAuth && user) {
        toast.success("Inicio de sesión exitoso", {
          toastId: "login-init-toas",
        });

        // 1. Administrador (Custom claim o Rol Admin en base de datos)
        if (isAdminClaim || user.role === UserRole.Admin) {
          router.push("/directory/admin");
          return;
        }

        // 2. Roles de soporte o recarga
        if (
          user.role === UserRole.Support ||
          user.role === UserRole.SupportTwo ||
          user.role === UserRole.BalanceRecharge
        ) {
          router.push("/directory/admin");
          return;
        }

        // 3. Negocio / Taller (verificar si tiene empresa aprobada como dueño o miembro)
        try {
          const enterprise = await fetchUserDirectoryEnterprise();
          if (!isMounted) return;

          if (enterprise) {
            router.push("/directory/business");
            return;
          }
        } catch (e) {
          console.error("Error al buscar negocio asociado al usuario:", e);
        }

        // 4. Usuario sin negocio registrado -> Registro de negocio
        router.push("/directory/register");
      }
    };

    handleRedirect();

    return () => {
      isMounted = false;
    };
  }, [checkingUserAuth, user, isAdminClaim, router]);

  return <PageLoading />;
};

export default UserRedirect;
