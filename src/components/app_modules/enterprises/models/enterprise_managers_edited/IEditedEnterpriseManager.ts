import { Enterprise } from "@/interfaces/Enterprise";

export interface IEditedEnterpriseManager {
    validateData(
        userId: string,
        enterpriseId: string,
        enterpriseType: "mechanical" | "tow" | "laundry" | "driver",
    ): Promise<boolean>;

    handle(enterprise: Enterprise): Promise<void>;

    getRedirectionAfterHandling(
        enterpriseType: "mechanical" | "tow" | "laundry" | "driver",
    ): string | undefined;
}
