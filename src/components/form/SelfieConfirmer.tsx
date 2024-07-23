import PersonQuestion from "@/icons/PersonQuestion";
import { PhotoField } from "../services/FormModels";
import CameraUploader from "./CameraUploader";

const SelfieConfirmer = ({
    image,
    setImage,
}: {
    image: PhotoField;
    setImage: (image: PhotoField) => void;
}) => {
    return (
        <div className="form-sub-container | margin-top-25 max-width-60">
            <div>
                <h2 className="text icon-wrapper | lb medium-big bold">
                    <PersonQuestion /> Confirmación del usuario
                </h2>
                <p className="text | light">
                    Sube una selfie para verificar que eres quien está solicitando nuestro
                    servicio. Esta foto será eliminada cuando tu solicitud sea aceptada o
                    rechazada.
                </p>
            </div>
            <CameraUploader
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
