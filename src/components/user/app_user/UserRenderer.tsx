"use client";

import PageLoader from "@/components/PageLoader";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { getUserById, updateUser } from "@/utils/requests/UserRequester";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ServiceServedByUser from "./ServiceServedByUser";
import DisableUser from "./options/DisableUser";
import DeleteUser from "./options/DeleteUser";
import ServiceReqsByUser from "./ServiceReqsByUser";
import "@/styles/components/app-user.css";
import { DEFAULT_PHOTO, getRole } from "@/utils/user/UserData";
import DebtUser from "./options/DebtUser";
import DebtHistory from "./DebtHistory";
import "@/styles/components/debt-user.css";

const UserRenderer = ({ userId }: { userId: string }) => {
    const [user, setUser] = useState<UserInterface | null>(null);
    const router = useRouter();
    const [formState, setFormState] = useState({
        loading: false,
    });
    const [disableState, setDisableState] = useState({
        confirm: "",
        isValid: false,
    });

    const [deleteState, setDeleteState] = useState({
        confirm: "",
        isValid: false,
    });
    const [role, setRole] = useState<{
        value: string;
        isHigher: boolean;
    } | null>(null);

    const toggleDisableUser = async () => {
        if (user) {
            setFormState({
                ...formState,
                loading: true,
            });
            const isDisable = user.disable ? user.disable : false;
            if (user.id) {
                if (isDisable) {
                    try {
                        await toast.promise(
                            updateUser(user.id, {
                                disable: false,
                            }),
                            {
                                pending: "Habilitando al usuario",
                                success: "Usuario habilitado",
                                error: "Error al volver a habilitar al usuario, intentalo de nuevo",
                            },
                        );
                        setFormState({
                            ...formState,
                            loading: false,
                        });
                        window.location.reload();
                    } catch (e) {
                        setFormState({
                            ...formState,
                            loading: false,
                        });
                        console.log(e);
                    }
                } else {
                    try {
                        await toast.promise(
                            updateUser(user.id, {
                                disable: true,
                            }),
                            {
                                pending: "Deshabilitando al usuario",
                                success: "Usuario deshabilitado",
                                error: "Error al deshabilitar al usuario, intentalo de nuevo",
                            },
                        );
                        setFormState({
                            ...formState,
                            loading: false,
                        });
                        window.location.reload();
                    } catch (e) {
                        setFormState({
                            ...formState,
                            loading: false,
                        });
                        console.log(e);
                    }
                }
            }
        }
    };

    const deleteUser = async () => {
        if (user) {
            setFormState({
                ...formState,
                loading: true,
            });
            if (user.id) {
                try {
                    await toast.promise(
                        updateUser(user.id, {
                            deleted: true,
                        }),
                        {
                            pending: "Eliminando al usuario",
                            success: "Usuario eliminado",
                            error: "Error al eliminar al usuario, intentalo de nuevo",
                        },
                    );
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                    router.push("/admin/users");
                } catch (e) {
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                    console.log(e);
                }
            }
        }
    };

    useEffect(() => {
        getUserById(userId)
            .then((res) => {
                if (res) {
                    setUser(res);
                    setRole(getRole(res));
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

    const getServicesServed = () => {
        if (
            user &&
            (user.role === undefined || user.role !== UserRole.Admin) &&
            user.services.length > 1
        ) {
            return <ServiceServedByUser user={user} />;
        }
    };

    const getServicesRequested = () => {
        if (user && (user.role === undefined || user.role !== UserRole.Admin)) {
            return <ServiceReqsByUser user={user} />;
        }
    };

    return user ? (
        <section className="render-data-wrapper">
            <div className="user-info-wrapper">
                <img
                    src={user.photoUrl.url === "" ? DEFAULT_PHOTO : user.photoUrl.url}
                    alt=""
                    className="user-info-photo"
                />
                <div className="user-info-subwrapper">
                    <h1 className="text | big bolder">{user.fullName}</h1>
                    <h3 className="text | gray-dark bold">{user.email}</h3>
                    <h3 className="text | gray-dark bold">{user.location}</h3>
                    <h3 className="text | gray-dark bold margin-bottom-15">
                        {user.phoneNumber}
                    </h3>
                    {role ? (
                        <h3 className={`text | bolder ${role.isHigher && "green"}`}>
                            {role.value}
                        </h3>
                    ) : (
                        <span className="loader-gray-medium"></span>
                    )}
                </div>
            </div>
            <DebtUser user={user} />
            <DebtHistory user={user} />

            <DisableUser
                loading={formState.loading}
                onAction={toggleDisableUser}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDisableState({
                        ...disableState,
                        confirm: e.target.value,
                        isValid: e.target.value === user.fullName,
                    })
                }
                validToDelete={disableState.isValid}
                isDisable={user.disable ? user.disable : false}
            />
            <DeleteUser
                loading={formState.loading}
                onAction={deleteUser}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDeleteState({
                        ...deleteState,
                        confirm: e.target.value,
                        isValid: e.target.value === user.fullName,
                    })
                }
                validToDelete={deleteState.isValid}
            />
        </section>
    ) : (
        <PageLoader />
    );
};

export default UserRenderer;
