import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getCountFromServer,
  CollectionReference,
  DocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "@/firebase/FirebaseConfig";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { Locations } from "@/interfaces/Locations";
import { Services } from "@/interfaces/Services";
import { Collections } from "@/firebase/CollecionNames";

const driveServicesColl = collection(
  firestore,
  Collections.DriverServices,
) as CollectionReference;
const mechanicServicesColl = collection(
  firestore,
  Collections.MechanicalServices,
) as CollectionReference;
const towServicesColl = collection(
  firestore,
  Collections.TowsServices,
) as CollectionReference;
const laundryServicesColl = collection(
  firestore,
  Collections.CarWashServices,
) as CollectionReference;

export interface AdminServicesFilters {
  location?: Locations;
  serviceType?: Services;
  status?: "active" | "started" | "finished" | "canceled" | "all";
}

const getCollectionByServiceType = (
  serviceType: Services,
): CollectionReference => {
  switch (serviceType) {
    case Services.Driver:
      return driveServicesColl;
    case Services.Mechanic:
      return mechanicServicesColl;
    case Services.Tow:
      return towServicesColl;
    case Services.Laundry:
      return laundryServicesColl;
    default:
      return driveServicesColl;
  }
};

const getStatusConstraint = (status: string | undefined) => {
  if (!status || status === "all") return null;

  switch (status) {
    case "active":
      return where("isRequestActive", "==", true);
    case "started":
      return where("started", "==", true);
    case "finished":
      return where("finished", "==", true);
    case "canceled":
      return where("canceled", "==", true);
    default:
      return null;
  }
};

/**
 * Get all services filtered by location, service type and status with pagination
 * Orders by newest first (createdAt descending)
 */
export const getAllServicesPaginated = async (
  filters: AdminServicesFilters,
  pageNum: number = 1,
  numPerPage: number = 8,
  startAfterDoc?: DocumentSnapshot,
) => {
  try {
    console.log(
      "[AdminServices][Paginated] Fetching services with filters:",
      filters,
    );
    console.log(
      `[AdminServices][Paginated] Page ${pageNum}, Items per page: ${numPerPage}`,
    );

    if (!filters.serviceType) {
      console.error(
        "[AdminServices][Paginated] ERROR: Service type is required",
      );
      throw new Error("Service type is required");
    }

    const collection = getCollectionByServiceType(filters.serviceType);

    // Build the query with constraints
    let constraints: any[] = [
      orderBy("createdAt", "desc"),
      limit(numPerPage + 1), // +1 to check if there are more pages
    ];

    // Add location filter if specified
    if (filters.location) {
      constraints.unshift(where("location", "==", filters.location));
    }

    // Add status filter if specified
    const statusConstraint = getStatusConstraint(filters.status);
    if (statusConstraint) {
      constraints.unshift(statusConstraint);
    }

    let dataQuery = query(collection, ...constraints);

    if (startAfterDoc) {
      // Rebuild query with startAfter
      let rebuiltConstraints: any[] = [];

      if (filters.location) {
        rebuiltConstraints.push(where("location", "==", filters.location));
      }

      if (statusConstraint) {
        rebuiltConstraints.push(statusConstraint);
      }

      rebuiltConstraints.push(orderBy("createdAt", "desc"));
      rebuiltConstraints.push(startAfter(startAfterDoc));
      rebuiltConstraints.push(limit(numPerPage + 1));

      dataQuery = query(collection, ...rebuiltConstraints);
    }

    const servicesSnapshot = await getDocs(dataQuery);
    const hasMore = servicesSnapshot.docs.length > numPerPage;
    const docs = hasMore
      ? servicesSnapshot.docs.slice(0, numPerPage)
      : servicesSnapshot.docs;

    const services = docs.map((doc) => {
      const service = doc.data() as ServiceRequestInterface;
      service.id = doc.id;
      return service;
    });

    console.log(`[AdminServices][Paginated] Found ${services.length} services`);

    return {
      result: services,
      hasMore,
      lastDoc: docs[docs.length - 1],
      firstDoc: docs[0],
    };
  } catch (error) {
    console.error("[AdminServices][Paginated] ERROR:", error);
    throw error;
  }
};

/**
 * Get total number of pages for all services
 */
export const getAllServicesNumPages = async (
  filters: AdminServicesFilters,
  numPerPage: number = 8,
): Promise<number> => {
  try {
    console.log(
      "[AdminServices][NumPages] Calculating pages for filters:",
      filters,
    );

    if (!filters.serviceType) {
      console.error(
        "[AdminServices][NumPages] ERROR: Service type is required",
      );
      throw new Error("Service type is required");
    }

    const collection = getCollectionByServiceType(filters.serviceType);
    const constraints: any[] = [];

    if (filters.location) {
      constraints.push(where("location", "==", filters.location));
    }

    const statusConstraint = getStatusConstraint(filters.status);
    if (statusConstraint) {
      constraints.push(statusConstraint);
    }

    const count = await getCountFromServer(query(collection, ...constraints));
    const numPages = Math.ceil(count.data().count / numPerPage);

    console.log(`[AdminServices][NumPages] Total pages: ${numPages}`);

    return numPages;
  } catch (error) {
    console.error("[AdminServices][NumPages] ERROR:", error);
    throw error;
  }
};

/**
 * Get a single service by ID
 */
export const getServiceById = async (
  id: string,
  serviceType: Services,
): Promise<ServiceRequestInterface | undefined> => {
  try {
    console.log(
      `[AdminServices][GetById] Fetching service ${id} of type ${serviceType}`,
    );

    const collection = getCollectionByServiceType(serviceType);
    const docRef = await getDocs(
      query(collection, where("__name__", "==", id)),
    );

    if (docRef.empty) {
      console.warn(
        `[AdminServices][GetById] Service ${id} not found in ${serviceType}`,
      );
      return undefined;
    }

    const service = docRef.docs[0].data() as ServiceRequestInterface;
    service.id = id;

    console.log("[AdminServices][GetById] Service found");
    return service;
  } catch (error) {
    console.error("[AdminServices][GetById] ERROR:", error);
    throw error;
  }
};
