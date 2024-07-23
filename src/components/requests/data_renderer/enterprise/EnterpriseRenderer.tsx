import {
    Enterprise,
    EnterpriseTypeRenderPronounV2,
    ReqEditEnterprise,
} from "@/interfaces/Enterprise";
import ImageRenderer from "../form/ImageRenderer";
import InputData from "../form/InputData";
import MarkRenderer from "../map/MarkRenderer";
import EnterpriseState from "./EnterpriseState";

const EnterpriseRenderer = ({
    enterprise,
}: {
    enterprise: Enterprise | ReqEditEnterprise;
}) => {
    return (
        <div className="form-sub-container">
            <EnterpriseState enterprise={enterprise} />

            <fieldset className="form-section">
                <InputData
                    content={enterprise.name}
                    placeholder={`Nombre ${EnterpriseTypeRenderPronounV2[enterprise.type]}
                `}
                />
                <legend className="form-section-legend">
                    Nombre {EnterpriseTypeRenderPronounV2[enterprise.type]}
                </legend>
            </fieldset>
            <fieldset className="form-section">
                <InputData
                    content={enterprise.phone}
                    placeholder={"número de Telefono"}
                />
                <legend className="form-section-legend">
                    Telefono {EnterpriseTypeRenderPronounV2[enterprise.type]}
                </legend>
            </fieldset>
            <ImageRenderer
                isCircle={true}
                placeholder={`Logo ${EnterpriseTypeRenderPronounV2[enterprise.type]}`}
                url={enterprise.logoImgUrl}
                noFoundDescr={undefined}
            />
            {enterprise.coordinates && (
                <fieldset className="form-section">
                    <span className="text | bold gray-dark">
                        Ubicación {EnterpriseTypeRenderPronounV2[enterprise.type]}
                    </span>
                    <MarkRenderer
                        location={{
                            lat: enterprise.coordinates.latitude,
                            lng: enterprise.coordinates.longitude,
                        }}
                    />
                </fieldset>
            )}
        </div>
    );
};

export default EnterpriseRenderer;
