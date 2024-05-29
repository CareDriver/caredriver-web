"use client";

import PageLoader from "@/components/PageLoader";
import { UserInterface } from "@/interfaces/UserInterface";
import { getUserById, updateUser } from "@/utils/requests/UserRequester";
import { useRouter } from "next/navigation";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import DisableUser from "./options/DisableUser";
import DeleteUser from "./options/DeleteUser";
import "@/styles/components/app-user.css";
import { DEFAULT_PHOTO, getRole } from "@/utils/user/UserData";
import "@/styles/components/debt-user.css";
import { AuthContext } from "@/context/AuthContext";
import CompPermissionValidator from "@/components/permission/component/CompPermissionValidator";
import {
    checkPermission,
    ROLES_FOR_DELETE_USERS,
    ROLES_FOR_DISABLE_USERS,
    ROLES_FOR_SERVER_USER_ACTIONS,
    ROLES_TO_VIEW_CONTACT_USERS,
    ROLES_TO_VIEW_USER_CREDENTIALS,
} from "@/utils/validator/roles/RoleValidator";
import UserHistoryRenderer from "./concrets/UserHistoryRenderer";
import UserContacts from "./options/UserContacts";
import UserRoleSeter from "./options/UserRoleSeter";

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
                    } catch (e) {
                        setFormState({
                            ...formState,
                            loading: false,
                        });
                        console.log(e);
                    }
                }

                try {
                    await toast.promise(
                        fetch("/api/userstate", {
                            method: "POST",
                            body: JSON.stringify({
                                userId: userData.id,
                                state: !isDisable,
                            }),
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                        }),
                        {
                            pending: isDisable
                                ? "Habilitando la authenticacion del usuario"
                                : "Desabilitando la autenticacion del usuario",
                            success: isDisable ? "Habilitado" : "Desabilitado",
                            error: isDisable
                                ? "Error al habilitar la autenticacion del usuario, intentalo de nuevo por favor"
                                : "Error al desabilitar la autenticacion del usuario, intentalo de nuevo por favor",
                        },
                    );
                    window.location.reload();
                } catch (e) {
                    console.log(e);
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
                    <CompPermissionValidator
                        user={user.data}
                        roles={ROLES_TO_VIEW_USER_CREDENTIALS}
                    >
                        <>
                            <h3 className="text | gray-dark bold">{userData.location}</h3>
                            <h3 className="text | gray-dark bold margin-bottom-15">
                                {userData.phoneNumber}
                            </h3>
                            {role ? (
                                <h3
                                    className={`text | bolder ${
                                        role.isHigher && "green"
                                    }`}
                                >
                                    {role.value}
                                </h3>
                            ) : (
                                <span className="loader-gray-medium"></span>
                            )}
                        </>
                    </CompPermissionValidator>
                </div>
            </div>

            {user.data && (
                <CompPermissionValidator
                    user={user.data}
                    roles={ROLES_TO_VIEW_CONTACT_USERS}
                >
                    <UserContacts reviewUserName={user.data.fullName} user={userData} />
                </CompPermissionValidator>
            )}

            {user.data &&
                checkPermission(userData.role, ROLES_FOR_SERVER_USER_ACTIONS) && (
                    <UserHistoryRenderer
                        formState={formState}
                        setFormState={setFormState}
                        reviewUser={user.data}
                        userData={userData}
                    />
                )}

            {user.data && (
                <CompPermissionValidator
                    user={user.data}
                    roles={ROLES_FOR_SERVER_USER_ACTIONS}
                >
                    <UserRoleSeter
                        user={userData}
                        loading={formState.loading}
                        setLoading={(s: boolean) =>
                            setFormState({ ...formState, loading: s })
                        }
                    />
                </CompPermissionValidator>
            )}
            <CompPermissionValidator user={user.data} roles={ROLES_FOR_DISABLE_USERS}>
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
            </CompPermissionValidator>
            <CompPermissionValidator user={user.data} roles={ROLES_FOR_DELETE_USERS}>
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
            </CompPermissionValidator>
        </section>
    ) : (
        <PageLoader />
    );
};

export default UserRenderer;
