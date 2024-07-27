"use client";

import { AuthContext } from "@/context/AuthContext";
import { ServiceReqState } from "@/interfaces/Services";
import { useContext, useEffect, useState } from "react";
import TowPanel from "./TowPanel";
import TowRegistration from "./registration/TowRegistration";
import RequestInProgress from "../RequestInProgress";
import PageLoader from "@/components/PageLoader";

const TowService = () => {
    const { user, loadingUser } = useContext(AuthContext);
    const [state, setState] = useState<ServiceReqState>(ServiceReqState.NotSent);

    const getView = () => {
        switch (state) {
            case ServiceReqState.Approved:
                return <TowPanel />;
            case ServiceReqState.Reviewing:
                return <RequestInProgress />;
            default:
                return <TowRegistration baseUser={user.data} />;
        }
    };

    useEffect(() => {
        if (!loadingUser && user.data) {
            if (
                user.data.serviceRequests &&
                user.data.serviceRequests.tow &&
                user.data.serviceRequests.tow.state === ServiceReqState.Reviewing
            ) {
                setState(ServiceReqState.Reviewing);
            } else if (
                user.data.serviceRequests &&
                user.data.serviceRequests.tow &&
                user.data.serviceRequests.tow.state === ServiceReqState.Approved
            ) {
                setState(ServiceReqState.Approved);
            }
        }
    }, [loadingUser]);

    return loadingUser ? <PageLoader /> : getView();
};

export default TowService;
