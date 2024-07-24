import TriangleExclamation from "@/icons/TriangleExclamation";
import { Enterprise } from "@/interfaces/Enterprise";
import Link from "next/link";

const EnterpriseItem = ({
    enterprise,
    route,
}: {
    enterprise: Enterprise;
    route: string;
}) => {
    return (
        <Link href={route} className="enterprise-item | touchable">
            <h3 className="enterprise-item-title">{enterprise.name}</h3>
            <h4 className="text | light small">{enterprise.phone}</h4>
            <img
                className="enterprise-item-logo | margin-top-25"
                src={enterprise.logoImgUrl.url}
                alt=""
            />
            {!enterprise.active && (
                <h4 className="icon-wrapper text | yellow-icon bold yellow | margin-top-15">
                    <TriangleExclamation />
                    Deshabilitado
                </h4>
            )}
        </Link>
    );
};

export default EnterpriseItem;
