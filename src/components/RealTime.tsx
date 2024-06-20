"use client";

import { initializeRealtimeDatabase } from "@/firebase/FirebaseConfig";
import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { ServiceRoutes } from "@/interfaces/RouteNavigationInterface";
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
    const [route, setRoute] = useState<Location[]>([]);
    const database = initializeRealtimeDatabase(databaseURL);

    const toLocation = (lat: number, lng: number): Location => {
        return {
            lat,
            lng,
        };
    };

    useEffect(() => {
        const starCountRef = ref(database, "services/" + serviceId);
        const listener = onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            console.log("Data from Firebase:", data); // Log para depuración
            if (data) {
                const service = data as ServiceRoutes;
                setData(service);

                if (service.priorArrivalRoute) {
                    const routes = Object.values(service.priorArrivalRoute).map((v) => toLocation(v.lat, v.long));
                    setRoute(routes);
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
                start={route[0] || { lat: 0, lng: 0 }}
                end={route[route.length - 1]}
                coordinates={route}
            />
        </div>
    );
};

export default RealTime;
