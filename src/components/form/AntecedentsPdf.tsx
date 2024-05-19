import Landmark from "@/icons/Landmark";
import PDFUploader, { FileSetter, PDFField } from "./PDFUploader";

const AntecedentsPdf = ({ file, setFile }: { file: PDFField; setFile: FileSetter }) => {
    return (
        <div className="form-sub-container | margin-top-25 max-width-60">
            <div>
                <h2 className="text icon-wrapper | lb medium-big bold">
                    <Landmark /> Antecedentes Policiales
                </h2>
                <p className="text | light">
                    Sube un <b>PDF</b> de tus antecedentes policiales.
                </p>
            </div>
            <PDFUploader
                uploader={{
                    file: file,
                    setFile: setFile,
                }}
                content={{
                    id: "pdf-pdf-police-records-uploader",
                    indicator: "Antecedentes policiales",
                }}
            />
        </div>
    );
};

export default AntecedentsPdf;
