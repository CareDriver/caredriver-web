"use client";

import { initializeRealtimeDatabase } from "@/firebase/FirebaseConfig";
import { useEffect, useMemo, useState } from "react";
import { ref, onValue } from "firebase/database";
import {
  CoordinateRegister,
  ServiceRoutes,
} from "@/interfaces/RouteNavigationInterface";
import MapPolylineRenderer from "./MapPolylineRenderer";
import FieldDeleted from "./FieldDeleted";

const MapRealTime = ({
  databaseURL,
  serviceId,
  isCanceled,
  isFinished,
}: {
  databaseURL: string;
  serviceId: string | undefined;
  isCanceled: boolean;
  isFinished: boolean;
}) => {
  const [data, setData] = useState<ServiceRoutes | undefined>(undefined);
  const [route, setRoute] = useState<{
    prior: CoordinateRegister[];
    inProgress: CoordinateRegister[];
  }>({
    prior: [],
    inProgress: [],
  });

  const database = useMemo(() => {
    console.log("Initializing realtime database");
    return initializeRealtimeDatabase(databaseURL);
  }, [databaseURL]);

  useEffect(() => {
    console.log("MapRealTime effect fired", {
      databaseExists: !!database,
      serviceId,
      isCanceled,
      isFinished,
    });

    if (!database || !serviceId) {
      console.log("Missing database or serviceId");
      setData(undefined);
      return;
    }

    const serviceRef = ref(database, `services/${serviceId}`);
    console.log("Listening to:", `services/${serviceId}`);

    const handleSnapshot = (snapshot: any) => {
      console.log("Snapshot received");
      console.log("Exists:", snapshot.exists());
      console.log("Raw value:", snapshot.val());

      if (!snapshot.exists()) {
        console.log("Snapshot does not exist");
        setData(undefined);
        return;
      }

      const service = snapshot.val() as ServiceRoutes;
      console.log("Service data:", service);
      setData(service);

      const priorPath = service.priorArrivalRoute
        ? Object.values(service.priorArrivalRoute)
        : [];

      const inProgressPath = service.serviceInProgressRoute
        ? Object.values(service.serviceInProgressRoute)
        : [];

      setRoute({
        prior: priorPath,
        inProgress: inProgressPath,
      });

      console.log("Routes updated", {
        prior: priorPath.length,
        inProgress: inProgressPath.length,
      });
    };

    const handleError = (error: Error) => {
      console.error("Firebase listener error:", error);
    };

    console.log("Attaching realtime listener");

    // Siempre usar listener en tiempo real
    const unsubscribe = onValue(serviceRef, handleSnapshot, handleError);

    return () => {
      console.log("Detaching realtime listener");
      unsubscribe();
    };
  }, [database, serviceId, isCanceled, isFinished]);

  if (data === undefined) {
    return (
      <div className="max-width-60">
        <FieldDeleted description="No hay registro de la navegación" />
      </div>
    );
  }

  return (
    <MapPolylineRenderer
      priorArrivalRoute={route.prior}
      serviceInProgressRoute={route.inProgress}
    />
  );
};

export default MapRealTime;
