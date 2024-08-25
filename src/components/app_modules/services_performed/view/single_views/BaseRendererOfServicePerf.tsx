"use client";

import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { useEffect, useState } from "react";
import { firestore } from "@/firebase/FirebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { removeLastRoute } from "@/utils/helpers/PahtHelper";
import { usePathname } from "next/navigation";
import DriverServiceView from "./concrete/DriverServiceView";
import MechanicServiceView from "./concrete/MechanicServiceView";
import TowServiceView from "./concrete/TowServiceView";
import LaundryServiceView from "./concrete/LaundryServiceView";
import { getPathCollectionOfServicesPerf } from "../../model/utils/CollectionGetter";
import { ServiceType } from "@/interfaces/Services";
import PageLoading from "@/components/loaders/PageLoading";

const BaseRendererOfServicePerf = ({
    id,
    type,
}: {
    id: string;
    type: ServiceType;
}) => {
    const COLLECTION_PATH = getPathCollectionOfServicesPerf(type);
    const [data, setData] = useState<ServiceRequestInterface | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const q = query(
            collection(firestore, COLLECTION_PATH),
            where("fakedId", "==", id),
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
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
            case "mechanical":
                return <MechanicServiceView service={service} />;
            case "tow":
                return <TowServiceView service={service} />;
            case "laundry":
                return <LaundryServiceView service={service} />;
        }
    };

    return data ? getServiceView(data) : <PageLoading />;
};

export default BaseRendererOfServicePerf;
