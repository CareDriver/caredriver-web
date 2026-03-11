import { RefAttachment } from "@/components/form/models/RefAttachment";
import "@/styles/modules/form.css";
import FieldDeleted from "./FieldDeleted";

const PDFRenderer = ({
  pdf,
  legend,
}: {
  pdf: RefAttachment | undefined;
  legend: string;
}) => {
  return pdf ? (
    <div className="form-section">
      <div className="form-section-uploaded">
        <iframe
          src={pdf.url}
          className="form-section-uploaded-file-pdf renderer-pdf"
        ></iframe>
        <legend className="form-section-legend | focused">{legend}</legend>
      </div>
    </div>
  ) : (
    <FieldDeleted description={"No se encontró el archivo"} />
  );
};

export default PDFRenderer;
