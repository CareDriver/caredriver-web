import { Enterprise } from "@/interfaces/Enterprise";
import Link from "next/link";

const EnterpriseItem = ({
    type,
    enterprise,
}: {
    type: string;
    enterprise: Enterprise;
}) => {
    return (
        <Link
            href={`/enterprise/${type === "tow" ? "cranes" : "workshops"}/edit/${
                enterprise.id
            }`}
            className="enterprise-item"
        >
            <h3 className="enterprise-item-title">{enterprise.name}</h3>
            <img className="enterprise-item-logo" src={enterprise.logoImgUrl.url} alt="" />
        </Link>
    );
};

export default EnterpriseItem;
