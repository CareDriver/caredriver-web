import { auth } from "@/firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { UserInterface } from "@/interfaces/UserInterface";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useState, useEffect } from "react";
import { getUserById } from "@/utils/requests/UserRequester";
import { toast } from "react-toastify";

type authContextType = {
    user: UserInterface | undefined;
    isLogged: () => boolean;
};

const authContextDefaultValues: authContextType = {
    user: undefined,
    isLogged: () => false,
};

export const AuthContext = createContext<authContextType>(authContextDefaultValues);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserInterface>();
    const router = useRouter();
    const pathname = usePathname();

    const isLogged = () => {
        if (!user) {
            checkLogin();
        }

        return user != undefined;
    };

    const checkLogin = () => {
        if (!user) {
            onAuthStateChanged(auth, (res) => {
                if (res) {
                    var userId = res.uid;
                    getUserById(userId)
                        .then((userData) => {
                            setUser(userData);
                        })
                        .catch(() => {
                            if (pathname !== "/") {
                                toast("Necesitas iniciar sesión");
                                router.push("/");
                            }
                        });
                } else {
                    if (pathname !== "/") {
                        toast("Necesitas iniciar sesión");
                        router.push("/");
                    }
                }
            });
        }
    };

    useEffect(checkLogin, []);

    return (
        <AuthContext.Provider value={{ user, isLogged }}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
