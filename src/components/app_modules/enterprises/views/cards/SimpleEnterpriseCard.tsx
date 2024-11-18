import Handshake from "@/icons/Handshake";
import TriangleExclamation from "@/icons/TriangleExclamation";
import { Enterprise } from "@/interfaces/Enterprise";
import { NAME_BUSINESS } from "@/models/Business";
import {
    cutTextWithDotsByLength,
    MAX_LENGTH_FOR_NAMES_DISPLAY,
} from "@/utils/text_helpers/TextCutter";
import Link from "next/link";

const SimpleEnterpriseCard = ({
    enterprise,
    route,
}: {
    enterprise: Enterprise;
    route: string;
}) => {
    return (
        <Link href={route} className="enterprise-item | touchable">
            <div className="enterprise-item-header">
                    <img
                        className="enterprise-item-logo-bg"
                        src={enterprise.logoImgUrl.url}
                        alt=""
                    />
                
                <img
                    className="enterprise-item-logo"
                    src={enterprise.logoImgUrl.url}
                    alt=""
                />
            </div>
            <div className="enterprise-item-body">
                <h3 className="text | bold capitalize wrap">
                    {cutTextWithDotsByLength(
                        enterprise.name,
                        MAX_LENGTH_FOR_NAMES_DISPLAY,
                    )}
                </h3>
                <h4 className="text">{enterprise.location}</h4>
            </div>
            <div className="enterprise-item-footer">
                {!enterprise.active && (
                    <h4 className="text | small circle icon-wrapper yellow-dark-icon">
                        <TriangleExclamation />
                        Deshabilitado
                    </h4>
                )}
                {enterprise.commition && (
                    <h4 className="text | small circle green-light icon-wrapper lb green-light-icon">
                        <Handshake /> Convenio con {NAME_BUSINESS}
                    </h4>
                )}
            </div>
        </Link>
    );
};

export default SimpleEnterpriseCard;
