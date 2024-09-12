import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { UserRequest } from "@/interfaces/UserRequest";
import {
    MIN_NUM_OF_APPROVALS,
    numOfApprovals,
} from "@/components/app_modules/server_users/api/ServicesRequester";
import Link from "next/link";
import { routeToReviewRequestToBeUserServerAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";
import { ServiceType } from "@/interfaces/Services";
import {
    cutTextWithDotsByLength,
    MAX_LENGTH_FOR_NAMES_DISPLAY,
} from "@/utils/text_helpers/TextCutter";

const CardToRequesterToBeServerUser = ({
    req,
    type,
}: {
    req: UserRequest;
    type: ServiceType;
}) => {
    return (
        <Link
            href={routeToReviewRequestToBeUserServerAsAdmin(type, req.id)}
            className="service-req-item | touchable"
        >
            <h3 className="text | bolder medium-big capitalize wrap">
                {cutTextWithDotsByLength(
                    req.newFullName,
                    MAX_LENGTH_FOR_NAMES_DISPLAY,
                )}
            </h3>
            <h4 className="text | light margin-bottom-15">{req.location}</h4>
            <h5 className="icon-wrapper text | bottom mb bolder gray-icon gray-dark">
                <PersonCircleCheck />
                {numOfApprovals(req)}/{MIN_NUM_OF_APPROVALS} Aprobaciones
            </h5>
        </Link>
    );
};

export default CardToRequesterToBeServerUser;
