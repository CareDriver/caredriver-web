import { auth } from "@/firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
    defaultServiceReq,
    UserInterface,
    UserRole,
} from "@/interfaces/UserInterface";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useState, useEffect } from "react";
import { getUserById } from "@/utils/requests/UserRequester";
import { servicesData } from "@/interfaces/ServicesDataInterface";
import { toast } from "react-toastify";
import { emptyPhotoWithRef } from "@/interfaces/ImageInterface";
import { defaultBalance, defaultMinBalance } from "@/interfaces/Payment";
import { deleteAllCookies } from "@/utils/temp_storage/CookiesHandler";

type ContextType = {
    user: UserInterface | undefined;
    checkingUserAuth: boolean;

    logout: () => void;
    hasPhoto: () => boolean;
};

const DEFAULT_CONTEXT: ContextType = {
    user: undefined,
    checkingUserAuth: true,

    logout: () => {},
    hasPhoto: () => false,
};

const loadUserLoggedData = (
    id: string,
    userData: UserInterface | undefined,
): UserInterface | undefined => {
    if (userData) {
        return {
            id: id,
            fakeId: userData.fakeId,
            fullName: userData?.fullName === undefined ? "" : userData.fullName,
            phoneNumber:
                userData?.phoneNumber === undefined ? "" : userData.phoneNumber,
            photoUrl:
                userData?.photoUrl === undefined
                    ? emptyPhotoWithRef
                    : userData.photoUrl,
            // comments: userData?.comments === undefined ? [] : userData.comments,
            vehicles: userData?.vehicles === undefined ? [] : userData.vehicles,
            services: userData?.services === undefined ? [] : userData.services,
            servicesData:
                userData?.servicesData === undefined
                    ? servicesData
                    : userData.servicesData,
            pickUpLocationsHistory:
                userData?.pickUpLocationsHistory === undefined
                    ? []
                    : userData.pickUpLocationsHistory,
            deliveryLocationsHistory:
                userData?.deliveryLocationsHistory === undefined
                    ? []
                    : userData.deliveryLocationsHistory,
            email: userData?.email === undefined ? "" : userData.email,
            serviceRequests:
                userData?.serviceRequests === undefined
                    ? defaultServiceReq
                    : userData.serviceRequests,
            location: userData?.location,
            balance:
                userData?.balance === undefined
                    ? defaultBalance
                    : userData.balance,
            balanceHistory: userData?.balanceHistory,
            disable: userData?.disable,
            deleted: userData.deleted,
            serviceVehicles: userData?.serviceVehicles,
            role: userData?.role === undefined ? UserRole.User : userData.role,
            identityCard: userData.identityCard
                ? userData.identityCard
                : undefined,
            minimumBalance:
                userData.minimumBalance === undefined
                    ? defaultMinBalance
                    : userData.minimumBalance,
            branding: userData.branding,
            driverEnterpriseId: userData.driverEnterpriseId,
            laundryEnterpriseId: userData.laundryEnterpriseId,
            mechanicalWorkShopId: userData.mechanicalWorkShopId,
            towEnterpriseId: userData.towEnterpriseId,
        };
    }

    return undefined;
};

export const AuthContext = createContext<ContextType>(DEFAULT_CONTEXT);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [checkingUserAuth, setCheckUserAuth] = useState(true);
    const [user, setUser] = useState<UserInterface | undefined>(undefined);

    const refirectToHome = () => {
        if (!pathname.includes("auth")) {
            router.push("/");
        }
    };

    const hasPhoto = (): boolean => {
        return (
            user !== undefined &&
            user.photoUrl.url.length > 0 &&
            user.photoUrl.url.trim().length > 0
        );
    };

    useEffect(() => {
        onAuthStateChanged(auth, (res) => {
            if (res) {
                var userId = res.uid;
                try {
                    getUserById(userId).then((userData) => {
                        if (userData) {
                            if (userData.deleted) {
                                logoutWithReason(
                                    "Tu cuenta fue borrada, comunícate con uno de nuestro administradores",
                                );
                            } else if (userData.disable) {
                                logoutWithReason(
                                    "Fuiste , comunícate con uno de nuestro administradores",
                                );
                            } else {
                                let userLoaded: UserInterface | undefined =
                                    loadUserLoggedData(userId, userData);
                                setUser(userLoaded);
                                setCheckUserAuth(false);
                            }
                        } else {
                            setUser(undefined);
                            setCheckUserAuth(false);
                            refirectToHome();
                        }
                    });
                } catch (e) {
                    setUser(undefined);
                    setCheckUserAuth(false);
                    refirectToHome();
                }
            } else {
                setCheckUserAuth(false);
                refirectToHome();
            }
        });
    }, []);

    const logoutWithReason = (reason: string) => {
        auth.signOut()
            .then(() => {
                setUser(undefined);
                toast.warning(reason);
                router.push("/");
            })
            .catch(() => {
                toast.error("Algo salio mal");
                window.location.replace("/");
            });
    };

    const logout = () => {
        auth.signOut()
            .then(() => {
                deleteAllCookies();
                setUser(undefined);
                toast.success("Sesión cerrada existosamente");
                router.push("/");
            })
            .catch(() => {
                toast.error("Algo salio mal");
                window.location.replace("/");
            });
    };

    return (
        <AuthContext.Provider
            value={{ checkingUserAuth, user, logout, hasPhoto }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
