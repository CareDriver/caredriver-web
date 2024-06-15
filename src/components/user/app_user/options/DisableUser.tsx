"use client";

import TriangleExclamation from "@/icons/TriangleExclamation";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import ActionUserSetterForm, { ActionUserForm } from "./ActionUserSetterForm";
import PopupForm from "@/components/form/PopupForm";
import { UserInterface } from "@/interfaces/UserInterface";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { saveActionOnUser } from "@/utils/requests/ActionOnUserRegister";
import { ActionOnUserPerformed } from "@/interfaces/ActionOnUserInterface";
import { Timestamp } from "firebase/firestore";
import { updateUser } from "@/utils/requests/UserRequester";

const DisableUser = ({
    user,
    adminUser,
    loading,
    setLoading,
}: {
    user: UserInterface;
    adminUser: UserInterface;
    setLoading: (loading: boolean) => void;
    loading: boolean;
}) => {
    const isDisable = user.disable ? user.disable : false;
    const [isOpenPopup, setOpenPopup] = useState(false);
    const [disableState, setDisableState] = useState({
        confirm: "",
        isValid: false,
    });
    const [balanceHistory, setBalanceHistory] = useState<ActionUserForm>({
        reason: {
            value: "",
            message: null,
        },
    });

    const toggleDisableUser = async () => {
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
                } catch (e) {
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
                } catch (e) {
                    console.log(e);
                }
            }

            try {
                await toast.promise(
                    fetch("/api/userstate", {
                        method: "POST",
                        body: JSON.stringify({
                            userId: user.id,
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
                        action: isDisable
                            ? ActionOnUserPerformed.Enable
                            : ActionOnUserPerformed.Disabled,
                        datetime: Timestamp.now(),
                        performedById: adminUser.id,
                        userId: user.id,
                        traceId: nanoid(25),
                        reason: balanceHistory.reason.value,
                    }),
                    {
                        pending: "Registrando accion",
                        success: "Accion en el usuario registrada",
                        error: "Error al registrar accion en el usuario",
                    },
                );

                await toggleDisableUser();
                setLoading(false);
                window.location.reload();
            } else {
                toast.error("No se puede encontrar al usuario");
                setLoading(false);
            }
        }
    };

    return (
        <div className={`form-sub-container | margin-top-50 max-width-60`}>
            <h2 className="text icon-wrapper | yellow yellow-icon medium-big bold">
                <TriangleExclamation />
                Zona Peligrosa
            </h2>
            <p>
                Esta accion si se puede revertir, aunque el usuario no podra usar la
                aplicacion mientras este desabilitado.
            </p>
            <fieldset className="form-section | max-width-60">
                <input
                    type="text"
                    placeholder="Nombre del usuario"
                    className="form-section-input"
                    name="fullname"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDisableState({
                            ...disableState,
                            confirm: e.target.value,
                            isValid: e.target.value === user.fullName,
                        })
                    }
                    autoComplete="off"
                />
            </fieldset>
            <button
                type="button"
                onClick={() => setOpenPopup(true)}
                className={`general-button | yellow no-full touchable ${
                    loading && disableState.isValid && "loading-section"
                }`}
                disabled={!disableState.isValid}
            >
                {isDisable ? "Habilitar usuario" : "Deshabilitar usuario"}
            </button>

            <PopupForm
                isOpen={isOpenPopup}
                close={() => setOpenPopup(false)}
                loading={loading}
                onSummit={handleSubmit}
                isSecondButtonAble={
                    !balanceHistory.reason.message &&
                    balanceHistory.reason.value.trim().length > 0
                }
                doSomethingText={"Desabilitar usuario"}
            >
                <ActionUserSetterForm
                    loading={loading}
                    actionUser={balanceHistory}
                    setActionUser={setBalanceHistory}
                />
            </PopupForm>
        </div>
    );
};

export default DisableUser;
