"use client";

import { AuthContext } from "@/context/AuthContext";
import { ServiceReqState } from "@/interfaces/Services";
import { useContext, useEffect, useState } from "react";
import DrivePanel from "./DrivePanel";
import DriverRegistration from "./registration/DriverRegistration";
import RequestInProgress from "../RequestInProgress";
import PageLoader from "@/components/PageLoader";

const DriveService = () => {
    const { user, loadingUser } = useContext(AuthContext);
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

    return loadingUser ? <PageLoader /> : getView();
};

export default DriveService;
