import { firestore } from "@/firebase/FirebaseConfig";
import { Collections } from "@/firebase/CollecionNames";
import { CarWashBooking } from "@/interfaces/Enterprise";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getCountFromServer,
  DocumentSnapshot,
  CollectionReference,
} from "firebase/firestore";

const carWashBookingsCollection = collection(
  firestore,
  Collections.CarWashBookings,
) as CollectionReference<CarWashBooking>;

export interface CarWashBookingFilters {
  enterpriseId?: string;
  canceled?: boolean;
  finished?: boolean;
  accepted?: boolean;
}

const buildConstraints = (filters: CarWashBookingFilters) => {
  const constraints = [];
  if (filters.enterpriseId !== undefined)
    constraints.push(where("enterprise", "==", filters.enterpriseId));
  if (filters.canceled !== undefined)
    constraints.push(where("canceled", "==", filters.canceled));
  if (filters.finished !== undefined)
    constraints.push(where("finished", "==", filters.finished));
  if (filters.accepted !== undefined)
    constraints.push(where("accepted", "==", filters.accepted));
  return constraints;
};

export const getCarWashBookingsPaginated = async (
  filters: CarWashBookingFilters,
  lastDoc: DocumentSnapshot | undefined,
  perPage: number,
): Promise<{
  result: CarWashBooking[];
  lastDoc: DocumentSnapshot | undefined;
}> => {
  try {
    const constraints = buildConstraints(filters);
    const baseQuery = query(
      carWashBookingsCollection,
      ...constraints,
      orderBy("scheduledDateTime", "desc"),
      ...(lastDoc ? [startAfter(lastDoc)] : []),
      limit(perPage),
    );
    const snap = await getDocs(baseQuery);
    const result = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const last = snap.docs[snap.docs.length - 1];
    return { result, lastDoc: last };
  } catch (err) {
    console.error(
      "[CarWashBookings] Error al obtener reservas paginadas:",
      err,
    );
    throw err;
  }
};

export const getCarWashBookingsNumPages = async (
  filters: CarWashBookingFilters,
  perPage: number,
): Promise<number> => {
  try {
    const constraints = buildConstraints(filters);
    const baseQuery = query(carWashBookingsCollection, ...constraints);
    const snap = await getCountFromServer(baseQuery);
    return Math.ceil(snap.data().count / perPage);
  } catch (err) {
    console.error("[CarWashBookings] Error al obtener número de páginas:", err);
    throw err;
  }
};
