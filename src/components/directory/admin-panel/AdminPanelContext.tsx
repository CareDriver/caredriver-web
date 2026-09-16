"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Enterprise } from "@/interfaces/Enterprise";
import {
  PaymentReceipt,
  Subscription,
  DiscountCampaign,
  SeasonalCampaign,
} from "@/interfaces/Directory";
import { EnterpriseRequest } from "@/interfaces/Enterprise";
import { Referral, UserReferralEarnings } from "@/interfaces/Referrals";
import {
  listenBusinesses,
  listenEnterpriseRequests,
  listenPaymentReceipts,
  listenSubscriptions,
  listenDiscountCampaigns,
  listenSeasonalCampaigns,
  listenReferrals,
  listenUserReferralEarnings,
} from "@/utils/requesters/AdminRequester";

interface AdminPanelState {
  businesses: Enterprise[];
  requests: EnterpriseRequest[];
  receipts: PaymentReceipt[];
  subscriptions: Subscription[];
  discountCampaigns: DiscountCampaign[];
  seasonalCampaigns: SeasonalCampaign[];
  referrals: Referral[];
  userReferralEarnings: UserReferralEarnings[];
  loading: boolean;
}

const AdminPanelContext = createContext<AdminPanelState | undefined>(undefined);

export const useAdminPanel = () => {
  const ctx = useContext(AdminPanelContext);
  if (!ctx)
    throw new Error("useAdminPanel must be used within AdminPanelProvider");
  return ctx;
};

export const AdminPanelProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [businesses, setBusinesses] = useState<Enterprise[]>([]);
  const [requests, setRequests] = useState<EnterpriseRequest[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [discountCampaigns, setDiscountCampaigns] = useState<
    DiscountCampaign[]
  >([]);
  const [seasonalCampaigns, setSeasonalCampaigns] = useState<
    SeasonalCampaign[]
  >([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [userReferralEarnings, setUserReferralEarnings] = useState<
    UserReferralEarnings[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(
      "🚀 [AdminPanelContext] Provider mounted, initializing listeners...",
    );
    setLoading(false);
    const unsubs: (() => void)[] = [];

    unsubs.push(
      listenBusinesses((data) => {
        console.log(
          "🏢 [AdminPanelContext] Businesses received:",
          data.length,
          data.map((b) => b.name),
        );
        setBusinesses(data);
      }),
    );
    unsubs.push(
      listenEnterpriseRequests((data) => {
        console.log("📝 [AdminPanelContext] Requests received:", data.length);
        setRequests(data);
      }),
    );
    unsubs.push(
      listenPaymentReceipts((data) => {
        console.log("🧾 [AdminPanelContext] Receipts received:", data.length);
        setReceipts(data);
      }),
    );
    unsubs.push(
      listenSubscriptions((data) => {
        console.log(
          "💳 [AdminPanelContext] Subscriptions received:",
          data.length,
        );
        setSubscriptions(data);
      }),
    );
    unsubs.push(
      listenDiscountCampaigns((data) => {
        console.log(
          "🏷️ [AdminPanelContext] Discount campaigns received:",
          data.length,
        );
        setDiscountCampaigns(data);
      }),
    );
    unsubs.push(
      listenSeasonalCampaigns((data) => {
        console.log(
          "❄️ [AdminPanelContext] Seasonal campaigns received:",
          data.length,
        );
        setSeasonalCampaigns(data);
      }),
    );
    unsubs.push(
      listenReferrals((data) => {
        console.log("👥 [AdminPanelContext] Referrals received:", data.length);
        setReferrals(data);
      }),
    );
    unsubs.push(
      listenUserReferralEarnings((data) => {
        console.log(
          "💰 [AdminPanelContext] User referral earnings received:",
          data.length,
        );
        setUserReferralEarnings(data);
      }),
    );

    return () => {
      console.log("🛑 [AdminPanelContext] Cleaning up listeners");
      unsubs.forEach((u) => u());
    };
  }, []);

  return (
    <AdminPanelContext.Provider
      value={{
        businesses,
        requests,
        receipts,
        subscriptions,
        discountCampaigns,
        seasonalCampaigns,
        referrals,
        userReferralEarnings,
        loading,
      }}
    >
      {children}
    </AdminPanelContext.Provider>
  );
};
