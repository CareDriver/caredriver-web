"use client";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import PageLoader from "@/components/PageLoader";
import { UserInterface } from "@/interfaces/UserInterface";
import PersonalDataV2 from "../../data_renderer/personal_data/PersonalDataV2";
import { getUserById, updateUser } from "@/utils/requests/UserRequester";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReqButtonRes from "../../data_renderer/form/ReqButtonRes";
import { deleteFile } from "@/utils/requests/FileUploader";
import { ChangePhotoReqInterface } from "@/interfaces/ChangePhotoReq";
import {
    deleteChangePhotoReq,
    getUpPhotoReqById,
} from "@/utils/requests/ChangePhotoRequester";
import ImageRenderer from "../../data_renderer/form/ImageRenderer";
import UserStatusIndicatorV2 from "../../data_renderer/form/UserStatusIndicatorV2";
import UserVerifierPrompter from "../../data_renderer/form/UserVerifierPrompter";

const SingleUpPhotoReq = ({ reqId }: { reqId: string }) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] = useState({
        loading: false,
    });
    const [req, setReq] = useState<ChangePhotoReqInterface | null>(null);
    const [userReq, setUserReq] = useState<UserInterface | null>(null);
    const router = useRouter();

    const faildRedirect = (reason: string) => {
        toast.error(reason);
        router.push("/admin/requests/userinfo/photo");
    };

    const fetchReq = async () => {
        try {
            const reqRes = await getUpPhotoReqById(reqId);
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
                if (userRes) {
                    setUserReq(userRes);
                } else {
                    faildRedirect("No se encontro al usuario");
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

    const review = async (wasApproved: boolean) => {
        if (user.data && req && userReq && userReq.id) {
            setReviewState({
                ...reviewState,
                loading: true,
            });
            try {
                if (wasApproved) {
                    await updateUser(userReq.id, {
                        photoUrl: req.newPhoto,
                    });
                } else if (req.newPhoto.ref !== "") {
                    await deleteFile(req.newPhoto.ref);
                }
                await deleteChangePhotoReq(req.id);
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
                router.push("/admin/requests/userinfo/photo");
            } catch (e) {
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
            }
        }
    };

    const approve = async () => {
        await toast.promise(review(true), {
            pending: "Cambiando foto de perfil del usuario",
            success: "Foto cambiada",
            error: "Error al cambiar foto, intentalo de nuevo por favor",
        });
    };

    const decline = async () => {
        await toast.promise(review(false), {
            pending: "Elimando la foto de perfil",
            success: "Foto eliminada",
            error: "Error al eliminar la foto de perfil, intentalo de nuevo por favor",
        });
    };

    return req ? (
        <div className="service-form-wrapper">
            <div className="max-width-60">
                <h1 className="text | big bolder">
                    Solicitud para actualizar foto de perfil
                </h1>
            </div>

            <UserVerifierPrompter userData={userReq} />

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
            <ImageRenderer
                url={req.newPhoto}
                placeholder="Nueva foto de perfil"
                isCircle={true}
                noFoundDescr={"No se ha encontrado la nueva foto de perfil"}
            />

            {userReq && <UserStatusIndicatorV2 user={userReq} />}

            <ReqButtonRes
                onApprove={approve}
                onDecline={decline}
                loading={reviewState.loading || userReq === null}
                stateB1={true}
                stateB2={userReq !== null && !userReq.deleted}
            />
        </div>
    ) : (
        <PageLoader />
    );
};

export default SingleUpPhotoReq;
