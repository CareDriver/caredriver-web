"use client";
import { UserRequest, Vehicle } from "@/interfaces/UserRequest";
import {
    deleteImagesIfLimitOfApproves,
    MIN_NUM_OF_APPROVALS,
    setFirstService,
    updateService,
} from "@/utils/requests/services/ServicesRequester";
import PersonalData from "../../data_renderer/personal_data/PersonalData";
import SelfieRenderer from "../../data_renderer/personal_data/SelfieRenderer";
import VehiclesRenderer from "../../data_renderer/vehicle/VehiclesRenderer";
import ReqButtonRes from "../../data_renderer/form/ReqButtonRes";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Timestamp } from "firebase/firestore";
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
import { towReqCollection } from "@/utils/requests/services/TowRequester";
import { Enterprise } from "@/interfaces/Enterprise";
import FieldDeleted from "../../data_renderer/form/FieldDeleted";
import { getEnterpriseById } from "@/utils/requests/enterprise/EnterpriseRequester";
import ContactReviewedUser from "../../data_renderer/form/ContactReviewedUser";
import TowRenderer from "../../data_renderer/enterprise/TowRenderer";
import UserStatusIndicatorV2 from "../../data_renderer/form/UserStatusIndicatorV2";
import UserVerifierPrompter from "../../data_renderer/form/UserVerifierPrompter";
import IdCardRenderer from "../../data_renderer/personal_data/IdCardRenderer";

const TowServiceReq = ({ serviceReq }: { serviceReq: UserRequest }) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] = useState({
        loading: false,
        reviewed: false,
    });
    const [enterprise, setEnterpise] = useState<Enterprise | null | undefined>(null);
    const [userData, setUserData] = useState<UserInterface | null | undefined>(null);

    const saveReviewHistory = async (wasApproved: boolean) => {
        try {
            if (user.data && user.data.id) {
                const isLimitToReviews: boolean =
                    serviceReq.reviewedByHistory !== undefined &&
                    serviceReq.reviewedByHistory.length + 1 === MIN_NUM_OF_APPROVALS;
                const serviceReview = {
                    adminId: user.data.id,
                    dateTime: Timestamp.fromDate(new Date()),
                    aproved: wasApproved,
                };
                var newReviewServiceHistory = serviceReq.reviewedByHistory
                    ? [...serviceReq.reviewedByHistory, serviceReview]
                    : [serviceReview];
                var toUpdateReq: Partial<UserRequest> = {
                    reviewedByHistory: newReviewServiceHistory,
                    active: isLimitToReviews ? false : true,
                    aproved: isLimitToReviews ? wasApproved : serviceReq.aproved,
                };
                if (isLimitToReviews && serviceReq.vehicles) {
                    const imgDeleted = {
                        ref: "deleted",
                        url: "",
                    };

                    // var vehiclesWithoutImages = serviceReq.vehicles.map((vehicle) => {
                    //     return {
                    //         ...vehicle,
                    //         license: {
                    //             ...vehicle.license,
                    //             backImgUrl: imgDeleted,
                    //             frontImgUrl: imgDeleted,
                    //         },
                    //     };
                    // });

                    toUpdateReq = {
                        ...toUpdateReq,
                        realTimePhotoImgUrl: imgDeleted,
                    };

                    if (typeof serviceReq.newProfilePhotoImgUrl !== "string") {
                        toUpdateReq = {
                            ...toUpdateReq,
                            newProfilePhotoImgUrl: imgDeleted,
                        };
                    }
                }

                await updateService(serviceReq.id, toUpdateReq, towReqCollection);

                if (isLimitToReviews) {
                    var tow = getVehicle(VehicleType.CAR);
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

                        if (tow) {
                            tow = {
                                ...tow,
                                license: {
                                    frontImgUrl: tow.license.frontImgUrl,
                                    backImgUrl: tow.license.backImgUrl,
                                    expiredDateLicense: tow.license.expiredDateLicense,
                                    licenseNumber: tow.license.licenseNumber,
                                },
                            };
                        }

                        if (wasApproved && tow) {
                            vehicles = { ...vehicles, tow };
                        }

                        if (tow) {
                            newReqState = {
                                ...newReqState,
                                tow: serviceReqState,
                            };
                        }

                        var userToUpdate: Partial<UserInterface> = {};

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

                        if (wasApproved && serviceReq.towEnterprite) {
                            userToUpdate = {
                                ...userToUpdate,

                                towEnterpriteId: serviceReq.towEnterprite,
                            };
                            if (!userData.services.includes(Services.Tow)) {
                                userToUpdate = {
                                    ...userToUpdate,
                                    services: [...userData.services, Services.Tow],
                                };
                            }
                        }
                        userToUpdate = await setFirstService(
                            userData,
                            userToUpdate,
                            user.data.id,
                        );
                        await updateUser(serviceReq.userId, userToUpdate);
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

    const fetchWorkshop = async () => {
        if (serviceReq.towEnterprite) {
            try {
                const data = await getEnterpriseById(serviceReq.towEnterprite);
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
        fetchWorkshop();
    }, []);

    useEffect(() => {
        getUserById(serviceReq.userId).then((res) => {
            if (res) {
                setUserData(res);
            } else {
                setUserData(undefined);
            }
        });
    }, []);

    return (
        <div className="service-form-wrapper | max-width-60">
            <h1 className="text | big bolder">Solicitud para ser Operador de Grúa</h1>
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
            ) : enterprise === undefined ? (
                <FieldDeleted description="No se encontró la Empresa Operadora de Grúa, es posible que fue eliminada" />
            ) : (
                <TowRenderer tow={enterprise} />
            )}

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
                stateB2={
                    userData !== null &&
                    userData !== undefined &&
                    !userData.deleted &&
                    enterprise !== null &&
                    enterprise !== undefined &&
                    enterprise.deleted === false &&
                    enterprise.active === true
                }
                alreadyReviewed={reviewState.reviewed || !serviceReq.active}
            />
        </div>
    );
};

export default TowServiceReq;
