"use client";
import "react-international-phone/style.css";

import { useEffect, useState } from "react";
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

interface Props {
    id: string;
}

const EnterprisePanelForAdmin: React.FC<Props> = ({ id }) => {
    const router = useRouter();
    const [enterprise, setEnterprise] = useState<Enterprise | null>(null);

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
        <section className="service-form-wrapper">
            <h1 className="text | big bolder">Administrar empresa</h1>
            <EnterpriseEditForm
                enterprise={enterprise}
                editedEnterpriseManager={new EnterpriseManagerEditedAsAdmin()}
            />
            <FormToDisableEnterprise enterprise={enterprise} />
            <FormToDeleteEnterprise enterprise={enterprise} />
        </section>
    );
};

export default EnterprisePanelForAdmin;
