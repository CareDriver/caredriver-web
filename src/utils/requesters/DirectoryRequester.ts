import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  setDoc,
  runTransaction,
  serverTimestamp,
  increment,
  limit,
  Timestamp,
  Unsubscribe,
} from "firebase/firestore";
import { auth, firestore } from "@/firebase/FirebaseConfig";
import { Enterprise } from "@/interfaces/Enterprise";
import {
  Lead,
  Offer,
  PaymentReceipt,
  Subscription,
} from "@/interfaces/Directory";
import { EnterpriseMember } from "@/interfaces/Enterprise";
import { LeadBusinessStatus } from "@/constants/directory";

const BASE_URL =
  process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_BASE_URL ||
  "https://us-central1-caredriver-3ecad.cloudfunctions.net";

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

/**
 * Retained for fire-and-forget Cloud Function calls (e.g. push notifications)
 * that have NOT been migrated to direct Firestore SDK.
 */
async function panelFetch<T>(
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
    console.error(`panelFetch ${endpoint} failed`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Enterprise discovery
// ---------------------------------------------------------------------------

export async function fetchUserDirectoryEnterprise(): Promise<Enterprise | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) return null;

    // First: try by owner userId (any approved directory type)
    const q = query(
      collection(firestore, "enterprises"),
      where("userId", "==", uid),
      where("aproved", "==", true),
      where("deleted", "==", false),
      limit(1),
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as Enterprise;
    }

    // Second: best-effort scan of members subcollections
    try {
      const allEnts = await getDocs(
        query(collection(firestore, "enterprises"), limit(100)),
      );
      for (const entDoc of allEnts.docs) {
        const entData = entDoc.data();
        if (entData.aproved !== true || entData.deleted === true) continue;
        const membersQ = query(
          collection(firestore, "enterprises", entDoc.id, "members"),
          where("userId", "==", uid),
          where("accepted", "==", true),
          limit(1),
        );
        const memberSnap = await getDocs(membersQ);
        if (!memberSnap.empty) {
          return { id: entDoc.id, ...entData } as Enterprise;
        }
      }
    } catch {
      // ignore
    }

    return null;
  } catch (error) {
    console.error("fetchUserDirectoryEnterprise failed", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Real-time listeners
// ---------------------------------------------------------------------------

export function listenEnterprise(
  enterpriseId: string,
  callback: (data: Enterprise | null) => void,
): Unsubscribe {
  const ref = doc(firestore, "enterprises", enterpriseId);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as Enterprise);
      } else {
        callback(null);
      }
    },
    () => callback(null),
  );
}

export function listenLeads(
  enterpriseId: string,
  callback: (leads: Lead[]) => void,
): Unsubscribe {
  const q = query(
    collection(firestore, "leads"),
    where("enterpriseId", "==", enterpriseId),
    orderBy("createdAt", "desc"),
    limit(200),
  );
  return onSnapshot(
    q,
    (snap) => {
      const leads = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Lead);
      callback(leads);
    },
    () => callback([]),
  );
}

export function listenOffers(
  enterpriseId: string,
  callback: (offers: Offer[]) => void,
): Unsubscribe {
  const q = query(
    collection(firestore, "enterprises", enterpriseId, "offers"),
    orderBy("createdAt", "desc"),
    limit(50),
  );
  return onSnapshot(
    q,
    (snap) => {
      const offers = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Offer);
      callback(offers);
    },
    () => callback([]),
  );
}

export function listenMembers(
  enterpriseId: string,
  callback: (members: EnterpriseMember[]) => void,
): Unsubscribe {
  const q = query(
    collection(firestore, "enterprises", enterpriseId, "members"),
  );
  return onSnapshot(
    q,
    (snap) => {
      const members = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as unknown as EnterpriseMember,
      );
      callback(members);
    },
    () => callback([]),
  );
}

export function listenPaymentReceipts(
  enterpriseId: string,
  callback: (receipts: PaymentReceipt[]) => void,
): Unsubscribe {
  const q = query(
    collection(firestore, "paymentReceipts"),
    where("enterpriseId", "==", enterpriseId),
    orderBy("submittedAt", "desc"),
    limit(50),
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

export function listenSubscription(
  enterpriseId: string,
  callback: (sub: Subscription | null) => void,
): Unsubscribe {
  const ref = doc(firestore, "subscriptions", enterpriseId);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        callback({ enterpriseId, ...snap.data() } as Subscription);
      } else {
        callback(null);
      }
    },
    () => callback(null),
  );
}

