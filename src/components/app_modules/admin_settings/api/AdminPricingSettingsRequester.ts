import { firestore } from "@/firebase/FirebaseConfig";
import { Collections } from "@/firebase/CollecionNames";
import {
  ADMIN_PRICING_SETTINGS_DOC_ID,
  AdminPricingSettings,
  AVAILABLE_SERVICES_TO_GET_REQUESTS_DOC_ID,
  AvailableServicesToGetRequests,
  DEFAULT_ADMIN_PRICING_SETTINGS,
  INITIAL_AVAILABLE_SERVICES,
} from "@/interfaces/AdminSettings";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

const adminSettingsCollection = collection(
  firestore,
  Collections.AdminSettings,
);

export const getAdminPricingSettings =
  async (): Promise<AdminPricingSettings> => {
    const settingsRef = doc(
      adminSettingsCollection,
      ADMIN_PRICING_SETTINGS_DOC_ID,
    );
    const snapshot = await getDoc(settingsRef);

    if (!snapshot.exists()) {
      await setDoc(settingsRef, DEFAULT_ADMIN_PRICING_SETTINGS);
      return DEFAULT_ADMIN_PRICING_SETTINGS;
    }

    return snapshot.data() as AdminPricingSettings;
  };

export const saveAdminPricingSettings = async (
  settings: AdminPricingSettings,
): Promise<void> => {
  const settingsRef = doc(
    adminSettingsCollection,
    ADMIN_PRICING_SETTINGS_DOC_ID,
  );
  await setDoc(settingsRef, settings);
};

export const fetchAvailableServicesToGetRequests = async (
  setAvailableServices: (
    data: "loading" | AvailableServicesToGetRequests,
  ) => void,
): Promise<void> => {
  try {
    const docRef = doc(
      adminSettingsCollection,
      AVAILABLE_SERVICES_TO_GET_REQUESTS_DOC_ID,
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setAvailableServices(docSnap.data() as AvailableServicesToGetRequests);
    } else {
      await setDoc(docRef, INITIAL_AVAILABLE_SERVICES);
      setAvailableServices(INITIAL_AVAILABLE_SERVICES);
    }
  } catch (error) {
    console.error(error);
    setAvailableServices(INITIAL_AVAILABLE_SERVICES);
  }
};

export const saveAvailableServicesToGetRequests = async (
  settings: AvailableServicesToGetRequests,
): Promise<void> => {
  const settingsRef = doc(
    adminSettingsCollection,
    AVAILABLE_SERVICES_TO_GET_REQUESTS_DOC_ID,
  );
  await setDoc(settingsRef, settings);
};
