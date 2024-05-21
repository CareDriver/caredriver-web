"use client";
import { UserRequest } from "@/interfaces/UserRequest";
import {
    deleteImagesIfLimitOfApproves,
    MIN_NUM_OF_APPROVALS,
    updateService,
} from "@/utils/requests/services/ServicesRequester";
import PersonalData from "../../data_renderer/personal_data/PersonalData";
import SelfieRenderer from "../../data_renderer/personal_data/SelfieRenderer";
import ReqButtonRes from "../../data_renderer/form/ReqButtonRes";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Timestamp } from "firebase/firestore";
import { getUserById, updateUser } from "@/utils/requests/UserRequester";
import { ServiceRequestsInterface, UserInterface } from "@/interfaces/UserInterface";
import { ServiceReqState, Services } from "@/interfaces/Services";
import { toast } from "react-toastify";
import ApprovalsRenderer from "../../data_renderer/form/ApprovalsRenderer";
import { getEnterpriseById } from "@/utils/requests/enterprise/EnterpriseRequester";
import { Enterprise } from "@/interfaces/Enterprise";
import FieldDeleted from "../../data_renderer/form/FieldDeleted";
import WorkshopRenderer from "../../data_renderer/enterprise/WorkshopRenderer";
import { mechanicReqCollection } from "@/utils/requests/services/MechanicRequester";
import ContactReviewedUser from "../../data_renderer/form/ContactReviewedUser";
import UserVerifierPrompter from "../../data_renderer/form/UserVerifierPrompter";
import UserStatusIndicatorV2 from "../../data_renderer/form/UserStatusIndicatorV2";
import IdCardRenderer from "../../data_renderer/personal_data/IdCardRenderer";

const MechanicServiceReq = ({ serviceReq }: { serviceReq: UserRequest }) => {
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
                if (isLimitToReviews) {
                    const imgDeleted = {
                        ref: "deleted",
                        url: "",
                    };

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

                await updateService(serviceReq.id, toUpdateReq, mechanicReqCollection);

                if (isLimitToReviews) {
                    if (userData) {
                        const serviceReqState = {
                            id: serviceReq.id,
                            state: wasApproved
                                ? ServiceReqState.Approved
                                : ServiceReqState.Refused,
                        };

                        var newReqState: ServiceRequestsInterface =
                            userData.serviceRequests !== undefined
                                ? {
                                      ...userData.serviceRequests,
                                      mechanic: serviceReqState,
                                  }
                                : { mechanic: serviceReqState };

                        var userToUpdate: Partial<UserInterface> = {
                            serviceRequests: newReqState,
                        };

                        if (wasApproved && serviceReq.mechanicalWorkShop) {
                            userToUpdate = {
                                ...userToUpdate,
                                mechanicalWorkShopId: serviceReq.mechanicalWorkShop,
                                services: [...userData.services, Services.Mechanic],
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
        if (serviceReq.mechanicalWorkShop) {
            try {
                const data = await getEnterpriseById(serviceReq.mechanicalWorkShop);
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
            <h1 className="text | big bolder">Solicitud para ser Mecanico</h1>
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

            {reviewState.reviewed ? (
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
                    {enterprise === null ? (
                        <span className="loader-green"></span>
                    ) : enterprise === undefined ? (
                        <FieldDeleted description="No se selecciono el taller mecanico (El campo era opcional)" />
                    ) : (
                        <WorkshopRenderer workshop={enterprise} />
                    )}

                    {userData && <UserStatusIndicatorV2 user={userData} />}
                    <p className="text | light margin-top-25">
                        Podras contactarte con el usuario despues de{" "}
                        <b>aprobar o rechazar</b> la solicitud
                    </p>
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
                </>
            )}
        </div>
    );
};

export default MechanicServiceReq;
