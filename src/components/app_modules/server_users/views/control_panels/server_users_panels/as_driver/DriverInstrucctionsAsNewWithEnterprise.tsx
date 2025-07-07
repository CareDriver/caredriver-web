"use client";

import EnterpriseRendererForContact from "@/components/app_modules/enterprises/views/data_renderers/EnterpriseRendererForContact";
import BaseEnterpriseSelector from "@/components/app_modules/enterprises/views/selectors/BaseEnterpriseSelector";
import Popup from "@/components/modules/Popup";
import Car from "@/icons/Car";
import { Enterprise } from "@/interfaces/Enterprise";
import { DRIVER } from "@/models/Business";
import { useState } from "react";

const DriverInstrucctionsAsNewWithEnterprise = () => {
  const [enterpriseSelected, setEnterpriseSelected] = useState<
    Enterprise | undefined
  >(undefined);
  const STEPS = [
    "Selecciona una de estas empresas que estan en tu misma localizacion.",
    `Contactate con una de estas empresas para pedir que te registren como ${DRIVER}.`,
  ];

  const selectEnterprise = (enterprise: Enterprise | undefined) => {
    setEnterpriseSelected(enterprise);
  };

  return (
    <div className="margin-top-50">
      <h3 className="text | medium-big bold icon-wrapper">
        <Car />
        Sigue estos pasos para ser {DRIVER}
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
            <EnterpriseRendererForContact enterprise={enterpriseSelected} />
          </div>
        </Popup>
      )}
    </div>
  );
};

export default DriverInstrucctionsAsNewWithEnterprise;
