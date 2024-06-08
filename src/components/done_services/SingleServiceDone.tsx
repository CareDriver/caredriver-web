"use client";

import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { useEffect, useState } from "react";
import PageLoader from "../PageLoader";
import { getNameServiceCollection } from "@/utils/requests/services/UserMadeServices";
import { firestore } from "@/firebase/FirebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";
import { removeLastRoute } from "@/utils/parser/ForPahtname";
import { usePathname } from "next/navigation";
import DriverServiceView from "./single_views/DriverServiceView";
import MechanicServiceView from "./single_views/MechanicServiceView";
import TowServiceView from "./single_views/TowServiceView";
import LaundryServiceView from "./single_views/LaundryServiceView";

const SingleServiceDone = ({
    id,
    type,
}: {
    id: string;
    type: "driver" | "mechanic" | "tow" | "laundry";
}) => {
    // const collection: CollectionReference = getServiceDoneCollection(type);
    const collectionPath = getNameServiceCollection(type);
    const [data, setData] = useState<ServiceRequestInterface | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(firestore, collectionPath, id), (doc) => {
            if (doc) {
                setData(doc.data() as ServiceRequestInterface);
            } else {
                toast.error("Servicio no encontrado");
                window.location.replace(removeLastRoute(pathname));
            }
        });

        return () => unsubscribe();
    }, []);

    const getServiceView = (service: ServiceRequestInterface) => {
        switch (type) {
            case "driver":
                return <DriverServiceView service={service} />;
            case "mechanic":
                return <MechanicServiceView service={service} />;
            case "tow":
                return <TowServiceView service={service} />;
            case "laundry":
                return <LaundryServiceView service={service} />;
        }
    };

    return data ? getServiceView(data) : <PageLoader />;
};

export default SingleServiceDone;
