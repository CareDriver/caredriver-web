"use client";

import { AuthContext } from "@/context/AuthContext";
import { ServiceReqState } from "@/interfaces/Services";

import { useContext, useEffect, useState } from "react";
import NewLaundererForm from "../../../form_requests/requests_to_be_servers/for_launderer/NewLaundererForm";
import RequestInProgress from "../../RequestInProgress";
import LaundererPanel from "./LaundererPanel";
import PageLoading from "@/components/loaders/PageLoading";

const LaundererPanelRedirector = () => {
    const { user, checkingUserAuth } = useContext(AuthContext);
    const [serviceState, setServiceState] = useState<ServiceReqState>(
        ServiceReqState.NotSent,
    );

    const getView = () => {
        switch (serviceState) {
            case ServiceReqState.Approved:
                return <LaundererPanel />;
            case ServiceReqState.Reviewing:
                return <RequestInProgress />;
            default:
                return <NewLaundererForm baseUser={user} />;
        }
    };

    useEffect(() => {
        if (!checkingUserAuth && user) {
            if (
                user.serviceRequests &&
                user.serviceRequests.laundry &&
                user.serviceRequests.laundry.state === ServiceReqState.Reviewing
            ) {
                setServiceState(ServiceReqState.Reviewing);
            } else if (
                user.serviceRequests &&
                user.serviceRequests.laundry &&
                user.serviceRequests.laundry.state === ServiceReqState.Approved
            ) {
                setServiceState(ServiceReqState.Approved);
            }
        }
    }, [checkingUserAuth]);

    return checkingUserAuth ? <PageLoading /> : getView();
};

export default LaundererPanelRedirector;
