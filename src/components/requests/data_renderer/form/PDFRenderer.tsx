import { ImgWithRef } from "@/interfaces/ImageInterface";
import "@/styles/modules/form.css";
import FieldDeleted from "./FieldDeleted";

const PDFRenderer = ({
    pdf,
    indicator,
}: {
    pdf: ImgWithRef | undefined;
    indicator: string;
}) => {
    return pdf ? (
        <div className="form-section">
            <div className="form-section-uploaded">
                <iframe
                    src={pdf.url}
                    className="form-section-uploaded-file-pdf renderer-pdf"
                ></iframe>
                <legend className="form-section-legend | focused">{indicator}</legend>
            </div>
        </div>
    ) : (
        <FieldDeleted description={"No se encontro el archivo"} />
    );
};

export default PDFRenderer;
