"use client";

import TriangleExclamation from "@/icons/TriangleExclamation";
import { Enterprise, UserRoleInEnterprise } from "@/interfaces/Enterprise";
import {
    ServiceRequestsInterface,
    UserInterface,
} from "@/interfaces/UserInterface";
import { FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateEnterprise } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import { ServiceReqState, Services } from "@/interfaces/Services";
import { deleteField } from "firebase/firestore";
import {
    getServiceReqById,
    saveReview,
} from "@/components/app_modules/server_users/api/ServicesRequester";
import { driveReqCollection } from "@/components/app_modules/server_users/api/DriveRequester";
import { UserRequest } from "@/interfaces/UserRequest";
import { laundryReqCollection } from "@/components/app_modules/server_users/api/LaundryRequester";
import { towReqCollection } from "@/components/app_modules/server_users/api/TowRequester";
import { mechanicReqCollection } from "@/components/app_modules/server_users/api/MechanicRequester";
import { AuthContext } from "@/context/AuthContext";
import SimpleUserCard from "../../../../users/views/cards/SimpleUserCard";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import TextField from "@/components/form/view/fields/TextField";
import { validateEmialWithComparison } from "@/components/app_modules/users/validators/for_confirmations/DataConfirmationValidator";
import { ValidatorToAddUserToDriverEnterpriseAsMember } from "../../../validators/validators_of_user_aggregators_to_enterprise/as_members/concrete/ValidatorToAddUserToDriverEnterpriseAsMember";

interface Props {
    selectedUser: {
        data: UserInterface;
        role: UserRoleInEnterprise;
    };
    enterprise: Enterprise;
}

