import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { Enterprise } from "@/interfaces/Enterprise";
import { ServiceType } from "@/interfaces/Services";
import { routeToReviewRequestToEditEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import {
    cutTextWithDotsByLength,
    MAX_LENGTH_FOR_NAMES_DISPLAY,
} from "@/utils/text_helpers/TextCutter";
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
                <h3 className="text | medium center bold capitalize margin-bottom-15 wrap">
                    {cutTextWithDotsByLength(
                        enterprise.name,
                        MAX_LENGTH_FOR_NAMES_DISPLAY,
                    )}
                </h3>
                <h4 className="text | light">{enterprise.phone}</h4>
                <img
                    className="enterprise-req-item-logo"
                    src={enterprise.logoImgUrl.url}
                    alt=""
                />
                <span
                    className="enterprise-req-item-aprove icon-wrapper text 
            | gray-icon gray-dark mb bottom bold"
                >
                    <PersonCircleCheck />
                    0/1
                </span>
            </Link>
        )
    );
};

export default CardToRequestCreateEnterprise;
