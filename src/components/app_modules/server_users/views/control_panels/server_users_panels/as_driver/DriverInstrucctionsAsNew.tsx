"use client";

import { DRIVER } from "@/models/Business";
import { useContext, useState } from "react";
import DriverInstrucctionsAsNewWithEnterprise from "./DriverInstrucctionsAsNewWithEnterprise";
import DriverRegistrationWaySelector from "./DriverRegistrationWaySelector";
import { DriverRegistration } from "@/components/app_modules/server_users/models/DriverRegistration";
import NewDriverForm from "../../../request_forms/requests_to_be_servers/for_driver/NewDriverForm";
import { AuthContext } from "@/context/AuthContext";

const DriverInstrucctionsAsNew = () => {
    const { user: userToAdd } = useContext(AuthContext);
    const [registrationWay, setRegistrationWay] = useState<DriverRegistration>(
        DriverRegistration.CallingEnterprise,
    );

    if (registrationWay === DriverRegistration.Independent) {
        return <NewDriverForm baseUser={userToAdd} />;
    }

    return (
        <div className="service-form-wrapper">
            <h1 className="text | big bold">
                Trabaja como {DRIVER} con nosotros!
            </h1>

            <DriverRegistrationWaySelector
                registrationWay={registrationWay}
                setRegistrationWay={setRegistrationWay}
            />
            {registrationWay === DriverRegistration.CallingEnterprise && (
                <DriverInstrucctionsAsNewWithEnterprise />
            )}
        </div>
    );
};

export default DriverInstrucctionsAsNew;
