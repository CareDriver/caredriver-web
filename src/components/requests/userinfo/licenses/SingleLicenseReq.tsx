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
import UserStatusIndicatorV2 from "../../data_renderer/form/UserStatusIndicatorV2";
import UserVerifierPrompter from "../../data_renderer/form/UserVerifierPrompter";

const SingleLicenseReq = ({ reqId }: { reqId: string }) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] = useState({
        loading: false,
    });
    const [req, setReq] = useState<LicenseUpdateReq | null>(null);
    const [userReq, setUserReq] = useState<UserInterface | null>(null);
    const router = useRouter();
    const [userData, setUserData] = useState<UserInterface | null | undefined>(null);

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
        if (user.data && req && userReq) {
            setReviewState({
                ...reviewState,
                loading: true,
            });
            try {
                await toast.promise(deleteImages, {
                    pending: "Eliminando foto de confirmacion del usario",
                    success: "Foto eliminada",
                    error: "Error al eliminar la foto, intentalo de nuevo por favor",
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

    return req ? (
        <div className="service-form-wrapper | max-width-60">
            <h1 className="text | big bolder">
                Solicitud para actualizar una licencia de conducir
            </h1>

            <UserVerifierPrompter userData={userData} />

            {userReq && userData ? (
                <PersonalDataV2
                    location={userReq.location}
                    name={userData.fullName}
                    photo={userData.photoUrl}
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

            {userData && <UserStatusIndicatorV2 user={userData} />}

            <ReqButtonRes
                onApprove={approve}
                onDecline={decline}
                loading={reviewState.loading || userData === null}
                stateB1={true}
                stateB2={userData !== null && userData !== undefined && !userData.deleted}
                alreadyReviewed={!req.active}
            />
        </div>
    ) : (
        <PageLoader />
    );
};

export default SingleLicenseReq;
