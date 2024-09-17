"use client";

import { initializeRealtimeDatabase } from "@/firebase/FirebaseConfig";
import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
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
    const [data, setData] = useState<ServiceRoutes | null | undefined>(null);
    const [route, setRoute] = useState<{
        prior: CoordinateRegister[];
        inProgress: CoordinateRegister[];
    }>({
        prior: [],
        inProgress: [],
    });
    const database = initializeRealtimeDatabase(databaseURL);
    console.log(serviceId);
    

    useEffect(() => {
        if (database && serviceId) {
            const starCountRef = ref(database, "services/" + serviceId);

            if (isCanceled || isFinished) {
                onValue(
                    starCountRef,
                    (snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val() as ServiceRoutes;
                            setData(data);

                            if (data.priorArrivalRoute) {
                                const priorPath = Object.values(
                                    data.priorArrivalRoute,
                                );
                                let statePaths = {
                                    ...route,
                                    prior: priorPath,
                                };
                                if (data.serviceInProgressRoute) {
                                    const inProgressPath = Object.values(
                                        data.serviceInProgressRoute,
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
                    },
                    {
                        onlyOnce: true,
                    },
                );
            } else {
                const listener = onValue(starCountRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const service = data as ServiceRoutes;
                        setData(service);

                        if (service.priorArrivalRoute) {
                            const priorPath = Object.values(
                                service.priorArrivalRoute,
                            );
                            let statePaths = {
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
            }
        } else {
            setData(undefined);
        }
    }, [database, serviceId, isCanceled, isFinished]);

    if (data === null) {
        return <span className="loader-green | big-loader"></span>;
    }

    if (data === undefined) {
        return (
            <div className="max-width-60">
                <FieldDeleted description="No hay registro del la navegación" />
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
