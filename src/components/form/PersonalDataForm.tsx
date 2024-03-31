import ImageUploader from "@/components/form/ImageUploader";
import { PersonalData } from "../services/drive/registration/FormModels";
import { Dispatch, SetStateAction } from "react";
import UserIcon from "@/icons/UserIcon";
const PersonalDataForm = ({
    personalData,
    setPersonalData,
}: {
    personalData: PersonalData;
    setPersonalData: Dispatch<SetStateAction<PersonalData>>;
}) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <UserIcon />
                Datos Personales
            </h2>
            <fieldset className="form-section">
                <input
                    type="text"
                    placeholder="Nombre completo"
                    className="form-section-input"
                />
            </fieldset>
            <ImageUploader
                uploader={{
                    image: personalData.photo,
                    setImage: (image: string | null) => {
                        setPersonalData({ ...personalData, photo: image });
                    },
                    isCircle: true,
                }}
                content={{
                    indicator: "Foto de Perfil",
                }}
            />
        </div>
    );
};

export default PersonalDataForm;
