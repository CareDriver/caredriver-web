import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  Unsubscribe,
} from "firebase/firestore";
import { auth, firestore } from "@/firebase/FirebaseConfig";
import { Enterprise, EnterpriseRequest } from "@/interfaces/Enterprise";
import {
  PaymentReceipt,
  Subscription,
  DiscountCampaign,
  SeasonalCampaign,
} from "@/interfaces/Directory";
import {
  Referral,
  UserReferralEarnings,
  ReferralEarningsLedger,
} from "@/interfaces/Referrals";
import { UserInterface } from "@/interfaces/UserInterface";

const BASE_URL =
  process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_BASE_URL ||
  "https://us-central1-caredriver-3ecad.cloudfunctions.net";

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

async function adminFetch<T>(
  endpoint: string,
  body: unknown,
): Promise<T | null> {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No authenticated user");
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    return data as T;
  } catch (error) {
    console.error(`adminFetch ${endpoint} failed`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Enterprise requests (registration queue)
// ---------------------------------------------------------------------------

export function listenEnterpriseRequests(
  callback: (requests: EnterpriseRequest[]) => void,
): Unsubscribe {
  const q = query(
    collection(firestore, "enterprise-requests"),
    where("aproved", "==", null),
    where("deleted", "==", false),
    orderBy("createdAt", "asc"),
    limit(200),
  );
  return onSnapshot(
    q,
    (snap) => {
      const requests = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as unknown as EnterpriseRequest,
      );
      callback(requests);
    },
    () => callback([]),
  );
}

export async function approveDirectoryEnterpriseRequest(
  requestId: string,
  decision: "approved" | "rejected",
  rejectionReason?: string,
) {
  return adminFetch<{ success: boolean; enterpriseId?: string }>(
    "approveDirectoryEnterpriseRequest",
    {
      requestId,
      decision,
      rejectionReason,
    },
  );
}

// ---------------------------------------------------------------------------
// Payment receipts
// ---------------------------------------------------------------------------

export function listenPaymentReceipts(
  callback: (receipts: PaymentReceipt[]) => void,
): Unsubscribe {
  const q = query(
    collection(firestore, "paymentReceipts"),
    where("status", "==", "pending"),
    orderBy("submittedAt", "asc"),
    limit(200),
  );
  return onSnapshot(
    q,
    (snap) => {
      const receipts = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as PaymentReceipt,
      );
      callback(receipts);
    },
    () => callback([]),
  );
}

export async function reviewPaymentReceipt(
  receiptId: string,
  decision: "approved" | "rejected",
  rejectionReason?: string,
) {
  return adminFetch<{ success: boolean }>("reviewPaymentReceipt", {
    receiptId,
    decision,
    rejectionReason,
  });
}

export async function markReceiptInvoiced(receiptId: string) {
  return adminFetch<{ success: boolean }>("markReceiptInvoiced", { receiptId });
}

// ---------------------------------------------------------------------------
// Businesses
// ---------------------------------------------------------------------------

export async function fetchAllBusinesses(): Promise<Enterprise[]> {
  const snap = await getDocs(
    query(
      collection(firestore, "enterprises"),
      where("deleted", "==", false),
      orderBy("name"),
      limit(500),
    ),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Enterprise);
}

export function listenBusinesses(
  callback: (businesses: Enterprise[]) => void,
): Unsubscribe {
  const q = query(
    collection(firestore, "enterprises"),
    where("deleted", "==", false),
    orderBy("name"),
    limit(500),
  );
  return onSnapshot(
    q,
    (snap) => {
      const businesses = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Enterprise,
      );
      callback(businesses);
    },
    () => callback([]),
  );
}

export async function verifyBusiness(enterpriseId: string, verified: boolean) {
  return adminFetch<{ success: boolean }>("verifyBusiness", {
    enterpriseId,
    verified,
  });
}

export async function changeBusinessPlan(
  enterpriseId: string,
  plan: "free" | "verified" | "featured",
) {
  return adminFetch<{ success: boolean }>("changeBusinessPlan", {
    enterpriseId,
    plan,
  });
}

export async function suspendBusiness(
  enterpriseId: string,
  suspended: boolean,
) {
  return adminFetch<{ success: boolean }>("suspendBusiness", {
    enterpriseId,
    suspended,
  });
}

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

export function listenSubscriptions(
  callback: (subs: Subscription[]) => void,
): Unsubscribe {
  const q = query(collection(firestore, "subscriptions"), limit(500));
  return onSnapshot(
    q,
    (snap) => {
      const subs = snap.docs.map(
        (d) => ({ enterpriseId: d.id, ...d.data() }) as Subscription,
      );
      callback(subs);
    },
    () => callback([]),
  );
}

// ---------------------------------------------------------------------------
// Platform pricing & payment
// ---------------------------------------------------------------------------

export async function fetchPlatformPricing() {
  const snap = await getDoc(doc(firestore, "platformSettings", "pricing"));
  return snap.exists() ? snap.data() : null;
}

