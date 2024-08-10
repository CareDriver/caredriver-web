import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { UserRequest } from "@/interfaces/UserRequest";
import {
    MIN_NUM_OF_APPROVALS,
    numOfApprovals,
} from "@/utils/requests/services/ServicesRequester";
import Link from "next/link";

const ServiceItemReq = ({ req, type }: { req: UserRequest; type: string }) => {
    return (
        <Link
            href={`/admin/requests/services/${type}/${req.id}`}
            className="service-req-item | touchable"
        >
            <h3 className="text | bolder medium-big capitalize">{req.newFullName}</h3>
            <h4 className="text | light margin-bottom-15">{req.location}</h4>
            <h5 className="icon-wrapper text | bottom mb bolder gray-icon gray-dark">
                <PersonCircleCheck />
                {numOfApprovals(req)}/{MIN_NUM_OF_APPROVALS}
            </h5>
        </Link>
    );
};

export default ServiceItemReq;
