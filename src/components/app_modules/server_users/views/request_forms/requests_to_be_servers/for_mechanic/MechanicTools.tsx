import ScrewdriverWrench from "@/icons/ScrewdriverWrench";
import { isValidMechanicTools } from "@/components/app_modules/server_users/validators/for_data/MechanicValidator";
import { TextField as TextFieldForForm } from "@/components/form/models/FormFields";
import TextField from "@/components/form/view/fields/TextField";

const MechanicTools = ({
  tools,
  setTools,
}: {
  tools: TextFieldForForm;
  setTools: (d: TextFieldForForm) => void;
}) => {
  return (
    <div className="form-sub-container | margin-top-25">
      <div>
        <h2 className="text icon-wrapper | medium-big bold">
          <ScrewdriverWrench />
          Herramientas de trabajo
        </h2>
        <p className="text | light">
          Por favor menciona las herramientas de trabajo que tienes para
          trabajar como mecánico
        </p>
      </div>
      <TextField
        field={{
          values: tools,
          setter: setTools,
          validator: isValidMechanicTools,
        }}
        legend="Herramientas"
      />
    </div>
  );
};

export default MechanicTools;