// ---------------------------------------------------------------------------
// Branches
// ---------------------------------------------------------------------------

export async function fetchBranches(
  enterpriseId: string,
): Promise<Enterprise[]> {
  try {
    const q = query(
      collection(firestore, "enterprises"),
      where("chainId", "==", enterpriseId),
      where("aproved", "==", true),
      where("deleted", "==", false),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Enterprise);
  } catch (error) {
    console.error("fetchBranches failed", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

export interface PlanPricingResponse {
  basePrice: number;
  finalPrice: number;
  discountApplied: boolean;
  cyclesRemaining: number;
  campaignName: string | null;
  tag: string | null;
  qrCodeImageUrl: string | null;
  paymentInstructions: string | null;
}

/**
 * Calculates the current subscription price for an enterprise by reading
 * platformSettings/pricing, subscriptions/{enterpriseId}, the enterprise doc,
 * and any active discount campaign, then returns the full pricing payload.
 */
export async function getCurrentPrice(
  enterpriseId: string,
): Promise<PlanPricingResponse | null> {
  try {
    // 1. Platform pricing settings
    const pricingSnap = await getDoc(
      doc(firestore, "platformSettings", "pricing"),
    );
    if (!pricingSnap.exists()) return null;
    const pricingData = pricingSnap.data() as Record<string, unknown>;

    // 2. Subscription doc
    const subSnap = await getDoc(doc(firestore, "subscriptions", enterpriseId));
    const subData = subSnap.exists()
      ? (subSnap.data() as Record<string, unknown>)
      : {};

    // 3. Enterprise doc — to resolve effective plan
    const entSnap = await getDoc(doc(firestore, "enterprises", enterpriseId));
    if (!entSnap.exists()) return null;
    const entData = entSnap.data() as Record<string, unknown>;
    const plan = (entData.plan as string) || "free";
    const requestedPlan = (entData.requestedPlan as string) || null;

    const effectivePlan = plan === "free" ? requestedPlan || plan : plan;

    // Base price
    const basePrice: number =
      effectivePlan === "featured"
        ? ((pricingData.featuredBasePrice as number) ?? 0)
        : ((pricingData.verifiedBasePrice as number) ?? 0);

    // Tag
    const tag: string | null =
      (pricingData[`${effectivePlan}Tag`] as string | null) ?? null;

    // 4. Discount campaign
    let finalPrice = basePrice;
    let discountApplied = false;
    let cyclesRemaining = 0;
    let campaignName: string | null = null;

    const discountCyclesRemaining =
      (subData.discountCyclesRemaining as number) ?? 0;
    const activeDiscountCampaignId =
      (subData.activeDiscountCampaignId as string) || null;

    if (discountCyclesRemaining > 0 && activeDiscountCampaignId) {
      const campaignSnap = await getDoc(
        doc(firestore, "discountCampaigns", activeDiscountCampaignId),
      );
      if (campaignSnap.exists()) {
        const campaign = campaignSnap.data() as Record<string, unknown>;
        const discountType = campaign.discountType as string;
        const discountValue = (campaign.discountValue as number) ?? 0;
        campaignName = (campaign.name as string) ?? null;
        cyclesRemaining = discountCyclesRemaining;

        if (discountType === "percent") {
          finalPrice = Math.round(basePrice * (1 - discountValue / 100));
        } else if (discountType === "fixed_amount") {
          finalPrice = Math.max(0, basePrice - discountValue);
        }
        discountApplied = true;
      }
    }

    // 5. Payment settings (QR + instructions)
    const paymentSnap = await getDoc(
      doc(firestore, "platformSettings", "payment"),
    );
    const paymentData = paymentSnap.exists()
      ? (paymentSnap.data() as Record<string, unknown>)
      : {};
    const qrCodeImageUrl =
      (paymentData.qrCodeImageUrl as string | null) ?? null;
    const paymentInstructions =
      (paymentData.paymentInstructions as string | null) ?? null;

    return {
      basePrice,
      finalPrice,
      discountApplied,
      cyclesRemaining,
      campaignName,
      tag,
      qrCodeImageUrl,
      paymentInstructions,
    };
  } catch (error) {
    console.error("getCurrentPrice failed", error);
    return null;
  }
}

/**
 * Submits a payment receipt document to the `paymentReceipts` collection
 * directly via the Firestore SDK using the currently authenticated user's UID.
 */
export async function submitPaymentReceipt(
  enterpriseId: string,
  fileUrl: string,
  amount: number,
): Promise<{ receiptId: string; status: string } | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No authenticated user");

    const docRef = await addDoc(collection(firestore, "paymentReceipts"), {
      enterpriseId,
      fileUrl,
      amount,
      status: "pending",
      submittedAt: serverTimestamp(),
      submittedBy: uid,
    });

    return { receiptId: docRef.id, status: "pending" };
  } catch (error) {
    console.error("submitPaymentReceipt failed", error);
    return null;
  }
}

/**
 * Applies a referral code to an enterprise. Performs a dual lookup (enterprises
 * then users) and runs a Firestore transaction to atomically record the referral.
 */
export async function applyReferralCode(
  enterpriseId: string,
  code: string,
): Promise<{ success: boolean } | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No authenticated user");

    // 1. Read enterprise doc
    const entSnap = await getDoc(doc(firestore, "enterprises", enterpriseId));
    if (!entSnap.exists()) throw new Error("Enterprise not found");
    const enterprise = entSnap.data() as Record<string, unknown>;

    // 2. Guard: already has a referral code applied
    if (enterprise.referredByCode) {
      throw new Error("Enterprise already has a referral code applied");
    }

    // 3. Dual lookup: enterprises where referralCode == code
    let referredByType: "enterprise" | "user" | null = null;
    let referredById: string | null = null;

    const entReferralQ = query(
      collection(firestore, "enterprises"),
      where("referralCode", "==", code),
      limit(1),
    );
    const entReferralSnap = await getDocs(entReferralQ);

    if (!entReferralSnap.empty) {
      referredByType = "enterprise";
      referredById = entReferralSnap.docs[0].id;
    } else {
      // Fallback: users collection
      const userReferralQ = query(
        collection(firestore, "users"),
        where("referralCode", "==", code),
        limit(1),
      );
      const userReferralSnap = await getDocs(userReferralQ);
      if (!userReferralSnap.empty) {
        referredByType = "user";
        referredById = userReferralSnap.docs[0].id;
      }
    }

    if (!referredById || !referredByType) {
      throw new Error("Referral code not found");
    }

    // 4. Prevent self-referral for enterprise referrers
    if (referredByType === "enterprise" && referredById === enterpriseId) {
      throw new Error("Cannot use your own referral code");
    }

    // 5. Transaction: update enterprise + record referral
    await runTransaction(firestore, async (t) => {
      t.update(doc(firestore, "enterprises", enterpriseId), {
        referredByCode: code,
        referredByType,
        referredById,
      });

      if (referredByType === "enterprise") {
        const referralRef = doc(collection(firestore, "referrals"));
        t.set(referralRef, {
          referrerId: referredById,
          referrerType: "enterprise",
          referredEnterpriseId: enterpriseId,
          code,
          createdAt: serverTimestamp(),
        });
      } else if (referredByType === "user") {
        t.set(
          doc(firestore, "userReferralEarnings", referredById!),
          { totalReferred: increment(1) },
          { merge: true },
        );
      }
    });

    return { success: true };
  } catch (error) {
    console.error("applyReferralCode failed", error);
    return null;
  }
}

