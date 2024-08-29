import ChevronDown from "@/icons/ChevronDown";
import { locationList, Locations } from "@/interfaces/Locations";
import { LocationFieldSetter } from "../../models/FieldSetters";
import { ChangeEvent } from "react";

interface Props {
    location: Locations;
    setter: LocationFieldSetter;
}

const LocationField: React.FC<Props> = ({ location, setter }) => {
    
    const changeLocation = (e: ChangeEvent<HTMLSelectElement>) => {
        let newLocation = e.target.value as Locations;
        setter(newLocation);
    };

    return (
        <fieldset className="form-section | select-item">
            <ChevronDown />
            <select
                className="form-section-input"
                onChange={changeLocation}
                value={location}
            >
                {locationList.map((location, i) => (
                    <option key={`location-option-${i}`} value={location}>
                        {location}
                    </option>
                ))}
            </select>
            <legend className="form-section-legend">Ubicación</legend>
        </fieldset>
    );
};

export default LocationField;
