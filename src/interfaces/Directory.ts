import { GeoPoint, Timestamp } from "firebase/firestore";

/**
 * Directory-specific data models.
 *
 * These interfaces mirror the collections and documents created by
 * `caredriver-firebase/functions/src/directory/*`. They are kept in one file
 * so the web panel can consume the same shapes as the mobile app and the
 * backend without inventing new fields.
 */

// ---------------------------------------------------------------------------
// Subscriptions & payments
// ---------------------------------------------------------------------------

export interface SubscriptionPaymentHistoryItem {
  receiptId: string;
  amount: number;
  approvedAt: Timestamp;
  approvedBy: string;
  periodEnd: Timestamp;
}

/**
 * Mirrors `subscriptions/{enterpriseId}` in Firebase.
 *
 * Source of truth for plan expiration and license status.
 * `licenseStatus` and `daysOverdue` are written by backend functions only.
 */
export interface Subscription {
  enterpriseId: string;
  plan: "verified" | "featured";
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  licenseStatus: "active" | "past_due" | "suspended" | "none";
  daysOverdue: number;
  lastPaymentAt: Timestamp | null;
  history: SubscriptionPaymentHistoryItem[];

  // Discount campaign state (managed by backend)
  activeDiscountCampaignId?: string | null;
  discountCyclesRemaining?: number;

  updatedAt?: Timestamp;
}

/**
 * Mirrors `paymentReceipts/{receiptId}` in Firebase.
 */
export interface PaymentReceipt {
  id?: string;
  enterpriseId: string;
  submittedBy?: string;
  fileUrl: string;
  amount: number;
  submittedAt: Timestamp;
  status: "pending" | "approved" | "rejected";
  reviewedBy: string | null;
  reviewedAt: Timestamp | null;
  rejectionReason: string | null;

  // Manual invoicing checklist (no SIN integration yet)
  invoiced?: boolean;
  invoicedBy?: string | null;
  invoicedAt?: Timestamp | null;

  // Optional plan context if the backend stores it
  plan?: "free" | "verified" | "featured" | null;
}

/**
 * Platform pricing settings stored in `platformSettings/pricing`.
 */
export interface PlatformPricingSettings {
  verifiedBasePrice: number;
  featuredBasePrice: number;
  verifiedTag?: string | null;
  featuredTag?: string | null;
  updatedAt?: Timestamp;
  updatedBy?: string;
}

/**
 * Platform payment settings stored in `platformSettings/payment`.
 */
export interface PlatformPaymentSettings {
  verifiedQrCodeImageUrl?: string | null;
  featuredQrCodeImageUrl?: string | null;
  qrCodeImageUrl?: string | null;
  paymentInstructions?: string | null;
  updatedAt?: Timestamp;
  updatedBy?: string;
}

/**
 * Discount campaign. Mirrors `discountCampaigns/{campaignId}`.
 */
export interface DiscountCampaign {
  id?: string;
  name: string;
  active: boolean;
  discountType: "percent" | "fixed_amount";
  discountValue: number;
  durationCycles: number;
  appliesToPlans?: ("verified" | "featured")[];
  eligibilityWindow?: {
    start: Timestamp;
    end: Timestamp;
  };
  qrCodeImageUrl?: string | null;
  createdAt?: Timestamp;
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export type LeadStatus =
  | "contacted"
  | "quoted"
  | "closed"
  | "not_closed"
  | "unknown";

/**
 * Mirrors `leads/{leadId}` in Firebase.
 *
 * No personal user data is exposed to the business — only `vehicleSummary`.
 */
export interface Lead {
  id?: string;
  userId: string;
  enterpriseId: string;
  category: string;
  subServiceId: string | null;
  vehicleSummary: string; // e.g. "Corolla 2013"
  problemText: string;
  zoneLabel: string | null;
  createdAt: Timestamp;
  lastContactedAt: Timestamp;
  contactCount: number;
  status: LeadStatus;
  userReportedClosed: boolean | null;
  userReportedAmount: number | null;
  businessReportedStatus: string | null;
  respondedAt?: Timestamp | null;
  discrepancy?: boolean;
  followUpSent?: boolean;
  businessName?: string; // denormalized for push notifications
}

// ---------------------------------------------------------------------------
// Search & trends
// ---------------------------------------------------------------------------

/**
 * Mirrors `searchEvents/{eventId}` in Firebase.
 *
 * Written by backend only (triageProblem). Client never writes directly.
 */
export interface SearchEvent {
  id?: string;
  category: string;
  subServiceId: string | null;
  city: string | null;
  zoneLabel: string | null;
  userId: string;
  createdAt: Timestamp;
  resultedInContact: boolean;
  leadId?: string | null;
}

/**
 * Mirrors `trendSummaries/{key}` in Firebase.
 */
export interface TrendSummary {
  id?: string;
  city: string;
  category: string;
  weekId: string;
  totalSearches: number;
  bySubService: Record<string, number>;
  byHour: number[];
  byDayOfWeek: number[];
  withContact: number;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Offers
// ---------------------------------------------------------------------------

/**
 * Mirrors `enterprises/{enterpriseId}/offers/{offerId}` in Firebase.
 */
export interface Offer {
  id?: string;
  enterpriseId?: string;
  title: string;
  description: string;
  categoryId: string | null;
  discountValue: number;
  active: boolean;
  startsAt: Timestamp;
  endsAt: Timestamp;
  seasonalCampaignId: string | null;
  views: number;
  redemptions: number;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt?: Timestamp;
}

/**
 * Mirrors `seasonalCampaigns/{campaignId}` in Firebase.
 */
export interface SeasonalCampaign {
  id?: string;
  name: string;
  bannerText: string;
  active: boolean;
  startsAt: Timestamp | string;
  endsAt: Timestamp | string;
  categoryIds?: string[];
  priority?: number;
  mediaUrl?: string | null;
  createdAt?: Timestamp;
}

// ---------------------------------------------------------------------------
// Rating requests
// ---------------------------------------------------------------------------

/**
 * Mirrors `ratingRequests/{requestId}` in Firebase.
 */
export interface RatingRequest {
  id?: string;
  enterpriseId: string;
  userId: string;
  leadId: string;
  sentAt: Timestamp;
  used: boolean;
}

/**
 * Mirrors `enterprises/{enterpriseId}/reviews/{reviewId}` in Firebase.
 */
export interface EnterpriseReview {
  id?: string;
  enterpriseId?: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Favorites
// ---------------------------------------------------------------------------

/**
 * Mirrors `users/{userId}/favorites/{enterpriseId}` in Firebase.
 */
export interface UserFavorite {
  userId: string;
  enterpriseId: string;
  createdAt: Timestamp;
}
