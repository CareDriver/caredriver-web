"use client";

import { AuthContext } from "@/context/AuthContext";
import { ServiceReqState } from "@/interfaces/Services";

import { useContext, useEffect, useState } from "react";
import MechanicPanel from "./MechanicPanel";
import MechanicRegistration from "./registration/MechanicRegistration";
import PageLoader from "@/components/PageLoader";
import RequestInProgress from "../RequestInProgress";

const MechanicService = () => {
    const { user, loadingUser } = useContext(AuthContext);
    const [state, setState] = useState<ServiceReqState>(ServiceReqState.NotSent);

    const getView = () => {
        switch (state) {
            case ServiceReqState.Approved:
                return <MechanicPanel />;
            case ServiceReqState.Reviewing:
                return <RequestInProgress />;
            default:
                return <MechanicRegistration />;
        }
    };

    useEffect(() => {
        if (!loadingUser && user.data) {
            if (
                user.data.serviceRequests.mechanic &&
                user.data.serviceRequests.mechanic.state === ServiceReqState.Reviewing
            ) {
                setState(ServiceReqState.Reviewing);
            } else if (
                user.data.serviceRequests.mechanic &&
                user.data.serviceRequests.mechanic.state === ServiceReqState.Approved
            ) {
                setState(ServiceReqState.Approved);
            }
        }
    }, [loadingUser]);

    return loadingUser ? <PageLoader /> : getView();
};

export default MechanicService;
