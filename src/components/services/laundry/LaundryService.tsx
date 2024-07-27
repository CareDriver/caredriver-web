"use client";

import { AuthContext } from "@/context/AuthContext";
import { ServiceReqState } from "@/interfaces/Services";

import { useContext, useEffect, useState } from "react";
import LaundryPanel from "./LaundryPanel";
import LaundryRegistration from "./registration/LaundryRegistration";
import PageLoader from "@/components/PageLoader";
import RequestInProgress from "../RequestInProgress";

const LaundryService = () => {
    const { user, loadingUser } = useContext(AuthContext);
    const [state, setState] = useState<ServiceReqState>(ServiceReqState.NotSent);

    const getView = () => {
        switch (state) {
            case ServiceReqState.Approved:
                return <LaundryPanel />;
            case ServiceReqState.Reviewing:
                return <RequestInProgress />;
            default:
                return <LaundryRegistration baseUser={user.data}/>;
        }
    };

    useEffect(() => {
        if (!loadingUser && user.data) {
            if (
                user.data.serviceRequests &&
                user.data.serviceRequests.laundry &&
                user.data.serviceRequests.laundry.state === ServiceReqState.Reviewing
            ) {
                setState(ServiceReqState.Reviewing);
            } else if (
                user.data.serviceRequests &&
                user.data.serviceRequests.laundry &&
                user.data.serviceRequests.laundry.state === ServiceReqState.Approved
            ) {
                setState(ServiceReqState.Approved);
            }
        }
    }, [loadingUser]);

    return loadingUser ? <PageLoader /> : getView();
};

export default LaundryService;
