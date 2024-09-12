import Handshake from "@/icons/Handshake";
import TriangleExclamation from "@/icons/TriangleExclamation";
import { Enterprise } from "@/interfaces/Enterprise";
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
            <h3 className="text | medium center bolder capitalize margin-bottom-15 wrap">
                {cutTextWithDotsByLength(
                    enterprise.name,
                    MAX_LENGTH_FOR_NAMES_DISPLAY,
                )}
            </h3>

            <img
                className="enterprise-item-logo"
                src={enterprise.logoImgUrl.url}
                alt=""
            />
            <div className="margin-top-5 full-width center-wrapper">
                <div className="separator-horizontal"></div>
            </div>
            <h4 className="text center">{enterprise.location}</h4>
            <h4 className="text | center">{enterprise.phone}</h4>
            {enterprise.commition && (
                <h4 className="text | green bolder center icon-wrapper lb green-icon">
                    <Handshake /> Convenio con CareDriver
                </h4>
            )}

            {!enterprise.active && (
                <h4 className="icon-wrapper text | yellow-icon bold yellow | margin-top-15">
                    <TriangleExclamation />
                    Deshabilitado
                </h4>
            )}
        </Link>
    );
};

export default SimpleEnterpriseCard;
