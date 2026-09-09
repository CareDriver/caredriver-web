"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { Enterprise, EnterpriseMember } from "@/interfaces/Enterprise";
import {
  Lead,
  Offer,
  PaymentReceipt,
  Subscription,
} from "@/interfaces/Directory";
import { MemberRole } from "@/constants/directory";
import {
  fetchUserDirectoryEnterprise,
  listenEnterprise,
  listenLeads,
  listenOffers,
  listenMembers,
  listenPaymentReceipts,
  listenSubscription,
  fetchBranches,
} from "@/utils/requesters/DirectoryRequester";
import PageLoading from "@/components/loaders/PageLoading";

export interface BusinessPanelState {
  enterprise: Enterprise | null;
  selectedEnterpriseId: string | null;
  leads: Lead[];
  offers: Offer[];
  members: EnterpriseMember[];
  receipts: PaymentReceipt[];
  subscription: Subscription | null;
  branches: Enterprise[];
  myRole: MemberRole | null;
  isOwner: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  selectEnterprise: (id: string) => void;
}

const BusinessPanelContext = createContext<BusinessPanelState | undefined>(
  undefined,
);

export const useBusinessPanel = () => {
  const ctx = useContext(BusinessPanelContext);
  if (!ctx)
    throw new Error(
      "useBusinessPanel must be used within BusinessPanelProvider",
    );
  return ctx;
};

interface Props {
  children: React.ReactNode;
}

/**
 * Provider that loads the user's directory enterprise, sets up real-time
 * listeners, resolves role and exposes branch switching.
 */
export const BusinessPanelProvider: React.FC<Props> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<
    string | null
  >(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [members, setMembers] = useState<EnterpriseMember[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [branches, setBranches] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);
  const selectEnterprise = useCallback((id: string) => {
    setSelectedEnterpriseId(id);
    setEnterprise(null);
    setLeads([]);
    setOffers([]);
    setMembers([]);
    setReceipts([]);
    setSubscription(null);
  }, []);

  // Initial enterprise discovery
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const discover = async () => {
      const ent = await fetchUserDirectoryEnterprise();
      if (!mounted) return;
      if (ent) {
        setEnterprise(ent);
        setSelectedEnterpriseId(ent.id || null);
      } else {
        setError("No se encontró un negocio asociado a tu cuenta.");
      }
      setLoading(false);
    };

    discover();
    return () => {
      mounted = false;
    };
  }, [refreshKey, user?.id]);

  // Listen to selected enterprise and its subcollections
  useEffect(() => {
    if (!selectedEnterpriseId) return;

    const unsubEnterprise = listenEnterprise(
      selectedEnterpriseId,
      setEnterprise,
    );
    const unsubLeads = listenLeads(selectedEnterpriseId, setLeads);
    const unsubOffers = listenOffers(selectedEnterpriseId, setOffers);
    const unsubMembers = listenMembers(selectedEnterpriseId, setMembers);
    const unsubReceipts = listenPaymentReceipts(
      selectedEnterpriseId,
      setReceipts,
    );
    const unsubSub = listenSubscription(selectedEnterpriseId, setSubscription);

    let unsubBranches = () => {};
    fetchBranches(selectedEnterpriseId).then(setBranches);

    return () => {
      unsubEnterprise();
      unsubLeads();
      unsubOffers();
      unsubMembers();
      unsubReceipts();
      unsubSub();
      unsubBranches();
    };
  }, [selectedEnterpriseId]);

  // Resolve role
  const { myRole, isOwner } = useMemo(() => {
    const uid = user?.id;
    if (!enterprise || !uid) return { myRole: null, isOwner: false };
    if (enterprise.userId === uid)
      return { myRole: "admin" as MemberRole, isOwner: true };
    const me = members.find((m) => m.userId === uid && m.accepted);
    return { myRole: (me?.role as MemberRole) || null, isOwner: false };
  }, [enterprise, members, user?.id]);

  if (loading) {
    return <PageLoading />;
  }

  if (error || !enterprise) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>{error || "No se encontró tu negocio"}</p>
        <button onClick={() => router.push("/directory/business")}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <BusinessPanelContext.Provider
      value={{
        enterprise,
        selectedEnterpriseId,
        leads,
        offers,
        members,
        receipts,
        subscription,
        branches,
        myRole,
        isOwner,
        loading,
        error,
        refresh,
        selectEnterprise,
      }}
    >
      {children}
    </BusinessPanelContext.Provider>
  );
};
