import { Timestamp } from "firebase/firestore";

/**
 * Referral data models.
 *
 * Mirrors the collections managed by `caredriver-firebase/functions/src/directory/*`
 * and `caredriver-firebase/functions/src/utils/interfaces/Referrals.ts`.
 */

/**
 * Mirrors `referrals/{referralId}` in Firebase.
 *
 * Business-to-business referral record. Bonus days are applied only when the
 * referred business pays for the first time.
 */
export interface Referral {
  id?: string;
  referrerEnterpriseId: string; // owner of the code used
  referredEnterpriseId: string; // the new business that used the code
  codeUsed: string;
  capturedAt: Timestamp; // when the registration happened
  benefitApplied: boolean; // false until first payment
  benefitAppliedAt: Timestamp | null;
  bonusDaysGranted: number; // REFERRAL_BONUS_DAYS at moment of application
}

/**
 * Mirrors `userReferralEarnings/{userId}` in Firebase.
 *
 * Aggregated earnings for a user who referred businesses. One document per user
 * who has ever referred someone; do not create empty docs for all users.
 */
export interface UserReferralEarnings {
  userId?: string;
  referralCode: string; // copy from users/{uid}.referralCode
  fullName?: string; // denormalized for admin panel
  phone?: string; // denormalized for admin panel
  totalReferred: number; // distinct businesses referred
  totalOwed: number; // Bs accumulated, pending payout
  totalPaid: number; // Bs paid out historically
  lastPayoutAt: Timestamp | null;
}

/**
 * Mirrors `referralEarningsLedger/{id}` in Firebase.
 *
 * Auditable ledger entry for each commission-generating payment.
 */
export interface ReferralEarningsLedger {
  id?: string;
  userId: string;
  referredEnterpriseId: string;
  paymentReceiptId: string; // which payment triggered this
  paymentNumber: number; // 1st, 2nd, 3rd... payment of this business
  amountEarned: number; // USER_REFERRAL_PERCENT of payment amount
  status: "pending" | "paid";
  paidAt: Timestamp | null;
  paidBy: string | null; // admin uid
}
