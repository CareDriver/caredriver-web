"use client";

import { AuthContext } from "@/context/AuthContext";
import { ServiceReqState } from "@/interfaces/Services";
import { useContext, useEffect, useState } from "react";
import CraneOperatorPanel from "./CraneOperatorPanel";
import NewCraneOperatorForm from "../../../request_forms/requests_to_be_servers/for_crane_operator/NewCraneOperatorForm";
import RequestInProgress from "../../RequestInProgress";
import PageLoading from "@/components/loaders/PageLoading";

const CraneOperatorPanelRedirector = () => {
  const { user, checkingUserAuth } = useContext(AuthContext);
  const [state, setState] = useState<ServiceReqState>(ServiceReqState.NotSent);

  const getView = () => {
    switch (state) {
      case ServiceReqState.Approved:
        return <CraneOperatorPanel />;
      case ServiceReqState.Reviewing:
        return <RequestInProgress />;
      default:
        return <NewCraneOperatorForm baseUser={user} />;
    }
  };

  useEffect(() => {
    if (!checkingUserAuth && user) {
      if (
        user.serviceRequests &&
        user.serviceRequests.tow &&
        user.serviceRequests.tow.state === ServiceReqState.Reviewing
      ) {
        setState(ServiceReqState.Reviewing);
      } else if (
        user.serviceRequests &&
        user.serviceRequests.tow &&
        user.serviceRequests.tow.state === ServiceReqState.Approved
      ) {
        setState(ServiceReqState.Approved);
      }
    }
  }, [checkingUserAuth, user]);

  return checkingUserAuth ? <PageLoading /> : getView();
};

export default CraneOperatorPanelRedirector;
