"use client";

import UserStateWithMessageRenderer from "@/components/app_modules/users/views/data_renderers/for_user_data/UserStateWithMessageRenderer";
import {
    DEFAULT_REVIEW_STATE,
    ReviewState,
} from "@/components/form/models/Reviews";
import PageLoading from "@/components/loaders/PageLoading";
import { Enterprise } from "@/interfaces/Enterprise";
import { RequestForChangeOfEnterprise } from "@/interfaces/RequestForChangeOfEnterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import { useEffect, useState } from "react";
import {
    getRequestToChangeAssociatedEnterpriseById,
    updateRequestToChangeAssociatedEnterprise,
} from "../../../api/RequestForChangeEnterprise";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { routeToUserRequestsToChangeEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";
import {
    getEnterpriseById,
    updateEnterprise,
} from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import {
    getUserById,
    updateUser,
} from "@/components/app_modules/users/api/UserRequester";
import EnterpriseRenderer from "@/components/app_modules/enterprises/views/data_renderers/EnterpriseRenderer";
import FieldDeleted from "@/components/form/view/field_renderers/FieldDeleted";
import BaseFormWithTwoButtons from "@/components/form/view/forms/BaseFormWithTwoButtons";
import UserIcon from "@/icons/UserIcon";
import PersonalDataRenderer from "@/components/app_modules/users/views/data_renderers/for_user_data/PersonalDataRenderer";
import NoteSticky from "@/icons/NoteSticky";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import Building from "@/icons/Building";
import { ENTERPRISE_TO_SPANISH } from "@/components/app_modules/enterprises/utils/EnterpriseSpanishTranslator";
import { ServiceType } from "@/interfaces/Services";
import { getFakeIdSaved } from "@/utils/generators/IdGenerator";

interface Props {
    reqId: string;
}

const ReviewFormToChangeFromEnterpriseToUser: React.FC<Props> = ({ reqId }) => {
    const router = useRouter();
    const [request, setRequest] = useState<
        RequestForChangeOfEnterprise | undefined
    >(undefined);
    const [requesterUser, setRequesterUser] = useState<
        UserInterface | undefined
    >(undefined);
    const [oldEnterprise, setOldEnterprise] = useState<
        Enterprise | undefined | null
    >(undefined);
    const [newEnterprise, setNewEnterprise] = useState<
        Enterprise | undefined | null
    >(undefined);
    const [reviewState, setReviewState] =
        useState<ReviewState>(DEFAULT_REVIEW_STATE);

    const wasReviewed = (): boolean => {
        return (
            reviewState.reviewed || (request !== undefined && !request.active)
        );
    };

    const putNewEntepriseOnUser = (
        serviceType: ServiceType,
        enterpriseId: string,
    ): Partial<UserInterface> => {
        switch (serviceType) {
            case "driver":
                return {
                    driverEnterpriseId: enterpriseId,
                };
            case "laundry":
                return {
                    laundryEnterpriseId: enterpriseId,
                };
            case "mechanical":
                return {
                    mechanicalWorkShopId: enterpriseId,
                };
            case "tow":
                return {
                    towEnterpriseId: enterpriseId,
                };
            default:
                return {};
        }
    };

    const removeUserToEnterprise = async (
        enterprise: Enterprise,
        user: UserInterface,
    ) => {
        if (!user.id || !enterprise.id) {
            return;
        }

        let newUsersId: string[] = enterprise.addedUsersId
            ? enterprise.addedUsersId.filter((u) => u !== user.id)
            : [];
        let newUsersWithRoles = enterprise.addedUsers
            ? enterprise.addedUsers.filter((u) => u.userId !== user.id)
            : [];

        await updateEnterprise(enterprise.id, {
            addedUsersId: newUsersId,
            addedUsers: newUsersWithRoles,
        });
    };

    const addUserToEnterprise = async (
        enterprise: Enterprise,
        user: UserInterface,
    ) => {
        if (!user.id || !enterprise.id) {
            return;
        }

        let newUsersId: string[] = enterprise.addedUsersId
            ? enterprise.addedUsersId
            : [];
        let newUsersWithRoles = enterprise.addedUsers
            ? enterprise.addedUsers
            : [];

        if (!newUsersId.includes(user.id)) {
            newUsersId.push(user.id);
        }

        let includeUser = newUsersWithRoles.reduce((acc, u) => {
            return acc || u.userId === user.id;
        }, false);

        if (!includeUser) {
            newUsersWithRoles.push({
                role: "user",
                userId: user.id,
                fakeUserId: getFakeIdSaved(user.fakeId),
            });
        }

        if (newUsersId.includes(user.id))
            await updateEnterprise(enterprise.id, {
                addedUsersId: newUsersId,
                addedUsers: newUsersWithRoles,
            });
    };

    const approve = async () => {
        if (reviewState.loading) {
            return;
        }
        setReviewState((prev) => ({ ...prev, loading: true }));

        if (
            !request ||
            !requesterUser ||
            !requesterUser.id ||
            !newEnterprise ||
            (request.oldEnterpriseId && !oldEnterprise)
        ) {
            toast.info("Cargando datos..."),
                setReviewState((prev) => ({ ...prev, loading: true }));
            return;
        }

        // removing user to old enterprise
        if (request.oldEnterpriseId && oldEnterprise) {
            await toast.promise(
                removeUserToEnterprise(oldEnterprise, requesterUser),
                {
                    pending: "Removiendo de la antigua empresa",
                    success: "Removido de la antigua empresa",
                    error: "Error al remover de la antigua empresa, intentalo de nuevo",
                },
            );
        }

        // adding user to new enterprise
        await toast.promise(addUserToEnterprise(newEnterprise, requesterUser), {
            pending: "Agregando a la nueva empresa",
            success: "Agregado a la nueva empresa",
            error: "Error al agregar a la nueva empresa, intentalo de nuevo",
        });

        // adding enterprise to user
        await updateUser(
            requesterUser.id,
            putNewEntepriseOnUser(request.serviceType, request.newEnterpriseId),
        );

        // set request as reviewed
        await toast.promise(
            updateRequestToChangeAssociatedEnterprise(reqId, {
                active: false,
            }),
            {
                pending: "Guardando solicitud",
                success: "Solicitud guardada",
                error: "Error al guardar la solicitud",
            },
        );

        router.push(routeToUserRequestsToChangeEnterpriseAsAdmin());
    };

    const decline = async () => {
        if (reviewState.loading) {
            return;
        }

        setReviewState((prev) => ({ ...prev, loading: true }));

        await toast.promise(
            updateRequestToChangeAssociatedEnterprise(reqId, {
                active: false,
            }),
            {
                pending: "Rechazando solicitud...",
                success: "Solicitud rechazada",
                error: "Error al rechazar la solicitud, intentalo de nuevo por favor",
            },
        );

        router.push(routeToUserRequestsToChangeEnterpriseAsAdmin());
    };

    useEffect(() => {
        getRequestToChangeAssociatedEnterpriseById(reqId).then((res) => {
            if (!res) {
                toast.error("Peticion no encontrada");
                router.push(routeToUserRequestsToChangeEnterpriseAsAdmin());
            }
            setRequest(res);
        });
    }, []);

    useEffect(() => {
        if (request) {
            if (request.oldEnterpriseId) {
                getEnterpriseById(request.oldEnterpriseId).then((res) => {
                    setOldEnterprise(res ? res : null);
                });
            } else {
                setOldEnterprise(null);
            }
        }
    }, [request]);

    useEffect(() => {
        if (request) {
            getEnterpriseById(request.newEnterpriseId).then((res) => {
                setNewEnterprise(res ? res : null);
            });
        }
    }, [request]);

    useEffect(() => {
        if (request) {
            getUserById(request.userId).then((res) => {
                setRequesterUser(res);
            });
        }
    }, [request]);

    if (!request) {
        return <PageLoading />;
    }

    return (
        <div className="service-form-wrapper | max-width-60">
            <h1 className="text | big bolder">
                Cambio de {ENTERPRISE_TO_SPANISH[request.serviceType]}
            </h1>
            <div className="row-wrapper | gap-20">
                <UserStateWithMessageRenderer userData={requesterUser} />
            </div>
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
                            buttonClassStyle: wasReviewed()
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
                <div>
                    {requesterUser === undefined ? (
                        <h3 className="text | bold gray">
                            <span className="loader-gray"></span>
                            Cargando datos del usuario
                        </h3>
                    ) : requesterUser === null ? (
                        <FieldDeleted description="El usuario no fue encontrado" />
                    ) : (
                        <PersonalDataRenderer
                            name={requesterUser.fullName}
                            location={requesterUser.location}
                            photo={requesterUser.photoUrl}
                        />
                    )}
                </div>
                <div className="form-sub-container">
                    <h2 className="text | medium-big bold | icon-wrapper">
                        <NoteSticky />
                        Justificacion
                    </h2>
                    <TextFieldRenderer
                        content={request.reason}
                        legend="Razon"
                    />
                </div>
                <div className="form-sub-container">
                    <h2 className="text | medium-big bold | icon-wrapper">
                        <Building />
                        Antigua empresa
                    </h2>
                    {oldEnterprise === undefined ? (
                        <h3 className="text | bold gray">
                            <span className="loader-gray"></span>
                            Cargando empresa
                        </h3>
                    ) : oldEnterprise === null ? (
                        <FieldDeleted description="El usuario no tiene ninguna empresa asociada" />
                    ) : (
                        <EnterpriseRenderer enterprise={oldEnterprise} />
                    )}
                </div>
                <div className="form-sub-container">
                    <h2 className="text | medium-big bold | icon-wrapper">
                        <Building />
                        Nueva empresa
                    </h2>
                    {newEnterprise === undefined ? (
                        <h3 className="text | bold gray">
                            <span className="loader-gray"></span>
                            Cargando empresa
                        </h3>
                    ) : newEnterprise === null ? (
                        <FieldDeleted description="No se encontro la nueva empresa, probablemente fue eliminada" />
                    ) : (
                        <EnterpriseRenderer enterprise={newEnterprise} />
                    )}
                </div>
            </BaseFormWithTwoButtons>
        </div>
    );
};

export default ReviewFormToChangeFromEnterpriseToUser;
