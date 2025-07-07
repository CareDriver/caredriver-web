import { TextFieldWithSetter } from "../../models/FieldSetters";
import { TextFieldStateHandler } from "../../utils/TextFieldStateHandler";

interface Props {
  field: TextFieldWithSetter;
  legend: string;
}

const TextField: React.FC<Props> = ({ field, legend }) => {
  const stateHandler = new TextFieldStateHandler(field.setter, field.validator);

  return (
    <fieldset className="form-section">
      <input
        type="text"
        placeholder=""
        autoComplete="off"
        value={field.values.value}
        onChange={stateHandler.changeValue}
        className="form-section-input"
      />
      <legend className="form-section-legend">{legend}</legend>
      {field.values.message && <small>* {field.values.message}</small>}
    </fieldset>
  );
};

export default TextField;
