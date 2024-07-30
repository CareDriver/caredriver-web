"use client";

import TriangleExclamation from "@/icons/TriangleExclamation";
import { Enterprise, UserRoleEnterpriseRender } from "@/interfaces/Enterprise";
import { ServiceVehicles, UserInterface } from "@/interfaces/UserInterface";
import Popup from "../form/Popup";
import { DEFAULT_PHOTO } from "@/utils/user/UserData";
import { FormEvent, useEffect, useState } from "react";
import { isValidEmail } from "@/utils/validator/auth/CredentialsValidator";
import { toast } from "react-toastify";
import { updateEnterprise } from "@/utils/requests/enterprise/EnterpriseRequester";
import { updateUser } from "@/utils/requests/UserRequester";
import { ServiceReqState, Services } from "@/interfaces/Services";

const DeleteUserFromService = ({
    cancel,
    userRole,
    userToDelete,
    enterprise,
}: {
    cancel: () => void;
    userRole: "user" | "support";
    userToDelete: UserInterface | null;
    enterprise: Enterprise;
}) => {
    const [userEmail, setUserEmail] = useState<{
        value: string;
        message: string | null;
    }>({
        value: "",
        message: null,
    });
    const [formState, setFormState] = useState({
        loading: false,
        isValid: false,
    });
    const removeFromService = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if (!formState.loading) {
            setFormState({
                ...formState,
                loading: true,
            });
            if (isValidUserEmail() && enterprise.id && userToDelete && userToDelete.id) {
                let toUpdate: Partial<Enterprise> = {};
                let addedUsers = enterprise.addedUsers?.filter(
                    (e) => e.userId !== userToDelete.id,
                );
                if (addedUsers) {
                    toUpdate = {
                        ...toUpdate,
                        addedUsers,
                    };
                }
                let addedUsersId = enterprise.addedUsersId?.filter(
                    (u) => u !== userToDelete.id,
                );
                if (addedUsersId) {
                    toUpdate = {
                        ...toUpdate,
                        addedUsersId,
                    };
                }
                await toast.promise(updateEnterprise(enterprise.id, toUpdate), {
                    pending: "Removiendo usuario del servicio",
                    success: "Usuario removido del servicio",
                    error: "Error al remover al usuario del servicio",
                });
                if (enterprise.type === "driver" && userRole === "user") {
                    let serviceRequestsUpdated = {
                        driveCar: {
                            id: "",
                            state: ServiceReqState.NotSent,
                        },
                        driveMotorcycle: {
                            id: "",
                            state: ServiceReqState.NotSent,
                        },
                    };
                    let newVehicles: ServiceVehicles =
                        userToDelete.serviceVehicles && userToDelete.serviceVehicles.tow
                            ? { tow: userToDelete.serviceVehicles.tow }
                            : {};
                    let toUpdateUser: Partial<UserInterface> = {
                        driverEnterpriseId: "",
                        services: userToDelete.services
                            ? userToDelete.services.filter((s) => s !== Services.Driver)
                            : [],
                        serviceRequests: userToDelete.serviceRequests
                            ? {
                                  ...userToDelete.serviceRequests,
                                  ...serviceRequestsUpdated,
                              }
                            : serviceRequestsUpdated,
                        serviceVehicles: newVehicles,
                    };

                    await toast.promise(updateUser(userToDelete.id, toUpdateUser), {
                        pending: "Eliminando el servicio chofer del usuario",
                        success: "El usuario ya no es chofer",
                        error: "Error al eliminar el servicio chofer del usuario, intentalo de nuevo",
                    });
                }

                window.location.reload();
            } else {
                toast.error("Completa los campos requeridos");
                setFormState({
                    ...formState,
                    loading: false,
                });
            }
        }
    };

    const isValidUserEmail = (): boolean => {
        return userEmail.value.trim().length > 0 && userEmail.message === null;
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: isValidUserEmail(),
        });
    }, [userEmail]);

    return (
        userToDelete && (
            <Popup isOpen={userToDelete !== null} close={cancel}>
                <div>
                    <h2 className="text | bolder big-medium capitalize margin-bottom-25">
                        {userToDelete.fullName}
                    </h2>
                    <div className="column-wrapper">
                        <img
                            src={userToDelete.photoUrl.url || DEFAULT_PHOTO}
                            alt=""
                            className="users-item-photo"
                        />
                        <div>
                            <h4 className="text | light">{userToDelete.email}</h4>
                            <h4 className="text | light">{userToDelete.phoneNumber}</h4>
                            <h4 className="text | bold">
                                {UserRoleEnterpriseRender[userRole]}
                            </h4>
                        </div>
                    </div>
                    <div className="separator-horizontal"></div>
                    <div>
                        <h2 className="text icon-wrapper | red red-icon medium-big bold">
                            <TriangleExclamation />
                            Zona Peligrosa
                        </h2>
                        <p>
                            Esta acción no se puede revertir, si quitas al usuario del
                            servicio tendras que volver a registrarlo.
                            {userRole === "user" && enterprise.type === "driver" && (
                                <>
                                    <br />
                                    <b>
                                        El usuario ya no sera chofer, tendrá que volver a
                                        ser registrado
                                    </b>
                                </>
                            )}
                        </p>
                        <form
                            onSubmit={removeFromService}
                            className="margin-top-25"
                            data-state={formState.loading ? "loading" : "loaded"}
                        >
                            <fieldset className="form-section">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder=""
                                    value={userEmail.value}
                                    onChange={(e) => {
                                        const currentEmail = e.target.value;
                                        let { isValid, message } =
                                            isValidEmail(currentEmail);
                                        let areEmailEquals =
                                            currentEmail === userToDelete.email;
                                        if (isValid && !areEmailEquals) {
                                            isValid = false;
                                            message =
                                                "El correo no es el mismo que el del usuario";
                                        }
                                        setUserEmail({
                                            value: currentEmail,
                                            message: isValid ? null : message,
                                        });
                                    }}
                                    autoComplete="off"
                                    className="form-section-input"
                                />
                                <legend className="form-section-legend">
                                    Correo electrónico del usuario
                                </legend>
                                {userEmail.message && <small>{userEmail.message}</small>}
                            </fieldset>

                            <button
                                className={`general-button red margin-top-25 touchable ${
                                    formState.loading && "loading-section"
                                }`}
                                title={
                                    !formState.isValid
                                        ? "Por favor completa los campos con datos validos"
                                        : ""
                                }
                                disabled={!formState.isValid}
                            >
                                {formState.loading ? (
                                    <span className="loader"></span>
                                ) : (
                                    "Remover usuario"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </Popup>
        )
    );
};

export default DeleteUserFromService;
