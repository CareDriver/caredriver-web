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
import DriverServicePerformed from "./concrete/DriverServicePerformed";
import MechanicalServicePerformed from "./concrete/MechanicalServicePerformed";
import ServiceForCraneOperatorPerformed from "./concrete/ServiceForCraneOperatorPerformed";
import LaundryServicePerformed from "./concrete/LaundryServicePerformed";
import { getPathCollectionOfServicesPerf } from "../../model/utils/CollectionGetter";
import { ServiceType } from "@/interfaces/Services";
import PageLoading from "@/components/loaders/PageLoading";
import { routeToAllUsersAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import { AuthContext } from "@/context/AuthContext";
import { UserInterface } from "@/interfaces/UserInterface";
import { isLessTime } from "@/utils/helpers/DateHelper";
import { routeToRedirector } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";
import { checkPermission } from "@/components/guards/validators/RoleValidator";
import { ROLES_TO_VIEW_USER_SERVICES } from "@/components/guards/models/PermissionsByUserRole";

const ServicePerformedWithLoader = ({
  id,
  type,
}: {
  id: string;
  type: ServiceType;
}) => {
  const COLLECTION_PATH = getPathCollectionOfServicesPerf(type);
  const { checkingUserAuth, user: reviewerUser } = useContext(AuthContext);
  const router = useRouter();
  const [data, setData] = useState<ServiceRequestInterface | null>(null);

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
        toast.error("Servicio no encontrado...");
        router.push(routeToAllUsersAsAdmin());
      }
    });

    return () => unsubscribe();
  }, [COLLECTION_PATH, id, router]);

  useEffect(() => {
    if (!data?.sharing || !(data.sharing instanceof Timestamp)) {
      return;
    }

    if (
      reviewerUser &&
      checkPermission(reviewerUser.role, ROLES_TO_VIEW_USER_SERVICES)
    ) {
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
  }, [data?.sharing, reviewerUser, router]);

  const getServiceView = (
    service: ServiceRequestInterface,
    reviewerUser: UserInterface,
  ) => {
    switch (type) {
      case "driver":
        return (
          <DriverServicePerformed
            service={service}
            reviewerUser={reviewerUser}
          />
        );
      case "mechanical":
        return (
          <MechanicalServicePerformed
            service={service}
            reviewerUser={reviewerUser}
          />
        );
      case "tow":
        return (
          <ServiceForCraneOperatorPerformed
            service={service}
            reviewerUser={reviewerUser}
          />
        );
      case "laundry":
        return (
          <LaundryServicePerformed
            service={service}
            reviewerUser={reviewerUser}
          />
        );
    }
  };

  if (!data || checkingUserAuth) {
    return <PageLoading />;
  }

  return reviewerUser && getServiceView(data, reviewerUser);
};

export default ServicePerformedWithLoader;
