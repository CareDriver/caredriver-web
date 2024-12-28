"use client";
import { AuthContext } from "@/context/AuthContext";
import Plus from "@/icons/Plus";
import { DRIVER, DRIVER_PLURAL } from "@/models/Business";
import { useContext } from "react";

const DriverInstructionsForNewVehicle = () => {
    const { user } = useContext(AuthContext);

    const STEPS = [
        `Contactate con la misma empresa con la que estas trabajando como ${DRIVER}.`,
        "Pideles que registren tu nuevo vehiculo de la misma forma que te registraron la primera vez.",
    ];

    if (user?.driverEnterpriseId) {
        return (
            <div>
                <h3 className="text | medium bold icon-wrapper margin-top-25">
                    Sigue estos pasos para agregar este vehiculo:
                </h3>
                <div className="margin-bottom-25">
                    {STEPS.map((m, i) => (
                        <p className="text | margin-top-15" key={`step-${i}`}>
                            <b>{i + 1}.</b> {m}
                        </p>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="margin-top-5">
            <p className="text | gray-dark bold">
                Registra este vehiculo para que nuestros usuarios puedan
                solicitar {DRIVER_PLURAL} para este vehiculo.
            </p>
            <button className="small-general-button icon-wrapper text | bold | margin-top-25">
                <Plus /> Registrar este vehiculo
            </button>
        </div>
    );
};

export default DriverInstructionsForNewVehicle;
