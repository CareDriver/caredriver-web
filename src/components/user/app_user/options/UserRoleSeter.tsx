"use client";

import ChevronDown from "@/icons/ChevronDown";
import UserLock from "@/icons/UserLock";
import {
    UserInterface,
    UserRole,
    UserRoleRender,
    userRoles,
} from "@/interfaces/UserInterface";
import { updateUser } from "@/utils/requests/UserRequester";
import { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserRoleSeter = ({
    user,
    loading,
    setLoading,
}: {
    user: UserInterface;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}) => {
    const [formState, setFormState] = useState({
        isValid: false,
    });

    const [roleState, setRoleState] = useState<{
        value: UserRole;
        message: string | null;
        defaultValue: UserRole;
    }>({
        value: user.role ? user.role : UserRole.User,
        message: null,
        defaultValue: user.role ? user.role : UserRole.User,
    });

    const getRole = (str: string) => {
        var newRole = UserRole.User;
        userRoles.forEach((value) => {
            if (value === str) {
                newRole = value;
            }
        });

        return newRole;
    };

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!loading) {
            setLoading(true);

            var button = e.target as HTMLButtonElement;
            const text = button.innerHTML;
            button.innerHTML = "";
            button.classList.add("loading-section");
            var loader = document.createElement("span");
            loader.classList.add("loader");
            button.appendChild(loader);

            if (user.id) {
                await toast.promise(updateUser(user.id, { role: roleState.value }), {
                    pending: "Cambiando el rol del usuario",
                    success: "Rol del usuario cambiado",
                    error: "Error al cambiar el rol del usuario, intentalo de nuevo por favor",
                });
                setLoading(false);
                window.location.reload();
            } else {
                toast.error("No se puede encontrar al usuario");
                setLoading(false);
            }

            button.removeChild(loader);
            button.innerHTML = text;
            button.classList.remove("loading-section");
        }
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: !roleState.message && roleState.value !== roleState.defaultValue,
        });
    }, [roleState]);

    return (
        <section className="profile-info-wrapper | margin-top-50 max-width-60">
            <h2 className="profile-subtitle icon-wrapper mb">
                <UserLock />
                Rol del Usuario
            </h2>

            <div
                className="margin-top-25 margin-bottom-25"
                data-state={loading ? "loading" : "loaded"}
            >
                <fieldset className="form-section | select-item">
                    <ChevronDown />
                    <select
                        className="form-section-input"
                        onChange={(e) => {
                            const newRole = getRole(e.target.value);
                            setRoleState({
                                ...roleState,
                                value: newRole,
                                message:
                                    newRole === roleState.defaultValue
                                        ? "El usuario ya tiene este rol establecido"
                                        : null,
                            });
                        }}
                        value={roleState.value}
                    >
                        {userRoles.map((role, i) => (
                            <option key={`user-role-option-${i}`} value={role}>
                                {UserRoleRender[role]}
                            </option>
                        ))}
                    </select>
                    <legend className="form-section-legend">
                        Cambiar rol del usuario
                    </legend>
                    {roleState.message && <small>{roleState.message}</small>}
                </fieldset>

                <button
                    className={`small-general-button | touchable max-width-60 margin-top-25`}
                    title={
                        !formState.isValid
                            ? "Por favor completa los campos con datos validos"
                            : ""
                    }
                    disabled={!formState.isValid}
                    type="button"
                    onClick={handleSubmit}
                >
                    <span className="text | bold">Cambiar rol</span>
                </button>
            </div>
        </section>
    );
};

export default UserRoleSeter;
