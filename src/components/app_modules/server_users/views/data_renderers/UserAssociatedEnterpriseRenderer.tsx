import EnterpriseRendererAsPopup from "@/components/app_modules/enterprises/views/data_renderers/EnterpriseRendererAsPopup";
import FieldDeleted from "@/components/form/view/field_renderers/FieldDeleted";
import { ServiceType } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import { routeToRenewEnterpriseAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import Link from "next/link";
import { getAssociatedEnterprise } from "../../utils/UserEnterpriseHelper";
import Repeat from "@/icons/Repeat";

interface Props {
    typeOfEnterprise: ServiceType;
    user: UserInterface | undefined;
}

const UserAssociatedEnterpriseRenderer: React.FC<Props> = ({
    typeOfEnterprise,
    user,
}) => {
    const ASSOCIATED_ENTERPRISE: string | undefined = getAssociatedEnterprise(
        user,
        typeOfEnterprise,
    );
    const HAS_ASSOCIATED_ENTERPRISE: boolean =
        ASSOCIATED_ENTERPRISE !== undefined;

    return (
        <>
            {HAS_ASSOCIATED_ENTERPRISE ? (
                <EnterpriseRendererAsPopup
                    enterpriseId={ASSOCIATED_ENTERPRISE}
                />
            ) : (
                <div className="max-width-40">
                    <FieldDeleted description="No estas asociado a ninguna empresa" />
                </div>
            )}

            <Link
                href={routeToRenewEnterpriseAsUser(typeOfEnterprise)}
                className={`small-general-button ${
                    HAS_ASSOCIATED_ENTERPRISE ? "gray" : "yellow"
                } | text bolder | icon-wrapper gray-icon`}
            >
                <Repeat />
                {HAS_ASSOCIATED_ENTERPRISE
                    ? "Cambiar de empresa"
                    : "Asociarse a una empresa"}
            </Link>
        </>
    );
};

export default UserAssociatedEnterpriseRenderer;
