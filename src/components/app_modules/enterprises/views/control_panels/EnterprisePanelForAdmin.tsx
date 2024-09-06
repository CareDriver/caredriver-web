"use client";
import "react-international-phone/style.css";

import { useContext, useEffect, useState } from "react";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { Enterprise } from "@/interfaces/Enterprise";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import EnterpriseEditForm from "../request_forms/to_edit/EnterpriseEditForm";
import { EnterpriseManagerEditedAsAdmin } from "../../models/enterprise_managers_edited/EnterpriseManagerEditedAsAdmin";
import PageLoading from "@/components/loaders/PageLoading";
import FormToDeleteEnterprise from "../request_forms/to_delete/FormToDeleteEnterprise";
import FormToDisableEnterprise from "../request_forms/to_disable/FormToDisableEnterprise";
import { routeToAllEnterprisesAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import { PageStateContext } from "@/context/PageStateContext";
import ListOfUsersOfAEnterprise from "../list_of_cards/ListOfUsersOfAEnterprise";
import Users from "@/icons/Users";

enum View {
    HANDLE_ENTERPRISE,
    VIEW_USERS,
}

interface Props {
    id: string;
}

const EnterprisePanelForAdmin: React.FC<Props> = ({ id }) => {
    const router = useRouter();
    const { loading } = useContext(PageStateContext);
    const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
    const [view, serView] = useState<View>(View.HANDLE_ENTERPRISE);

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

    if (!enterprise) {
        return <PageLoading />;
    }

    return (
        <>
            {view === View.HANDLE_ENTERPRISE && (
                <section className="service-form-wrapper">
                    <h1 className="text | big bolder">Administrar empresa</h1>

                    <div className="max-width-80">
                        <EnterpriseEditForm
                            enterprise={enterprise}
                            editedEnterpriseManager={
                                new EnterpriseManagerEditedAsAdmin()
                            }
                        />
                    </div>
                    <div
                        className={`form-sub-container | margin-top-50 max-width-60 ${
                            loading && "loading-section"
                        }`}
                        data-state={loading ? "loading" : "loaded"}
                    >
                        <h2 className="text icon-wrapper | green green-icon medium-big bold">
                            <Users />
                            {!enterprise.addedUsers ||
                            enterprise.addedUsers.length === 0
                                ? "Ningun usuario agregado"
                                : enterprise.addedUsers.length > 1
                                ? `${enterprise.addedUsers.length} Usuarios agregados`
                                : "Un usuario agregado"}
                        </h2>
                        <p>
                            Puedes ver a los usuarios que trabajan en esta
                            empresa y ver los servicios que realizaron
                        </p>

                        <div className="row-wrapper">
                            {enterprise !== undefined &&
                                enterprise.addedUsers !== undefined &&
                                enterprise.addedUsers.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => serView(View.VIEW_USERS)}
                                        className={`small-general-button text | bold green touchable ${
                                            loading && "loading-section"
                                        }`}
                                    >
                                        Ver usuarios
                                    </button>
                                )}
                        </div>
                    </div>

                    <div className="max-width-80 margin-top-50">
                        <div className="separator-horizontal"></div>
                    </div>

                    <FormToDisableEnterprise enterprise={enterprise} />
                    <FormToDeleteEnterprise enterprise={enterprise} />
                </section>
            )}
            {view === View.VIEW_USERS && (
                <div data-state={loading ? "loading" : "loaded"}>
                    <ListOfUsersOfAEnterprise enterprise={enterprise} />
                </div>
            )}
        </>
    );
};

export default EnterprisePanelForAdmin;
