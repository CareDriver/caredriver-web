"use client";
import { UserRequest, Vehicle } from "@/interfaces/UserRequest";
import {
    deleteImagesIfLimitOfApproves,
    MIN_NUM_OF_APPROVALS,
    saveReview,
    setFirstService,
} from "@/components/app_modules/server_users/api/ServicesRequester";
import PersonalDataRenderer from "../../../../users/views/data_renderers/for_user_data/PersonalDataRenderer";
import SelfieRenderer from "../../../../../form/view/field_renderers/SelfieRenderer";
import VehiclesWithCategoryRenderer from "../../data_renderers/for_vehicles/VehiclesWithCategoryRenderer";
import { useContext, useEffect, useState } from "react";
import { driveReqCollection } from "@/components/app_modules/server_users/api/DriveRequester";
import { AuthContext } from "@/context/AuthContext";
import {
    getUserById,
    updateUser,
} from "@/components/app_modules/users/api/UserRequester";
import {
    ServiceRequestsInterface,
    ServiceVehicles,
    UserInterface,
} from "@/interfaces/UserInterface";
import { VehicleType } from "@/interfaces/VehicleInterface";
import { ServiceReqState, Services } from "@/interfaces/Services";
import { toast } from "react-toastify";
import ApprovalsRenderer from "../../data_renderers/ApprovalsRenderer";
import UserContactsRendererForForm from "../../../../users/views/data_renderers/for_user_data/UserContactsRendererForForm";
import UserStateWithMessageRenderer from "../../../../users/views/data_renderers/for_user_data/UserStateWithMessageRenderer";
import IdCardRenderer from "../../../../users/views/data_renderers/for_user_data/IdCardRenderer";
import { addUserServerToEnterprise } from "@/components/app_modules/enterprises/api/EnterpriseUserAdder";
import { Enterprise } from "@/interfaces/Enterprise";
import DriverEnterpriseRenderer from "../../../../enterprises/views/data_renderers/DriverEnterpriseRenderer";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import BaseFormWithTwoButtons from "@/components/form/view/forms/BaseFormWithTwoButtons";
import {
    DEFAULT_REVIEW_STATE,
    ReviewState,
} from "@/components/form/models/Reviews";
import { getIdSaved } from "@/utils/generators/IdGenerator";

