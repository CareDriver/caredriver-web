"use client";

import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            toast("Ya iniciaste session");
            router.push("/services/drive");
        }
    }, []);

    return (
        <main>
            <div>image</div>
            {children}
        </main>
    );
};

export default AuthWrapper;
