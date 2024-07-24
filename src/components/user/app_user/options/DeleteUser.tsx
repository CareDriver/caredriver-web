"use client";

import TriangleExclamation from "@/icons/TriangleExclamation";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import ActionUserSetterForm, { ActionUserForm } from "./ActionUserSetterForm";
import PopupForm from "@/components/form/PopupForm";
import { UserInterface } from "@/interfaces/UserInterface";
import { toast } from "react-toastify";
import { updateUser } from "@/utils/requests/UserRequester";
import { useRouter } from "next/navigation";
import { saveActionOnUser } from "@/utils/requests/ActionOnUserRegister";
import { nanoid } from "nanoid";
import { ActionOnUserPerformed } from "@/interfaces/ActionOnUserInterface";
import { Timestamp } from "firebase/firestore";

const DeleteUser = ({
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
    const router = useRouter();
    const [deleteState, setDeleteState] = useState({
        confirm: "",
        isValid: false,
    });
    const [isOpenPopup, setOpenPopup] = useState(false);

    const [balanceHistory, setBalanceHistory] = useState<ActionUserForm>({
        reason: {
            value: "",
            message: null,
        },
    });

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!loading) {
            setLoading(true);

            if (user.id && adminUser.id) {
                const actionOnUserDoc = nanoid(25);

                await toast.promise(
                    saveActionOnUser(actionOnUserDoc, {
                        id: actionOnUserDoc,
                        action: ActionOnUserPerformed.Deleted,
                        datetime: Timestamp.now(),
                        performedById: adminUser.id,
                        userId: user.id,
                        traceId: nanoid(25),
                        reason: balanceHistory.reason.value,
                    }),
                    {
                        pending: "Registrando acción",
                        success: "Acción en el usuario registrada",
                        error: "Error al registrar acción en el usuario",
                    },
                );

                await deleteUser();
                setLoading(false);
                window.location.reload();
            } else {
                toast.error("No se puede encontrar al usuario");
                setLoading(false);
            }
        }
    };

    const deleteUser = async () => {
        if (user.id) {
            try {
                await toast.promise(
                    updateUser(user.id, {
                        deleted: true,
                    }),
                    {
                        pending: "Eliminando al usuario",
                        success: "Usuario eliminado",
                        error: "Error al eliminar al usuario, inténtalo de nuevo",
                    },
                );
                router.push("/admin/users");
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <div className={`form-sub-container | margin-top-50 max-width-60`}>
            <h2 className="text icon-wrapper | red red-icon medium-big bold">
                <TriangleExclamation />
                Zona Peligrosa
            </h2>
            <p>
                Esta acción no se puede revertir, aunque no se afectara los datos que
                están relacionados con este. Por favor escribe el nombre del usuario para
                confirmar su eliminacion.
            </p>
            <fieldset className="form-section | max-width-60">
                <input
                    type="text"
                    placeholder=""
                    className="form-section-input"
                    name="fullname"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDeleteState({
                            ...deleteState,
                            confirm: e.target.value,
                            isValid: e.target.value === user.fullName,
                        })
                    }
                    autoComplete="off"
                />
                <legend className="form-section-legend">Nombre del usuario</legend>
            </fieldset>
            <button
                type="button"
                onClick={() => setOpenPopup(true)}
                className={`general-button | red no-full touchable ${
                    loading && deleteState.isValid && "loading-section"
                }`}
                disabled={!deleteState.isValid}
            >
                Eliminar usuario
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
                doSomethingText={"Eliminar usuario"}
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

export default DeleteUser;
