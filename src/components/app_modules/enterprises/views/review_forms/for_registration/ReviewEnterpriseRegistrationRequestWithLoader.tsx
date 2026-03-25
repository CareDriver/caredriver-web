"use client";

import { EnterpriseRequest } from "@/interfaces/Enterprise";
import { getEnterpriseRequestById } from "@/components/app_modules/enterprises/api/EnterpriseRequestRequester";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReviewEnterpriseRegistrationRequest from "./ReviewEnterpriseRegistrationRequest";
import PageLoading from "@/components/loaders/PageLoading";
import { ServiceType } from "@/interfaces/Services";
import { routeToEnterpriseRegistrationRequestsAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";

interface Props {
  reqId: string;
  type: ServiceType;
}

const ReviewEnterpriseRegistrationRequestWithLoader: React.FC<Props> = ({
  reqId,
  type,
}) => {
  const [request, setRequest] = useState<EnterpriseRequest | null>(null);
  const router = useRouter();

  useEffect(() => {
    getEnterpriseRequestById(reqId)
      .then((data) => {
        if (data) {
          setRequest(data);
        } else {
          router.push(routeToEnterpriseRegistrationRequestsAsAdmin(type));
          toast.error("Solicitud no encontrada");
        }
      })
      .catch(() => {
        router.push(routeToEnterpriseRegistrationRequestsAsAdmin(type));
        toast.error("Error al cargar la solicitud");
      });
  }, [reqId, router, type]);

  if (!request) {
    return <PageLoading />;
  }

  return <ReviewEnterpriseRegistrationRequest request={request} />;
};

export default ReviewEnterpriseRegistrationRequestWithLoader;
