import ServicePerformedWithLoader from "@/components/app_modules/services_performed/view/control_panels/ServicePerformedWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardForServices from "@/components/guards/views/page_guards/concrets/GuardForServices";
import PageLoading from "@/components/loaders/PageLoading";
import { Suspense } from "react";

const Page = ({ params }: { params: any }) => {
  return (
    <Suspense fallback={<PageLoading />}>
      <GuardForServices serviceType="mechanical" serviceFakeId={params.id}>
        <ConsentForm moduleTarget="mechanicserviceonly" id={params.id}>
          <ServicePerformedWithLoader id={params.id} type="mechanical" />
        </ConsentForm>
      </GuardForServices>
    </Suspense>
  );
};

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
