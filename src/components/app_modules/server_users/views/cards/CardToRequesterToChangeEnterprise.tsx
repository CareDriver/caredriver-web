import Building from "@/icons/Building";
import UserIcon from "@/icons/UserIcon";
import { RequestForChangeOfEnterprise } from "@/interfaces/RequestForChangeOfEnterprise";
import "@/styles/components/enterprise.css";

const CardToRequesterToChangeEnterprise = ({
    req,
}: {
    req: RequestForChangeOfEnterprise;
}) => {
    const HAD_AN_ASSOCIATION: boolean = req.oldEnterpriseId !== undefined;

    return (
        <div className="enterprise-item | touchable">
            <h3 className="text | bolder medium-big capitalize | icon-wrapper">
                <UserIcon />
                {req.userName}
            </h3>
            <div className="separator-horizontal"></div>
            <h3 className="text bolder | icon-wrapper">
                <Building />
                {req.newEnterpriseBaseData.name}
            </h3>

            {req.newEnterpriseBaseData.logoUrl && (
                <img
                    className="enterprise-item-logo | margin-top-25"
                    src={req.newEnterpriseBaseData.logoUrl}
                    alt=""
                />
            )}

            <h5 className="text | bolder green | margin-top-15">
                {HAD_AN_ASSOCIATION ? "Cambio de empresa" : "Nueva asociacion"}
            </h5>
        </div>
    );
};

export default CardToRequesterToChangeEnterprise;
