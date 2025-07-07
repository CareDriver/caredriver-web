import { Timestamp } from "firebase/firestore";
import { ServicesDataInterface } from "./ServicesDataInterface";
import { VehicleInterface } from "./VehicleInterface";
import { HistoryLocationInterface, PhoneNumber } from "./UserInterface";
import { Locations } from "./Locations";

// This will manage services requests the user
export interface ServiceRequestInterface {
  id?: string; // Unique identifier for the trip
  fakedId?: string;
  userId: string | null; // Identifier of the user associated with the trip
  vehicle: VehicleInterface | null; // The vehicle associated with the trip
  // The serviceUserId will be empty ("") while no service user proposal was accepted
  serviceUserId: string; // Identifier of the service user if a proposal is accepted, otherwise empty string
  pickupLocation: HistoryLocationInterface; // Geographical coordinates for the pickup location
  deliveryLocation?: HistoryLocationInterface; // Geographical coordinates for the delivery location, mandatory just for drivers and tows services requests
  isImmediate: boolean; // Indicates if the trip is immediate (For future versions use)
  dateTime: Timestamp; // Date and time of the trip (For future versions use)
  requestReason: string; // Reason for requesting the service
  comments: string; // Additional comments for the pickup
  // isRequestActive stores if a trip is a request it will be true, if it has already a proposal accepted, driver, price, etc, it will be false
  isRequestActive: boolean; // Indicates if the trip is an active request, and still not an accepted trip
  accepted?: boolean; // true when a proposal of a service user was accepted
  started?: boolean; // true when a request is started
  // To check if a user is waiting for the service user, it should be accepted && !started && !serviceUserArrived
  finished?: boolean; // true when the service finished
  canceled?: boolean; // true if the request was canceled
  createdAt?: Timestamp;
  acceptedAt?: Timestamp;
  willArrivedAt?: Timestamp; // aprox date that service user will arrive (taking time in account)
  sharing?: Timestamp | false;
  price?: {
    // price of the service, mandatory just for trips and tows services
    currency: "Bs"; // Currency of the trip price, e.g., "Bs." for Bolivians
    price: number; // Numeric value of the trip price
    method: "cash" | "qr"; // Payment method
  };
  // TO DO: IN US 66, refactor price attribute to:
  // price?: ServicePayment;
  startedAt?: Timestamp;
  finishedAt?: Timestamp;
  requestUserData?: {
    // Data of the normal user
    fullName: string; // Full name of the user
    phoneNumber: string | PhoneNumber; // Phone number of the user (includes country code, ej: +591 76543218)
    photoUrl: string; // URL of the user's photo
    email: string; // User's email
    normalServiceData?: ServicesDataInterface; // The data of the normal service for the request user (rating, comments, etc)
  };
  serviceUserData?: {
    // Data of the normal user
    fullName: string; // Full name of the user
    phoneNumber: string | PhoneNumber; // Phone number of the user (includes country code, ej: +591 76543218)
    photoUrl: string; // URL of the user's photo
    email: string; // User's email
    serviceData?: ServicesDataInterface; // The data of the normal service for the request user (rating, comments, etc)
  };
  serviceUserOnTheWay?: boolean; // Indicates if the service user is already going to the pickup location
  // true by default
  serviceUserArrived?: boolean; // Indicates if the service user already arrived to the pickup location
  proposalId?: string; // the id  of the accepted proposal
  serviceUserAlreadyRated?: boolean; // If the service user was already rated by the normal user
  requestUserAlreadyRated?: boolean; // If the normal user was already rated by the service user
  location?: Locations;
}

// Type to set a service request definition
export type UpdateServiceData = (
  key: keyof ServiceRequestInterface,
  value: any,
) => void;

/** Initial value for service request data */
export const initialServiceData = (
  userId: string | null,
): ServiceRequestInterface => {
  return {
    userId,
    vehicle: null,
    serviceUserId: "",
    pickupLocation: { locationName: "", coordinates: null },
    deliveryLocation: { locationName: "", coordinates: null },
    isImmediate: true,
    dateTime: Timestamp.now(),
    requestReason: "",
    comments: "",
    isRequestActive: true,
    price: {
      currency: "Bs",
      price: 0,
      method: "cash",
    },
    requestUserData: {
      fullName: "",
      phoneNumber: "",
      photoUrl: "",
      email: "",
      normalServiceData: {
        averageRating: 5,
        servicesQuantity: 0,
        comments: [],
      },
    },
  };
};
