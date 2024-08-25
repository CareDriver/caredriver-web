import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { Enterprise } from "@/interfaces/Enterprise";
import { ServiceType } from "@/interfaces/Services";
import { routeToReviewRequestToEditEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import Link from "next/link";

const CardToRequestCreateEnterprise = ({
    enterprise,
    type,
}: {
    enterprise: Enterprise;
    type: ServiceType;
}) => {
    return (
        enterprise.id && (
            <Link
                href={routeToReviewRequestToEditEnterpriseAsAdmin(
                    type,
                    enterprise.id,
                )}
                className="enterprise-req-item | touchable"
            >
                <h3 className="enterprise-req-item-title">{enterprise.name}</h3>
                <h4 className="text | light">{enterprise.phone}</h4>
                <img
                    className="enterprise-req-item-logo"
                    src={enterprise.logoImgUrl.url}
                    alt=""
                />
                <span
                    className="enterprise-req-item-aprove icon-wrapper text 
            | gray-icon gray-dark mb bottom bolder"
                >
                    <PersonCircleCheck />
                    0/1
                </span>
            </Link>
        )
    );
};

export default CardToRequestCreateEnterprise;
