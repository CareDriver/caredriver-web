"use client";
import { UserRequest } from "@/interfaces/UserRequest";
import {
    deleteImagesIfLimitOfApproves,
    MIN_NUM_OF_APPROVALS,
    saveReview,
    setFirstService,
} from "@/components/app_modules/server_users/api/ServicesRequester";
import PersonalDataRenderer from "../../../../users/views/data_renderers/for_user_data/PersonalDataRenderer";
import SelfieRenderer from "../../../../../form/view/field_renderers/SelfieRenderer";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
    getUserById,
    updateUser,
} from "@/components/app_modules/users/api/UserRequester";
import {
    flatPhone,
    ServiceRequestsInterface,
    UserInterface,
} from "@/interfaces/UserInterface";
import { ServiceReqState, Services } from "@/interfaces/Services";
import { toast } from "react-toastify";
import ApprovalsRenderer from "../../data_renderers/ApprovalsRenderer";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { Enterprise } from "@/interfaces/Enterprise";
import UserContactsRendererForForm from "../../../../users/views/data_renderers/for_user_data/UserContactsRendererForForm";
import UserStateWithMessageRenderer from "../../../../users/views/data_renderers/for_user_data/UserStateWithMessageRenderer";
import UserStateRenderer from "../../../../users/views/data_renderers/for_user_data/UserStateRenderer";
import IdCardRenderer from "../../../../users/views/data_renderers/for_user_data/IdCardRenderer";
import LaundryEnterpriseRenderer from "../../../../enterprises/views/data_renderers/LaundryEnterpriseRenderer";
import { laundryReqCollection } from "@/components/app_modules/server_users/api/LaundryRequester";
import { addUserServerToEnterprise } from "@/components/app_modules/enterprises/api/EnterpriseUserAdder";
import {
    DEFAULT_REVIEW_STATE,
    ReviewState,
} from "@/components/form/models/Reviews";
import BaseFormWithTwoButtons from "@/components/form/view/forms/BaseFormWithTwoButtons";
import { getIdSaved } from "@/utils/generators/IdGenerator";
import { notifyRequestApprovalUser } from "../../../api/UserServerNotifier";

const LaundererReviewForm = ({ serviceReq }: { serviceReq: UserRequest }) => {
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
                    laundryReqCollection,
                );

                if (isLimitToReviews) {
                    if (requesterUser) {
                        const serviceReqState = {
                            id: serviceReq.id,
                            state: wasApproved
                                ? ServiceReqState.Approved
                                : ServiceReqState.Refused,
                        };

                        var newReqState: ServiceRequestsInterface =
                            requesterUser.serviceRequests !== undefined
                                ? {
                                      ...requesterUser.serviceRequests,
                                      laundry: serviceReqState,
                                  }
                                : { laundry: serviceReqState };

                        var userToUpdate: Partial<UserInterface> = {
                            serviceRequests: newReqState,
                        };

                        if (
                            wasApproved &&
                            serviceReq.laundryEnterprite &&
                            !requesterUser.services.includes(Services.Laundry)
                        ) {
                            userToUpdate = {
                                ...userToUpdate,
                                laundryEnterpriseId:
                                    serviceReq.laundryEnterprite,
                                services: [
                                    ...requesterUser.services,
                                    Services.Laundry,
                                ],
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

                        if (wasApproved) {
                            await notifyRequestApprovalUser(
                                requesterUser,
                                "laundry",
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

    const fetchLaundry = async () => {
        if (serviceReq.laundryEnterprite) {
            try {
                const data = await getEnterpriseById(
                    serviceReq.laundryEnterprite,
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
        fetchLaundry();
    }, []);

    useEffect(() => {
        getUserById(serviceReq.userId).then((res) => {
            if (res) {
                setRequesterUser(res);
            } else {
                setRequesterUser(undefined);
            }
        });
    }, []);

    return (
        <div className="service-form-wrapper | max-width-60">
            <h1 className="text | big bold">Solicitud para ser Lavadero</h1>
            <div className="row-wrapper | gap-20">
                <ApprovalsRenderer
                    serviceReq={serviceReq}
                    reviewed={reviewState.reviewed}
                />

                <UserStateWithMessageRenderer userData={requesterUser} />
            </div>
            {requesterUser && <UserStateRenderer user={requesterUser} />}

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
                            buttonClassStyle:
                                wasReviewed() ||
                                requesterUser?.deleted ||
                                enterprise?.deleted
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

                {enterprise === null ? (
                    <span className="loader-green"></span>
                ) : (
                    <LaundryEnterpriseRenderer laundry={enterprise} />
                )}

                {requesterUser ? (
                    <UserContactsRendererForForm
                        email={requesterUser.email}
                        phoneNumber={flatPhone(requesterUser.phoneNumber)}
                        alternativePhoneNumber={flatPhone(
                            requesterUser.alternativePhoneNumber,
                        )}
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

export default LaundererReviewForm;
