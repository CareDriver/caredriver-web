import Landmark from "@/icons/Landmark";
import PDFRenderer from "../../../../../form/view/field_renderers/PDFRenderer";
import { RefAttachment } from "@/components/form/models/RefAttachment";

const PoliceRecordsRenderer = ({ pdf }: { pdf: RefAttachment | undefined }) => {
  return (
    <div className="form-sub-container | margin-top-25">
      <div>
        <h2 className="text icon-wrapper | lb medium-big bold">
          <Landmark /> Antecedentes policiales
        </h2>
      </div>
      <PDFRenderer pdf={pdf} legend="Antecedentes policiales" />
    </div>
  );
};

export default PoliceRecordsRenderer;
