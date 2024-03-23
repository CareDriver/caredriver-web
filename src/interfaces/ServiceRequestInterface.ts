import { Timestamp } from "firebase/firestore";
import { VehicleInterface } from "./VehicleInterface";
import { HistoryLocationInterface } from "./UserInterface";

// This will manage services requests the user
export interface ServiceRequestInterface {
  id?: string; // Unique identifier for the trip
  userId: string | null; // Identifier of the user associated with the trip
  vehicle: VehicleInterface | null; // The vehicle associated with the trip
  // The serviceUserId will be empty ("") while no service user proposal was accepted
  serviceUserId: string; // Identifier of the service user if a proposal is accepted, otherwise empty string
  pickupLocation: HistoryLocationInterface; // Geographical coordinates for the pickup location
  deliveryLocation?: HistoryLocationInterface; // Geographical coordinates for the delivery location, mandatory just for drivers and tows services requests
  isImmediate: boolean; // Indicates if the trip is immediate
  dateTime: Timestamp; // Date and time of the trip
  requestReason: string; // Reason for requesting the service
  comments: string; // Additional comments for the pickup
  // isRequestActive stores if a trip is a request it will be true, if it has already a proposal accepted, driver, price, etc, it will be false
  isRequestActive: boolean; // Indicates if the trip is an active request, and still not an accepted trip
  accepted?: boolean; // true when a proposal of a service user was accepted
  canceled?: boolean; // true if the request was canceled
  createdAt?: Timestamp;
  acceptedAt?: Timestamp;
  willArrivedAt?: number; // aprox minutes that service user will arrive
  price?: { // price of the service, mandatory just for trips and tows services
    currency: 'Bs'; // Currency of the trip price, e.g., "Bs." for Bolivians
    price: number; // Numeric value of the trip price
    method: "cash" | "qr"; // Payment method
  };
}

// Type to set a service request definition
export type UpdateServiceData = (key: keyof ServiceRequestInterface, value: any) => void;

/** Initial value for service request data */
export const initialServiceData = (userId: string | null): ServiceRequestInterface => {
  return {
    userId,
    vehicle: null,
    serviceUserId: "",
    pickupLocation: { locationName: "", coordinates: null },
    deliveryLocation: { locationName: "", coordinates: null },
    isImmediate: false,
    dateTime: Timestamp.now(),
    requestReason: "",
    comments: "",
    isRequestActive: true,
    price: {
      currency: "Bs",
      price: 0,
      method: "cash"
    },
  }
}
