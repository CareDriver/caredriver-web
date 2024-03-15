import { Timestamp } from "firebase/firestore";

export interface ProposalInterface {
    id: string; // Unique identifier for the proposal
    tripId: string; // Identifier of the associated trip
    driverId: string; // Identifier of the driver making the proposal
    dateTime: Timestamp; // Date and time of the proposal
    offeredPrice: {
        currency: "Bs." | string; // Currency of the offered price
        price: number; // Numeric value of the offered price
    };
    createdAt: Timestamp; // Timestamp indicating when the proposal was created, for ordering proposals by time
}
