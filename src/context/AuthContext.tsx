import { auth } from "@/firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { defaultServiceReq, UserInterface, UserRole } from "@/interfaces/UserInterface";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useState, useEffect } from "react";
import { getUserById } from "@/utils/requests/UserRequester";
import { servicesData } from "@/interfaces/ServicesDataInterface";
import { toast } from "react-toastify";
import { emptyPhotoWithRef } from "@/interfaces/ImageInterface";
import { defaultBalance, defaultMinBalance } from "@/interfaces/Payment";

interface UserInfo {
    data: UserInterface | null;
    hasPhoto: boolean;
}

type authContextType = {
    user: UserInfo;
    loadingUser: boolean;
    logout: () => void;
};

const authContextDefaultValues: authContextType = {
    user: {
        data: null,
        hasPhoto: false,
    },
    loadingUser: true,
    logout: () => {},
};

const buildUser = (
    id: string,
    userData: UserInterface | undefined,
): UserInterface | null => {
    if (userData) {
        return {
            id: id,
            fullName: userData?.fullName === undefined ? "" : userData.fullName,
            phoneNumber: userData?.phoneNumber === undefined ? "" : userData.phoneNumber,
            photoUrl:
                userData?.photoUrl === undefined ? emptyPhotoWithRef : userData.photoUrl,
            comments: userData?.comments === undefined ? [] : userData.comments,
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
            balance: userData?.balance === undefined ? defaultBalance : userData.balance,
            balanceHistory: userData?.balanceHistory,
            disable: userData?.disable,
            deleted: userData.deleted,
            serviceVehicles: userData?.serviceVehicles,
            role: userData?.role === undefined ? UserRole.User : userData.role,
            identityCard: userData.identityCard ? userData.identityCard : undefined,
            minimumBalance:
                userData.minimumBalance === undefined
                    ? defaultMinBalance
                    : userData.minimumBalance,
        };
    }

    return null;
};

export const AuthContext = createContext<authContextType>(authContextDefaultValues);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [loadingUser, setLoadingUser] = useState(true);
    const [user, setUser] = useState<UserInfo>({
        data: null,
        hasPhoto: false,
    });

    const refirectToHome = () => {
        if (!pathname.includes("auth")) {
            router.push("/");
        }
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
                                    "Tu cuenta fue borrada, comunicate con uno de nuestro adminstradores",
                                );
                            } else if (userData.disable) {
                                logoutWithReason(
                                    "Fuiste desabilitado, comunicate con uno de nuestro adminstradores",
                                );
                            } else {
                                var userBuilt: UserInterface | null = buildUser(
                                    userId,
                                    userData,
                                );
                                setUser({
                                    data: userBuilt,
                                    hasPhoto:
                                        userBuilt !== null &&
                                        userBuilt.photoUrl.url.trim().length > 0,
                                });
                                setLoadingUser(false);
                            }
                        } else {
                            setUser({
                                data: null,
                                hasPhoto: false,
                            });
                            setLoadingUser(false);
                            refirectToHome();
                        }
                    });
                } catch (e) {
                    setUser({
                        data: null,
                        hasPhoto: false,
                    });
                    setLoadingUser(false);
                    refirectToHome();
                }
            } else {
                setLoadingUser(false);
                refirectToHome();
            }
        });
    }, []);

    const logoutWithReason = (reason: string) => {
        auth.signOut()
            .then(() => {
                setUser({
                    data: null,
                    hasPhoto: false,
                });
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
                setUser({
                    data: null,
                    hasPhoto: false,
                });
                toast.success("Sesion cerrada existosamente");
                router.push("/");
            })
            .catch(() => {
                toast.error("Algo salio mal");
                window.location.replace("/");
            });
    };

    return (
        <AuthContext.Provider value={{ loadingUser, user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