/** Offer limits per plan. */
const OFFER_LIMITS: Record<string, number> = {
  free: 0,
  verified: 1,
  featured: 3,
};

/**
 * Creates a new offer under `enterprises/{enterpriseId}/offers`, enforcing
 * plan-based limits and optional seasonal campaign validation.
 */
export async function createOffer(body: {
  enterpriseId: string;
  title: string;
  description?: string;
  categoryId?: string;
  discountValue: number;
  startsAt: string;
  endsAt: string;
  seasonalCampaignId?: string;
}): Promise<{ offerId: string } | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No authenticated user");

    const {
      enterpriseId,
      title,
      description,
      categoryId,
      discountValue,
      startsAt,
      endsAt,
      seasonalCampaignId,
    } = body;

    // 1. Read enterprise plan
    const entSnap = await getDoc(doc(firestore, "enterprises", enterpriseId));
    if (!entSnap.exists()) throw new Error("Enterprise not found");
    const entData = entSnap.data() as Record<string, unknown>;
    const plan = (entData.plan as string) || "free";

    // 2. Enforce offer limits
    const offerLimit = OFFER_LIMITS[plan] ?? 0;
    if (offerLimit === 0) {
      throw new Error("Your plan does not allow creating offers");
    }

    const now = Timestamp.now();
    const activeOffersQ = query(
      collection(firestore, "enterprises", enterpriseId, "offers"),
      where("endsAt", ">=", now),
    );
    const activeOffersSnap = await getDocs(activeOffersQ);
    if (activeOffersSnap.size >= offerLimit) {
      throw new Error(
        `Your plan allows at most ${offerLimit} active offer(s). Please deactivate or delete an existing offer first.`,
      );
    }

    // 3. Duration validation (max 14 days unless seasonalCampaignId)
    const startsAtDate = new Date(startsAt);
    const endsAtDate = new Date(endsAt);
    const durationDays =
      (endsAtDate.getTime() - startsAtDate.getTime()) / (1000 * 60 * 60 * 24);

    if (!seasonalCampaignId && durationDays > 14) {
      throw new Error("Offer duration cannot exceed 14 days");
    }

    // 4. Verify seasonal campaign if provided
    if (seasonalCampaignId) {
      const campaignSnap = await getDoc(
        doc(firestore, "seasonalCampaigns", seasonalCampaignId),
      );
      if (!campaignSnap.exists()) {
        throw new Error("Seasonal campaign not found");
      }
      const campaign = campaignSnap.data() as Record<string, unknown>;
      if (!campaign.active) {
        throw new Error("Seasonal campaign is not active");
      }
    }

    // 5. Create offer document
    const offerRef = await addDoc(
      collection(firestore, "enterprises", enterpriseId, "offers"),
      {
        enterpriseId,
        title,
        description: description ?? "",
        categoryId: categoryId ?? null,
        discountValue,
        active: true,
        startsAt: Timestamp.fromDate(new Date(startsAt)),
        endsAt: Timestamp.fromDate(new Date(endsAt)),
        seasonalCampaignId: seasonalCampaignId ?? null,
        views: 0,
        redemptions: 0,
        createdAt: serverTimestamp(),
        createdBy: uid,
      },
    );

    return { offerId: offerRef.id };
  } catch (error) {
    console.error("createOffer failed", error);
    return null;
  }
}

