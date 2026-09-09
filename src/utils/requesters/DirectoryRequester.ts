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
// Cloud Function calls
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

export async function getCurrentPrice(
  enterpriseId: string,
): Promise<PlanPricingResponse | null> {
  return panelFetch<PlanPricingResponse>("getCurrentPrice", { enterpriseId });
}

export async function submitPaymentReceipt(
  enterpriseId: string,
  fileUrl: string,
  amount: number,
) {
  return panelFetch<{ receiptId: string; status: string }>(
    "submitPaymentReceipt",
    {
      enterpriseId,
      fileUrl,
      amount,
    },
  );
}

export async function applyReferralCode(enterpriseId: string, code: string) {
  return panelFetch<{ success: boolean }>("applyReferralCode", {
    enterpriseId,
    code,
  });
}

export async function createOffer(body: {
  enterpriseId: string;
  title: string;
  description?: string;
  categoryId?: string;
  discountValue: number;
  startsAt: string;
  endsAt: string;
  seasonalCampaignId?: string;
}) {
  return panelFetch<{ offerId: string }>("createOffer", body);
}

export async function updateOffer(body: {
  offerId: string;
  enterpriseId: string;
  active?: boolean;
  title?: string;
  description?: string;
  discountValue?: number;
}) {
  return panelFetch<{ success: boolean }>("updateOffer", body);
}

export async function requestRating(businessId: string, userId: string) {
  return panelFetch<{ requestId: string }>("requestRating", {
    businessId,
    userId,
  });
}

export async function markBusinessResponse(leadId: string, businessId: string) {
  return panelFetch<{ success: boolean; responseMinutes: number }>(
    "markBusinessResponse",
    {
      leadId,
      businessId,
    },
  );
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

export async function getPublicPricing(plan: "verified" | "featured") {
  return panelFetch<{
    basePrice: number;
    finalPrice: number;
    discountApplied: boolean;
    cyclesRemaining: number;
    campaignName: string | null;
    tag: string | null;
  }>("getPublicPricing", { plan });
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

export async function submitDirectoryEnterpriseRequest(
  body: SubmitDirectoryEnterpriseRequestBody,
) {
  return panelFetch<{ requestId: string; status: string }>(
    "submitDirectoryEnterpriseRequest",
    body,
  );
}

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
