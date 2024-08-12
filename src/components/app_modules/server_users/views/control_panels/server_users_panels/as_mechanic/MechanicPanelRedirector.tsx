"use client";

import { AuthContext } from "@/context/AuthContext";
import { ServiceReqState } from "@/interfaces/Services";

import { useContext, useEffect, useState } from "react";
import MechanicPanel from "./MechanicPanel";
import RequestInProgress from "../../RequestInProgress";
import PageLoading from "@/components/loaders/PageLoading";
import NewMechanicForm from "../../../form_requests/requests_to_be_servers/for_mechanic/NewMechanicForm";

const MechanicPanelRedirector = () => {
    const { user, checkingUserAuth } = useContext(AuthContext);
    const [state, setState] = useState<ServiceReqState>(
        ServiceReqState.NotSent,
    );

    const getView = () => {
        switch (state) {
            case ServiceReqState.Approved:
                return <MechanicPanel />;
            case ServiceReqState.Reviewing:
                return <RequestInProgress />;
            default:
                return <NewMechanicForm baseUser={user} />;
        }
    };

    useEffect(() => {
        if (!checkingUserAuth && user) {
            if (
                user.serviceRequests &&
                user.serviceRequests.mechanic &&
                user.serviceRequests.mechanic.state ===
                    ServiceReqState.Reviewing
            ) {
                setState(ServiceReqState.Reviewing);
            } else if (
                user.serviceRequests &&
                user.serviceRequests.mechanic &&
                user.serviceRequests.mechanic.state === ServiceReqState.Approved
            ) {
                setState(ServiceReqState.Approved);
            }
        }
    }, [checkingUserAuth]);

    return checkingUserAuth ? <PageLoading /> : getView();
};

export default MechanicPanelRedirector;
