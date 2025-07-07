import PersonQuestion from "@/icons/PersonQuestion";
import SelfieUploader from "../attachment_fields/SelfieUploader";
import { AttachmentField } from "../../models/FormFields";
import { AttachmentFieldSetter } from "../../models/FieldSetters";

interface Props {
  image: AttachmentField;
  setImage: AttachmentFieldSetter;
}

const SelfieSection: React.FC<Props> = ({ image, setImage }) => {
  return (
    <div className="form-sub-container | margin-top-25">
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
      <SelfieUploader
        uploader={{
          image: image,
          setImage: setImage,
        }}
        content={{
          id: "selfie-confirmer-uploader",
          legend: "Selfie",
          imageInCircle: true,
        }}
      />
    </div>
  );
};

export default SelfieSection;
