import { DateFieldWithSetter } from "../../models/FieldSetters";
import { DateFieldStateHandler } from "../../utils/DateFieldStateHandler";

interface Props {
    field: DateFieldWithSetter;
    legend: string;
}

const DateField: React.FC<Props> = ({ field, legend }) => {
    const stateHandler = new DateFieldStateHandler(
        field.setter,
        field.validator,
    );

    return (
        <fieldset className="form-section">
            <input
                type="date"
                name="expirationDate"
                onChange={stateHandler.changeValue}
                className="form-section-input"
            />
            <legend className="form-section-legend">{legend}</legend>
            {field.values.message && <small>{field.values.message}</small>}
        </fieldset>
    );
};

export default DateField;
