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
                    <InputData content={name} placeholder="" />
                    <legend className="form-section-legend">Nombre completo</legend>
                </fieldset>
                <fieldset className="form-section">
                    <InputData content={location} placeholder="" />
                    <legend className="form-section-legend">Localización</legend>
                </fieldset>
                <fieldset className="form-section">
                    <ImageRenderer
                        url={photo}
                        placeholder=""
                        isCircle={true}
                        noFoundDescr={"El usuario no tiene foto de perfil"}
                    />
                    <legend className="form-section-legend | focused">
                        Foto de Perfil
                    </legend>
                </fieldset>
                {custom && (
                    <fieldset className="form-section">
                        <InputData
                            content={custom.content}
                            placeholder={custom.placeholder}
                        />
                        <legend className="form-section-legend">
                            {custom.placeholder}
                        </legend>
                    </fieldset>
                )}
            </div>
        </div>
    );
};

export default PersonalDataV2;