/**
 * Updates allowed fields on an existing offer document.
 * Only `active`, `title`, `description`, and `discountValue` may be changed.
 */
export async function updateOffer(body: {
  offerId: string;
  enterpriseId: string;
  active?: boolean;
  title?: string;
  description?: string;
  discountValue?: number;
}): Promise<{ success: boolean } | null> {
  try {
    const { offerId, enterpriseId, active, title, description, discountValue } =
      body;

    // Build update payload with only allowed fields that were provided
    const allowedFields: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };
    if (active !== undefined) allowedFields.active = active;
    if (title !== undefined) allowedFields.title = title;
    if (description !== undefined) allowedFields.description = description;
    if (discountValue !== undefined)
      allowedFields.discountValue = discountValue;

    await updateDoc(
      doc(firestore, "enterprises", enterpriseId, "offers", offerId),
      allowedFields,
    );

    return { success: true };
  } catch (error) {
    console.error("updateOffer failed", error);
    return null;
  }
}

/**
 * Requests a rating from a user for a business interaction.
 * Validates plan limits and lead existence, creates the rating request document,
 * then fire-and-forgets a push notification via the Cloud Function that remains.
 */
export async function requestRating(
  businessId: string,
  userId: string,
): Promise<{ requestId: string } | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No authenticated user");

    // 1. Read enterprise to verify plan and get name
    const entSnap = await getDoc(doc(firestore, "enterprises", businessId));
    if (!entSnap.exists()) throw new Error("Enterprise not found");
    const entData = entSnap.data() as Record<string, unknown>;
    const plan = (entData.plan as string) || "free";
    const businessName = (entData.name as string) || "el negocio";

    // 2. Plan gate: free plans cannot request ratings
    if (plan === "free") {
      throw new Error("Free plan cannot request ratings");
    }

    // 3. Monthly limit for verified plan (≤10/month)
    if (plan === "verified") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const monthlyQ = query(
        collection(firestore, "ratingRequests"),
        where("enterpriseId", "==", businessId),
        where("sentAt", ">=", Timestamp.fromDate(startOfMonth)),
      );
      const monthlySnap = await getDocs(monthlyQ);
      if (monthlySnap.size >= 10) {
        throw new Error(
          "You have reached the monthly rating request limit for your plan",
        );
      }
    }

    // 4. Find a real lead for this user-business pair (status: contacted/quoted/closed)
    const leadQ = query(
      collection(firestore, "leads"),
      where("enterpriseId", "==", businessId),
      where("userId", "==", userId),
      where("status", "in", ["contacted", "quoted", "closed"]),
      limit(1),
    );
    const leadSnap = await getDocs(leadQ);
    if (leadSnap.empty) {
      throw new Error("No qualifying lead found for this user and business");
    }
    const leadId = leadSnap.docs[0].id;

    // 5. Check for duplicate pending request
    const dupQ = query(
      collection(firestore, "ratingRequests"),
      where("enterpriseId", "==", businessId),
      where("userId", "==", userId),
      where("used", "==", false),
      limit(1),
    );
    const dupSnap = await getDocs(dupQ);
    if (!dupSnap.empty) {
      throw new Error("A pending rating request already exists for this user");
    }

    // 6. Create rating request document
    const requestRef = await addDoc(collection(firestore, "ratingRequests"), {
      enterpriseId: businessId,
      userId,
      leadId,
      sentAt: serverTimestamp(),
      used: false,
    });
    const requestId = requestRef.id;

    // 7. Fire-and-forget push notification via the Cloud Function that remains
    panelFetch("sendPushNotification", {
      userId,
      notification: {
        title: "¿Cómo fue tu experiencia?",
        body: `Calificá tu experiencia con ${businessName}`,
        data: { type: "rating_request", requestId, businessId },
      },
      channelId: "ratings",
    }).catch(() => {
      // Silently ignore push notification failures; rating request is already saved.
    });

    return { requestId };
  } catch (error) {
    console.error("requestRating failed", error);
    return null;
  }
}

