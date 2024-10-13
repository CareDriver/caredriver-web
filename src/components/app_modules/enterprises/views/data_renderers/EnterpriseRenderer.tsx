import { Enterprise, ReqEditEnterprise } from "@/interfaces/Enterprise";
import ImageRenderer from "../../../../form/view/field_renderers/ImageRenderer";
import MapMarkRenderer from "../../../../form/view/field_renderers/MapMarkRenderer";
import EnterpriseStatus from "../modules/EnterpriseStatus";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import { ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE } from "../../utils/EnterpriseSpanishTranslator";

const EnterpriseRenderer = ({
    enterprise,
}: {
    enterprise: Enterprise | ReqEditEnterprise;
}) => {
    return (
        <div className="form-sub-container">
            <EnterpriseStatus enterprise={enterprise} />
            <TextFieldRenderer
                content={enterprise.name}
                legend={`Nombre ${
                    ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE[
                        enterprise.type
                    ]
                }`}
            />
            <TextFieldRenderer
                content={enterprise.description}
                legend={`Descripcion ${
                    ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE[
                        enterprise.type
                    ]
                }`}
            />
            <TextFieldRenderer
                content={enterprise.phone}
                legend={`Teléfono ${
                    ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE[
                        enterprise.type
                    ]
                }`}
            />
            <ImageRenderer
                imageInCircle={true}
                content={{
                    image: enterprise.logoImgUrl,
                    legend: `Logo ${
                        ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE[
                            enterprise.type
                        ]
                    }`,
                }}
            />
            <TextFieldRenderer
                content={enterprise.location}
                legend={`Ubicación ${
                    ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE[
                        enterprise.type
                    ]
                }`}
            />
            {enterprise.coordinates && (
                <fieldset className="form-section">
                    <span className="text | bolder">
                        Ubicación geográfica{" "}
                        {
                            ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE[
                                enterprise.type
                            ]
                        }
                    </span>
                    <MapMarkRenderer location={enterprise.coordinates} />
                </fieldset>
            )}
        </div>
    );
};

export default EnterpriseRenderer;
