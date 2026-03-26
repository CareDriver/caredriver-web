"use client";

import { useParams } from "next/navigation";
import ServicePerformedWithLoader from "@/components/app_modules/services_performed/view/control_panels/ServicePerformedWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardForServices from "@/components/guards/views/page_guards/concrets/GuardForServices";
import PageLoading from "@/components/loaders/PageLoading";
import { Suspense } from "react";

const Page = () => {
  const { id } = useParams() as { id: string };
  return (
    <Suspense fallback={<PageLoading />}>
      <GuardForServices serviceType="mechanical" serviceFakeId={id}>
        <ConsentForm moduleTarget="mechanicserviceonly" id={id}>
          <ServicePerformedWithLoader id={id} type="mechanical" />
        </ConsentForm>
      </GuardForServices>
    </Suspense>
  );
};

export default Page;