/**
 * Records that a business has responded to a lead and updates the enterprise's
 * moving average response time. Runs as a single Firestore transaction.
 */
export async function markBusinessResponse(
  leadId: string,
  businessId: string,
): Promise<{ success: boolean; responseMinutes: number } | null> {
  try {
    const result = await runTransaction(firestore, async (t) => {
      // Read lead and enterprise inside the transaction
      const leadRef = doc(firestore, "leads", leadId);
      const entRef = doc(firestore, "enterprises", businessId);

      const [leadSnap, entSnap] = await Promise.all([
        t.get(leadRef),
        t.get(entRef),
      ]);

      if (!leadSnap.exists()) throw new Error("Lead not found");
      if (!entSnap.exists()) throw new Error("Enterprise not found");

      const lead = leadSnap.data() as Record<string, unknown>;
      const enterprise = entSnap.data() as Record<string, unknown>;

      // Verify the lead belongs to this business
      if (lead.enterpriseId !== businessId) {
        throw new Error("Lead does not belong to this business");
      }

      // Calculate response time in minutes
      const createdAt = lead.createdAt as Timestamp;
      const now = Timestamp.now();
      const responseMinutes = Math.round(
        (now.toMillis() - createdAt.toMillis()) / 60000,
      );

      // Update lead
      t.update(leadRef, {
        businessReportedStatus: "responded",
        respondedAt: serverTimestamp(),
      });

      // Update enterprise moving average response time
      const ratingCount = (enterprise.ratingCount as number) || 1;
      const currentAvg = (enterprise.avgResponseMinutes as number) || 0;
      const newAvg = Math.round(
        (currentAvg * (ratingCount - 1) + responseMinutes) / ratingCount,
      );
      t.update(entRef, { avgResponseMinutes: newAvg });

      return { success: true as const, responseMinutes };
    });

    return result;
  } catch (error) {
    console.error("markBusinessResponse failed", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Direct Firestore writes allowed by security rules
// ---------------------------------------------------------------------------

export async function updateLeadBusinessStatus(
  leadId: string,
  status: LeadBusinessStatus,
) {
  try {
    await updateDoc(doc(firestore, "leads", leadId), {
      businessReportedStatus: status,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error("updateLeadBusinessStatus failed", error);
    return null;
  }
}

export async function updateEnterpriseProfile(
  enterpriseId: string,
  patch: Partial<Enterprise>,
) {
  try {
    const ref = doc(firestore, "enterprises", enterpriseId);
    const { id: _id, ...rest } = patch as Record<string, unknown>;
    await updateDoc(ref, rest);
    return true;
  } catch (error) {
    console.error("updateEnterpriseProfile failed", error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Public registration pricing
// ---------------------------------------------------------------------------

/**
 * Returns pricing info for a given plan without requiring authentication.
 * Reads platformSettings/pricing and queries active discountCampaigns.
 */
export async function getPublicPricing(plan: "verified" | "featured"): Promise<{
  basePrice: number;
  finalPrice: number;
  discountApplied: boolean;
  cyclesRemaining: number;
  campaignName: string | null;
  tag: string | null;
} | null> {
  try {
    const pricingSnap = await getDoc(
      doc(firestore, "platformSettings", "pricing"),
    );
    if (!pricingSnap.exists()) return null;
    const pricingData = pricingSnap.data() as Record<string, unknown>;

    const basePrice: number =
      plan === "featured"
        ? ((pricingData.featuredBasePrice as number) ?? 0)
        : ((pricingData.verifiedBasePrice as number) ?? 0);

    const tag: string | null =
      (pricingData[`${plan}Tag`] as string | null) ?? null;

    // Query active discount campaigns that apply to this plan
    const campaignQ = query(
      collection(firestore, "discountCampaigns"),
      where("active", "==", true),
      where("appliesToPlans", "array-contains", plan),
      limit(1),
    );
    const campaignSnap = await getDocs(campaignQ);

    let finalPrice = basePrice;
    let discountApplied = false;
    let cyclesRemaining = 0;
    let campaignName: string | null = null;

    if (!campaignSnap.empty) {
      const campaign = campaignSnap.docs[0].data() as Record<string, unknown>;
      const discountType = campaign.discountType as string;
      const discountValue = (campaign.discountValue as number) ?? 0;
      campaignName = (campaign.name as string) ?? null;
      cyclesRemaining = (campaign.durationCycles as number) ?? 0;

      if (discountType === "percent") {
        finalPrice = Math.round(basePrice * (1 - discountValue / 100));
      } else if (discountType === "fixed_amount") {
        finalPrice = Math.max(0, basePrice - discountValue);
      }
      discountApplied = true;
    }

    return {
      basePrice,
      finalPrice,
      discountApplied,
      cyclesRemaining,
      campaignName,
      tag,
    };
  } catch (error) {
    console.error("getPublicPricing failed", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Business registration
// ---------------------------------------------------------------------------

export interface SubmitDirectoryEnterpriseRequestBody {
  type: string;
  name: string;
  logoImgUrl: { ref: string; url: string };
  coordinates?: { lat: number; lng: number };
  latitude?: number;
  longitude?: number;
  phone?: string;
  phoneCountryCode?: string;
  description?: string;
  city: string;
  directoryCategories?: string[];
  subServices?: Array<{
    id: string;
    categoryId: string;
    label: string;
    active: boolean;
  }>;
  carouselPhotoUrls?: string[];
  tags?: string[];
  whatsapp: string;
  requestedPlan?: "free" | "verified" | "featured";
  chainId?: string;
  referralCodeUsed?: string;
}

/**
 * Submits a new directory enterprise registration request to `enterprise-requests`.
 * The approval Cloud Function (`approveDirectoryEnterpriseRequest`) handles
 * geohash generation, referral resolution, and plan provisioning.
 */
export async function submitDirectoryEnterpriseRequest(
  body: SubmitDirectoryEnterpriseRequestBody,
): Promise<{ requestId: string; status: string } | null> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No authenticated user");

    const docRef = await addDoc(collection(firestore, "enterprise-requests"), {
      ...body,
      requestedByUserId: uid,
      active: true,
      deleted: false,
      createdAt: serverTimestamp(),
    });

    return { requestId: docRef.id, status: "pending" };
  } catch (error) {
    console.error("submitDirectoryEnterpriseRequest failed", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Admin notification
// ---------------------------------------------------------------------------

export async function notifyAdminNewRequest(name: string, city: string) {
  try {
    await fetch("https://ntfy.sh/CareDriver_Registros_Admin", {
      method: "POST",
      body: `Nueva solicitud — ${name} — ${city}`,
    });
  } catch {
    // Silently ignore ntfy failures; the request is already saved.
  }
}
