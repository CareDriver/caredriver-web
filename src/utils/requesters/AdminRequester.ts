import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  runTransaction,
  writeBatch,
  increment,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  DocumentSnapshot,
  QueryDocumentSnapshot,
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
  console.log("🔍 [AdminRequester] listenEnterpriseRequests starting query...");
  const q = query(
    collection(firestore, "enterprise-requests"),
    where("deleted", "==", false),
    limit(200),
  );
  return onSnapshot(
    q,
    (snap) => {
      console.log(
        "✅ [AdminRequester] listenEnterpriseRequests received snapshot:",
        snap.size,
        "docs",
      );
      const requests = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as unknown as EnterpriseRequest)
        .filter((r: any) => !r.aproved);
      requests.sort((a, b) => {
        const tA = (a.createdAt as any)?.toMillis?.() || 0;
        const tB = (b.createdAt as any)?.toMillis?.() || 0;
        return tA - tB;
      });
      callback(requests);
    },
    (err) => {
      console.error("❌ [AdminRequester] listenEnterpriseRequests error:", err);
      callback([]);
    },
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
  console.log("🔍 [AdminRequester] listenPaymentReceipts starting query...");
  const q = query(
    collection(firestore, "paymentReceipts"),
    where("status", "==", "pending"),
    limit(200),
  );
  return onSnapshot(
    q,
    (snap) => {
      console.log(
        "✅ [AdminRequester] listenPaymentReceipts received snapshot:",
        snap.size,
        "docs",
      );
      const receipts = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as PaymentReceipt,
      );
      receipts.sort((a, b) => {
        const tA = (a.submittedAt as any)?.toMillis?.() || 0;
        const tB = (b.submittedAt as any)?.toMillis?.() || 0;
        return tA - tB;
      });
      callback(receipts);
    },
    (err) => {
      console.error("❌ [AdminRequester] listenPaymentReceipts error:", err);
      callback([]);
    },
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

export async function markReceiptInvoiced(
  receiptId: string,
): Promise<{ success: boolean } | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No authenticated user");

    await updateDoc(doc(firestore, "paymentReceipts", receiptId), {
      invoiced: true,
      invoicedBy: uid,
      invoicedAt: serverTimestamp(),
    });

    await writeAdminAuditLog({
      action: "markReceiptInvoiced",
      targetCollection: "paymentReceipts",
      targetId: receiptId,
      details: { invoiced: true },
    });

    return { success: true };
  } catch (error) {
    console.error("markReceiptInvoiced failed", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Businesses
// ---------------------------------------------------------------------------

export async function fetchAllBusinesses(): Promise<Enterprise[]> {
  try {
    const snap = await getDocs(
      query(
        collection(firestore, "enterprises"),
        where("deleted", "==", false),
        limit(500),
      ),
    );
    const list = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as Enterprise,
    );
    list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return list;
  } catch (error) {
    console.error("fetchAllBusinesses error:", error);
    return [];
  }
}

export function listenBusinesses(
  callback: (businesses: Enterprise[]) => void,
): Unsubscribe {
  console.log("🔍 [AdminRequester] listenBusinesses query starting...");
  const q = query(
    collection(firestore, "enterprises"),
    where("deleted", "==", false),
    limit(500),
  );
  return onSnapshot(
    q,
    (snap) => {
      console.log(
        "✅ [AdminRequester] listenBusinesses snapshot received:",
        snap.size,
        "businesses",
      );
      const businesses = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Enterprise,
      );
      businesses.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      callback(businesses);
    },
    (error) => {
      console.error("❌ [AdminRequester] listenBusinesses error:", error);
      callback([]);
    },
  );
}

export async function verifyBusiness(
  enterpriseId: string,
  verified: boolean,
): Promise<{ success: boolean } | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No authenticated user");

    await updateDoc(doc(firestore, "enterprises", enterpriseId), {
      verifiedAt: verified ? Timestamp.now() : null,
      updatedAt: Timestamp.now(),
      updatedBy: uid,
    });

    await writeAdminAuditLog({
      action: "verifyBusiness",
      targetCollection: "enterprises",
      targetId: enterpriseId,
      details: { verified },
    });

    return { success: true };
  } catch (error) {
    console.error("verifyBusiness failed", error);
    return null;
  }
}

