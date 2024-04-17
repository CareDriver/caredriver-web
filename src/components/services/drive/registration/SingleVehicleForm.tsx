import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";
import { carModes, VehicleForm } from "../../FormModels";
import ImageUploader from "@/components/form/ImageUploader";
import { Dispatch, SetStateAction } from "react";
import Car from "@/icons/Car";
import AddressCar from "@/icons/AddressCar";
import { PhotoField } from "../../FormModels";
import {
    isValidLicenseNumber,
    isValidLicenseDate,
} from "@/utils/validator/service_requests/DriveValidator";

const SingleVehicleForm = ({
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

            setVehicle((prevVehicles) => ({
                ...prevVehicles,
                type: {
                    ...vehicle.type,
                    mode,
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

    return (
        <div className="form-sub-container | margin-top-25">
            {
                <div className="form-sub-container">
                    <h2 className="text icon-wrapper | medium-big bold">
                        <Car /> Tipo de Vehiculo
                    </h2>
                    <fieldset className="form-section">
                        <input
                            type="text"
                            placeholder="Numero"
                            value={vehicle.type.type}
                            onChange={() => {}}
                            className="form-section-input"
                        />
                    </fieldset>
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