const DriverReviewForm = ({ serviceReq }: { serviceReq: UserRequest }) => {
    const { user: adminUser } = useContext(AuthContext);
    const [reviewState, setReviewState] =
        useState<ReviewState>(DEFAULT_REVIEW_STATE);
    const [requesterUser, setRequesterUser] = useState<
        UserInterface | null | undefined
    >(null);
    const [enterprise, setEnterpise] = useState<Enterprise | null | undefined>(
        null,
    );

    const wasReviewed = (): boolean => {
        return reviewState.reviewed || !serviceReq.active;
    };

    const saveReviewHistory = async (wasApproved: boolean) => {
        try {
            if (adminUser && adminUser.id) {
                const isLimitToReviews: boolean =
                    serviceReq.reviewedByHistory !== undefined &&
                    serviceReq.reviewedByHistory.length + 1 ===
                        MIN_NUM_OF_APPROVALS;
                await saveReview(
                    serviceReq,
                    adminUser.id,
                    wasApproved,
                    driveReqCollection,
                );

                if (isLimitToReviews) {
                    var car = getVehicle(VehicleType.CAR);
                    var motorcycle = getVehicle(VehicleType.MOTORCYCLE);

                    if (requesterUser) {
                        var vehicles: ServiceVehicles =
                            requesterUser.serviceVehicles !== undefined
                                ? { ...requesterUser.serviceVehicles }
                                : {};
                        var newReqState: ServiceRequestsInterface =
                            requesterUser.serviceRequests !== undefined
                                ? { ...requesterUser.serviceRequests }
                                : {};

                        const serviceReqState = {
                            id: serviceReq.id,
                            state: wasApproved
                                ? ServiceReqState.Approved
                                : ServiceReqState.Refused,
                        };

                        if (car) {
                            car = {
                                ...car,
                                license: {
                                    frontImgUrl: car.license.frontImgUrl,
                                    backImgUrl: car.license.backImgUrl,
                                    expiredDateLicense:
                                        car.license.expiredDateLicense,
                                    licenseNumber: car.license.licenseNumber,
                                },
                            };
                        }
                        if (motorcycle) {
                            motorcycle = {
                                ...motorcycle,
                                license: {
                                    frontImgUrl: motorcycle.license.frontImgUrl,
                                    backImgUrl: motorcycle.license.backImgUrl,
                                    expiredDateLicense:
                                        motorcycle.license.expiredDateLicense,
                                    licenseNumber:
                                        motorcycle.license.licenseNumber,
                                },
                            };
                        }

                        if (wasApproved) {
                            if (car && motorcycle) {
                                vehicles = { ...vehicles, car, motorcycle };
                            } else if (car && !motorcycle) {
                                vehicles = { ...vehicles, car };
                            } else if (!car && motorcycle) {
                                vehicles = { ...vehicles, motorcycle };
                            }
                        }

                        if (car && motorcycle) {
                            newReqState = {
                                ...newReqState,
                                driveCar: serviceReqState,
                                driveMotorcycle: serviceReqState,
                            };
                        } else if (car && !motorcycle) {
                            newReqState = {
                                ...newReqState,
                                driveCar: serviceReqState,
                            };
                        } else if (!car && motorcycle) {
                            newReqState = {
                                ...newReqState,
                                driveMotorcycle: serviceReqState,
                            };
                        }

                        var userToUpdate: Partial<UserInterface> = {};
                        if (
                            wasApproved &&
                            serviceReq.driverEnterprise &&
                            !requesterUser.services.includes(Services.Driver)
                        ) {
                            userToUpdate = {
                                ...userToUpdate,
                                driverEnterpriseId: serviceReq.driverEnterprise,
                                services: [
                                    ...requesterUser.services,
                                    Services.Driver,
                                ],
                            };
                        }

                        if (vehicles && newReqState) {
                            userToUpdate = {
                                ...userToUpdate,
                                serviceVehicles: vehicles,
                                serviceRequests: newReqState,
                            };
                        } else {
                            userToUpdate = {
                                ...userToUpdate,
                                serviceRequests: newReqState,
                            };
                        }

                        if (wasApproved) {
                            userToUpdate = await setFirstService(
                                requesterUser,
                                userToUpdate,
                                adminUser.id,
                            );
                        }

                        await updateUser(serviceReq.userId, userToUpdate);
                        if (enterprise && wasApproved) {
                            await toast.promise(
                                addUserServerToEnterprise(
                                    enterprise,
                                    serviceReq.userId,
                                    getIdSaved(requesterUser.fakeId),
                                ),
                                {
                                    pending:
                                        "Agregando al usuario al servicio como usuario servidor",
                                    success: "Usuario agregado al servicio",
                                    error: "Error al agregar al usuario al servicio",
                                },
                            );
                        }
                    } else {
                        toast.error("El usuario no fue encontrado");
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const getVehicle = (type: VehicleType): Vehicle | null => {
        if (serviceReq.vehicles) {
            const vehicles = serviceReq.vehicles.filter(
                (veh) => veh.type.type === type,
            );
            if (vehicles.length > 0) {
                return vehicles[0];
            }
        }

        return null;
    };

    const review = async (wasApproved: boolean) => {
        setReviewState({
            ...reviewState,
            loading: true,
        });
        try {
            await deleteImagesIfLimitOfApproves(serviceReq);
            await toast.promise(saveReviewHistory(wasApproved), {
                pending: "Registrando revision, por favor espera",
                success: "Revision registrada",
                error: "Error al registrar revision, vuelve a intentarlo por favor",
            });
            setReviewState({
                loading: false,
                reviewed: true,
            });
        } catch (e) {
            setReviewState({
                loading: false,
                reviewed: false,
            });
        }
    };

    const approve = async () => {
        if (!reviewState.loading) {
            await review(true);
        }
    };

    const decline = async () => {
        if (!reviewState.loading) {
            await review(false);
        }
    };

    useEffect(() => {
        getUserById(serviceReq.userId).then((res) => {
            if (res) {
                setRequesterUser(res);
            } else {
                setRequesterUser(undefined);
            }
        });
    }, []);

    const fetchDriverEnterprise = async () => {
        if (serviceReq.driverEnterprise) {
            try {
                const data = await getEnterpriseById(
                    serviceReq.driverEnterprise,
                );
                setEnterpise(data);
            } catch (e) {
                setEnterpise(undefined);
                console.log(e);
            }
        } else {
            setEnterpise(undefined);
        }
    };

    useEffect(() => {
        fetchDriverEnterprise();
    }, []);

    return (
        <div className="service-form-wrapper | max-width-60">
            <h1 className="text | big bolder">Solicitud para ser Chofer</h1>
            <div className="row-wrapper | gap-20">
                <ApprovalsRenderer
                    serviceReq={serviceReq}
                    reviewed={reviewState.reviewed}
                />
                <UserStateWithMessageRenderer userData={requesterUser} />
            </div>

            <BaseFormWithTwoButtons
                content={{
                    firstButton: {
                        content: {
                            legend: "Rechazar",
                            buttonClassStyle: wasReviewed()
                                ? "hidden"
                                : "general-button gray",
                            loaderClassStyle: "loader-gray",
                        },
                        behavior: {
                            loading: reviewState.loading,
                            setLoading: (l) =>
                                setReviewState((prev) => ({
                                    ...prev,
                                    loading: l,
                                })),
                            isValid: !wasReviewed(),
                            action: decline,
                        },
                    },
                    secondButton: {
                        content: {
                            legend: "Aprobar",
                            buttonClassStyle: wasReviewed()
                                ? "hidden"
                                : undefined,
                        },
                        behavior: {
                            loading: reviewState.loading,
                            setLoading: (l) =>
                                setReviewState((prev) => ({
                                    ...prev,
                                    loading: l,
                                })),
                            isValid: !wasReviewed(),
                            action: approve,
                        },
                    },
                }}
                behavior={{
                    loading: reviewState.loading,
                }}
            >
                <PersonalDataRenderer
                    location={serviceReq.location}
                    name={serviceReq.newFullName}
                    photo={serviceReq.newProfilePhotoImgUrl}
                />

                {requesterUser ? (
                    <IdCardRenderer idCard={requesterUser.identityCard} />
                ) : (
                    <span className="row-wrapper text | bold gray-medium">
                        <span className="loader-gray-medium | small-loader"></span>{" "}
                        Cargando carnet de identidad
                    </span>
                )}

                <SelfieRenderer image={serviceReq.realTimePhotoImgUrl} />
                {serviceReq.vehicles && (
                    <VehiclesWithCategoryRenderer
                        vehicles={serviceReq.vehicles}
                    />
                )}

                {enterprise === null ? (
                    <span className="loader-green"></span>
                ) : (
                    <DriverEnterpriseRenderer driverEnterprise={enterprise} />
                )}

                {requesterUser ? (
                    <UserContactsRendererForForm
                        email={requesterUser.email}
                        phoneNumber={requesterUser.phoneNumber}
                    />
                ) : (
                    <span className="row-wrapper text | bold gray-medium">
                        <span className="loader-gray-medium | small-loader"></span>{" "}
                        Cargando formas de contacto con el usuario
                    </span>
                )}

                {requesterUser && (
                    <UserStateWithMessageRenderer userData={requesterUser} />
                )}
            </BaseFormWithTwoButtons>
        </div>
    );
};

export default DriverReviewForm;
