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
        >
            <h3>{enterprise.name}</h3>
            <img src={enterprise.logoImgUrl.url} alt="" />
        </Link>
    );
};

export default EnterpriseItem;
