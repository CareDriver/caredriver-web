import { Timestamp } from "firebase/firestore";

export interface TermsAcceptance {
  uid: string;
  termsVersion: string;
  ip: string;
  userAgent: string;
  acceptedAt: Timestamp;
  signatureType: "simple_electronic";
}
