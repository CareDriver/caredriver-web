import { Enterprise } from "@/interfaces/Enterprise";
import Link from "next/link";

const EnterpriseItemReq = ({
    enterprise,
    type,
}: {
    enterprise: Enterprise;
    type: "mechanical" | "tow";
}) => {
    return (
        <Link
            href={`/admin/requests/enterprises/${
                type === "tow" ? "cranes" : "workshops"
            }/${enterprise.id}`}
            className="enterprise-item"
        >
            <h3 className="enterprise-item-title">{enterprise.name}</h3>
            <img
                className="enterprise-item-logo"
                src={enterprise.logoImgUrl.url}
                alt=""
            />
        </Link>
    );
};

export default EnterpriseItemReq;
