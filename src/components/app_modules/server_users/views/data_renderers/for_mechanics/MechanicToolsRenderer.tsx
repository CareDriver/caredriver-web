import ScrewdriverWrench from "@/icons/ScrewdriverWrench";
import FieldDeleted from "../../../../../form/view/field_renderers/FieldDeleted";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";

const MechanicToolsRenderer = ({ tools }: { tools: string | undefined }) => {
  return (
    <div className="form-sub-container | margin-top-25">
      <h2 className="text icon-wrapper | medium-big bold">
        <ScrewdriverWrench />
        Herramientas de trabajo
      </h2>
      {tools ? (
        <TextFieldRenderer content={tools} legend="Herramientas" />
      ) : (
        <FieldDeleted
          description={
            "El usuario que solicito ser mecánico no especifico sus herramientas de trabajo"
          }
        />
      )}
    </div>
  );
};

export default MechanicToolsRenderer;
