import UserIcon from "@/icons/UserIcon";
import { ImgWithRef } from "@/interfaces/ImageInterface";
import InputData from "../form/InputData";
import ImageRenderer from "../form/ImageRenderer";

const PersonalDataV2 = ({
    name,
    photo,
    location,
    custom,
}: {
    name: string;
    photo: string | ImgWithRef;
    location: string | undefined;
    custom: { content: string; placeholder: string } | undefined;
}) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <UserIcon />
                Datos Personales
            </h2>

            <div className="form-sub-container">
                <fieldset className="form-section">
                    <InputData content={name} placeholder="Nombre completo" />
                </fieldset>
                <fieldset className="form-section">
                    <InputData content={location} placeholder="Localizacion" />
                </fieldset>
                <ImageRenderer
                    url={photo}
                    placeholder="Foto de Perfil"
                    isCircle={true}
                    noFoundDescr={"El usuario no tiene foto de perfil"}
                />
                {custom && (
                    <InputData
                        content={custom.content}
                        placeholder={custom.placeholder}
                    />
                )}
            </div>
        </div>
    );
};

export default PersonalDataV2;
