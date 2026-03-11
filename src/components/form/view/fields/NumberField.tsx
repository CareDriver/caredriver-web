import { TextFieldWithSetter } from "../../models/FieldSetters";
import { TextFieldStateHandler } from "../../utils/TextFieldStateHandler";

interface Props {
  field: TextFieldWithSetter;
  legend: string;
}

const NumberField: React.FC<Props> = ({ field, legend }) => {
  const stateHandler = new TextFieldStateHandler(field.setter, field.validator);

  return (
    <fieldset className="form-section">
      <input
        type="number"
        inputMode="numeric"
        placeholder=""
        value={field.values.value}
        onChange={stateHandler.changeValue}
        className="form-section-input"
      />
      <legend className="form-section-legend">{legend}</legend>
      {field.values.message && <small>* {field.values.message}</small>}
    </fieldset>
  );
};

export default NumberField;
