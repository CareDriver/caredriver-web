"use client";

import { AuthContext } from "@/context/AuthContext";
import { ServiceReqState } from "@/interfaces/Services";
import { useContext, useEffect, useState } from "react";
import DriverPanel from "./DriverPanel";
import RequestInProgress from "../../RequestInProgress";
import DriverInstructionsPage from "./DriverInstrucctionsPage";
import PageLoading from "@/components/loaders/PageLoading";

const DriverPanelRedirector = () => {
    const { user, checkingUserAuth } = useContext(AuthContext);
    const [state, setState] = useState<ServiceReqState>(ServiceReqState.NotSent);

    const getView = () => {
        if (user) {
            switch (state) {
                case ServiceReqState.Approved:
                    return <DriverPanel />;
                case ServiceReqState.Reviewing:
                    return <RequestInProgress />;
                default:
                    return <DriverInstructionsPage user={user} />;
            }
        }
    };

    useEffect(() => {
        if (!checkingUserAuth && user && user.serviceRequests) {
            if (
                (user.serviceRequests.driveCar &&
                    user.serviceRequests.driveCar.state ===
                        ServiceReqState.Reviewing &&
                    user.serviceRequests.driveMotorcycle &&
                    user.serviceRequests.driveMotorcycle.state ===
                        ServiceReqState.Reviewing) ||
                (user.serviceRequests.driveCar &&
                    user.serviceRequests.driveCar.state ===
                        ServiceReqState.Reviewing &&
                    (!user.serviceRequests.driveMotorcycle ||
                        (user.serviceRequests.driveMotorcycle &&
                            (user.serviceRequests.driveMotorcycle.state ===
                                ServiceReqState.NotSent ||
                                user.serviceRequests.driveMotorcycle.state ===
                                    ServiceReqState.Refused)))) ||
                (user.serviceRequests.driveMotorcycle &&
                    user.serviceRequests.driveMotorcycle.state ===
                        ServiceReqState.Reviewing &&
                    (!user.serviceRequests.driveCar ||
                        (user.serviceRequests.driveCar &&
                            (user.serviceRequests.driveCar.state ===
                                ServiceReqState.NotSent ||
                                user.serviceRequests.driveCar.state ===
                                    ServiceReqState.Refused))))
            ) {
                setState(ServiceReqState.Reviewing);
            } else if (
                (user.serviceRequests.driveCar &&
                    user.serviceRequests.driveCar.state ===
                        ServiceReqState.Approved) ||
                (user.serviceRequests.driveMotorcycle &&
                    user.serviceRequests.driveMotorcycle.state ===
                        ServiceReqState.Approved)
            ) {
                setState(ServiceReqState.Approved);
            }
        }
    }, [checkingUserAuth]);

    return checkingUserAuth ? <PageLoading /> : getView();
};

export default DriverPanelRedirector;
