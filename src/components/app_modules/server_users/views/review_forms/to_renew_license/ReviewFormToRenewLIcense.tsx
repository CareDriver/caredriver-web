"use client";
import { AuthContext } from "@/context/AuthContext";
import { LicenseUpdateReq } from "@/interfaces/PersonalDocumentsInterface";
import { useContext, useEffect, useState } from "react";
import SelfieRenderer from "../../../../../form/view/field_renderers/SelfieRenderer";
import { UserInterface } from "@/interfaces/UserInterface";
import {
    getRenewLicenceReqInRealTime,
    setReviewLicenseReq,
} from "@/components/app_modules/server_users/api/LicenseUpdaterReq";
import {
    getUserById,
    updateUser,
} from "@/components/app_modules/users/api/UserRequester";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import VehicleCategoryRenderer from "../../data_renderers/for_vehicles/VehicleCategoryRenderer";
import { deleteFile } from "@/utils/requesters/FileUploader";
import UserStateRenderer from "../../../../users/views/data_renderers/for_user_data/UserStateRenderer";
import UserStateWithMessageRenderer from "../../../../users/views/data_renderers/for_user_data/UserStateWithMessageRenderer";
import PageLoading from "@/components/loaders/PageLoading";
import BaseFormWithTwoButtons from "@/components/form/view/forms/BaseFormWithTwoButtons";
import LicenseReviewForm from "@/components/app_modules/server_users/views/data_renderers/for_licenses/LicenseReviewForm";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import PersonalDataRenderer from "@/components/app_modules/users/views/data_renderers/for_user_data/PersonalDataRenderer";
import { isNull } from "@/validators/NullDataValidator";
import { routeToRequestsToRenewLicenseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";
import { Unsubscribe } from "firebase/firestore";
import {
    DEFAULT_REVIEW_STATE,
    ReviewState,
} from "@/components/form/models/Reviews";

const ReviewFormToRenewLIcense = ({ reqId }: { reqId: string }) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] =
        useState<ReviewState>(DEFAULT_REVIEW_STATE);
    const [req, setReq] = useState<LicenseUpdateReq | null | undefined>(null);
    const [userReq, setUserReq] = useState<UserInterface | null>(null);
    const router = useRouter();
    const [userData, setUserData] = useState<UserInterface | null | undefined>(
        null,
    );

    const wasReviewed = (): boolean => {
        return reviewState.reviewed || !req?.active;
    };

    const faildRedirect = (reason: string) => {
        toast.error(reason);
        router.push(routeToRequestsToRenewLicenseAsAdmin());
    };

    const fetchUserReq = async () => {
        if (req) {
            try {
                const userRes = await getUserById(req.userId);
                if (
                    userRes &&
                    userRes.serviceVehicles &&
                    userRes.serviceVehicles[req.vehicleType]
                ) {
                    setUserReq(userRes);
                } else {
                    faildRedirect("El usuario no tiene ese vehículo");
                }
            } catch (e) {
                faildRedirect("Petición no encontrada");
            }
        }
    };

    useEffect(() => {
        let unsubscribe: Unsubscribe | undefined;

        getRenewLicenceReqInRealTime(reqId, {
            onFound: setReq,
            onNotFound: () => faildRedirect("Petición no encontrada"),
        })
            .then((u) => (unsubscribe = u))
            .catch(() => faildRedirect("Petición no encontrada"));

        return () => unsubscribe && unsubscribe();
    }, []);

    useEffect(() => {
        fetchUserReq();
    }, [req]);

    const deleteImages = async () => {
        if (req) {
            await deleteFile(req.realTimePhotoImgUrl.ref);
        }
    };

    const saveReview = async (wasApproved: boolean) => {
        if (
            req &&
            userReq &&
            userReq.id &&
            userReq.serviceVehicles &&
            userReq.serviceVehicles[req.vehicleType]
        ) {
            await setReviewLicenseReq(req.id);
            if (wasApproved) {
                const toUpdateUser: Partial<UserInterface> = {
                    serviceVehicles: {
                        ...userReq.serviceVehicles,
                        [req.vehicleType]: {
                            ...userReq.serviceVehicles[req.vehicleType],
                            license: {
                                frontImgUrl: req.frontImgUrl,
                                backImgUrl: req.backImgUrl,
                                licenseNumber: req.licenseNumber,
                                expiredDateLicense: req.expiredDateLicense,
                            },
                        },
                    },
                };
                await updateUser(userReq.id, toUpdateUser);
            }
        }
    };

    const review = async (wasApproved: boolean) => {
        if (user && req && userReq) {
            setReviewState((prev) => ({ ...prev, loading: true }));
            try {
                await toast.promise(deleteImages, {
                    pending: "Eliminando foto de confirmacion del usario",
                    success: "Foto eliminada",
                    error: "Error al eliminar la foto, inténtalo de nuevo por favor",
                });
                await toast.promise(saveReview(wasApproved), {
                    pending: "Guardando revision",
                    success: "Revision guardada",
                    error: "Error al guardar, inténtalo de nuevo por favor",
                });
                router.push(routeToRequestsToRenewLicenseAsAdmin());
            } catch (e) {
                setReviewState((prev) => ({ ...prev, loading: false }));
            }
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
        if (req) {
            getUserById(req.userId).then((res) => {
                if (res) {
                    setUserData(res);
                } else {
                    setUserData(undefined);
                }
            });
        } else {
            setUserData(undefined);
        }
    }, [req]);

    if (!req) {
        return <PageLoading />;
    }

    return (
        <div className="service-form-wrapper | max-width-60">
            <h1 className="text | big bolder">
                Solicitud para actualizar una licencia de conducir
            </h1>
            <BaseFormWithTwoButtons
                content={{
                    firstButton: {
                        content: {
                            legend: "Rechazar",
                            buttonClassStyle: wasReviewed()
                                ? "hidden"
                                : "general-button | yellow",
                            loaderClassStyle: "loader-black",
                        },
                        behavior: {
                            action: decline,
                            loading:
                                reviewState.loading ||
                                isNull(userData) ||
                                isNull(userReq),
                            setLoading: (d) =>
                                setReviewState((prev) => ({
                                    ...prev,
                                    loading: d,
                                })),
                            isValid: req.active && !isNull(userData),
                        },
                    },
                    secondButton: {
                        content: {
                            legend: "Aprobar",
                            buttonClassStyle:
                                wasReviewed() || userReq?.deleted
                                    ? "hidden"
                                    : undefined,
                        },
                        behavior: {
                            action: approve,
                            loading:
                                reviewState.loading ||
                                isNull(userData) ||
                                isNull(userReq),
                            setLoading: (d) =>
                                setReviewState((prev) => ({
                                    ...prev,
                                    loading: d,
                                })),
                            isValid: req.active && !isNull(userData),
                        },
                    },
                }}
                behavior={{
                    loading: reviewState.loading || !userData || !userReq,
                }}
            >
                <UserStateWithMessageRenderer userData={userReq} />
                {userReq && <UserStateRenderer user={userReq} />}

                {userReq && userData ? (
                    <PersonalDataRenderer
                        location={userReq.location}
                        name={userData.fullName}
                        photo={userData.photoUrl}
                    >
                        <TextFieldRenderer
                            content={userReq.services
                                .toString()
                                .replaceAll(",", " - ")}
                            legend="Servicios del usuario"
                        />
                    </PersonalDataRenderer>
                ) : (
                    <span className="loader-green"></span>
                )}
                <VehicleCategoryRenderer category={req.vehicleType} />
                <LicenseReviewForm license={req} />
                <SelfieRenderer image={req.realTimePhotoImgUrl} />

                {userReq && <UserStateWithMessageRenderer userData={userReq} />}
            </BaseFormWithTwoButtons>
        </div>
    );
};

export default ReviewFormToRenewLIcense;
