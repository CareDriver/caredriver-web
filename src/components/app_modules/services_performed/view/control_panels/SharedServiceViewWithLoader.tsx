"use client";

import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { useContext, useEffect, useState } from "react";
import { firestore } from "@/firebase/FirebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getPathCollectionOfServicesPerf } from "../../model/utils/CollectionGetter";
import { ServiceType } from "@/interfaces/Services";
import PageLoading from "@/components/loaders/PageLoading";
import { routeToRedirector } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";
import { isLessTime } from "@/utils/helpers/DateHelper";
import SharedServiceView from "./concrete/SharedServiceView";

const SharedServiceViewWithLoader = ({
  id,
  type,
}: {
  id: string;
  type: ServiceType;
}) => {
  const COLLECTION_PATH = getPathCollectionOfServicesPerf(type);
  const router = useRouter();
  const [data, setData] = useState<ServiceRequestInterface | null>(null);
  const [isValidShare, setIsValidShare] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Validate sharing conditions
  const validateShareConditions = (
    service: ServiceRequestInterface,
  ): boolean => {
    if (!service.sharing || !(service.sharing instanceof Timestamp)) {
      return false;
    }
    if (service.canceled) {
      return false;
    }
    if (service.finished) {
      return false;
    }
    if (!isLessTime(service.sharing)) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    const q = query(
      collection(firestore, COLLECTION_PATH),
      where("fakedId", "==", id),
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const serviceData = doc.data() as ServiceRequestInterface;
          setData(serviceData);

          if (validateShareConditions(serviceData)) {
            setIsValidShare(true);
          } else {
            setIsValidShare(false);
            toast.error(
              "Este servicio no está disponible para compartir o el enlace ha expirado",
            );
            router.push(routeToRedirector());
          }
        } else {
          toast.error("Servicio no encontrado...");
          router.push(routeToRedirector());
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching service:", error);
        toast.error("Error al cargar el servicio");
        router.push(routeToRedirector());
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [COLLECTION_PATH, id, router]);

  // Check sharing expiration periodically
  useEffect(() => {
    if (!data?.sharing || !(data.sharing instanceof Timestamp)) {
      return;
    }

    const interval = setInterval(() => {
      if (!isLessTime(data.sharing)) {
        toast.info("Tiempo agotado", {
          toastId: "service-sharing-time-out-alert",
        });
        clearInterval(interval);
        router.push(routeToRedirector());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.sharing, router]);

  if (loading) {
    return <PageLoading />;
  }

  if (!data || !isValidShare) {
    return null;
  }

  return <SharedServiceView service={data} type={type} />;
};

export default SharedServiceViewWithLoader;
