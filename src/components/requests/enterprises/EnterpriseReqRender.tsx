"use client";

import {
    Enterprise,
    EnterpriseTypeRender,
    EnterpriseTypeRenderPronoun,
    EnterpriseTypeRenderPronounV3,
} from "@/interfaces/Enterprise";
import EnterpriseRenderer from "../data_renderer/enterprise/EnterpriseRenderer";
import ReqButtonRes from "../data_renderer/form/ReqButtonRes";
import { useContext, useState } from "react";
import {
    aproveEnterpriseReq,
    declineEnterpriseReq,
} from "@/utils/requests/enterprise/EnterpriseRequester";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteFile } from "@/utils/requests/FileUploader";
import { getRoute } from "@/utils/parser/ToSpanishEnterprise";

const EnterpriseReqRender = ({ enterprise }: { enterprise: Enterprise }) => {
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
                    error: `Error al aprobar ${
                        EnterpriseTypeRenderPronoun[enterprise.type]
                    }`,
                });
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
                router.push(`/admin/requests/enterprises/${getRoute(enterprise.type)}`);
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
                    error: "Error al eliminar el logo, inténtalo de nuevo por favor",
                });

                await toast.promise(declineEnterpriseReq(enterprise, user.data.id), {
                    pending: `Rechazando ${EnterpriseTypeRender[enterprise.type]}`,
                    success: "Rechazado",
                    error: `Error al rechazar ${
                        EnterpriseTypeRenderPronoun[enterprise.type]
                    }`,
                });
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
                router.push(`/admin/requests/enterprises/${getRoute(enterprise.type)}`);
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
        <section className="service-form-wrapper | max-width-60">
            <h1 className="text | big-medium bolder margin-bottom-25 capitalize">
                Solicitud para crear {EnterpriseTypeRenderPronounV3[enterprise.type]}
            </h1>
            <EnterpriseRenderer enterprise={enterprise} />
            {!enterprise.aproved && enterprise.active && (
                <p className="text | light margin-top-25">
                    Se eliminaran los datos que ya <b>no seran necesarios</b> si rechazas
                    la solicitud
                </p>
            )}
            {!enterprise.aproved && enterprise.active && (
                <ReqButtonRes
                    onApprove={approve}
                    onDecline={decline}
                    loading={reviewState.loading}
                    stateB1={true}
                    stateB2={true}
                    alreadyReviewed={reviewState.reviewed || !enterprise.active}
                />
            )}
        </section>
    );
};

export default EnterpriseReqRender;
