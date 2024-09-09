"use client";
import "react-international-phone/style.css";

import { useContext, useEffect, useState } from "react";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { Enterprise } from "@/interfaces/Enterprise";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { EnterpriseManagerEditedAsAdmin } from "../../../models/enterprise_managers_edited/EnterpriseManagerEditedAsAdmin";
import PageLoading from "@/components/loaders/PageLoading";
import FormToDeleteEnterprise from "../../request_forms/to_delete/FormToDeleteEnterprise";
import FormToDisableEnterprise from "../../request_forms/to_disable/FormToDisableEnterprise";
import { routeToAllEnterprisesAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import { PageStateContext } from "@/context/PageStateContext";
import ListOfUsersOfAEnterprise from "../../list_of_cards/ListOfUsersOfAEnterprise";
import { EnterpriseManagementView } from "../../../models/EntepriseMangementViews";
import UserAdderToEnterprise from "../../request_forms/to_edit/UserAdderToEnterprise";
import { AuthContext } from "@/context/AuthContext";
import { ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE } from "../../../utils/EnterpriseSpanishTranslator";
import EnterpriseManagementPanel from "../EnterpriseManagementPanel";
import EnterpriseUsersPanel from "../EnterpriseUsersPanel";

interface Props {
    id: string;
}

const EnterprisePanelForAdmin: React.FC<Props> = ({ id }) => {
    const router = useRouter();
    const { user, checkingUserAuth } = useContext(AuthContext);
    const { loading } = useContext(PageStateContext);
    const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
    const [view, serView] = useState<EnterpriseManagementView>(
        EnterpriseManagementView.HANDLE_ENTERPRISE,
    );

    useEffect(() => {
        getEnterpriseById(id)
            .then((data) => {
                if (data !== undefined) {
                    if (data.deleted) {
                        toast.warning("Empresa no encontrada", {
                            toastId: "no-found-service-enterprise",
                        });

                        router.push(routeToAllEnterprisesAsAdmin(data.type));
                        return;
                    }

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
            {view === EnterpriseManagementView.HANDLE_ENTERPRISE && (
                <section className="service-form-wrapper">
                    <h1 className="text | big bolder">
                        Administracion{" "}
                        {
                            ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE[
                                enterprise.type
                            ]
                        }
                    </h1>

                    <EnterpriseManagementPanel
                        enterprise={enterprise}
                        editedEnterpriseManager={
                            new EnterpriseManagerEditedAsAdmin()
                        }
                    />

                    <EnterpriseUsersPanel
                        content={{
                            user: user,
                            enterprise: enterprise,
                        }}
                        behavior={{
                            loading: loading,
                            setView: serView,
                        }}
                    />

                    <div className="max-width-80 margin-top-50">
                        <div className="separator-horizontal"></div>
                    </div>

                    <FormToDisableEnterprise enterprise={enterprise} />
                    <FormToDeleteEnterprise enterprise={enterprise} />
                </section>
            )}
            {view === EnterpriseManagementView.VIEW_USERS && (
                <div data-state={loading ? "loading" : "loaded"}>
                    <ListOfUsersOfAEnterprise enterprise={enterprise} />
                </div>
            )}

            {view === EnterpriseManagementView.ADD_USER && (
                <div data-state={loading ? "loading" : "loaded"}>
                    <UserAdderToEnterprise
                        userLogged={user}
                        enterprise={enterprise}
                    />
                </div>
            )}
        </>
    );
};

export default EnterprisePanelForAdmin;
