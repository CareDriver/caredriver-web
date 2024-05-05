import { ReqEditEnterprise } from "@/interfaces/Enterprise";
import Link from "next/link";

const EnterpriseUpItemReq = ({
    enterprise,
    type,
}: {
    enterprise: ReqEditEnterprise;
    type: "mechanical" | "tow";
}) => {
    return (
        <Link
            href={`/admin/requests/enterprises/edit${
                type === "tow" ? "cranes" : "workshops"
            }/${enterprise.id}`}
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
