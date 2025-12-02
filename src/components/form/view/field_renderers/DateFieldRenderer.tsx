import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import { Timestamp } from "firebase/firestore";

interface Props {
  date: Timestamp;
  legend: string;
}

const DateFieldRenderer: React.FC<Props> = ({ date, legend }) => {
  return (
    <fieldset className="form-section">
      <span className="form-section-input">{timestampDateInSpanish(date)}</span>
      <legend className="form-section-legend">{legend}</legend>
    </fieldset>
  );
};

export default DateFieldRenderer;
