"use client";
import "react-international-phone/style.css";

import { AuthContext } from "@/context/AuthContext";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { Enterprise } from "@/interfaces/Enterprise";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import UserAdderToEnterprise from "../../request_forms/to_edit/UserAdderToEnterprise";
import ListOfUsersOfAnEnterpriseByRole from "../../list_of_cards/ListOfUsersOfAnEnterpriseByRole";
import EnterpriseRenderer from "../../data_renderers/EnterpriseRenderer";
import { PageStateContext } from "@/context/PageStateContext";
import { EnterpriseManagerEditedAsServerUser } from "../../../models/enterprise_managers_edited/EnterpriseManagerEditedAsServerUser";
import { isTheEnterpriseOwner } from "../../../validators/validators_of_user_aggregators_to_enterprise/as_members/UserAggregatorValidatorToEnterpriseHelper";
import PageLoading from "@/components/loaders/PageLoading";
import { useContext, useEffect, useState } from "react";
import FormToDeleteEnterprise from "../../request_forms/to_delete/FormToDeleteEnterprise";
import { ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE } from "../../../utils/EnterpriseSpanishTranslator";
import EnterpriseUsersPanel from "../EnterpriseUsersPanel";
import { EnterpriseManagementView } from "../../../models/EntepriseMangementViews";
import EnterpriseManagementPanel from "../EnterpriseManagementPanel";
import CurrentEnterpriseDebt from "../../data_renderers/CurrentEnterpriseDebt";
import EnterprisePaidDebtHistoryRenderer from "../../data_renderers/EnterprisePaidDebtHistoryRenderer";
import EnterpriseComissionHistoryRenderer from "../../data_renderers/EnterpriseComissionHistoryRenderer";

interface Props {
    id: string;
}

const EnterprisePanelForUserServer: React.FC<Props> = ({ id }) => {
    const router = useRouter();
    const { loading } = useContext(PageStateContext);
    const { user, checkingUserAuth } = useContext(AuthContext);
    const [view, serView] = useState<EnterpriseManagementView>(
        EnterpriseManagementView.HANDLE_ENTERPRISE,
    );
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
            {view === EnterpriseManagementView.HANDLE_ENTERPRISE && (
                <section className="service-form-wrapper">
                    <h1 className="text | big bold">
                        Administracion{" "}
                        {
                            ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE[
                                enterprise.type
                            ]
                        }
                    </h1>
                    {isTheEnterpriseOwner(user, enterprise) ? (
                        <EnterpriseManagementPanel
                            enterprise={enterprise}
                            editedEnterpriseManager={
                                new EnterpriseManagerEditedAsServerUser()
                            }
                        />
                    ) : (
                        <>
                            <p>
                                Eres <b>usuario soporte</b> en esta empresa,
                                ayuda a administrar a los usuarios que pueden
                                trabajar en esta empresa.
                            </p>
                            <div className="margin-top-50 max-width-60">
                                <EnterpriseRenderer enterprise={enterprise} />
                            </div>
                        </>
                    )}

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

                    {enterprise.commition && (
                        <>
                            <div className="max-width-80 margin-top-25">
                                <div className="separator-horizontal"></div>
                            </div>

                            <CurrentEnterpriseDebt enterprise={enterprise} />
                            <EnterprisePaidDebtHistoryRenderer
                                history={enterprise.paidDebtsHistory}
                            />
                            <EnterpriseComissionHistoryRenderer
                                history={enterprise.comissionsHistory}
                            />
                        </>
                    )}

                    <div className="max-width-80 margin-top-25">
                        <div className="separator-horizontal"></div>
                    </div>

                    {isTheEnterpriseOwner(user, enterprise) && (
                        <FormToDeleteEnterprise enterprise={enterprise} />
                    )}
                </section>
            )}
            {user && view === EnterpriseManagementView.ADD_USER && (
                <div data-state={loading ? "loading" : "loaded"}>
                    <UserAdderToEnterprise
                        userLogged={user}
                        enterprise={enterprise}
                    />
                </div>
            )}

            {view === EnterpriseManagementView.VIEW_SERVER_USERS && (
                <div data-state={loading ? "loading" : "loaded"}>
                    <ListOfUsersOfAnEnterpriseByRole
                        enterprise={enterprise}
                        role="user"
                    />
                </div>
            )}

            {view === EnterpriseManagementView.VIEW_SUPPORT_USERS && (
                <div data-state={loading ? "loading" : "loaded"}>
                    <ListOfUsersOfAnEnterpriseByRole
                        enterprise={enterprise}
                        role="support"
                    />
                </div>
            )}
        </>
    );
};

export default EnterprisePanelForUserServer;
