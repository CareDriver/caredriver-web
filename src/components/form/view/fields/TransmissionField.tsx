import ChevronDown from "@/icons/ChevronDown";
import { TransmitionFieldSetter } from "../../models/FieldSetters";
import { ChangeEvent } from "react";
import { VehicleTransmission } from "@/interfaces/VehicleInterface";
import {
    TRANSMITION_TO_SPANISH,
    VEHICLE_TRANSMISSIONS,
} from "@/components/app_modules/server_users/models/VehicleFields";

interface Props {
    transmission: VehicleTransmission;
    setter: TransmitionFieldSetter;
}

const TransmissionField: React.FC<Props> = ({ transmission, setter }) => {
    const changeChoice = (e: ChangeEvent<HTMLSelectElement>) => {
        let newTransmission = e.target.value as VehicleTransmission;
        setter(newTransmission);
    };

    return (
        <fieldset className="form-section | select-item">
            <ChevronDown />
            <select
                value={transmission}
                className="form-section-input"
                onChange={changeChoice}
            >
                {VEHICLE_TRANSMISSIONS.map((mode, i) => (
                    <option key={`vehicleMod-${i}`} value={mode}>
                        Transmisión {TRANSMITION_TO_SPANISH[mode]}
                    </option>
                ))}
            </select>
            <legend className="form-section-legend">Transmisión</legend>
        </fieldset>
    );
};

export default TransmissionField;
