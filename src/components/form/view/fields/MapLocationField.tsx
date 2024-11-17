import { GeoPointFieldSetter } from "../../models/FieldSetters";
import { GeoPointField } from "../../models/FormFields";
import MapLocationSetter from "../maps/MapLocationSetter";

interface Props {
    field: {
        values: GeoPointField;
        setter: GeoPointFieldSetter;
    };
    legend: string;
}

const MapLocationField: React.FC<Props> = ({ field, legend }) => {
    return (
        <fieldset className="form-section">
            <span className="text | bold">{legend}</span>
            <div className="form-section-map">
                <MapLocationSetter
                    location={field.values.value}
                    setLocation={(location) =>
                        field.setter({
                            value: location,
                            message: null,
                        })
                    }
                />
            </div>
            {field.values.message && <small>{field.values.message}</small>}
        </fieldset>
    );
};

export default MapLocationField;
