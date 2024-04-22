import UserIcon from "@/icons/UserIcon";
import InputData from "../InputData";
import ImageRenderer from "../ImageRenderer";
import { ImgWithRef } from "@/interfaces/ImageInterface";
import { getUrl } from "@/utils/validator/ImageValidator";

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
                    url={getUrl(photo)}
                    placeholder="Foto de Perfil"
                    isCircle={true}
                />
            </div>
        </div>
    );
};

export default PersonalData;
