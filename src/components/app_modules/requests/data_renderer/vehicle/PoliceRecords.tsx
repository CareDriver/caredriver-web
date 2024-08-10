import Landmark from "@/icons/Landmark";
import PDFRenderer from "../form/PDFRenderer";
import { ImgWithRef } from "@/interfaces/ImageInterface";

const PoliceRecords = ({ pdf }: { pdf: ImgWithRef | undefined }) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <div>
                <h2 className="text icon-wrapper | lb medium-big bold">
                    <Landmark /> Antecedentes policiales
                </h2>
            </div>
            <PDFRenderer pdf={pdf} indicator="Antecedentes policiales" />
        </div>
    );
};

export default PoliceRecords;
