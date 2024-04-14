import ImageUploader from "@/components/form/ImageUploader";
import { carModes, PhotoField, VehicleForm } from "@/components/services/FormModels";
import AddressCar from "@/icons/AddressCar";
import Car from "@/icons/Car";
import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";
import { InputValidator } from "@/utils/validator/InputValidator";
import {
    isValidLicenseDate,
    isValidLicenseNumber,
} from "@/utils/validator/service_requests/DriveValidator";
import { Dispatch, SetStateAction } from "react";

const TowVehicle = ({
    vehicle,
    setVehicle,
}: {
    vehicle: VehicleForm;
    setVehicle: Dispatch<SetStateAction<VehicleForm>>;
}) => {
    const updateTypeModeVehicle = (type: string) => {
        if (vehicle.type.type === VehicleType.CAR) {
            var mode: VehicleTransmission = VehicleTransmission.AUTOMATIC;
            if (type === VehicleTransmission.MECHANICAL) {
                mode = VehicleTransmission.MECHANICAL;
            }

            setVehicle((prev) => ({
                ...prev,
                type: {
                    ...prev.type,
                    mode,
                },
            }));
        }
    };

    const updateNumberLicense = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const { isValid, message } = isValidLicenseNumber(value);

        setVehicle((prev) => ({
            ...prev,
            license: {
                ...prev.license,
                number: {
                    value: value,
                    message: isValid ? "" : message,
                },
            },
        }));
    };

    const updateDateLicense = (event: React.ChangeEvent<HTMLInputElement>) => {
        const dateString = event.target.value;
        const [year, month, day] = dateString.split("-").map(Number);
        const selectedDate = new Date(year, month - 1, day);
        const { isValid, message } = isValidLicenseDate(selectedDate);
        setVehicle((prevVehicles) => ({
            ...prevVehicles,
            license: {
                ...prevVehicles.license,
                expirationDate: {
                    value: selectedDate,
                    message: isValid ? null : message,
                },
            },
        }));
    };

    const toDate = (e: React.ChangeEvent<HTMLInputElement>): Date => {
        const dateString = e.target.value;
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    return (
        <div className="form-sub-container">
            <h2 className="text icon-wrapper | medium-big bold">
                <Car /> Tipo de Transmision de su Vehiculo
            </h2>
            {vehicle.type.type === VehicleType.CAR && (
                <fieldset className="form-section">
                    <select
                        defaultValue={vehicle.type.mode}
                        className="form-section-input"
                        onChange={(e) => updateTypeModeVehicle(e.target.value)}
                    >
                        {carModes.map((carMode, i) => (
                            <option key={`vehicleMod-${i}`} value={carMode}>
                                {carMode}
                            </option>
                        ))}
                    </select>
                </fieldset>
            )}

            <div>
                <h2 className="text icon-wrapper | lb medium-big bold margin-top-25">
                    <AddressCar /> Licencia
                </h2>
                <p>
                    Las fotos de tu licencia de conducir se eliminaran cuando se acepte o
                    rechaze tu solicitud.
                </p>
            </div>
            <fieldset className="form-section">
                <input
                    type="text"
                    placeholder="Numero"
                    name="number"
                    value={vehicle.license.number.value}
                    onChange={(e) => updateNumberLicense(e)}
                    className="form-section-input"
                />
                {vehicle.license.number.message && (
                    <small>{vehicle.license.number.message}</small>
                )}
            </fieldset>
            <fieldset className="form-section">
                <input
                    type="date"
                    name="expirationDate"
                    onChange={(e) => updateDateLicense(e)}
                    className="form-section-input"
                />
                {vehicle.license.expirationDate.message && (
                    <small>{vehicle.license.expirationDate.message}</small>
                )}
            </fieldset>
            <ImageUploader
                uploader={{
                    image: vehicle.license.frontPhoto,
                    setImage: (image: PhotoField) => {
                        setVehicle((prev) => ({
                            ...prev,
                            license: {
                                ...prev.license,
                                frontPhoto: image,
                            },
                        }));
                    },
                }}
                content={{
                    indicator: "Parte Frontal de la Licencia",
                    isCircle: false,
                    id: "tow-license-front-photo",
                }}
            />
            <ImageUploader
                uploader={{
                    image: vehicle.license.behindPhoto,
                    setImage: (image: PhotoField) => {
                        setVehicle((prev) => ({
                            ...prev,
                            license: {
                                ...prev.license,
                                behindPhoto: image,
                            },
                        }));
                    },
                }}
                content={{
                    indicator: "Parte Posterior de la Licencia",
                    isCircle: false,
                    id: "tow-license-behind-photo",
                }}
            />
        </div>
    );
};

export default TowVehicle;
