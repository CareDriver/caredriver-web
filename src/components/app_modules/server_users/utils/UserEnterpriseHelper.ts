import { ServiceType } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";

export function getAssociatedEnterprise(
    user: UserInterface | undefined,
    typeOfService: ServiceType,
): string | undefined {
    if (!user) {
        return undefined;
    }

    switch (typeOfService) {
        case "driver":
            return user.driverEnterpriseId;
        case "laundry":
            return user.laundryEnterpriseId;
        case "mechanical":
            return user.mechanicalWorkShopId;
        case "tow":
        default:
            return user.towEnterpriseId;
    }
}
