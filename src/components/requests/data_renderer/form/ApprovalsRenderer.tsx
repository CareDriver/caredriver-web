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
        <h5
            className={`icon-wrapper text | ${
                serviceReq.active === true
                    ? "green-icon green"
                    : serviceReq.aproved === true
                    ? "green-icon green"
                    : "red-icon red"
            } bold mb bottom margin-bottom-15`}
        >
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
