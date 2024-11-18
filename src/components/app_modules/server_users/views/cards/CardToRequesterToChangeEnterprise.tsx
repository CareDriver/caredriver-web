import Building from "@/icons/Building";
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
            <div className="enterprise-item-header">
                <img
                    className="enterprise-item-logo-bg"
                    src={req.newEnterpriseBaseData.logoUrl}
                    alt=""
                />

                <img
                    className="enterprise-item-logo"
                    src={req.newEnterpriseBaseData.logoUrl}
                    alt=""
                />
            </div>
            <div className="enterprise-item-body">
                <h3 className="text | wrap medium capitalize">
                    <b>Usuario: </b>
                    {cutTextWithDotsByLength(
                        req.userName,
                        MAX_LENGTH_FOR_NAMES_DISPLAY,
                    )}
                </h3>
                <h3 className="text | capitalize wrap">
                    <b>Empresa: </b>
                    {cutTextWithDotsByLength(
                        req.newEnterpriseBaseData.name,
                        MAX_LENGTH_FOR_NAMES_DISPLAY,
                    )}
                </h3>
            </div>
            <div className="enterprise-item-footer">
                <h5
                    className={`text | small circle ${
                        !HAD_AN_ASSOCIATION && "purple"
                    }`}
                >
                    {HAD_AN_ASSOCIATION
                        ? "Cambio de empresa"
                        : "Nueva asociación"}
                </h5>
            </div>
        </div>
    );
};

export default CardToRequesterToChangeEnterprise;
