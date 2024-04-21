"use client";

import AdminSideBar from "@/components/navigation/sidebar/AdminSideBar";
import PageLoader from "@/components/PageLoader";
import { AuthContext } from "@/context/AuthContext";
import { UserRole } from "@/interfaces/UserInterface";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";

const AdminWrapperWithSideBar = ({ children }: { children: React.ReactNode }) => {
    const { loadingUser, user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loadingUser && user.data) {
            if (user.data.role === UserRole.User) {
                toast.warning("Permiso denegado");
                router.push("/services/drive");
            }
        }
    }, [loadingUser]);

    return loadingUser ? (
        <PageLoader />
    ) : (
        <div className="wrapper">
            <AdminSideBar />

            {children}
        </div>
    );
};

export default AdminWrapperWithSideBar;
