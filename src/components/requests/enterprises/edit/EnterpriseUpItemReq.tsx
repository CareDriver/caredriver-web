import { ReqEditEnterprise } from "@/interfaces/Enterprise";
import { getRoute } from "@/utils/parser/ToSpanishEnterprise";
import Link from "next/link";

const EnterpriseUpItemReq = ({
    enterprise,
    type,
}: {
    enterprise: ReqEditEnterprise;
    type: "mechanical" | "tow" | "laundry";
}) => {
    return (
        <Link
            href={`/admin/requests/enterprises/edit${getRoute(type)}/${enterprise.id}`}
            className="enterprise-req-item | touchable"
        >
            <h3 className="enterprise-req-item-title">{enterprise.name}</h3>
            <h4 className="text | light">{enterprise.phone}</h4>
            <img
                className="enterprise-req-item-logo"
                src={enterprise.logoImgUrl.url}
                alt=""
            />
        </Link>
    );
};

export default EnterpriseUpItemReq;
