import { Enterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "./EnterpriseRenderer";
import Building from "@/icons/Building";
import FieldDeleted from "../../../../form/view/field_renderers/FieldDeleted";

const CraneEnterpriseRenderer = ({
  crane,
}: {
  crane: Enterprise | undefined;
}) => {
  return (
    <div className="form-sub-container | margin-top-25">
      <h2 className="text icon-wrapper | medium-big bold">
        <Building />
        Empresa Operadora de Grúa
      </h2>
      {crane ? (
        <EnterpriseRenderer enterprise={crane} />
      ) : (
        <FieldDeleted description="Empresa operadora de grúas no encontrada" />
      )}
    </div>
  );
};

export default CraneEnterpriseRenderer;
