"use client";

import PopupForm from "@/components/form/PopupForm";
import ChevronDown from "@/icons/ChevronDown";
import UserLock from "@/icons/UserLock";
import {
    UserInterface,
    UserRole,
    UserRoleRender,
    userRoles,
} from "@/interfaces/UserInterface";
import { updateUser } from "@/utils/requests/UserRequester";
import { SyntheticEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ActionUserSetterForm, { ActionUserForm } from "./ActionUserSetterForm";
import { saveActionOnUser } from "@/utils/requests/ActionOnUserRegister";
import { nanoid } from "nanoid";
import { Timestamp } from "firebase/firestore";
import { ActionOnUserPerformed } from "@/interfaces/ActionOnUserInterface";

const UserRoleSeter = ({
    user,
    adminUser,
    loading,
    setLoading,
}: {
    user: UserInterface;
    adminUser: UserInterface;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}) => {
    const [isOpenPopup, setOpenPopup] = useState(false);
    const [formState, setFormState] = useState({
        isValid: false,
    });

    const [balanceHistory, setBalanceHistory] = useState<ActionUserForm>({
        reason: {
            value: "",
            message: null,
        },
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

            if (user.id && adminUser.id) {
                const actionOnUserDoc = nanoid(25);

                await toast.promise(
                    saveActionOnUser(actionOnUserDoc, {
                        id: actionOnUserDoc,
                        action: ActionOnUserPerformed[roleState.value],
                        datetime: Timestamp.now(),
                        performedById: adminUser.id,
                        userId: user.id,
                        traceId: nanoid(),
                        reason: balanceHistory.reason.value,
                    }),
                    {
                        pending: "Registrando accion",
                        success: "Accion en el usuario registrada",
                        error: "Error al registrar accion en el usuario",
                    },
                );

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
                    onClick={() => setOpenPopup(true)}
                >
                    <span className="text | bold white">Cambiar rol</span>
                </button>
            </div>
            <PopupForm
                isOpen={isOpenPopup}
                close={() => setOpenPopup(false)}
                loading={loading}
                onSummit={handleSubmit}
                isSecondButtonAble={
                    !balanceHistory.reason.message &&
                    balanceHistory.reason.value.trim().length > 0
                }
                doSomethingText={"Cambiar rol"}
            >
                <ActionUserSetterForm
                    loading={loading}
                    actionUser={balanceHistory}
                    setActionUser={setBalanceHistory}
                />
            </PopupForm>
        </section>
    );
};

export default UserRoleSeter;
