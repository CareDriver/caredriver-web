import Building from "@/icons/Building";
import UserIcon from "@/icons/UserIcon";
import { RequestForChangeOfEnterprise } from "@/interfaces/RequestForChangeOfEnterprise";
import "@/styles/components/enterprise.css";
import {
    cutTextWithDotsByLength,
    MAX_LENGTH_FOR_NAMES_DISPLAY,
} from "@/utils/text_helpers/TextCutter";

const CardToRequesterToChangeEnterprise = ({
    req,
}: {
    req: RequestForChangeOfEnterprise;
}) => {
    const HAD_AN_ASSOCIATION: boolean = req.oldEnterpriseId !== undefined;

    return (
        <div className="enterprise-item | touchable">
            <h3 className="text | bolder wrap medium-big capitalize | icon-wrapper">
                <UserIcon />
                {cutTextWithDotsByLength(
                    req.userName,
                    MAX_LENGTH_FOR_NAMES_DISPLAY,
                )}
            </h3>
            <div className="separator-horizontal"></div>
            <h3 className="text | medium center bolder capitalize margin-bottom-15 wrap | icon-wrapper">
                <Building />
                {cutTextWithDotsByLength(
                    req.newEnterpriseBaseData.name,
                    MAX_LENGTH_FOR_NAMES_DISPLAY,
                )}
            </h3>

            {req.newEnterpriseBaseData.logoUrl && (
                <img
                    className="enterprise-item-logo | margin-top-25"
                    src={req.newEnterpriseBaseData.logoUrl}
                    alt=""
                />
            )}

            <h5 className="text | bolder green | margin-top-15">
                {HAD_AN_ASSOCIATION ? "Cambio de empresa" : "Nueva asociación"}
            </h5>
        </div>
    );
};

export default CardToRequesterToChangeEnterprise;
