import ImageUploader from "@/components/form/ImageUploader";
import { vehiclesModes, PhotoField, VehicleForm } from "@/components/services/FormModels";
import AddressCar from "@/icons/AddressCar";
import Car from "@/icons/Car";
import ChevronDown from "@/icons/ChevronDown";
import Plus from "@/icons/Plus";
import {
    vehicleModeRenderV2,
    VehicleTransmission,
    VehicleType,
} from "@/interfaces/VehicleInterface";
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
            var newMode: VehicleTransmission = VehicleTransmission.AUTOMATIC;
            if (type === VehicleTransmission.MECHANICAL) {
                newMode = VehicleTransmission.MECHANICAL;
            }

            setVehicle((prev) => ({
                ...prev,
                type: {
                    ...prev.type,
                    mode: [newMode],
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

    const addNewTransmision = () => {
        if (vehicle.type.mode.length < 2) {
            var newMode =
                vehicle.type.mode[0] === VehicleTransmission.AUTOMATIC
                    ? VehicleTransmission.MECHANICAL
                    : VehicleTransmission.AUTOMATIC;

            setVehicle((prevVehicles) => ({
                ...prevVehicles,
                type: {
                    ...vehicle.type,
                    mode: [...vehicle.type.mode, newMode],
                },
            }));
        }
    };

    return (
        <div className="form-sub-container | max-width-60">
            <h2 className="text icon-wrapper | medium-big bold">
                <Car /> Transmisión de su vehiculo
            </h2>
            {vehicle.type.mode.length == 1 ? (
                <fieldset className="form-section | select-item">
                    <ChevronDown />

                    <select
                        defaultValue={vehicle.type.mode[0]}
                        className="form-section-input"
                        onChange={(e) => updateTypeModeVehicle(e.target.value)}
                    >
                        {vehiclesModes.map((mode, i) => (
                            <option key={`vehicleMod-${i}`} value={mode}>
                                Transmisión {vehicleModeRenderV2[mode]}
                            </option>
                        ))}
                    </select>
                    <legend className="form-section-legend">Transmisión</legend>
                </fieldset>
            ) : (
                <>
                    {vehicle.type.mode.map((mode, i) => (
                        <fieldset
                            key={`vehicle-mode-selected-${i}`}
                            className="form-section"
                        >
                            <input
                                value={`Transmisión ${vehicleModeRenderV2[mode]}`}
                                className="form-section-input"
                                onChange={() => {}}
                            />
                            <legend className="form-section-legend">Transmisión</legend>
                        </fieldset>
                    ))}
                </>
            )}

            {vehicle.type.mode.length == 1 && (
                <div>
                    <button
                        type="button"
                        onClick={addNewTransmision}
                        className="icon-wrapper small-general-button text | gray-icon gray bold touchable"
                    >
                        <Plus />
                        Agregar otra Transmisión
                    </button>
                </div>
            )}

            <h2 className="text icon-wrapper | lb medium-big bold margin-top-25">
                <AddressCar /> Licencia
            </h2>
            <fieldset className="form-section">
                <input
                    type="text"
                    placeholder=""
                    name="number"
                    value={vehicle.license.number.value}
                    onChange={(e) => updateNumberLicense(e)}
                    className="form-section-input"
                />
                <legend className="form-section-legend">Número</legend>

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
                <legend className="form-section-legend">Fecha de expiración</legend>

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
                    indicator: "Parte frontal de la licencia",
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
                    indicator: "Parte posteror de la licencia",
                    isCircle: false,
                    id: "tow-license-behind-photo",
                }}
            />
        </div>
    );
};

export default TowVehicle;
