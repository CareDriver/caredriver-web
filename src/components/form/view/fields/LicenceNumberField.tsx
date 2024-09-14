"use client";

import {
    abbreviateLocation,
    locationFromAbbreviation,
    Locations,
} from "@/interfaces/Locations";
import { TextFieldWithSetter } from "../../models/FieldSetters";
import LocationField from "./LocationField";
import { useState } from "react";

interface LicenceNumber {
    location: Locations;
    number: string;
}

interface Props {
    field: TextFieldWithSetter;
}

const LicenceNumberField: React.FC<Props> = ({ field }) => {
    const SEPARATOR = "-";
    /*     const loadLicenceSaved = (): LicenceNumber => {
        let licenceNumberSplited = field.values.value.split(SEPARATOR);
        if (licenceNumberSplited.length !== 2) {
            return {
                ...DEAFULT_LICENSE_NUMBER,
                number: field.values.value,
            };
        }

        let code = licenceNumberSplited[0];
        return {
            location:
                locationFromAbbreviation(code) ?? Locations.CochabambaBolivia,
            number: licenceNumberSplited[1],
        };
    }; */

    const [licenseNumber, setLicenseNumber] = useState<LicenceNumber>(
        DEAFULT_LICENSE_NUMBER,
    );

    const setNumberLicense = (number: string) => {
        const { isValid, message } = field.validator(number);

        field.setter({
            value:
                abbreviateLocation(licenseNumber.location) + SEPARATOR + number,
            message: isValid ? null : message,
        });
        setLicenseNumber((prev) => ({ ...prev, number: number }));
    };

    const setLicenseLocation = (newLocation: Locations) => {
        field.setter({
            ...field.values,
            value: abbreviateLocation(newLocation) + "-" + licenseNumber.number,
        });
        setLicenseNumber((prev) => ({ ...prev, location: newLocation }));
    };

    return (
        <div>
            <div className="form-section-row">
                <LocationField
                    location={licenseNumber.location}
                    setter={setLicenseLocation}
                />
                <fieldset className="form-section">
                    <input
                        type="text"
                        placeholder=""
                        value={licenseNumber.number}
                        onChange={(e) => setNumberLicense(e.target.value)}
                        className="form-section-input"
                    />
                    <legend className="form-section-legend">Número</legend>
                </fieldset>
            </div>
            {field.values.message && (
                <small className="form-section-message">
                    * {field.values.message}
                </small>
            )}
        </div>
    );
};

export default LicenceNumberField;

const DEAFULT_LICENSE_NUMBER: LicenceNumber = {
    location: Locations.CochabambaBolivia,
    number: "",
};