export async function fetchPlatformPayment() {
  const snap = await getDoc(doc(firestore, "platformSettings", "payment"));
  return snap.exists() ? snap.data() : null;
}

export async function updatePricingSettings(body: {
  verifiedBasePrice?: number;
  featuredBasePrice?: number;
  verifiedTag?: string;
  featuredTag?: string;
}) {
  return adminFetch<{ success: boolean }>("updatePricingSettings", body);
}

export async function updatePlatformPaymentSettings(body: {
  qrCodeImageUrl?: string;
  paymentInstructions?: string;
}) {
  const ref = doc(firestore, "platformSettings", "payment");
  const { id: _id, ...rest } = body as Record<string, unknown>;
  await setDoc(ref, { ...rest, updatedAt: Timestamp.now() }, { merge: true });
  return { success: true };
}

// ---------------------------------------------------------------------------
// Discount & seasonal campaigns
// ---------------------------------------------------------------------------

export function listenDiscountCampaigns(
  callback: (campaigns: DiscountCampaign[]) => void,
): Unsubscribe {
  const q = query(
    collection(firestore, "discountCampaigns"),
    orderBy("updatedAt", "desc"),
    limit(100),
  );
  return onSnapshot(
    q,
    (snap) => {
      const campaigns = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as DiscountCampaign,
      );
      callback(campaigns);
    },
    () => callback([]),
  );
}

export function listenSeasonalCampaigns(
  callback: (campaigns: SeasonalCampaign[]) => void,
): Unsubscribe {
  const q = query(
    collection(firestore, "seasonalCampaigns"),
    orderBy("updatedAt", "desc"),
    limit(100),
  );
  return onSnapshot(
    q,
    (snap) => {
      const campaigns = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as SeasonalCampaign,
      );
      callback(campaigns);
    },
    () => callback([]),
  );
}

export async function saveDiscountCampaign(
  body: Partial<DiscountCampaign> & { id?: string },
) {
  return adminFetch<{ success: boolean; campaignId: string }>(
    "saveDiscountCampaign",
    body,
  );
}

export async function saveSeasonalCampaign(
  body: Partial<SeasonalCampaign> & { id?: string },
) {
  return adminFetch<{ success: boolean; campaignId: string }>(
    "saveSeasonalCampaign",
    body,
  );
}

export async function countSubscriptionsWithCampaign(
  campaignId: string,
): Promise<number> {
  const snap = await getDocs(
    query(
      collection(firestore, "subscriptions"),
      where("activeDiscountCampaignId", "==", campaignId),
      limit(500),
    ),
  );
  return snap.size;
}

// ---------------------------------------------------------------------------
// Referrals
// ---------------------------------------------------------------------------

export function listenReferrals(
  callback: (referrals: Referral[]) => void,
): Unsubscribe {
  const q = query(
    collection(firestore, "referrals"),
    orderBy("capturedAt", "desc"),
    limit(500),
  );
  return onSnapshot(
    q,
    (snap) => {
      const referrals = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as unknown as Referral,
      );
      callback(referrals);
    },
    () => callback([]),
  );
}

export function listenUserReferralEarnings(
  callback: (earnings: UserReferralEarnings[]) => void,
): Unsubscribe {
  const q = query(collection(firestore, "userReferralEarnings"), limit(500));
  return onSnapshot(
    q,
    (snap) => {
      const earnings = snap.docs.map(
        (d) =>
          ({
            userId: d.id,
            ...d.data(),
          }) as unknown as UserReferralEarnings,
      );
      callback(earnings);
    },
    () => callback([]),
  );
}

export async function fetchReferralEarningsForUser(
  userId: string,
): Promise<ReferralEarningsLedger[]> {
  const snap = await getDocs(
    query(
      collection(firestore, "referralEarningsLedger"),
      where("userId", "==", userId),
      orderBy("paymentNumber", "asc"),
      limit(100),
    ),
  );
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as unknown as ReferralEarningsLedger,
  );
}

export async function payUserReferralEarnings(userId: string) {
  return adminFetch<{ success: boolean; amountPaid: number }>(
    "payUserReferralEarnings",
    { userId },
  );
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function searchUsers(
  searchTerm: string,
): Promise<UserInterface[]> {
  const q = query(
    collection(firestore, "users"),
    where("fullNameArrayLower", "array-contains", searchTerm.toLowerCase()),
    limit(50),
  );
  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as unknown as UserInterface,
  );
}

export async function setUserAdminClaim(userId: string, isAdmin: boolean) {
  return adminFetch<{ success: boolean }>("setUserAdminClaim", {
    userId,
    admin: isAdmin,
  });
}

// ---------------------------------------------------------------------------
// Audit logs
// ---------------------------------------------------------------------------

export async function writeAdminAuditLog(payload: {
  action: string;
  targetCollection: string;
  targetId: string;
  details: Record<string, unknown>;
}) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const ref = doc(collection(firestore, "adminAuditLogs"));
  await setDoc(ref, {
    adminId: uid,
    ...payload,
    createdAt: Timestamp.now(),
  });
}
