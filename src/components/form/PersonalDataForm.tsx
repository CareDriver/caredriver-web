import ImageUploader from "@/components/form/ImageUploader";
import { PersonalData } from "../services/drive/registration/FormModels";
import { Dispatch, SetStateAction } from "react";

const PersonalDataForm = ({
    personalData,
    setPersonalData,
}: {
    personalData: PersonalData;
    setPersonalData: Dispatch<SetStateAction<PersonalData>>;
}) => {
    return (
        <>
            <h2>Datos Personales</h2>
            <fieldset>
                <input type="text" placeholder="Nombre completo" />
            </fieldset>
            <ImageUploader
                uploader={{
                    image: personalData.photo,
                    setImage: (image: string | null) => {
                        setPersonalData({ ...personalData, photo: image });
                    },
                }}
                content={{
                    indicator: "Foto de Perfil",
                }}
            />
        </>
    );
};

export default PersonalDataForm;