export async function changeBusinessPlan(
  enterpriseId: string,
  plan: "free" | "verified" | "featured",
): Promise<{ success: boolean } | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No authenticated user");

    await runTransaction(firestore, async (t) => {
      t.update(doc(firestore, "enterprises", enterpriseId), {
        plan,
        updatedAt: Timestamp.now(),
        updatedBy: uid,
      });
      t.set(
        doc(firestore, "subscriptions", enterpriseId),
        {
          enterpriseId,
          plan,
          updatedAt: Timestamp.now(),
        },
        { merge: true },
      );
    });

    await writeAdminAuditLog({
      action: "changeBusinessPlan",
      targetCollection: "enterprises",
      targetId: enterpriseId,
      details: { plan },
    });

    return { success: true };
  } catch (error) {
    console.error("changeBusinessPlan failed", error);
    return null;
  }
}

export async function suspendBusiness(
  enterpriseId: string,
  suspended: boolean,
): Promise<{ success: boolean } | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No authenticated user");

    await runTransaction(firestore, async (t) => {
      t.update(doc(firestore, "enterprises", enterpriseId), {
        active: !suspended,
        updatedAt: Timestamp.now(),
        updatedBy: uid,
        ...(suspended && { licenseStatus: "suspended" }),
      });
      t.set(
        doc(firestore, "subscriptions", enterpriseId),
        {
          enterpriseId,
          licenseStatus: suspended ? "suspended" : "active",
          updatedAt: Timestamp.now(),
        },
        { merge: true },
      );
    });

    await writeAdminAuditLog({
      action: "suspendBusiness",
      targetCollection: "enterprises",
      targetId: enterpriseId,
      details: { suspended },
    });

    return { success: true };
  } catch (error) {
    console.error("suspendBusiness failed", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

export function listenSubscriptions(
  callback: (subs: Subscription[]) => void,
): Unsubscribe {
  console.log("🔍 [AdminRequester] listenSubscriptions starting query...");
  const q = query(collection(firestore, "subscriptions"), limit(500));
  return onSnapshot(
    q,
    (snap) => {
      console.log(
        "✅ [AdminRequester] listenSubscriptions received snapshot:",
        snap.size,
        "subscriptions",
      );
      const subs = snap.docs.map(
        (d) => ({ enterpriseId: d.id, ...d.data() }) as Subscription,
      );
      callback(subs);
    },
    (err) => {
      console.error("❌ [AdminRequester] listenSubscriptions error:", err);
      callback([]);
    },
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
  qrCodeImageUrl?: string;
  paymentInstructions?: string;
}): Promise<{ success: boolean } | null> {
  try {
    const { verifiedBasePrice, featuredBasePrice, verifiedTag, featuredTag } =
      body;
    const { qrCodeImageUrl, paymentInstructions } = body;

    const hasPricingFields =
      verifiedBasePrice !== undefined ||
      featuredBasePrice !== undefined ||
      verifiedTag !== undefined ||
      featuredTag !== undefined;

    const hasPaymentFields =
      qrCodeImageUrl !== undefined || paymentInstructions !== undefined;

    if (hasPricingFields) {
      const pricingUpdate: Record<string, unknown> = {
        updatedAt: Timestamp.now(),
      };
      if (verifiedBasePrice !== undefined)
        pricingUpdate.verifiedBasePrice = verifiedBasePrice;
      if (featuredBasePrice !== undefined)
        pricingUpdate.featuredBasePrice = featuredBasePrice;
      if (verifiedTag !== undefined) pricingUpdate.verifiedTag = verifiedTag;
      if (featuredTag !== undefined) pricingUpdate.featuredTag = featuredTag;

      await setDoc(
        doc(firestore, "platformSettings", "pricing"),
        pricingUpdate,
        { merge: true },
      );
    }

    if (hasPaymentFields) {
      const paymentUpdate: Record<string, unknown> = {
        updatedAt: Timestamp.now(),
      };
      if (qrCodeImageUrl !== undefined)
        paymentUpdate.qrCodeImageUrl = qrCodeImageUrl;
      if (paymentInstructions !== undefined)
        paymentUpdate.paymentInstructions = paymentInstructions;

      await setDoc(
        doc(firestore, "platformSettings", "payment"),
        paymentUpdate,
        { merge: true },
      );
    }

    return { success: true };
  } catch (error) {
    console.error("updatePricingSettings failed", error);
    return null;
  }
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
  console.log("🔍 [AdminRequester] listenDiscountCampaigns starting query...");
  const q = query(collection(firestore, "discountCampaigns"), limit(100));
  return onSnapshot(
    q,
    (snap) => {
      console.log(
        "✅ [AdminRequester] listenDiscountCampaigns received snapshot:",
        snap.size,
        "campaigns",
      );
      const campaigns = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as DiscountCampaign,
      );
      callback(campaigns);
    },
    (err) => {
      console.error("❌ [AdminRequester] listenDiscountCampaigns error:", err);
      callback([]);
    },
  );
}

export function listenSeasonalCampaigns(
  callback: (campaigns: SeasonalCampaign[]) => void,
): Unsubscribe {
  console.log("🔍 [AdminRequester] listenSeasonalCampaigns starting query...");
  const q = query(collection(firestore, "seasonalCampaigns"), limit(100));
  return onSnapshot(
    q,
    (snap) => {
      console.log(
        "✅ [AdminRequester] listenSeasonalCampaigns received snapshot:",
        snap.size,
        "campaigns",
      );
      const campaigns = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as SeasonalCampaign,
      );
      callback(campaigns);
    },
    (err) => {
      console.error("❌ [AdminRequester] listenSeasonalCampaigns error:", err);
      callback([]);
    },
  );
}

