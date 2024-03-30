import ImageUploader from "./ImageUploader";

const SelfieConfirmer = ({
    image,
    setImage,
}: {
    image: string | null;
    setImage: (image: string | null) => void;
}) => {
    return (
        <>
            <h2>Confirmacion del Usuario</h2>
            <p>
                Sube una selfie para verificar que eres el que esta solicitando nuestro
                servicio. Esta foto sera eliminada cuando tu solicitud sera aceptada o
                rechazada
            </p>
            <ImageUploader
                uploader={{
                    image: image,
                    setImage: setImage,
                }}
                content={{
                    indicator: "Selfie",
                }}
            />
        </>
    );
};

export default SelfieConfirmer;
