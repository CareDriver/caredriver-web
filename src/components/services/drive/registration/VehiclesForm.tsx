import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";
import { carModes, defaultLicense, Vehicle, vehiclesTypes } from "./FormModels";
import ImageUploader from "@/components/form/ImageUploader";
import { Dispatch, SetStateAction } from "react";

const VehiclesForm = ({
    vehicles,
    setVehicles,
}: {
    vehicles: Vehicle[];
    setVehicles: Dispatch<SetStateAction<Vehicle[]>>;
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
                                      mode: VehicleTransmission.AUTOMATIC,
                                  }
                                : {
                                      type: VehicleType.MOTORCYCLE,
                                  },
                    };
                }
                return vehicle;
            });
        });
    };

    const updateNumberLicense = (index: number, number: string) => {
        setVehicles((prevVehicles) => {
            return prevVehicles.map((vehicle, i) => {
                if (i === index) {
                    return {
                        ...vehicle,
                        license: {
                            ...vehicle.license,
                            number: number,
                        },
                    };
                }
                return vehicle;
            });
        });
    };

    const updateFrontLicenseImage = (index: number, image: string | null) => {
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

    const updateBehindLicenseImage = (index: number, image: string | null) => {
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
            var vehicleType: Vehicle;
            if (availableType == VehicleType.MOTORCYCLE) {
                vehicleType = {
                    type: {
                        type: availableType,
                    },
                    license: defaultLicense,
                };
            } else {
                vehicleType = {
                    type: {
                        type: availableType,
                        mode: VehicleTransmission.AUTOMATIC,
                    },
                    license: defaultLicense,
                };
            }
            setVehicles([...vehicles, vehicleType]);
        }
    };

    const getFreeVehicles = (vehicles: Vehicle[]) => {
        const chosen = getChosenVehicles(vehicles);
        const free: VehicleType[] = vehiclesTypes.filter(
            (type) => !chosen.includes(type),
        );

        return free;
    };

    const getChosenVehicles = (vehicles: Vehicle[]) => {
        return vehicles.map((vehicle) => vehicle.type.type);
    };

    return (
        <>
            {vehicles.map((vehicle, i) => (
                <div key={`vehicle-${i}`}>
                    <h2>Tipo de Vehiculo</h2>
                    <select
                        defaultValue={vehicle.type.type}
                        onChange={(option) => {
                            updateTypeVehicle(i, option.target.value);
                        }}
                    >
                        <option value={vehicle.type.type}>{vehicle.type.type}</option>
                        {vehiclesTypes.map((vehicleType, i) => {
                            if (!getChosenVehicles(vehicles).includes(vehicleType)) {
                                return (
                                    <option key={`vehicleType-${i}`} value={vehicleType}>
                                        {vehicleType}
                                    </option>
                                );
                            }
                        })}
                    </select>
                    {vehicle.type.type === VehicleType.CAR && (
                        <select defaultValue={vehicle.type.mode}>
                            {carModes.map((carMode, i) => (
                                <option key={`vehicleMod-${i}`} value={carMode}>
                                    {carMode}
                                </option>
                            ))}
                        </select>
                    )}
                    <h2>Licencia</h2>
                    <p>
                        Las fotos de tu licencia de conducir se eliminaran cuando se
                        acepte o rechaze tu solicitud.
                    </p>
                    <fieldset>
                        <input
                            type="text"
                            placeholder="Numero"
                            value={vehicle.license.number}
                            onChange={(e) => updateNumberLicense(i, e.target.value)}
                        />
                    </fieldset>
                    <fieldset>
                        <input type="date" />
                    </fieldset>
                    <ImageUploader
                        uploader={{
                            image: vehicle.license.frontPhoto,
                            setImage: (image: string | null) => {
                                updateFrontLicenseImage(i, image);
                            },
                        }}
                        content={{
                            indicator: "Parte Frontal de la Licencia",
                        }}
                    />
                    <ImageUploader
                        uploader={{
                            image: vehicle.license.behindPhoto,
                            setImage: (image: string | null) => {
                                updateBehindLicenseImage(i, image);
                            },
                        }}
                        content={{
                            indicator: "Parte Posterior de la Licencia",
                        }}
                    />
                </div>
            ))}
            {vehicles.length < vehiclesTypes.length && (
                <button type="button" onClick={addNewVehicle}>
                    Agregar Otro Vehiculo
                </button>
            )}
        </>
    );
};

export default VehiclesForm;
