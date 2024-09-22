"use client";

import EnterpriseRendererForContact from "@/components/app_modules/enterprises/views/data_renderers/EnterpriseRendererForContact";
import BaseEnterpriseSelector from "@/components/app_modules/enterprises/views/selectors/BaseEnterpriseSelector";
import Popup from "@/components/modules/Popup";
import Car from "@/icons/Car";
import { Enterprise } from "@/interfaces/Enterprise";
import { useState } from "react";

const DriverInstrucctionsAsNew = () => {
    const [enterpriseSelected, setEnterpriseSelected] = useState<
        Enterprise | undefined
    >(undefined);

    const STEPS = [
        "Selecciona una de estas empresas que estan en tu misma localizacion.",
        "Contactate con una de estas empresas para pedir que te registren como chofer.",
    ];

    const selectEnterprise = (enterprise: Enterprise | undefined) => {
        setEnterpriseSelected(enterprise);
    };

    return (
        <div className="service-form-wrapper">
            <h1 className="text | big bolder">
                Trabaja como chofer con nosotros!
            </h1>
            <div>
                <h3 className="text | medium-big bolder icon-wrapper margin-top-25">
                    <Car />
                    Sigue estos pasos para ser chofer
                </h3>
                <div className="margin-bottom-25">
                    {STEPS.map((m, i) => (
                        <p className="text | margin-top-15" key={`step-${i}`}>
                            <b>{i + 1}.</b> {m}
                        </p>
                    ))}
                </div>

                <BaseEnterpriseSelector
                    typeOfEnterprise="driver"
                    behavior={{
                        pageSize: 8,
                        localSelecction: false,
                        selectEnterprise: selectEnterprise,
                    }}
                />
                {enterpriseSelected && (
                    <Popup
                        isOpen={enterpriseSelected !== undefined}
                        close={() => setEnterpriseSelected(undefined)}
                    >
                        <div className="min-width-60">
                            <EnterpriseRendererForContact
                                enterprise={enterpriseSelected}
                            />
                        </div>
                    </Popup>
                )}
            </div>
        </div>
    );
};

export default DriverInstrucctionsAsNew;
