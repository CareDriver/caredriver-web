"use client";

import PageLoader from "@/components/PageLoader";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { getUserById } from "@/utils/requests/UserRequester";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NormalUserRenderer from "./NormalUserRenderer";
import AdminUserRenderer from "./AdminUserRenderer";

const UserRenderer = ({ userId }: { userId: string }) => {
    const [user, setUser] = useState<UserInterface | null>(null);
    const router = useRouter();

    useEffect(() => {
        getUserById(userId)
            .then((res) => {
                if (res) {
                    setUser(res);
                } else {
                    toast.error("Usuario no encontrado");
                    router.push("/admin/users");
                }
            })
            .catch((e) => {
                console.log(e);
                toast.error("Usuario no encontrado");
                router.push("/admin/users");
            });
    }, []);

    const getPageRenderer = () => {
        if (user) {
            switch (user.role) {
                case UserRole.User:
                    return <NormalUserRenderer user={user} />;
                case UserRole.Support:
                case UserRole.Admin:
                    return <AdminUserRenderer user={user} />;
            }
        }
    };

    return user ? (
        <section>
            <div>
                <img src={user.photoUrl.url} alt="" />
                <div>
                    <h1>{user.fullName}</h1>
                    <h3>{user.email}</h3>
                    <h3>{user.location}</h3>
                    <h3>{user.role}</h3>
                </div>
            </div>
            {getPageRenderer()}
        </section>
    ) : (
        <PageLoader />
    );
};

export default UserRenderer;
