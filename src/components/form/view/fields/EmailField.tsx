import { isValidEmail } from "@/components/app_modules/users/validators/for_data/CredentialsValidator";
import { TextFieldSetter } from "../../models/FieldSetters";
import { TextField } from "../../models/FormFields";
import { TextFieldStateHandler } from "../../utils/TextFieldStateHandler";

interface Props {
  values: TextField;
  setter: TextFieldSetter;
  autoFill?: "new-email" | "on";
}

const EmailField: React.FC<Props> = ({ values, setter, autoFill }) => {
  const stateHandler = new TextFieldStateHandler(setter, isValidEmail);

  return (
    <fieldset className="form-section">
      <input
        type="email"
        placeholder=""
        value={values.value}
        onChange={stateHandler.changeValue}
        className="form-section-input"
        autoComplete={autoFill ?? "on"}
      />
      <legend className="form-section-legend">Correo electrónico</legend>
      {values.message && <small>* {values.message}</small>}
    </fieldset>
  );
};

export default EmailField;
