"use client";

import { useRouteId } from "@/hooks/useRouteId";
import ServicePerformedWithLoader from "@/components/app_modules/services_performed/view/control_panels/ServicePerformedWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardForServices from "@/components/guards/views/page_guards/concrets/GuardForServices";
import PageLoading from "@/components/loaders/PageLoading";
import { Suspense } from "react";

const Page = () => {
  const id = useRouteId();
  return (
    <Suspense fallback={<PageLoading />}>
      <GuardForServices serviceType="driver" serviceFakeId={id}>
        <ConsentForm moduleTarget="driverserviceonly" id={id}>
          <ServicePerformedWithLoader id={id} type="driver" />
        </ConsentForm>
      </GuardForServices>
    </Suspense>
  );
};

export default Page;
