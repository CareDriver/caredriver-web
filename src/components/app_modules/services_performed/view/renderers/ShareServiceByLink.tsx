import { ROLES_TO_VIEW_USER_SERVICES } from "@/components/guards/models/PermissionsByUserRole";
import GuardOfModule from "@/components/guards/views/module_guards/GuardOfModule";
import ShareNodes from "@/icons/ShareNodes";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { UserInterface } from "@/interfaces/UserInterface";
import {
    isLessTime,
    timestampDateInSpanishWithHour,
} from "@/utils/helpers/DateHelper";
import { toast } from "react-toastify";

interface Props {
    service: ServiceRequestInterface;
    reviewerUser: UserInterface;
}

const ShareServiceByLink: React.FC<Props> = ({ reviewerUser, service }) => {
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copiado");
    };

    return service && (
        <GuardOfModule user={reviewerUser} roles={ROLES_TO_VIEW_USER_SERVICES}>
            {service.sharing && isLessTime(service.sharing) && (
                <button
                    onClick={copyLink}
                    className={
                        "column-wrapper small-general-button | hide-content column-right | margin-top-25"
                    }
                >
                    <div className="icon-wrapper | white-icon">
                        <ShareNodes />
                        <span className="text | medium-big bold white">
                            Compartir Link
                        </span>
                    </div>
                    <span className="text | smaller white | small-general-button-content">
                        {timestampDateInSpanishWithHour(service.sharing)}
                    </span>
                </button>
            )}
        </GuardOfModule>
    );
};

export default ShareServiceByLink;
