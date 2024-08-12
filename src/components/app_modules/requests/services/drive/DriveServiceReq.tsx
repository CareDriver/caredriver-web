"use client";
import { UserRequest, Vehicle } from "@/interfaces/UserRequest";
import {
    deleteImagesIfLimitOfApproves,
    MIN_NUM_OF_APPROVALS,
    saveReview,
    setFirstService,
} from "@/utils/requests/services/ServicesRequester";
import PersonalData from "../../data_renderer/personal_data/PersonalData";
import SelfieRenderer from "../../data_renderer/personal_data/SelfieRenderer";
import VehiclesRenderer from "../../data_renderer/vehicle/VehiclesRenderer";
import ReqButtonRes from "../../data_renderer/form/ReqButtonRes";
import { useContext, useEffect, useState } from "react";
import { driveReqCollection } from "@/utils/requests/services/DriveRequester";
import { AuthContext } from "@/context/AuthContext";
import { getUserById, updateUser } from "@/utils/requests/UserRequester";
import {
    ServiceRequestsInterface,
    ServiceVehicles,
    UserInterface,
} from "@/interfaces/UserInterface";
import { VehicleType } from "@/interfaces/VehicleInterface";
import { ServiceReqState, Services } from "@/interfaces/Services";
import { toast } from "react-toastify";
import ApprovalsRenderer from "../../data_renderer/form/ApprovalsRenderer";
import ContactReviewedUser from "../../data_renderer/form/ContactReviewedUser";
import FieldDeleted from "../../../../form/view/field_renderers/FieldDeleted";
import UserVerifierPrompter from "../../data_renderer/form/UserVerifierPrompter";
import UserStatusIndicatorV2 from "../../data_renderer/form/UserStatusIndicatorV2";
import IdCardRenderer from "../../data_renderer/personal_data/IdCardRenderer";
import { addUserServerToEnterprise } from "@/utils/requests/enterprise/EnterpriseUserAdder";
import { Enterprise } from "@/interfaces/Enterprise";
import DriverServiceRenderer from "../../data_renderer/enterprise/DriverServiceRenderer";
import { getEnterpriseById } from "@/utils/requests/enterprise/EnterpriseRequester";

const DriveServiceReq = ({ serviceReq }: { serviceReq: UserRequest }) => {
    const { user } = useContext(AuthContext);
    const [enterprise, setEnterpise] = useState<Enterprise | null | undefined>(null);
    const [reviewState, setReviewState] = useState({
        loading: false,
        reviewed: false,
    });
    const [userData, setUserData] = useState<UserInterface | null | undefined>(null);

    const saveReviewHistory = async (wasApproved: boolean) => {
        try {
            if (user.data && user.data.id) {
                const isLimitToReviews: boolean =
                    serviceReq.reviewedByHistory !== undefined &&
                    serviceReq.reviewedByHistory.length + 1 === MIN_NUM_OF_APPROVALS;
                await saveReview(
                    serviceReq,
                    user.data.id,
                    wasApproved,
                    driveReqCollection,
                );

                if (isLimitToReviews) {
                    var car = getVehicle(VehicleType.CAR);
                    var motorcycle = getVehicle(VehicleType.MOTORCYCLE);

                    if (userData) {
                        var vehicles: ServiceVehicles =
                            userData.serviceVehicles !== undefined
                                ? { ...userData.serviceVehicles }
                                : {};
                        var newReqState: ServiceRequestsInterface =
                            userData.serviceRequests !== undefined
                                ? { ...userData.serviceRequests }
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
                                    expiredDateLicense: car.license.expiredDateLicense,
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
                                    licenseNumber: motorcycle.license.licenseNumber,
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
                            !userData.services.includes(Services.Driver)
                        ) {
                            userToUpdate = {
                                ...userToUpdate,
                                driverEnterpriseId: serviceReq.driverEnterprise,
                                services: [...userData.services, Services.Driver],
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
                                userData,
                                userToUpdate,
                                user.data.id,
                            );
                        }

                        await updateUser(serviceReq.userId, userToUpdate);
                        if (enterprise && wasApproved) {
                            await toast.promise(
                                addUserServerToEnterprise(enterprise, serviceReq.userId),
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
            const vehicles = serviceReq.vehicles.filter((veh) => veh.type.type === type);
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
                setUserData(res);
            } else {
                setUserData(undefined);
            }
        });
    }, []);

    const fetchDriverEnterprise = async () => {
        if (serviceReq.driverEnterprise) {
            try {
                const data = await getEnterpriseById(serviceReq.driverEnterprise);
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
                <UserVerifierPrompter userData={userData} />
            </div>

            <PersonalData
                location={serviceReq.location}
                name={serviceReq.newFullName}
                photo={serviceReq.newProfilePhotoImgUrl}
            />

            {userData ? (
                <IdCardRenderer idCard={userData.identityCard} />
            ) : (
                <span className="row-wrapper text | bold gray-medium">
                    <span className="loader-gray-medium | small-loader"></span> Cargando
                    carnet de identidad
                </span>
            )}

            <SelfieRenderer image={serviceReq.realTimePhotoImgUrl} />
            {serviceReq.vehicles && <VehiclesRenderer vehicles={serviceReq.vehicles} />}

            {enterprise === null ? (
                <span className="loader-green"></span>
            ) : (
                <DriverServiceRenderer driverEnterprise={enterprise} />
            )}
            {/* <PoliceRecords pdf={serviceReq.policeRecordsPdf} /> */}

            {userData && user.data ? (
                <ContactReviewedUser user={userData} transmitter={user.data.fullName} />
            ) : (
                <FieldDeleted description="No se encontraron los medios de comunicacion para comunicarse con el usuario solicitante" />
            )}

            {userData && <UserStatusIndicatorV2 user={userData} />}

            <ReqButtonRes
                onApprove={approve}
                onDecline={decline}
                loading={reviewState.loading || userData === null}
                stateB1={true}
                stateB2={userData !== null && userData !== undefined && !userData.deleted}
                alreadyReviewed={reviewState.reviewed || !serviceReq.active}
            />
        </div>
    );
};

export default DriveServiceReq;
