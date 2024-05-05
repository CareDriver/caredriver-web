import { UserInterface, UserRole } from "@/interfaces/UserInterface";

export const DEFAULT_PHOTO =
    "https://firebasestorage.googleapis.com/v0/b/caredriver-61ac3.appspot.com/o/1713474743350_1713474697430_0_34fee41fdec96a56d7fc8d235e9831b5_Noise_Remove-Quality_Enhance_x1-removebg-preview.png?alt=media&token=f58fdc97-6354-4540-aa4b-7f5d11990d82";

export const getRole = (
    req: UserInterface,
): {
    value: string;
    isHigher: boolean;
} => {
    var role = {
        value: "Normal",
        isHigher: false,
    };
    if (req.role !== undefined && req.role !== UserRole.User) {
        role = {
            value: req.role,
            isHigher: true,
        };
    } else if (req.services.length > 1) {
        role = {
            value: "Normal | Servidor",
            isHigher: false,
        };
    }

    return role;
};
