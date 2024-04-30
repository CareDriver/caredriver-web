"use client";
import { UserInterface } from "@/interfaces/UserInterface";
import { ChangeEvent, useState } from "react";
import DisableUser from "./options/DisableUser";
import DeleteUser from "./options/DeleteUser";
import { updateUser } from "@/utils/requests/UserRequester";
import { toast } from "react-toastify";

const NormalUserRenderer = ({ user }: { user: UserInterface }) => {
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

    const toggleDisableUser = async () => {
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
    };

    const deleteUser = async () => {};

    return (
        <div>
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
        </div>
    );
};

export default NormalUserRenderer;
