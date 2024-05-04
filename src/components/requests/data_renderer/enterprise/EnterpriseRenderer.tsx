import {
    Enterprise,
    EnterpriseTypeRender,
    ReqEditEnterprise,
} from "@/interfaces/Enterprise";
import ImageRenderer from "../form/ImageRenderer";
import InputData from "../form/InputData";
import MarkRenderer from "../map/MarkRenderer";

const EnterpriseRenderer = ({
    enterprise,
}: {
    enterprise: Enterprise | ReqEditEnterprise;
}) => {
    const title = (enterprise.type === "tow" ? "de la " : "del ").concat(
        EnterpriseTypeRender[enterprise.type],
    );

    return (
        <div className="form-sub-container">
            <fieldset className="form-section">
                <InputData
                    content={enterprise.name}
                    placeholder={`Nombre ${title}
                `}
                />
                <legend className="form-section-legend">Nombre {title}</legend>
            </fieldset>
            <fieldset className="form-section">
                <InputData
                    content={enterprise.phone}
                    placeholder={"Numero de Telefono"}
                />
                <legend className="form-section-legend">Telefono {title}</legend>
            </fieldset>
            <ImageRenderer
                isCircle={true}
                placeholder={`Logo ${title}`}
                url={enterprise.logoImgUrl}
                noFoundDescr={undefined}
            />
            {enterprise.coordinates && (
                <fieldset className="form-section">
                    <span className="text | bold gray-dark">Ubicacion {title}</span>
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
