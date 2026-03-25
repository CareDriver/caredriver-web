import Landmark from "@/icons/Landmark";
import PDFUploader from "./PDFUploader";
import { AttachmentField } from "../../models/FormFields";
import { AttachmentFieldSetter } from "../../models/FieldSetters";

interface Props {
  file: AttachmentField;
  setFile: AttachmentFieldSetter;
  allowByChat?: boolean;
  setAllowByChat?: (value: boolean) => void;
}

const PoliceRecordUploader: React.FC<Props> = ({
  file,
  setFile,
  allowByChat,
  setAllowByChat,
}) => {
  return (
    <div className="form-sub-container | margin-top-25 ">
      <div>
        <h2 className="text icon-wrapper | lb medium-big bold">
          <Landmark /> Antecedentes policiales
        </h2>
        <p className="text | light">
          Sube un <b>PDF</b> de tus Antecedentes policiales para continuar con
          la solicitud.
        </p>
        <p className="text | light margin-top-10">
          Si tu licencia fue emitida hace menos de 4 meses, también aceptamos un
          documento reciente de antecedentes aunque ya no esté vigente.
        </p>
        {allowByChat && (
          <p className="text | green bold margin-top-10">
            Confirmaste que enviarás antecedentes por chat.
          </p>
        )}
      </div>
      <PDFUploader
        uploader={{
          file: file,
          setFile: (nextValue) => {
            if (nextValue.value && setAllowByChat) {
              setAllowByChat(false);
            }
            setFile(nextValue);
          },
        }}
        content={{
          id: "pdf-pdf-police-records-uploader",
          legend: "Antecedentes policiales",
        }}
      />
      <div className="separator-horizontal"></div>
    </div>
  );
};

export default PoliceRecordUploader;
