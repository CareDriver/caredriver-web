import { ReqEditEnterprise } from "@/interfaces/Enterprise";
import { routeToReviewRequestToEditEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import Link from "next/link";

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
                className="enterprise-req-item | touchable"
            >
                <h3 className="enterprise-req-item-title">{enterprise.name}</h3>
                <h4 className="text | light">{enterprise.phone}</h4>
                <img
                    className="enterprise-req-item-logo"
                    src={enterprise.logoImgUrl.url}
                    alt=""
                />
            </Link>
        )
    );
};

export default CardToRequestEditEnterprise;
