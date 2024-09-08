"use client";
import { AuthContext } from "@/context/AuthContext";
import { LicenseUpdateReq } from "@/interfaces/PersonalDocumentsInterface";
import { useContext, useEffect, useState } from "react";
import SelfieRenderer from "../../../../../form/view/field_renderers/SelfieRenderer";
import { UserInterface } from "@/interfaces/UserInterface";
import {
    getLicenceUpdateReqById,
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

const ReviewFormToRenewLIcense = ({ reqId }: { reqId: string }) => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [req, setReq] = useState<LicenseUpdateReq | null>(null);
    const [userReq, setUserReq] = useState<UserInterface | null>(null);
    const router = useRouter();
    const [userData, setUserData] = useState<UserInterface | null | undefined>(
        null,
    );

    const faildRedirect = (reason: string) => {
        toast.error(reason);
        router.push(routeToRequestsToRenewLicenseAsAdmin());
    };

    const fetchReq = async () => {
        try {
            const reqRes = await getLicenceUpdateReqById(reqId);
            if (reqRes) {
                setReq(reqRes);
            } else {
                faildRedirect("Petición no encontrada");
            }
        } catch (e) {
            faildRedirect("Petición no encontrada");
        }
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
        fetchReq();
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
            setLoading(true);
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
                setLoading(false);
            }
        }
    };

    const approve = async () => {
        if (!loading) {
            await review(true);
        }
    };

    const decline = async () => {
        if (!loading) {
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
                            buttonClassStyle: req.active
                                ? "general-button | yellow"
                                : "hidden",
                            loaderClassStyle: "loader-black",
                        },
                        behavior: {
                            action: decline,
                            loading:
                                loading || isNull(userData) || isNull(userReq),
                            setLoading: setLoading,
                            isValid: req.active && !isNull(userData),
                        },
                    },
                    secondButton: {
                        content: {
                            legend: "Aprobar",
                            buttonClassStyle: req.active ? undefined : "hidden",
                        },
                        behavior: {
                            action: approve,
                            loading:
                                loading || isNull(userData) || isNull(userReq),
                            setLoading: setLoading,
                            isValid: req.active && !isNull(userData),
                        },
                    },
                }}
                behavior={{
                    loading: loading || !userData || !userReq,
                }}
            >
                <UserStateWithMessageRenderer userData={userData} />

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
