"use client";
import "react-international-phone/style.css";

import { AuthContext } from "@/context/AuthContext";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { Enterprise } from "@/interfaces/Enterprise";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import FieldDeleted from "../../../../form/view/field_renderers/FieldDeleted";
import UserAdderToEnterprise from "../request_forms/to_edit/UserAdderToEnterprise";
import Users from "@/icons/Users";
import ListOfUsersOfAEnterprise from "../list_of_cards/ListOfUsersOfAEnterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import EnterpriseRenderer from "../../../requests/data_renderer/enterprise/EnterpriseRenderer";
import { PageStateContext } from "@/context/PageStateContext";
import EnterpriseEditForm from "../request_forms/to_edit/EnterpriseEditForm";
import { EnterpriseManagerEditedAsServerUser } from "../../models/enterprise_managers_edited/EnterpriseManagerEditedAsServerUser";
import { isTheEnterpriseOwner } from "../../utils/UserValidatorInEnterpriseHelper";
import PageLoading from "@/components/loaders/PageLoading";
import { useContext, useEffect, useState } from "react";
import FormToDeleteEnterprise from "../request_forms/to_delete/FormToDeleteEnterprise";

enum View {
    HANDLE_ENTERPRISE,
    ADD_USER,
    VIEW_USERS,
}

interface Props {
    id: string;
}

const EnterprisePanelForUserServer: React.FC<Props> = ({ id }) => {
    const router = useRouter();
    const { loading } = useContext(PageStateContext);
    const { user, checkingUserAuth } = useContext(AuthContext);
    const [view, serView] = useState<View>(View.HANDLE_ENTERPRISE);
    const [enterprise, setEnterprise] = useState<Enterprise | null>(null);

    useEffect(() => {
        getEnterpriseById(id)
            .then((data) => {
                if (
                    data !== undefined &&
                    data.coordinates?.latitude &&
                    data.coordinates?.longitude
                ) {
                    setEnterprise(data);
                } else {
                    router.back();
                    toast.error("Empresa no encontrada");
                }
            })
            .catch(() => {
                router.back();
                toast.error("Empresa no encontrada");
            });
    }, []);

    if (checkingUserAuth || !enterprise || !user) {
        return <PageLoading />;
    }

    return (
        <>
            {view === View.HANDLE_ENTERPRISE && (
                <section className="service-form-wrapper">
                    <h1 className="text | big bolder">
                        Administracion de la empresa
                    </h1>
                    <div className="separator-horizontal"></div>
                    {getHandleEnterpriseView(
                        {
                            user: user,
                            enterprise: enterprise,
                        },
                        {
                            loading: loading,
                            setView: serView,
                        },
                    )}
                </section>
            )}
            {user && view === View.ADD_USER && (
                <div data-state={loading ? "loading" : "loaded"}>
                    <UserAdderToEnterprise
                        userLogged={user}
                        enterprise={enterprise}
                    />
                </div>
            )}

            {view === View.VIEW_USERS && (
                <div data-state={loading ? "loading" : "loaded"}>
                    <ListOfUsersOfAEnterprise enterprise={enterprise} />
                </div>
            )}
        </>
    );
};

export default EnterprisePanelForUserServer;

function getHandleEnterpriseView(
    content: {
        user: UserInterface;
        enterprise: Enterprise;
    },
    behavior: { loading: boolean; setView: (v: View) => void },
) {
    return (
        <>
            {isTheEnterpriseOwner(content.user, content.enterprise) ? (
                content.enterprise.deleted ? (
                    <div className="margin-top-25 max-width-60">
                        <FieldDeleted description="Esta empresa fue eliminada" />
                        <EnterpriseRenderer enterprise={content.enterprise} />
                    </div>
                ) : (
                    <EnterpriseEditForm
                        enterprise={content.enterprise}
                        editedEnterpriseManager={
                            new EnterpriseManagerEditedAsServerUser()
                        }
                    />
                )
            ) : (
                <>
                    <p>
                        Eres <b>usuario soporte</b> en esta empresa, ayuda a
                        admnistrar a los usuarios que pueden trabajar en esta
                        empresa.
                    </p>
                    <div className="margin-top-50 max-width-60">
                        <EnterpriseRenderer enterprise={content.enterprise} />
                    </div>
                </>
            )}

            <div
                className={`form-sub-container | margin-top-50 max-width-60 ${
                    behavior.loading && "loading-section"
                }`}
                data-state={behavior.loading ? "loading" : "loaded"}
            >
                <h2 className="text icon-wrapper | green green-icon medium-big bold">
                    <Users />
                    {!content.enterprise.addedUsers ||
                    content.enterprise.addedUsers.length === 0
                        ? "Ningun usuario agregado"
                        : content.enterprise.addedUsers.length > 1
                        ? `${content.enterprise.addedUsers.length} Usuarios agregados`
                        : "Un usuario agregado"}
                </h2>
                <p>
                    Registra o agrega usuarios a tu servicio, puedes registrar
                    usuarios que trabajar en tu servicio o agregar usuarios
                    soporte que ayuden a manejar tu servicio
                </p>

                <div className="row-wrapper">
                    <button
                        type="button"
                        onClick={() => behavior.setView(View.ADD_USER)}
                        className={`small-general-button text | bold green touchable ${
                            behavior.loading && "loading-section"
                        }`}
                    >
                        Registrar nuevo usuario
                    </button>
                    {content.enterprise !== undefined &&
                        content.enterprise.addedUsers !== undefined &&
                        content.enterprise.addedUsers.length > 0 && (
                            <button
                                type="button"
                                onClick={() =>
                                    behavior.setView(View.VIEW_USERS)
                                }
                                className={`small-general-button text | bold green touchable ${
                                    behavior.loading && "loading-section"
                                }`}
                            >
                                Admnistrar usuarios
                            </button>
                        )}
                </div>
            </div>
            {isTheEnterpriseOwner(content.user, content.enterprise) && (
                <FormToDeleteEnterprise enterprise={content.enterprise} />
            )}
        </>
    );
}
