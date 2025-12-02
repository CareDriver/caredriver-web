import { useState } from "react";
import { TextFieldWithSetter } from "../../models/FieldSetters";
import { TextFieldStateHandler } from "../../utils/TextFieldStateHandler";

interface Props {
  field: TextFieldWithSetter;
  legend: string;
  placeholder?: string;
}

const TextField: React.FC<Props> = ({ field, legend, placeholder = "" }) => {
  const stateHandler = new TextFieldStateHandler(field.setter, field.validator);

  const [focused, setFoucesd] = useState<boolean>(false);

  return (
    <fieldset className="form-section">
      <input
        type="text"
        placeholder={!focused ? "" : placeholder}
        autoComplete="off"
        value={field.values.value}
        onChange={stateHandler.changeValue}
        className="form-section-input"
        onFocus={() => setFoucesd(true)}
        onBlur={() => setFoucesd(false)}
      />
      <legend className="form-section-legend">{legend}</legend>
      {field.values.message && <small>* {field.values.message}</small>}
    </fieldset>
  );
};

export default TextField;
