import { Timestamp } from "firebase/firestore";

export interface ReasonForInformationInterface {
    id: string;
    complaintId?: string;
    justification?: string;
    informationViewDate: Timestamp;
    userId: string;
}
