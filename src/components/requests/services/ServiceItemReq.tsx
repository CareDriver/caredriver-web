import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { UserRequest } from "@/interfaces/UserRequest";
import {
    MIN_NUM_OF_APPROVALS,
    numOfApprovals,
} from "@/utils/requests/services/ServicesRequester";
import Link from "next/link";

const ServiceItemReq = ({ req, type }: { req: UserRequest; type: string }) => {
    return (
        <Link href={`/admin/requests/services/${type}/${req.id}`}>
            <h3>{req.newFullName}</h3>
            <h4>{req.location}</h4>
            <h5>
                <PersonCircleCheck />
                {numOfApprovals(req)}/{MIN_NUM_OF_APPROVALS}
            </h5>
        </Link>
    );
};

export default ServiceItemReq;
