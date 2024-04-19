import { vehicleModeRender, VehicleTransmission, VehicleType, vehicleTypeRender } from "@/interfaces/VehicleInterface";
import { vehiclesModes, VehicleForm } from "../../FormModels";
import ImageUploader from "@/components/form/ImageUploader";
import { Dispatch, SetStateAction } from "react";
import Car from "@/icons/Car";
import AddressCar from "@/icons/AddressCar";
import { PhotoField } from "../../FormModels";
import {
    isValidLicenseNumber,
    isValidLicenseDate,
} from "@/utils/validator/service_requests/DriveValidator";
import Plus from "@/icons/Plus";

const SingleVehicleForm = ({
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

            setVehicle((prevVehicles) => ({
                ...prevVehicles,
                type: {
                    ...vehicle.type,
                    mode: [newMode],
                },
            }));
        }
    };

    const updateNumberLicense = (number: string) => {
        const { isValid, message } = isValidLicenseNumber(number);
        setVehicle((prevVehicles) => ({
            ...prevVehicles,
            license: {
                ...vehicle.license,
                number: {
                    value: number,
                    message: isValid ? null : message,
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
                ...vehicle.license,
                expirationDate: {
                    value: selectedDate,
                    message: isValid ? null : message,
                },
            },
        }));
    };

    const updateFrontLicenseImage = (image: PhotoField) => {
        setVehicle((prevVehicles) => ({
            ...prevVehicles,
            license: {
                ...vehicle.license,
                frontPhoto: image,
            },
        }));
    };

    const updateBehindLicenseImage = (image: PhotoField) => {
        setVehicle((prevVehicles) => ({
            ...prevVehicles,
            license: {
                ...vehicle.license,
                behindPhoto: image,
            },
        }));
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
        <div className="form-sub-container | margin-top-25 max-width-60">
            {
                <div className="form-sub-container">
                    <h2 className="text icon-wrapper | medium-big bold">
                        <Car /> Tipo de Vehiculo
                    </h2>
                    <fieldset className="form-section">
                        <input
                            type="text"
                            placeholder="Numero"
                            value={vehicleTypeRender[vehicle.type.type]}
                            onChange={() => {}}
                            className="form-section-input"
                        />
                    </fieldset>
                    {vehicle.type.mode.length == 1 ? (
                        <fieldset className="form-section">
                            <select
                                defaultValue={vehicle.type.mode[0]}
                                className="form-section-input"
                                onChange={(e) => updateTypeModeVehicle(e.target.value)}
                            >
                                {vehiclesModes.map((mode, i) => (
                                    <option key={`vehicleMod-${i}`} value={mode}>
                                        {vehicleModeRender[mode]}
                                    </option>
                                ))}
                            </select>
                        </fieldset>
                    ) : (
                        <>
                            {vehicle.type.mode.map((mode, i) => (
                                <fieldset
                                    key={`vehicle-mode-selected-${i}`}
                                    className="form-section"
                                >
                                    <input
                                        value={vehicleModeRender[mode]}
                                        className="form-section-input"
                                        onChange={() => {}}
                                    />
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

                    <div>
                        <h2 className="text icon-wrapper | lb medium-big bold margin-top-25">
                            <AddressCar /> Licencia
                        </h2>
                        <p>
                            Las fotos de tu licencia de conducir se eliminaran cuando se
                            acepte o rechaze tu solicitud.
                        </p>
                    </div>
                    <fieldset className="form-section">
                        <input
                            type="text"
                            placeholder="Numero"
                            value={vehicle.license.number.value}
                            onChange={(e) => updateNumberLicense(e.target.value)}
                            className="form-section-input"
                        />
                        {vehicle.license.number.message && (
                            <small>{vehicle.license.number.message}</small>
                        )}
                    </fieldset>
                    <fieldset className="form-section">
                        <input
                            type="date"
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
                                updateFrontLicenseImage(image);
                            },
                        }}
                        content={{
                            indicator: "Parte Frontal de la Licencia",
                            isCircle: false,
                            id: "vehicle-license-front-photo",
                        }}
                    />
                    <ImageUploader
                        uploader={{
                            image: vehicle.license.behindPhoto,
                            setImage: (image: PhotoField) => {
                                updateBehindLicenseImage(image);
                            },
                        }}
                        content={{
                            indicator: "Parte Posterior de la Licencia",
                            isCircle: false,
                            id: "vehicle-license-behind-photo",
                        }}
                    />
                </div>
            }
        </div>
    );
};

export default SingleVehicleForm;