const FormToDeleteUserFromEnterprise: React.FC<Props> = ({
    selectedUser,
    enterprise,
}) => {
    const { user, checkingUserAuth } = useContext(AuthContext);
    const [emailConfirmation, setEmailConfirmation] =
        useState<TextFieldForm>(DEFAUL_TEXT_FIELD);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const driverValidator = new ValidatorToAddUserToDriverEnterpriseAsMember(
        enterprise,
    );

    const refuseUserDriverRequests = async (
        userWithRequests: UserInterface,
    ) => {
        let hasCarRevition: boolean = driverValidator.hasCarActiveRevition(
            selectedUser.data,
        );
        let hasMotorcycleRevition: boolean =
            driverValidator.hasMotorcycleActiveRevition(selectedUser.data);
        let hasSomeRevition: boolean = driverValidator.hasActiveRequests(
            selectedUser.data,
        );
        if (hasSomeRevition && user && user.id) {
            let requestsToRefuse: (UserRequest | undefined)[] = [];
            if (
                hasCarRevition &&
                userWithRequests.serviceRequests?.driveCar?.id
            ) {
                let requestId: string =
                    userWithRequests.serviceRequests.driveCar.id;
                var request = await getServiceReqById(
                    requestId,
                    driveReqCollection,
                );
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
                    var request = await getServiceReqById(
                        requestId,
                        driveReqCollection,
                    );
                    requestsToRefuse.push(request);
                }
            }
            if (requestsToRefuse.length > 0) {
                requestsToRefuse.forEach(async (request) => {
                    if (request && user && user.id) {
                        await saveReview(
                            request,
                            user.id,
                            false,
                            driveReqCollection,
                        );
                    }
                });
            }
        }
    };

    const refuseUserLaundryRequest = async (
        userWithRequests: UserInterface,
    ) => {
        let hasSomeRevition: boolean =
            userWithRequests.serviceRequests?.laundry?.state ===
            ServiceReqState.Reviewing;
        if (
            hasSomeRevition &&
            user &&
            user.id &&
            userWithRequests.serviceRequests?.laundry?.id
        ) {
            let requestToRefuse: UserRequest | undefined = undefined;
            let requestId: string =
                userWithRequests.serviceRequests?.laundry.id;
            requestToRefuse = await getServiceReqById(
                requestId,
                laundryReqCollection,
            );
            if (requestToRefuse) {
                await saveReview(
                    requestToRefuse,
                    user.id,
                    false,
                    laundryReqCollection,
                );
            }
        }
    };

    const refuseUserTowRequest = async (userWithRequest: UserInterface) => {
        let hasSomeRevition: boolean =
            userWithRequest.serviceRequests?.tow?.state ===
            ServiceReqState.Reviewing;
        if (
            hasSomeRevition &&
            user &&
            user.id &&
            userWithRequest.serviceRequests?.tow?.id
        ) {
            let requestToRefuse: UserRequest | undefined = undefined;
            let requestId: string = userWithRequest.serviceRequests?.tow.id;
            requestToRefuse = await getServiceReqById(
                requestId,
                towReqCollection,
            );
            if (requestToRefuse) {
                await saveReview(
                    requestToRefuse,
                    user.id,
                    false,
                    towReqCollection,
                );
            }
        }
    };

    const refuseUserMechanicRequest = async (
        userWithRequest: UserInterface,
    ) => {
        let hasSomeRevition: boolean =
            userWithRequest.serviceRequests?.mechanic?.state ===
            ServiceReqState.Reviewing;
        if (
            hasSomeRevition &&
            user &&
            user.id &&
            userWithRequest.serviceRequests?.mechanic?.id
        ) {
            let requestToRefuse: UserRequest | undefined = undefined;
            let requestId: string =
                userWithRequest.serviceRequests?.mechanic.id;
            requestToRefuse = await getServiceReqById(
                requestId,
                mechanicReqCollection,
            );
            if (requestToRefuse) {
                await saveReview(
                    requestToRefuse,
                    user.id,
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
            setFormState((prev) => ({
                ...prev,
                loading: true,
            }));
            if (
                isValidTextField(emailConfirmation) &&
                enterprise.id &&
                selectedUser.data &&
                selectedUser.data.id
            ) {
                let toUpdate: Partial<Enterprise> = {};
                let addedUsers = enterprise.addedUsers?.filter(
                    (e) => e.userId !== selectedUser.data.id,
                );
                if (addedUsers) {
                    toUpdate = {
                        ...toUpdate,
                        addedUsers,
                    };
                }
                let addedUsersId = enterprise.addedUsersId?.filter(
                    (u) => u !== selectedUser.data.id,
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

                if (selectedUser.role === "user") {
                    await toast.promise(refuseUserRequests(selectedUser.data), {
                        pending:
                            "Eliminando peticiones activas del usuario para este servicio",
                        success:
                            "Peticiones activas del usuario para este servicio eliminadas",
                        error: "Error al eliminar las peticiones activas, intentalo de nuevo",
                    });
                }

                if (
                    selectedUser.role === "user" &&
                    hasEnterpriseRegistered(selectedUser.data)
                ) {
                    newUserData = removeEntepriseId(newUserData);
                    haveToUpdate = true;
                }

                if (
                    enterprise.type === "driver" &&
                    selectedUser.role === "user"
                ) {
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
                        selectedUser.data.serviceRequests
                            ? {
                                  ...selectedUser.data.serviceRequests,
                                  ...noSentDriveRequests,
                              }
                            : { ...noSentDriveRequests };

                    // the user can only have drive and tow vehicle, so
                    // we are only gonna keep the data of the crane vehicle
                    newUserData = {
                        ...newUserData,
                        services: selectedUser.data.services
                            ? selectedUser.data.services.filter(
                                  (s) => s !== Services.Driver,
                              )
                            : [],
                        serviceRequests: serviceRequestsUpdated,
                    };
                }

                if (haveToUpdate) {
                    await toast.promise(
                        updateUser(selectedUser.data.id, newUserData),
                        {
                            pending:
                                "Quitando registros del servicio en el usuario",
                            success: "Registros quitados",
                            error: "Error al quitar registros del servicio al usuario, intentalo de nuevo",
                        },
                    );
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

    useEffect(() => {
        setFormState((prev) => ({
            ...prev,
            isValid: isValidTextField(emailConfirmation),
        }));
    }, [emailConfirmation]);

    if (checkingUserAuth) {
        return <span className="loader"></span>;
    }

    return (
        user && (
            <>
                <div className="margin-top-25">
                    <h2 className="text icon-wrapper | red red-icon medium-big bold">
                        <TriangleExclamation />
                        Zona Peligrosa
                    </h2>
                    <p>
                        Esta acción no se puede revertir, si quitas al usuario
                        del servicio tendras que volver a registrarlo.
                        {selectedUser.role === "user" &&
                            enterprise.type === "driver" && (
                                <>
                                    <br />
                                    <b>
                                        El usuario ya no sera chofer, tendrá que
                                        volver a ser registrado
                                    </b>
                                </>
                            )}
                    </p>
                    <BaseForm
                        content={{
                            button: {
                                content: {
                                    legend: "Remover usuario",
                                    buttonClassStyle: "general-button red",
                                },
                                behavior: {
                                    isValid: formState.isValid,
                                    loading: formState.loading,
                                },
                            },
                        }}
                        behavior={{
                            loading: formState.loading,
                            onSummit: removeFromService,
                        }}
                    >
                        <TextField
                            field={{
                                values: emailConfirmation,
                                setter: setEmailConfirmation,
                                validator: (d) =>
                                    validateEmialWithComparison(
                                        d,
                                        selectedUser.data.email,
                                    ),
                            }}
                            legend="Correo electrónico | Confirmacion"
                        />
                    </BaseForm>
                </div>
            </>
        )
    );
};

export default FormToDeleteUserFromEnterprise;
