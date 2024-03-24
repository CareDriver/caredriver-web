"use client";

import ImageUploader from "@/components/form/ImageUploader";
import { useEffect, useState } from "react";

interface PersonalData {
    fullname: string;
    photo: string | null;
}

interface License {
    number: string;
    expirationDate: Date;
    frontPhoto: string | null;
    behindPhoto: string | null;
}

interface Vehicle {
    type: CarType | MotorcycleType;
    license: License;
}

interface UserConfirmation {
    photo: string | null;
}

interface MotorcycleType {
    type: VehicleType.Motorcycle;
}

interface CarType {
    type: VehicleType.Car;
    mode: CarMode;
}

enum CarMode {
    Automatic = "Automatic",
    Manual = "Manual",
}

const carModes = [CarMode.Automatic, CarMode.Manual];

enum VehicleType {
    Car = "Car",
    Motorcycle = "Motorcycle",
}

const vehiclesTypes = [VehicleType.Car, VehicleType.Motorcycle];

const defaultLicense: License = {
    number: "",
    expirationDate: new Date(),
    frontPhoto: null,
    behindPhoto: null,
};

const DriverRegistration = () => {
    const [personalData, setPersonalData] = useState<PersonalData>({
        fullname: "",
        photo: null,
    });

    const [vehicles, setVehicles] = useState<Vehicle[]>([
        {
            type: {
                type: VehicleType.Car,
                mode: CarMode.Automatic,
            },
            license: defaultLicense,
        },
    ]);

    const [userConfirmation, setUserConfirmation] = useState<string | null>(null);

    const [vehiclesState, setVehiclesState] = useState({
        chosen: [],
        free: vehiclesTypes,
    });

    const addNewVehicle = () => {
        
        setVehicles([...vehicles]);
    };

    const updateTypeVehicle = (index: number, type: VehicleType) => {
        var array = vehicles;
        for (let i = 0; i < array.length; i++) {
            if (index == i) {
                array[i].type.type = type;
            }
        }

        setVehicles(array);
    };

    const updateNumberLicense = (index: number, number: string) => {
        var array = vehicles;
        for (let i = 0; i < array.length; i++) {
            if (index == i) {
                array[i].license.number = number;
            }
        }

        setVehicles(array);
    };

    const updateFrontLicenseImage = (index: number, image: string | null) => {
        var array = vehicles;
        for (let i = 0; i < array.length; i++) {
            if (index == i) {
                array[i].license.frontPhoto = image;
            }
        }

        setVehicles(array);
    };

    const updateBehindLicenseImage = (index: number, image: string | null) => {
        var array = vehicles;
        for (let i = 0; i < array.length; i++) {
            if (index == i) {
                array[i].license.behindPhoto = image;
            }
        }

        setVehicles(array);
    };

    const string2vehicle = (typeToFind: string) => {
        let typeFound: VehicleType = VehicleType.Car;
        vehiclesTypes.forEach((type) => {
            if (type == typeToFind) {
                typeFound = type;
            }
        });

        return typeFound;
    };

    useEffect(() => {
        var chosen = [];
        var free = vehiclesTypes;
        vehicles.forEach((vehicle) => {
            chosen.push(vehicle.type.type);
            free = free.filter((stillfree) => stillfree != vehicle.type.type);
        });
    }, [vehicles]);

    return (
        <div>
            <h1>Solicita trabajar como Chofer con nosotros!</h1>
            <p>
                Por favor llena este formulario con datos reales para que tu solicitud sea
                aprovada y puedas empezar a trabajar con nosotros.
            </p>
            <form>
                <h2>Datos Personales</h2>
                <fieldset>
                    <input type="text" placeholder="Nombre completo" />
                </fieldset>
                <ImageUploader
                    uploader={{
                        image: personalData.photo,
                        setImage: (image: string | null) => {
                            setPersonalData({ ...personalData, photo: image });
                        },
                    }}
                    content={{
                        indicator: "Foto de Perfil",
                    }}
                />
                <>
                    {vehicles.map((vehicle, i) => (
                        <>
                            <h2>Tipo de Vehiculo</h2>
                            <select
                                defaultValue={vehicle.type.type}
                                onChange={(option) => {
                                    updateTypeVehicle(
                                        i,
                                        string2vehicle(option.target.value),
                                    );
                                }}
                            >
                                {vehiclesState.free.map((vehicleType) => (
                                    <option value={vehicleType}>{vehicleType}</option>
                                ))}
                            </select>
                            {vehicle.type.type === VehicleType.Car && (
                                <select defaultValue={vehicle.type.mode}>
                                    {carModes.map((carMode) => (
                                        <option value={carMode}>{carMode}</option>
                                    ))}
                                </select>
                            )}
                            <h2>Licencia</h2>
                            <p>
                                Las fotos de tu licencia de conducir se eliminaran cuando
                                se acepte o rechaze tu solicitud.
                            </p>
                            <fieldset>
                                <input
                                    type="text"
                                    placeholder="Numero"
                                    value={vehicle.license.number}
                                    onChange={(e) =>
                                        updateNumberLicense(i, e.target.value)
                                    }
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
                        </>
                    ))}
                </>
                {vehiclesState.free.length > 0 && <button>Agregar Otro Vehiculo</button>}
                <h2>Confirmacion del Usuario</h2>
                <p>
                    Sube una selfie para verificar que eres el que esta solicitando
                    nuestro servicio. Esta foto sera eliminada cuando tu solicitud sera
                    aceptada o rechazada
                </p>
                <ImageUploader
                    uploader={{
                        image: userConfirmation,
                        setImage: setUserConfirmation,
                    }}
                    content={{
                        indicator: "Selfie",
                    }}
                />

                <input
                    type="checkbox"
                    value={
                        "Acepto las Politicas de Privacidad, Terminos y Condiciones de Uso, recibir comunicaciones de CaReDriver y chatear con nosotros por WhatsApp"
                    }
                />
                <button>Enviar Solicitud</button>
            </form>
        </div>
    );
};

export default DriverRegistration;
