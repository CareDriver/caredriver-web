"use client";

import { EnterpriseTypeRender, ReqEditEnterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "../../data_renderer/enterprise/EnterpriseRenderer";
import ReqButtonRes from "../../data_renderer/form/ReqButtonRes";
import { useContext, useState } from "react";
import {
    aproveEnterpriseReq,
    declineEnterpriseReq,
} from "@/utils/requests/enterprise/EnterpriseRequester";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteFile } from "@/utils/requests/FileUploader";

const EnterpriseUpReqRender = ({ enterprise }: { enterprise: ReqEditEnterprise }) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] = useState({
        loading: false,
        reviewed: false,
    });
    const router = useRouter();

    const approve = async () => {
        if (user.data && user.data.id && enterprise.id) {
            setReviewState({
                ...reviewState,
                loading: true,
            });
            try {
                await toast.promise(aproveEnterpriseReq(enterprise.id, user.data.id), {
                    pending: `Aprobando ${EnterpriseTypeRender[enterprise.type]}`,
                    success: "Aprobado",
                    error: `Error al aprobar ${enterprise.type === "tow" ? "la" : "el"} ${
                        EnterpriseTypeRender[enterprise.type]
                    }`,
                });
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
                router.push(
                    `/admin/requests/enterprises/${
                        enterprise.type === "tow" ? "cranes" : "workshops"
                    }`,
                );
            } catch (e) {
                console.log(e);
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
            }
        }
    };

    const decline = async () => {
        if (user.data && user.data.id && enterprise.id) {
            setReviewState({
                ...reviewState,
                loading: true,
            });
            try {
                await toast.promise(deleteFile(enterprise.logoImgUrl.ref), {
                    pending: "Eliminado el logo",
                    success: "Logo eliminado",
                    error: "Error al eliminar el logo, intentalo de nuevo por favor",
                });

                await toast.promise(declineEnterpriseReq(enterprise, user.data.id), {
                    pending: `Rechazando ${EnterpriseTypeRender[enterprise.type]}`,
                    success: "Rechazado",
                    error: `Error al rechazar ${
                        enterprise.type === "tow" ? "la" : "el"
                    } ${EnterpriseTypeRender[enterprise.type]}`,
                });
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
                router.push(
                    `/admin/requests/enterprises/${
                        enterprise.type === "tow" ? "cranes" : "workshops"
                    }`,
                );
            } catch (e) {
                console.log(e);
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
            }
        }
    };

    return (
        <section>
            <h1>
                Solicitud para editar {enterprise.type === "tow" ? "una" : "un"}{" "}
                {EnterpriseTypeRender[enterprise.type]}
            </h1>
            <EnterpriseRenderer enterprise={enterprise} />
            <ReqButtonRes
                onApprove={approve}
                onDecline={decline}
                loading={reviewState.loading}
            />
        </section>
    );
};

export default EnterpriseUpReqRender;