export async function saveDiscountCampaign(
  body: Partial<DiscountCampaign> & { id?: string },
): Promise<{ success: boolean; campaignId: string } | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No authenticated user");

    const isNew = !body.id;
    const ref = body.id
      ? doc(firestore, "discountCampaigns", body.id)
      : doc(collection(firestore, "discountCampaigns"));

    const {
      id: _id,
      name,
      appliesToPlans,
      discountType,
      discountValue,
      durationCycles,
      active,
      eligibilityWindow,
    } = body as Record<string, unknown>;

    const data: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
      updatedBy: uid,
    };

    if (name !== undefined) data.name = name;
    if (appliesToPlans !== undefined) data.appliesToPlans = appliesToPlans;
    if (discountType !== undefined) data.discountType = discountType;
    if (discountValue !== undefined) data.discountValue = discountValue;
    if (durationCycles !== undefined) data.durationCycles = durationCycles;
    if (active !== undefined) data.active = active;
    if (eligibilityWindow !== undefined) {
      // Convert date strings/objects to Timestamps if needed
      const ew = eligibilityWindow as Record<string, unknown>;
      const converted: Record<string, unknown> = {};
      for (const key of Object.keys(ew)) {
        const val = ew[key];
        if (val instanceof Date) {
          converted[key] = Timestamp.fromDate(val);
        } else {
          converted[key] = val;
        }
      }
      data.eligibilityWindow = converted;
    }

    if (isNew) {
      data.createdAt = Timestamp.now();
      data.createdBy = uid;
    }

    await setDoc(ref, data, { merge: true });

    await writeAdminAuditLog({
      action: isNew ? "createDiscountCampaign" : "updateDiscountCampaign",
      targetCollection: "discountCampaigns",
      targetId: ref.id,
      details: { name: data.name },
    });

    return { success: true, campaignId: ref.id };
  } catch (error) {
    console.error("saveDiscountCampaign failed", error);
    return null;
  }
}

