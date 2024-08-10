import Landmark from "@/icons/Landmark";
import PDFUploader from "./PDFUploader";
import { AttachmentField } from "../../models/FormFields";
import { AttachmentFieldSetter } from "../../models/FieldSetters";

interface Props {
    file: AttachmentField;
    setFile: AttachmentFieldSetter;
}

const PoliceRecordUploader: React.FC<Props> = ({ file, setFile }) => {
    return (
        <div className="form-sub-container | margin-top-25 max-width-60">
            <div>
                <h2 className="text icon-wrapper | lb medium-big bold">
                    <Landmark /> Antecedentes policiales
                </h2>
                <p className="text | light">
                    Sube un <b>PDF</b> de tus Antecedentes policiales.
                </p>
            </div>
            <PDFUploader
                uploader={{
                    file: file,
                    setFile: setFile,
                }}
                content={{
                    id: "pdf-pdf-police-records-uploader",
                    legend: "Antecedentes policiales",
                }}
            />
        </div>
    );
};

export default PoliceRecordUploader;
