import PersonQuestion from "@/icons/PersonQuestion";
import ImageUploader from "./ImageUploader";
import { PhotoField } from "../services/FormModels";

const SelfieConfirmer = ({
    image,
    setImage,
}: {
    image: PhotoField;
    setImage: (image: PhotoField) => void;
}) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <div>
                <h2 className="text icon-wrapper | lb medium-big bold">
                    <PersonQuestion /> Confirmacion del Usuario
                </h2>
                <p className="text | normal">
                    Sube una selfie para verificar que eres el que esta solicitando
                    nuestro servicio. Esta foto sera eliminada cuando tu solicitud sera
                    aceptada o rechazada
                </p>
            </div>
            <ImageUploader
                uploader={{
                    image: image,
                    setImage: setImage,
                }}
                content={{
                    id: "selfie-confirmer-uploader",
                    indicator: "Selfie",
                    isCircle: true,
                }}
            />
        </div>
    );
};

export default SelfieConfirmer;
