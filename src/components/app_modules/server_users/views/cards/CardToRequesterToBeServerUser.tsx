import { UserRequest } from "@/interfaces/UserRequest";
import {
  MIN_NUM_OF_APPROVALS,
  numOfApprovals,
} from "@/components/app_modules/server_users/api/ServicesRequester";
import Link from "next/link";
import { routeToReviewRequestToBeUserServerAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";
import { ServiceType } from "@/interfaces/Services";
import { cutTextWithDotsByLength } from "@/utils/text_helpers/TextCutter";

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
      <h3 className="text | bold big-medium-v3 capitalize wrap">
        {cutTextWithDotsByLength(req.newFullName, 20)}
      </h3>
      <h4 className="text | light margin-bottom-15">{req.location}</h4>
      <h5 className="text | small circle purple">
        {numOfApprovals(req)}/{MIN_NUM_OF_APPROVALS} Aprobaciones
      </h5>
    </Link>
  );
};

export default CardToRequesterToBeServerUser;
