"use client";

import PageLoader from "@/components/PageLoader";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { getUserById, updateUser } from "@/utils/requests/UserRequester";
import { useRouter } from "next/navigation";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ServiceServedByUser from "./ServiceServedByUser";
import DisableUser from "./options/DisableUser";
import DeleteUser from "./options/DeleteUser";
import ServiceReqsByUser from "./ServiceReqsByUser";
import "@/styles/components/app-user.css";
import { DEFAULT_PHOTO, getRole } from "@/utils/user/UserData";
import BalanceUser from "./options/BalanceUser";
import DebtHistory from "./DebtHistory";
import "@/styles/components/debt-user.css";
import MinBalanceUser from "./options/MinBalanceUser";
import { AuthContext } from "@/context/AuthContext";

const UserRenderer = ({ userId }: { userId: string }) => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState<UserInterface | null>(null);
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
        if (userData) {
            setFormState({
                ...formState,
                loading: true,
            });
            const isDisable = userData.disable ? userData.disable : false;
            if (userData.id) {
                if (isDisable) {
                    try {
                        await toast.promise(
                            updateUser(userData.id, {
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
                            updateUser(userData.id, {
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
        if (userData) {
            setFormState({
                ...formState,
                loading: true,
            });
            if (userData.id) {
                try {
                    await toast.promise(
                        updateUser(userData.id, {
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
                    setUserData(res);
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
            userData &&
            (userData.role === undefined || userData.role !== UserRole.Admin) &&
            userData.services.length > 1
        ) {
            return <ServiceServedByUser user={userData} />;
        }
    };

    const getServicesRequested = () => {
        if (
            userData &&
            (userData.role === undefined || userData.role !== UserRole.Admin)
        ) {
            return <ServiceReqsByUser user={userData} />;
        }
    };

    return userData ? (
        <section className="render-data-wrapper">
            <div className="user-info-wrapper">
                <img
                    src={
                        userData.photoUrl.url === ""
                            ? DEFAULT_PHOTO
                            : userData.photoUrl.url
                    }
                    alt=""
                    className="user-info-photo"
                />
                <div className="user-info-subwrapper">
                    <h1 className="text | big bolder">{userData.fullName}</h1>
                    <h3 className="text | gray-dark bold">{userData.email}</h3>
                    <h3 className="text | gray-dark bold">{userData.location}</h3>
                    <h3 className="text | gray-dark bold margin-bottom-15">
                        {userData.phoneNumber}
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
            {user.data && <BalanceUser user={userData} adminUser={user.data} />}
            <MinBalanceUser user={userData} />
            <DebtHistory user={userData} />

            <DisableUser
                loading={formState.loading}
                onAction={toggleDisableUser}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDisableState({
                        ...disableState,
                        confirm: e.target.value,
                        isValid: e.target.value === userData.fullName,
                    })
                }
                validToDelete={disableState.isValid}
                isDisable={userData.disable ? userData.disable : false}
            />
            <DeleteUser
                loading={formState.loading}
                onAction={deleteUser}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDeleteState({
                        ...deleteState,
                        confirm: e.target.value,
                        isValid: e.target.value === userData.fullName,
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
