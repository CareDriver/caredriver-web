import TriangleExclamation from "@/icons/TriangleExclamation";
import { ReqEditEnterprise } from "@/interfaces/Enterprise";
import { routeToReviewRequestToEditEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import Link from "next/link";
import "@/styles/components/enterprise.css";
import {
    cutTextWithDotsByLength,
    MAX_LENGTH_FOR_NAMES_DISPLAY,
} from "@/utils/text_helpers/TextCutter";

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
                <div className="enterprise-item-header">
                    <img
                        className="enterprise-item-logo-bg"
                        src={enterprise.logoImgUrl.url}
                        alt=""
                    />

                    <img
                        className="enterprise-item-logo"
                        src={enterprise.logoImgUrl.url}
                        alt=""
                    />
                </div>
                <div className="enterprise-item-body">
                    <h3 className="text | bold capitalize wrap">
                        {cutTextWithDotsByLength(
                            enterprise.name,
                            MAX_LENGTH_FOR_NAMES_DISPLAY,
                        )}
                    </h3>
                    <h4 className="text">{enterprise.location}</h4>
                </div>
                <div className="enterprise-item-footer">
                    {!enterprise.active && (
                        <h4 className="icon-wrapper text | yellow-icon bold yellow | margin-top-15">
                            <TriangleExclamation />
                            Deshabilitado
                        </h4>
                    )}
                </div>
            </Link>
        )
    );
};

export default CardToRequestEditEnterprise;
