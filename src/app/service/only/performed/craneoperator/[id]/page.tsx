import ClientIdPage from "@/components/guards/ClientIdPage";
import ServicePerformedWithLoader from "@/components/app_modules/services_performed/view/control_panels/ServicePerformedWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardForServices from "@/components/guards/views/page_guards/concrets/GuardForServices";
import PageLoading from "@/components/loaders/PageLoading";
import { Suspense } from "react";

const Page = () => {
  return (
    <ClientIdPage>
      {(id) => (
    <Suspense fallback={<PageLoading />}>
      <GuardForServices serviceType="tow" serviceFakeId={id}>
        <ConsentForm moduleTarget="craneserviceonly" id={id}>
          <ServicePerformedWithLoader id={id} type="tow" />
        </ConsentForm>
      </GuardForServices>
    </Suspense>
      )}
    </ClientIdPage>
  );
};


export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
