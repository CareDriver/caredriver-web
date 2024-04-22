import UserIcon from "@/icons/UserIcon";
import InputData from "./InputData";
import ImageRenderer from "./ImageRenderer";
import { ImgWithRef } from "@/interfaces/ImageInterface";

const PersonalData = ({
    name,
    photo,
    location,
}: {
    name: string;
    photo: string | ImgWithRef;
    location: string | undefined;
}) => {
    return (
        <div className="form-sub-container | margin-top-25 max-width-60">
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
                    url={typeof photo === "string" ? photo : photo.url}
                    placeholder="Foto de Perfil"
                    isCircle={true}
                />
            </div>
        </div>
    );
};

export default PersonalData;
