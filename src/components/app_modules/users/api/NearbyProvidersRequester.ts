import { firestore } from "@/firebase/FirebaseConfig";
import { Collections } from "@/firebase/CollecionNames";
import {
  AvailabilityConfig,
  LastKnownLocation,
  UserInterface,
} from "@/interfaces/UserInterface";
import { Services } from "@/interfaces/Services";
import { Locations } from "@/interfaces/Locations";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  Timestamp,
} from "firebase/firestore";

export interface NearbyProviderInfo {
  id: string;
  fullName: string;
  photoUrl?: string;
  phone?: string;
  isAvailable?: boolean;
  lastKnownLocation?: LastKnownLocation;
  availabilityConfig?: AvailabilityConfig;
  fcmTokens?: string[];
}

/** How long (ms) ago a provider last updated to be considered "online" */
const ONLINE_THRESHOLD_MS = 5 * 60 * 1000; // 5 min
const RECENT_THRESHOLD_MS = 30 * 60 * 1000; // 30 min

export type ProviderOnlineStatus = "online" | "recent" | "offline";

export function getProviderOnlineStatus(
  lastKnownLocation?: LastKnownLocation,
  _isAvailable?: boolean,
): ProviderOnlineStatus {
  if (!lastKnownLocation) return "offline";
  const updatedMs = lastKnownLocation.updatedAt.toMillis();
  const now = Date.now();
  const diff = now - updatedMs;
  if (diff <= ONLINE_THRESHOLD_MS) return "online";
  if (diff <= RECENT_THRESHOLD_MS) return "recent";
  return "offline";
}

export const getNearbyProviders = async (
  service: Services,
  location: Locations,
  limitCount: number = 20,
): Promise<NearbyProviderInfo[]> => {
  try {
    const usersCollection = collection(firestore, Collections.Users);
    const q = query(
      usersCollection,
      where("services", "array-contains", service),
      where("location", "==", location),
      where("disable", "==", false),
      where("deleted", "==", false),
      limit(limitCount),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as UserInterface;
      return {
        id: d.id,
        fullName: data.fullName,
        photoUrl: data.photoUrl?.url,
        phone: data.phoneNumber?.number,
        isAvailable: data.isAvailable,
        lastKnownLocation: data.lastKnownLocation,
        availabilityConfig: data.availabilityConfig,
      };
    });
  } catch (err) {
    console.error(
      "[NearbyProviders] Error al obtener proveedores cercanos:",
      err,
    );
    throw err;
  }
};
