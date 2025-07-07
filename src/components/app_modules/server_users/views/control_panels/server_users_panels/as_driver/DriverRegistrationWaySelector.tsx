"use client";

import { DriverRegistration } from "@/components/app_modules/server_users/models/DriverRegistration";
import CircleQuestion from "@/icons/CircleQuestion";
import FilePen from "@/icons/FilePen";
import Whatsapp from "@/icons/Whatsapp";
import { DRIVER, NAME_BUSINESS } from "@/models/Business";

interface Props {
  registrationWay: DriverRegistration;
  setRegistrationWay: (d: DriverRegistration) => void;
}

const DriverRegistrationWaySelector: React.FC<Props> = ({
  registrationWay,
  setRegistrationWay,
}) => {
  return (
    <div className="margin-top-25">
      <h3 className="text | medium-big bold icon-wrapper">
        <CircleQuestion /> Elige una de estas formas para de ser {DRIVER} de{" "}
        {NAME_BUSINESS}
      </h3>
      <div className="row-wrapper margin-top-15">
        <button
          className={`small-general-button touchable icon-wrapper | lb ${
            registrationWay !== DriverRegistration.CallingEnterprise && "gray"
          }`}
          onClick={() =>
            setRegistrationWay(DriverRegistration.CallingEnterprise)
          }
        >
          <Whatsapp /> Asociado a una Empresa
        </button>
        <button
          className={`small-general-button touchable icon-wrapper | lb ${
            registrationWay !== DriverRegistration.Independent && "gray"
          }`}
          onClick={() => setRegistrationWay(DriverRegistration.Independent)}
        >
          <FilePen /> Independiente
        </button>
      </div>
    </div>
  );
};

export default DriverRegistrationWaySelector;
