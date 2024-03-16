import { GeoPoint } from "firebase/firestore";

// Interface for crane companies
export interface Enterprise {
  id?: string;
  type: "mechanical" | "tow";
  name: string;
  logoImgUrl: string;
  coordinates?: GeoPoint; // Mandatory just for mechanics
  phone?: string; // Optional (No need to be verified)
  userId: string; // The user who created the enterprise
}
