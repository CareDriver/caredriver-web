import { UserInterface } from "@/interfaces/UserInterface";

export interface HandleableServiceStatus {
    user: UserInterface | undefined;
    hasSomeRefusedRequest: () => boolean;
    getStatusFeedback: () => {
        title: string;
        description: string;
    };
    updateRefuseState: () => Promise<void>;
}
