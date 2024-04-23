"use client";
import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { UserRequest, Vehicle } from "@/interfaces/UserRequest";
import {
    deleteImagesIfLimitOfApproves,
    MIN_NUM_OF_APPROVALS,
    numOfApprovals,
    updateService,
} from "@/utils/requests/services/ServicesRequester";
import PersonalData from "../../data_renderer/personal_data/PersonalData";
import SelfieRenderer from "../../data_renderer/personal_data/SelfieRenderer";
import VehiclesRenderer from "../../data_renderer/vehicle/VehiclesRenderer";
import ReqButtonRes from "../../data_renderer/ReqButtonRes";
import { useContext, useState } from "react";
import { driveReqCollection } from "@/utils/requests/services/DriveRequester";
import { AuthContext } from "@/context/AuthContext";
import { Timestamp } from "firebase/firestore";
import { updateUser } from "@/utils/requests/UserRequester";
import {
    ServiceRequestsInterface,
    ServiceVehicles,
    UserInterface,
} from "@/interfaces/UserInterface";
import { VehicleType } from "@/interfaces/VehicleInterface";
import { ServiceReqState } from "@/interfaces/Services";
import { toast } from "react-toastify";

const MechanicServiceReq = ({ serviceReq }: { serviceReq: UserRequest }) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] = useState({
        loading: false,
        reviewed: false,
    });

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
                await updateService(
                    serviceReq.id,
                    {
                        reviewedByHistory: newReviewServiceHistory,
                        active: isLimitToReviews ? false : true,
                        aproved: isLimitToReviews ? wasApproved : serviceReq.aproved,
                    },
                    driveReqCollection,
                );

                if (isLimitToReviews) {
                    var vehicles: Partial<ServiceVehicles> | null = null;
                    var newReqState: Partial<ServiceRequestsInterface> = {};
                    var car = getVehicle(VehicleType.CAR);
                    var motorcycle = getVehicle(VehicleType.MOTORCYCLE);

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
                                expiredDateLicense: car.license.expiredDateLicense,
                                licenseNumber: car.license.licenseNumber,
                            },
                        };
                    }
                    if (motorcycle) {
                        motorcycle = {
                            ...motorcycle,
                            license: {
                                expiredDateLicense: motorcycle.license.expiredDateLicense,
                                licenseNumber: motorcycle.license.licenseNumber,
                            },
                        };
                    }

                    if (wasApproved) {
                        if (car && motorcycle) {
                            vehicles = { car, motorcycle };
                        } else if (car && !motorcycle) {
                            vehicles = { car };
                        } else if (!car && motorcycle) {
                            vehicles = { motorcycle };
                        }
                    }

                    if (car && motorcycle) {
                        newReqState = {
                            driveCar: serviceReqState,
                            driveMotorcycle: serviceReqState,
                        };
                    } else if (car && !motorcycle) {
                        newReqState = {
                            driveCar: serviceReqState,
                        };
                    } else if (!car && motorcycle) {
                        newReqState = {
                            driveMotorcycle: serviceReqState,
                        };
                    }

                    var userToUpdate: Partial<UserInterface>;
                    if (vehicles && newReqState) {
                        userToUpdate = {
                            serviceVehicles: vehicles,
                            serviceRequests: newReqState,
                        };
                    } else {
                        userToUpdate = {
                            serviceRequests: newReqState,
                        };
                    }
                    console.log(userToUpdate);
                    await updateUser(serviceReq.userId, userToUpdate);
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

    return (
        <section>
            <div>
                <h1>Solicitud para ser Mecanico</h1>
                <h5>
                    <PersonCircleCheck />
                    {numOfApprovals(serviceReq)}/{MIN_NUM_OF_APPROVALS} Aprobaciones
                </h5>

                <PersonalData
                    location={serviceReq.location}
                    name={serviceReq.newFullName}
                    photo={serviceReq.newProfilePhotoImgUrl}
                />
                <SelfieRenderer image={serviceReq.realTimePhotoImgUrl} />
                {serviceReq.vehicles && (
                    <VehiclesRenderer vehicles={serviceReq.vehicles} />
                )}

                <ReqButtonRes
                    onApprove={approve}
                    onDecline={decline}
                    loading={reviewState.loading}
                />
            </div>
        </section>
    );
};

export default MechanicServiceReq;
