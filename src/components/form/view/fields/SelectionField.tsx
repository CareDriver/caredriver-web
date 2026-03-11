import ChevronDown from "@/icons/ChevronDown";
import { OptionFieldSetter } from "../../models/FieldSetters";
import { ChangeEvent } from "react";

interface Props {
  field: {
    value: string;
    setter: OptionFieldSetter;
  };
  options: string[];
  legend: string;
  optionTranslator?: (option: string) => string;
}

const SelectionField: React.FC<Props> = ({
  field,
  options,
  legend,
  optionTranslator,
}) => {
  const changeOption = (e: ChangeEvent<HTMLSelectElement>) => {
    let newOption = e.target.value;
    field.setter(newOption);
  };

  return (
    <fieldset className="form-section | select-item">
      <ChevronDown />
      <select
        className="form-section-input"
        onChange={changeOption}
        value={field.value}
      >
        {options.map((option, i) => (
          <option key={`option-string-${i}`} value={option}>
            {optionTranslator ? optionTranslator(option) : option}
          </option>
        ))}
      </select>
      <legend className="form-section-legend">{legend}</legend>
    </fieldset>
  );
};

export default SelectionField;
