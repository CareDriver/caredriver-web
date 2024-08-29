import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { BrandingRequest } from "@/interfaces/BrandingInterface";
import { routeToNoFound } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";
import Link from "next/link";

const UserCardWithBranding = ({
    brandingReq,
}: {
    brandingReq: BrandingRequest;
}) => {
    return (
        <Link
            href={routeToNoFound()}
            className="personal-data-req-item | fill-image touchable"
        >
            <h3 className="personal-data-req-item-name">
                {brandingReq.userName}
            </h3>
            <img src={brandingReq.brandingImage.url} alt="" />
            <span
                className="icon-wrapper personal-data-req-item-aprove text |
            green-icon green bold"
            >
                <PersonCircleCheck />
                0/1
            </span>
        </Link>
    );
};

export default UserCardWithBranding;
