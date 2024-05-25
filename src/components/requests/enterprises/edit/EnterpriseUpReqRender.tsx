"use client";

import {
    Enterprise,
    EnterpriseTypeRender,
    EnterpriseTypeRenderPronoun,
    EnterpriseTypeRenderPronounV2,
    EnterpriseTypeRenderPronounV3,
    ReqEditEnterprise,
} from "@/interfaces/Enterprise";
import EnterpriseRenderer from "../../data_renderer/enterprise/EnterpriseRenderer";
import ReqButtonRes from "../../data_renderer/form/ReqButtonRes";
import { useContext, useState } from "react";
import {
    getEnterpriseById,
    updateEnterprise,
} from "@/utils/requests/enterprise/EnterpriseRequester";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteDocument, deleteFile } from "@/utils/requests/FileUploader";
import { Collections } from "@/firebase/CollecionNames";
import EnterpriseState from "../../data_renderer/enterprise/EnterpriseState";
import { getRoute } from "@/utils/parser/ToSpanishEnterprise";

const EnterpriseUpReqRender = ({
    enterprise,
    realEnteprise,
}: {
    enterprise: ReqEditEnterprise;
    realEnteprise: Enterprise;
}) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] = useState({
        loading: false,
        reviewed: false,
    });
    const router = useRouter();

    const updating = async () => {
        await updateEnterprise(enterprise.enterpriseId, {
            name: enterprise.name,
            logoImgUrl: enterprise.logoImgUrl,
            coordinates: enterprise.coordinates,
            phone: enterprise.phone,
            userId: enterprise.userId,
        });

        if (enterprise.id) {
            await deleteDocument(Collections.EditEnterprises, enterprise.id);
        }
    };

    const approve = async () => {
        if (user.data && user.data.id && enterprise.id) {
            setReviewState({
                ...reviewState,
                loading: true,
            });
            try {
                const oldEnterprise = await getEnterpriseById(enterprise.enterpriseId);
                if (oldEnterprise) {
                    const logoChanged: boolean =
                        oldEnterprise.logoImgUrl.ref !== enterprise.logoImgUrl.ref &&
                        oldEnterprise.logoImgUrl.url !== enterprise.logoImgUrl.url;

                    if (logoChanged) {
                        await toast.promise(deleteFile(oldEnterprise.logoImgUrl.ref), {
                            pending: "Remplazando el logo",
                            success: "Logo remplazado",
                            error: "Error al remplazar el logo, intentalo de nuevo por favor",
                        });
                    }
                    await toast.promise(updating(), {
                        pending: `Editando ${
                            EnterpriseTypeRenderPronoun[enterprise.type]
                        }`,
                        success: "Editado",
                        error: "Error al editar, intentalo de nuevo por favor",
                    });
                    router.push(
                        `/admin/requests/enterprises/edit${getRoute(enterprise.type)}`,
                    );
                } else {
                    toast.error(
                        `${
                            EnterpriseTypeRender[enterprise.type]
                        } para editar no encontrado`,
                    );
                }
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
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
                const oldEnterprise = await getEnterpriseById(enterprise.enterpriseId);
                if (oldEnterprise) {
                    const logoChanged: boolean =
                        oldEnterprise.logoImgUrl.ref !== enterprise.logoImgUrl.ref &&
                        oldEnterprise.logoImgUrl.url !== enterprise.logoImgUrl.url;

                    await toast.promise(
                        deleteDocument(Collections.EditEnterprises, enterprise.id),
                        {
                            pending: `Rechazando la edicion ${
                                EnterpriseTypeRenderPronounV2[enterprise.type]
                            }`,
                            success: "Rechazado",
                            error: `Error al rechazar ${
                                EnterpriseTypeRenderPronounV2[enterprise.type]
                            }`,
                        },
                    );
                    if (logoChanged) {
                        await toast.promise(deleteFile(enterprise.logoImgUrl.ref), {
                            pending: "Eliminado el logo",
                            success: "Logo eliminado",
                            error: "Error al eliminar el logo, intentalo de nuevo por favor",
                        });
                    }

                    router.push(
                        `/admin/requests/enterprises/edit${getRoute(enterprise.type)}`,
                    );
                } else {
                    toast.error(
                        `${
                            EnterpriseTypeRender[enterprise.type]
                        } para editar no encontrado`,
                    );
                }

                setReviewState({
                    ...reviewState,
                    loading: false,
                });
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
                Solicitud para editar {EnterpriseTypeRenderPronounV3[enterprise.type]}
            </h1>
            <EnterpriseState enterprise={realEnteprise} />
            <EnterpriseRenderer enterprise={enterprise} />
            <p className="text | light margin-top-25">
                Se eliminaran los datos que ya <b>no seran necesarios</b> si rechazas la
                solicitud
            </p>
            <ReqButtonRes
                onApprove={approve}
                onDecline={decline}
                loading={reviewState.loading}
                stateB1={true}
                stateB2={true}
                alreadyReviewed={
                    reviewState.reviewed || !realEnteprise.active || realEnteprise.deleted
                }
            />
        </section>
    );
};

export default EnterpriseUpReqRender;
