import { Timestamp } from "firebase/firestore";
import { Services } from "./Services";

export interface CommentsInterface {
    userId: string; // Unique identifier for the user
    date: Timestamp; // Timestamp indicating the date of comments
}

export interface ServicesDataInterface {
    averageRating: number; // Average rating given by other users
    servicesQuantity: number; // The total number of services made or trips made for normal users
    comments: CommentsInterface[]; // Array of comments given by other users
}

export type ServicesData = {
    [K in Services]: ServicesDataInterface | undefined;
};

const defaultServiceData: ServicesDataInterface = {
    averageRating: 5,
    servicesQuantity: 0,
    comments: [],
};

export const servicesData: ServicesData = {
    [Services.Normal]: { ...defaultServiceData },
    [Services.Driver]: { ...defaultServiceData },
    [Services.Mechanic]: { ...defaultServiceData },
    [Services.Tow]: { ...defaultServiceData },
    [Services.Laundry]: { ...defaultServiceData },
};
