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
    setLoading(false);
    const unsubs: (() => void)[] = [];
    unsubs.push(listenBusinesses(setBusinesses));
    unsubs.push(listenEnterpriseRequests(setRequests));
    unsubs.push(listenPaymentReceipts(setReceipts));
    unsubs.push(listenSubscriptions(setSubscriptions));
    unsubs.push(listenDiscountCampaigns(setDiscountCampaigns));
    unsubs.push(listenSeasonalCampaigns(setSeasonalCampaigns));
    unsubs.push(listenReferrals(setReferrals));
    unsubs.push(listenUserReferralEarnings(setUserReferralEarnings));
    return () => unsubs.forEach((u) => u());
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
