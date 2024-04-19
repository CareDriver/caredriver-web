import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";
import {
    vehiclesModes,
    defaultLicense,
    VehicleForm,
    vehiclesTypes,
} from "../../FormModels";
import ImageUploader from "@/components/form/ImageUploader";
import { Dispatch, SetStateAction } from "react";
import Car from "@/icons/Car";
import AddressCar from "@/icons/AddressCar";
import Plus from "@/icons/Plus";
import { PhotoField } from "../../FormModels";
import {
    isValidLicenseNumber,
    isValidLicenseDate,
} from "@/utils/validator/service_requests/DriveValidator";

const VehiclesForm = ({
    vehicles,
    setVehicles,
}: {
    vehicles: VehicleForm[];
    setVehicles: Dispatch<SetStateAction<VehicleForm[]>>;
}) => {
    const updateTypeVehicle = (index: number, type: string) => {
        setVehicles((prevVehicles) => {
            return prevVehicles.map((vehicle, i) => {
                if (i === index) {
                    return {
                        ...vehicle,
                        type:
                            type === VehicleType.CAR
                                ? {
                                      type: VehicleType.CAR,
                                      mode: [VehicleTransmission.AUTOMATIC],
                                  }
                                : {
                                      type: VehicleType.MOTORCYCLE,
                                      mode: [VehicleTransmission.AUTOMATIC],
                                  },
                    };
                }
                return vehicle;
            });
        });
    };

    const updateTypeModeVehicle = (index: number, type: string) => {
        if (vehicles[index].type.type === VehicleType.CAR) {
            var newMode: VehicleTransmission = VehicleTransmission.AUTOMATIC;
            if (type === VehicleTransmission.MECHANICAL) {
                newMode = VehicleTransmission.MECHANICAL;
            }

            setVehicles((prevVehicles) => {
                return prevVehicles.map((vehicle, i) => {
                    if (i === index) {
                        if (!vehicle.type.mode.includes(newMode)) {
                            return {
                                ...vehicle,
                                type: {
                                    ...vehicle.type,
                                    mode: [newMode],
                                },
                            };
                        }
                    }
                    return vehicle;
                });
            });
        }
    };

    const updateNumberLicense = (index: number, number: string) => {
        const { isValid, message } = isValidLicenseNumber(number);
        setVehicles((prevVehicles) => {
            return prevVehicles.map((vehicle, i) => {
                if (i === index) {
                    return {
                        ...vehicle,
                        license: {
                            ...vehicle.license,
                            number: {
                                value: number,
                                message: isValid ? null : message,
                            },
                        },
                    };
                }
                return vehicle;
            });
        });
    };

    const updateDateLicense = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const dateString = event.target.value;
        const [year, month, day] = dateString.split("-").map(Number);
        const selectedDate = new Date(year, month - 1, day);
        const { isValid, message } = isValidLicenseDate(selectedDate);
        setVehicles((prevVehicles) => {
            return prevVehicles.map((vehicle, i) => {
                if (i === index) {
                    return {
                        ...vehicle,
                        license: {
                            ...vehicle.license,
                            expirationDate: {
                                value: selectedDate,
                                message: isValid ? null : message,
                            },
                        },
                    };
                }
                return vehicle;
            });
        });
    };

    const updateFrontLicenseImage = (index: number, image: PhotoField) => {
        setVehicles((prevVehicles) => {
            return prevVehicles.map((vehicle, i) => {
                if (i === index) {
                    return {
                        ...vehicle,
                        license: {
                            ...vehicle.license,
                            frontPhoto: image,
                        },
                    };
                }
                return vehicle;
            });
        });
    };

    const updateBehindLicenseImage = (index: number, image: PhotoField) => {
        setVehicles((prevVehicles) => {
            return prevVehicles.map((vehicle, i) => {
                if (i === index) {
                    return {
                        ...vehicle,
                        license: {
                            ...vehicle.license,
                            behindPhoto: image,
                        },
                    };
                }
                return vehicle;
            });
        });
    };

    const addNewVehicle = () => {
        var free = getFreeVehicles(vehicles);
        if (free.length > 0) {
            var availableType = free[0];
            var vehicleType: VehicleForm = {
                type: {
                    type: availableType,
                    mode: [VehicleTransmission.AUTOMATIC],
                },
                license: defaultLicense,
            };
            setVehicles([...vehicles, vehicleType]);
        }
    };

    const getFreeVehicles = (vehicles: VehicleForm[]) => {
        const chosen = getChosenVehicles(vehicles);
        const free: VehicleType[] = vehiclesTypes.filter(
            (type) => !chosen.includes(type),
        );

        return free;
    };

    const getChosenVehicles = (vehicles: VehicleForm[]) => {
        return vehicles.map((vehicle) => vehicle.type.type);
    };

    const addNewTransmision = (index: number) => {
        if (vehicles[index].type.mode.length < 2) {
            var newMode =
                vehicles[index].type.mode[0] === VehicleTransmission.AUTOMATIC
                    ? VehicleTransmission.MECHANICAL
                    : VehicleTransmission.AUTOMATIC;

            setVehicles((prevVehicles) => {
                return prevVehicles.map((vehicle, i) => {
                    if (i === index) {
                        if (!vehicle.type.mode.includes(newMode)) {
                            return {
                                ...vehicle,
                                type: {
                                    ...vehicle.type,
                                    mode: [...vehicle.type.mode, newMode],
                                },
                            };
                        }
                    }
                    return vehicle;
                });
            });
        }
    };

    return (
        <div className="form-sub-container | margin-top-25">
            {vehicles.map((vehicle, i) => (
                <div className="form-sub-container" key={`vehicle-${i}`}>
                    <h2 className="text icon-wrapper | medium-big bold">
                        <Car /> Tipo de Vehiculo
                    </h2>
                    <fieldset className="form-section">
                        <select
                            key={"form-section-vehicle-types"}
                            defaultValue={vehicle.type.type}
                            onChange={(option) => {
                                updateTypeVehicle(i, option.target.value);
                            }}
                            className="form-section-input"
                        >
                            <option value={vehicle.type.type}>{vehicle.type.type}</option>
                            {vehiclesTypes.map((vehicleType, i) => {
                                if (!getChosenVehicles(vehicles).includes(vehicleType)) {
                                    return (
                                        <option
                                            key={`vehicleType-${i}`}
                                            value={vehicleType}
                                        >
                                            {vehicleType}
                                        </option>
                                    );
                                }
                            })}
                        </select>
                    </fieldset>
                    {vehicle.type.mode.length == 1 ? (
                        <fieldset className="form-section">
                            <select
                                defaultValue={vehicle.type.mode[0]}
                                className="form-section-input"
                                onChange={(e) => updateTypeModeVehicle(i, e.target.value)}
                            >
                                {vehiclesModes.map((mode, i) => (
                                    <option key={`vehicleMod-${i}`} value={mode}>
                                        {mode}
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
                                        value={mode}
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
                                onClick={() => addNewTransmision(i)}
                                className="icon-wrapper small-general-button | gray touchable"
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
                            onChange={(e) => updateNumberLicense(i, e.target.value)}
                            className="form-section-input"
                        />
                        {vehicle.license.number.message && (
                            <small>{vehicle.license.number.message}</small>
                        )}
                    </fieldset>
                    <fieldset className="form-section">
                        <input
                            type="date"
                            onChange={(e) => updateDateLicense(i, e)}
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
                                updateFrontLicenseImage(i, image);
                            },
                        }}
                        content={{
                            indicator: "Parte Frontal de la Licencia",
                            isCircle: false,
                            id: `vehicle-license-front-photo-${i}`,
                        }}
                    />
                    <ImageUploader
                        uploader={{
                            image: vehicle.license.behindPhoto,
                            setImage: (image: PhotoField) => {
                                updateBehindLicenseImage(i, image);
                            },
                        }}
                        content={{
                            indicator: "Parte Posterior de la Licencia",
                            isCircle: false,
                            id: `vehicle-license-behind-photo-${i}`,
                        }}
                    />
                </div>
            ))}
            {vehicles.length < vehiclesTypes.length && (
                <div>
                    <button
                        type="button"
                        onClick={addNewVehicle}
                        className="icon-wrapper small-general-button | gray touchable"
                    >
                        <Plus />
                        Agregar otro Vehiculo
                    </button>
                </div>
            )}
        </div>
    );
};

export default VehiclesForm;
