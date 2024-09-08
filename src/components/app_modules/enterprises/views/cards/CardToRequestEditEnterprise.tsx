import TriangleExclamation from "@/icons/TriangleExclamation";
import { ReqEditEnterprise } from "@/interfaces/Enterprise";
import { routeToReviewRequestToEditEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import Link from "next/link";
import "@/styles/components/enterprise.css";

const CardToRequestEditEnterprise = ({
    enterprise,
}: {
    enterprise: ReqEditEnterprise;
}) => {
    return (
        enterprise.id && (
            <Link
                href={routeToReviewRequestToEditEnterpriseAsAdmin(
                    enterprise.type,
                    enterprise.id,
                )}
                className="enterprise-item | touchable"
            >
                <h3 className="text | medium center bolder capitalize margin-bottom-15">
                    {enterprise.name}
                </h3>

                <img
                    className="enterprise-item-logo"
                    src={enterprise.logoImgUrl.url}
                    alt=""
                />
                <div className="margin-top-5 full-width center-wrapper">
                    <div className="separator-horizontal"></div>
                </div>
                <h4 className="text center">{enterprise.location}</h4>
                <h4 className="text | center">{enterprise.phone}</h4>

                {!enterprise.active && (
                    <h4 className="icon-wrapper text | yellow-icon bold yellow | margin-top-15">
                        <TriangleExclamation />
                        Deshabilitado
                    </h4>
                )}
            </Link>
        )
    );
};

export default CardToRequestEditEnterprise;
