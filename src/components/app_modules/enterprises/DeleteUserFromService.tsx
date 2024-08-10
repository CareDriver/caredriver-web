"use client";

import TriangleExclamation from "@/icons/TriangleExclamation";
import { Enterprise, UserRoleEnterpriseRender } from "@/interfaces/Enterprise";
import { ServiceRequestsInterface, UserInterface } from "@/interfaces/UserInterface";
import Popup from "../form/Popup";
import { DEFAULT_PHOTO } from "@/utils/user/UserData";
import { FormEvent, useContext, useEffect, useState } from "react";
import { isValidEmail } from "@/utils/validator/auth/CredentialsValidator";
import { toast } from "react-toastify";
import { updateEnterprise } from "@/utils/requests/enterprise/EnterpriseRequester";
import { updateUser } from "@/utils/requests/UserRequester";
import { ServiceReqState, Services } from "@/interfaces/Services";
import { deleteField } from "firebase/firestore";
import {
    getServiceReqById,
    saveReview,
} from "@/utils/requests/services/ServicesRequester";
import { driveReqCollection } from "@/utils/requests/services/DriveRequester";
import { UserRequest } from "@/interfaces/UserRequest";
import { laundryReqCollection } from "@/utils/requests/services/LaundryRequester";
import { towReqCollection } from "@/utils/requests/services/TowRequester";
import { mechanicReqCollection } from "@/utils/requests/services/MechanicRequester";
import { AuthContext } from "@/context/AuthContext";

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
    const { user, loadingUser } = useContext(AuthContext);
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

    const refuseUserDriverRequests = async (userWithRequests: UserInterface) => {
        let hasCarRevition: boolean =
            userWithRequests.serviceRequests?.driveCar?.state ===
            ServiceReqState.Reviewing;
        let hasMotorcycleRevition: boolean =
            userWithRequests.serviceRequests?.driveMotorcycle?.state ===
            ServiceReqState.Reviewing;
        let hasSomeRevition: boolean = hasCarRevition || hasMotorcycleRevition;
        if (hasSomeRevition && user.data && user.data.id) {
            let requestsToRefuse: (UserRequest | undefined)[] = [];
            if (hasCarRevition && userWithRequests.serviceRequests?.driveCar?.id) {
                let requestId: string = userWithRequests.serviceRequests.driveCar.id;
                var request = await getServiceReqById(requestId, driveReqCollection);
                requestsToRefuse.push(request);
            }
            if (
                hasMotorcycleRevition &&
                userWithRequests.serviceRequests?.driveMotorcycle?.id
            ) {
                let areSameRequest: boolean =
                    userWithRequests.serviceRequests?.driveCar?.id ===
                    userWithRequests.serviceRequests?.driveMotorcycle?.id;
                if (!areSameRequest) {
                    let requestId: string =
                        userWithRequests.serviceRequests.driveMotorcycle.id;
                    var request = await getServiceReqById(requestId, driveReqCollection);
                    requestsToRefuse.push(request);
                }
            }
            if (requestsToRefuse.length > 0) {
                requestsToRefuse.forEach(async (request) => {
                    if (request && user.data && user.data.id) {
                        await saveReview(
                            request,
                            user.data.id,
                            false,
                            driveReqCollection,
                        );
                    }
                });
            }
        }
    };

    const refuseUserLaundryRequest = async (userWithRequests: UserInterface) => {
        let hasSomeRevition: boolean =
            userWithRequests.serviceRequests?.laundry?.state ===
            ServiceReqState.Reviewing;
        if (
            hasSomeRevition &&
            user.data &&
            user.data.id &&
            userWithRequests.serviceRequests?.laundry?.id
        ) {
            let requestToRefuse: UserRequest | undefined = undefined;
            let requestId: string = userWithRequests.serviceRequests?.laundry.id;
            requestToRefuse = await getServiceReqById(requestId, laundryReqCollection);
            if (requestToRefuse) {
                await saveReview(
                    requestToRefuse,
                    user.data.id,
                    false,
                    laundryReqCollection,
                );
            }
        }
    };

    const refuseUserTowRequest = async (userWithRequest: UserInterface) => {
        let hasSomeRevition: boolean =
            userWithRequest.serviceRequests?.tow?.state === ServiceReqState.Reviewing;
        if (
            hasSomeRevition &&
            user.data &&
            user.data.id &&
            userWithRequest.serviceRequests?.tow?.id
        ) {
            let requestToRefuse: UserRequest | undefined = undefined;
            let requestId: string = userWithRequest.serviceRequests?.tow.id;
            requestToRefuse = await getServiceReqById(requestId, towReqCollection);
            if (requestToRefuse) {
                await saveReview(requestToRefuse, user.data.id, false, towReqCollection);
            }
        }
    };

    const refuseUserMechanicRequest = async (userWithRequest: UserInterface) => {
        let hasSomeRevition: boolean =
            userWithRequest.serviceRequests?.mechanic?.state ===
            ServiceReqState.Reviewing;
        if (
            hasSomeRevition &&
            user.data &&
            user.data.id &&
            userWithRequest.serviceRequests?.mechanic?.id
        ) {
            let requestToRefuse: UserRequest | undefined = undefined;
            let requestId: string = userWithRequest.serviceRequests?.mechanic.id;
            requestToRefuse = await getServiceReqById(requestId, mechanicReqCollection);
            if (requestToRefuse) {
                await saveReview(
                    requestToRefuse,
                    user.data.id,
                    false,
                    mechanicReqCollection,
                );
            }
        }
    };

    const refuseUserRequests = async (user: UserInterface) => {
        switch (enterprise.type) {
            case "driver":
                await refuseUserDriverRequests(user);
                break;
            case "laundry":
                await refuseUserLaundryRequest(user);
                break;
            case "mechanical":
                await refuseUserMechanicRequest(user);
                break;
            case "tow":
                await refuseUserTowRequest(user);
                break;
            default:
                break;
        }
    };

    const removeEntepriseId = (newUserData: {
        [key: string]: any;
    }): { [key: string]: any } => {
        switch (enterprise.type) {
            case "driver":
                newUserData = {
                    ...newUserData,
                    driverEnterpriseId: deleteField(),
                };
                break;
            case "laundry":
                newUserData = {
                    ...newUserData,
                    laundryEnterpriseId: deleteField(),
                };
                break;
            case "mechanical":
                newUserData = {
                    ...newUserData,
                    mechanicalWorkShopId: deleteField(),
                };
                break;
            case "tow":
                newUserData = {
                    ...newUserData,
                    towEnterpriseId: deleteField(),
                };
                break;
            default:
                break;
        }

        return newUserData;
    };

    const hasEnterpriseRegistered = (user: UserInterface): boolean => {
        switch (enterprise.type) {
            case "driver":
                return user.driverEnterpriseId !== undefined;
            case "laundry":
                return user.laundryEnterpriseId !== undefined;
            case "mechanical":
                return user.mechanicalWorkShopId !== undefined;
            case "tow":
                return user.towEnterpriseId !== undefined;
            default:
                return false;
        }
    };

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

                let haveToUpdate = false;
                let newUserData: Partial<UserInterface> = {};

                if (userRole === "user") {
                    await toast.promise(refuseUserRequests(userToDelete), {
                        pending:
                            "Eliminando peticiones activas del usuario para este servicio",
                        success:
                            "Peticiones activas del usuario para este servicio eliminadas",
                        error: "Error al eliminar las peticiones activas, intentalo de nuevo",
                    });
                }

                if (userRole === "user" && hasEnterpriseRegistered(userToDelete)) {
                    newUserData = removeEntepriseId(newUserData);
                    haveToUpdate = true;
                }

                if (enterprise.type === "driver" && userRole === "user") {
                    haveToUpdate = true;
                    let noSentDriveRequests = {
                        driveCar: {
                            id: "",
                            state: ServiceReqState.NotSent,
                        },
                        driveMotorcycle: {
                            id: "",
                            state: ServiceReqState.NotSent,
                        },
                    };
                    let serviceRequestsUpdated: ServiceRequestsInterface =
                        userToDelete.serviceRequests
                            ? { ...userToDelete.serviceRequests, ...noSentDriveRequests }
                            : { ...noSentDriveRequests };

                    // the user can only have drive and tow vehicle, so
                    // we are only gonna keep the data of the crane vehicle
                    newUserData = {
                        ...newUserData,
                        services: userToDelete.services
                            ? userToDelete.services.filter((s) => s !== Services.Driver)
                            : [],
                        serviceRequests: serviceRequestsUpdated,
                    };
                }

                if (haveToUpdate) {
                    await toast.promise(updateUser(userToDelete.id, newUserData), {
                        pending: "Quitando registros del servicio en el usuario",
                        success: "Registros quitados",
                        error: "Error al quitar registros del servicio al usuario, intentalo de nuevo",
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
                    {!loadingUser && user.data ? (
                        <>
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
                                    <h4 className="text | light">
                                        {userToDelete.phoneNumber}
                                    </h4>
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
                                    Esta acción no se puede revertir, si quitas al usuario
                                    del servicio tendras que volver a registrarlo.
                                    {userRole === "user" &&
                                        enterprise.type === "driver" && (
                                            <>
                                                <br />
                                                <b>
                                                    El usuario ya no sera chofer, tendrá
                                                    que volver a ser registrado
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
                                        {userEmail.message && (
                                            <small>{userEmail.message}</small>
                                        )}
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
                        </>
                    ) : (
                        <span className="loader"></span>
                    )}
                </div>
            </Popup>
        )
    );
};

export default DeleteUserFromService;
