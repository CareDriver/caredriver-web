"use client";

import EnterpriseRendererForContact from "@/components/app_modules/enterprises/views/data_renderers/EnterpriseRendererForContact";
import BaseEnterpriseSelector from "@/components/app_modules/enterprises/views/selectors/BaseEnterpriseSelector";
import Popup from "@/components/modules/Popup";
import Car from "@/icons/Car";
import { Enterprise } from "@/interfaces/Enterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import { useState } from "react";

const DriverInstrucctions = ({ user }: { user: UserInterface }) => {
    const [enterpriseSelected, setEnterpriseSelected] = useState<
        Enterprise | undefined
    >(undefined);

    const STEPS = [
        "Selecciona una de estas empresas que estan en tu mismo localizacion.",
        "Contactate con una de estas empresas.",
    ];

    const selectEnterprise = (enterprise: Enterprise | undefined) => {
        setEnterpriseSelected(enterprise);
    };

    return (
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
    );
};

export default DriverInstrucctions;
