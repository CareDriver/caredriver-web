import { TypeOfServicePerformed } from "@/components/app_modules/services_performed/model/models/TypeOfServicePerformed";
import ListOfServicesPerfByUser from "@/components/app_modules/services_performed/view/lists_of_cards/ListOfServicesPerfByUser";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardForServices from "@/components/guards/views/page_guards/concrets/GuardForServices";
import PageLoading from "@/components/loaders/PageLoading";
import { Suspense } from "react";

const Page = ({ params }: { params: any }) => {
  return (
    <Suspense fallback={<PageLoading />}>
      <GuardForServices serviceType="driver">
        <ConsentForm moduleTarget="userinfo" id={params.id}>
          <ListOfServicesPerfByUser
            userId={params.id}
            typeOfService="driver"
            typeOfPerf={TypeOfServicePerformed.Requested}
          />
        </ConsentForm>
      </GuardForServices>
    </Suspense>
  );
};

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
