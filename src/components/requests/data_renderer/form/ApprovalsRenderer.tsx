import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { UserRequest } from "@/interfaces/UserRequest";
import {
    MIN_NUM_OF_APPROVALS,
    numOfApprovals,
} from "@/utils/requests/services/ServicesRequester";

const ApprovalsRenderer = ({
    serviceReq,
    reviewed,
}: {
    serviceReq: UserRequest;
    reviewed: boolean;
}) => {
    return (
        <h5>
            <PersonCircleCheck />
            {!serviceReq.active && !serviceReq.aproved
                ? "Rechazado"
                : reviewed
                ? "Revisado"
                : `${numOfApprovals(serviceReq)}/${MIN_NUM_OF_APPROVALS} Aprobaciones`}
        </h5>
    );
};

export default ApprovalsRenderer;