export async function saveSeasonalCampaign(
  body: Partial<SeasonalCampaign> & { id?: string },
): Promise<{ success: boolean; campaignId: string } | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No authenticated user");

    const isNew = !body.id;
    const ref = body.id
      ? doc(firestore, "seasonalCampaigns", body.id)
      : doc(collection(firestore, "seasonalCampaigns"));

    const {
      id: _id,
      name,
      bannerText,
      categoryIds,
      active,
      startsAt,
      endsAt,
    } = body as Record<string, unknown>;

    const toTimestamp = (val: unknown): Timestamp | undefined => {
      if (!val) return undefined;
      if (val instanceof Timestamp) return val;
      if (val instanceof Date) return Timestamp.fromDate(val);
      if (typeof val === "string" || typeof val === "number") {
        return Timestamp.fromDate(new Date(val));
      }
      return undefined;
    };

    const data: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
      updatedBy: uid,
    };

    if (name !== undefined) data.name = name;
    if (bannerText !== undefined) data.bannerText = bannerText;
    if (categoryIds !== undefined) data.categoryIds = categoryIds;
    if (active !== undefined) data.active = active;

    const startsAtTs = toTimestamp(startsAt);
    if (startsAtTs) data.startsAt = startsAtTs;

    const endsAtTs = toTimestamp(endsAt);
    if (endsAtTs) data.endsAt = endsAtTs;

    if (isNew) {
      data.createdAt = Timestamp.now();
      data.createdBy = uid;
    }

    await setDoc(ref, data, { merge: true });

    await writeAdminAuditLog({
      action: isNew ? "createSeasonalCampaign" : "updateSeasonalCampaign",
      targetCollection: "seasonalCampaigns",
      targetId: ref.id,
      details: { name: data.name },
    });

    return { success: true, campaignId: ref.id };
  } catch (error) {
    console.error("saveSeasonalCampaign failed", error);
    return null;
  }
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

export async function payUserReferralEarnings(
  userId: string,
): Promise<{ success: boolean; amountPaid: number } | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No authenticated user");

    // 1. Query pending ledger entries for this user
    const ledgerSnap = await getDocs(
      query(
        collection(firestore, "referralEarningsLedger"),
        where("userId", "==", userId),
        where("status", "==", "pending"),
      ),
    );

    // 2. Nothing to pay
    if (ledgerSnap.empty) {
      return { success: true, amountPaid: 0 };
    }

    // 3. Sum amountEarned across all pending docs
    let amountPaid = 0;
    for (const d of ledgerSnap.docs) {
      const data = d.data();
      amountPaid +=
        typeof data.amountEarned === "number" ? data.amountEarned : 0;
    }

    // 4 & 5. Batch: mark each ledger entry as paid + update userReferralEarnings summary
    const batch = writeBatch(firestore);

    for (const d of ledgerSnap.docs) {
      batch.update(d.ref, {
        status: "paid",
        paidAt: Timestamp.now(),
        paidBy: uid,
      });
    }

    batch.set(
      doc(firestore, "userReferralEarnings", userId),
      {
        totalPaid: increment(amountPaid),
        totalOwed: 0,
        lastPayoutAt: Timestamp.now(),
      },
      { merge: true },
    );

    // 6. Commit batch
    await batch.commit();

    await writeAdminAuditLog({
      action: "payUserReferralEarnings",
      targetCollection: "userReferralEarnings",
      targetId: userId,
      details: { amountPaid },
    });

    // 7. Fire-and-forget push notification via CF
    adminFetch("sendPushNotification", {
      userId,
      notification: {
        title: "Comisión pagada",
        body: `Te pagaron Bs. ${amountPaid} por comisiones de referidos.`,
        data: {
          type: "referral_earnings_paid",
          amountPaid: String(amountPaid),
        },
      },
      channelId: "subscription_updates",
    });

    // 8. Return result
    return { success: true, amountPaid };
  } catch (error) {
    console.error("payUserReferralEarnings failed", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function getTotalUsersCount(): Promise<number> {
  try {
    const snap = await getCountFromServer(collection(firestore, "users"));
    return snap.data().count;
  } catch (error) {
    console.error("getTotalUsersCount error:", error);
    return 0;
  }
}

export interface FetchAdminUsersParams {
  pageSize?: number;
  sortBy?: "createdAt" | "fullName" | "default";
  sortDirection?: "desc" | "asc";
  startAfterDoc?: DocumentSnapshot | null;
}

export interface FetchAdminUsersResponse {
  users: UserInterface[];
  lastDoc: DocumentSnapshot | null;
}

export async function fetchAdminUsersPaginated({
  pageSize = 25,
  sortBy = "createdAt",
  sortDirection = "desc",
  startAfterDoc = null,
}: FetchAdminUsersParams): Promise<FetchAdminUsersResponse> {
  try {
    const constraints: any[] = [];

    if (sortBy === "createdAt") {
      constraints.push(orderBy("createdAt", sortDirection));
    } else if (sortBy === "fullName") {
      constraints.push(orderBy("fullName", sortDirection));
    }

    constraints.push(limit(pageSize));

    if (startAfterDoc) {
      constraints.push(startAfter(startAfterDoc));
    }

    const q = query(collection(firestore, "users"), ...constraints);
    const snap = await getDocs(q);

    const users = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as unknown as UserInterface,
    );
    const lastDoc =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

    return { users, lastDoc };
  } catch (error) {
    console.warn(
      "fetchAdminUsersPaginated ordered query failed, falling back to unordered",
      error,
    );
    try {
      const fallbackConstraints: any[] = [limit(pageSize)];
      if (startAfterDoc) {
        fallbackConstraints.push(startAfter(startAfterDoc));
      }
      const fallbackSnap = await getDocs(
        query(collection(firestore, "users"), ...fallbackConstraints),
      );
      return {
        users: fallbackSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as unknown as UserInterface,
        ),
        lastDoc:
          fallbackSnap.docs.length > 0
            ? fallbackSnap.docs[fallbackSnap.docs.length - 1]
            : null,
      };
    } catch (fallbackErr) {
      console.error("fetchAdminUsersPaginated fallback failed", fallbackErr);
      return { users: [], lastDoc: null };
    }
  }
}

