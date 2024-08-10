import { isValidEmail } from "@/utils/validator/auth/CredentialsValidator";
import { TextFieldSetter, TextFieldWithSetter } from "../../models/FieldSetters";
import { TextField } from "../../models/FormFields";
import { TextFieldStateHandler } from "../../utils/TextFieldStateHandler";

interface Props {
    values: TextField;
    setter: TextFieldSetter;
}

const EmailField: React.FC<Props> = ({ values, setter }) => {
    const stateHandler = new TextFieldStateHandler(
        setter,
        isValidEmail,
    );

    return (
        <fieldset className="form-section">
            <input
                type="email"
                placeholder=""
                value={values.value}
                onChange={stateHandler.changeValue}
                className="form-section-input"
            />
            <legend className="form-section-legend">Correo electronico</legend>
            {values.message && <small>* {values.message}</small>}
        </fieldset>
    );
};

export default EmailField;
