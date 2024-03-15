import { Timestamp } from "firebase/firestore";
import { VehicleInterface } from "./VehicleInterface";
import { HistoryLocationInterface } from "./UserInterface";

// This will manage requests and trips of the user
export interface TripInterface {
    id?: string; // Unique identifier for the trip
    userId: string | null; // Identifier of the user associated with the trip
    vehicle: VehicleInterface | null; // The vehicle associated with the trip
    // The driverId will be empty ("") while no driver proposal was accepted
    driverId: string; // Identifier of the driver if a proposal is accepted, otherwise empty string
    pickupLocation: HistoryLocationInterface; // Geographical coordinates for the pickup location
    deliveryLocation: HistoryLocationInterface; // Geographical coordinates for the delivery location
    isImmediate: boolean; // Indicates if the trip is immediate
    dateTime: Timestamp; // Date and time of the trip
    pickupReason: string; // Reason for the pickup
    comment: string; // Additional comments for the pickup
    // isRequestActive stores if a trip is a request it will be true, if it has already a proposal accepted, driver, price, etc, it will be false
    isRequestActive: boolean; // Indicates if the trip is an active request, and still not an accepted trip
    price: {
        currency: "Bs." | string; // Currency of the trip price, e.g., "Bs." for Bolivians
        price: number; // Numeric value of the trip price
    };
}

/** Initial value for trip data */
export const initialTripData = (userId: string | null): TripInterface => {
    return {
        userId,
        vehicle: null,
        driverId: "",
        pickupLocation: { locationName: "", coordinates: null },
        deliveryLocation: { locationName: "", coordinates: null },
        isImmediate: false,
        dateTime: Timestamp.now(),
        pickupReason: "",
        comment: "",
        isRequestActive: true,
        price: {
            currency: "Bs.",
            price: 0,
        },
    };
};
