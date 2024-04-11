import { auth } from "@/firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { defaultServiceReq, UserInterface } from "@/interfaces/UserInterface";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useState, useEffect } from "react";
import { getUserById } from "@/utils/requests/UserRequester";
import { servicesData } from "@/interfaces/ServicesDataInterface";

interface UserInfo {
    data: UserInterface | null;
    hasPhoto: boolean;
}

type authContextType = {
    user: UserInfo;
    loadingUser: boolean;
};

const authContextDefaultValues: authContextType = {
    user: {
        data: null,
        hasPhoto: false,
    },
    loadingUser: true,
};

const buildUser = (id: string, userData: UserInterface | undefined): UserInterface => {
    return {
        id: id,
        fullName: userData?.fullName === undefined ? "" : userData.fullName,
        phoneNumber: userData?.phoneNumber === undefined ? "" : userData.phoneNumber,
        photoUrl: userData?.photoUrl === undefined ? "" : userData.photoUrl,
        comments: userData?.comments === undefined ? [] : userData.comments,
        vehicles: userData?.vehicles === undefined ? [] : userData.vehicles,
        services: userData?.services === undefined ? [] : userData.services,
        servicesData:
            userData?.servicesData === undefined ? servicesData : userData.servicesData,
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
    };
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

    useEffect(() => {
        onAuthStateChanged(auth, (res) => {
            if (res) {
                var userId = res.uid;
                try {
                    getUserById(userId).then((userData) => {
                        if (userData) {
                            var userBuilt: UserInterface = buildUser(userId, userData);
                            setUser({
                                data: userBuilt,
                                hasPhoto: userBuilt.photoUrl.trim().length > 0,
                            });
                            setLoadingUser(false);
                        } else {
                            setUser({
                                data: null,
                                hasPhoto: false,
                            });
                            setLoadingUser(false);
                        }
                    });
                } catch (e) {
                    setUser({
                        data: null,
                        hasPhoto: false,
                    });
                    setLoadingUser(false);
                }
            } else {
                router.push("/");
                setLoadingUser(false);
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ loadingUser, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
