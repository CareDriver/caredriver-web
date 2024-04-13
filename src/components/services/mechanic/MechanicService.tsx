"use client";

import { AuthContext } from "@/context/AuthContext";
import { Services } from "@/interfaces/Services";

import { useContext, useEffect, useState } from "react";
import MechanicPanel from "./MechanicPanel";
import MechanicRegistration from "./registration/MechanicRegistration";
import PageLoader from "@/components/PageLoader";

const MechanicService = () => {
    /* const { user, loadingUser } = useContext(AuthContext);
    const [state, setState] = useState<ServiceReqState>(ServiceReqState.NotSent);

    const getView = () => {
        switch (state) {
            case ServiceReqState.Approved:
                return <DrivePanel />;
            case ServiceReqState.Reviewing:
                return <RequestInProgress />;
            default:
                return <DriverRegistration />;
        }
    };

    useEffect(() => {
        if (!loadingUser && user.data) {
            if (user.data.serviceRequests.drive.state === ServiceReqState.Reviewing) {
                setState(ServiceReqState.Reviewing);
            } else if (
                user.data.serviceRequests.drive.state === ServiceReqState.Approved
            ) {
                setState(ServiceReqState.Approved);
            }
        }
    }, [loadingUser]);

    return loadingUser ? <PageLoader /> : getView(); */
    return <MechanicRegistration />;
};

export default MechanicService;
