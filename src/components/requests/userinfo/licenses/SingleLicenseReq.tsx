"use client";
import { AuthContext } from "@/context/AuthContext";
import { LicenseUpdateReq } from "@/interfaces/PersonalDocumentsInterface";
import { useContext, useEffect, useState } from "react";
import LicenseRenderer from "../../data_renderer/vehicle/LicenseRenderer";
import PageLoader from "@/components/PageLoader";
import SelfieRenderer from "../../data_renderer/personal_data/SelfieRenderer";
import { UserInterface } from "@/interfaces/UserInterface";
import PersonalDataV2 from "../../data_renderer/personal_data/PersonalDataV2";
import {
    getLicenceUpdateReqById,
    setReviewLicenseReq,
} from "@/utils/requests/LicenseUpdaterReq";
import { getUserById, updateUser } from "@/utils/requests/UserRequester";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import VehicleCategoryRender from "../../data_renderer/vehicle/VehicleCategoryRender";
import ReqButtonRes from "../../data_renderer/form/ReqButtonRes";
import { deleteFile } from "@/utils/requests/FileUploader";

const SingleLicenseReq = ({ reqId }: { reqId: string }) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] = useState({
        loading: false,
    });
    const [req, setReq] = useState<LicenseUpdateReq | null>(null);
    const [userReq, setUserReq] = useState<UserInterface | null>(null);
    const router = useRouter();

    const faildRedirect = (reason: string) => {
        toast.error(reason);
        router.push("/admin/requests/userinfo/license");
    };

    const fetchReq = async () => {
        try {
            const reqRes = await getLicenceUpdateReqById(reqId);
            if (reqRes) {
                setReq(reqRes);
            } else {
                faildRedirect("Peticion no encontrada");
            }
        } catch (e) {
            faildRedirect("Peticion no encontrada");
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
                    faildRedirect("El usuario no tiene ese vehiculo");
                }
            } catch (e) {
                faildRedirect("Peticion no encontrada");
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
            if (req.backImgUrl) {
                await deleteFile(req.backImgUrl.ref);
            }
            if (req.frontImgUrl) {
                await deleteFile(req.frontImgUrl.ref);
            }
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
        if (user.data && req && userReq) {
            setReviewState({
                ...reviewState,
                loading: true,
            });
            try {
                await toast.promise(deleteImages, {
                    pending: "Eliminando imagenes",
                    success: "Imagenes eliminadas",
                    error: "Error al eliminar imagenes, intentalo de nuevo por favor",
                });
                await toast.promise(saveReview(wasApproved), {
                    pending: "Guardando revision",
                    success: "Revision guardada",
                    error: "Error al guardar, intentalo de nuevo por favor",
                });
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
                router.push("/admin/requests/userinfo/license");
            } catch (e) {
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
            }
        }
    };

    const approve = async () => {
        await review(true);
    };

    const decline = async () => {
        await review(false);
    };

    return req ? (
        <div className="service-form-wrapper">
            <div className="max-width-60">
                <h1 className="text | big bolder">
                    Solicitud para actualizar una licencia de conducir
                </h1>
            </div>
            {userReq ? (
                <PersonalDataV2
                    location={userReq.location}
                    name={userReq.fullName}
                    photo={userReq.photoUrl}
                    custom={{
                        content: userReq.services.toString().replaceAll(",", " - "),
                        placeholder: "Servicios del usuario",
                    }}
                />
            ) : (
                <span className="loader-green"></span>
            )}
            <VehicleCategoryRender category={req.vehicleType} />
            <LicenseRenderer license={req} />
            <SelfieRenderer image={req.realTimePhotoImgUrl} />
            <ReqButtonRes
                onApprove={approve}
                onDecline={decline}
                loading={reviewState.loading}
            />
        </div>
    ) : (
        <PageLoader />
    );
};

export default SingleLicenseReq;
