import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { ServiceStatus } from "../models/TypeOfServiceStatus";

export interface ServiceStatusForRendering {
  state: ServiceStatus;
  style: string;
  styleFont: string;
  borderStyle: string;
}

export function getServicePerfStatus(
  service: ServiceRequestInterface,
): ServiceStatusForRendering {
  let state: ServiceStatusForRendering = {
    state: ServiceStatus.ACTIVE,
    style: "active-state",
    styleFont: "yellow",
    borderStyle: "active-service",
  };

  if (service.canceled) {
    state = {
      state: ServiceStatus.CANCELEED,
      style: "canceled-state",
      styleFont: "red",
      borderStyle: "canceled-service",
    };
  } else if (service.finished) {
    state = {
      state: ServiceStatus.FINISHED,
      style: "finished-state",
      styleFont: "green",
      borderStyle: "finished-service",
    };
  }

  return state;
}