export async function searchUsers(
  searchTerm: string,
): Promise<UserInterface[]> {
  try {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      const { users } = await fetchAdminUsersPaginated({
        pageSize: 50,
        sortBy: "createdAt",
        sortDirection: "desc",
      });
      return users;
    }

    const userMap = new Map<string, UserInterface>();

    // 1. Direct email match
    try {
      const emailSnap = await getDocs(
        query(
          collection(firestore, "users"),
          where("email", "==", trimmed),
          limit(20),
        ),
      );
      emailSnap.docs.forEach((d) =>
        userMap.set(d.id, {
          id: d.id,
          ...d.data(),
        } as unknown as UserInterface),
      );
    } catch (_) {}

    // 2. Array-contains on fullNameArrayLower
    try {
      const nameArraySnap = await getDocs(
        query(
          collection(firestore, "users"),
          where("fullNameArrayLower", "array-contains", trimmed),
          limit(30),
        ),
      );
      nameArraySnap.docs.forEach((d) =>
        userMap.set(d.id, {
          id: d.id,
          ...d.data(),
        } as unknown as UserInterface),
      );
    } catch (_) {}

    // 3. Phone number match
    try {
      const phoneSnap = await getDocs(
        query(
          collection(firestore, "users"),
          where("phoneNumber.number", "==", searchTerm.trim()),
          limit(20),
        ),
      );
      phoneSnap.docs.forEach((d) =>
        userMap.set(d.id, {
          id: d.id,
          ...d.data(),
        } as unknown as UserInterface),
      );
    } catch (_) {}

    // 4. Prefix search on fullName
    try {
      const capitalized =
        searchTerm.trim().charAt(0).toUpperCase() + searchTerm.trim().slice(1);
      const prefixSnap = await getDocs(
        query(
          collection(firestore, "users"),
          orderBy("fullName"),
          where("fullName", ">=", capitalized),
          where("fullName", "<=", capitalized + "\uf8ff"),
          limit(30),
        ),
      );
      prefixSnap.docs.forEach((d) =>
        userMap.set(d.id, {
          id: d.id,
          ...d.data(),
        } as unknown as UserInterface),
      );
    } catch (_) {}

    if (userMap.size > 0) {
      return Array.from(userMap.values());
    }

    // Fallback: search across first 300 users in memory
    const fallbackSnap = await getDocs(
      query(collection(firestore, "users"), limit(300)),
    );
    return fallbackSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as unknown as UserInterface)
      .filter((u) => {
        const name = (u.fullName || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const phone = (u.phoneNumber?.number || "").toLowerCase();
        return (
          name.includes(trimmed) ||
          email.includes(trimmed) ||
          phone.includes(trimmed)
        );
      });
  } catch (error) {
    console.error("searchUsers error:", error);
    return [];
  }
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
