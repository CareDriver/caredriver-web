"use client";
import { UserRequest, Vehicle } from "@/interfaces/UserRequest";
import {
    deleteImagesIfLimitOfApproves,
    MIN_NUM_OF_APPROVALS,
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
import WorkshopRenderer from "../../data_renderer/enterprise/WorkshopRenderer";
import { getEnterpriseById } from "@/utils/requests/enterprise/EnterpriseRequester";
import ContactReviewedUser from "../../data_renderer/form/ContactReviewedUser";
import TowRenderer from "../../data_renderer/enterprise/TowRenderer";

const TowServiceReq = ({ serviceReq }: { serviceReq: UserRequest }) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] = useState({
        loading: false,
        reviewed: false,
    });
    const [enterprise, setEnterpise] = useState<Enterprise | null | undefined>(null);
    const [userData, setUserData] = useState<UserInterface | null>(null);

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

                    var vehiclesWithoutImages = serviceReq.vehicles.map((vehicle) => {
                        return {
                            ...vehicle,
                            license: {
                                ...vehicle.license,
                                backImgUrl: imgDeleted,
                                frontImgUrl: imgDeleted,
                            },
                        };
                    });

                    toUpdateReq = {
                        ...toUpdateReq,
                        realTimePhotoImgUrl: imgDeleted,
                        vehicles: vehiclesWithoutImages,
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
                    const userData = await getUserById(serviceReq.userId);
                    if (userData) {
                        setUserData(userData);
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
                                services: [...userData.services, Services.Tow],
                                towEnterpriteId: serviceReq.towEnterprite,
                            };
                        }
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
        await review(true);
    };

    const decline = async () => {
        await review(false);
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

    return (
        <section>
            <div>
                <h1>Solicitud para ser Operador de Grua</h1>
                <ApprovalsRenderer
                    serviceReq={serviceReq}
                    reviewed={reviewState.reviewed}
                />

                <PersonalData
                    location={serviceReq.location}
                    name={serviceReq.newFullName}
                    photo={serviceReq.newProfilePhotoImgUrl}
                />
                {!reviewState.reviewed ? (
                    userData && user.data ? (
                        <ContactReviewedUser
                            user={userData}
                            transmitter={user.data.fullName}
                        />
                    ) : (
                        <FieldDeleted description="No se encontraron los medios de comunicacion para comunicarse con el usuario solicitante" />
                    )
                ) : (
                    <>
                        <SelfieRenderer image={serviceReq.realTimePhotoImgUrl} />
                        {serviceReq.vehicles && (
                            <VehiclesRenderer vehicles={serviceReq.vehicles} />
                        )}
                        {enterprise === null ? (
                            <span className="loader-green"></span>
                        ) : enterprise === undefined ? (
                            <FieldDeleted description="No se encontro la Empresa Operadora de Grua, es posible que fue eliminada" />
                        ) : (
                            <TowRenderer tow={enterprise} />
                        )}

                        <ReqButtonRes
                            onApprove={approve}
                            onDecline={decline}
                            loading={reviewState.loading}
                        />
                    </>
                )}
            </div>
        </section>
    );
};

export default TowServiceReq;
