import { Enterprise, EnterpriseTypeRender, ReqEditEnterprise } from "@/interfaces/Enterprise";
import ImageRenderer from "../form/ImageRenderer";
import InputData from "../form/InputData";
import MarkRenderer from "../map/MarkRenderer";

const EnterpriseRenderer = ({ enterprise }: { enterprise: Enterprise | ReqEditEnterprise }) => {
    const title = (enterprise.type === "tow" ? "de la" : "del").concat(
        EnterpriseTypeRender[enterprise.type],
    );

    return (
        <>
            <InputData
                content={enterprise.name}
                placeholder={`Nombre ${title}
                `}
            />
            <InputData content={enterprise.phone} placeholder={"Numero de Telefono"} />
            <ImageRenderer
                isCircle={true}
                placeholder="Logo"
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
        </>
    );
};

export default EnterpriseRenderer;
