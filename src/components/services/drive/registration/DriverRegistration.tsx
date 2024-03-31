"use client";

import { useState } from "react";
import { defaultLicense, PersonalData, Vehicle } from "./FormModels";
import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";
import PersonalDataForm from "../../../form/PersonalDataForm";
import VehiclesForm from "./VehiclesForm";
import SelfieConfirmer from "@/components/form/SelfieConfirmer";
import TermsCheckForm from "@/components/form/TermsCheckForm";

const DriverRegistration = () => {
    const [personalData, setPersonalData] = useState<PersonalData>({
        fullname: "",
        photo: null,
    });
    const [vehicles, setVehicles] = useState<Vehicle[]>([
        {
            type: {
                type: VehicleType.CAR,
                mode: VehicleTransmission.AUTOMATIC,
            },
            license: defaultLicense,
        },
    ]);
    const [userConfirmation, setUserConfirmation] = useState<string | null>(null);
    const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

    return (
        <div className="service-form-wrapper">
            <h1 className="text | big bold">
                Solicita trabajar como Chofer con nosotros!
            </h1>
            <p>
                Por favor llena este formulario con datos reales para que tu solicitud sea
                aprovada y puedas empezar a trabajar con nosotros.
            </p>
            <form className="form-sub-container | max-width-60">
                <PersonalDataForm
                    personalData={personalData}
                    setPersonalData={setPersonalData}
                />
                <VehiclesForm vehicles={vehicles} setVehicles={setVehicles} />

                <SelfieConfirmer
                    image={userConfirmation}
                    setImage={setUserConfirmation}
                />

                <TermsCheckForm
                    isAcceptedTerms={acceptedTerms}
                    setAcceptedTerms={setAcceptedTerms}
                />
                <button className="general-button | margin-top-25">Enviar Solicitud</button>
            </form>
        </div>
    );
};

export default DriverRegistration;
