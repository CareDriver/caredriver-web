import PersonQuestion from "@/icons/PersonQuestion";
import ImageUploader from "./ImageUploader";

const SelfieConfirmer = ({
    image,
    setImage,
}: {
    image: string | null;
    setImage: (image: string | null) => void;
}) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <div>
                <h2 className="text icon-wrapper | medium-big bold">
                    <PersonQuestion /> Confirmacion del Usuario
                </h2>
                <p>
                    Sube una selfie para verificar que eres el que esta solicitando
                    nuestro servicio. Esta foto sera eliminada cuando tu solicitud sera
                    aceptada o rechazada
                </p>
            </div>
            <ImageUploader
                uploader={{
                    image: image,
                    setImage: setImage,
                    isCircle: true,
                }}
                content={{
                    indicator: "Selfie",
                }}
            />
        </div>
    );
};

export default SelfieConfirmer;
