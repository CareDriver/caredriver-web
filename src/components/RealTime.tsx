"use client";

import { initializeRealtimeDatabase } from "@/firebase/FirebaseConfig";
import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { CoordinateRegister, ServiceRoutes } from "@/interfaces/RouteNavigationInterface";
import PageLoader from "./PageLoader";
import { Location } from "@/utils/map/Locator";
import PolylineMap from "./requests/data_renderer/map/PolylineMap";

const RealTime = ({
    databaseURL,
    serviceId,
}: {
    databaseURL: string;
    serviceId: string;
}) => {
    const [data, setData] = useState<ServiceRoutes | null | undefined>(null);
    const [route, setRoute] = useState<{
        prior: CoordinateRegister[];
        inProgress: CoordinateRegister[];
    }>({
        prior: [],
        inProgress: [],
    });
    const database = initializeRealtimeDatabase(databaseURL);

    useEffect(() => {
        const starCountRef = ref(database, "services/" + serviceId);
        const listener = onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            console.log("Data from Firebase:", data); // Log para depuración
            if (data) {
                const service = data as ServiceRoutes;
                setData(service);

                if (service.priorArrivalRoute) {
                    const priorPath = Object.values(service.priorArrivalRoute);
                    var statePaths = {
                        ...route,
                        prior: priorPath,
                    };
                    if (service.serviceInProgressRoute) {
                        const inProgressPath = Object.values(
                            service.serviceInProgressRoute,
                        );
                        statePaths = {
                            ...statePaths,
                            inProgress: inProgressPath,
                        };
                    }
                    setRoute(statePaths);
                }
            } else {
                setData(undefined);
            }
        });

        return () => {
            off(starCountRef, "value", listener);
        };
    }, [database, serviceId]);

    if (data === null) {
        return <PageLoader />;
    }

    if (data === undefined) {
        return <div>No found</div>;
    }

    return (
        <div>
            {JSON.stringify(data)}
            <PolylineMap
                priorArrivalRoute={route.prior}
                serviceInProgressRoute={route.inProgress}
            />
        </div>
    );
};

export default RealTime;
