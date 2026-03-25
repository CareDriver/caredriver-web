"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  EnterpriseMemberRoleRender,
  EnterpriseRequest,
} from "@/interfaces/Enterprise";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/FirebaseConfig";
import { Collections } from "@/firebase/CollecionNames";
import { Enterprise } from "@/interfaces/Enterprise";
import { updateEnterprise } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { toast } from "react-toastify";
import Handshake from "@/icons/Handshake";

/**
 * Shown in the ServerServicesHub when the user has pending enterprise
 * membership invitations they need to accept or decline.
 *
 * We search the `enterprises` collection for docs where
 * the `members` array contains an entry with this user's fakeId that
 * has `accepted: false`.
 */
const EnterpriseMembershipBanner = () => {
  const { user } = useContext(AuthContext);
  const [pendingEnterprises, setPendingEnterprises] = useState<Enterprise[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.fakeId) {
      setLoading(false);
      return;
    }

    // Query enterprises where this user appears as a member
    const enterpriseCol = collection(firestore, Collections.Enterprises);

    // We search for enterprises that have this user in collaboratorUserIds or adminUserIds
    const q1 = query(
      enterpriseCol,
      where("collaboratorUserIds", "array-contains", user.fakeId),
      where("active", "==", true),
      where("deleted", "==", false),
    );
    const q2 = query(
      enterpriseCol,
      where("adminUserIds", "array-contains", user.fakeId),
      where("active", "==", true),
      where("deleted", "==", false),
    );

    Promise.all([getDocs(q1), getDocs(q2)])
      .then(([snap1, snap2]) => {
        const enterprises: Enterprise[] = [];
        const seen = new Set<string>();

        const processDocs = (snap: typeof snap1) => {
          snap.docs.forEach((d) => {
            if (seen.has(d.id)) return;
            seen.add(d.id);
            const data = d.data() as Enterprise;
            data.id = d.id;
            // Check if current user has a pending (not accepted) membership
            const hasPending = data.members?.some(
              (m) =>
                (m.userId === user.id || m.fakeUserId === user.fakeId) &&
                !m.accepted,
            );
            if (hasPending) {
              enterprises.push(data);
            }
          });
        };

        processDocs(snap1);
        processDocs(snap2);

        setPendingEnterprises(enterprises);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleAccept = async (enterprise: Enterprise) => {
    if (!user || actionLoading) return;
    setActionLoading(enterprise.id ?? null);

    const updatedMembers = enterprise.members.map((m) =>
      m.userId === user.id || m.fakeUserId === user.fakeId
        ? { ...m, accepted: true, userId: user.id!, fakeUserId: user.fakeId! }
        : m,
    );

    try {
      await toast.promise(
        updateEnterprise(enterprise.id!, { members: updatedMembers }),
        {
          pending: "Aceptando membresía...",
          success: `¡Ahora eres parte de ${enterprise.name}!`,
          error: "Error al aceptar la membresía",
        },
      );
      setPendingEnterprises((prev) =>
        prev.filter((e) => e.id !== enterprise.id),
      );
    } catch {
      // error handled by toast
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (enterprise: Enterprise) => {
    if (!user || actionLoading) return;
    setActionLoading(enterprise.id ?? null);

    const updatedMembers = enterprise.members.filter(
      (m) => m.userId !== user.id && m.fakeUserId !== user.fakeId,
    );
    const updatedCollabIds = enterprise.collaboratorUserIds.filter(
      (id) => id !== user.fakeId,
    );
    const updatedAdminIds = enterprise.adminUserIds.filter(
      (id) => id !== user.fakeId,
    );

    try {
      await toast.promise(
        updateEnterprise(enterprise.id!, {
          members: updatedMembers,
          collaboratorUserIds: updatedCollabIds,
          adminUserIds: updatedAdminIds,
        }),
        {
          pending: "Rechazando membresía...",
          success: "Membresía rechazada",
          error: "Error al rechazar la membresía",
        },
      );
      setPendingEnterprises((prev) =>
        prev.filter((e) => e.id !== enterprise.id),
      );
    } catch {
      // error handled by toast
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || pendingEnterprises.length === 0) {
    return null;
  }

  return (
    <div className="margin-bottom-25">
      {pendingEnterprises.map((enterprise) => {
        const member = enterprise.members?.find(
          (m) => m.userId === user?.id || m.fakeUserId === user?.fakeId,
        );
        const roleName = member
          ? EnterpriseMemberRoleRender[member.role]
          : "Miembro";

        return (
          <div
            key={enterprise.id}
            className="card padded margin-bottom-15"
            style={{
              backgroundColor: "#fffbe6",
              border: "1px solid #ffe58f",
            }}
          >
            <div
              className="row-wrapper | gap-15"
              style={{ alignItems: "center" }}
            >
              <Handshake />
              <div style={{ flex: 1 }}>
                <h3 className="text | bold">
                  Invitación a empresa: {enterprise.name}
                </h3>
                <p className="text | light margin-top-5">
                  Te han invitado como <b>{roleName}</b> de esta empresa.
                  {member?.isAlsoCollaborator &&
                    " También serás colaborador activo."}
                </p>
              </div>
              {enterprise.logoImgUrl?.url && (
                <img
                  src={enterprise.logoImgUrl.url}
                  alt=""
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              )}
            </div>
            <div className="row-wrapper | gap-10 margin-top-15">
              <button
                className="small-general-button text | bold"
                onClick={() => handleAccept(enterprise)}
                disabled={actionLoading === enterprise.id}
              >
                Aceptar
              </button>
              <button
                className="small-general-button text | bold gray"
                onClick={() => handleDecline(enterprise)}
                disabled={actionLoading === enterprise.id}
              >
                Rechazar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EnterpriseMembershipBanner;
